'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { ShieldCheck, Award, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export function DoctorSection() {
  return (
    <section className="py-20 sm:py-28 bg-paper border-b border-forest/15 relative overflow-hidden">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Large Portrait in Arch Mask */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-t-[160px] rounded-b-[4px] overflow-hidden bg-cream border border-forest/20 shadow-[0_12px_36px_rgba(20,41,28,0.08)]">
              <Image
                src="/images/doctors/dr-lavesh-bohra.jpg"
                alt="Dr. Lavesh Bohra, Senior Ayurvedic Physician"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-5 right-5 text-cream flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-turmeric block">
                    AYUSH Registration No.
                  </span>
                  <span className="font-mono text-xs font-semibold">
                    AYUSH-RJ-1999-4081
                  </span>
                </div>
                <span className="font-serif italic text-xs text-paper/80">
                  वरिष्ठ वैद्य
                </span>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-5 -right-2 sm:-right-6 bg-deep-forest text-cream p-4 rounded-[4px] border border-forest/30 shadow-lg text-left max-w-[200px]">
              <span className="font-display text-3xl font-light text-turmeric block leading-none">
                24+
              </span>
              <span className="text-[11px] font-sans text-paper/80 mt-1 block">
                Years of Continuous Clinical Pulse Practice
              </span>
            </div>
          </div>

          {/* Right Column: Physician Biography & Credentials */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
              <span className="text-eyebrow font-semibold text-forest tracking-widest">
                Chief Ayurvedic Physician & Founder
              </span>
            </div>

            <div>
              <h2 className="text-display-h2 text-deep-forest font-normal tracking-tight">
                Dr. Lavesh Bohra
              </h2>
              <p className="font-serif italic text-forest/80 text-lg mt-0.5">
                BAMS (NIA Jaipur), MD (Ayurveda Kayachikitsa), PhD (Panchakarma)
              </p>
            </div>

            <p className="text-body-base text-ink/80 leading-relaxed">
              Descended from a multi-generational lineage of Rajasthan Vaidyas, Dr. Bohra brings over two decades of uncompromising clinical rigor to Aarogyam. He trained under celebrated traditional pulse masters in Varanasi and Kerala before establishing the inpatient Panchakarma hospital in Civil Lines, Jaipur.
            </p>

            <p className="text-body-base text-ink/80 leading-relaxed">
              His diagnostic approach combines classical <em>Ashtavidha Pariksha</em> (eight-fold Ayurvedic examination) with modern investigative biochemistry, ensuring every chronic care plan is both anciently sound and scientifically measurable.
            </p>

            {/* Consultation Details Card */}
            <div className="w-full bg-cream rounded-[4px] border border-forest/15 p-5 space-y-3 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-forest/80 font-semibold block">
                    Consultation Hours
                  </span>
                  <p className="text-deep-forest font-medium mt-0.5">
                    Mon – Sat: 9:00 AM – 1:30 PM<br />
                    Evening: 4:30 PM – 7:30 PM
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-forest/80 font-semibold block">
                    Consultation Fee
                  </span>
                  <p className="text-deep-forest font-medium mt-0.5">
                    <strong className="text-base text-deep-forest">₹1,200</strong>
                    <span className="text-[11px] text-ink/75 block">Includes 45-min pulse reading & diet chart</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-forest/10 flex flex-wrap items-center gap-4">
                <Button
                  href="/book?doctor=dr-lavesh-bohra"
                  variant="primary"
                  size="md"
                  showArrow
                >
                  Book with Dr. Bohra
                </Button>
                <Button
                  href="/doctors/dr-lavesh-bohra"
                  variant="secondary"
                  size="md"
                >
                  View Full Profile & Case Papers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

