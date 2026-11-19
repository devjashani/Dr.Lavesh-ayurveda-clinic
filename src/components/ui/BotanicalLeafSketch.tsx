'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface BotanicalLeafSketchProps {
  className?: string;
  variant?: 'tulsi' | 'neem';
  position?: 'top-right' | 'bottom-left';
}

export function BotanicalLeafSketch({
  className,
  variant = 'tulsi',
  position = 'top-right',
}: BotanicalLeafSketchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const prefersReduced = usePrefersReducedMotion();

  const posClass =
    position === 'top-right'
      ? 'absolute -top-10 -right-12 sm:-right-8 pointer-events-none select-none z-0'
      : 'absolute -bottom-10 -left-12 sm:-left-8 pointer-events-none select-none z-0';

  const t = {
    duration: prefersReduced ? 0.01 : 1.5,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div ref={ref} aria-hidden="true" className={cn(posClass, className)}>
      <svg
        className="w-44 sm:w-56 h-auto text-sage/35 overflow-visible"
        viewBox="0 0 200 240"
        fill="none"
      >
        <motion.path
          d={variant === 'tulsi' ? 'M170 230 C130 180, 100 120, 60 20' : 'M180 230 C140 170, 90 90, 30 20'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={t}
        />
        <motion.path
          d="M60 20 C35 15, 20 30, 25 50 C30 65, 60 50, 75 42 M65 30 C45 32, 35 38, 25 50"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ ...t, delay: 0.2 }}
        />
        <motion.path
          d="M85 65 C115 50, 145 65, 140 85 C135 105, 105 100, 95 90 M90 77 C112 78, 128 82, 140 85"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ ...t, delay: 0.3 }}
        />
        <motion.path
          d="M98 115 C65 105, 40 125, 45 150 C50 170, 85 160, 110 145 M102 130 C78 132, 60 140, 45 150"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ ...t, delay: 0.4 }}
        />
        <motion.path
          d="M125 165 C160 155, 185 175, 180 200 C175 220, 145 210, 135 195"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ ...t, delay: 0.5 }}
        />
        <motion.circle
          cx="58"
          cy="16"
          r="2.5"
          stroke="#D99A2B"
          strokeWidth="1"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        />
      </svg>
    </div>
  );
}
