import React from 'react';
import type { Metadata } from 'next';
import { DoshaQuizClient } from './DoshaQuizClient';

export const metadata: Metadata = {
  title: 'Dosha Constitution Quiz (Prakriti Pariksha) | Aarogyam Ayurveda',
  description:
    'Discover your unique Ayurvedic mind-body constitution (Vata, Pitta, Kapha) with our classical 10-point Prakriti self-assessment based on Charaka Samhita. Get customized diet, herb, and Panchakarma guidance.',
  keywords: [
    'Dosha quiz Ayurveda',
    'Prakriti test online',
    'Vata Pitta Kapha quiz',
    'Ayurvedic body type test',
    'Charaka Samhita Prakriti',
    'Aarogyam Ayurveda Jaipur',
  ],
  openGraph: {
    title: 'Dosha Constitution Quiz (Prakriti Pariksha) | Aarogyam',
    description:
      'Discover your unique Ayurvedic mind-body constitution (Vata, Pitta, Kapha) with our classical 10-point assessment.',
    url: 'https://aarogyamayurveda.com/dosha-quiz',
    siteName: 'Aarogyam Classical Ayurveda Clinic',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function DoshaQuizPage() {
  return <DoshaQuizClient />;
}
