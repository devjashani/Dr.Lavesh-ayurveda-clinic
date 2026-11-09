'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Condition, Treatment } from '@/lib/data/types';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Filter,
  X,
  Compass,
} from 'lucide-react';

interface ConditionsDirectoryProps {
  conditions: Condition[];
  treatments: Treatment[];
}

export function ConditionsDirectory({
  conditions,
  treatments,
}: ConditionsDirectoryProps) {
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract all available letters dynamically (A, D, H, I, M, O, P, S, T)
  const availableLetters = useMemo(() => {
    const letters = Array.from(new Set(conditions.map((c) => c.letter))).sort();
    return ['All', ...letters];
  }, [conditions]);

  // Map therapy slug to Treatment object for rich chip metadata
  const treatmentMap = useMemo(() => {
    const map = new Map<string, Treatment>();
    treatments.forEach((t) => {
      map.set(t.slug, t);
      if (t.aliases) {
        t.aliases.forEach((alias) => map.set(alias, t));
      }
    });
    return map;
  }, [treatments]);

  // Filter conditions
  const filteredConditions = useMemo(() => {
    return conditions.filter((c) => {
      const matchesLetter =
        selectedLetter === 'All' || c.letter === selectedLetter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        c.sanskritName.includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.clinicalSigns.some((sign) => sign.toLowerCase().includes(q)) ||
        c.doshaInvolvement.toLowerCase().includes(q);

      return matchesLetter && matchesSearch;
    });
  }, [conditions, selectedLetter, searchQuery]);

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
            <span className="text-forest font-semibold">Conditions Directory</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
            <span className="text-eyebrow font-semibold text-forest tracking-widest">
              A–Z Clinical Pathology Index · Root-Cause Chikitsa
            </span>
          </div>

          <h1 className="text-display-h1 text-deep-forest font-normal tracking-tight">
            Conditions We Support
          </h1>

          <p className="font-devanagari text-turmeric text-lg sm:text-xl mt-2 tracking-wide font-normal">
            रोगमादौ परीक्षेत ततोऽनन्तरमौषधम् — First diagnose the root pathology, then prescribe the medicine
          </p>

          <p className="text-body-lg text-ink/80 mt-4 max-w-3xl leading-relaxed">
            In classical Ayurveda, a health condition is never treated as an isolated organ malfunction
            or suppressed with symptomatic blockers. Every pathology (<em>Vyadhi</em>) arises from
            a specific imbalance in the three doshas, stagnation of metabolic toxins (<em>Ama</em>),
            and impairment of tissue transformation (<em>Dhatvagni</em>). Explore our A–Z directory
            to discover how classical Samhita protocols address root causes.
          </p>
        </div>

        {/* Search & A-Z Quick Jump Bar */}
        <div className="bg-cream/90 border border-forest/15 rounded-[4px] p-5 mb-10 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conditions (e.g. sciatica, migraine, pcod, insomnia, joint stiffness)..."
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

            {/* Results count */}
            <div className="flex items-center gap-2 text-xs font-mono text-ink/70">
              <span className="w-2 h-2 rounded-full bg-forest/40" />
              <span>
                Showing <strong>{filteredConditions.length}</strong> of{' '}
                {conditions.length} conditions
              </span>
            </div>
          </div>

          {/* A-Z Alphabet Filter Strip */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-forest/10">
            <span className="text-xs font-mono text-forest/70 uppercase mr-2 tracking-wider hidden sm:inline">
              Alphabet:
            </span>
            {availableLetters.map((letter) => {
              const isActive = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`relative text-xs w-8 h-8 rounded-full flex items-center justify-center font-mono font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-cream font-bold'
                      : 'text-forest/80 hover:text-deep-forest hover:bg-forest/10'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeLetterPill"
                      className="absolute inset-0 bg-forest rounded-full -z-10 shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editorial Conditions List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredConditions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-cream/60 border border-forest/15 rounded-[4px] p-12 text-center my-8"
              >
                <Compass className="w-8 h-8 text-forest/40 mx-auto mb-3" />
                <h3 className="text-display-h3 text-deep-forest font-normal">
                  No matching condition found
                </h3>
                <p className="text-body-base text-ink/70 max-w-md mx-auto mt-2">
                  We couldn&apos;t find any clinical condition matching &ldquo;{searchQuery}&rdquo;. Try another
                  term or reset your filters.
                </p>
                <div className="mt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedLetter('All');
                      setSearchQuery('');
                    }}
                  >
                    Reset all filters
                  </Button>
                </div>
              </motion.div>
            ) : (
              filteredConditions.map((condition, idx) => {
                const isExpanded = expandedId === condition.id;

                return (
                  <motion.div
                    key={condition.id}
                    layout
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group bg-cream/80 hover:bg-cream border border-forest/20 hover:border-forest/50 rounded-[4px] p-6 sm:p-8 transition-all duration-300 shadow-xs"
                  >
                    {/* Top Row: Alphabet Marker + Category + Sanskrit */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-paper border border-forest/25 flex items-center justify-center font-mono text-xs font-bold text-turmeric shrink-0 shadow-2xs">
                          {condition.letter}
                        </span>
                        <span className="text-xs font-mono text-forest/70 font-semibold tracking-wider uppercase">
                          {condition.category}
                        </span>
                      </div>

                      <span className="font-devanagari text-turmeric text-base sm:text-lg font-normal">
                        {condition.sanskritName}
                      </span>
                    </div>

                    {/* Headline: Large Editorial Condition Name */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-deep-forest font-normal tracking-tight group-hover:text-forest transition-colors">
                          {condition.name}
                        </h2>
                        <div className="mt-2 flex items-center gap-2 text-xs text-ink/80">
                          <span className="font-semibold text-forest uppercase tracking-wider text-[11px] font-mono">Doshic Root:</span>
                          <span className="italic text-ink/90 font-medium">{condition.doshaInvolvement}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : condition.id)
                        }
                        className="self-start lg:self-center text-xs font-mono font-medium text-forest hover:text-turmeric underline flex items-center gap-1 cursor-pointer py-1"
                      >
                        {isExpanded ? 'Hide clinical details' : 'Explore full protocol & symptoms'}
                        <ArrowRight
                          className={`w-3.5 h-3.5 transform transition-transform ${
                            isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Pathophysiology Excerpt */}
                    <p className="text-body-base text-ink/85 mt-4 leading-relaxed max-w-4xl">
                      {condition.pathophysiology}
                    </p>

                    {/* Classical Charaka Quote */}
                    {condition.quoteCharaka && (
                      <div className="mt-4 p-3.5 bg-paper rounded border-l-2 border-turmeric text-xs italic text-deep-forest font-serif leading-relaxed">
                        &ldquo;{condition.quoteCharaka}&rdquo;
                      </div>
                    )}

                    {/* Always visible or hover-revealed Recommended Therapies */}
                    <div className="mt-6 pt-5 border-t border-forest/15">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="text-xs font-mono uppercase tracking-wider text-forest font-semibold shrink-0">
                          Recommended Classical Therapies:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {condition.recommendedTherapySlugs.map((slug) => {
                            const therapy = treatmentMap.get(slug);
                            const label = therapy ? therapy.name : slug;

                            return (
                              <Link
                                key={slug}
                                href={`/treatments/${therapy ? therapy.slug : slug}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-paper hover:bg-forest hover:text-cream border border-forest/25 text-deep-forest text-xs font-semibold transition-all shadow-2xs group/chip"
                              >
                                <Sparkles className="w-3 h-3 text-turmeric group-hover/chip:text-cream" />
                                <span>{label}</span>
                                <ArrowRight className="w-3 h-3 text-forest/70 group-hover/chip:text-cream group-hover/chip:translate-x-0.5 transition-transform" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Clinical Breakdown (Symptoms & Dietary Care) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 mt-6 border-t border-forest/10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-paper/60 p-5 rounded-[4px] border border-forest/15">
                            {/* Clinical Signs */}
                            <div>
                              <h4 className="text-xs font-mono uppercase tracking-wider text-forest font-semibold mb-3 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-turmeric" />
                                Characteristic Symptoms (लक्षण)
                              </h4>
                              <ul className="space-y-2">
                                {condition.clinicalSigns.map((sign, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-ink/80 flex items-start gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                                    <span>{sign}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Classical Diet & Lifestyle Advice */}
                            <div>
                              <h4 className="text-xs font-mono uppercase tracking-wider text-forest font-semibold mb-3 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-turmeric" />
                                Pathya-Apathya (Classical Dietary Care)
                              </h4>
                              <p className="text-xs text-ink/80 leading-relaxed">
                                {condition.classicalDietAdvice}
                              </p>
                              <div className="mt-4 pt-3 border-t border-forest/10 flex items-center gap-2">
                                <Button
                                  href={`/book?concern=${condition.id}`}
                                  variant="turmeric"
                                  size="sm"
                                  className="w-full sm:w-auto"
                                >
                                  Consult for {condition.name.split(' ')[0]}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-16 pt-12 border-t border-forest/15">
          <div className="bg-forest text-cream rounded-[4px] p-6 sm:p-10 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-turmeric block mb-2">
                Classical Clinical Guidance
              </span>
              <h3 className="text-display-h2 font-normal text-cream tracking-tight">
                Your symptom is a branch; your constitution is the root.
              </h3>
              <p className="text-body-base text-cream/80 mt-3 leading-relaxed">
                In modern medicine, different diseases receive standardized symptom suppressants.
                In classical Ayurveda, two individuals with the exact same condition label—such as
                Migraine—receive completely distinct treatment regimens based on their metabolic
                digestive fire, sleep patterns, and pulse rhythm.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button
                  href="/book"
                  variant="turmeric"
                  size="md"
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Book Root-Cause Pulse Consultation
                </Button>
                <Button
                  href="/dosha-quiz"
                  variant="secondary"
                  size="md"
                  className="bg-transparent text-cream border-cream/30 hover:bg-cream/10"
                >
                  Determine Your Prakriti (Dosha Quiz)
                </Button>
              </div>
            </div>
            {/* Subtle background flourish */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
              <BotanicalDivider variant="leaf" className="w-96 h-96" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

