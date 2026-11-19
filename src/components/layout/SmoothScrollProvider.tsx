'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Prevent ScrollTrigger from recalculating / jumping when mobile address bar collapses/expands
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Initialize Lenis with standalone autoRaf loop and mobile touch momentum
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchInertiaExponent: 1.6,
      touchMultiplier: 1.1,
      autoRaf: true,
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Expose lenis globally for debugging and navigation links
    (window as any).lenis = lenis;

    // Pause animations when browser tab is inactive to preserve battery
    const handleVisibility = () => {
      if (document.hidden) {
        document.body.classList.add('tab-hidden');
      } else {
        document.body.classList.remove('tab-hidden');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      delete (window as any).lenis;
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
