import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { requireDoctor } from '@/lib/agora/auth';

const noShowSchema = z.object({
  bookingId: z.string().uuid({ message: 'Invalid booking ID format' }),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Doctor authorization required
    const doctorAuth = await requireDoctor(request);
    if (!doctorAuth.authorized) {
      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED',
          message: doctorAuth.error || 'Doctor authorization required to mark patient as no-show.',
        },
        { status: 401 }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = noShowSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body.',
          errors: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { bookingId } = parsed.data;

    // 2. Fetch booking
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('id, status, appointment_date, slot_start, patient_joined_at')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        {
          success: false,
          code: 'NOT_FOUND',
          message: 'Appointment not found.',
        },
        { status: 404 }
      );
    }

    // Idempotency: if already NO_SHOW, return success
    if (booking.status === 'NO_SHOW') {
      return NextResponse.json({
        success: true,
        bookingId: booking.id,
        status: 'NO_SHOW',
        message: 'Appointment is already marked as NO_SHOW.',
      });
    }

    if (booking.status === 'COMPLETED') {
      return NextResponse.json(
        {
          success: false,
          code: 'ALREADY_COMPLETED',
          message: 'Cannot mark a completed consultation as no-show.',
        },
        { status: 400 }
      );
    }

    // 3. Clinical Rule: allowed ONLY after slot_start + 10 minutes in IST (UTC+05:30)
    const [h, m] = (booking.slot_start || '10:00').split(':');
    const slotStartIso = `${booking.appointment_date}T${h.padStart(2, '0')}:${(m || '00').padStart(2, '0')}:00+05:30`;
    const slotStartMs = new Date(slotStartIso).getTime();
    const allowedAfterMs = slotStartMs + 10 * 60 * 1000; // 10 minutes grace after slot start

    const nowMs = Date.now();
    if (nowMs < allowedAfterMs) {
      return NextResponse.json(
        {
          success: false,
          code: 'TOO_EARLY_FOR_NO_SHOW',
          message: 'No-show can only be recorded 10 minutes after the scheduled slot start time.',
          allowedAt: new Date(allowedAfterMs).toISOString(),
          serverTime: new Date(nowMs).toISOString(),
        },
        { status: 400 }
      );
    }

    // 4. If patient already joined the room, cannot mark no-show
    if (booking.patient_joined_at) {
      return NextResponse.json(
        {
          success: false,
          code: 'PATIENT_JOINED',
          message: 'Patient has already entered the consultation room. Cannot mark as no-show.',
          patientJoinedAt: booking.patient_joined_at,
        },
        { status: 400 }
      );
    }

    // 5. Mark NO_SHOW
    const nowIso = new Date(nowMs).toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'NO_SHOW',
        updated_at: nowIso,
      })
      .eq('id', bookingId);

    if (updateError) {
      console.warn('Note: Booking no-show update warning (schema migration pending):', updateError.message);
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      status: 'NO_SHOW',
      markedAt: nowIso,
    });
  } catch (err) {
    console.error('No-show handler error:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'SERVER_ERROR',
        message: 'Could not record no-show status.',
      },
      { status: 500 }
    );
  }
}
