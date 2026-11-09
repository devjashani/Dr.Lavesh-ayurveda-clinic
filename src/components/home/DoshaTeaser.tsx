'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Wind, Flame, Mountain, ArrowRight } from 'lucide-react';
import { Reveal, RevealText, Magnetic } from '@/components/motion';
import { usePrefersReducedMotion, MOTION_TOKENS } from '@/lib/motion';

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

/**
 * 3D Tilt Card with dynamic cursor glare (max ±6 degrees rotation)
 */
function DoshaTiltCard({
  dosha,
  isSelected,
  onClick,
}: {
  dosha: DoshaInfo;
  isSelected: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation with max 6 degrees clamp
    const rotX = Math.max(Math.min(((y - centerY) / centerY) * -6, 6), -6);
    const rotY = Math.max(Math.min(((x - centerX) / centerX) * 6, 6), -6);

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: prefersReduced
            ? undefined
            : `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'translateY(-4px)' : 'translateY(0)'}`,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.1s ease-out'
            : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className={`relative p-6 sm:p-8 rounded-[4px] border cursor-pointer flex flex-col justify-between h-full select-none overflow-hidden ${
          isSelected
            ? 'bg-forest/50 border-turmeric shadow-[0_12px_32px_rgba(20,41,28,0.45)] ring-1 ring-turmeric/60'
            : 'bg-forest/25 border-forest/40 hover:border-turmeric/50'
        }`}
      >
        {/* Subtle moving glare sheen overlay on hover */}
        {!prefersReduced && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[4px] transition-opacity duration-300 z-30"
            style={{
              opacity: isHovered ? 0.28 : 0,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 65%)`,
            }}
          />
        )}

        {/* Card Content with 3D depth */}
        <div style={{ transform: prefersReduced ? undefined : 'translateZ(20px)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center">
              {dosha.icon}
            </div>
            <span className="font-serif italic text-xs text-sage">
              {dosha.sanskrit}
            </span>
          </div>

          <h3 className="font-display text-2xl font-normal text-cream mb-1">
            {dosha.name}
          </h3>

          <p className="text-xs font-mono text-turmeric/90 mb-4">
            {dosha.elements}
          </p>

          <div className="space-y-3 text-xs text-paper/80 pt-2 border-t border-forest/40">
            <div>
              <span className="text-sage font-medium block">Qualities (Gunas):</span>
              <span>{dosha.qualities}</span>
            </div>

            <div>
              <span className="text-sage font-medium block">Common Imbalances:</span>
              <span className="text-paper/70">{dosha.signsOfImbalance}</span>
            </div>

            <div>
              <span className="text-sage font-medium block">Pacification Key:</span>
              <span className="text-paper/70">{dosha.pacification}</span>
            </div>
          </div>
        </div>

        <div
          style={{ transform: prefersReduced ? undefined : 'translateZ(15px)' }}
          className="pt-6 mt-4 border-t border-forest/30 flex items-center justify-between text-xs text-turmeric font-medium"
        >
          <span>Explore {dosha.name} Diet</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export function DoshaTeaser() {
  const [activeTab, setActiveTab] = useState<'vata' | 'pitta' | 'kapha'>('vata');

  return (
    <section
      data-dark-section="true"
      className="py-20 sm:py-28 bg-deep-forest text-cream relative overflow-hidden border-b border-forest/30"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-turmeric/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="default">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Reveal delay={0} direction="up">
            <Badge variant="cream" className="mb-4">
              Tri-Dosha Assessment
            </Badge>
          </Reveal>

          <RevealText as="h2" delay={0.08} className="text-display-h2 text-cream font-normal tracking-tight justify-center">
            Discover Your Unique Constitutional Blueprint
          </RevealText>

          <Reveal delay={0.16} direction="up" blur={true}>
            <p className="text-body-base text-paper/80 mt-4 leading-relaxed">
              In Ayurvedic medicine, no two human beings are biologically identical. Your health depends entirely on the unique proportion of the three constitutional bio-regulators: Vata, Pitta, and Kapha.
            </p>
          </Reveal>
        </div>

        {/* 3 Animated Dosha Cards with 3D Tilt & Glare */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doshas.map((d, idx) => {
            const isSelected = activeTab === d.id;
            return (
              <Reveal key={d.id} delay={0.24 + idx * 0.08} direction="up">
                <DoshaTiltCard
                  dosha={d}
                  isSelected={isSelected}
                  onClick={() => setActiveTab(d.id)}
                />
              </Reveal>
            );
          })}
        </div>

        {/* CTA to Full Quiz */}
        <Reveal delay={0.48} direction="up">
          <div className="mt-14 pt-8 border-t border-forest/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h4 className="font-display text-xl text-cream font-normal">
                Not sure which Dosha is aggravated?
              </h4>
              <p className="text-xs text-paper/70 mt-1">
                Take our clinical 24-question diagnostic quiz based on Charaka Samhita. Takes ~3 minutes.
              </p>
            </div>

            <Magnetic strength={10}>
              <Button
                href="/dosha-quiz"
                variant="turmeric"
                size="lg"
                showArrow
                className="shrink-0"
              >
                Take the Free Dosha Quiz
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
