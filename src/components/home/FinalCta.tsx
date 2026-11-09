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
      data-dark-section="true"
      className="py-20 sm:py-28 bg-deep-forest text-cream relative overflow-hidden"
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
              &ldquo;शरीरमाद्यं खलु धर्मसाधनम्&rdquo; — The body is the foremost vessel for purposeful life.
            </p>

            <p className="text-body-base text-paper/75 max-w-xl mx-auto leading-relaxed">
              Whether you are facing chronic joint inflammation, stubborn metabolic fatigue, or seek classical Panchakarma detoxification in Jaipur, our Vaidyas are ready to welcome you.
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
              href="https://wa.me/911412458890?text=Namaste%20Aarogyam%20Ayurveda%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation."
              external
              variant="secondary"
              size="lg"
              className="text-cream border-cream/40 hover:bg-cream hover:text-deep-forest"
              icon={<MessageCircle className="w-4 h-4" />}
              iconPosition="left"
            >
              Direct Vaidya WhatsApp
            </Button>
          </Magnetic>
        </div>

        {/* Reassurance Grid */}
        <Reveal delay={0.28} direction="up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-forest/40 text-xs text-paper/70">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-turmeric shrink-0" />
              <span>Reg. No. AYUSH-RJ-2018-0482</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-turmeric shrink-0" />
              <span>Civil Lines, Jaipur (Inpatient & OPD)</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-turmeric shrink-0" />
              <span>Care Helpline: +91 (141) 245-8890</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

