import React from 'react';
import type { Metadata } from 'next';
import { AdminClient } from './AdminClient';

export const metadata: Metadata = {
  title: 'Vaidya EMR & Admin Console | Aarogyam Ayurveda',
  description:
    'Clinical operations console for Aarogyam Ayurvedic Chikitsalaya. Manage daily Nadi Pariksha OPD queues, patient histories, weekly doctor schedules, and classical prescription generation.',
};

export default function AdminPage() {
  return <AdminClient />;
}
