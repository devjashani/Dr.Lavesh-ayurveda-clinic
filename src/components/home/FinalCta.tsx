'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MessageCircle, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { Reveal, RevealText, Magnetic } from '@/components/motion';

export function FinalCta() {
  return (
    <section
      suppressHydrationWarning
      className="py-20 sm:py-28 bg-deep-forest text-cream relative overflow-hidden content-auto"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-turmeric/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="narrow" className="relative z-10 text-center">
        <Reveal delay={0} direction="up">
          <Badge variant="cream" className="mb-6">
            Begin Your Restoration
          </Badge>
        </Reveal>

        <RevealText as="h2" delay={0.08} className="text-display-h1 text-cream font-normal tracking-tight max-w-2xl mx-auto leading-tight justify-center">
          Your health is not a symptom to suppress, but a living rhythm to restore.
        </RevealText>

        <Reveal delay={0.16} direction="up" blur={true}>
          <div className="space-y-4 mt-4">
            <p className="font-serif italic text-paper/80 text-xl">
              &ldquo;શરીરમાદ્યં ખલુ ધર્મસાધનમ્&rdquo; — The body is the foremost vessel for purposeful life.
            </p>

            <p className="text-body-base text-paper/75 max-w-xl mx-auto leading-relaxed">
              Whether you are seeking personalized dietary roadmaps, daily routine guidance, or individual Ayurvedic consultations, Dr. Lavesh Bohra is ready to guide you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2} direction="up" blur={false}>
          <BotanicalDivider variant="lotus" tone="paper" className="my-8 max-w-xs mx-auto opacity-40" />
        </Reveal>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <Magnetic strength={10}>
            <Button
              href="/book"
              variant="turmeric"
              size="lg"
              icon={<Calendar className="w-4 h-4 text-deep-forest" />}
              iconPosition="left"
            >
              Schedule Consultation (₹1,200)
            </Button>
          </Magnetic>

          <Magnetic strength={8}>
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              className="text-cream border-cream/40 hover:bg-cream hover:text-deep-forest"
              icon={<MessageCircle className="w-4 h-4" />}
              iconPosition="left"
            >
              Contact & Inquiries
            </Button>
          </Magnetic>
        </div>

        {/* Reassurance Grid */}
        <Reveal delay={0.28} direction="up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-forest/40 text-xs text-paper/70">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-turmeric shrink-0" />
              <span>Registration No.: to be added</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-turmeric shrink-0" />
              <span>Address: to be added</span>
            </div>

            <a
              href="tel:+919016432576"
              className="flex items-center justify-center gap-2 hover:text-turmeric transition-colors"
            >
              <Phone className="w-4 h-4 text-turmeric shrink-0" />
              <span>Phone: +91 9016432576</span>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

