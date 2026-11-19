'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionMarginIndexProps {
  number: string;
  label: string;
  gujaratiLabel?: string;
  className?: string;
  side?: 'left' | 'right';
  theme?: 'light' | 'dark';
}

export function SectionMarginIndex({
  number,
  label,
  gujaratiLabel,
  className,
  side = 'left',
  theme = 'light',
}: SectionMarginIndexProps) {
  const isDark = theme === 'dark';

  return (
    <aside
      aria-hidden="true"
      className={cn(
        'hidden lg:flex flex-col items-center gap-3 absolute top-16 select-none pointer-events-none z-10',
        side === 'left' ? 'left-4 xl:left-8' : 'right-4 xl:right-8',
        className
      )}
    >
      {/* Mask container for smooth vertical slide reveal */}
      <div className="overflow-hidden py-1">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2.5"
        >
          {/* Section Number in monospace */}
          <span className="font-mono text-xs font-bold text-turmeric tracking-wider">
            {number}
          </span>

          {/* Thin vertical hairline */}
          <span
            className={cn(
              'w-[1px] h-7 block',
              isDark ? 'bg-cream/30' : 'bg-forest/25'
            )}
          />

          {/* Rotated margin label */}
          <span
            style={{ writingMode: 'vertical-rl' }}
            className={cn(
              'rotate-180 font-mono text-[10px] uppercase tracking-[0.22em] whitespace-nowrap',
              isDark ? 'text-cream/90' : 'text-forest/70'
            )}
          >
            {label}
            {gujaratiLabel && (
              <span
                className={cn(
                  'font-serif normal-case tracking-normal ml-1',
                  isDark ? 'text-cream/65' : 'text-forest/50'
                )}
              >
                · {gujaratiLabel}
              </span>
            )}
          </span>
        </motion.div>
      </div>
    </aside>
  );
}
