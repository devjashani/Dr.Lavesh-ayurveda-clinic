'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MOTION_TOKENS,
  useInViewOnce,
  usePrefersReducedMotion,
  useIsMobile,
} from '@/lib/motion';
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
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
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
  alt = 'Vankal Ayurveda',
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
  placeholder,
  blurDataURL,
  children,
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const activeDuration =
    duration ?? (isMobile ? MOTION_TOKENS.mobileDurations.slow : MOTION_TOKENS.durations.slow);

  // Parallax scroll tracking: Image moves 8% slower than scroll on desktop, disabled on mobile for frame rate
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced || isMobile || !parallax ? ['0%', '0%'] : ['-8%', '8%']
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
            placeholder={placeholder}
            blurDataURL={blurDataURL}
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
        initial={{
          clipPath: isMobile ? 'inset(16% 0% 0% 0%)' : 'inset(14% 0% 0% 0%)',
          opacity: 0,
          y: isMobile ? 24 : 0,
        }}
        whileInView={{
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.1,
          margin: '0px 0px -30px 0px',
        }}
        transition={{
          duration: isMobile ? 0.85 : activeDuration,
          ease: MOTION_TOKENS.ease,
          delay,
        }}
        className="w-full h-full relative overflow-hidden"
      >
        <motion.div
          initial={{ scale: isMobile ? 1.08 : 1.15 }}
          whileInView={{ scale: 1.0 }}
          viewport={{ once: true, amount: 0.1 }}
          style={{
            y: parallaxY,
          }}
          transition={{
            duration: (isMobile ? 0.85 : activeDuration) * 1.05,
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
              placeholder={placeholder}
              blurDataURL={blurDataURL}
              className={cn('object-cover', imageClassName)}
            />
          )}
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
