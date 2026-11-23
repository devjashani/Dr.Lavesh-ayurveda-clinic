import { NextRequest, NextResponse } from 'next/server';
import { requireDoctor } from '@/lib/agora/auth';

export async function GET(request: NextRequest) {
  try {
    const doctorAuth = await requireDoctor(request);
    if (doctorAuth.authorized) {
      return NextResponse.json({
        isDoctor: true,
        doctorId: doctorAuth.doctorId || 'dr-lavesh-bohra',
        doctorName: 'Dr. Lavesh Bohra',
      });
    }

    return NextResponse.json({
      isDoctor: false,
    });
  } catch {
    return NextResponse.json({
      isDoctor: false,
    });
  }
}
