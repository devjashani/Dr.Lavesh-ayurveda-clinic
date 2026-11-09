import React from 'react';
import type { Metadata } from 'next';
import { treatments } from '@/lib/data/treatments';
import { TreatmentsDirectory } from './TreatmentsDirectory';

export const metadata: Metadata = {
  title: 'Classical Ayurvedic Treatments & Panchakarma Protocols | Aarogyam Jaipur',
  description:
    'Explore 12 authentic classical Ayurvedic therapies including Vamana, Virechana, Basti Karma, Shirodhara, Kati Basti, and Netra Tarpana at Aarogyam Ayurveda, Civil Lines, Jaipur.',
  keywords: [
    'Ayurvedic treatments Jaipur',
    'Panchakarma therapy Jaipur',
    'Shirodhara Rajasthan',
    'Kati Basti sciatica relief',
    'Virechana skin detox',
    'Basti Karma Vata relief',
    'Netra Tarpana eye care',
    'Dr Aditya Bohra treatments',
  ],
  openGraph: {
    title: 'Classical Ayurvedic Treatments & Panchakarma Protocols | Aarogyam',
    description:
      'Explore 12 authentic classical Ayurvedic therapies documented in Charaka and Sushruta Samhitas. Administered under pulse diagnosis at Aarogyam Jaipur.',
    url: 'https://aarogyamayurveda.com/treatments',
    siteName: 'Aarogyam Classical Ayurveda Clinic',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TreatmentsPage() {
  return <TreatmentsDirectory treatments={treatments} />;
}
