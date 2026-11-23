import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  DOCTOR_COOKIE_NAME,
  createDoctorToken,
  validateDoctorCredentials,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from '@/lib/auth/doctor';
import { getClientIp } from '@/lib/utils/callRateLimit';

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Valid email required' }),
  password: z.string().min(1, { message: 'Password required' }),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 1. Check Rate Limit per IP (5 attempts per 15 minutes)
    const rateCheck = checkLoginRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMITED',
          message: `Too many failed login attempts. Please try again in ${rateCheck.retryAfterMinutes} minutes.`,
        },
        { status: 429 }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // 2. Validate Credentials against server hash
    const isValid = await validateDoctorCredentials(cleanEmail, cleanPassword);
    console.log('[Admin Auth] Login attempt for:', cleanEmail, isValid ? 'SUCCESS' : 'FAILED');
    if (!isValid) {
      recordFailedLogin(ip);
      // Generic error message as required
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
        { status: 401 }
      );
    }

    // Success: reset attempts
    resetLoginAttempts(ip);

    // 3. Issue 8-Hour Signed JWT Token
    const token = await createDoctorToken(email);

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      doctorName: 'Dr. Lavesh Bohra',
    });

    // 4. Set HttpOnly, Secure, SameSite=Lax Cookie
    response.cookies.set({
      name: DOCTOR_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (err) {
    console.error('Doctor login error:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'SERVER_ERROR',
        message: 'Could not process login request.',
      },
      { status: 500 }
    );
  }
}
