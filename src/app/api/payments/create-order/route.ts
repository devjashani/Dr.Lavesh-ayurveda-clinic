import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { razorpay, RAZORPAY_KEY_ID, isRazorpayLiveConfigured } from '@/lib/razorpay';
import { BOOKING_CONFIG } from '@/lib/config/booking';
import { CLINIC_SCHEDULE, getStandardDaySlots } from '@/lib/config/schedule';
import { isRateLimited } from '@/lib/utils/rateLimit';

const createOrderSchema = z.object({
  patientName: z.string().trim().min(2).max(60),
  patientWhatsapp: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/),
  patientEmail: z.string().trim().toLowerCase().email(),
  patientAge: z.coerce.number().int().min(1).max(120),
  patientGender: z.enum(['Female', 'Male', 'Other']),
  primaryComplaint: z.string().trim().min(10).max(600),
  reportFileIds: z.array(z.string().trim().max(500)).max(3).optional().default([]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotStart: z.string().regex(/^\d{2}:\d{2}$/),
  slotEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Per-IP Rate Limiting (5 requests per minute)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (isRateLimited(ip, 5, 60000)) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait a moment before trying again.',
        },
        { status: 429 }
      );
    }

    // 2. Input Validation with Zod
    const body = await request.json();
    const parseResult = createOrderSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_INPUT',
          message: 'Please verify all required patient and consultation fields.',
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 3. Server-side Schedule & Slot Verification (Strict IST)
    const [year, month, day] = data.date.split('-').map(Number);
    const dateUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const dayOfWeek = dateUtc.getUTCDay();

    // Check clinic day active & not blocked
    if (
      !CLINIC_SCHEDULE.activeDaysOfWeek.includes(dayOfWeek) ||
      CLINIC_SCHEDULE.blockedDates.includes(data.date)
    ) {
      return NextResponse.json(
        {
          success: false,
          code: 'DAY_CLOSED',
          message: 'The clinic is closed on the selected date.',
        },
        { status: 400 }
      );
    }

    // Check slot is in clinic windows
    const standardSlots = getStandardDaySlots();
    const matchedSlot = standardSlots.find((s) => s.start === data.slotStart);

    if (!matchedSlot) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_SLOT',
          message: 'The requested time slot is not within valid clinical hours.',
        },
        { status: 400 }
      );
    }

    // Time calculations in IST (Asia/Kolkata is UTC+05:30)
    const slotStartIso = `${data.date}T${data.slotStart}:00+05:30`;
    const slotStartMs = new Date(slotStartIso).getTime();
    const nowMs = Date.now();
    const minLeadMs = BOOKING_CONFIG.minLeadMinutes * 60 * 1000;

    if (slotStartMs <= nowMs) {
      return NextResponse.json(
        {
          success: false,
          code: 'SLOT_PAST',
          message: 'The selected appointment slot has already passed.',
        },
        { status: 400 }
      );
    }

    if (slotStartMs < nowMs + minLeadMs) {
      return NextResponse.json(
        {
          success: false,
          code: 'SLOT_TOO_SOON',
          message: `Consultations require at least ${BOOKING_CONFIG.minLeadMinutes} minutes advance notice.`,
        },
        { status: 400 }
      );
    }

    // 4. Concurrency Hold & DB Uniqueness Check
    const slotEnd = matchedSlot.end;
    const holdExpiresAt = new Date(nowMs + 10 * 60 * 1000).toISOString(); // 10-minute hold

    // A. Clean up stale expired holds on this slot
    try {
      await supabaseAdmin
        .from('bookings')
        .update({
          status: 'EXPIRED',
          updated_at: new Date().toISOString(),
        })
        .eq('doctor_id', BOOKING_CONFIG.doctorId)
        .eq('appointment_date', data.date)
        .eq('slot_start', data.slotStart)
        .eq('status', 'PENDING_PAYMENT')
        .lte('hold_expires_at', new Date().toISOString());
    } catch (cleanupErr) {
      // Non-fatal cleanup warning
      console.warn('Hold cleanup note in create-order:', cleanupErr);
    }

    // B. Check active collision (CONFIRMED or active PENDING_PAYMENT)
    const { data: existingActive } = await supabaseAdmin
      .from('bookings')
      .select('id, status, hold_expires_at')
      .eq('doctor_id', BOOKING_CONFIG.doctorId)
      .eq('appointment_date', data.date)
      .eq('slot_start', data.slotStart)
      .in('status', ['CONFIRMED', 'PENDING_PAYMENT']);

    const isSlotOccupied = existingActive?.some((b) => {
      if (b.status === 'CONFIRMED') return true;
      if (
        b.status === 'PENDING_PAYMENT' &&
        b.hold_expires_at &&
        new Date(b.hold_expires_at).getTime() > nowMs
      ) {
        return true;
      }
      return false;
    });

    if (isSlotOccupied) {
      return NextResponse.json(
        {
          success: false,
          code: 'SLOT_UNAVAILABLE',
          message: 'This time slot was just taken by another patient. Please choose another time slot.',
        },
        { status: 409 }
      );
    }

    // Normalized WhatsApp number (+91...)
    const normalizedPhone = data.patientWhatsapp.startsWith('+91')
      ? data.patientWhatsapp
      : `+91${data.patientWhatsapp}`;

    // C. Atomically Insert Booking (CONFIRMED immediately in test mode, PENDING_PAYMENT in live gateway)
    const isLiveGateway = isRazorpayLiveConfigured();
    const nowIso = new Date().toISOString();
    const initialStatus = isLiveGateway ? 'PENDING_PAYMENT' : 'CONFIRMED';

    const insertPayload: Record<string, any> = {
      patient_name: data.patientName,
      patient_whatsapp: normalizedPhone,
      patient_email: data.patientEmail,
      email_normalized: data.patientEmail.trim().toLowerCase(),
      patient_age: data.patientAge,
      patient_gender: data.patientGender,
      primary_complaint: data.primaryComplaint,
      report_file_ids: data.reportFileIds || [],
      service_id: BOOKING_CONFIG.service.id,
      doctor_id: BOOKING_CONFIG.doctorId,
      doctor_name: BOOKING_CONFIG.doctorName,
      consultation_mode: 'online',
      appointment_date: data.date,
      slot_start: data.slotStart,
      slot_end: slotEnd,
      status: initialStatus,
      hold_expires_at: holdExpiresAt,
      paid_at: isLiveGateway ? null : nowIso,
      fee_amount: BOOKING_CONFIG.service.feePaise, // 49900 paise strictly from server
    };

    let { data: newBooking, error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert(insertPayload)
      .select('id')
      .single();

    // Resilient fallback if email_normalized column does not exist yet in DB
    if (
      insertError &&
      (insertError.code === 'PGRST204' ||
        insertError.code === '42703' ||
        insertError.message?.includes('email_normalized'))
    ) {
      delete insertPayload.email_normalized;
      const retryResult = await supabaseAdmin
        .from('bookings')
        .insert(insertPayload)
        .select('id')
        .single();
      newBooking = retryResult.data;
      insertError = retryResult.error;
    }

    if (insertError || !newBooking) {
      // Postgres unique constraint conflict (error 23505)
      if (insertError?.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            code: 'SLOT_UNAVAILABLE',
            message: 'This time slot was just taken by another patient. Please choose another time slot.',
          },
          { status: 409 }
        );
      }
      throw new Error(insertError?.message || 'Failed creating pending appointment hold');
    }

    const bookingId = newBooking.id;
    const amount = BOOKING_CONFIG.service.feePaise; // 49900 paise = ₹499 strictly server-side
    const receipt = bookingId.replace(/-/g, '').slice(0, 40);

    // 5. Create Razorpay Order (or Mock Order in test mode)
    let orderId: string;

    if (isLiveGateway) {
      const razorpayOrder = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt,
        notes: {
          bookingId,
          serviceId: BOOKING_CONFIG.service.id,
          doctorId: BOOKING_CONFIG.doctorId,
        },
      });
      orderId = razorpayOrder.id;
    } else {
      orderId = `order_test_${Date.now()}`;
      console.log(`[Payment Test Mode] Instant test order generated: ${orderId} for booking: ${bookingId}`);
    }

    // 6. Save razorpay_order_id to the booking
    await supabaseAdmin
      .from('bookings')
      .update({
        razorpay_order_id: orderId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    // 7. Return payload to client
    return NextResponse.json({
      success: true,
      bookingId,
      orderId,
      amount,
      currency: 'INR',
      keyId: isLiveGateway ? RAZORPAY_KEY_ID : 'rzp_test_mock',
      isTestMode: !isLiveGateway,
    });
  } catch (error) {
    // Generic error logging: NEVER log health data or secrets
    console.error('Error in create-order endpoint:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'ORDER_CREATION_FAILED',
        message: 'Could not initialize consultation payment. Please try again.',
      },
      { status: 500 }
    );
  }
}
