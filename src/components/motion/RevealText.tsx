'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
 * Progressive enhancement text reveal: splits heading into lines with masked slide-up.
 * - SSR: Content is rendered fully visible by default (no opacity-0, no animation inline styles).
 * - Client: Hidden initial states and scroll triggers are applied in useGSAP only after mount.
 * - Automatically bypassed under prefers-reduced-motion.
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
  const containerRef = useRef<HTMLElement | null>(null);
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

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || prefersReduced) return;

      const lineElements = el.querySelectorAll('.reveal-text-line');
      if (!lineElements.length) return;

      gsap.fromTo(
        lineElements,
        {
          opacity: 0,
          y: isMobile ? '80%' : '105%',
          filter: useBlur ? 'blur(6px)' : 'none',
        },
        {
          opacity: 1,
          y: '0%',
          filter: useBlur ? 'blur(0px)' : 'none',
          duration: activeDuration,
          stagger: activeStagger,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        }
      );
    },
    {
      scope: containerRef,
      dependencies: [prefersReduced, isMobile, delay, activeDuration, activeStagger, textLines.length],
    }
  );

  const Component = as as React.ElementType;

  return (
    <Component ref={containerRef} className={cn('block', className)}>
      {textLines.map((line, idx) => (
        <span key={idx} className="block overflow-hidden pb-1 -mb-1">
          <span
            className={cn(
              'reveal-text-line block origin-bottom-left',
              lineClassName
            )}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
}
