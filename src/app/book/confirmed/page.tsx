import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ConfirmedClient } from './ConfirmedClient';

export const metadata: Metadata = {
  title: 'Consultation Confirmed | VANKAL AYURVEDA',
  description:
    'Your video consultation with Dr. Lavesh Bohra is confirmed. Access your official token, receipt voucher, and video call guidelines.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-mono text-xs text-forest/70">
          Loading appointment confirmation...
        </div>
      }
    >
      <ConfirmedClient />
    </Suspense>
  );
}
