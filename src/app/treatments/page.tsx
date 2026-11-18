import React from 'react';
import type { Metadata } from 'next';
import { treatments } from '@/lib/data/treatments';
import { TreatmentsDirectory } from './TreatmentsDirectory';

export const metadata: Metadata = {
  title: 'Classical Ayurvedic Therapies & Protocols | Vankal Ayurveda',
  description:
    'Explore classical Ayurvedic therapies including Vamana, Virechana, Basti Karma, Shirodhara, Kati Basti, and Netra Tarpana at Vankal Ayurveda.',
  keywords: [
    'Ayurvedic treatments',
    'Panchakarma therapy',
    'Shirodhara',
    'Kati Basti sciatica',
    'Virechana skin care',
    'Basti Karma',
    'Netra Tarpana',
    'Dr Lavesh Bohra treatments',
  ],
  openGraph: {
    title: 'Classical Ayurvedic Therapies & Protocols | Vankal Ayurveda',
    description:
      'Explore classical Ayurvedic therapies documented in Charaka and Sushruta Samhitas at Vankal Ayurveda.',
    url: 'https://vankalayurveda.com/treatments',
    siteName: 'Vankal Ayurveda',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TreatmentsPage() {
  return <TreatmentsDirectory treatments={treatments} />;
}
