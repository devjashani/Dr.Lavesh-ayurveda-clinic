import crypto from 'crypto';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { AGORA_UIDS, CallRole } from '@/lib/config/call';

// Server-only Agora Credentials
const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '';

// Internal HMAC secret for signing proof tokens
const PROOF_SECRET =
  process.env.AGORA_APP_CERTIFICATE ||
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'vankal_internal_call_proof_salt';

export interface GeneratedTokenResult {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  role: CallRole;
  secondsRemaining: number;
}

/**
 * Validates if a string is a 32-character hexadecimal string
 * (standard format for Agora App ID and Certificate)
 */
function isValidHex32(val: string): boolean {
  return /^[0-9a-fA-F]{32}$/.test(val.trim());
}

/**
 * Builds an Agora RTC Token for a verified call participant.
 * Never logs or exposes the app certificate.
 */
export function buildAgoraToken(
  channelName: string,
  role: CallRole,
  secondsRemaining: number
): GeneratedTokenResult {
  const appId = (AGORA_APP_ID || '').trim();
  const appCert = (AGORA_APP_CERTIFICATE || '').trim();
  const uid = AGORA_UIDS[role];

  // Token lifetime in seconds (minimum 60s, maximum up to remaining seconds)
  const tokenExpireSeconds = Math.max(60, Math.min(secondsRemaining, 86400));
  const privilegeExpireSeconds = tokenExpireSeconds;

  let token = '';

  if (appId && appCert && isValidHex32(appId) && isValidHex32(appCert)) {
    // Generate real Agora RTC token with Publisher role
    token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCert,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      tokenExpireSeconds,
      privilegeExpireSeconds
    );
  } else {
    // Fallback/Mock token for local testing when keys are not yet configured in .env.local
    const mockHash = crypto
      .createHmac('sha256', PROOF_SECRET)
      .update(`${channelName}:${uid}:${tokenExpireSeconds}`)
      .digest('hex');
    token = `007_vankal_mock_${mockHash.slice(0, 32)}`;
  }

  return {
    token,
    appId: appId || 'placeholder_agora_app_id',
    channelName,
    uid,
    role,
    secondsRemaining: tokenExpireSeconds,
  };
}

/**
 * Creates an HMAC-SHA256 signed proof token for a patient who has verified
 * their phone number. Allows subsequent /ping calls without re-entering phoneLast4.
 */
export function signPatientProof(bookingId: string, windowEndMs: number): string {
  const payload = `${bookingId}|patient|${windowEndMs}`;
  const hmac = crypto
    .createHmac('sha256', PROOF_SECRET)
    .update(payload)
    .digest('hex');

  // Token format: base64(payload)|signature
  const encodedPayload = Buffer.from(payload).toString('base64url');
  return `${encodedPayload}.${hmac}`;
}

/**
 * Verifies an HMAC-SHA256 signed patient proof token.
 */
export function verifyPatientProof(proofToken: string, bookingId: string): boolean {
  if (!proofToken || typeof proofToken !== 'string') return false;

  const parts = proofToken.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, providedSignature] = parts;

  try {
    const rawPayload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const [tokenBookingId, role, windowEndStr] = rawPayload.split('|');

    if (tokenBookingId !== bookingId || role !== 'patient') {
      return false;
    }

    const windowEndMs = parseInt(windowEndStr, 10);
    if (isNaN(windowEndMs) || Date.now() > windowEndMs) {
      // Expired proof token
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', PROOF_SECRET)
      .update(rawPayload)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const providedBuf = Buffer.from(providedSignature, 'utf8');

    if (expectedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}

/**
 * Returns the standard cookie name for patient proof
 */
export function getPatientProofCookieName(bookingId: string): string {
  return `vankal_call_proof_${bookingId.replace(/[^a-zA-Z0-9]/g, '_')}`;
}
