import React from 'react';
import type { Metadata } from 'next';
import { PatientPortalClient } from './PatientPortalClient';

export const metadata: Metadata = {
  title: 'Patient Health Portal & Digital Apothecary | Aarogyam Ayurveda',
  description:
    'Access your digital Ayurvedic health records, Nadi Pariksha pulse analysis, tailored Ritucharya diet plans, and refill prescribed botanical formulations.',
  openGraph: {
    title: 'Patient Health Portal | Aarogyam Ayurveda',
    description:
      'Digital patient records, pulse timeline, herbal prescriptions, and Panchakarma treatment progression.',
  },
};

export default function PortalPage() {
  return <PatientPortalClient />;
}
