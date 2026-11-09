import React from 'react';
import type { Metadata } from 'next';
import { faqs } from '@/lib/data';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { FaqClient } from './FaqClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Aarogyam Ayurveda Jaipur',
  description:
    'Comprehensive answers regarding Nadi Pariksha preparation, residential Panchakarma stays, AYUSH health insurance claims, and herbal medicine safety.',
  openGraph: {
    title: 'Frequently Asked Questions (FAQ) | Aarogyam Ayurveda',
    description:
      'Everything you need to know about preparing for your first Ayurvedic consultation, Panchakarma protocols, and clinic policies.',
  },
};

export default function FaqPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Page Header */}
      <Container className="mb-8 md:mb-12">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            प्रश्नोत्तरी · Frequently Asked Questions
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-6">
            Clear Answers to Guide <br />
            <span className="italic font-normal text-turmeric">
              Your Clinical Experience.
            </span>
          </h1>
          <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed">
            Whether preparing for your first early-morning Nadi Pariksha or organizing an extended
            21-day residential Panchakarma stay, find transparent, medically rigorous answers below.
          </p>
        </div>
      </Container>

      {/* Interactive FAQ Client */}
      <FaqClient faqs={faqs} />
    </div>
  );
}
