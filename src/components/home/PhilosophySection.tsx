'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal, RevealText } from '@/components/motion';

export function PhilosophySection() {
  return (
    <section className="py-20 sm:py-28 bg-cream/70 border-b border-forest/15 relative overflow-hidden">
      {/* Decorative ambient watermark */}
      <svg
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] w-[500px] h-[200px]"
        viewBox="0 0 500 150"
      >
        <text
          x="100%"
          y="60%"
          textAnchor="end"
          dominantBaseline="middle"
          className="font-serif text-[110px] fill-deep-forest"
        >
          આયુર્વેદ
        </text>
      </svg>

      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Sanskrit Pull Quote */}
          <Reveal
            delay={0.08}
            direction="left"
            blur={true}
            className="lg:col-span-6 flex flex-col justify-center border-l-2 border-turmeric/70 pl-6 sm:pl-10"
          >
            <Badge variant="sage" dot className="self-start mb-4">
              Classical Creed • Charaka Samhita
            </Badge>

            <blockquote className="space-y-4">
              <p className="font-serif text-2xl sm:text-3xl text-deep-forest leading-relaxed font-normal">
                &ldquo;પ્રયોજનં ચાસ્ય સ્વસ્થસ્ય સ્વાસ્થ્યરક્ષણમાતુરસ્ય વિકારપ્રશમનં ચ||&rdquo;
              </p>

              <cite className="block text-xs font-mono tracking-wider text-forest/70 uppercase not-italic">
                — ચરક સંહિતા, સૂત્રસ્થાન ૩૦/૨૬
              </cite>

              <p className="text-body-base text-ink/80 leading-relaxed pt-2 font-display italic text-lg sm:text-xl">
                &ldquo;The paramount purpose of Ayurveda is twofold: to preserve the pristine health of the healthy, and to decisively pacify disease from the root in those who suffer.&rdquo;
              </p>
            </blockquote>
          </Reveal>

          {/* RIGHT: We Treat the Root, Not the Symptom */}
          <div className="lg:col-span-6 flex flex-col space-y-5 text-left">
            <Reveal delay={0.12} direction="down" blur={false}>
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                <span className="text-eyebrow font-semibold text-forest tracking-widest">
                  Our Clinical Doctrine
                </span>
              </div>
            </Reveal>

            <RevealText
              as="h2"
              delay={0.18}
              lines={[
                'We treat the biological root,',
                'never merely the symptom.',
              ]}
              className="text-display-h2 text-deep-forest font-normal tracking-tight"
            />

            <Reveal delay={0.28} blur={true}>
              <p className="text-body-base text-ink/80 leading-relaxed">
                When lifestyle imbalances, poor digestion, or stress disturb your natural rhythm, suppressing symptoms rarely provides lasting equilibrium. Classical Ayurveda focuses on identifying underlying disharmonies and restoring metabolic balance (<em>Agni</em>) through thoughtful, patient care.
              </p>
            </Reveal>

            <Reveal delay={0.36} blur={true}>
              <p className="text-body-base text-ink/80 leading-relaxed">
                At Vankal Ayurveda, Dr. Lavesh Bohra provides individual consultations and personalized lifestyle care. Through tailored dietary guidance (<em>Ahara</em>), daily habits (<em>Dinacharya</em>), and seasonal routines (<em>Ritucharya</em>), we support your body’s natural capacity to maintain vitality.
              </p>
            </Reveal>

            <Reveal delay={0.42} blur={false}>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/about"
                  className="animated-underline text-forest font-semibold text-sm tracking-wide inline-flex items-center gap-1.5 group"
                >
                  <span>Learn about our philosophy & approach</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

