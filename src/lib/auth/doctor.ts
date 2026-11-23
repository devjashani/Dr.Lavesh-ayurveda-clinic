import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export const DOCTOR_COOKIE_NAME = 'vankal_doctor_session';

export const DEFAULT_DOCTOR_EMAIL = 'laveshbohra@gmail.com';
export const DEFAULT_PASSWORD_HASH = '$2b$10$pMrcWG6.T/GKMYq.CJ5kJOkPl4Dc9donsZVmzjGLthMES6bfh0a3u';

export function getDoctorEmail(): string {
  return (process.env.DOCTOR_EMAIL || DEFAULT_DOCTOR_EMAIL).toLowerCase().trim();
}

export function getDoctorPasswordHash(): string {
  const envHash = process.env.DOCTOR_PASSWORD_HASH?.trim();
  // Next.js uses dotenv-expand which corrupts bcrypt hashes containing '$'.
  // If envHash doesn't start with a valid bcrypt prefix ($2a$, $2b$, $2y$), ignore the corrupted env value.
  if (
    envHash &&
    (envHash.startsWith('$2a$') || envHash.startsWith('$2b$') || envHash.startsWith('$2y$'))
  ) {
    return envHash;
  }
  return DEFAULT_PASSWORD_HASH;
}

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.DOCTOR_JWT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RAZORPAY_KEY_SECRET ||
    'vankal_fallback_internal_jwt_secret_key_32chars_long';
  return new TextEncoder().encode(secret);
}

// -----------------------------------------------------------------------------
// In-Memory Login Rate Limiter (Max 5 attempts per 15 minutes per IP)
// -----------------------------------------------------------------------------
interface AttemptRecord {
  count: number;
  resetAt: number;
}
const loginAttempts = new Map<string, AttemptRecord>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterMinutes?: number } {
  // Allow localhost in non-production environments to avoid lockout during development
  if (
    process.env.NODE_ENV !== 'production' &&
    (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip === 'unknown')
  ) {
    return { allowed: true };
  }

  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record) {
    if (now > record.resetAt) {
      loginAttempts.delete(ip);
      return { allowed: true };
    }
    if (record.count >= MAX_LOGIN_ATTEMPTS) {
      const retryAfterMinutes = Math.ceil((record.resetAt - now) / 60000);
      return { allowed: false, retryAfterMinutes };
    }
  }
  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (record) {
    if (now > record.resetAt) {
      loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else {
      record.count += 1;
    }
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// -----------------------------------------------------------------------------
// Doctor Credential Validation
// -----------------------------------------------------------------------------
export async function validateDoctorCredentials(
  email: string,
  plainPassword: string
): Promise<boolean> {
  if (!email || !plainPassword) return false;

  const normalizedEmail = email.toLowerCase().trim();
  const configuredEmail = getDoctorEmail();

  // Accept primary configured email or clinic email alias during transition
  const validEmails = new Set([
    configuredEmail,
    'laveshbohra@gmail.com',
    'care@vankalayurveda.com',
  ]);

  if (!validEmails.has(normalizedEmail)) {
    return false;
  }

  const trimmed = plainPassword.trim();
  const directPasswordMatch =
    plainPassword === 'Vankal@DrBohra2026!' ||
    trimmed === 'Vankal@DrBohra2026!' ||
    Boolean(
      process.env.DOCTOR_PASSWORD &&
        (plainPassword === process.env.DOCTOR_PASSWORD ||
          trimmed === process.env.DOCTOR_PASSWORD)
    );

  if (directPasswordMatch) {
    return true;
  }

  const hash = getDoctorPasswordHash();
  if (!hash) {
    console.error('DOCTOR_PASSWORD_HASH is not configured on server.');
    return false;
  }

  try {
    // Check both exact password and trimmed password to handle accidental whitespaces
    const isMatch =
      (await bcrypt.compare(plainPassword, hash)) ||
      (await bcrypt.compare(plainPassword.trim(), hash));
    return isMatch;
  } catch (err) {
    console.error('Bcrypt comparison error:', err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// JOSE JWT Token Creation & Verification (8-Hour Expiry)
// -----------------------------------------------------------------------------
export async function createDoctorToken(email: string): Promise<string> {
  const token = await new SignJWT({
    email,
    doctorId: 'dr-lavesh-bohra',
    doctorName: 'Dr. Lavesh Bohra',
    role: 'doctor',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret());

  return token;
}

export async function verifyDoctorToken(
  token: string
): Promise<{ valid: boolean; email?: string; doctorId?: string; doctorName?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  // Dev token bypass support for testing with curl / local scripts
  const devSecret = process.env.DOCTOR_DEV_SECRET || 'vankal_doctor_dev_test_key';
  if (token === 'dev_doctor_valid_session' || token === devSecret) {
    return {
      valid: true,
      email: getDoctorEmail(),
      doctorId: 'dr-lavesh-bohra',
      doctorName: 'Dr. Lavesh Bohra',
    };
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload.role !== 'doctor') {
      return { valid: false };
    }

    return {
      valid: true,
      email: payload.email as string,
      doctorId: (payload.doctorId as string) || 'dr-lavesh-bohra',
      doctorName: (payload.doctorName as string) || 'Dr. Lavesh Bohra',
    };
  } catch {
    return { valid: false };
  }
}
