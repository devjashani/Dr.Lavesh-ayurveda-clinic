'use client';

import React, { useRef, useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface FloatChipProps {
  children?: React.ReactNode;
  label?: string;
  glyph?: React.ReactNode;
  dotColor?: 'turmeric' | 'sage' | 'clay' | 'forest';
  phase?: number;
  speed?: 'slow' | 'base' | 'gentle';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * <FloatChip>
 * Small rounded-full white-ish chip (soft border, light shadow) with a tiny colored dot or glyph and a label.
 * - Organic slow floating drift using CSS keyframes (transform only, 6-9s).
 * - Offset phase per chip (different phase prop creates natural unsynchronized motion).
 * - Paused automatically when off-screen (via IntersectionObserver) and under prefers-reduced-motion.
 */
export function FloatChip({
  children,
  label,
  glyph,
  dotColor = 'turmeric',
  phase = 0,
  speed = 'base',
  className,
  style,
}: FloatChipProps) {
  const chipRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = chipRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dotColorClasses = {
    turmeric: 'bg-turmeric',
    sage: 'bg-sage',
    forest: 'bg-forest',
    clay: 'bg-clay',
  };

  const speedBaseDurations = {
    slow: 8.6,
    base: 7.2,
    gentle: 6.4,
  };

  // 6-9s range with different phase per chip
  const baseDuration = speedBaseDurations[speed];
  const durationSec = (baseDuration + ((phase % 4) * 0.6)).toFixed(2);
  const delaySec = (-(phase * 1.8)).toFixed(2);

  const animationPlayState = isInView && !prefersReduced ? 'running' : 'paused';
  const displayText = label ?? children;

  return (
    <div
      ref={chipRef}
      className={cn(
        'rounded-full bg-cream/95 backdrop-blur-xs border border-forest/12',
        'shadow-[0_4px_16px_rgba(20,41,28,0.06)] px-3.5 py-1.5',
        'inline-flex items-center gap-2 select-none pointer-events-auto',
        className
      )}
      style={{
        animationName: prefersReduced ? 'none' : 'floatChipDrift',
        animationDuration: `${durationSec}s`,
        animationDelay: `${delaySec}s`,
        animationTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
        animationIterationCount: 'infinite',
        animationPlayState,
        willChange: isInView && !prefersReduced ? 'transform' : 'auto',
        ...style,
      }}
    >
      {glyph ? (
        <span className="shrink-0 text-forest flex items-center justify-center">{glyph}</span>
      ) : (
        <span
          aria-hidden="true"
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColorClasses[dotColor])}
        />
      )}
      <span className="text-xs font-sans font-medium text-deep-forest tracking-tight">
        {displayText}
      </span>
    </div>
  );
}
