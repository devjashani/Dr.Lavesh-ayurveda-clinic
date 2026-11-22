import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ReviewClient } from './ReviewClient';

export const metadata: Metadata = {
  title: 'Review & Pay | VANKAL AYURVEDA',
  description:
    'Review your Ayurvedic consultation details and proceed to secure online payment with Dr. Lavesh Bohra.',
};

export default function BookReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-mono text-xs text-forest/70">
          Loading appointment review...
        </div>
      }
    >
      <ReviewClient />
    </Suspense>
  );
}
