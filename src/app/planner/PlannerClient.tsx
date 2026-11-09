'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { treatments } from '@/lib/data/treatments';
import { Treatment } from '@/lib/data/types';
import {
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  Check,
  ArrowRight,
  RotateCcw,
  Layers,
  HelpCircle,
  Zap,
} from 'lucide-react';

// Pricing and sequencing metadata helper
interface TherapyEstimatorMeta {
  minPrice: number;
  maxPrice: number;
  minutes: number;
  phaseOrder: number; // 1: Purva Karma, 2: Pradhana Karma, 3: Shamana / Specialized, 4: Paschat Karma
  phaseName: string;
}

const THERAPY_META: Record<string, TherapyEstimatorMeta> = {
  'abhyanga-swedana': {
    minPrice: 2200,
    maxPrice: 3000,
    minutes: 75,
    phaseOrder: 1,
    phaseName: 'Phase 1: Purva Karma (Preparation & Oleation)',
  },
  'vamana': {
    minPrice: 14000,
    maxPrice: 18000,
    minutes: 120,
    phaseOrder: 2,
    phaseName: 'Phase 2: Pradhana Karma (Evacuation Therapy)',
  },
  'virechana': {
    minPrice: 12500,
    maxPrice: 16500,
    minutes: 90,
    phaseOrder: 2,
    phaseName: 'Phase 2: Pradhana Karma (Evacuation Therapy)',
  },
  'basti-karma': {
    minPrice: 16000,
    maxPrice: 24000,
    minutes: 60,
    phaseOrder: 2,
    phaseName: 'Phase 2: Pradhana Karma (Evacuation Therapy)',
  },
  'raktamokshana': {
    minPrice: 2500,
    maxPrice: 4000,
    minutes: 60,
    phaseOrder: 2,
    phaseName: 'Phase 2: Pradhana Karma (Evacuation Therapy)',
  },
  'nasya-karma': {
    minPrice: 1200,
    maxPrice: 1800,
    minutes: 45,
    phaseOrder: 3,
    phaseName: 'Phase 3: Shamana & Cranial Nourishment',
  },
  'shirodhara': {
    minPrice: 2400,
    maxPrice: 3200,
    minutes: 60,
    phaseOrder: 3,
    phaseName: 'Phase 3: Shamana & Nervous Rest',
  },
  'kati-basti': {
    minPrice: 1500,
    maxPrice: 2200,
    minutes: 45,
    phaseOrder: 3,
    phaseName: 'Phase 3: Targeted Spinal Reservoirs',
  },
  'janu-basti': {
    minPrice: 1600,
    maxPrice: 2400,
    minutes: 45,
    phaseOrder: 3,
    phaseName: 'Phase 3: Targeted Joint Reservoirs',
  },
  'greeva-basti': {
    minPrice: 1500,
    maxPrice: 2200,
    minutes: 45,
    phaseOrder: 3,
    phaseName: 'Phase 3: Targeted Cervical Reservoirs',
  },
  'netra-tarpana': {
    minPrice: 1500,
    maxPrice: 2200,
    minutes: 45,
    phaseOrder: 3,
    phaseName: 'Phase 3: Ocular Kriyakalpa',
  },
  'gastric-agni-care': {
    minPrice: 8500,
    maxPrice: 14000,
    minutes: 60,
    phaseOrder: 4,
    phaseName: 'Phase 4: Paschat Karma (Agni Stabilization)',
  },
};

const PRESET_PACKAGES = [
  {
    id: 'spine-relief',
    name: 'Spine & Sciatic Pain Relief',
    description: 'Targeted lumbar decompression, unctuous muscle release, and Vata colon pacification.',
    slugs: ['kati-basti', 'abhyanga-swedana', 'basti-karma'],
  },
  {
    id: 'stress-reset',
    name: 'Nervous System & Sleep Reset',
    description: 'Meditative cranial oil streaming, whole-body lymphatic massage, and sinus clearing.',
    slugs: ['shirodhara', 'abhyanga-swedana', 'nasya-karma'],
  },
  {
    id: 'deep-detox',
    name: 'Comprehensive Panchakarma Cleanse',
    description: 'Preparatory unction, hepatic purgation, enema rejuvenation, and gut fire rehabilitation.',
    slugs: ['abhyanga-swedana', 'virechana', 'basti-karma', 'gastric-agni-care'],
  },
  {
    id: 'cervical-headache',
    name: 'Cervical & Migraine Protocol',
    description: 'Posterior neck oil pooling, trans-nasal cranial drainage, and soothing Shirodhara.',
    slugs: ['greeva-basti', 'nasya-karma', 'shirodhara'],
  },
];

export function PlannerClient() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    'abhyanga-swedana',
    'shirodhara',
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Toggle single therapy
  const toggleTherapy = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Apply a curated package
  const applyPackage = (slugs: string[]) => {
    setSelectedSlugs(slugs);
  };

  // Clear all
  const clearAll = () => {
    setSelectedSlugs([]);
  };

  // Filter therapies by category tab
  const filteredTherapies = useMemo(() => {
    if (activeCategory === 'All') return treatments;
    return treatments.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  // Selected treatment objects
  const selectedTreatments = useMemo(() => {
    return treatments.filter((t) => selectedSlugs.includes(t.slug));
  }, [selectedSlugs]);

  // Calculated estimates
  const totals = useMemo(() => {
    let minFee = 0;
    let maxFee = 0;
    let totalMinutes = 0;

    selectedSlugs.forEach((slug) => {
      const meta = THERAPY_META[slug];
      if (meta) {
        minFee += meta.minPrice;
        maxFee += meta.maxPrice;
        totalMinutes += meta.minutes;
      }
    });

    return { minFee, maxFee, totalMinutes };
  }, [selectedSlugs]);

  // Suggested classical clinical sequence
  const sequencedTreatments = useMemo(() => {
    return [...selectedTreatments].sort((a, b) => {
      const orderA = THERAPY_META[a.slug]?.phaseOrder || 99;
      const orderB = THERAPY_META[b.slug]?.phaseOrder || 99;
      return orderA - orderB;
    });
  }, [selectedTreatments]);

  // Serialized package query for booking URL
  const bookingUrl = useMemo(() => {
    if (selectedSlugs.length === 0) return '/book';
    const packageQuery = selectedSlugs.join(',');
    return `/book?package=${encodeURIComponent(packageQuery)}&estFee=${totals.minFee}-${totals.maxFee}`;
  }, [selectedSlugs, totals]);

  return (
    <div className="py-12 sm:py-20">
      <Container size="default">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <nav aria-label="Breadcrumb" className="text-xs font-mono text-ink/60 mb-4">
            <Link href="/" className="hover:text-deep-forest underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-forest font-semibold">Panchakarma Estimator</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
            <span className="text-eyebrow font-semibold text-forest tracking-widest">
              Protocol Estimator · Session & Fee Calculator
            </span>
          </div>

          <h1 className="text-display-h1 text-deep-forest font-normal tracking-tight">
            Personalized Therapy Package Planner
          </h1>

          <p className="font-devanagari text-turmeric text-lg sm:text-xl mt-2 tracking-wide font-normal">
            चिकित्सा क्रम नियोजनम् — Classical sequencing of authentic Ayurvedic therapies
          </p>

          <p className="text-body-lg text-ink/80 mt-4 max-w-3xl leading-relaxed">
            In classical Ayurveda, therapies are not administered randomly. Tissues must first be
            softened (*Purva Karma*) before deep cellular toxins can be eliminated (*Pradhana Karma*)
            and metabolic fire restored (*Paschat Karma*). Build your custom combination below to see
            real-time estimated durations, pricing in ₹, and the optimal clinical sequence.
          </p>
        </div>

        {/* Quick-Pick Preset Package Pills */}
        <div className="bg-cream/90 border border-forest/15 rounded-[4px] p-5 mb-10 shadow-xs space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-forest font-semibold block">
            Frequently Prescribed Clinical Sequences:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_PACKAGES.map((pkg) => {
              const isSelected =
                pkg.slugs.length === selectedSlugs.length &&
                pkg.slugs.every((s) => selectedSlugs.includes(s));

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => applyPackage(pkg.slugs)}
                  className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-forest text-cream border-forest shadow-xs'
                      : 'bg-paper text-deep-forest border-forest/15 hover:border-forest/40 hover:bg-cream'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-serif font-medium text-sm block">
                      {pkg.name}
                    </span>
                    <span
                      className={`text-[11px] leading-relaxed block ${
                        isSelected ? 'text-cream/80' : 'text-ink/70'
                      }`}
                    >
                      {pkg.description}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-forest/10 flex items-center justify-between text-[10px] font-mono">
                    <span className={isSelected ? 'text-cream/90' : 'text-sage'}>
                      {pkg.slugs.length} Therapies
                    </span>
                    <span className="underline">Apply Package</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT: Therapy Picker (7 cols) + Sticky Estimator Summary (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: THERAPY SELECTOR (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-forest/15">
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Panchakarma', 'Spine & Joint', 'Skin & Hair', 'Lifestyle & Metabolic'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-forest text-cream font-semibold'
                          : 'bg-cream text-forest hover:bg-forest/10'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              {selectedSlugs.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-mono text-clay hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear selection</span>
                </button>
              )}
            </div>

            {/* List of Therapy Cards */}
            <div className="space-y-4">
              {filteredTherapies.map((therapy) => {
                const isSelected = selectedSlugs.includes(therapy.slug);
                const meta = THERAPY_META[therapy.slug];

                return (
                  <div
                    key={therapy.slug}
                    onClick={() => toggleTherapy(therapy.slug)}
                    className={`p-5 rounded-[4px] border transition-all duration-200 cursor-pointer flex items-start gap-4 shadow-2xs group ${
                      isSelected
                        ? 'bg-cream border-forest/60 ring-1 ring-forest/30'
                        : 'bg-cream/60 hover:bg-cream border-forest/15 hover:border-forest/35'
                    }`}
                  >
                    {/* Checkbox Icon */}
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-1 transition-colors ${
                        isSelected
                          ? 'bg-forest text-cream'
                          : 'bg-paper border border-forest/25 text-transparent group-hover:border-forest'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </div>

                    {/* Therapy Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-devanagari text-turmeric text-xs font-normal">
                          {therapy.sanskritName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper border border-forest/15 text-deep-forest">
                            {therapy.category}
                          </span>
                          <span className="text-[10px] font-mono text-sage">
                            {therapy.primaryDosha}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-serif text-deep-forest font-normal group-hover:text-forest transition-colors">
                        {therapy.name}
                      </h3>

                      <p className="text-body-sm text-ink/75 leading-relaxed line-clamp-2">
                        {therapy.shortDescription}
                      </p>

                      {/* Specs bar */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/70 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-turmeric" />
                          {meta?.minutes || 60} Mins per session
                        </span>
                        <span className="font-semibold text-deep-forest">
                          {therapy.priceRange}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: LIVE ESTIMATOR SUMMARY (5 Cols, Sticky) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-cream border-2 border-forest/20 rounded-[4px] p-6 sm:p-7 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-turmeric font-semibold block mb-1">
                  Live Clinical Estimate
                </span>
                <h2 className="text-display-h3 text-deep-forest font-normal">
                  Your Custom Package Summary
                </h2>
              </div>

              {/* Live Numbers Grid with Animated Count */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-paper rounded border border-forest/15">
                {/* Total Duration */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink/60 block">
                    Session Duration
                  </span>
                  <div className="text-xl sm:text-2xl font-serif font-semibold text-deep-forest flex items-baseline gap-1">
                    <motion.span
                      key={totals.totalMinutes}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {totals.totalMinutes}
                    </motion.span>
                    <span className="text-xs font-mono font-normal text-ink/60">mins total</span>
                  </div>
                  <span className="text-[10px] font-mono text-sage block">
                    {selectedSlugs.length} Therapies Selected
                  </span>
                </div>

                {/* Estimated Fee */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink/60 block">
                    Estimated Fee Range
                  </span>
                  <div className="text-xl sm:text-2xl font-serif font-semibold text-deep-forest">
                    <motion.span
                      key={`${totals.minFee}-${totals.maxFee}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      ₹{totals.minFee.toLocaleString('en-IN')} – ₹{totals.maxFee.toLocaleString('en-IN')}
                    </motion.span>
                  </div>
                  <span className="text-[10px] font-mono text-sage block">
                    Includes classical oils
                  </span>
                </div>
              </div>

              {/* Suggested Clinical Sequencing */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-forest font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-turmeric" />
                    Classical Sequence (क्रम विधानम्)
                  </span>
                  <span className="text-[10px] font-mono text-ink/50">
                    Charaka Taxonomy
                  </span>
                </div>

                {sequencedTreatments.length === 0 ? (
                  <div className="p-4 bg-paper/60 rounded border border-forest/10 text-xs text-ink/60 text-center font-mono">
                    Select one or more therapies on the left to view the optimal clinical sequence.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sequencedTreatments.map((t, idx) => {
                      const meta = THERAPY_META[t.slug];
                      return (
                        <div
                          key={t.slug}
                          className="p-3 bg-paper rounded border border-forest/15 flex items-start gap-2.5 text-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-forest text-cream flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-deep-forest">{t.name}</span>
                              <span className="text-[10px] font-mono text-sage">
                                {meta?.minutes}m
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-turmeric block">
                              {meta?.phaseName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Book Button Carrying Selection */}
              <div className="pt-2">
                <Button
                  href={bookingUrl}
                  variant="primary"
                  size="lg"
                  disabled={selectedSlugs.length === 0}
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Book This Custom Package
                </Button>
                <p className="text-[11px] text-ink/60 font-mono text-center mt-2">
                  Carries your selected therapies directly into the consultation reservation form.
                </p>
              </div>

              {/* Important Physician Notice Note */}
              <div className="p-4 bg-paper rounded border border-forest/20 text-xs text-ink/75 leading-relaxed font-mono space-y-1">
                <div className="font-semibold text-deep-forest flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-turmeric" />
                  Clinical Protocol Notice:
                </div>
                <p>
                  This session estimator is designed for patient scheduling and budget planning. The
                  final therapy sequence, individual oil formulations (Taila Kalpana), and required
                  course duration are definitively decided by Dr. Lavesh Bohra following clinical pulse
                  diagnosis (Nadi Pariksha).
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}

