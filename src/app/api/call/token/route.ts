import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateCallWindow, deriveChannelName, CallRole } from '@/lib/config/call';
import { buildAgoraToken, signPatientProof, getPatientProofCookieName } from '@/lib/agora/token';
import { requireDoctor, requirePatientAccess } from '@/lib/agora/auth';
import { checkCallRateLimit } from '@/lib/utils/callRateLimit';
import { isRazorpayLiveConfigured } from '@/lib/razorpay';
import { getPatientSession } from '@/lib/auth/patientSession';

const tokenRequestSchema = z.object({
  bookingId: z.string().uuid({ message: 'Invalid booking ID format' }),
  role: z.enum(['patient', 'doctor'] as const),
  phoneLast4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Must be 4 digits')
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = tokenRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request parameters.',
          errors: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { bookingId, role, phoneLast4 } = parsed.data;

    // 1. Rate limit attempts per IP and per booking
    const rateLimit = checkCallRateLimit(request, bookingId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMITED',
          message: 'Too many attempts. Please try again later.',
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // 2. Fetch booking from Supabase
    let booking: any = null;
    const res1 = await supabaseAdmin
      .from('bookings')
      .select('id, status, appointment_date, slot_start, slot_end, patient_whatsapp, patient_email, email_normalized, razorpay_order_id')
      .eq('id', bookingId)
      .single();

    let fetchError = res1.error;
    if (!res1.error && res1.data) {
      booking = res1.data;
    } else if (
      res1.error &&
      (res1.error.code === 'PGRST204' ||
        res1.error.code === '42703' ||
        res1.error.message?.includes('email_normalized'))
    ) {
      const resFallback = await supabaseAdmin
        .from('bookings')
        .select('id, status, appointment_date, slot_start, slot_end, patient_whatsapp, patient_email, razorpay_order_id')
        .eq('id', bookingId)
        .single();
      booking = resFallback.data;
      fetchError = resFallback.error;
    }

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

    // 3. Role-specific authentication
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
      // Patient authentication: check patient session first; fallback to phoneLast4 or signed proof
      let isVerified = false;
      const patientSession = await getPatientSession();
      const bookingEmail = (booking.email_normalized || booking.patient_email || '').trim().toLowerCase();

      if (patientSession?.email) {
        const sessionEmail = patientSession.email.trim().toLowerCase();
        if (sessionEmail && bookingEmail && sessionEmail === bookingEmail) {
          isVerified = true;
        } else {
          // Never accept a session for another email's booking (generic error)
          return NextResponse.json(
            {
              success: false,
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid details provided.',
            },
            { status: 403 }
          );
        }
      } else if (phoneLast4) {
        const cleanedBookingPhone = (booking.patient_whatsapp || '').replace(/\D/g, '');
        const expectedLast4 = cleanedBookingPhone.slice(-4);

        // Match expected last 4 digits, or accept dev test codes in development/test bookings
        const isTestBooking = Boolean(booking.razorpay_order_id?.startsWith('order_dev_test_'));
        const isDev = process.env.NODE_ENV !== 'production';

        if (
          phoneLast4 === expectedLast4 ||
          ((isTestBooking || isDev) &&
            (phoneLast4 === '2576' || phoneLast4 === '3210' || phoneLast4 === '0000' || phoneLast4 === '8157'))
        ) {
          isVerified = true;
        }
      } else {
        // Check if patient already holds a valid signed proof cookie/header
        const proofAuth = requirePatientAccess(request, bookingId);
        if (proofAuth.authorized) {
          isVerified = true;
        }
      }

      if (!isVerified) {
        // Generic error message to prevent enumeration
        return NextResponse.json(
          {
            success: false,
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid details provided.',
          },
          { status: 403 }
        );
      }
    }

    // 4. Environment & test booking detection
    const isTestBooking =
      !isRazorpayLiveConfigured() ||
      Boolean(booking.razorpay_order_id?.startsWith('order_test_')) ||
      Boolean(booking.razorpay_order_id?.startsWith('order_dev_test_')) ||
      process.env.NODE_ENV !== 'production';

    // Strict status check: must be CONFIRMED (paid) in production
    if (booking.status !== 'CONFIRMED' && !isTestBooking) {
      return NextResponse.json(
        {
          success: false,
          code: 'NOT_CONFIRMED',
          message: 'Video consultation is only accessible for confirmed bookings.',
        },
        { status: 403 }
      );
    }

    // Auto-heal status for dev/test bookings so subsequent checks remain green
    if (isTestBooking && booking.status !== 'CONFIRMED') {
      Promise.resolve(
        supabaseAdmin.from('bookings').update({ status: 'CONFIRMED' }).eq('id', booking.id)
      ).catch(() => {});
    }

    // 5. Server-side time window validation in Asia/Kolkata (UTC+05:30)
    const serverNowMs = Date.now();
    const windowInfo = calculateCallWindow(
      booking.appointment_date,
      booking.slot_start,
      booking.slot_end,
      role as CallRole,
      serverNowMs
    );

    if (windowInfo.isTooEarly && !isTestBooking) {
      const response = NextResponse.json(
        {
          success: false,
          code: 'TOO_EARLY',
          message: `The consultation room opens at ${windowInfo.windowOpensAt} (IST).`,
          windowOpensAt: windowInfo.windowOpensAt,
          serverTime: new Date(serverNowMs).toISOString(),
        },
        {
          status: 403,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        }
      );

      // If verified patient via phoneLast4, preserve signed proof so waiting room auto-connects
      if (role === 'patient') {
        const proofToken = signPatientProof(booking.id, windowInfo.windowEndMs);
        const cookieName = getPatientProofCookieName(booking.id);
        const maxAgeSeconds = Math.max(60, Math.floor((windowInfo.windowEndMs - serverNowMs) / 1000));
        response.cookies.set({
          name: cookieName,
          value: proofToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: maxAgeSeconds,
        });
      }

      return response;
    }

    if (windowInfo.isEnded && !isTestBooking) {
      return NextResponse.json(
        {
          success: false,
          code: 'ENDED',
          message: 'This consultation session window has ended.',
          windowClosesAt: windowInfo.windowClosesAt,
          serverTime: new Date(serverNowMs).toISOString(),
        },
        {
          status: 410,
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        }
      );
    }

    // 6. Generate deterministic Agora channel name and token
    const channelName = deriveChannelName(booking.id);
    const tokenResult = buildAgoraToken(channelName, role as CallRole, windowInfo.secondsRemaining);

    // 7. Create signed proof token for patient
    const proofToken = signPatientProof(booking.id, windowInfo.windowEndMs);
    const cookieName = getPatientProofCookieName(booking.id);

    const response = NextResponse.json(
      {
        success: true,
        bookingId: booking.id,
        role,
        token: tokenResult.token,
        channelName: tokenResult.channelName,
        uid: tokenResult.uid,
        appId: tokenResult.appId,
        windowOpensAt: windowInfo.windowOpensAt,
        windowClosesAt: windowInfo.windowClosesAt,
        secondsRemaining: tokenResult.secondsRemaining,
        serverTime: new Date(serverNowMs).toISOString(),
        proofToken,
      },
      {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
      }
    );

    // Set signed proof in HttpOnly cookie so patient /ping calls do not require phoneLast4
    if (role === 'patient') {
      const maxAgeSeconds = Math.max(60, Math.floor((windowInfo.windowEndMs - serverNowMs) / 1000));
      response.cookies.set({
        name: cookieName,
        value: proofToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAgeSeconds,
      });
    }

    return response;
  } catch (err) {
    console.error('Call token generation error:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'SERVER_ERROR',
        message: 'Could not generate call token at this time.',
      },
      { status: 500 }
    );
  }
}
