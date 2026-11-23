import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { DoctorLoginClient } from './DoctorLoginClient';

export const metadata: Metadata = {
  title: 'Doctor Login | VANKAL AYURVEDA',
  description: 'Clinical sign-in portal for Dr. Lavesh Bohra.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DoctorLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#fbf9f4] flex items-center justify-center font-mono text-xs text-forest/70">
          Loading login portal...
        </div>
      }
    >
      <DoctorLoginClient />
    </Suspense>
  );
}
