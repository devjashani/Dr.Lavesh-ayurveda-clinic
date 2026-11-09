import React from 'react';
import type { Metadata } from 'next';
import { blogs } from '@/lib/data';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { BlogDirectory } from './BlogDirectory';
import { NewsletterCard } from '@/components/blog/NewsletterCard';

export const metadata: Metadata = {
  title: 'Ayurvedic Wisdom & Clinical Monographs | Aarogyam Ayurveda',
  description:
    'Classical treatises and clinical insights on digestive Agni, knee pain management, insomnia, Ritucharya, Dinacharya, and Panchakarma science.',
  openGraph: {
    title: 'Ayurvedic Wisdom & Clinical Monographs | Aarogyam Ayurveda',
    description:
      'Rigorous, authentic articles authored by senior Vaidyas bridging Charaka Samhita with contemporary clinical research.',
  },
};

export default function BlogPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Page Header */}
      <Container className="mb-12 md:mb-16">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            आयुर्वेद ज्ञानम् · Ayurvedic Wisdom & Clinical Monographs
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-6">
            Classical Samhita Wisdom. <br />
            <span className="italic font-normal text-turmeric">
              Translated for Modern Health.
            </span>
          </h1>
          <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed">
            Written by our resident physicians, each monograph unpacks foundational Ayurvedic
            principles—from the cellular mechanics of Panchakarma to circadian morning rituals—free
            from generic wellness clichés and grounded in authentic Sanskrit texts.
          </p>
        </div>
      </Container>

      {/* Interactive Blog Directory with Category Filtering */}
      <BlogDirectory posts={blogs} />

      <BotanicalDivider className="my-16" />

      {/* Ayurvedic Wisdom Digest Sign-up */}
      <Container>
        <NewsletterCard />
      </Container>
    </div>
  );
}
