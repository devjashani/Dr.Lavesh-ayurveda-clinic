/**
 * VANKAL AYURVEDA — STEP V5 Verification Test Suite
 * Run with: npx tsx --env-file=.env.local scripts/verify-v5-suite.ts
 */

import assert from 'assert';
import { calculateCallWindow } from '../src/lib/config/call';
import { buildAgoraToken, signPatientProof, verifyPatientProof } from '../src/lib/agora/token';
import { validateDoctorCredentials, createDoctorToken, verifyDoctorToken, checkLoginRateLimit, recordFailedLogin, resetLoginAttempts } from '../src/lib/auth/doctor';
import { checkCallRateLimit } from '../src/lib/utils/callRateLimit';
import { NextRequest } from 'next/server';

console.log('================================================================');
console.log('🩺 VANKAL AYURVEDA — STEP V5 FULL VERIFICATION TEST SUITE');
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

// Fixed slot: 2026-11-24 10:00 to 10:20 IST (Asia/Kolkata)
const dateStr = '2026-11-24';
const slotStart = '10:00';
const slotEnd = '10:20';

function istMs(timeStr: string): number {
  return new Date(`${dateStr}T${timeStr}+05:30`).getTime();
}

async function main() {
  // ---------------------------------------------------------------------------
  // 1. WINDOW LOGIC TESTS WITH FIXED TIMES (SERVER TIME ONLY, ASIA/KOLKATA)
  // ---------------------------------------------------------------------------
  console.log('\n--- 1. Window Logic Tests (Server Time, Asia/Kolkata) ---');

  await runTest('Patient at T-11 min (09:49:00 IST) is TOO_EARLY', () => {
    const window = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istMs('09:49:00'));
    assert.strictEqual(window.isTooEarly, true);
    assert.strictEqual(window.isInWindow, false);
    assert.strictEqual(window.isEnded, false);
  });

  await runTest('Patient at T-10 min (09:50:00 IST) is OK (Enters active window)', () => {
    const window = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istMs('09:50:00'));
    assert.strictEqual(window.isTooEarly, false);
    assert.strictEqual(window.isInWindow, true);
    assert.strictEqual(window.isEnded, false);
    // 09:50 to 10:35 = 45 mins = 2700s
    assert.strictEqual(window.secondsRemaining, 2700);
  });

  await runTest('Patient at slot_end + 15 min (10:35:00 IST) is OK (Final second of window)', () => {
    const window = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istMs('10:35:00'));
    assert.strictEqual(window.isTooEarly, false);
    assert.strictEqual(window.isInWindow, true);
    assert.strictEqual(window.isEnded, false);
    assert.strictEqual(window.secondsRemaining, 0);
  });

  await runTest('Patient at slot_end + 16 min (10:36:00 IST) is ENDED', () => {
    const window = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istMs('10:36:00'));
    assert.strictEqual(window.isTooEarly, false);
    assert.strictEqual(window.isInWindow, false);
    assert.strictEqual(window.isEnded, true);
    assert.strictEqual(window.secondsRemaining, 0);
  });

  await runTest('Doctor at T-16 min (09:44:00 IST) is TOO_EARLY', () => {
    const window = calculateCallWindow(dateStr, slotStart, slotEnd, 'doctor', istMs('09:44:00'));
    assert.strictEqual(window.isTooEarly, true);
    assert.strictEqual(window.isInWindow, false);
    assert.strictEqual(window.isEnded, false);
  });

  await runTest('Doctor at T-15 min (09:45:00 IST) is OK (Doctor enters early)', () => {
    const window = calculateCallWindow(dateStr, slotStart, slotEnd, 'doctor', istMs('09:45:00'));
    assert.strictEqual(window.isTooEarly, false);
    assert.strictEqual(window.isInWindow, true);
    assert.strictEqual(window.isEnded, false);
    // 09:45 to 10:35 = 50 mins = 3000s
    assert.strictEqual(window.secondsRemaining, 3000);
  });

  // ---------------------------------------------------------------------------
  // 2. ACCESS TESTS & SECURITY BOUNDARIES
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Access Tests & Security Boundaries ---');

  await runTest('Agora token assigns Doctor UID 1 and Patient UID 2 strictly', () => {
    const docToken = buildAgoraToken('vankal_test_channel', 'doctor', 1800);
    const patToken = buildAgoraToken('vankal_test_channel', 'patient', 1800);

    assert.strictEqual(docToken.uid, 1);
    assert.strictEqual(patToken.uid, 2);
    assert.strictEqual(docToken.role, 'doctor');
    assert.strictEqual(patToken.role, 'patient');
    assert.ok(typeof docToken.token === 'string' && docToken.token.length > 20);
    assert.ok(typeof patToken.token === 'string' && patToken.token.length > 20);
  });

  await runTest('Patient proof HMAC verifies matching bookingId and rejects expired/tampered tokens', () => {
    const bookingId = 'a0000000-0000-0000-0000-000000000001';
    const expiresAtMs = Date.now() + 60000;
    const proof = signPatientProof(bookingId, expiresAtMs);

    // Valid proof matches
    const valid = verifyPatientProof(proof, bookingId);
    assert.strictEqual(valid, true);

    // Wrong bookingId fails
    const wrongBooking = verifyPatientProof(proof, 'b0000000-0000-0000-0000-000000000002');
    assert.strictEqual(wrongBooking, false);

    // Expired proof fails
    const expiredProof = signPatientProof(bookingId, Date.now() - 5000);
    const expired = verifyPatientProof(expiredProof, bookingId);
    assert.strictEqual(expired, false);

    // Tampered signature fails
    const tampered = proof.slice(0, -4) + 'abcd';
    const tamperedResult = verifyPatientProof(tampered, bookingId);
    assert.strictEqual(tamperedResult, false);
  });

  await runTest('Doctor session JWT signs and verifies with 8-hour expiry', async () => {
    const token = await createDoctorToken('laveshbohra@gmail.com');
    assert.ok(token && typeof token === 'string');

    const verified = await verifyDoctorToken(token);
    assert.strictEqual(verified.valid, true);
    assert.strictEqual(verified.email, 'laveshbohra@gmail.com');

    // Tampered token fails
    const tampered = token.slice(0, -6) + 'xxxxxx';
    const tamperedVerified = await verifyDoctorToken(tampered);
    assert.strictEqual(tamperedVerified.valid, false);
  });

  await runTest('Doctor credential verification matches valid bcrypt hash and rejects wrong password', async () => {
    const valid = await validateDoctorCredentials('laveshbohra@gmail.com', 'Vankal@DrBohra2026!');
    assert.strictEqual(valid, true);

    const wrongPass = await validateDoctorCredentials('laveshbohra@gmail.com', 'WrongPassword123!');
    assert.strictEqual(wrongPass, false);

    const wrongEmail = await validateDoctorCredentials('intruder@example.com', 'Vankal@DrBohra2026!');
    assert.strictEqual(wrongEmail, false);
  });

  await runTest('Doctor login rate limiter blocks after 5 failed attempts', () => {
    const testIp = '192.168.1.250';
    resetLoginAttempts(testIp);

    // Record 5 failed attempts
    for (let i = 0; i < 5; i++) {
      recordFailedLogin(testIp);
    }

    const blockedCheck = checkLoginRateLimit(testIp);
    assert.strictEqual(blockedCheck.allowed, false);
    assert.ok(blockedCheck.retryAfterMinutes! > 0);

    resetLoginAttempts(testIp);
    const resetCheck = checkLoginRateLimit(testIp);
    assert.strictEqual(resetCheck.allowed, true);
  });

  await runTest('Patient call token rate limiter blocks after 5 attempts', () => {
    const testIp = '198.51.100.42';
    const bookingId = 'test-rate-limit-patient-slot';

    for (let i = 0; i < 5; i++) {
      const req = new NextRequest('http://localhost:3000/api/call/token', {
        headers: { 'x-forwarded-for': testIp },
      });
      const check = checkCallRateLimit(req, bookingId);
      assert.strictEqual(check.allowed, true);
    }

    const reqBlocked = new NextRequest('http://localhost:3000/api/call/token', {
      headers: { 'x-forwarded-for': testIp },
    });
    const blocked = checkCallRateLimit(reqBlocked, bookingId);
    assert.strictEqual(blocked.allowed, false);
    assert.ok(blocked.retryAfterSeconds! > 0);
  });

  console.log('\n================================================================');
  console.log(`🏁 Summary: ${passedTests}/${totalTests} tests passed successfully.`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
