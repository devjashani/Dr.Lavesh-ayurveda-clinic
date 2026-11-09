'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, HelpCircle } from 'lucide-react';
import { TreatmentFAQ } from '@/lib/data/types';
import { MOTION_TOKENS } from '@/lib/motion';

interface TreatmentFaqAccordionProps {
  faqs: TreatmentFAQ[];
}

export function TreatmentFaqAccordion({ faqs }: TreatmentFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`border rounded-[4px] transition-colors duration-200 overflow-hidden ${
              isOpen
                ? 'border-forest/40 bg-cream/90'
                : 'border-forest/15 bg-paper hover:border-forest/25'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer group"
            >
              <div className="flex items-start gap-3 pr-4">
                <HelpCircle className="w-4 h-4 text-turmeric shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base font-serif font-medium text-deep-forest group-hover:text-forest transition-colors">
                  {faq.question}
                </span>
              </div>
              <motion.div
                animate={{
                  rotate: isOpen ? 45 : 0,
                  backgroundColor: isOpen ? '#1F3D2B' : '#FBF8F1',
                  color: isOpen ? '#F6F1E7' : '#1F3D2B',
                }}
                transition={{ duration: 0.28, ease: MOTION_TOKENS.ease }}
                className="shrink-0 p-1 rounded-full border border-forest/20 text-forest shadow-2xs"
              >
                <Plus className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: MOTION_TOKENS.ease }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-ink/80 leading-relaxed border-t border-forest/10 font-sans">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
