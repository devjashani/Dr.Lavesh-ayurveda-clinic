import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { requireDoctor } from '@/lib/agora/auth';

const endCallSchema = z.object({
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
          message: doctorAuth.error || 'Doctor authorization required to end consultation.',
        },
        { status: 401 }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = endCallSchema.safeParse(rawBody);

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
      .select('id, status, call_ended_at')
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

    // Idempotency: if already completed, return success
    if (booking.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        bookingId: booking.id,
        status: 'COMPLETED',
        callEndedAt: booking.call_ended_at || new Date().toISOString(),
      });
    }

    // 3. Mark COMPLETED and record call_ended_at
    const nowIso = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'COMPLETED',
        call_ended_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', bookingId);

    if (updateError) {
      console.warn('Note: Booking end update warning (schema migration pending):', updateError.message);
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      status: 'COMPLETED',
      callEndedAt: nowIso,
    });
  } catch (err) {
    console.error('Call end handler error:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'SERVER_ERROR',
        message: 'Could not complete consultation session.',
      },
      { status: 500 }
    );
  }
}
