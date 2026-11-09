import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { BookClient } from './BookClient';

export const metadata: Metadata = {
  title: 'Book Consultation & Nadi Pariksha | Aarogyam Ayurveda Jaipur',
  description:
    'Reserve an in-person pulse diagnosis (Nadi Pariksha) appointment or online video consultation with Dr. Lavesh Bohra, MD (Ayurveda) at Aarogyam Ayurveda, Civil Lines, Jaipur.',
  keywords: [
    'Book Ayurveda appointment Jaipur',
    'Nadi Pariksha booking',
    'Dr Lavesh Bohra consultation',
    'Ayurveda clinic Civil Lines Jaipur',
    'Panchakarma booking',
  ],
  openGraph: {
    title: 'Book Consultation & Nadi Pariksha | Aarogyam Ayurveda',
    description:
      'Reserve an in-person pulse diagnosis appointment or video consultation at Aarogyam Ayurveda Jaipur.',
    url: 'https://aarogyamayurveda.com/book',
    siteName: 'Aarogyam Classical Ayurveda Clinic',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-mono text-xs text-forest/70">
          Loading Aarogyam Appointment Desk...
        </div>
      }
    >
      <BookClient />
    </Suspense>
  );
}
