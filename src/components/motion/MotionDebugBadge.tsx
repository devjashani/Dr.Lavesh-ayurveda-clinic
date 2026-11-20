'use client';

import React, { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

interface MotionDebugBadgeProps {
  lenis: Lenis | null;
  prefersReducedMotion: boolean;
}

export function MotionDebugBadge({ lenis, prefersReducedMotion }: MotionDebugBadgeProps) {
  const [scrollY, setScrollY] = useState(0);
  const [triggerCount, setTriggerCount] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const currentY = lenis ? lenis.scroll : window.scrollY;
      setScrollY(Math.round(currentY));
      setTriggerCount(ScrollTrigger.getAll().length);
    };

    updateStats();

    if (lenis) {
      lenis.on('scroll', updateStats);
    } else {
      window.addEventListener('scroll', updateStats, { passive: true });
    }

    const interval = setInterval(updateStats, 1000);

    return () => {
      if (lenis) {
        lenis.off('scroll', updateStats);
      } else {
        window.removeEventListener('scroll', updateStats);
      }
      clearInterval(interval);
    };
  }, [lenis]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const isLenisRunning = Boolean(lenis && !lenis.isStopped);

  return (
    <aside
      aria-label="Motion Dev Information"
      className="fixed bottom-4 left-4 z-50 pointer-events-auto select-none rounded-md bg-zinc-950/90 border border-zinc-800 text-zinc-200 px-3 py-2 shadow-2xl backdrop-blur-md font-mono text-[11px] leading-tight"
    >
      <div className="flex items-center gap-1.5 font-sans font-semibold text-zinc-100 border-b border-zinc-800 pb-1 mb-1 text-[11px]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Motion Dev</span>
      </div>
      <div className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1">
        <span className="text-zinc-400">reducedMotion:</span>
        <span className={prefersReducedMotion ? 'text-amber-400 font-bold' : 'text-emerald-400 font-semibold'}>
          {prefersReducedMotion ? 'true' : 'false'}
        </span>

        <span className="text-zinc-400">Lenis running:</span>
        <span className={isLenisRunning ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
          {isLenisRunning ? 'yes' : 'no'}
        </span>

        <span className="text-zinc-400">ScrollTrigger count:</span>
        <span className="text-zinc-100 font-semibold">{triggerCount}</span>

        <span className="text-zinc-400">scrollY:</span>
        <span className="text-zinc-100 font-semibold">{scrollY}px</span>
      </div>
    </aside>
  );
}
