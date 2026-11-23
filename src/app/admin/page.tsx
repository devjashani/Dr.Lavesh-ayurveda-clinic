import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DOCTOR_COOKIE_NAME, verifyDoctorToken } from '@/lib/auth/doctor';
import { DoctorConsoleClient } from './DoctorConsoleClient';

export const metadata: Metadata = {
  title: 'Doctor Console | VANKAL AYURVEDA',
  description: 'Clinical consultation dashboard for Dr. Lavesh Bohra.',
  robots: {
    index: false,
    follow: false,
  },
};

async function DoctorConsoleSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(DOCTOR_COOKIE_NAME)?.value;

  if (!sessionToken) {
    redirect('/admin/login');
  }

  const verified = await verifyDoctorToken(sessionToken);
  if (!verified.valid) {
    redirect('/admin/login');
  }

  return <DoctorConsoleClient doctorName={verified.doctorName || 'Dr. Lavesh Bohra'} />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#fbf9f4] flex items-center justify-center font-mono text-xs text-forest/70">
          Loading clinical console...
        </div>
      }
    >
      <DoctorConsoleSession />
    </Suspense>
  );
}
