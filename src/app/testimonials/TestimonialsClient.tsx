'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Testimonial } from '@/lib/data/types';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Star,
  Quote,
  MapPin,
  User,
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

const CONDITION_FILTERS = [
  'All',
  'Arthritis & Spine',
  'Sciatica & Disc',
  'Skin & Psoriasis',
  'Gut & IBS',
  'Insomnia & Stress',
  "Women's Health",
] as const;

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = testimonials.filter((t) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Arthritis & Spine')
      return t.conditionTreated.toLowerCase().includes('arthritis') || t.conditionTreated.toLowerCase().includes('osteoarthritis');
    if (selectedFilter === 'Sciatica & Disc')
      return t.conditionTreated.toLowerCase().includes('sciatica') || t.conditionTreated.toLowerCase().includes('herniation');
    if (selectedFilter === 'Skin & Psoriasis')
      return t.conditionTreated.toLowerCase().includes('psoriasis') || t.conditionTreated.toLowerCase().includes('skin');
    if (selectedFilter === 'Gut & IBS')
      return t.conditionTreated.toLowerCase().includes('grahani') || t.conditionTreated.toLowerCase().includes('colitis') || t.conditionTreated.toLowerCase().includes('ibs');
    if (selectedFilter === 'Insomnia & Stress')
      return t.conditionTreated.toLowerCase().includes('insomnia') || t.conditionTreated.toLowerCase().includes('burnout');
    if (selectedFilter === "Women's Health")
      return t.conditionTreated.toLowerCase().includes('pcod') || t.conditionTreated.toLowerCase().includes('infertility');
    return true;
  });

  return (
    <div>
      {/* Condition Filter Bar */}
      <Container className="mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="font-mono text-xs uppercase tracking-wider text-forest/70 font-medium mr-2 shrink-0">
            Filter by Condition:
          </span>
          {CONDITION_FILTERS.map((cat) => {
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-body transition-all whitespace-nowrap ${isActive
                    ? 'text-paper bg-forest font-medium shadow-xs'
                    : 'text-deep-forest/80 bg-paper hover:bg-paper/80 border border-forest/10'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </Container>

      {/* Masonry Layout Grid */}
      <Container className="mb-20">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filtered.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs hover:border-forest/35 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Meta: Verified Badge + City */}
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-forest/10">
                      <div className="flex items-center gap-1.5 text-xs text-forest font-mono">
                        <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
                        <span className="font-medium">Verified Clinical Patient</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-ink/60">
                        <MapPin className="w-3 h-3 text-clay" />
                        <span className="truncate max-w-[120px]">{item.location}</span>
                      </div>
                    </div>

                    {/* Condition & Therapy Chips */}
                    <div className="space-y-1.5 mb-4">
                      <div className="font-mono text-xs font-medium text-deep-forest flex items-start gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-clay shrink-0 mt-0.5" />
                        <span>{item.conditionTreated}</span>
                      </div>
                      <div className="text-[11px] font-mono text-forest/80 bg-cream p-2 rounded-[2px] border border-forest/10">
                        Protocol: {item.treatmentReceived}
                      </div>
                    </div>

                    {/* Quotation */}
                    <div className="relative mb-4">
                      <Quote className="w-6 h-6 text-forest/15 absolute -top-2 -left-1 pointer-events-none" />
                      <p className="font-body text-xs sm:text-sm text-ink/85 italic leading-relaxed pl-3 border-l-2 border-turmeric">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Detailed Case Story */}
                    {item.fullStory && (
                      <div className="mt-3 pt-3 border-t border-forest/5">
                        <p
                          className={`font-body text-xs text-ink/75 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'
                            }`}
                        >
                          {item.fullStory}
                        </p>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="mt-1 text-[11px] font-mono text-forest hover:text-deep-forest underline underline-offset-2 font-medium"
                        >
                          {isExpanded ? 'Show less' : 'Read full clinical case'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Patient Info Footer */}
                  <div className="pt-4 mt-4 border-t border-forest/10 flex items-center justify-between">
                    <div>
                      <span className="font-display text-sm font-medium text-deep-forest block">
                        {item.patientName} {item.age && `(${item.age} yrs)`}
                      </span>
                      {item.doctorInCharge && (
                        <span className="font-mono text-[10px] text-ink/60 block mt-0.5">
                          Supervised by {item.doctorInCharge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5 text-turmeric">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}

