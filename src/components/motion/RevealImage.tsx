'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MOTION_TOKENS, useInViewOnce, usePrefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface RevealImageProps {
  src?: string;
  alt?: string;
  shape?: 'arch' | 'rect' | 'circle' | 'bl-arch' | 'rounded';
  className?: string;
  imageClassName?: string;
  aspectRatio?: string;
  delay?: number;
  duration?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  parallax?: boolean;
  children?: React.ReactNode;
}

/**
 * <RevealImage>
 * Clip-path inset reveal (arch, rectangle, circle) with inner image scaling.
 * Smooth 8% parallax lag relative to scroll inside frame.
 * Triggers once when 15% in view.
 * Fully bypasses animation when prefers-reduced-motion is active.
 */
export function RevealImage({
  src,
  alt = 'Aarogyam Ayurveda',
  shape = 'rect',
  className,
  imageClassName,
  aspectRatio,
  delay = 0,
  duration = MOTION_TOKENS.durations.slow,
  priority = false,
  fill = true,
  sizes = '(max-width: 768px) 100vw, 50vw',
  parallax = true,
  children,
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.15);
  const prefersReduced = usePrefersReducedMotion();
  const [isAnimating, setIsAnimating] = useState(true);

  // Parallax scroll tracking: Image moves 8% slower than scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced || !parallax ? ['0%', '0%'] : ['-8%', '8%']
  );

  const getShapeClasses = () => {
    switch (shape) {
      case 'arch':
        return 'rounded-t-full';
      case 'bl-arch':
        return 'rounded-bl-[120px]';
      case 'circle':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      case 'rect':
      default:
        return 'rounded-[4px]';
    }
  };

  const shapeClasses = getShapeClasses();

  if (prefersReduced) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden',
          shapeClasses,
          aspectRatio,
          className
        )}
      >
        {src && (
          <Image
            src={src}
            alt={alt}
            fill={fill}
            sizes={sizes}
            priority={priority}
            className={cn('object-cover', imageClassName)}
          />
        )}
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', shapeClasses, aspectRatio, className)}
    >
      <motion.div
        ref={ref as any}
        initial={{
          clipPath: 'inset(12% 0% 0% 0%)',
          opacity: 0,
        }}
        animate={
          inView
            ? {
                clipPath: 'inset(0% 0% 0% 0%)',
                opacity: 1,
              }
            : undefined
        }
        transition={{
          duration,
          ease: MOTION_TOKENS.ease,
          delay,
        }}
        onAnimationComplete={() => setIsAnimating(false)}
        className="w-full h-full relative overflow-hidden"
        style={{
          willChange: isAnimating ? 'clip-path, opacity' : 'auto',
        }}
      >
        <motion.div
          initial={{ scale: 1.15 }}
          animate={inView ? { scale: 1.08 } : undefined}
          style={{
            y: parallaxY,
            willChange: 'transform',
          }}
          transition={{
            duration: duration * 1.1,
            ease: MOTION_TOKENS.ease,
            delay,
          }}
          className="w-full h-[116%] -top-[8%] relative"
        >
          {src && (
            <Image
              src={src}
              alt={alt}
              fill={fill}
              sizes={sizes}
              priority={priority}
              className={cn('object-cover', imageClassName)}
            />
          )}
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
