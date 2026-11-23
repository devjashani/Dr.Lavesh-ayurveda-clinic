import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateCallWindow } from '@/lib/config/call';
import { isRazorpayLiveConfigured } from '@/lib/razorpay';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, code: 'INVALID_ID', message: 'Invalid appointment ID' },
        { status: 400 }
      );
    }

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select('id, status, appointment_date, slot_start, slot_end')
      .eq('id', id)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Appointment not found' },
        { status: 404 }
      );
    }

    if (booking.status !== 'CONFIRMED') {
      return NextResponse.json(
        {
          success: false,
          code: 'BOOKING_NOT_CONFIRMED',
          message: 'Video consultation link is only accessible for confirmed bookings.',
        },
        { status: 403 }
      );
    }

    // Verify time window against server time in IST (UTC+05:30)
    const isTestBooking =
      !isRazorpayLiveConfigured() ||
      process.env.NODE_ENV !== 'production';

    const nowMs = Date.now();
    const windowInfo = calculateCallWindow(
      booking.appointment_date,
      booking.slot_start,
      booking.slot_end,
      'patient',
      nowMs
    );

    if (windowInfo.isTooEarly && !isTestBooking) {
      return NextResponse.json(
        {
          success: false,
          code: 'LINK_NOT_YET_ACTIVE',
          message: 'Video call link activates 10 minutes before your slot time.',
          serverTime: new Date(nowMs).toISOString(),
          activatesAt: windowInfo.windowOpensAt,
        },
        { status: 403 }
      );
    }

    if (windowInfo.isEnded) {
      return NextResponse.json(
        {
          success: false,
          code: 'SLOT_EXPIRED',
          message: 'This consultation slot has concluded.',
          serverTime: new Date(nowMs).toISOString(),
        },
        { status: 410 }
      );
    }

    // Active consultation window!
    // Direct link to the internal Agora consultation room
    return NextResponse.json({
      success: true,
      joinUrl: `/consult/${booking.id}`,
      provider: 'agora-rtc',
      serverTime: new Date(nowMs).toISOString(),
      expiresAt: windowInfo.windowClosesAt,
      message: 'Consultation room is active.',
    });
  } catch (err) {
    console.error('Error fetching video link:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Could not generate consultation link' },
      { status: 500 }
    );
  }
}
