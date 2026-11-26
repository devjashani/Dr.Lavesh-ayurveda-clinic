'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Reveal, Magnetic } from '@/components/motion';
import { SectionMarginIndex } from '@/components/ui/SectionMarginIndex';
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
    sanskrit: 'શિરોધારા વિધાનમ્',
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
    sanskrit: 'કટિ બસ્તિ',
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
    sanskrit: 'અભ્યંગ અને સ્વેદન',
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
    sanskrit: 'નસ્ય કર્મ',
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
    sanskrit: 'વિરેચન શુદ્ધિ',
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
    sanskrit: 'બસ્તિ કર્મ (અર્ધચિકિત્સા)',
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
    <div className="shrink-0 w-[295px] lg:w-[315px] xl:w-[330px] h-[clamp(355px,52dvh,435px)] rounded-[6px] bg-cream border border-forest/20 flex flex-col justify-between p-5 lg:p-6 shadow-[0_4px_24px_rgba(20,41,28,0.04)] hover:border-turmeric/60 hover:shadow-[0_8px_28px_rgba(20,41,28,0.08)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden group">
      {/* Subtle hover corner arrow */}
      <div
        aria-hidden="true"
        className="absolute bottom-5 right-5 z-20 w-8 h-8 rounded-full bg-paper/95 text-deep-forest border border-forest/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-2xs pointer-events-none"
      >
        <ArrowUpRight className="w-4 h-4 text-turmeric" />
      </div>

      {/* Top: Number, Badge, Title & Description (mirrors clean mobile editorial spacing) */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-4">
          <motion.span
            style={{ x: numberX }}
            className="font-mono text-2xl lg:text-3xl font-normal text-forest/70 group-hover:text-turmeric transition-colors inline-block"
          >
            {therapy.number}
          </motion.span>
          <Badge variant="sage" size="sm" dot>
            {therapy.primaryDosha}
          </Badge>
        </div>

        <span className="font-serif italic text-xs text-forest/90 font-medium block mb-1.5">
          {therapy.sanskrit}
        </span>

        <motion.h3
          style={{ x: titleX }}
          className="font-display text-xl lg:text-[22px] font-normal text-deep-forest group-hover:text-forest transition-colors leading-snug"
        >
          {therapy.name}
        </motion.h3>

        <p className="text-xs sm:text-[13px] text-ink/75 leading-relaxed mt-3 line-clamp-3">
          {therapy.benefit}
        </p>
      </div>

      {/* Bottom: Cleanly Separated Specs & CTA */}
      <div className="relative z-10 pt-3.5 border-t border-forest/15 space-y-2">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink/75">
          <Clock className="w-3.5 h-3.5 text-turmeric shrink-0" />
          <span className="truncate">{therapy.duration}</span>
        </div>

        <div className="text-[11px] text-forest/80 truncate pr-8">
          <strong className="text-deep-forest font-medium">Herbs: </strong>
          {therapy.herbs}
        </div>

        <div className="pt-0.5">
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
    prefersReduced ? ['0%', '0%'] : ['0%', '-46%']
  );

  // Mobile scroll buttons
  const scrollMobile = (direction: 'left' | 'right') => {
    if (mobileTrackRef.current) {
      const offset = direction === 'left' ? -310 : 310;
      mobileTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* DESKTOP: Horizontal Pinned Scroll with Progress Line & Card Parallax */}
      <section
        ref={containerRef}
        className="hidden md:block relative h-[260dvh] bg-paper border-b border-forest/15"
      >
        <div className="sticky top-0 h-[100dvh] flex flex-col justify-between pt-16 pb-4 lg:pt-[76px] lg:pb-5 overflow-hidden gap-2.5">
          {/* 4. Section Margin Number revealed with a mask slide */}
          <SectionMarginIndex number="02" label="THERAPIES" gujaratiLabel="ચિકિત્સા" />
          {/* Header */}
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full shrink-0">
            <div className="flex items-end justify-between gap-6 mb-2.5">
              <Reveal delay={0.04} direction="up" blur={false} className="flex-1">
                <SectionHeading
                  eyebrow="Signature Chikitsa"
                  sanskritEyebrow="પ્રધાન કર્મ"
                  title="Classical Panchakarma & Restorative Therapies"
                  subtitle="NOT a generic spa menu. Each protocol is an authentic Shodhana & Shamana science documented in the classical texts of Charaka and Vagbhata."
                  align="asymmetric"
                  size="sm"
                  className="mb-0"
                />
              </Reveal>

              <div className="shrink-0 text-right pb-1">
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
          <div className="w-full overflow-hidden px-6 sm:px-8 lg:px-12 my-auto flex-1 flex items-center min-h-0 py-1.5">
            <motion.div
              style={{ x }}
              className="flex gap-6 lg:gap-7 w-max will-change-transform py-1"
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
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex items-center justify-between text-xs text-forest/70 font-mono shrink-0 pt-2">
            <span>↓ Scroll vertically to glide across signature therapies</span>
            <span>01 – 0{therapies.length} Classical Protocols</span>
          </div>
        </div>
      </section>

      {/* MOBILE / TABLET: Native Swipeable Carousel */}
      <section className="md:hidden relative py-10 bg-paper border-b border-forest/15 overflow-hidden content-auto">
        <div className="px-5 mb-6">
          <SectionHeading
            eyebrow="Signature Chikitsa"
            sanskritEyebrow="પ્રધાન કર્મ"
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
          className="w-full overflow-x-auto scroll-smooth no-scrollbar px-5 pb-4 flex gap-5 snap-x snap-mandatory scroll-pl-5 scroll-pr-5"
        >
          {therapies.map((therapy) => (
            <div
              key={therapy.id}
              className="shrink-0 snap-start w-[290px] h-[350px] rounded-[6px] bg-cream border border-forest/20 flex flex-col justify-between p-5 shadow-xs relative overflow-hidden"
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

              <div className="relative z-10 pt-3 border-t border-forest/15 space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink/75">
                  <Clock className="w-3.5 h-3.5 text-turmeric shrink-0" />
                  <span>{therapy.duration}</span>
                </div>
                <div className="text-[11px] text-forest/80 truncate">
                  <strong className="text-deep-forest font-medium">Herbs: </strong>
                  {therapy.herbs}
                </div>
                <div className="pt-0.5">
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
            </div>
          ))}
          {/* Trailing padding anchor for cross-browser scroll snap */}
          <div className="shrink-0 w-1 pointer-events-none" aria-hidden="true" />
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
