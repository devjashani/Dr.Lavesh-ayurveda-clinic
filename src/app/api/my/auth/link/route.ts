import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import {
  validateOrigin,
  hashWithHmac,
  createPatientSessionToken,
  setPatientSessionCookie,
} from '@/lib/auth/patientSession';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

const linkSchema = z.object({
  token: z.string().trim().min(10, 'Invalid token format'),
});

const GENERIC_ERROR = 'Invalid or expired sign-in link.';

export async function POST(request: NextRequest) {
  try {
    // 1. Origin Header CSRF Verification
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    // 2. Validate token parameter
    const body = await request.json().catch(() => ({}));
    const parseResult = linkSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const { token } = parseResult.data;
    const link_token_hash = hashWithHmac(token);
    const nowIso = new Date().toISOString();

    // 3. Look up unconsumed, unexpired challenge matching token hash
    const { data: challenge, error: fetchErr } = await supabaseAdmin
      .from('auth_challenges')
      .select('*')
      .eq('link_token_hash', link_token_hash)
      .is('consumed_at', null)
      .gt('expires_at', nowIso)
      .single();

    if (fetchErr || !challenge) {
      return NextResponse.json(
        { error: GENERIC_ERROR },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // 4. Mark challenge consumed (single use: kills token and code)
    await supabaseAdmin
      .from('auth_challenges')
      .update({ consumed_at: nowIso })
      .eq('id', challenge.id);

    // 5. Create 14-day signed patient session cookie (jose JWT)
    const sessionJwt = await createPatientSessionToken(
      challenge.email_normalized
    );
    const response = NextResponse.json(
      {
        success: true,
        email: challenge.email_normalized,
      },
      { headers: NO_CACHE_HEADERS }
    );
    setPatientSessionCookie(response, sessionJwt);

    return response;
  } catch (err) {
    console.error('[Auth Link Route Error]', err);
    return NextResponse.json(
      { error: GENERIC_ERROR },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }
}
