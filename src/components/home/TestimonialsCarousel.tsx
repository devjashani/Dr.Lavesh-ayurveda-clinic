'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  age: number;
  location: string;
  condition: string;
  protocol: string;
  outcomeQuote: string;
  doctorInCharge: string;
  initials: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: '1',
    name: 'Col. Digvijay Singh (Retd.)',
    age: 62,
    location: 'Jaipur, Rajasthan',
    condition: 'Lumbar Spondylosis & Left-Leg Sciatica (Gridhrasi)',
    protocol: '14-Day Inpatient Kati Basti & Dashamoola Ksheerapaka',
    outcomeQuote:
      'Orthopedic surgeons in Delhi recommended an urgent L4-L5 spinal fusion. Within fourteen days of warm Mahanarayan oil Kati Basti under Dr. Bohra’s care, the radiating nerve impingement subsided completely. Today I walk four kilometers every morning without analgesics.',
    doctorInCharge: 'Dr. Lavesh Bohra',
    initials: 'DS',
  },
  {
    id: '2',
    name: 'Sunita Agarwal',
    age: 44,
    location: 'Ahmedabad, Gujarat',
    condition: '8-Year Seropositive Rheumatoid Arthritis (Amavata)',
    protocol: '21-Day Classical Virechana & Shaddharana Churna',
    outcomeQuote:
      'My inflammatory ESR was consistently 64 and my finger joints were swollen stiff every dawn. Classical gut cleansing followed by castor-oil bio-cleansing brought my ESR down to 18. For the first time in eight years, I can hold my teacup without morning throbbing.',
    doctorInCharge: 'Dr. Lavesh Bohra',
    initials: 'SA',
  },
  {
    id: '3',
    name: 'Dr. Pradeep Nair (MBBS, MD)',
    age: 51,
    location: 'Bengaluru, Karnataka',
    condition: 'Essential Hypertension & Severe Vata Insomnia',
    protocol: '14-Day Shirodhara with Brahmi Thailam & Sarpagandha',
    outcomeQuote:
      'As a practicing allopathic cardiologist, I was naturally cautious. Yet Dr. Bohra’s Nadi reading was remarkably accurate to my autonomic dysregulation. Two weeks of daily rhythmic Shirodhara dropped my systolic pressure by 22 mmHg and restored unbroken 7-hour deep sleep.',
    doctorInCharge: 'Dr. Lavesh Bohra',
    initials: 'PN',
  },
  {
    id: '4',
    name: 'Ananya Mukherjee',
    age: 29,
    location: 'Kolkata, West Bengal',
    condition: 'PCOS, 70-Day Anovulatory Cycles & Cystic Acne',
    protocol: '4-Month Kanchanar Guggulu, Nasya & Ritucharya',
    outcomeQuote:
      'I had spent five years on synthetic oral contraceptives which only masked the issue. Aarogyam addressed the root Kapha metabolic blockage. My cycle has been naturally 31 days for nine months straight with clear skin and zero hormonal pharmaceuticals.',
    doctorInCharge: 'Dr. Ananya Sharma',
    initials: 'AM',
  },
  {
    id: '5',
    name: 'Harshavardhan Rathore',
    age: 38,
    location: 'Jodhpur, Rajasthan',
    condition: 'Chronic Plaque Psoriasis on Scalp & Elbows (Kitibha)',
    protocol: '21-Day Inpatient Takradhara & Mahatiktaka Ghrita',
    outcomeQuote:
      'Topical corticosteroid creams gave me temporary relief followed by vicious rebound flares. The medicated buttermilk stream (Takradhara) coupled with strict diet rules cleared 90% of my plaques. Two monsoons have passed without a single recurrence.',
    doctorInCharge: 'Dr. Lavesh Bohra',
    initials: 'HR',
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-20 sm:py-28 bg-deep-forest text-cream relative overflow-hidden border-b border-forest/40"
    >
      {/* Decorative large quotation mark watermark */}
      <div className="absolute top-10 left-10 text-forest/20 select-none pointer-events-none">
        <Quote className="w-36 h-36" strokeWidth={1} />
      </div>

      <Container size="narrow" className="relative z-10">
        <div className="text-center mb-8">
          <Badge variant="cream" className="mb-3">
            Verified Clinical Case Outcomes
          </Badge>
          <span className="text-xs font-mono uppercase tracking-widest text-sage block">
            Case 0{currentIndex + 1} of 0{testimonials.length}
          </span>
        </div>

        {/* Carousel Slide Area */}
        <div className="min-h-[300px] sm:min-h-[260px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center space-y-6 max-w-3xl"
            >
              <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl font-normal leading-relaxed text-cream/95">
                &ldquo;{current.outcomeQuote}&rdquo;
              </blockquote>

              <div className="flex flex-col items-center pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-forest text-turmeric font-mono font-semibold text-xs flex items-center justify-center border border-forest/60">
                    {current.initials}
                  </div>
                  <div className="text-left">
                    <p className="font-sans font-medium text-cream text-sm">
                      {current.name}
                    </p>
                    <p className="text-xs text-paper/70">
                      Age {current.age} • {current.location}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-forest/60 text-turmeric font-mono text-[11px] border border-forest/80">
                    {current.condition}
                  </span>
                  <span className="text-paper/60 text-[11px]">
                    Supervised by {current.doctorInCharge}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls: Prev, Dots, Next */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2.5 rounded-full border border-forest/60 text-paper/80 hover:text-cream hover:border-cream/40 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous clinical testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to case story ${idx + 1}`}
                className="w-11 h-11 flex items-center justify-center cursor-pointer focus:outline-none"
              >
                <span
                  className={`transition-all duration-300 rounded-full block ${
                    currentIndex === idx
                      ? 'w-6 h-1.5 bg-turmeric'
                      : 'w-1.5 h-1.5 bg-paper/30 hover:bg-paper/60'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-2.5 rounded-full border border-forest/60 text-paper/80 hover:text-cream hover:border-cream/40 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next clinical testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}

