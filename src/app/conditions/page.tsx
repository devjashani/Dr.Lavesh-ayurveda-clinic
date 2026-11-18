import React from 'react';
import type { Metadata } from 'next';
import { conditions, treatments } from '@/lib/data';
import { ConditionsDirectory } from './ConditionsDirectory';

export const metadata: Metadata = {
  title: 'Health Conditions & Ayurvedic Consultations | Vankal Ayurveda',
  description:
    'Directory of conditions addressed through classical Ayurveda: Arthritis, Sciatica, PCOD, Thyroid, Psoriasis, Migraine, Insomnia, and IBS. Prescribed via classical consultation by Dr. Lavesh Bohra.',
  keywords: [
    'Ayurveda for arthritis',
    'Ayurvedic sciatica management',
    'PCOD Ayurveda care root cause',
    'Psoriasis Ayurvedic care',
    'Migraine Ayurveda',
    'Thyroid Ayurveda management',
    'Insomnia Ayurveda care',
    'Dr Lavesh Bohra clinical conditions',
  ],
  openGraph: {
    title: 'Health Conditions We Treat · Classical Ayurvedic Pathology | Vankal',
    description:
      'A–Z directory of chronic conditions treated through authentic Samhita protocols and Nadi Pariksha.',
    url: 'https://vankalayurveda.com/conditions',
    siteName: 'Vankal Ayurveda',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ConditionsPage() {
  return <ConditionsDirectory conditions={conditions} treatments={treatments} />;
}
