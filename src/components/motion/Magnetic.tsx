'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  maxDistance?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * <Magnetic>
 * Subtle magnetic attraction effect for interactive buttons.
 * Follows the user's cursor within a strict 8px radius.
 * Hydration-safe: JSX markup is static (no style prop),
 * animations are attached via useEffect and gsap.quickTo.
 * Automatically disabled on touch screens and under prefers-reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.22,
  maxDistance = 8,
  className,
  disabled = false,
}: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined' || disabled) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (prefersReduced || isTouch) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      const clampedX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
      const clampedY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));

      xTo(clampedX);
      yTo(clampedY);
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      xTo(0);
      yTo(0);
    };
  }, [disabled, strength, maxDistance]);

  return (
    <div ref={containerRef} className={cn('inline-block', className)}>
      {children}
    </div>
  );
}
