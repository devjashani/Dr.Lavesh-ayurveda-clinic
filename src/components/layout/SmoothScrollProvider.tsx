'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    // Wire Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);

    // Section Transitions: Smooth background color interpolation with ScrollTrigger
    // Scoped strictly via gsap.context on containerRef and targeting only explicit sections with [data-dark-section]
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;
      const darkSections = containerRef.current.querySelectorAll<HTMLElement>('section[data-dark-section]');

      darkSections.forEach((section) => {
        gsap.fromTo(
          section,
          {
            backgroundColor: '#1C3725',
          },
          {
            backgroundColor: '#14291C',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 20%',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, containerRef);

    return () => {
      gsap.ticker.remove(tickerCallback);
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
