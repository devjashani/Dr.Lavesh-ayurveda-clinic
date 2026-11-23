/**
 * VANKAL AYURVEDA — Unit Test Script for Agora Video Call Window Math & Tokens
 * Run with: node --experimental-strip-types scripts/test-call-windows.ts
 */

import assert from 'assert';
import { calculateCallWindow, deriveChannelName } from '../src/lib/config/call';
import { signPatientProof, verifyPatientProof, buildAgoraToken } from '../src/lib/agora/token';

console.log('🧪 Starting Agora Video Call Unit Tests...\n');

// Fixed test parameters: 2026-11-24, 10:00 to 10:20 IST (Asia/Kolkata)
const dateStr = '2026-11-24';
const slotStart = '10:00';
const slotEnd = '10:20';

// Helper to convert IST string to timestamp
function istTime(timeStr: string): number {
  return new Date(`${dateStr}T${timeStr}+05:30`).getTime();
}

let passed = 0;
let total = 0;

function test(name: string, fn: () => void) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err: unknown) {
    console.error(`  ✗ ${name}`);
    if (err instanceof Error) {
      console.error(`    ${err.message}`);
    }
  }
}

// -----------------------------------------------------------------------------
// 1. Patient Window Tests (PATIENT_EARLY_MINUTES = 10, CALL_GRACE_MINUTES = 15)
// -----------------------------------------------------------------------------
console.log('--- 1. Patient Call Window Tests ---');

test('Patient at 09:49:00 IST (11 mins prior) is TOO_EARLY', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istTime('09:49:00'));
  assert.strictEqual(result.isTooEarly, true);
  assert.strictEqual(result.isInWindow, false);
  assert.strictEqual(result.isEnded, false);
});

test('Patient at 09:50:00 IST (exact 10 mins prior) ENTERS WINDOW', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istTime('09:50:00'));
  assert.strictEqual(result.isTooEarly, false);
  assert.strictEqual(result.isInWindow, true);
  assert.strictEqual(result.isEnded, false);
  // 10:35 - 09:50 = 45 mins = 2700 seconds
  assert.strictEqual(result.secondsRemaining, 2700);
});

test('Patient at 10:10:00 IST (consultation in progress) is ACTIVE', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istTime('10:10:00'));
  assert.strictEqual(result.isInWindow, true);
  // 10:35 - 10:10 = 25 mins = 1500 seconds
  assert.strictEqual(result.secondsRemaining, 1500);
});

test('Patient at 10:20:00 IST (slot end, grace begins) is ACTIVE', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istTime('10:20:00'));
  assert.strictEqual(result.isInWindow, true);
  // 10:35 - 10:20 = 15 mins grace = 900 seconds
  assert.strictEqual(result.secondsRemaining, 900);
});

test('Patient at 10:35:00 IST (exact grace period end) is ACTIVE (0s remaining)', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istTime('10:35:00'));
  assert.strictEqual(result.isInWindow, true);
  assert.strictEqual(result.isEnded, false);
  assert.strictEqual(result.secondsRemaining, 0);
});

test('Patient at 10:35:01 IST (1s past grace period) is ENDED', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istTime('10:35:01'));
  assert.strictEqual(result.isTooEarly, false);
  assert.strictEqual(result.isInWindow, false);
  assert.strictEqual(result.isEnded, true);
  assert.strictEqual(result.secondsRemaining, 0);
});

// -----------------------------------------------------------------------------
// 2. Doctor Window Tests (DOCTOR_EARLY_MINUTES = 15, CALL_GRACE_MINUTES = 15)
// -----------------------------------------------------------------------------
console.log('\n--- 2. Doctor Call Window Tests ---');

test('Doctor at 09:44:00 IST (16 mins prior) is TOO_EARLY', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'doctor', istTime('09:44:00'));
  assert.strictEqual(result.isTooEarly, true);
  assert.strictEqual(result.isInWindow, false);
});

test('Doctor at 09:45:00 IST (exact 15 mins prior) ENTERS WINDOW', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'doctor', istTime('09:45:00'));
  assert.strictEqual(result.isTooEarly, false);
  assert.strictEqual(result.isInWindow, true);
  // 10:35 - 09:45 = 50 mins = 3000 seconds
  assert.strictEqual(result.secondsRemaining, 3000);
});

test('At 09:48:00 IST Doctor is in window while Patient is still TOO_EARLY', () => {
  const doc = calculateCallWindow(dateStr, slotStart, slotEnd, 'doctor', istTime('09:48:00'));
  const pat = calculateCallWindow(dateStr, slotStart, slotEnd, 'patient', istTime('09:48:00'));
  assert.strictEqual(doc.isInWindow, true, 'Doctor should be in window at 09:48');
  assert.strictEqual(pat.isTooEarly, true, 'Patient should be too early at 09:48');
});

test('Doctor at 10:36:00 IST (past grace period) is ENDED', () => {
  const result = calculateCallWindow(dateStr, slotStart, slotEnd, 'doctor', istTime('10:36:00'));
  assert.strictEqual(result.isEnded, true);
  assert.strictEqual(result.isInWindow, false);
});

// -----------------------------------------------------------------------------
// 3. Channel Name and Token Builder Tests
// -----------------------------------------------------------------------------
console.log('\n--- 3. Channel Name & Token Tests ---');

test('deriveChannelName generates valid, deterministic channel under 64 chars', () => {
  const bookingId = 'c7b6f69c-29b3-4f9e-a6fd-b570e30d1d2b';
  const channel = deriveChannelName(bookingId);
  assert.ok(channel.startsWith('vankal_'));
  assert.ok(channel.length <= 64);
  assert.strictEqual(channel, deriveChannelName(bookingId));
  assert.ok(/^[a-zA-Z0-9_]+$/.test(channel));
});

test('buildAgoraToken assigns UID 1 to Doctor and UID 2 to Patient', () => {
  const docResult = buildAgoraToken('vankal_test_channel', 'doctor', 1800);
  const patResult = buildAgoraToken('vankal_test_channel', 'patient', 1800);
  assert.strictEqual(docResult.uid, 1);
  assert.strictEqual(patResult.uid, 2);
  assert.ok(docResult.token.length > 0);
  assert.ok(patResult.token.length > 0);
});

// -----------------------------------------------------------------------------
// 4. Patient Proof Signing & Verification Tests
// -----------------------------------------------------------------------------
console.log('\n--- 4. Patient Proof HMAC Tests ---');

test('signPatientProof generates token verifiable by verifyPatientProof', () => {
  const bookingId = 'a1111111-2222-3333-4444-555555555555';
  const futureMs = Date.now() + 3600 * 1000;
  const proof = signPatientProof(bookingId, futureMs);
  
  assert.strictEqual(verifyPatientProof(proof, bookingId), true);
});

test('verifyPatientProof rejects tampered booking ID or altered signature', () => {
  const bookingId1 = 'a1111111-2222-3333-4444-555555555555';
  const bookingId2 = 'b2222222-3333-4444-5555-666666666666';
  const futureMs = Date.now() + 3600 * 1000;
  const proof = signPatientProof(bookingId1, futureMs);
  
  assert.strictEqual(verifyPatientProof(proof, bookingId2), false);
  assert.strictEqual(verifyPatientProof(proof + 'tampered', bookingId1), false);
});

test('verifyPatientProof rejects expired proof tokens', () => {
  const bookingId = 'a1111111-2222-3333-4444-555555555555';
  const pastMs = Date.now() - 60 * 1000; // 1 min ago
  const proof = signPatientProof(bookingId, pastMs);
  
  assert.strictEqual(verifyPatientProof(proof, bookingId), false);
});

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log(`\n========================================`);
console.log(`Results: ${passed} / ${total} tests passed.`);
console.log(`========================================\n`);

if (passed !== total) {
  process.exit(1);
}
