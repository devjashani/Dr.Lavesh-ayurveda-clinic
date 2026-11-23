import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateCallWindow, CallRole } from '@/lib/config/call';
import { requireDoctor, requirePatientAccess } from '@/lib/agora/auth';

const pingRequestSchema = z.object({
  bookingId: z.string().uuid({ message: 'Invalid booking ID format' }),
  role: z.enum(['patient', 'doctor'] as const),
});

// Participant is considered active if pinged within the last 45 seconds
const RECENT_PING_THRESHOLD_MS = 45 * 1000;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = pingRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Invalid ping parameters.',
          errors: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { bookingId, role } = parsed.data;

    // 1. Verify authorization
    if (role === 'doctor') {
      const doctorAuth = await requireDoctor(request);
      if (!doctorAuth.authorized) {
        return NextResponse.json(
          {
            success: false,
            code: 'UNAUTHORIZED',
            message: doctorAuth.error || 'Doctor authorization required.',
          },
          { status: 401 }
        );
      }
    } else {
      const patientAuth = requirePatientAccess(request, bookingId);
      if (!patientAuth.authorized) {
        return NextResponse.json(
          {
            success: false,
            code: 'UNAUTHORIZED',
            message: patientAuth.error || 'Patient authorization required.',
          },
          { status: 401 }
        );
      }
    }

    // 2. Fetch booking record
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select(
        'id, status, appointment_date, slot_start, slot_end, patient_joined_at, doctor_joined_at, call_started_at, call_ended_at, last_patient_ping_at, last_doctor_ping_at'
      )
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

    // If call was already ended or completed
    if (booking.status === 'COMPLETED' || booking.call_ended_at) {
      return NextResponse.json({
        success: true,
        bookingId: booking.id,
        callEnded: true,
        status: booking.status,
        message: 'Consultation call has concluded.',
      });
    }

    if (booking.status !== 'CONFIRMED') {
      return NextResponse.json(
        {
          success: false,
          code: 'NOT_CONFIRMED',
          message: 'Video call is only available for confirmed appointments.',
        },
        { status: 403 }
      );
    }

    // 3. Time window check
    const nowMs = Date.now();
    const windowInfo = calculateCallWindow(
      booking.appointment_date,
      booking.slot_start,
      booking.slot_end,
      role as CallRole,
      nowMs
    );

    if (windowInfo.isEnded) {
      return NextResponse.json(
        {
          success: false,
          code: 'ENDED',
          message: 'Consultation window has expired.',
        },
        { status: 410 }
      );
    }

    // 4. Update timestamps
    const nowIso = new Date(nowMs).toISOString();
    const updates: Record<string, unknown> = {
      updated_at: nowIso,
    };

    if (role === 'patient') {
      updates.last_patient_ping_at = nowIso;
      if (!booking.patient_joined_at) {
        updates.patient_joined_at = nowIso;
      }
    } else {
      updates.last_doctor_ping_at = nowIso;
      if (!booking.doctor_joined_at) {
        updates.doctor_joined_at = nowIso;
      }
    }

    // Check if both have joined
    const patientJoined = booking.patient_joined_at || (role === 'patient');
    const doctorJoined = booking.doctor_joined_at || (role === 'doctor');
    let callStartedAt = booking.call_started_at;

    if (patientJoined && doctorJoined && !booking.call_started_at) {
      updates.call_started_at = nowIso;
      callStartedAt = nowIso;
    }

    // Persist updates to Supabase (graceful fallback if schema migration is pending)
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update(updates)
      .eq('id', bookingId);

    if (updateError) {
      console.warn('Note: Booking ping update warning (schema migration pending):', updateError.message);
    }

    // 5. Evaluate connection states
    const lastPatientPingMs = booking.last_patient_ping_at
      ? new Date(booking.last_patient_ping_at).getTime()
      : 0;
    const lastDoctorPingMs = booking.last_doctor_ping_at
      ? new Date(booking.last_doctor_ping_at).getTime()
      : 0;

    const isPatientConnected =
      role === 'patient' || nowMs - lastPatientPingMs < RECENT_PING_THRESHOLD_MS;
    const isDoctorConnected =
      role === 'doctor' || nowMs - lastDoctorPingMs < RECENT_PING_THRESHOLD_MS;

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      role,
      callStarted: !!callStartedAt,
      callStartedAt,
      patientWaiting: !!(booking.patient_joined_at || updates.patient_joined_at),
      doctorConnected: isDoctorConnected,
      patientConnected: isPatientConnected,
      serverTime: nowIso,
    });
  } catch (err) {
    console.error('Ping handler error:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'SERVER_ERROR',
        message: 'Could not process call ping.',
      },
      { status: 500 }
    );
  }
}
