'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Reveal, Magnetic } from '@/components/motion';
import { usePrefersReducedMotion, MOTION_TOKENS } from '@/lib/motion';

interface TherapyItem {
  id: string;
  number: string;
  name: string;
  sanskrit: string;
  benefit: string;
  duration: string;
  primaryDosha: string;
  herbs: string;
  image: string;
}

const therapies: TherapyItem[] = [
  {
    id: 'shirodhara',
    number: '01',
    name: 'Shirodhara Therapy',
    sanskrit: 'शिरोधारा विधानम्',
    benefit:
      'Continuous rhythmic stream of warm herbal Brahmi oil soothing the central nervous system, insomnia & anxiety.',
    duration: '60 min · 7-day cycle',
    primaryDosha: 'Vata Pacifying',
    herbs: 'Brahmi, Ashwagandha, Jatamansi',
    image: '/images/treatments/shirodhara.jpg',
  },
  {
    id: 'kati-basti',
    number: '02',
    name: 'Kati Basti (Lumbar Reservoir)',
    sanskrit: 'कटि बस्ति',
    benefit:
      'Medicated black-gram dough ring holding warm Mahanarayan oil to relieve disc degeneration and sciatica.',
    duration: '45 min · 5 to 7 days',
    primaryDosha: 'Vata Relief',
    herbs: 'Mahanarayan, Dashamoola, Bala',
    image: '/images/treatments/abhyanga.jpg',
  },
  {
    id: 'abhyanga',
    number: '03',
    name: 'Synchronized Abhyanga',
    sanskrit: 'अभ्यङ्ग एवं स्वेदन',
    benefit:
      'Two-practitioner synchronized full-body herbal massage stimulating 107 vital Marma energy junctions.',
    duration: '75 min · Daily therapy',
    primaryDosha: 'Tridoshic Balance',
    herbs: 'Sesame, Bala, Ksheerabala 101',
    image: '/images/treatments/herbs.jpg',
  },
  {
    id: 'nasya',
    number: '04',
    name: 'Nasya (Shalakya Tantra)',
    sanskrit: 'नस्य कर्म',
    benefit:
      'Trans-nasal delivery of Anu Thailam clears cranial micro-channels, chronic migraine, sinusitis & cervical tension.',
    duration: '30 min · 7-day protocol',
    primaryDosha: 'Kapha-Vata Clearance',
    herbs: 'Anu Thailam, Shadbindu Taila',
    image: '/images/treatments/apothecary.jpg',
  },
  {
    id: 'virechana',
    number: '05',
    name: 'Virechana Bio-Cleansing',
    sanskrit: 'विरेचन शुद्धि',
    benefit:
      'Classical targeted therapeutic purgation purging accumulated morbid Pitta, hepatic toxins and skin inflammation.',
    duration: 'Full-day clinical cycle',
    primaryDosha: 'Pitta Detox',
    herbs: 'Triphala, Avipattikar, Eranda',
    image: '/images/treatments/panchakarma.jpg',
  },
  {
    id: 'basti',
    number: '06',
    name: 'Classical Basti Karma',
    sanskrit: 'बस्ति कर्म (अर्धचिकित्सा)',
    benefit:
      'Revered as 50% of all Ayurveda: herbal decoction and unctuous oil enemas pacifying Vata at its root colon seat.',
    duration: '8 to 16 day protocol',
    primaryDosha: 'Vata Root Care',
    herbs: 'Dashamoola Decoction, Sahacharadi',
    image: '/images/treatments/shirodhara.jpg',
  },
];

/**
 * Individual Pinned Therapy Card with Number and Title Parallax at Different Speeds
 */
function PinnedTherapyCard({
  therapy,
  scrollYProgress,
}: {
  therapy: TherapyItem;
  scrollYProgress: MotionValue<number>;
}) {
  const prefersReduced = usePrefersReducedMotion();

  // Number and Title parallax at distinct speeds relative to horizontal movement
  const numberX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [24, -24]
  );
  const titleX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [12, -12]
  );

  return (
    <div className="shrink-0 w-[380px] lg:w-[420px] h-[520px] rounded-[4px] bg-cream border border-forest/20 flex flex-col justify-between p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,41,28,0.04)] hover:border-turmeric/60 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden group">
      {/* Corner arrow circle reveal */}
      <div
        aria-hidden="true"
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-paper/95 text-deep-forest border border-forest/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-2xs pointer-events-none"
      >
        <ArrowUpRight className="w-4 h-4 text-turmeric" />
      </div>

      {/* Background Arch Image with slow zoom */}
      <div className="absolute top-0 right-0 w-44 h-48 rounded-bl-[120px] overflow-hidden opacity-30 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none">
        <Image
          src={therapy.image}
          alt={therapy.name}
          fill
          sizes="240px"
          className="object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-[1.06] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
      </div>

      {/* Top: Number & Dosha Badge with Parallax Offset */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.span
            style={{ x: numberX }}
            className="font-mono text-3xl font-normal text-forest/70 group-hover:text-turmeric transition-colors inline-block"
          >
            {therapy.number}
          </motion.span>
          <Badge variant="sage" dot>
            {therapy.primaryDosha}
          </Badge>
        </div>

        <span className="font-serif italic text-xs text-forest/90 font-medium block mb-1">
          {therapy.sanskrit}
        </span>

        <motion.h3
          style={{ x: titleX }}
          className="font-display text-2xl font-normal text-deep-forest group-hover:text-forest transition-colors"
        >
          {therapy.name}
        </motion.h3>

        <p className="text-xs text-ink/75 leading-relaxed mt-3">{therapy.benefit}</p>
      </div>

      {/* Bottom: Specs & CTA */}
      <div className="relative z-10 pt-4 border-t border-forest/15 space-y-3">
        <div className="flex items-center gap-4 text-xs text-ink/70">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-turmeric" />
            <span>{therapy.duration}</span>
          </div>
        </div>

        <div className="text-[11px] text-forest/80 line-clamp-1">
          <strong className="text-deep-forest font-medium">Herbs: </strong>
          {therapy.herbs}
        </div>

        <div className="pt-2">
          <Button
            href={`/treatments/${therapy.id}`}
            variant="text-link"
            size="sm"
            showArrow
          >
            View Clinical Monograph
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SignatureTherapies() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Desktop Pinned Horizontal Scroll with useScroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Translate track across cards
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ['0%', '0%'] : ['0%', '-62%']
  );

  // Mobile scroll buttons
  const scrollMobile = (direction: 'left' | 'right') => {
    if (mobileTrackRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      mobileTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* DESKTOP: Horizontal Pinned Scroll with Progress Line & Card Parallax */}
      <section
        ref={containerRef}
        className="hidden md:block relative h-[280vh] bg-paper border-b border-forest/15"
      >
        <div className="sticky top-0 h-screen flex flex-col justify-between py-12 lg:py-16 overflow-hidden">
          {/* Header */}
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="flex items-end justify-between gap-6 mb-4">
              <Reveal delay={0.04} direction="up" blur={false} className="flex-1">
                <SectionHeading
                  eyebrow="Signature Chikitsa"
                  sanskritEyebrow="प्रधान कर्म"
                  title="Classical Panchakarma & Restorative Therapies"
                  subtitle="NOT a generic spa menu. Each protocol is an authentic Shodhana & Shamana science documented in the classical texts of Charaka and Vagbhata."
                  align="asymmetric"
                  className="mb-0"
                />
              </Reveal>

              <div className="shrink-0 text-right pb-2">
                <span className="font-mono text-xs text-forest/70 uppercase tracking-widest block mb-1">
                  Horizontal Pinned Journey
                </span>
                <Link
                  href="/treatments"
                  className="text-deep-forest font-semibold text-xs underline hover:text-turmeric transition-colors"
                >
                  View all 24 therapies →
                </Link>
              </div>
            </div>

            {/* Progress Line */}
            <div className="w-full h-[2px] bg-forest/15 rounded-full overflow-hidden relative mt-2">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-y-0 left-0 bg-turmeric origin-left w-full shadow-[0_0_8px_rgba(217,154,43,0.6)]"
              />
            </div>
          </div>

          {/* Horizontally Pinned Card Carousel */}
          <div className="w-full overflow-hidden px-6 sm:px-8 lg:px-12 my-auto">
            <motion.div
              style={{ x }}
              className="flex gap-8 w-max will-change-transform py-4"
            >
              {therapies.map((therapy) => (
                <PinnedTherapyCard
                  key={therapy.id}
                  therapy={therapy}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom helper navigation hint */}
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex items-center justify-between text-xs text-forest/70 font-mono">
            <span>↓ Scroll vertically to glide across signature therapies</span>
            <span>01 – 0{therapies.length} Classical Protocols</span>
          </div>
        </div>
      </section>

      {/* MOBILE / TABLET: Native Swipeable Carousel */}
      <section className="md:hidden relative py-16 bg-paper border-b border-forest/15 overflow-hidden">
        <div className="px-5 mb-6">
          <SectionHeading
            eyebrow="Signature Chikitsa"
            sanskritEyebrow="प्रधान कर्म"
            title="Classical Panchakarma & Restorative Therapies"
            subtitle="Authentic Shodhana & Shamana protocols documented in the Samhitas."
            align="asymmetric"
            className="mb-0"
          />

          <div className="flex items-center justify-between mt-4">
            <span className="font-mono text-[11px] text-forest/70">
              ← Swipe to explore →
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollMobile('left')}
                className="w-9 h-9 rounded-full border border-forest/20 flex items-center justify-center text-forest cursor-pointer"
                aria-label="Previous therapy"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollMobile('right')}
                className="w-9 h-9 rounded-full border border-forest/20 flex items-center justify-center text-forest cursor-pointer"
                aria-label="Next therapy"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={mobileTrackRef}
          className="w-full overflow-x-auto scroll-smooth no-scrollbar px-5 pb-4 flex gap-5 snap-x snap-mandatory"
        >
          {therapies.map((therapy) => (
            <div
              key={therapy.id}
              className="shrink-0 snap-start w-[290px] h-[480px] rounded-[4px] bg-cream border border-forest/20 flex flex-col justify-between p-5 shadow-xs relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-2xl text-forest/70">
                    {therapy.number}
                  </span>
                  <Badge variant="sage" size="sm" dot>
                    {therapy.primaryDosha}
                  </Badge>
                </div>

                <span className="font-serif italic text-xs text-forest/90 block mb-1">
                  {therapy.sanskrit}
                </span>

                <h3 className="font-display text-xl text-deep-forest">
                  {therapy.name}
                </h3>

                <p className="text-xs text-ink/75 leading-relaxed mt-2.5 line-clamp-3">
                  {therapy.benefit}
                </p>
              </div>

              <div className="relative z-10 pt-3 border-t border-forest/15 space-y-2">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink/70">
                  <Clock className="w-3.5 h-3.5 text-turmeric" />
                  <span>{therapy.duration}</span>
                </div>
                <Button
                  href={`/treatments/${therapy.id}`}
                  variant="text-link"
                  size="sm"
                  showArrow
                >
                  View Monograph
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 mt-4 text-center">
          <Link
            href="/treatments"
            className="text-deep-forest font-semibold text-xs underline hover:text-turmeric"
          >
            View all 24 therapies →
          </Link>
        </div>
      </section>
    </>
  );
}
