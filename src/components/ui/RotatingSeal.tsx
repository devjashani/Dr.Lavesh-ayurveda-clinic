'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface RotatingSealProps {
  className?: string;
  size?: number;
}

export function RotatingSeal({ className, size = 120 }: RotatingSealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '50px' });
  const prefersReduced = usePrefersReducedMotion();

  // Scroll offset addition for mobile scroll interaction
  const [scrollAngle, setScrollAngle] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReduced) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Slight scroll rotation tied to page movement (approx 0.08 deg per px scrolled)
          setScrollAngle((window.scrollY * 0.08) % 360);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn('relative inline-flex items-center justify-center select-none pointer-events-none', className)}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-cream/70"
        style={{
          // Apply skew-free rotation combining 60s base animation and scroll momentum
          transform: `rotate(${scrollAngle}deg)`,
          animation: !prefersReduced ? 'spin 60s linear infinite' : 'none',
          animationPlayState: isInView ? 'running' : 'paused',
          willChange: 'transform',
        }}
      >
        <defs>
          {/* Circular path for text tracking */}
          <path
            id="vankal-seal-path"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
          />
        </defs>

        {/* Outer concentric hairline ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.4"
        />

        {/* Outer dashed accent ring in turmeric */}
        <circle
          cx="50"
          cy="50"
          r="45.5"
          fill="none"
          stroke="#D99A2B"
          strokeWidth="0.75"
          strokeDasharray="2 3"
          strokeOpacity="0.6"
        />

        {/* Circular Seal Text: VANKAL AYURVEDA · વાંકલ · CLASSICAL CARE · */}
        <text className="font-mono text-[7px] uppercase tracking-[0.18em] fill-current">
          <textPath
            href="#vankal-seal-path"
            startOffset="0%"
            textLength="219"
            lengthAdjust="spacingAndGlyphs"
          >
            VANKAL AYURVEDA · વાંકલ · CLASSICAL CARE ·
          </textPath>
        </text>

        {/* Inner concentric ring */}
        <circle
          cx="50"
          cy="50"
          r="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.5"
        />

        {/* Center Classical Sacred Lotus / Sprout Icon */}
        <g transform="translate(50, 50) scale(0.65) translate(-50, -50)">
          {/* Central Flame / Kalash Petal */}
          <path
            d="M50 36 C45 42, 44 47, 50 56 C56 47, 55 42, 50 36 Z"
            fill="#D99A2B"
            fillOpacity="0.85"
          />
          {/* Left Petal */}
          <path
            d="M48 48 C41 45, 36 50, 39 56 C44 56, 47 52, 48 48 Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          {/* Right Petal */}
          <path
            d="M52 48 C59 45, 64 50, 61 56 C56 56, 53 52, 52 48 Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          {/* Base Crescent */}
          <path
            d="M40 59 C46 62, 54 62, 60 59"
            stroke="#D99A2B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
