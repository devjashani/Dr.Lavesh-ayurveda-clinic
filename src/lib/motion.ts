'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Aarogyam Ayurveda — Central Motion System
 * 
 * Shared tokens and design rules for consistent, calm, and performant animations:
 * - Ease: cubic-bezier(0.22, 1, 0.36, 1)
 * - Durations: fast (0.3s), base (0.7s), slow (1.2s)
 * - Stagger: 0.08s
 * - Strict prefers-reduced-motion support
 * - GPU-only properties: transform, opacity, filter
 * - Zero layout shift, runs once on 15% viewport intersection
 */

export const MOTION_TOKENS = {
  ease: [0.22, 1, 0.36, 1] as const,
  easeCss: 'cubic-bezier(0.22, 1, 0.36, 1)',
  durations: {
    fast: 0.3,
    base: 0.7,
    slow: 1.2,
  },
  stagger: 0.08,
} as const;

export const MOTION_TRANSITION = {
  fast: {
    duration: MOTION_TOKENS.durations.fast,
    ease: MOTION_TOKENS.ease,
  },
  base: {
    duration: MOTION_TOKENS.durations.base,
    ease: MOTION_TOKENS.ease,
  },
  slow: {
    duration: MOTION_TOKENS.durations.slow,
    ease: MOTION_TOKENS.ease,
  },
} as const;

/**
 * Hook to detect prefers-reduced-motion media query
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

/**
 * Hook to detect when an element intersects 15% of the viewport once.
 * Unobserves immediately upon entering view to preserve battery and main-thread resources.
 */
export function useInViewOnce<T extends HTMLElement = HTMLElement>(
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px'
) {
  const [inView, setInView] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If user prefers reduced motion, trigger immediately
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

/**
 * Cubic-bezier(0.22, 1, 0.36, 1) ease evaluator for JS canvas/requestAnimationFrame animations
 */
export function cubicEase(t: number): number {
  // Analytical approximation closely matching [0.22, 1, 0.36, 1]
  // Gives rapid initial rise with silky deceleration
  return 1 - Math.pow(1 - t, 3.2);
}

