import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact & Inquiries | Vankal Ayurveda',
  description:
    'Schedule an individual Ayurvedic consultation or connect with Dr. Lavesh Bohra at Vankal Ayurveda.',
  openGraph: {
    title: 'Contact Vankal Ayurveda',
    description:
      'Schedule consultations, access timings, and submit health inquiries to Vankal Ayurveda.',
  },
};

export default function ContactPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Page Header */}
      <Container className="mb-10 md:mb-14">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            સંપર્ક સૂત્ર · Connect with Vankal Ayurveda
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-6">
            Begin Your Healing Dialogue. <br />
            <span className="italic font-normal text-turmeric">
              In-Person or Online.
            </span>
          </h1>
          <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed">
            We provide individualized Ayurvedic consultations and personalized lifestyle care. Submit your inquiry below, or schedule your consultation directly.
          </p>
        </div>
      </Container>

      {/* Main Form & Hours Client Component */}
      <Container>
        <ContactClient />
      </Container>
    </div>
  );
}
