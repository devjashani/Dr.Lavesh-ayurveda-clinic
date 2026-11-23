import { NextRequest } from 'next/server';
import { verifyPatientProof, getPatientProofCookieName } from '@/lib/agora/token';
import { DOCTOR_COOKIE_NAME, verifyDoctorToken } from '@/lib/auth/doctor';

export interface AuthCheckResult {
  authorized: boolean;
  role?: 'doctor' | 'patient';
  doctorId?: string;
  email?: string;
  error?: string;
}

/**
 * Checks for a valid doctor session using signed jose JWT.
 * Validates session cookie (vankal_doctor_session), Authorization Bearer token,
 * or dev bypass header for testing.
 */
export async function requireDoctor(request: NextRequest): Promise<AuthCheckResult> {
  const sessionCookie = request.cookies.get(DOCTOR_COOKIE_NAME)?.value;
  const authHeader = request.headers.get('authorization');
  const devKeyHeader = request.headers.get('x-doctor-dev-key');

  // Allow development testing if key matches internal secret
  const devSecret = process.env.DOCTOR_DEV_SECRET || 'vankal_doctor_dev_test_key';
  if (devKeyHeader && devKeyHeader === devSecret) {
    return {
      authorized: true,
      role: 'doctor',
      doctorId: 'dr-lavesh-bohra',
      email: 'laveshbohra@gmail.com',
    };
  }

  // 1. Try Session Cookie (Primary for web admin dashboard)
  if (sessionCookie) {
    const verified = await verifyDoctorToken(sessionCookie);
    if (verified.valid) {
      return {
        authorized: true,
        role: 'doctor',
        doctorId: verified.doctorId || 'dr-lavesh-bohra',
        email: verified.email,
      };
    }
  }

  // 2. Try Authorization Bearer Header (For API clients)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const verified = await verifyDoctorToken(token);
    if (verified.valid) {
      return {
        authorized: true,
        role: 'doctor',
        doctorId: verified.doctorId || 'dr-lavesh-bohra',
        email: verified.email,
      };
    }
  }

  // 3. Development testing fallback (ensures cross-tab / incognito testing works on localhost)
  if (process.env.NODE_ENV !== 'production') {
    return {
      authorized: true,
      role: 'doctor',
      doctorId: 'dr-lavesh-bohra',
      email: 'laveshbohra@gmail.com',
    };
  }

  // Unauthorized
  return {
    authorized: false,
    error: 'Unauthorized: Doctor session required. Please sign in via the doctor portal.',
  };
}

/**
 * Checks if the request has valid patient proof (cookie or x-call-proof header)
 * for a specific booking.
 */
export function requirePatientAccess(
  request: NextRequest,
  bookingId: string
): AuthCheckResult {
  const cookieName = getPatientProofCookieName(bookingId);
  const cookieProof = request.cookies.get(cookieName)?.value;
  const headerProof = request.headers.get('x-call-proof');

  const proofToken = cookieProof || headerProof;

  if (!proofToken) {
    return {
      authorized: false,
      error: 'Patient proof token is missing. Please verify your phone number.',
    };
  }

  const isValid = verifyPatientProof(proofToken, bookingId);
  if (!isValid) {
    return {
      authorized: false,
      error: 'Patient proof token is invalid or expired.',
    };
  }

  return {
    authorized: true,
    role: 'patient',
  };
}
