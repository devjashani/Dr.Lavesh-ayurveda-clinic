'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  MOTION_TOKENS,
  usePrefersReducedMotion,
  useIsMobile,
} from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface RevealTextProps {
  lines?: (string | React.ReactNode)[];
  children?: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}

/**
 * <RevealText>
 * Splits heading into lines with native Framer Motion whileInView reveal:
 * - Direct DOM execution (zero React state latency)
 * - Desktop: masked line slide up (y: 105% -> 0%) with light blur.
 * - Mobile: line slide up (y: 80% -> 0%), opacity 0 -> 1.
 * - Stagger between lines.
 */
export function RevealText({
  lines,
  children,
  as = 'h2',
  className,
  lineClassName,
  delay = 0,
  stagger,
  duration,
}: RevealTextProps) {
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const activeDuration =
    duration ?? (isMobile ? MOTION_TOKENS.mobileDurations.base : MOTION_TOKENS.durations.base);
  const activeStagger =
    stagger ?? (isMobile ? MOTION_TOKENS.mobileStagger : MOTION_TOKENS.stagger);
  const useBlur = !isMobile;

  // Extract lines from props
  let textLines: (string | React.ReactNode)[] = [];
  if (lines && lines.length > 0) {
    textLines = lines;
  } else if (typeof children === 'string') {
    textLines = children.split('\n').filter((l) => l.trim().length > 0);
  } else if (Array.isArray(children)) {
    textLines = children;
  } else if (children) {
    textLines = [children];
  }

  const Component = as;

  if (prefersReduced) {
    return (
      <Component className={className}>
        {textLines.map((line, idx) => (
          <span key={idx} className={cn('block', lineClassName)}>
            {line}
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component className={cn('block', className)}>
      {textLines.map((line, idx) => {
        const lineDelay = delay + idx * activeStagger;

        return (
          <span key={idx} className="block overflow-hidden pb-1 -mb-1">
            <motion.span
              initial={{
                y: isMobile ? '80%' : '105%',
                opacity: 0,
                ...(useBlur ? { filter: 'blur(6px)' } : {}),
              }}
              whileInView={{
                y: '0%',
                opacity: 1,
                ...(useBlur ? { filter: 'blur(0px)' } : {}),
              }}
              viewport={{
                once: true,
                amount: 0.1,
                margin: '0px 0px -25px 0px',
              }}
              transition={{
                duration: activeDuration,
                ease: MOTION_TOKENS.ease,
                delay: lineDelay,
              }}
              className={cn('block origin-bottom-left', lineClassName)}
            >
              {line}
            </motion.span>
          </span>
        );
      })}
    </Component>
  );
}
