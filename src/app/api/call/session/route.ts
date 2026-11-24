import { NextRequest, NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/agora/auth';
import { getPatientSession } from '@/lib/auth/patientSession';

export async function GET(request: NextRequest) {
  try {
    const doctorAuth = await requireDoctor(request);
    if (doctorAuth.authorized) {
      return NextResponse.json(
        {
          isDoctor: true,
          doctorId: doctorAuth.doctorId || 'dr-lavesh-bohra',
          doctorName: 'Dr. Lavesh Bohra',
          patientEmail: null,
        },
        {
          headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        }
      );
    }

    const patientSession = await getPatientSession();
    return NextResponse.json(
      {
        isDoctor: false,
        patientEmail: patientSession?.email || null,
      },
      {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
      }
    );
  } catch {
    return NextResponse.json(
      {
        isDoctor: false,
        patientEmail: null,
      },
      {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
      }
    );
  }
}
