import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ConsultationClient } from './ConsultationClient';

export const metadata: Metadata = {
  title: 'Consultation Room | VANKAL AYURVEDA',
  description: 'Secure, clinical Ayurvedic video consultation room with Dr. Lavesh Bohra.',
  robots: {
    index: false,
    follow: false,
  },
};

export async function generateStaticParams() {
  return [{ bookingId: 'preview' }];
}

async function ConsultationSession({ bookingId }: { bookingId: string }) {
  const cookieStore = await cookies();
  const doctorSession = cookieStore.get('vankal_doctor_session')?.value;
  const initialRole = doctorSession ? 'doctor' : 'patient';

  return <ConsultationClient bookingId={bookingId} initialRole={initialRole} />;
}

export default async function ConsultationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  return (
    <Suspense
      fallback={
        <div className="h-[100dvh] w-full bg-[#0a1b14] text-sand flex flex-col items-center justify-center p-6 font-mono text-xs text-sand/70">
          Loading consultation room...
        </div>
      }
    >
      <ConsultationSession bookingId={bookingId} />
    </Suspense>
  );
}
