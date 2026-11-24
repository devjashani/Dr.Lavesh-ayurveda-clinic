import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import {
  validateOrigin,
  verifyHmacHash,
  createPatientSessionToken,
  setPatientSessionCookie,
} from '@/lib/auth/patientSession';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

const verifySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().trim().regex(/^\d{6}$/, 'Code must be a 6-digit number'),
});

const GENERIC_ERROR = 'Invalid or expired verification code.';

export async function POST(request: NextRequest) {
  try {
    // 1. Origin Header CSRF Verification
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    // 2. Request Validation
    const body = await request.json().catch(() => ({}));
    const parseResult = verifySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const { email, code } = parseResult.data;
    const nowIso = new Date().toISOString();

    // 3. Find latest unconsumed, unexpired challenge for this email
    const { data: challenges, error: fetchErr } = await supabaseAdmin
      .from('auth_challenges')
      .select('*')
      .eq('email_normalized', email)
      .is('consumed_at', null)
      .gt('expires_at', nowIso)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchErr || !challenges || challenges.length === 0) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const challenge = challenges[0];
    const previousAttempts = challenge.attempts || 0;

    // Check if already reached max attempts
    if (previousAttempts >= 5) {
      // Ensure challenge is burned
      if (!challenge.consumed_at) {
        await supabaseAdmin
          .from('auth_challenges')
          .update({ consumed_at: nowIso })
          .eq('id', challenge.id);
      }
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const newAttempts = previousAttempts + 1;

    // 4. Verify HMAC SHA-256 Code with timingSafeEqual
    const isCodeValid = verifyHmacHash(code, challenge.code_hash);

    if (!isCodeValid) {
      // Increment attempts. If reached 5 wrong attempts, burn the challenge immediately
      const shouldBurn = newAttempts >= 5;
      await supabaseAdmin
        .from('auth_challenges')
        .update({
          attempts: newAttempts,
          ...(shouldBurn ? { consumed_at: nowIso } : {}),
        })
        .eq('id', challenge.id);

      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // 5. Code is valid: Mark consumed (kills OTP code and magic link token)
    await supabaseAdmin
      .from('auth_challenges')
      .update({
        attempts: newAttempts,
        consumed_at: nowIso,
      })
      .eq('id', challenge.id);

    // 6. Create 14-day signed patient session cookie (jose JWT)
    const token = await createPatientSessionToken(email);
    const response = NextResponse.json(
      { success: true, email },
      { headers: NO_CACHE_HEADERS }
    );
    setPatientSessionCookie(response, token);

    return response;
  } catch (err) {
    console.error('[Auth Verify Route Error]', err);
    return NextResponse.json(
      { error: GENERIC_ERROR },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }
}
