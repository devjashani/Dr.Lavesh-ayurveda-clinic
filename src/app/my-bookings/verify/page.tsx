import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { MagicLinkVerifyClient } from './MagicLinkVerifyClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Confirm Sign In | Vankal Ayurveda',
  description: 'Confirm your email sign-in link to access your Vankal Ayurveda consultations.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyMagicLinkPage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <Suspense
        fallback={
          <div className="max-w-md mx-auto px-4 py-28 text-center font-mono text-xs text-forest/70">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-forest" />
            <span>Loading verification...</span>
          </div>
        }
      >
        <MagicLinkVerifyClient />
      </Suspense>
    </main>
  );
}
