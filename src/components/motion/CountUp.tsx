'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInViewOnce, usePrefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface CountUpProps {
  target: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  formatIndian?: boolean;
  className?: string;
  label?: string;
  onComplete?: () => void;
}

/**
 * Standard easeOutExpo easing function:
 * Starts fast and decelerates into the target with exponential smoothness.
 */
export function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/**
 * <CountUp>
 * Upgraded clinical numerical counter:
 * - Triggers once when 15% in view via IntersectionObserver.
 * - Duration 2.2s with easeOutExpo, staggered by delay.
 * - Supports integers, decimals (e.g. 0.00 to 4.96), thousand separators (18,500), prefix/suffix.
 * - Tabular numbers with fixed min-width to avoid any layout jump while counting.
 * - Pop scale animation on '+' and turmeric '/' when finished.
 * - Screen readers receive final truthful value via aria-label.
 * - Immediately renders final state under prefers-reduced-motion.
 */
export function CountUp({
  target,
  duration = 2.2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  formatIndian = true,
  className,
  label = '',
  onComplete,
}: CountUpProps) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>(0.15);
  const prefersReduced = usePrefersReducedMotion();

  const [current, setCurrent] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const onCompleteCalled = useRef(false);

  // If user prefers reduced motion, update immediately after hydration
  useEffect(() => {
    if (prefersReduced) {
      setCurrent(target);
      setIsFinished(true);
      if (!onCompleteCalled.current) {
        onCompleteCalled.current = true;
        onComplete?.();
      }
    }
  }, [prefersReduced, target, onComplete]);

  // Format final string to pre-calculate min-width and accessible text
  const formatNumber = (num: number): string => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    const rounded = Math.round(num);
    if (formatIndian) {
      return rounded.toLocaleString('en-IN');
    }
    return rounded.toLocaleString();
  };

  const finalFormatted = formatNumber(target);
  const currentFormatted = formatNumber(current);
  const fullAccessibleText = `${prefix}${finalFormatted}${suffix} ${label}`.trim();

  // Width in 'ch' based on length to guarantee zero layout shift
  const minWidthCh = `${finalFormatted.length + 0.2}ch`;

  useEffect(() => {
    if (!inView) return;

    if (prefersReduced) {
      setCurrent(target);
      setIsFinished(true);
      if (!onCompleteCalled.current) {
        onCompleteCalled.current = true;
        onComplete?.();
      }
      return;
    }

    let animationFrameId: number;
    let startTimestamp: number | null = null;
    const durationMs = duration * 1000;
    const delayMs = delay * 1000;

    let delayTimer: NodeJS.Timeout;

    delayTimer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(1, elapsed / durationMs);

        const easedProgress = easeOutExpo(progress);
        const nextValue = easedProgress * target;

        setCurrent(nextValue);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCurrent(target);
          setIsFinished(true);
          if (!onCompleteCalled.current) {
            onCompleteCalled.current = true;
            onComplete?.();
          }
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [inView, target, duration, delay, prefersReduced, onComplete]);

  // Render Suffix with Tiny Fade-Scale Pop
  const renderSuffix = () => {
    if (!suffix) return null;

    // Check for ' / 5' to style turmeric slash
    if (suffix.includes('/')) {
      const parts = suffix.split('/');
      return (
        <motion.span
          animate={
            isFinished
              ? { scale: [1, 1.25, 1], opacity: 1 }
              : { scale: 0.95, opacity: 0.7 }
          }
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {parts[0]}
          <span className="text-[#9E6517]">/</span>
          {parts[1]}
        </motion.span>
      );
    }

    return (
      <motion.span
        animate={
          isFinished
            ? { scale: [1, 1.25, 1], opacity: 1 }
            : { scale: 0.95, opacity: 0.7 }
        }
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="text-[#9E6517] inline-block"
      >
        {suffix}
      </motion.span>
    );
  };

  return (
    <span
      ref={ref}
      aria-label={fullAccessibleText}
      className={cn('inline-flex items-baseline justify-center select-none', className)}
    >
      {/* Screen reader only announcement of final value */}
      <span className="sr-only">{fullAccessibleText}</span>

      {/* Visual animated numbers */}
      <span aria-hidden="true" className="inline-flex items-baseline">
        {prefix && <span>{prefix}</span>}
        <span
          className="tabular-nums inline-block text-right"
          style={{
            fontVariantNumeric: 'tabular-nums',
            minWidth: minWidthCh,
          }}
        >
          {currentFormatted}
        </span>
        {renderSuffix()}
      </span>
    </span>
  );
}
