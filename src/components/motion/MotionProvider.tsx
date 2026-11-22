'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { MotionDebugBadge } from './MotionDebugBadge';

// Register GSAP plugins (guarded for SSR)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface MotionContextValue {
  prefersReducedMotion: boolean;
  lenis: Lenis | null;
}

const MotionContext = createContext<MotionContextValue>({
  prefersReducedMotion: false,
  lenis: null,
});

/**
 * Hook to access prefers-reduced-motion status.
 * Defaults to false on SSR and initial hydration, updated after client mount.
 */
export function usePrefersReducedMotion(): boolean {
  const context = useContext(MotionContext);
  return context?.prefersReducedMotion ?? false;
}

/**
 * Hook to access the active Lenis instance.
 */
export function useLenis(): Lenis | null {
  const context = useContext(MotionContext);
  return context?.lenis ?? null;
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  // Default to false for SSR & hydration stability, updated after mount in useEffect
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Register plugins
    gsap.registerPlugin(ScrollTrigger, useGSAP);

    // Prevent ScrollTrigger jumps when mobile address bar collapses/expands
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Read prefers-reduced-motion after mount (default false, updated after mount)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // Initialize Lenis:
    // smoothWheel: true provides smooth scrolling for desktop mouse wheel
    // syncTouch: false leaves touch scrolling fully native on touch devices
    // autoRaf: false allows gsap.ticker to drive the Lenis animation loop
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });

    setLenisInstance(lenis);

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Connect Lenis to GSAP ticker and disable lag smoothing
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Expose lenis globally for debugging & quick script access
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Refresh ScrollTrigger after custom fonts finish loading
    if ('fonts' in document && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      setLenisInstance(null);
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  // Refresh ScrollTrigger on route changes after the new DOM is painted
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, lenis: lenisInstance }}>
      {children}
    </MotionContext.Provider>
  );
}
