'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CountUp } from './CountUp';
import { useInViewOnce, usePrefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface StatBlockProps {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  sanskrit: string;
  sub?: string;
  delay?: number;
  duration?: number;
  showDivider?: boolean;
  className?: string;
  valueClassName?: string;
}

/**
 * <StatBlock>
 * Complete, coordinated clinical stat component:
 * - Counter starts when in view with easeOutExpo, staggered by delay (0.15s intervals).
 * - Thin vertical divider draws from top to bottom as counting begins.
 * - Tabular numbers with fixed min-width to prevent layout shift.
 * - "+" and turmeric "/" pop-scale when counting reaches target.
 * - Labels and Hindi subtitles blur-reveal into focus after counting completes.
 * - Screen readers receive final truthful text via aria-label.
 * - Zero delay / instant final render for prefers-reduced-motion.
 */
export function StatBlock({
  value,
  suffix = '+',
  decimals = 0,
  label,
  sanskrit,
  sub,
  delay = 0,
  duration = 2.2,
  showDivider = false,
  className,
  valueClassName,
}: StatBlockProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.15);
  const prefersReduced = usePrefersReducedMotion();
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setIsFinished(true);
    }
  }, [prefersReduced]);

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col text-center px-4 sm:px-6 py-4 justify-between',
        className
      )}
    >
      {/* Thin vertical divider drawing from top to bottom */}
      {showDivider && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          animate={inView || prefersReduced ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 0.85,
            delay: prefersReduced ? 0 : Math.max(0, delay * 0.4),
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute right-0 top-3 bottom-3 w-px bg-forest/15 origin-top hidden lg:block pointer-events-none"
        />
      )}

      {/* Numerical Counter with Tabular Layout */}
      <div
        className={cn(
          'font-display text-4xl sm:text-5xl font-normal text-deep-forest tracking-tight',
          valueClassName
        )}
      >
        <CountUp
          target={value}
          decimals={decimals}
          suffix={suffix}
          delay={delay}
          duration={duration}
          label={label}
          onComplete={() => setIsFinished(true)}
        />
      </div>

      {/* Labels and Hindi Subtitles Blur-Reveal After Counting Finishes */}
      <motion.div
        initial={
          prefersReduced
            ? { opacity: 1, filter: 'blur(0px)', y: 0 }
            : { opacity: 0, filter: 'blur(8px)', y: 6 }
        }
        animate={
          isFinished || prefersReduced
            ? { opacity: 1, filter: 'blur(0px)', y: 0 }
            : { opacity: 0, filter: 'blur(8px)', y: 6 }
        }
        transition={{
          duration: prefersReduced ? 0 : 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-2.5"
      >
        <span className="text-xs uppercase font-semibold tracking-wider text-forest block">
          {label}
        </span>
        <span className="font-devanagari italic text-xs text-forest/85 font-medium block mt-0.5">
          {sanskrit}
        </span>
        {sub && (
          <p className="text-[11px] text-ink/75 mt-1 leading-snug font-sans max-w-xs mx-auto">
            {sub}
          </p>
        )}
      </motion.div>
    </div>
  );
}

