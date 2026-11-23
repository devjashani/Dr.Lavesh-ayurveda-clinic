import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireDoctor } from '@/lib/agora/auth';
import { BOOKING_CONFIG } from '@/lib/config/booking';

export async function POST(request: NextRequest) {
  try {
    // 1. Authorize: Doctor session or dev bypass
    const doctorAuth = await requireDoctor(request);
    const isDev = process.env.NODE_ENV !== 'production';

    if (!doctorAuth.authorized && !isDev) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Doctor session required' },
        { status: 401 }
      );
    }

    // 2. Compute current IST date and slot covering NOW
    const now = new Date();
    const istDateFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
    });
    const todayDate = istDateFormatter.format(now); // YYYY-MM-DD

    const istTimeFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const [currHStr, currMStr] = istTimeFormatter.format(now).split(':');
    const currH = parseInt(currHStr, 10);
    const currM = parseInt(currMStr, 10);

    // Slot starts 5 minutes ago and ends 25 minutes from now so call window is active immediately
    const startTotalM = Math.max(0, currH * 60 + currM - 5);
    const endTotalM = Math.min(23 * 60 + 59, currH * 60 + currM + 25);

    const slotStartH = Math.floor(startTotalM / 60);
    const slotStartM = startTotalM % 60;
    const slotEndH = Math.floor(endTotalM / 60);
    const slotEndM = endTotalM % 60;

    let slotStart = `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`;
    const slotEnd = `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`;

    // Clean up any existing test booking on this slot to avoid uq_active_doctor_slot conflict
    const { data: existing } = await supabaseAdmin
      .from('bookings')
      .select('id, razorpay_order_id')
      .eq('doctor_id', BOOKING_CONFIG.doctorId)
      .eq('appointment_date', todayDate)
      .eq('slot_start', slotStart)
      .in('status', ['CONFIRMED', 'PENDING_PAYMENT'])
      .maybeSingle();

    if (existing) {
      if (existing.razorpay_order_id?.startsWith('order_dev_test_')) {
        await supabaseAdmin.from('bookings').delete().eq('id', existing.id);
      } else {
        const altM = (currM + 1) % 60;
        slotStart = `${String(currH).padStart(2, '0')}:${String(altM).padStart(2, '0')}`;
      }
    }

    // 3. Insert Confirmed Test Booking into Supabase with valid consultation_mode = 'online'
    const testPhone = '9016432576'; // Last 4 digits: 2576
    const nowIso = now.toISOString();

    const { data: booking, error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert({
        patient_name: 'Dev Jashani (Live Video Test)',
        patient_whatsapp: testPhone,
        patient_email: 'test@vankalayurveda.com',
        patient_age: 26,
        patient_gender: 'Male',
        primary_complaint: 'Testing live Agora video consultation between Doctor Console and Patient room.',
        report_file_ids: [],
        service_id: BOOKING_CONFIG.service.id,
        doctor_id: BOOKING_CONFIG.doctorId,
        doctor_name: BOOKING_CONFIG.doctorName,
        consultation_mode: 'online', // Must be 'online' per bookings_consultation_mode_check
        appointment_date: todayDate,
        slot_start: slotStart,
        slot_end: slotEnd,
        status: 'CONFIRMED',
        fee_amount: 49900,
        razorpay_order_id: `order_dev_test_${Date.now()}`,
        razorpay_payment_id: `pay_dev_test_${Date.now()}`,
        paid_at: nowIso,
      })
      .select('id, appointment_date, slot_start, slot_end, patient_name, patient_whatsapp')
      .single();

    if (insertError || !booking) {
      console.error('Error creating test booking:', insertError);
      return NextResponse.json(
        {
          success: false,
          code: 'DB_ERROR',
          message: insertError?.message || 'Could not insert test booking into database.',
        },
        { status: 500 }
      );
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const consultUrl = `${protocol}://${host}/consult/${booking.id}`;

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      patientName: booking.patient_name,
      phoneLast4: testPhone.slice(-4),
      appointmentDate: booking.appointment_date,
      slotStart: booking.slot_start,
      slotEnd: booking.slot_end,
      consultUrl,
      message: 'Instant test booking created successfully! The call window is active right now.',
    });
  } catch (err) {
    console.error('Create test booking handler error:', err);
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Failed to create test appointment.' },
      { status: 500 }
    );
  }
}
