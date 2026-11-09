'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { TreatmentFAQ } from '@/lib/data/types';

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
              className="w-full flex items-center justify-between text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer"
            >
              <div className="flex items-start gap-3 pr-4">
                <HelpCircle className="w-4 h-4 text-turmeric shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base font-serif font-medium text-deep-forest">
                  {faq.question}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 text-forest/70"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 border-t border-forest/10 mt-1">
                    <p className="text-body-sm text-ink/80 leading-relaxed pl-7">
                      {faq.answer}
                    </p>
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

