import { NextRequest, NextResponse } from 'next/server';
import {
  validateOrigin,
  clearPatientSessionCookie,
} from '@/lib/auth/patientSession';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

export async function POST(request: NextRequest) {
  // 1. Origin Header CSRF Verification
  if (!validateOrigin(request)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403, headers: NO_CACHE_HEADERS }
    );
  }

  // 2. Clear patient session cookie
  const response = NextResponse.json(
    { success: true },
    { headers: NO_CACHE_HEADERS }
  );
  clearPatientSessionCookie(response);

  return response;
}
