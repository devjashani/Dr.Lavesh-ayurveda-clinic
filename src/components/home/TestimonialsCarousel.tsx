'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Reveal, Magnetic } from '@/components/motion';
import { MOTION_TOKENS, usePrefersReducedMotion } from '@/lib/motion';

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

// Longest quote used for ghost container layout sizing to reserve height and eliminate CLS
const longestTestimonial = testimonials.reduce((prev, curr) =>
  curr.outcomeQuote.length > prev.outcomeQuote.length ? curr : prev
);

const AUTOPLAY_DURATION = 7000; // 7 seconds

export function TestimonialsCarousel() {
  const prefersReduced = usePrefersReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progress, setProgress] = useState(0);

  // Pause states
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [hasManuallyNavigated, setHasManuallyNavigated] = useState(false);

  // Refs for animation loop & resume delay
  const sectionRef = useRef<HTMLElement | null>(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);

  // Compute aggregate paused status
  // isReadingPaused triggers the visual "Paused • reading" indicator
  const isReadingPaused =
    (isHovered || isFocused || isInteracting || isManuallyPaused) && isInView && !isDocumentHidden;

  const isPaused = prefersReduced || isReadingPaused || isDocumentHidden || !isInView;

  // Manual navigation handlers
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    elapsedRef.current = 0;
    setProgress(0);
  }, []);

  const goToIndex = useCallback((targetIndex: number) => {
    if (targetIndex === currentIndex) return;
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setCurrentIndex(targetIndex);
    elapsedRef.current = 0;
    setProgress(0);
  }, [currentIndex]);

  const handleManualNext = () => {
    setHasManuallyNavigated(true);
    goToNext();
  };

  const handleManualPrev = () => {
    setHasManuallyNavigated(true);
    goToPrev();
  };

  const handleManualDotClick = (idx: number) => {
    setHasManuallyNavigated(true);
    goToIndex(idx);
  };

  const toggleManualPause = () => {
    setIsManuallyPaused((prev) => !prev);
  };

  // IntersectionObserver to pause when section is out of viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Document visibility listener (pause on background tabs)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsDocumentHidden(document.visibilityState === 'hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Resume with 1-second delay after mouse leaves
  const handleMouseEnter = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 1000);
  };

  // Touch & Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null) {
      const deltaX = touchDeltaXRef.current;
      if (deltaX < -45) {
        handleManualNext();
      } else if (deltaX > 45) {
        handleManualPrev();
      }
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 1000);
  };

  // Keyboard navigation within carousel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleManualPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleManualNext();
    } else if (e.key === ' ') {
      // Space toggles pause when focused on non-button elements
      if ((e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault();
        toggleManualPause();
      }
    }
  };

  // High-precision requestAnimationFrame autoplay & progress loop
  // The progress bar stops immediately when paused, and continues from the exact same point when resumed!
  useEffect(() => {
    if (prefersReduced) {
      setProgress(0);
      return;
    }

    let animationFrameId: number;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!isPaused) {
        elapsedRef.current += delta;

        if (elapsedRef.current >= AUTOPLAY_DURATION) {
          elapsedRef.current = 0;
          goToNext();
        } else {
          setProgress(Math.min(elapsedRef.current / AUTOPLAY_DURATION, 1));
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lastTimeRef.current = null;
    };
  }, [isPaused, goToNext, prefersReduced]);

  const current = testimonials[currentIndex];
  const words = current.outcomeQuote.split(' ');

  return (
    <section
      ref={sectionRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = setTimeout(() => setIsFocused(false), 1000);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Verified Clinical Case Testimonials"
      data-dark-section="true"
      className="py-20 sm:py-28 bg-deep-forest text-cream relative overflow-hidden border-b border-forest/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-turmeric/60"
    >
      {/* Decorative large drifting quotation watermark */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                x: [0, 14, -8, 0],
                y: [0, -10, 6, 0],
                rotate: [0, 2.5, -1.5, 0],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-10 left-6 sm:left-14 text-forest/20 select-none pointer-events-none"
        aria-hidden="true"
      >
        <Quote className="w-36 h-36 sm:w-52 sm:h-52 text-forest/25" strokeWidth={0.8} />
      </motion.div>

      {/* Subtle secondary ambient watermarks */}
      <div
        className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-forest/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-turmeric/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="narrow" className="relative z-10">
        {/* Header & Case Counter */}
        <Reveal delay={0} direction="up">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <Badge variant="cream" className="flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                Verified Clinical Case Outcomes
              </Badge>

              {/* Paused • reading indicator */}
              <AnimatePresence>
                {isReadingPaused && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest/90 border border-turmeric/40 text-[11px] font-mono text-turmeric shadow-inner"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-turmeric animate-pulse" />
                    <span>Paused • reading</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Vertical rolling digit counter: CASE 02 OF 05 */}
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-sage">
              <span>CASE</span>
              <span className="relative inline-flex h-[1.3em] w-[2.2ch] overflow-hidden justify-center items-center font-bold text-turmeric align-baseline">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.span
                    key={currentIndex}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        y: prefersReduced ? 0 : dir > 0 ? '110%' : '-110%',
                        opacity: prefersReduced ? 1 : 0,
                        filter: prefersReduced ? 'blur(0px)' : 'blur(4px)',
                      }),
                      center: {
                        y: '0%',
                        opacity: 1,
                        filter: 'blur(0px)',
                      },
                      exit: (dir: number) => ({
                        y: prefersReduced ? 0 : dir > 0 ? '-110%' : '110%',
                        opacity: prefersReduced ? 0 : 0,
                        filter: prefersReduced ? 'blur(0px)' : 'blur(4px)',
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: prefersReduced ? 0 : 0.4,
                      ease: MOTION_TOKENS.ease,
                    }}
                    className="tabular-nums"
                  >
                    {String(currentIndex + 1).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span>OF 0{testimonials.length}</span>
            </div>
          </div>
        </Reveal>

        {/* Carousel Slide Area: CSS Grid stack prevents ANY height jump/CLS */}
        <div
          className="relative grid grid-cols-1 grid-rows-1 items-center justify-center min-h-[360px] sm:min-h-[300px] md:min-h-[260px]"
          aria-live={hasManuallyNavigated ? 'polite' : 'off'}
          aria-atomic="true"
        >
          {/* Ghost element of the longest slide: keeps container height 100% stable at any screen size */}
          <div
            className="col-start-1 row-start-1 invisible pointer-events-none select-none text-center space-y-6 max-w-3xl mx-auto px-2"
            aria-hidden="true"
          >
            <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl font-normal leading-relaxed text-cream/95">
              &ldquo;{longestTestimonial.outcomeQuote}&rdquo;
            </blockquote>

            <div className="flex flex-col items-center pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest" />
                <div className="text-left">
                  <p className="font-sans font-medium text-sm">Longest Name Placeholder</p>
                  <p className="text-xs">Age 62 • Longest City, State Location</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded text-[11px]">
                  {longestTestimonial.condition}
                </span>
                <span className="text-[11px]">Supervised by Dr. Lavesh Bohra</span>
              </div>
            </div>
          </div>

          {/* Active Testimonial Slide */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPointerEnter={handleMouseEnter}
            onPointerLeave={handleMouseLeave}
            className="col-start-1 row-start-1 w-full flex items-center justify-center cursor-default"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                role="group"
                aria-roledescription="slide"
                aria-label={`Case ${currentIndex + 1} of ${testimonials.length}: ${current.name}`}
                initial={{
                  opacity: 0,
                  y: prefersReduced ? 0 : 12,
                  filter: prefersReduced ? 'blur(0px)' : 'blur(6px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  y: prefersReduced ? 0 : -12,
                  filter: prefersReduced ? 'blur(0px)' : 'blur(6px)',
                }}
                transition={{
                  duration: prefersReduced ? 0 : 0.35,
                  ease: MOTION_TOKENS.ease,
                }}
                className="text-center space-y-5 sm:space-y-6 max-w-3xl mx-auto px-2"
              >
                {/* Quote with sequential word-by-word blur-in reveal */}
                <blockquote className="font-display text-lg sm:text-2xl lg:text-3xl font-normal leading-relaxed sm:leading-relaxed text-cream/95">
                  <span className="text-turmeric/80 select-none mr-1 font-serif">&ldquo;</span>
                  {words.map((word, i) => (
                    <motion.span
                      key={`${current.id}-w-${i}`}
                      initial={{
                        opacity: prefersReduced ? 1 : 0,
                        y: prefersReduced ? 0 : 4,
                        filter: prefersReduced ? 'blur(0px)' : 'blur(3px)',
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                      }}
                      transition={{
                        duration: prefersReduced ? 0 : 0.3,
                        delay: prefersReduced ? 0 : 0.02 + i * 0.007,
                        ease: MOTION_TOKENS.ease,
                      }}
                      className="inline-block mr-[0.25em]"
                    >
                      {word}
                    </motion.span>
                  ))}
                  <span className="text-turmeric/80 select-none ml-0.5 font-serif">&rdquo;</span>
                </blockquote>

                {/* Patient Profile, Avatar, and Condition Tag: Animate in after quote */}
                <motion.div
                  initial={{
                    opacity: prefersReduced ? 1 : 0,
                    y: prefersReduced ? 0 : 8,
                    scale: prefersReduced ? 1 : 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.4,
                    delay: prefersReduced ? 0 : Math.min(0.08 + words.length * 0.007, 0.35),
                    ease: MOTION_TOKENS.ease,
                  }}
                  className="flex flex-col items-center pt-1"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: prefersReduced ? 1 : 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: prefersReduced ? 0 : 0.25,
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest text-turmeric font-mono font-semibold text-xs flex items-center justify-center border border-turmeric/30 shadow-md ring-2 ring-forest/60"
                    >
                      {current.initials}
                    </motion.div>
                    <div className="text-left">
                      <p className="font-sans font-medium text-cream text-sm flex items-center gap-1.5">
                        <span>{current.name}</span>
                        <Sparkles className="w-3 h-3 text-turmeric opacity-80" />
                      </p>
                      <p className="text-xs text-paper/70 font-sans">
                        Age {current.age} • {current.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-forest/80 text-turmeric font-mono text-[11px] border border-turmeric/25 shadow-sm">
                      {current.condition}
                    </span>
                    <span className="text-paper/60 text-[11px] font-sans">
                      Supervised by {current.doctorInCharge}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Controls: Arrows + Progress Dots + WCAG Pause/Play Button */}
        <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-4">
          {/* Previous Arrow */}
          <Magnetic strength={8}>
            <button
              type="button"
              onClick={handleManualPrev}
              className="p-2 sm:p-2.5 rounded-full border border-forest/80 bg-forest/40 text-paper/80 hover:text-cream hover:border-turmeric/50 hover:bg-forest transition-colors cursor-pointer w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              aria-label="Previous clinical testimonial slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Magnetic>

          {/* Pagination Track: Active dot stretches into turmeric progress bar */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-forest/30 border border-forest/60 backdrop-blur-xs"
            role="tablist"
            aria-label="Testimonial navigation dots"
          >
            {testimonials.map((t, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Jump to case story ${idx + 1}: ${t.name}`}
                  onClick={() => handleManualDotClick(idx)}
                  className="relative min-w-[28px] sm:min-w-[36px] h-8 sm:h-9 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-turmeric rounded-full"
                >
                  {isActive ? (
                    <motion.div
                      layoutId="active-dot-track"
                      className="w-10 sm:w-14 h-2 rounded-full bg-forest/90 border border-forest relative overflow-hidden shadow-inner"
                      transition={{ duration: 0.3, ease: MOTION_TOKENS.ease }}
                    >
                      {/* Active progress fill: fills in real-time over 7 seconds, stops on pause, resumes without restarting */}
                      <div
                        className="absolute inset-y-0 left-0 bg-turmeric rounded-full shadow-[0_0_8px_rgba(217,154,43,0.6)]"
                        style={{
                          width: prefersReduced ? '100%' : `${progress * 100}%`,
                          transition: isPaused ? 'none' : 'width 100ms linear',
                        }}
                      />
                    </motion.div>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-paper/25 hover:bg-paper/50 transition-colors block" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Arrow */}
          <Magnetic strength={8}>
            <button
              type="button"
              onClick={handleManualNext}
              className="p-2 sm:p-2.5 rounded-full border border-forest/80 bg-forest/40 text-paper/80 hover:text-cream hover:border-turmeric/50 hover:bg-forest transition-colors cursor-pointer w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              aria-label="Next clinical testimonial slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Magnetic>

          {/* Pause / Play Accessibility Button (WCAG 2.2.2 compliance) */}
          <Magnetic strength={6}>
            <button
              type="button"
              onClick={toggleManualPause}
              className={`p-2 sm:p-2.5 rounded-full border transition-all cursor-pointer w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none ${
                isManuallyPaused
                  ? 'border-turmeric text-turmeric bg-turmeric/10'
                  : 'border-forest/80 bg-forest/40 text-paper/70 hover:text-cream hover:border-turmeric/50'
              }`}
              aria-label={
                isManuallyPaused
                  ? 'Resume automated testimonial carousel rotation'
                  : 'Pause automated testimonial carousel rotation'
              }
              title={isManuallyPaused ? 'Resume autoplay' : 'Pause autoplay'}
            >
              {isManuallyPaused ? (
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
              ) : (
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              )}
            </button>
          </Magnetic>
        </div>

        {/* Keyboard hints helper (subtle, accessible) */}
        <div className="mt-4 text-center">
          <p className="text-[11px] font-mono text-paper/40 tracking-wider">
            Use <kbd className="px-1.5 py-0.5 bg-forest/50 rounded border border-forest/80 text-paper/60">←</kbd>{' '}
            <kbd className="px-1.5 py-0.5 bg-forest/50 rounded border border-forest/80 text-paper/60">→</kbd> to navigate • Swipe on mobile
          </p>
        </div>
      </Container>
    </section>
  );
}
