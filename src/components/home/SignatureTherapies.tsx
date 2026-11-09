'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Clock, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';

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
    benefit: 'Continuous rhythmic stream of warm herbal Brahmi oil soothing the central nervous system, insomnia & anxiety.',
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
    benefit: 'Medicated black-gram dough ring holding warm Mahanarayan oil to relieve disc degeneration and sciatica.',
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
    benefit: 'Two-practitioner synchronized full-body herbal massage stimulating 107 vital Marma energy junctions.',
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
    benefit: 'Trans-nasal delivery of Anu Thailam clears cranial micro-channels, chronic migraine, sinusitis & cervical tension.',
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
    benefit: 'Classical targeted therapeutic purgation purging accumulated morbid Pitta, hepatic toxins and skin inflammation.',
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
    benefit: 'Revered as 50% of all Ayurveda: herbal decoction and unctuous oil enemas pacifying Vata at its root colon seat.',
    duration: '8 to 16 day protocol',
    primaryDosha: 'Vata Root Care',
    herbs: 'Dashamoola Decoction, Sahacharadi',
    image: '/images/treatments/shirodhara.jpg',
  },
];

export function SignatureTherapies() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const offset = direction === 'left' ? -420 : 420;
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-paper border-b border-forest/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Signature Chikitsa"
          sanskritEyebrow="प्रधान कर्म"
          title="Classical Panchakarma & Restorative Therapies"
          subtitle="NOT a generic spa menu. Each protocol is an authentic Shodhana & Shamana science documented in the classical texts of Charaka and Vagbhata."
          align="asymmetric"
          className="mb-0 flex-1"
        />
        <div className="hidden sm:flex items-center gap-3 shrink-0 pb-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-11 h-11 rounded-full border border-forest/20 hover:border-forest/50 hover:bg-forest/5 flex items-center justify-center text-forest transition-colors"
            aria-label="Previous therapy"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-11 h-11 rounded-full border border-forest/20 hover:border-forest/50 hover:bg-forest/5 flex items-center justify-center text-forest transition-colors"
            aria-label="Next therapy"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Track (Smooth Native Scroll & Keyboard / Button navigation) */}
      <div
        ref={trackRef}
        className="w-full overflow-x-auto scroll-smooth no-scrollbar px-5 sm:px-8 lg:px-12 pb-4"
      >
        <div className="flex gap-6 w-max snap-x snap-mandatory">
          {therapies.map((therapy) => (
            <div
              key={therapy.id}
              className="w-[310px] sm:w-[360px] lg:w-[410px] h-[520px] rounded-[4px] bg-cream border border-forest/20 flex flex-col justify-between p-6 sm:p-7 shadow-[0_4px_24px_rgba(20,41,28,0.04)] hover:border-forest/45 transition-all duration-300 relative overflow-hidden group snap-start shrink-0"
            >
              {/* Background Arch Image Placeholder */}
              <div className="absolute top-0 right-0 w-44 h-48 rounded-bl-[120px] overflow-hidden opacity-25 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none">
                <Image
                  src={therapy.image}
                  alt={therapy.name}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>

              {/* Top: Number & Dosha Badge */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-3xl font-normal text-forest/70 group-hover:text-[#9E6517] transition-colors">
                    {therapy.number}
                  </span>
                  <Badge variant="sage" dot>
                    {therapy.primaryDosha}
                  </Badge>
                </div>

                <span className="font-serif italic text-xs text-forest/90 font-medium block mb-1">
                  {therapy.sanskrit}
                </span>

                <h3 className="font-display text-2xl font-normal text-deep-forest group-hover:text-forest transition-colors">
                  {therapy.name}
                </h3>

                <p className="text-xs text-ink/75 leading-relaxed mt-3">
                  {therapy.benefit}
                </p>
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
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-8 flex items-center justify-between text-xs text-forest/85 font-medium">
        <span className="hidden lg:inline font-mono">
          ← Scroll down to journey through all 6 classical therapies →
        </span>
        <span className="lg:hidden font-mono">
          ← Swipe horizontally to explore classical therapies →
        </span>
        <Link href="/treatments" className="text-deep-forest font-semibold underline hover:text-forest">
          View all 24 therapies
        </Link>
      </div>
    </section>
  );
}

