import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
    const nowMs = Date.now();
    const slotStartIso = `${booking.appointment_date}T${booking.slot_start}:00+05:30`;
    const slotEndIso = `${booking.appointment_date}T${booking.slot_end || booking.slot_start}:00+05:30`;

    const slotStartMs = new Date(slotStartIso).getTime();
    const slotEndMs = new Date(slotEndIso).getTime();
    const activationMs = slotStartMs - 10 * 60 * 1000; // 10 minutes prior to slot

    if (nowMs < activationMs) {
      return NextResponse.json(
        {
          success: false,
          code: 'LINK_NOT_YET_ACTIVE',
          message: 'Video call link activates 10 minutes before your slot time.',
          serverTime: new Date(nowMs).toISOString(),
          activatesAt: new Date(activationMs).toISOString(),
        },
        { status: 403 }
      );
    }

    if (nowMs > slotEndMs) {
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
    // Returning placeholder video link as per blueprint; listed in TODO.md
    return NextResponse.json({
      success: true,
      joinUrl: 'https://meet.google.com/lookup/vankal-dr-bohra',
      provider: 'google-meet-placeholder',
      serverTime: new Date(nowMs).toISOString(),
      expiresAt: new Date(slotEndMs).toISOString(),
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
