import React from 'react';
import { Metadata } from 'next';
import { MyBookingsClient } from './MyBookingsClient';

export const metadata: Metadata = {
  title: 'My Bookings | Vankal Ayurveda',
  description:
    'Access your booked Ayurvedic consultations, join your video consultation room, and view payment receipts.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <MyBookingsClient />
    </main>
  );
}
