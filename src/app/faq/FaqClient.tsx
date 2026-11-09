'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQItem } from '@/lib/data/types';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  ChevronDown,
  Phone,
  MessageCircle,
  Mail,
  HelpCircle,
  Stethoscope,
  Video,
  Sparkles,
  CreditCard,
  Leaf,
} from 'lucide-react';

interface FaqClientProps {
  faqs: FAQItem[];
}

const CATEGORIES: {
  key: FAQItem['category'] | 'All';
  label: string;
  sanskrit: string;
  icon: any;
}[] = [
  { key: 'All', label: 'All Questions', sanskrit: 'सर्वप्रश्नाः', icon: HelpCircle },
  { key: 'First visit', label: 'First Visit & Nadi', sanskrit: 'प्रथम परामर्श', icon: Stethoscope },
  { key: 'Online consultation', label: 'Online Video Consult', sanskrit: 'दूरस्थ परामर्श', icon: Video },
  { key: 'Panchakarma', label: 'Panchakarma Care', sanskrit: 'पञ्चकर्म शोधन', icon: Sparkles },
  { key: 'Payments', label: 'Payments & AYUSH Insurance', sanskrit: 'शुल्क एवं बीमा', icon: CreditCard },
  { key: 'Medicines & diet', label: 'Medicines & Pathya Diet', sanskrit: 'औषध एवं पथ्य', icon: Leaf },
];

export function FaqClient({ faqs }: FaqClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-fv-1': true,
    'faq-pk-1': true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by category if 'All' is selected
  const activeCategories = (
    selectedCategory === 'All'
      ? ['First visit', 'Online consultation', 'Panchakarma', 'Payments', 'Medicines & diet']
      : [selectedCategory]
  ) as FAQItem['category'][];

  return (
    <div>
      {/* Search Input & Category Pills */}
      <Container className="mb-12">
        <div className="bg-paper border border-forest/15 rounded-[4px] p-4 sm:p-6 shadow-xs max-w-4xl mx-auto space-y-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword (e.g. pulse, fasting, insurance, heavy metal, cost)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-[3px] bg-cream text-xs sm:text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40 hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-body transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-forest text-paper font-medium shadow-xs'
                      : 'bg-cream text-deep-forest/80 hover:bg-paper border border-forest/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Accordions Grouped by Category */}
      <Container className="mb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center bg-paper rounded-[4px] border border-forest/15">
              <p className="font-display text-lg text-deep-forest">
                No matching questions found for "{searchQuery}"
              </p>
              <p className="font-body text-xs text-ink/70 mt-1 mb-4">
                Feel free to call our clinical help desk directly.
              </p>
              <Button onClick={() => setSearchQuery('')} variant="secondary">
                Reset Search
              </Button>
            </div>
          ) : (
            activeCategories.map((cat) => {
              const groupItems = filteredFaqs.filter((f) => f.category === cat);
              if (groupItems.length === 0) return null;

              return (
                <div key={cat} className="space-y-4">
                  {/* Category Header */}
                  <div className="border-b border-forest/15 pb-2 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl text-deep-forest font-medium">
                        {cat}
                      </h2>
                    </div>
                    <Badge variant="sage">{groupItems.length} FAQs</Badge>
                  </div>

                  {/* Accordion Items in Group */}
                  <div className="space-y-3">
                    {groupItems.map((item) => {
                      const isOpen = !!openIds[item.id];

                      return (
                        <div
                          key={item.id}
                          className="bg-paper border border-forest/15 rounded-[4px] overflow-hidden transition-all hover:border-forest/30 shadow-xs"
                        >
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                          >
                            <span className="font-display text-sm sm:text-base text-deep-forest font-medium leading-snug">
                              {item.question}
                            </span>
                            <span
                              className={`p-1 rounded-full bg-cream text-forest shrink-0 mt-0.5 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 bg-forest text-paper' : ''
                              }`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </span>
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm font-body text-ink/80 leading-relaxed border-t border-forest/5">
                                  {item.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Container>

      {/* Still Have Questions? Help Desk Banner */}
      <Container>
        <div className="max-w-4xl mx-auto bg-forest text-paper p-8 sm:p-10 rounded-[4px] border border-deep-forest shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="font-mono text-xs text-turmeric uppercase tracking-wider block font-medium">
                Clinical Front Desk
              </span>
              <h3 className="font-display text-2xl text-paper">
                Have a Specific Medical Inquiry?
              </h3>
              <p className="font-body text-xs sm:text-sm text-paper/80 leading-relaxed">
                Our resident care coordinators are available Monday through Saturday to answer questions
                regarding diagnosis, traveling to Jaipur, or dietary preparations.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-2.5">
              <Button
                href="https://wa.me/919414012345?text=Namaste%2C%20I%20have%20a%20question%20regarding%20Aarogyam%20treatments."
                variant="primary"
                external
                className="w-full justify-center bg-turmeric text-deep-forest hover:bg-turmeric/90 text-xs"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                WhatsApp Help Desk
              </Button>
              <Button
                href="tel:+911412389400"
                variant="secondary"
                external
                className="w-full justify-center border-paper/40 text-paper hover:bg-paper/10 text-xs"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                Call +91 141 238 9400
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

