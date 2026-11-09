'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MOTION_TOKENS, useInViewOnce, usePrefersReducedMotion } from '@/lib/motion';
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
 * Scroll-triggered blur-reveal component.
 * Transforms from opacity 0, translateY 28px, filter blur(12px) to opacity 1, y 0, blur 0.
 * Triggers once when 15% in view.
 * Removes will-change upon animation completion.
 * Fully bypasses animations when prefers-reduced-motion is active.
 */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  as = 'div',
  className,
  blur = true,
  duration = MOTION_TOKENS.durations.base,
  distance = 28,
  style,
}: RevealProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.15);
  const prefersReduced = usePrefersReducedMotion();
  const [isAnimating, setIsAnimating] = useState(true);

  if (prefersReduced) {
    const Component = as;
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialTransform = getInitialTransform();
  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent
      ref={ref as any}
      initial={{
        opacity: 0,
        ...initialTransform,
        filter: blur ? 'blur(12px)' : 'blur(0px)',
      }}
      animate={
        inView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              filter: 'blur(0px)',
            }
          : undefined
      }
      transition={{
        duration,
        ease: MOTION_TOKENS.ease,
        delay,
      }}
      onAnimationComplete={() => {
        setIsAnimating(false);
      }}
      className={cn(className)}
      style={{
        ...style,
        willChange: isAnimating ? 'transform, opacity, filter' : 'auto',
      }}
    >
      {children}
    </MotionComponent>
  );
}
