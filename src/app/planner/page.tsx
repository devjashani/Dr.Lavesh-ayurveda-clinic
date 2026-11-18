import React from 'react';
import type { Metadata } from 'next';
import { PlannerClient } from './PlannerClient';

export const metadata: Metadata = {
  title: 'Panchakarma Protocol Planner & Fee Estimator | Vankal Ayurveda',
  description:
    'Calculate and customize your classical Panchakarma therapy package at Vankal Ayurveda Jaipur. Live duration calculator, fee estimator in ₹, and classical Samhita sequencing.',
  keywords: [
    'Panchakarma cost calculator',
    'Ayurveda therapy package planner',
    'Shirodhara pricing Jaipur',
    'Kati Basti package cost',
    'Ayurveda session estimator',
    'Vankal Ayurveda Jaipur',
  ],
  openGraph: {
    title: 'Panchakarma Protocol Planner & Fee Estimator | Vankal',
    description:
      'Live duration calculator, fee estimator in ₹, and classical Samhita therapy sequencing.',
    url: 'https://vankalayurveda.com/planner',
    siteName: 'Vankal Ayurveda',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PlannerPage() {
  return <PlannerClient />;
}
