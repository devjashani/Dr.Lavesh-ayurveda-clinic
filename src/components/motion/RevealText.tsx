'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MOTION_TOKENS, useInViewOnce, usePrefersReducedMotion } from '@/lib/motion';
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
 * Splits heading into lines (not letters).
 * Each line reveals with a mask (overflow: hidden, line slides up) plus a light blur-in.
 * Stagger between lines (default 0.08s).
 * Fully respects prefers-reduced-motion.
 */
export function RevealText({
  lines,
  children,
  as = 'h2',
  className,
  lineClassName,
  delay = 0,
  stagger = MOTION_TOKENS.stagger,
  duration = MOTION_TOKENS.durations.base,
}: RevealTextProps) {
  const { ref, inView } = useInViewOnce<HTMLHeadingElement>(0.15);
  const prefersReduced = usePrefersReducedMotion();
  const [completedLines, setCompletedLines] = useState<number>(0);

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
    <Component ref={ref} className={cn('block', className)}>
      {textLines.map((line, idx) => {
        const lineDelay = delay + idx * stagger;
        const isDone = completedLines > idx;

        return (
          <span key={idx} className="block overflow-hidden pb-1 -mb-1">
            <motion.span
              initial={{
                y: '105%',
                opacity: 0,
                filter: 'blur(8px)',
              }}
              animate={
                inView
                  ? {
                      y: '0%',
                      opacity: 1,
                      filter: 'blur(0px)',
                    }
                  : undefined
              }
              transition={{
                duration,
                ease: MOTION_TOKENS.ease,
                delay: lineDelay,
              }}
              onAnimationComplete={() => {
                setCompletedLines((prev) => Math.max(prev, idx + 1));
              }}
              className={cn('block origin-bottom-left', lineClassName)}
              style={{
                willChange: isDone ? 'auto' : 'transform, opacity, filter',
              }}
            >
              {line}
            </motion.span>
          </span>
        );
      })}
    </Component>
  );
}
