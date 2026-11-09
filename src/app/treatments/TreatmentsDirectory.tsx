'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Treatment } from '@/lib/data/types';
import {
  Search,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  X,
  CheckCircle2,
} from 'lucide-react';

interface TreatmentsDirectoryProps {
  treatments: Treatment[];
}

const CATEGORIES = [
  'All',
  'Panchakarma',
  'Spine & Joint',
  'Skin & Hair',
  'Lifestyle & Metabolic',
] as const;

export function TreatmentsDirectory({ treatments }: TreatmentsDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTreatments = useMemo(() => {
    return treatments.filter((t) => {
      const matchesCategory =
        selectedCategory === 'All' || t.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        t.name.toLowerCase().includes(q) ||
        t.sanskritName.includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.indications.some((ind) => ind.toLowerCase().includes(q)) ||
        t.herbsUsed.some((herb) => herb.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [treatments, selectedCategory, searchQuery]);

  return (
    <div className="py-12 sm:py-20">
      <Container size="default">
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-2 text-xs text-ink/60 mb-4 font-mono"
          >
            <Link href="/" className="hover:text-deep-forest underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-forest font-semibold">Treatments</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
            <span className="text-eyebrow font-semibold text-forest tracking-widest">
              Classical Chikitsa Directory · 12 Authentic Samhita Protocols
            </span>
          </div>

          <h1 className="text-display-h1 text-deep-forest font-normal tracking-tight">
            Classical Samhita Therapies
          </h1>

          <p className="font-devanagari text-turmeric text-lg sm:text-xl mt-2 tracking-wide">
            कार्यं धातुसाम्यमिहोच्यते — The aim of medicine is restoring constitutional harmony
          </p>

          <p className="text-body-lg text-ink/80 mt-4 max-w-3xl leading-relaxed">
            Every therapy at Aarogyam is prescribed strictly following pulse examination (
            <em>Nadi Pariksha</em>) and eight-fold clinical diagnosis (<em>Ashtavidha Pariksha</em>).
            We do not operate as a commercial spa menu. Each protocol below is an authentic
            medical intervention formulated from the canonical treatises of Charaka, Sushruta, and
            Vagbhata.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-cream/90 border border-forest/15 rounded-[4px] p-5 mb-10 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search therapies, indications (e.g. sciatica, migraine, psoriasis, insomnia), or herbs..."
                className="w-full bg-paper border border-forest/20 text-xs px-3.5 py-2.5 pl-10 pr-9 rounded-[3px] text-ink placeholder:text-ink/40 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results count pill */}
            <div className="flex items-center gap-2 text-xs font-mono text-ink/70">
              <span className="w-2 h-2 rounded-full bg-forest/40" />
              <span>
                Showing <strong>{filteredTreatments.length}</strong> of{' '}
                {treatments.length} protocols
              </span>
            </div>
          </div>

          {/* Animated Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-forest/10">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative text-xs px-3.5 py-1.5 rounded-full transition-colors font-medium cursor-pointer ${
                    isActive
                      ? 'text-cream font-semibold'
                      : 'text-forest/80 hover:text-deep-forest hover:bg-forest/5'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-forest rounded-full -z-10 shadow-xs"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Therapy Cards Grid with Varied Rhythm */}
        <AnimatePresence mode="popLayout">
          {filteredTreatments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-cream/60 border border-forest/15 rounded-[4px] p-12 text-center my-12"
            >
              <Compass className="w-8 h-8 text-forest/40 mx-auto mb-3" />
              <h3 className="text-display-h3 text-deep-forest font-normal">
                No matching therapies found
              </h3>
              <p className="text-body-base text-ink/70 max-w-md mx-auto mt-2">
                We couldn&apos;t find any therapy matching &ldquo;{searchQuery}&rdquo;. Try another search term
                or reset your filters.
              </p>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Reset all filters
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {filteredTreatments.map((therapy, index) => {
                const isFeatured = therapy.featured || index === 0;

                // Varied rhythm: Featured takes 12 cols, others alternate between 6 cols and 4 cols
                const colSpanClass = isFeatured
                  ? 'lg:col-span-12'
                  : index % 3 === 0
                  ? 'lg:col-span-7'
                  : index % 3 === 1
                  ? 'lg:col-span-5'
                  : 'lg:col-span-6';

                return (
                  <motion.article
                    key={therapy.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={`${colSpanClass} group bg-cream/70 hover:bg-cream border border-forest/15 hover:border-turmeric/60 hover:-translate-y-1 rounded-[4px] overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col shadow-xs relative`}
                  >
                    {/* Arrow circle fades in at corner */}
                    <div
                      aria-hidden="true"
                      className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-paper/95 text-deep-forest border border-forest/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-2xs pointer-events-none"
                    >
                      <ArrowUpRight className="w-4 h-4 text-turmeric" />
                    </div>

                    <Link
                      href={`/treatments/${therapy.slug}`}
                      className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-forest"
                    >
                      {/* Featured Card Layout (Large 2-column horizontal banner on desktop) */}
                      {isFeatured ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                          {/* Image half */}
                          <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto overflow-hidden bg-forest/10 min-h-[280px]">
                            <Image
                              src={therapy.featuredImage}
                              alt={therapy.name}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.06] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/60 via-transparent to-transparent lg:hidden" />
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                              <Badge variant="turmeric" dot>
                                Featured Classical Protocol
                              </Badge>
                              <Badge variant="sage">
                                {therapy.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Content half */}
                          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="font-devanagari text-turmeric text-sm sm:text-base font-normal">
                                  {therapy.sanskritName}
                                </span>
                                <span className="text-[11px] font-mono text-sage tracking-wider uppercase">
                                  {therapy.primaryDosha} Pacifying
                                </span>
                              </div>

                              <h2 className="text-display-h2 text-deep-forest font-normal group-hover:text-forest transition-colors">
                                {therapy.name}
                              </h2>

                              <p className="text-body-base text-ink/80 mt-2 line-clamp-3 leading-relaxed">
                                {therapy.shortDescription}
                              </p>

                              {/* Indication Chips */}
                              <div className="mt-4 pt-4 border-t border-forest/10">
                                <span className="text-[10px] font-mono text-forest/70 uppercase tracking-wider block mb-2">
                                  Primary Clinical Indications
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {therapy.indications.slice(0, 4).map((ind, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-full bg-paper border border-forest/15 text-forest"
                                    >
                                      {ind}
                                    </span>
                                  ))}
                                  {therapy.indications.length > 4 && (
                                    <span className="text-[11px] text-ink/50 px-1 py-0.5">
                                      +{therapy.indications.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Footer metadata */}
                            <div className="pt-4 border-t border-forest/10 flex items-center justify-between gap-4">
                              <div className="space-y-0.5">
                                <div className="text-[10px] font-mono text-ink/60 uppercase">
                                  Protocol Duration & Pricing
                                </div>
                                <div className="text-xs font-semibold text-deep-forest">
                                  {therapy.priceRange}
                                </div>
                              </div>

                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-forest group-hover:text-turmeric transition-colors">
                                <span>View Protocol Details</span>
                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Standard Editorial Cards with Asymmetric Rhythm */
                        <div className="flex flex-col h-full">
                          {/* Image container */}
                          <div className="relative aspect-16/10 overflow-hidden bg-forest/10">
                            <Image
                              src={therapy.featuredImage}
                              alt={therapy.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.06] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/40 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span className="bg-paper/90 backdrop-blur-xs text-[10px] font-mono font-medium px-2 py-0.5 rounded-full text-deep-forest border border-forest/20">
                                {therapy.category}
                              </span>
                            </div>
                            <div className="absolute bottom-2.5 right-3 text-right">
                              <span className="text-[11px] font-mono text-cream/95 bg-deep-forest/70 px-2 py-0.5 rounded-full">
                                {therapy.primaryDosha}
                              </span>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <span className="font-devanagari text-turmeric text-xs font-normal block mb-1">
                                {therapy.sanskritName}
                              </span>

                              <h2 className="text-display-h3 text-deep-forest font-normal group-hover:text-forest transition-colors">
                                {therapy.name}
                              </h2>

                              <p className="text-body-sm text-ink/75 mt-2 line-clamp-2 leading-relaxed">
                                {therapy.shortDescription}
                              </p>

                              {/* Indication Chips Preview */}
                              <div className="flex flex-wrap gap-1 mt-3">
                                {therapy.indications.slice(0, 2).map((ind, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-2 py-0.5 rounded bg-paper border border-forest/10 text-forest/90"
                                  >
                                    {ind}
                                  </span>
                                ))}
                                {therapy.indications.length > 2 && (
                                  <span className="text-[10px] text-ink/50 px-1 py-0.5">
                                    +{therapy.indications.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-3 border-t border-forest/10 flex items-center justify-between text-xs">
                              <span className="text-[11px] font-mono text-ink/70">
                                {therapy.duration}
                              </span>

                              <span className="inline-flex items-center gap-1 font-medium text-forest group-hover:text-turmeric transition-colors">
                                <span>Details</span>
                                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Bottom Consultation Advisory */}
        <div className="mt-16 pt-12 border-t border-forest/15">
          <div className="bg-forest text-cream rounded-[4px] p-6 sm:p-10 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-turmeric block mb-2">
                Personalized Clinical Protocol
              </span>
              <h3 className="text-display-h2 font-normal text-cream tracking-tight">
                Not sure which classical therapy fits your constitution?
              </h3>
              <p className="text-body-base text-cream/80 mt-3 leading-relaxed">
                Ayurvedic therapies are never chosen arbitrarily from a menu. In classical practice,
                the same symptom in two patients may require completely opposite therapies depending on
                metabolic fire (Agni), tissue strength (Bala), and pulse rhythm.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button
                  href="/book"
                  variant="turmeric"
                  size="md"
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Schedule Pulse Diagnosis (Nadi Pariksha)
                </Button>
                <Button
                  href="/dosha-quiz"
                  variant="secondary"
                  size="md"
                  className="bg-transparent text-cream border-cream/30 hover:bg-cream/10"
                >
                  Take Dosha Assessment
                </Button>
              </div>
            </div>
            {/* Subtle background motif */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
              <BotanicalDivider variant="lotus" className="w-96 h-96" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

