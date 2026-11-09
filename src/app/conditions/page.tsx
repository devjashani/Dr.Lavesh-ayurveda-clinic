import React from 'react';
import type { Metadata } from 'next';
import { conditions, treatments } from '@/lib/data';
import { ConditionsDirectory } from './ConditionsDirectory';

export const metadata: Metadata = {
  title: 'Health Conditions We Treat · Classical Ayurvedic Pathology | Aarogyam Jaipur',
  description:
    'A–Z clinical directory of conditions managed through classical Ayurveda: Arthritis, Sciatica, PCOD, Thyroid, Psoriasis, Migraine, Insomnia, and IBS. Prescribed via Nadi Pariksha by Dr. Lavesh Bohra, Civil Lines, Jaipur.',
  keywords: [
    'Ayurveda for arthritis',
    'Ayurvedic sciatica treatment Jaipur',
    'PCOD Ayurveda cure root cause',
    'Psoriasis Ayurvedic treatment',
    'Migraine Ayurveda Jaipur',
    'Thyroid Ayurveda management',
    'Insomnia Shirodhara Jaipur',
    'Dr Lavesh Bohra clinical conditions',
  ],
  openGraph: {
    title: 'Health Conditions We Treat · Classical Ayurvedic Pathology | Aarogyam',
    description:
      'A–Z directory of chronic conditions treated through authentic Samhita protocols and Nadi Pariksha.',
    url: 'https://aarogyamayurveda.com/conditions',
    siteName: 'Aarogyam Classical Ayurveda Clinic',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ConditionsPage() {
  return <ConditionsDirectory conditions={conditions} treatments={treatments} />;
}
