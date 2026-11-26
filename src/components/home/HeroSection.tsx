'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Sparkles, Clock, CheckCircle2, Calendar, Phone, ArrowRight, User, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Reveal, RevealText, Magnetic } from '@/components/motion';
import { useInViewWithPause } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/config/images';

export function HeroSection() {
  const { language, t } = useLanguage();
  const { ref: heroRef, isActive: isHeroActive } = useInViewWithPause<HTMLElement>(0.05);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    concern: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // First scroll tracking for mobile indicator
  const [mounted, setMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleHeroMouseLeave = () => {
    setCursorPos(null);
  };

  // Parallax subtle scroll effects
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, 45]); // Desktop parallax
  const mobileParallaxY = useTransform(scrollY, [0, 400], [0, 20]); // Mobile tiny parallax (max 20px)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setIsSubmitted(true);
    }
  };

  const concerns = [
    t.hero.concernOption1,
    t.hero.concernOption2,
    t.hero.concernOption3,
    t.hero.concernOption4,
    t.hero.concernOption5,
  ];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className={cn(
        "relative pt-1 sm:pt-4 lg:pt-10 pb-6 sm:pb-10 lg:pb-16 overflow-hidden",
        !isHeroActive && 'pause-animation'
      )}
    >
      {/* Desktop-only subtle turmeric cursor-follow glow */}
      {cursorPos && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden lg:block rounded-full bg-turmeric/[0.07] blur-3xl z-0 transition-opacity duration-300"
          style={{
            left: cursorPos.x - 250,
            top: cursorPos.y - 250,
            width: 500,
            height: 500,
          }}
        />
      )}

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none -ml-24" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-turmeric/5 rounded-full blur-3xl pointer-events-none -mr-28" />

      {/* Pranayama floating botanical sprig (left accent on desktop) */}
      <div aria-hidden="true" className="absolute top-2/3 -left-6 w-32 h-32 text-forest/[0.07] pointer-events-none z-0 animate-pranayama-delayed hidden md:block">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
          <path d="M20 80 C20 40 50 20 80 15 C75 45 55 75 20 80 Z" />
          <path d="M20 80 L60 35 M35 60 L50 48 M50 48 L65 36" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* ========================================================================= */}
        {/* 1. MOBILE HERO VIEW (< 1024px): Classical Ayurvedic Visual, Editorial First */}
        {/* ========================================================================= */}
        <div className="lg:hidden flex flex-col pt-1 pb-4">
          {/* 1.1 Eyebrow Pill Bar */}
          <Reveal delay={0.02} direction="down" blur={false} className="w-full">
            <div className="w-full flex items-center justify-center gap-1.5 xs:gap-2 px-4 min-[360px]:px-5 min-[390px]:px-6 py-1.5 xs:py-2 rounded-full bg-cream border border-forest/15 text-forest mb-3.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
              <span
                className={cn(
                  "text-[8px] min-[360px]:text-[8.5px] min-[390px]:text-[9.25px] min-[420px]:text-[10px] font-semibold whitespace-nowrap",
                  language === 'GU'
                    ? "font-gujarati-sans tracking-normal"
                    : "font-mono uppercase tracking-tight min-[390px]:tracking-normal"
                )}
              >
                {t.hero.eyebrow}
              </span>
            </div>
          </Reveal>

          {/* 1.2 Editorial Content */}
          <div className="flex flex-col items-start text-left pt-1">
            {/* Masked Headline Reveal: line by line, no blur */}
            <RevealText
              as="h1"
              delay={0.06}
              stagger={0.06}
              className="text-display-hero text-deep-forest font-normal tracking-tight mb-3 text-[2.1rem] xs:text-[2.4rem] leading-[1.08]"
              lines={[
                t.hero.titleStart,
                <span key="accent" className="font-serif italic font-light text-[#9E6517] selection:text-deep-forest">
                  {t.hero.titleAccent}
                </span>,
              ]}
            />

            {/* 2 Lines of Calm Supporting Copy */}
            <Reveal delay={0.16} blur={false}>
              <p className="text-xs xs:text-sm text-ink/80 max-w-md leading-relaxed font-sans mb-4">
                {t.hero.subhead}
              </p>
            </Reveal>

            {/* Mobile CTAs: Primary "Book Consultation" Button + Secondary Text Link */}
            <Reveal delay={0.22} blur={false} className="w-full">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                <Button
                  id="hero-mobile-book-btn"
                  href="/book"
                  variant="primary"
                  size="md"
                  showArrow
                  className="w-full sm:w-auto justify-center min-h-[46px] shadow-xs"
                >
                  {t.hero.ctaBook}
                </Button>

                <div className="text-center sm:text-left py-1">
                  <Link
                    href="/dosha-quiz"
                    className="text-xs font-serif italic text-forest hover:text-deep-forest underline underline-offset-4 tracking-wide"
                  >
                    {language === 'GU' ? 'અથવા દોષ પ્રકૃતિ ક્વિઝ લો →' : 'Or take free Dosha Quiz →'}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 1.3 Visual Centerpiece: Classical Shirodhara Arch (No Doctor Portrait on Front Hero) */}
          <div className="relative flex flex-col items-center justify-center my-4 py-3">
            {/* Heritage Mandala/Jaali SVG Line Art behind Image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <svg
                viewBox="0 0 200 200"
                className="w-60 h-60 xs:w-68 xs:h-68 text-turmeric/45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Concentric Heritage Rings */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="0.6"
                  strokeDasharray="2 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="72"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                />

                {/* 8-Petal Classical Jaali Lattice Arches */}
                <motion.path
                  d="M100 28 Q88 64 100 82 Q112 64 100 28 Z"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                />
                <motion.path
                  d="M100 172 Q88 136 100 118 Q112 136 100 172 Z"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                />
                <motion.path
                  d="M28 100 Q64 88 82 100 Q64 112 28 100 Z"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                />
                <motion.path
                  d="M172 100 Q136 88 118 100 Q136 112 172 100 Z"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                />

                {/* Diagonal Lattice Petals */}
                <motion.path
                  d="M49 49 Q74 76 87 87 Q76 74 49 49 Z"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
                />
                <motion.path
                  d="M151 49 Q126 76 113 87 Q124 74 151 49 Z"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
                />
                <motion.path
                  d="M49 151 Q74 124 87 113 Q76 126 49 151 Z"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
                />
                <motion.path
                  d="M151 151 Q126 124 113 113 Q124 126 151 151 Z"
                  stroke="currentColor"
                  strokeWidth="0.7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
                />
              </svg>
            </div>

            {/* Treatment Arch Frame with Parallax */}
            <motion.div
              style={{ y: mobileParallaxY }}
              initial={{ clipPath: 'inset(100% 0 0 0 round 110px 110px 0 0)', opacity: 0, y: 20 }}
              animate={{ clipPath: 'inset(0% 0 0 0 round 110px 110px 0 0)', opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              className="relative z-10 w-[210px] xs:w-[240px] aspect-[4/5] rounded-t-[110px] rounded-b-[4px] overflow-hidden bg-gradient-to-b from-mist/70 via-cream to-paper border border-forest/20 shadow-[0_12px_32px_rgba(20,41,28,0.12)]"
            >
              <Image
                src="/images/treatments/shirodhara.jpg"
                alt="Classical Shirodhara with Brahmi herbal oil"
                fill
                priority
                sizes="(max-width: 768px) 75vw, 240px"
                className="object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent pointer-events-none" />

              {/* Classical Inscription inside the arch */}
              <div className="absolute bottom-3 left-3 right-3 text-cream flex items-baseline justify-between z-10">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-turmeric block">
                    Classical Consultation
                  </span>
                  <span className="font-display text-sm font-normal">
                    Vankal Ayurveda
                  </span>
                </div>
                <span className="font-serif italic text-xs text-paper/80">
                  શાંતિ માર્ગ
                </span>
              </div>
            </motion.div>

            {/* Small Floating "Next Available Slot" Card on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="relative z-20 -mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream/95 backdrop-blur-md border border-forest/20 shadow-[0_4px_16px_rgba(20,41,28,0.08)] text-[11px] font-mono text-deep-forest"
            >
              <div className="w-2 h-2 rounded-full bg-turmeric animate-pulse shrink-0" />
              <span>{t.hero.slotTime}</span>
            </motion.div>
          </div>

          {/* Animated Scroll Cue at bottom */}
          <div
            className={cn(
              'flex flex-col items-center gap-1 transition-opacity duration-500 pt-3 pb-1',
              hasScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
            aria-hidden="true"
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-forest/70">
              Scroll
            </span>
            <div className="w-[1.5px] h-6 bg-forest/20 rounded-full relative overflow-hidden">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-full h-2 rounded-full bg-turmeric shadow-[0_0_6px_rgba(217,154,43,0.6)]"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DESKTOP HERO VIEW (lg:grid): Preserved Exactly As Is */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LEFT COLUMN: Editorial & Headline */}
          <div className="col-span-7 flex flex-col items-start text-left z-10">
            {/* Eyebrow */}
            <Reveal delay={0.04} direction="down" blur={false}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-forest/15 text-xs text-forest mb-5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
                  {t.hero.eyebrow}
                </span>
              </div>
            </Reveal>

            {/* Line-by-Line Masked Headline Reveal */}
            <RevealText
              as="h1"
              delay={0.1}
              stagger={0.08}
              className="text-display-hero text-deep-forest font-normal tracking-tight mb-6"
              lines={[
                t.hero.titleStart,
                <span key="accent" className="font-serif italic font-light text-[#9E6517] selection:text-deep-forest">
                  {t.hero.titleAccent}
                </span>,
              ]}
            />

            {/* 2 Lines of Calm Supporting Copy */}
            <Reveal delay={0.22} blur={true}>
              <p className="text-body-lg text-ink/80 max-w-xl leading-relaxed font-sans">
                {t.hero.subhead}
              </p>
            </Reveal>

            {/* Magnetic CTAs */}
            <Reveal delay={0.3} blur={false} className="flex flex-wrap items-center gap-4 mt-8">
              <Magnetic>
                <Button href="/book" variant="primary" size="lg" showArrow className="min-h-[48px]">
                  {t.hero.ctaBook}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  href="/dosha-quiz"
                  variant="secondary"
                  size="lg"
                  icon={<Sparkles className="w-4 h-4 text-turmeric" />}
                  className="min-h-[48px]"
                >
                  {t.hero.ctaQuiz}
                </Button>
              </Magnetic>
            </Reveal>

            {/* 3 Small Trust Points with Thin Line Icons */}
            <Reveal delay={0.38} blur={false} className="w-full">
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-forest/15 w-full text-xs text-ink/75">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-forest stroke-[1.25] shrink-0" />
                  <span className="font-medium text-deep-forest">{t.hero.trust1}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-forest stroke-[1.25] shrink-0" />
                  <span className="font-medium text-deep-forest">{t.hero.trust2}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest stroke-[1.25] shrink-0" />
                  <span className="font-medium text-deep-forest">{t.hero.trust3}</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: Arch Image + Botanical Line Art + Mini-Form */}
          <div className="col-span-5 relative flex flex-col items-center">
            {/* Self-Drawing Botanical SVG Line Art with Pranayama Breathing */}
            <svg
              className="absolute -top-10 -right-6 w-36 h-36 text-sage/40 pointer-events-none z-0 animate-pranayama"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                d="M50 95 C50 60, 20 40, 10 10 C40 20, 60 50, 95 50 C60 60, 50 80, 50 95 Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
              <motion.path
                d="M50 95 L50 35 M30 55 L50 45 M70 65 L50 55"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
              />
            </svg>

            {/* Arch-shaped Visual Frame with Parallax */}
            <motion.div
              style={{ y: yParallax }}
              initial={{ clipPath: 'inset(100% 0 0 0 round 160px 160px 0 0)', opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0 0 0 round 160px 160px 0 0)', opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-t-[160px] rounded-b-[4px] overflow-hidden bg-gradient-to-b from-mist/70 via-cream to-paper border border-forest/20 shadow-[0_12px_36px_rgba(20,41,28,0.08)]"
            >
              {/* Image Layer with Soft Classical Tint */}
              <Image
                src="/images/treatments/shirodhara.jpg"
                alt="Classical Shirodhara with Brahmi herbal oil"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
              />

              {/* Gentle gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/70 via-transparent to-transparent" />

              {/* Inscription inside the arch */}
              <div className="absolute bottom-4 left-5 right-5 text-cream flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-turmeric block">
                    Classical Consultation
                  </span>
                  <span className="font-display text-base font-normal">
                    Vankal Ayurveda
                  </span>
                </div>
                <span className="font-serif italic text-xs text-paper/80">
                  શાંતિ માર્ગ
                </span>
              </div>
            </motion.div>

            {/* Small Floating "Next Available Slot" Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="absolute top-12 -left-4 sm:-left-8 bg-cream/95 backdrop-blur-md px-3.5 py-2.5 rounded-[4px] border border-forest/20 shadow-[0_8px_24px_rgba(20,41,28,0.08)] flex items-center gap-3 z-20"
            >
              <div className="w-2 h-2 rounded-full bg-turmeric animate-pulse shrink-0" />
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-forest font-semibold block leading-none">
                  {t.hero.slotAvailable}
                </span>
                <span className="text-xs font-sans font-medium text-deep-forest mt-0.5 block">
                  {t.hero.slotTime}
                </span>
              </div>
            </motion.div>

            {/* Compact Appointment Mini-Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
              className="relative w-full max-w-[380px] sm:max-w-[420px] -mt-10 sm:-mt-12 bg-cream/95 backdrop-blur-md border border-forest/25 rounded-[4px] p-5 shadow-[0_12px_32px_rgba(20,41,28,0.1)] z-20"
            >
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-turmeric" />
                  <h2 className="font-display text-sm font-semibold text-deep-forest uppercase tracking-wider">
                    {t.hero.formTitle}
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-forest/80 font-semibold">
                  {language === 'GU' ? 'આયુર્વેદિક પરામર્શ' : 'Ayurvedic Consultation'}
                </span>
              </div>

              {isSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-forest text-cream mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div role="status" className="font-display font-medium text-deep-forest text-sm">
                    {t.hero.requestReceived}
                  </div>
                  <p className="text-xs text-ink/75 leading-relaxed">
                    {language === 'GU'
                      ? `અમારો પરામર્શ ડેસ્ક સમયની પુષ્ટિ માટે ${formData.phone} પર સંપર્ક કરશે.`
                      : `We will call ${formData.phone} to confirm your consultation timing.`}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name Floating Label Input */}
                  <div className="relative">
                    <input
                      id="hero-name"
                      type="text"
                      required
                      placeholder=" "
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="peer w-full bg-paper/90 border border-forest/20 text-xs px-3 pt-4 pb-1.5 rounded-[3px] text-ink focus:outline-none focus:border-turmeric focus:ring-2 focus:ring-turmeric/25 transition-all duration-300 min-h-[46px]"
                      aria-label={t.hero.fieldName}
                    />
                    <label
                      htmlFor="hero-name"
                      className="absolute left-3 top-1 text-[10px] uppercase font-mono tracking-wider text-forest/80 font-medium transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-sans peer-placeholder-shown:text-ink/50 peer-focus:top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-mono peer-focus:text-turmeric"
                    >
                      {t.hero.fieldName}
                    </label>
                  </div>

                  {/* Phone Floating Label Input */}
                  <div className="relative">
                    <input
                      id="hero-phone"
                      type="tel"
                      required
                      placeholder=" "
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="peer w-full bg-paper/90 border border-forest/20 text-xs px-3 pt-4 pb-1.5 rounded-[3px] text-ink focus:outline-none focus:border-turmeric focus:ring-2 focus:ring-turmeric/25 transition-all duration-300 min-h-[46px]"
                      aria-label={t.hero.fieldPhone}
                    />
                    <label
                      htmlFor="hero-phone"
                      className="absolute left-3 top-1 text-[10px] uppercase font-mono tracking-wider text-forest/80 font-medium transition-all duration-200 pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-sans peer-placeholder-shown:text-ink/50 peer-focus:top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-mono peer-focus:text-turmeric"
                    >
                      {t.hero.fieldPhone}
                    </label>
                  </div>

                  {/* Health Concern */}
                  <div className="relative">
                    <select
                      value={formData.concern}
                      onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                      className="w-full bg-paper/90 border border-forest/20 text-xs px-3 py-2.5 rounded-[3px] text-ink/80 focus:outline-none focus:border-turmeric focus:ring-2 focus:ring-turmeric/25 transition-all duration-300 cursor-pointer min-h-[46px]"
                      aria-label={t.hero.fieldConcern}
                    >
                      <option value="">{t.hero.fieldConcern}</option>
                      {concerns.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <Magnetic className="w-full">
                    <button
                      type="submit"
                      className="w-full bg-deep-forest hover:bg-forest text-cream text-xs font-semibold py-2.5 rounded-[3px] transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                    >
                      <span>{t.hero.formBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-turmeric" />
                    </button>
                  </Magnetic>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
