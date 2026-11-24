import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateCallWindow } from '@/lib/config/call';
import { isRazorpayLiveConfigured } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

const RECENT_PING_THRESHOLD_MS = 45 * 1000;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookingId = searchParams.get('bookingId') || searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          code: 'MISSING_PARAM',
          message: 'Query parameter bookingId or id is required.',
        },
        { status: 400 }
      );
    }

    const uuidSchema = z.string().uuid();
    if (!uuidSchema.safeParse(bookingId).success) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_ID',
          message: 'Booking ID must be a valid UUID.',
        },
        { status: 400 }
      );
    }

    // Try full select first, then fallback to base select if columns are missing
    const fullSelect =
      'id, status, appointment_date, slot_start, slot_end, patient_joined_at, doctor_joined_at, last_doctor_ping_at, last_patient_ping_at, call_started_at, call_ended_at';
    const baseSelect =
      'id, status, appointment_date, slot_start, slot_end';

    let booking: any = null;
    const res1 = await supabaseAdmin
      .from('bookings')
      .select(fullSelect)
      .eq('id', bookingId)
      .single();

    if (!res1.error && res1.data) {
      booking = res1.data;
    } else {
      const res2 = await supabaseAdmin
        .from('bookings')
        .select(baseSelect)
        .eq('id', bookingId)
        .single();
      if (!res2.error && res2.data) {
        booking = res2.data;
      }
    }

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          code: 'NOT_FOUND',
          message: 'Appointment not found.',
        },
        { status: 404 }
      );
    }

    const isTestBooking =
      !isRazorpayLiveConfigured() ||
      Boolean(booking.razorpay_order_id?.startsWith('order_test_')) ||
      Boolean(booking.razorpay_order_id?.startsWith('order_dev_test_')) ||
      Boolean(booking.razorpay_payment_id?.startsWith('pay_test_')) ||
      process.env.NODE_ENV !== 'production';

    const nowMs = Date.now();
    const windowInfo = calculateCallWindow(
      booking.appointment_date,
      booking.slot_start,
      booking.slot_end,
      'patient',
      nowMs
    );

    const isTooEarly = isTestBooking ? false : windowInfo.isTooEarly;
    const isInWindow = isTestBooking ? true : windowInfo.isInWindow;
    const isEnded = isTestBooking ? false : windowInfo.isEnded;

    const lastDoctorPingMs = booking.last_doctor_ping_at
      ? new Date(booking.last_doctor_ping_at).getTime()
      : 0;
    const isDoctorConnected = nowMs - lastDoctorPingMs < RECENT_PING_THRESHOLD_MS;

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      serverNow: new Date(nowMs).toISOString(),
      windowOpensAt: windowInfo.windowOpensAt,
      windowEnd: windowInfo.windowClosesAt,
      patientWaiting: !!booking.patient_joined_at,
      doctorConnected: isDoctorConnected,
      status: booking.status,
      isTooEarly,
      isInWindow,
      isEnded,
      secondsRemaining: isTestBooking ? 3600 : windowInfo.secondsRemaining,
      callStartedAt: booking.call_started_at || null,
      callEndedAt: booking.call_ended_at || null,
    });
  } catch (err) {
    console.error('Call status handler error:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'SERVER_ERROR',
        message: 'Could not fetch call status.',
      },
      { status: 500 }
    );
  }
}
