import { NextRequest, NextResponse, after } from 'next/server';
import * as z from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import {
  validateOrigin,
  hashIp,
  hashWithHmac,
  generate6DigitCode,
  generateLinkToken,
} from '@/lib/auth/patientSession';
import { sendEmail, generateSignInEmail } from '@/lib/email/send';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const GENERIC_RESPONSE = {
  success: true,
  message:
    'If an eligible booking exists for this email, a sign-in code has been sent.',
};

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV !== 'production';

    // 1. Origin Header CSRF Verification
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    // 2. Production Service Availability Check (503 only in production when key is missing)
    if (!isDev && !process.env.RESEND_API_KEY?.trim()) {
      return NextResponse.json(
        {
          code: 'EMAIL_UNAVAILABLE',
          message: 'Email sign-in is not available yet',
        },
        { status: 503, headers: NO_CACHE_HEADERS }
      );
    }

    // 3. Request Validation
    const body = await request.json().catch(() => ({}));
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const { email } = parseResult.data;

    // 4. Rate Limiting via auth_challenges table (enforced strictly in production)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const ip_hash = hashIp(clientIp);

    const nowIso = new Date().toISOString();
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    if (!isDev) {
      // Check rate limit: max 10 per IP per hour
      const { count: ipCount } = await supabaseAdmin
        .from('auth_challenges')
        .select('*', { count: 'exact', head: true })
        .eq('ip_hash', ip_hash)
        .gt('created_at', oneHourAgo);

      if (typeof ipCount === 'number' && ipCount >= 10) {
        return NextResponse.json(GENERIC_RESPONSE, {
          status: 200,
          headers: NO_CACHE_HEADERS,
        });
      }

      // Check rate limit: max 3 per email per 15 minutes
      const { count: emailCount } = await supabaseAdmin
        .from('auth_challenges')
        .select('*', { count: 'exact', head: true })
        .eq('email_normalized', email)
        .gt('created_at', fifteenMinAgo);

      if (typeof emailCount === 'number' && emailCount >= 3) {
        return NextResponse.json(GENERIC_RESPONSE, {
          status: 200,
          headers: NO_CACHE_HEADERS,
        });
      }
    }

    // 5. Check if email has at least one booking with CONFIRMED, COMPLETED or NO_SHOW
    let { data: eligibleBookings, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .or(`email_normalized.eq.${email},patient_email.eq.${email}`)
      .in('status', ['CONFIRMED', 'COMPLETED', 'NO_SHOW'])
      .limit(1);

    if (
      bookingErr &&
      (bookingErr.code === 'PGRST204' ||
        bookingErr.code === '42703' ||
        bookingErr.message?.includes('email_normalized'))
    ) {
      const retryRes = await supabaseAdmin
        .from('bookings')
        .select('id')
        .eq('patient_email', email)
        .in('status', ['CONFIRMED', 'COMPLETED', 'NO_SHOW'])
        .limit(1);
      eligibleBookings = retryRes.data;
      bookingErr = retryRes.error;
    }

    const hasEligibleBooking = Boolean(
      !bookingErr && eligibleBookings && eligibleBookings.length > 0
    );

    // In production: return generic 200 without creating challenge or sending email if no booking exists
    if (!isDev && !hasEligibleBooking) {
      await new Promise((res) => setTimeout(res, 60 + Math.random() * 40));
      return NextResponse.json(GENERIC_RESPONSE, {
        status: 200,
        headers: NO_CACHE_HEADERS,
      });
    }

    if (isDev && !hasEligibleBooking) {
      console.log(
        `[Dev Notice] Email "${email}" has no confirmed booking in DB yet. Creating dev challenge so you can test sign-in.`
      );
    }

    // 6. Challenge Generation & Database Storage
    // Invalidate older unconsumed challenges for this email
    await supabaseAdmin
      .from('auth_challenges')
      .update({ consumed_at: nowIso })
      .eq('email_normalized', email)
      .is('consumed_at', null);

    // Minimal cleanup of challenges older than 1 day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin
      .from('auth_challenges')
      .delete()
      .lt('created_at', oneDayAgo);

    // Generate cryptographically random code and link token
    const code = generate6DigitCode();
    const linkToken = generateLinkToken();
    const code_hash = hashWithHmac(code);
    const link_token_hash = hashWithHmac(linkToken);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertErr } = await supabaseAdmin
      .from('auth_challenges')
      .insert({
        email_normalized: email,
        code_hash,
        link_token_hash,
        expires_at,
        attempts: 0,
        ip_hash,
      });

    if (insertErr) {
      console.error('[Auth Challenge Insert Error]', insertErr);
      if (!isDev) {
        return NextResponse.json(GENERIC_RESPONSE, {
          status: 200,
          headers: NO_CACHE_HEADERS,
        });
      }
    }

    // 7. Magic Link & Email Generation
    const rawSiteUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');
    const siteUrl = rawSiteUrl.startsWith('http')
      ? rawSiteUrl
      : `https://${rawSiteUrl}`;
    const verifyUrl = `${siteUrl}/my-bookings/verify?token=${encodeURIComponent(linkToken)}`;

    const emailContent = generateSignInEmail({ code, verifyUrl });

    // 8. Dispatch Email
    if (isDev) {
      // In development: execute immediately so terminal output appears right away
      try {
        await sendEmail({
          to: email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      } catch (sendErr) {
        console.error('[Auth Email Dev Error]', sendErr);
      }
    } else {
      // In production: send after response using after() from next/server
      after(async () => {
        try {
          await sendEmail({
            to: email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          });
        } catch (sendErr) {
          console.error('[Auth Email Background Error]', sendErr);
        }
      });
    }

    // 9. Generic Response Parity (never return code or token)
    return NextResponse.json(GENERIC_RESPONSE, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  } catch (err) {
    console.error('[Auth Request Route Error]', err);
    return NextResponse.json(GENERIC_RESPONSE, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  }
}
