'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion';

interface ConditionTag {
  name: string;
  sanskrit: string;
  category: string;
}

const conditionsList: ConditionTag[] = [
  { name: 'Rheumatoid Arthritis', sanskrit: 'આમવાત', category: 'Joints & Autoimmune' },
  { name: 'PCOS & Hormonal Irregularity', sanskrit: 'આર્તવ ક્ષય', category: 'Women’s Health' },
  { name: 'Chronic Insomnia', sanskrit: 'અનિદ્રા', category: 'Neurological & Sleep' },
  { name: 'Psoriasis & Severe Eczema', sanskrit: 'કુષ્ઠ રોગ', category: 'Dermatology' },
  { name: 'Migraine & Cervical Spondylosis', sanskrit: 'અર્ધાવભેદક', category: 'Neurological' },
  { name: 'Ulcerative Colitis & Chronic IBS', sanskrit: 'ગ્રહણી દોષ', category: 'Gut & Digestion' },
  { name: 'Fatty Liver & Metabolic Sluggishness', sanskrit: 'યકૃત્ વિકાર', category: 'Metabolism' },
  { name: 'Allergic Sinusitis & Rhinitis', sanskrit: 'દુષ્ટ પ્રતિશ્યાય', category: 'Respiratory & ENT' },
  { name: 'Lumbar Disc Prolapse & Sciatica', sanskrit: 'ગૃધ્રસી', category: 'Spine & Joints' },
  { name: 'Ankylosing Spondylitis', sanskrit: 'અસ્થિમજ્જાગત વાત', category: 'Autoimmune' },
  { name: 'Type-2 Diabetes Metabolic Support', sanskrit: 'પ્રમેહ', category: 'Metabolism' },
  { name: 'Premature Hair Fall & Scalp Psoriasis', sanskrit: 'ખાલિત્ય', category: 'Dermatology' },
];

export function ConditionsCloud() {
  return (
    <section className="py-20 sm:py-24 bg-cream/70 border-b border-forest/15 relative overflow-hidden">
      <Container size="default">
        <Reveal delay={0} direction="up">
          <SectionHeading
            eyebrow="Clinical Areas"
            sanskritEyebrow="વ્યાધિ વિમર્શ"
            title="Areas of Ayurvedic Consultation"
            subtitle="We provide individualized Ayurvedic consultations and personalized lifestyle guidance for digestive, metabolic, joint, and stress-related concerns."
            align="center"
          />
        </Reveal>

        {/* Compact Tag Cloud */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto mt-10">
          {conditionsList.map((cond, idx) => (
            <Reveal key={cond.name} delay={0.1 + (idx % 6) * 0.05} direction="up" blur={false}>
              <Link
                href="/conditions"
                className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[4px] bg-paper border border-forest/20 text-deep-forest hover:border-forest hover:bg-forest/5 transition-all duration-200 text-xs sm:text-sm shadow-2xs"
              >
                <span className="font-sans font-medium">{cond.name}</span>
                <span className="font-serif italic text-xs text-forest/85 font-medium group-hover:text-forest transition-colors">
                  ({cond.sanskrit})
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-forest/40 group-hover:text-forest transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Reveal delay={0.35} direction="up">
            <Link
              href="/conditions"
              className="animated-underline text-xs font-semibold uppercase tracking-widest text-forest"
            >
              Explore all 34 clinical pathology monographs →
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

