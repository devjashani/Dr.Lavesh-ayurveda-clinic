'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Wind, Flame, Mountain, Sparkles, ArrowRight } from 'lucide-react';

interface DoshaInfo {
  id: 'vata' | 'pitta' | 'kapha';
  name: string;
  sanskrit: string;
  elements: string;
  qualities: string;
  signsOfImbalance: string;
  pacification: string;
  icon: React.ReactNode;
}

const doshas: DoshaInfo[] = [
  {
    id: 'vata',
    name: 'Vata',
    sanskrit: 'वात दोष',
    elements: 'Air + Space (वायु + आकाश)',
    qualities: 'Mobile, Light, Cold, Dry, Subtle',
    signsOfImbalance: 'Insomnia, anxiety, constipation, joint cracking, dry skin',
    pacification: 'Warm sesame oil, grounding khichdi, regular circadian rhythm',
    icon: <Wind className="w-5 h-5 text-sage" />,
  },
  {
    id: 'pitta',
    name: 'Pitta',
    sanskrit: 'पित्त दोष',
    elements: 'Fire + Water (अग्नि + जल)',
    qualities: 'Hot, Sharp, Light, Acidic, Pungent',
    signsOfImbalance: 'Acid reflux, skin rashes, migraine, inflammatory flares, irritability',
    pacification: 'Cooling ghee, bitter greens, moonlit walks, sweet fruits',
    icon: <Flame className="w-5 h-5 text-turmeric" />,
  },
  {
    id: 'kapha',
    name: 'Kapha',
    sanskrit: 'कफ दोष',
    elements: 'Water + Earth (जल + पृथ्वी)',
    qualities: 'Heavy, Slow, Cool, Dense, Static',
    signsOfImbalance: 'Weight gain, sluggish digestion, morning congestion, lethargy',
    pacification: 'Warming ginger & black pepper, rigorous exercise, dry steam (Swedana)',
    icon: <Mountain className="w-5 h-5 text-paper/80" />,
  },
];

export function DoshaTeaser() {
  const [activeTab, setActiveTab] = useState<'vata' | 'pitta' | 'kapha'>('vata');

  return (
    <section className="py-20 sm:py-28 bg-deep-forest text-cream relative overflow-hidden border-b border-forest/30">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-turmeric/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="default">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Badge variant="cream" className="mb-4">
            Tri-Dosha Assessment
          </Badge>

          <h2 className="text-display-h2 text-cream font-normal tracking-tight">
            Discover Your Unique Constitutional Blueprint
          </h2>

          <p className="text-body-base text-paper/80 mt-4 leading-relaxed">
            In Ayurvedic medicine, no two human beings are biologically identical. Your health depends entirely on the unique proportion of the three constitutional bio-regulators: Vata, Pitta, and Kapha.
          </p>
        </div>

        {/* 3 Animated Dosha Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doshas.map((d) => {
            const isSelected = activeTab === d.id;
            return (
              <motion.div
                key={d.id}
                onClick={() => setActiveTab(d.id)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className={`p-6 sm:p-8 rounded-[4px] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-forest/50 border-turmeric shadow-[0_8px_30px_rgba(20,41,28,0.4)] ring-1 ring-turmeric/50'
                    : 'bg-forest/25 border-forest/40 hover:border-forest/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center">
                      {d.icon}
                    </div>
                    <span className="font-serif italic text-xs text-sage">
                      {d.sanskrit}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-normal text-cream mb-1">
                    {d.name}
                  </h3>

                  <p className="text-xs font-mono text-turmeric/90 mb-4">
                    {d.elements}
                  </p>

                  <div className="space-y-3 text-xs text-paper/80 pt-2 border-t border-forest/40">
                    <div>
                      <span className="text-sage font-medium block">Qualities (Gunas):</span>
                      <span>{d.qualities}</span>
                    </div>

                    <div>
                      <span className="text-sage font-medium block">Common Imbalances:</span>
                      <span className="text-paper/70">{d.signsOfImbalance}</span>
                    </div>

                    <div>
                      <span className="text-sage font-medium block">Pacification Key:</span>
                      <span className="text-paper/70">{d.pacification}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-forest/30 flex items-center justify-between text-xs text-turmeric font-medium">
                  <span>Explore {d.name} Diet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA to Full Quiz */}
        <div className="mt-14 pt-8 border-t border-forest/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-display text-xl text-cream font-normal">
              Not sure which Dosha is aggravated?
            </h4>
            <p className="text-xs text-paper/70 mt-1">
              Take our clinical 24-question diagnostic quiz based on Charaka Samhita. Takes ~3 minutes.
            </p>
          </div>

          <Button
            href="/dosha-quiz"
            variant="turmeric"
            size="lg"
            showArrow
            className="shrink-0"
          >
            Take the Free Dosha Quiz
          </Button>
        </div>
      </Container>
    </section>
  );
}

