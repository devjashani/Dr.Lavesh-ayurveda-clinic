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

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  as?: 'div' | 'section' | 'article' | 'span' | 'p' | 'li' | 'header' | 'footer';
  className?: string;
  blur?: boolean;
  duration?: number;
  distance?: number;
  style?: React.CSSProperties;
}

/**
 * <Reveal>
 * Progressive enhancement scroll-triggered reveal component.
 * - SSR: Content is rendered fully visible by default (no opacity-0, no animation inline styles).
 * - Client: Hidden initial states and scroll triggers are applied in useGSAP only after mount.
 * - Connected with GSAP ScrollTrigger and Lenis smooth scrolling.
 * - Automatically bypassed under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  as = 'div',
  className,
  blur = true,
  duration,
  distance,
  style,
}: RevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const activeDuration =
    duration ?? (isMobile ? MOTION_TOKENS.mobileDurations.base : MOTION_TOKENS.durations.base);
  const activeDistance =
    distance ?? (isMobile ? MOTION_TOKENS.distances.mobile : MOTION_TOKENS.distances.desktop);
  const useBlur = isMobile ? false : blur;

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return { y: activeDistance, x: 0 };
      case 'down':
        return { y: -activeDistance, x: 0 };
      case 'left':
        return isMobile ? { y: activeDistance, x: 0 } : { x: activeDistance, y: 0 };
      case 'right':
        return isMobile ? { y: activeDistance, x: 0 } : { x: -activeDistance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || prefersReduced) return;

      const { x, y } = getInitialTransform();

      // Progressive enhancement:
      // Starting hidden state is applied ONLY after mount inside useGSAP
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x,
          y,
          filter: useBlur ? 'blur(8px)' : 'none',
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: useBlur ? 'blur(0px)' : 'none',
          duration: activeDuration,
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
      dependencies: [prefersReduced, isMobile, delay, activeDuration, activeDistance],
    }
  );

  const Component = as as React.ElementType;

  return (
    <Component
      ref={containerRef}
      className={cn(className)}
      style={style}
    >
      {children}
    </Component>
  );
}
