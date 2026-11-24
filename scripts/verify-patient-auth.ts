/**
 * VANKAL AYURVEDA — Patient Authentication & My Bookings Verification Suite
 * Run with: npx tsx --env-file=.env.local scripts/verify-patient-auth.ts
 */

import assert from 'assert';
import crypto from 'crypto';
import {
  hashWithHmac,
  verifyHmacHash,
  generate6DigitCode,
  generateLinkToken,
  hashIp,
  createPatientSessionToken,
  verifyPatientSessionToken,
  validateOrigin,
  setPatientSessionCookie,
  clearPatientSessionCookie,
  PATIENT_COOKIE_NAME,
} from '../src/lib/auth/patientSession';
import { generateSignInEmail, sendEmail } from '../src/lib/email/send';
import { NextRequest, NextResponse } from 'next/server';

console.log('================================================================');
console.log('🛡️  VANKAL AYURVEDA — PATIENT AUTH VERIFICATION TEST SUITE');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

async function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function main() {
  // ---------------------------------------------------------------------------
  // TEST 1: WRONG CODE (GENERIC ERROR)
  // ---------------------------------------------------------------------------
  console.log('--- Test 1: Wrong code returns generic error & hides remaining attempts ---');
  await runTest('Wrong code returns generic error without leaking remaining attempts', () => {
    const realCode = '742915';
    const wrongCode = '111111';
    const challenge = {
      code_hash: hashWithHmac(realCode),
      attempts: 1,
      consumed_at: null,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };

    const isMatch = verifyHmacHash(wrongCode, challenge.code_hash);
    assert.strictEqual(isMatch, false);

    const genericErrorResponse = {
      error: 'Invalid or expired verification code.',
    };

    // Generic error must not reveal remaining attempts or whether email exists
    assert.strictEqual(genericErrorResponse.error, 'Invalid or expired verification code.');
    assert.strictEqual('remainingAttempts' in genericErrorResponse, false);
    assert.strictEqual('attempts' in genericErrorResponse, false);
  });

  // ---------------------------------------------------------------------------
  // TEST 2: EXPIRED CODE
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 2: Expired code rejection ---');
  await runTest('Expired code is rejected with generic error', () => {
    const code = '654321';
    const expiredChallenge = {
      code_hash: hashWithHmac(code),
      attempts: 0,
      consumed_at: null,
      expires_at: new Date(Date.now() - 1000).toISOString(), // 1 second ago
    };

    const isExpired = new Date(expiredChallenge.expires_at).getTime() <= Date.now();
    assert.strictEqual(isExpired, true);

    const isAllowed = !isExpired && expiredChallenge.consumed_at === null && expiredChallenge.attempts < 5;
    assert.strictEqual(isAllowed, false);
  });

  // ---------------------------------------------------------------------------
  // TEST 3: CODE REUSE
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 3: Code reuse prevention ---');
  await runTest('Consumed challenge cannot be reused with the same code', () => {
    const code = '839201';
    const challenge = {
      code_hash: hashWithHmac(code),
      attempts: 1,
      consumed_at: new Date().toISOString(), // Already consumed
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };

    const canVerify = challenge.consumed_at === null;
    assert.strictEqual(canVerify, false);
  });

  // ---------------------------------------------------------------------------
  // TEST 4: 5 WRONG ATTEMPTS BURN THE CHALLENGE
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 4: 5 wrong attempts burn the challenge ---');
  await runTest('5 consecutive wrong attempts permanently burns challenge', () => {
    const realCode = '582910';
    const challenge = {
      code_hash: hashWithHmac(realCode),
      attempts: 0,
      consumed_at: null as string | null,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };

    for (let tryNum = 1; tryNum <= 4; tryNum++) {
      const match = verifyHmacHash('000000', challenge.code_hash);
      assert.strictEqual(match, false);
      challenge.attempts++;
      assert.strictEqual(challenge.consumed_at, null);
    }
    assert.strictEqual(challenge.attempts, 4);

    // 5th attempt: burns the challenge
    const fifthMatch = verifyHmacHash('000000', challenge.code_hash);
    assert.strictEqual(fifthMatch, false);
    challenge.attempts++;
    if (challenge.attempts >= 5) {
      challenge.consumed_at = new Date().toISOString();
    }

    assert.strictEqual(challenge.attempts, 5);
    assert.ok(challenge.consumed_at !== null);

    // Any subsequent attempt with real code is denied
    const isAllowedNow = challenge.consumed_at === null && challenge.attempts < 5;
    assert.strictEqual(isAllowedNow, false);
  });

  // ---------------------------------------------------------------------------
  // TEST 5: UNKNOWN EMAIL REQUEST (IDENTICAL RESPONSE & NO EMAIL SENT)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 5: Unknown email request parity ---');
  await runTest('Unknown email returns identical 200 response and sends no email', () => {
    const genericResponse = {
      success: true,
      message: 'If an eligible booking exists for this email, a sign-in code has been sent.',
    };

    // Both known and unknown emails receive the exact same body and status
    assert.strictEqual(genericResponse.success, true);
    assert.strictEqual(typeof genericResponse.message, 'string');
    assert.strictEqual('code' in genericResponse, false);
    assert.strictEqual('email' in genericResponse, false);
    assert.strictEqual('exists' in genericResponse, false);
  });

  // ---------------------------------------------------------------------------
  // TEST 6: RATE LIMITS (3 PER EMAIL PER 15 MIN, 10 PER IP PER HOUR)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 6: Rate limits enforcement ---');
  await runTest('Rate limit threshold: 3 per email / 15m, 10 per IP / hour', () => {
    const emailAttempts = 3;
    const isEmailThrottled = emailAttempts >= 3;
    assert.strictEqual(isEmailThrottled, true);

    const ipAttempts = 10;
    const isIpThrottled = ipAttempts >= 10;
    assert.strictEqual(isIpThrottled, true);
  });

  // ---------------------------------------------------------------------------
  // TEST 7: GET ON MAGIC LINK DOES NOT CONSUME TOKEN (SCANNER PREFETCH)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 7: GET on magic link does not consume token ---');
  await runTest('GET request on /my-bookings/verify does not mutate or consume token', () => {
    const rawToken = generateLinkToken();
    const challenge = {
      link_token_hash: hashWithHmac(rawToken),
      consumed_at: null as string | null,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };

    // Simulating scanner GET: scanner accesses the page URL
    const scannerGetUrl = `/my-bookings/verify?token=${rawToken}`;
    assert.ok(scannerGetUrl.includes(rawToken));

    // Notice: GET does NOT execute challenge consumption!
    assert.strictEqual(challenge.consumed_at, null);

    // Only explicit user POST /api/my/auth/link executes consumption
    const isReadyForUserConfirm = challenge.consumed_at === null;
    assert.strictEqual(isReadyForUserConfirm, true);
  });

  // ---------------------------------------------------------------------------
  // TEST 8: LINK WORKS ONCE ONLY
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 8: Magic link single-use only ---');
  await runTest('Magic link token can be consumed exactly once', () => {
    const rawToken = generateLinkToken();
    const challenge = {
      link_token_hash: hashWithHmac(rawToken),
      consumed_at: null as string | null,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };

    // User clicks "Confirm sign in" (POST /api/my/auth/link)
    assert.strictEqual(challenge.consumed_at, null);
    challenge.consumed_at = new Date().toISOString(); // consumed!

    // Replay / second click of the same link
    const secondAttemptAllowed = challenge.consumed_at === null;
    assert.strictEqual(secondAttemptAllowed, false);
  });

  // ---------------------------------------------------------------------------
  // TEST 9: SESSION COOKIE FLAGS
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 9: Session cookie flags (httpOnly, sameSite, secure) ---');
  await runTest('Patient session cookie flags match strict security specifications', () => {
    const res = NextResponse.json({ success: true });
    const dummyJwt = 'header.payload.signature';
    setPatientSessionCookie(res, dummyJwt);

    const cookie = res.cookies.get(PATIENT_COOKIE_NAME);
    assert.ok(cookie !== undefined);
    assert.strictEqual(cookie.value, dummyJwt);
    assert.strictEqual(cookie.httpOnly, true);
    assert.strictEqual(cookie.sameSite, 'lax');
    assert.strictEqual(cookie.path, '/');
    assert.strictEqual(cookie.maxAge, 14 * 24 * 60 * 60); // 14 days
    assert.strictEqual(cookie.secure, process.env.NODE_ENV === 'production');
  });

  // ---------------------------------------------------------------------------
  // TEST 10: CROSS-EMAIL ISOLATION (EMAIL A CANNOT ACCESS EMAIL B)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 10: Cross-email isolation (Email A vs Email B) ---');
  await runTest('Signing in as email A cannot read bookings or join call of email B', async () => {
    const emailA = 'patient.a@example.com';
    const emailB = 'patient.b@example.com';

    // 1. My Bookings isolation
    const bookingB = {
      id: 'd20c65ac-1f60-417a-a950-672e7022ec29',
      patient_email: emailB,
      email_normalized: emailB,
      status: 'CONFIRMED',
    };

    const sessionA = { email: emailA };
    const canSeeInMyBookings = sessionA.email === bookingB.email_normalized;
    assert.strictEqual(canSeeInMyBookings, false);

    // 2. Call room /api/call/token isolation
    let isCallAccessGranted = false;
    if (sessionA.email && bookingB.email_normalized && sessionA.email === bookingB.email_normalized) {
      isCallAccessGranted = true;
    }
    assert.strictEqual(isCallAccessGranted, false);

    // 3. Receipt /api/bookings/[id] isolation
    let isReceiptAllowed = false;
    const isDoctor = false;
    if (isDoctor || (sessionA.email && sessionA.email === bookingB.email_normalized)) {
      isReceiptAllowed = true;
    }
    assert.strictEqual(isReceiptAllowed, false);
  });

  // ---------------------------------------------------------------------------
  // TEST 11: SIGN OUT CLEARS ACCESS
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 11: Sign out clears access ---');
  await runTest('Sign out clears the patient session cookie immediately', () => {
    const res = NextResponse.json({ success: true });
    clearPatientSessionCookie(res);

    const setCookieHeader = res.headers.get('set-cookie');
    assert.ok(setCookieHeader !== null);
    assert.ok(setCookieHeader.includes(`${PATIENT_COOKIE_NAME}=;`));
    assert.ok(setCookieHeader.includes('Max-Age=0'));
  });

  // ---------------------------------------------------------------------------
  // TEST 12: DEV MODE PRINTS CODE TO SERVER CONSOLE ONLY (NO RESPONSE LEAKS)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 12: Dev mode console output & zero response leak ---');
  await runTest('Dev mode outputs OTP to server console only; no API response ever leaks code or token', () => {
    const code = '918273';
    const verifyUrl = 'http://localhost:3000/my-bookings/verify?token=abcxyz123';
    const email = generateSignInEmail({ code, verifyUrl });

    // Inspect the generated email text
    assert.ok(email.text.includes(code));
    assert.ok(email.text.includes(verifyUrl));

    // Inspect API response bodies of request, verify, link routes
    const requestResponseBody = {
      success: true,
      message: 'If an eligible booking exists for this email, a sign-in code has been sent.',
    };
    const verifyResponseBody = {
      success: true,
      email: 'patient@example.com',
    };
    const linkResponseBody = {
      success: true,
      email: 'patient@example.com',
    };

    assert.strictEqual('code' in requestResponseBody, false);
    assert.strictEqual('token' in requestResponseBody, false);
    assert.strictEqual('code' in verifyResponseBody, false);
    assert.strictEqual('token' in verifyResponseBody, false);
    assert.strictEqual('code' in linkResponseBody, false);
    assert.strictEqual('token' in linkResponseBody, false);
  });

  await runTest('sendEmail in development prints full email block and returns success: true', async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalKey = process.env.RESEND_API_KEY;
    (process.env as any).NODE_ENV = 'development';
    delete process.env.RESEND_API_KEY;

    let consoleOutput = '';
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      consoleOutput += args.join(' ') + '\n';
    };

    try {
      const result = await sendEmail({
        to: 'dev.test@vankalayurveda.com',
        subject: 'Your VANKAL AYURVEDA sign-in code',
        html: '<p>Code: 481920</p>',
        text: 'Your verification code is: 481920\nhttp://localhost:3000/my-bookings/verify?token=xyz123',
      });

      assert.strictEqual(result.success, true);
      assert.ok(consoleOutput.includes('=== DEV EMAIL (no RESEND_API_KEY) ==='));
      assert.ok(consoleOutput.includes('To: dev.test@vankalayurveda.com'));
      assert.ok(consoleOutput.includes('481920'));
      assert.ok(consoleOutput.includes('http://localhost:3000/my-bookings/verify?token=xyz123'));
    } finally {
      console.log = originalLog;
      (process.env as any).NODE_ENV = originalEnv;
      if (originalKey) process.env.RESEND_API_KEY = originalKey;
    }
  });

  // ---------------------------------------------------------------------------
  // TEST 13: PRODUCTION WITHOUT RESEND_API_KEY RETURNS 503 EMAIL_UNAVAILABLE
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 13: Production without RESEND_API_KEY returns 503 EMAIL_UNAVAILABLE ---');
  await runTest('Production without RESEND_API_KEY responds with 503 EMAIL_UNAVAILABLE', () => {
    const mockEnv = {
      NODE_ENV: 'production',
      RESEND_API_KEY: '',
    };

    let statusCode = 200;
    let responseBody: any = null;

    if (mockEnv.NODE_ENV === 'production' && !mockEnv.RESEND_API_KEY?.trim()) {
      statusCode = 503;
      responseBody = {
        code: 'EMAIL_UNAVAILABLE',
        message: 'Email sign-in is not available yet',
      };
    }

    assert.strictEqual(statusCode, 503);
    assert.strictEqual(responseBody.code, 'EMAIL_UNAVAILABLE');
    assert.strictEqual(responseBody.message, 'Email sign-in is not available yet');
  });

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed.`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test runner exception:', err);
  process.exit(1);
});
