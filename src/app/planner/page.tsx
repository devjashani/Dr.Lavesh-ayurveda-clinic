import React from 'react';
import type { Metadata } from 'next';
import { PlannerClient } from './PlannerClient';

export const metadata: Metadata = {
  title: 'Panchakarma Protocol Planner & Fee Estimator | Aarogyam Ayurveda',
  description:
    'Calculate and customize your classical Panchakarma therapy package at Aarogyam Ayurveda Jaipur. Live duration calculator, fee estimator in ₹, and classical Samhita sequencing.',
  keywords: [
    'Panchakarma cost calculator',
    'Ayurveda therapy package planner',
    'Shirodhara pricing Jaipur',
    'Kati Basti package cost',
    'Ayurveda session estimator',
    'Aarogyam Ayurveda Jaipur',
  ],
  openGraph: {
    title: 'Panchakarma Protocol Planner & Fee Estimator | Aarogyam',
    description:
      'Live duration calculator, fee estimator in ₹, and classical Samhita therapy sequencing.',
    url: 'https://aarogyamayurveda.com/planner',
    siteName: 'Aarogyam Classical Ayurveda Clinic',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PlannerPage() {
  return <PlannerClient />;
}
