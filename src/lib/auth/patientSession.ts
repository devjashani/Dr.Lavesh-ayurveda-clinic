import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const PATIENT_COOKIE_NAME = 'vankal_patient_session';
export const PATIENT_SESSION_EXPIRY_DAYS = 14;

// -----------------------------------------------------------------------------
// Secret Keys & Cryptography Helpers
// -----------------------------------------------------------------------------

export function getPatientSessionSecret(): Uint8Array {
  const secret =
    process.env.PATIENT_SESSION_SECRET ||
    process.env.DOCTOR_JWT_SECRET ||
    'vankal_default_patient_session_secret_min_32_chars_safe_dev';
  return new TextEncoder().encode(secret);
}

export function getOtpHmacSecret(): string {
  return (
    process.env.OTP_HMAC_SECRET ||
    process.env.PATIENT_SESSION_SECRET ||
    'vankal_default_otp_hmac_secret_key_32_chars_dev'
  );
}

/**
 * Computes an HMAC-SHA256 hex digest of a string value using OTP_HMAC_SECRET.
 */
export function hashWithHmac(value: string): string {
  const secret = getOtpHmacSecret();
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

/**
 * Constant-time comparison of an input string against an expected HMAC hex digest.
 */
export function verifyHmacHash(value: string, expectedHash: string): boolean {
  if (!value || !expectedHash) return false;
  try {
    const computedHash = hashWithHmac(value);
    const a = Buffer.from(computedHash, 'hex');
    const b = Buffer.from(expectedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Generates a cryptographically random 6-digit numeric OTP code (e.g. "849201").
 */
export function generate6DigitCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Generates a 32-byte cryptographically random base64url string for magic links.
 */
export function generateLinkToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Hashes an IP address with the HMAC secret so raw IP addresses are never stored.
 */
export function hashIp(ip: string): string {
  const cleanIp = (ip || '127.0.0.1').trim().toLowerCase();
  return hashWithHmac(`vankal_ip_salt:${cleanIp}`);
}

// -----------------------------------------------------------------------------
// Patient Session Management (jose JWT)
// -----------------------------------------------------------------------------

export interface PatientSessionPayload {
  email: string;
}

/**
 * Creates a signed JWT for the patient's session valid for 14 days.
 */
export async function createPatientSessionToken(email: string): Promise<string> {
  const secret = getPatientSessionSecret();
  const normalizedEmail = email.trim().toLowerCase();

  return new SignJWT({ email: normalizedEmail })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${PATIENT_SESSION_EXPIRY_DAYS}d`)
    .sign(secret);
}

/**
 * Verifies a patient session JWT and extracts the normalized email.
 */
export async function verifyPatientSessionToken(
  token: string
): Promise<PatientSessionPayload | null> {
  if (!token) return null;
  try {
    const secret = getPatientSessionSecret();
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.email === 'string' && payload.email) {
      return { email: payload.email.trim().toLowerCase() };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently active patient session from cookies (Server Component / Route Handler).
 */
export async function getPatientSession(): Promise<PatientSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(PATIENT_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyPatientSessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Sets the patient session cookie on an outgoing NextResponse.
 */
export function setPatientSessionCookie(
  response: NextResponse,
  token: string
): void {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = PATIENT_SESSION_EXPIRY_DAYS * 24 * 60 * 60; // 14 days in seconds

  response.cookies.set(PATIENT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

/**
 * Clears the patient session cookie on an outgoing NextResponse.
 */
export function clearPatientSessionCookie(response: NextResponse): void {
  response.cookies.set(PATIENT_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// -----------------------------------------------------------------------------
// CSRF Origin Verification
// -----------------------------------------------------------------------------

/**
 * Verifies that the Origin header matches the site host.
 */
export function validateOrigin(request: NextRequest): boolean {
  // Allow requests in non-production or test environments if origin is missing/local
  const origin = request.headers.get('origin');
  if (!origin) {
    // If origin is not provided (e.g. server-to-server or strict same-origin GET/fetch), check host/referer
    const referer = request.headers.get('referer');
    if (referer) {
      try {
        const refUrl = new URL(referer);
        const host = request.headers.get('host');
        if (host && refUrl.host === host) return true;
      } catch {}
    }
    // Allow dev localhost
    return process.env.NODE_ENV !== 'production';
  }

  try {
    const originUrl = new URL(origin);
    const host = request.headers.get('host');

    // Host matching
    if (host && (originUrl.host === host || originUrl.host === host.split(':')[0])) {
      return true;
    }

    // Localhost dev matching
    if (
      process.env.NODE_ENV !== 'production' &&
      (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1')
    ) {
      return true;
    }

    // Configured site URL matching
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    if (siteUrl) {
      const cleanSite = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
      const configuredUrl = new URL(cleanSite);
      if (originUrl.host === configuredUrl.host) return true;
    }

    return false;
  } catch {
    return false;
  }
}
