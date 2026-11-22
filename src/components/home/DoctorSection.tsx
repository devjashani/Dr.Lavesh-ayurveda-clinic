'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/lib/config/images';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { ShieldCheck, Award, Clock, Calendar, CheckCircle2, Phone } from 'lucide-react';
import { Reveal, RevealText, RevealImage, Magnetic } from '@/components/motion';
import { BreathingHaloOrnament } from '@/components/ui/BreathingHaloOrnament';
import { BotanicalLeafSketch } from '@/components/ui/BotanicalLeafSketch';
import { SectionMarginIndex } from '@/components/ui/SectionMarginIndex';

export function DoctorSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 sm:py-28 bg-paper border-b border-forest/15 relative overflow-hidden content-auto">
      {/* 1. Hand-Drawn Neem Botanical Sketch cropped off the bottom-left edge */}
      <BotanicalLeafSketch variant="neem" position="bottom-left" />

      {/* 4. Section Margin Number revealed with a mask slide */}
      <SectionMarginIndex number="05" label="VAIDYA" gujaratiLabel="વૈદ્ય" />

      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Large Portrait in Arch Mask with 3. Breathing Ornament */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* 3. Tiny "breathing" ornament (scale 1 to 1.04, 7s loop, paused when off-screen) */}
            <BreathingHaloOrnament />

            <RevealImage
              shape="arch"
              src={IMAGES.doctorPortrait}
              alt={t.doctor.imageAlt}
              className="w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-t-[160px] rounded-b-[4px] bg-cream border border-forest/20 shadow-[0_12px_36px_rgba(20,41,28,0.08)]"
              imageClassName="object-cover object-top scale-[1.14] origin-top"
              sizes="(max-width: 768px) 90vw, 480px"
              priority={false}
              placeholder="blur"
              blurDataURL={IMAGES.doctorPortraitBlur}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-5 right-5 text-cream flex items-baseline justify-between z-10">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-turmeric block">
                    Ayurvedic Practitioner
                  </span>
                  <span className="font-mono text-xs font-semibold">
                    BAMS (2026), SMIAS
                  </span>
                </div>
                <span className="font-serif italic text-xs text-paper/80">
                  નોંધાયેલા વૈદ્ય
                </span>
              </div>
            </RevealImage>
          </div>

          {/* Right Column: Physician Biography & Credentials */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
            <Reveal delay={0.08} direction="up">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                <span className="text-eyebrow font-semibold text-forest tracking-widest">
                  Registered Ayurvedic Practitioner
                </span>
              </div>
            </Reveal>

            <div>
              <RevealText as="h2" delay={0.16} className="text-display-h2 text-deep-forest font-normal tracking-tight">
                Dr. Lavesh Bohra
              </RevealText>
              <Reveal delay={0.24} direction="up">
                <p className="font-serif italic text-forest/80 text-lg mt-0.5">
                  BAMS (2026), SMIAS, Gujarat Ayurved University
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.28} direction="up" blur={true}>
              <div className="space-y-4">
                <p className="text-body-base text-ink/80 leading-relaxed">
                  Dr. Lavesh Bohra is a Registered Ayurvedic Practitioner who completed his BAMS (2026) from SMIAS, Gujarat Ayurved University. His clinical practice focuses on individual Ayurvedic consultations and personalized lifestyle care, guiding individuals through tailored diet, daily routines, and seasonal health management.
                </p>

                <p className="text-body-base text-ink/80 leading-relaxed">
                  Consultations are thorough and individualized, dedicated to understanding your unique constitution (<em>Prakriti</em>) and root-cause balance through classical Ayurvedic examination and actionable daily guidance.
                </p>
              </div>
            </Reveal>

            {/* Consultation Details Card */}
            <Reveal delay={0.36} direction="up" className="w-full">
              <div className="w-full bg-cream rounded-[4px] border border-forest/15 p-5 space-y-3 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-forest/80 font-semibold block">
                      Consultation Hours
                    </span>
                    <p className="text-deep-forest font-medium mt-0.5">
                      Mon – Sat: By prior appointment<br />
                      In-Person & Online Sessions
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-forest/80 font-semibold block">
                      Consultation Fee
                    </span>
                    <p className="text-deep-forest font-medium mt-0.5">
                      <strong className="text-base text-deep-forest">₹499</strong>
                      <span className="text-[11px] text-ink/75 block">Includes intake, Prakriti assessment & lifestyle plan</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-forest/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <Magnetic strength={8}>
                      <Button
                        href="/book?doctor=dr-lavesh-bohra"
                        variant="primary"
                        size="md"
                        showArrow
                      >
                        Book Consultation
                      </Button>
                    </Magnetic>
                    <Magnetic strength={6}>
                      <Button
                        href="/doctors/dr-lavesh-bohra"
                        variant="secondary"
                        size="md"
                      >
                        View Full Profile
                      </Button>
                    </Magnetic>
                  </div>
                  <a
                    href="tel:+919016432576"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-forest hover:text-turmeric transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-turmeric" />
                    <span>+91 9016432576</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

