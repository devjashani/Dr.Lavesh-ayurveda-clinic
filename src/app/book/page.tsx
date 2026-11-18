import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { BookClient } from './BookClient';

export const metadata: Metadata = {
  title: 'Book Consultation | Dr. Lavesh Bohra | Vankal Ayurveda',
  description:
    'Reserve an in-person appointment or online video consultation with Dr. Lavesh Bohra, BAMS (2026), Registered Ayurvedic Practitioner at Vankal Ayurveda.',
  keywords: [
    'Book Ayurveda appointment',
    'Ayurveda consultation booking',
    'Dr Lavesh Bohra consultation',
    'Ayurvedic lifestyle consultation',
    'Vankal Ayurveda',
  ],
  openGraph: {
    title: 'Book Consultation | Vankal Ayurveda',
    description:
      'Reserve an in-person appointment or video consultation at Vankal Ayurveda.',
    url: 'https://vankalayurveda.com/book',
    siteName: 'Vankal Ayurveda',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-mono text-xs text-forest/70">
          Loading Vankal Appointment Desk...
        </div>
      }
    >
      <BookClient />
    </Suspense>
  );
}
