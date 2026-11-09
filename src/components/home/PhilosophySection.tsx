'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
          आयुर्वेद
        </text>
      </svg>

      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Sanskrit Pull Quote */}
          <div className="lg:col-span-6 flex flex-col justify-center border-l-2 border-turmeric/70 pl-6 sm:pl-10">
            <Badge variant="sage" dot className="self-start mb-4">
              Classical Creed • Charaka Samhita
            </Badge>

            <blockquote className="space-y-4">
              <p className="font-serif text-2xl sm:text-3xl text-deep-forest leading-relaxed font-normal">
                &ldquo;प्रयोजनं चास्य स्वस्थस्य स्वास्थ्यरक्षणमातुरस्य विकारप्रशमनं च॥&rdquo;
              </p>

              <cite className="block text-xs font-mono tracking-wider text-forest/70 uppercase not-italic">
                — चरक संहिता, सूत्रस्थान ३०/२६
              </cite>

              <p className="text-body-base text-ink/80 leading-relaxed pt-2 font-display italic text-lg sm:text-xl">
                &ldquo;The paramount purpose of Ayurveda is twofold: to preserve the pristine health of the healthy, and to decisively pacify disease from the root in those who suffer.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* RIGHT: We Treat the Root, Not the Symptom */}
          <div className="lg:col-span-6 flex flex-col space-y-5 text-left">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
              <span className="text-eyebrow font-semibold text-forest tracking-widest">
                Our Clinical Doctrine
              </span>
            </div>

            <h2 className="text-display-h2 text-deep-forest font-normal tracking-tight">
              We treat the biological root, never merely the symptom.
            </h2>

            <p className="text-body-base text-ink/80 leading-relaxed">
              When modern pharmaceuticals suppress pain, rashes, or acidity, the underlying metabolic endotoxin (<em>Ama</em>) is rarely eliminated. Instead, it is driven deeper into the constitutional tissues (<em>Dhatus</em>), re-emerging years later as chronic autoimmune or degenerate disease.
            </p>

            <p className="text-body-base text-ink/80 leading-relaxed">
              At Aarogyam, our Vaidyas decipher your subtle radial pulse to identify where cellular intelligence has strayed. Through individualized dietary protocol (<em>Pathya</em>), bio-cleansing (<em>Shodhana</em>), and herbs aged in bronze vessels, we awaken your body’s sovereign power to heal itself.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/about"
                className="animated-underline text-forest font-semibold text-sm tracking-wide inline-flex items-center gap-1.5 group"
              >
                <span>Read our clinical heritage & lineage</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

