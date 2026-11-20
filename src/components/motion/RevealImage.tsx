'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  MOTION_TOKENS,
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
 * Progressive enhancement clip-path inset reveal with inner image parallax.
 * - SSR: Image is rendered fully visible by default (no opacity-0, no animation inline styles).
 * - Client: Hidden initial states and scroll triggers are applied in useGSAP only after mount.
 * - Parallax tracking powered by GSAP ScrollTrigger scrub.
 * - Automatically bypassed under prefers-reduced-motion.
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
  const innerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const activeDuration =
    duration ?? (isMobile ? MOTION_TOKENS.mobileDurations.slow : MOTION_TOKENS.durations.slow);

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

  useGSAP(
    () => {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner || prefersReduced) return;

      // Reveal animation: clip-path inset expansion + gentle fade/slide
      gsap.fromTo(
        inner,
        {
          clipPath: isMobile ? 'inset(16% 0% 0% 0%)' : 'inset(14% 0% 0% 0%)',
          opacity: 0,
          y: isMobile ? 24 : 0,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.85 : activeDuration,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            once: true,
          },
        }
      );

      // Subtle parallax: Image moves 8% slower than scroll on desktop, disabled on mobile
      if (imageWrapperRef.current && parallax && !isMobile) {
        gsap.fromTo(
          imageWrapperRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    },
    {
      scope: containerRef,
      dependencies: [prefersReduced, isMobile, delay, activeDuration, parallax],
    }
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', shapeClasses, aspectRatio, className)}
    >
      <div ref={innerRef} className="w-full h-full relative overflow-hidden">
        <div
          ref={imageWrapperRef}
          className={cn(
            'w-full relative',
            parallax && !isMobile ? 'h-[116%] -top-[8%]' : 'h-full'
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
      </div>
    </div>
  );
}
