'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
 * Native Framer Motion scroll-triggered reveal component:
 * - Direct DOM execution via whileInView (zero React state re-render lag)
 * - Desktop: opacity 0, translateY 32px, soft blur -> opacity 1, y 0, blur 0.
 * - Mobile: translateY 28px -> 0, opacity 0 -> 1, 0.7s duration.
 * - Horizontal offsets safely convert to vertical on mobile to prevent horizontal shifts.
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

  const initialTransform = getInitialTransform();
  const MotionComponent = motion[as] || motion.div;

  if (prefersReduced) {
    const Component = as;
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        ...initialTransform,
        ...(useBlur ? { filter: 'blur(8px)' } : {}),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
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
        delay,
      }}
      className={cn(className)}
      style={style}
    >
      {children}
    </MotionComponent>
  );
}
