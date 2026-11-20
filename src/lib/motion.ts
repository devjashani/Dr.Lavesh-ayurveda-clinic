'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Vankal Ayurveda — Central Motion System
 * 
 * Shared tokens and design rules for consistent, calm, and performant animations:
 * - Ease: cubic-bezier(0.22, 1, 0.36, 1)
 * - Desktop Durations: fast (0.3s), base (0.7s), slow (1.2s)
 * - Mobile Durations: 20-30% shorter (fast 0.22s, base 0.5s, slow 0.85s)
 * - Desktop Distances: 28px - 32px
 * - Mobile Distances: 16px - 20px
 * - Strict prefers-reduced-motion support
 * - GPU-only properties: transform and opacity (plus clip-path on reveal images)
 * - Zero layout shift, runs once on 15% viewport intersection
 * - No heavy filter blur on mobile text reveals
 */

export const MOTION_TOKENS = {
  ease: [0.22, 1, 0.36, 1] as const,
  easeCss: 'cubic-bezier(0.22, 1, 0.36, 1)',
  durations: {
    fast: 0.35,
    base: 0.75,
    slow: 1.2,
  },
  mobileDurations: {
    fast: 0.3,
    base: 0.7,
    slow: 0.95,
  },
  distances: {
    desktop: 32,
    mobile: 28,
  },
  stagger: 0.08,
  mobileStagger: 0.06,
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

export { usePrefersReducedMotion, useLenis } from '@/components/motion/MotionProvider';


/**
 * Hook to detect mobile screens (< 768px)
 * Hydration-safe: default to false, set on client mount
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to detect when an element intersects 15% of the viewport once.
 * Unobserves immediately upon entering view to preserve battery and main-thread resources.
 */
export function useInViewOnce<T extends HTMLElement = HTMLElement>(
  threshold?: number,
  rootMargin?: string
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

    const isMobileDevice = window.innerWidth < 768;
    const effectiveThreshold = threshold ?? (isMobileDevice ? 0.08 : 0.15);
    const effectiveRootMargin = rootMargin ?? (isMobileDevice ? '0px 0px -25px 0px' : '0px 0px -50px 0px');

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
        threshold: effectiveThreshold,
        rootMargin: effectiveRootMargin,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

/**
 * Hook for looping animations: tracks whether element is currently visible in viewport
 * and whether the browser tab is active. Pauses animations when hidden.
 */
export function useInViewWithPause<T extends HTMLElement = HTMLElement>(
  threshold = 0.05
) {
  const [isActive, setIsActive] = useState(true);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isElementInView = true;
    let isDocVisible = !document.hidden;

    const updateState = () => {
      setIsActive(isElementInView && isDocVisible);
    };

    const handleVisibility = () => {
      isDocVisible = !document.hidden;
      updateState();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      return () => {
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isElementInView = entry.isIntersecting;
        updateState();
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isActive };
}

/**
 * GSAP matchMedia helper that sets up distinct desktop and mobile animations with automatic cleanup.
 */
export function setupGsapMedia(
  setup: (context: { isMobile: boolean; isDesktop: boolean }) => (() => void) | void
) {
  if (typeof window === 'undefined') return () => {};

  const mm = gsap.matchMedia();
  mm.add(
    {
      isDesktop: '(min-width: 769px)',
      isMobile: '(max-width: 768px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isMobile = false, isDesktop = false, reduceMotion = false } = context.conditions || {};
      if (reduceMotion) return;
      return setup({ isMobile: !!isMobile, isDesktop: !!isDesktop });
    }
  );

  return () => mm.revert();
}

/**
 * Cubic-bezier(0.22, 1, 0.36, 1) ease evaluator for JS canvas/requestAnimationFrame animations
 */
export function cubicEase(t: number): number {
  return 1 - Math.pow(1 - t, 3.2);
}
