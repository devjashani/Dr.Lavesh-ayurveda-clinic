'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface BreathingHaloOrnamentProps {
  className?: string;
}

export function BreathingHaloOrnament({ className }: BreathingHaloOrnamentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-30px' });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('absolute inset-0 -m-6 sm:-m-10 flex items-center justify-center pointer-events-none select-none z-0', className)}
    >
      <motion.svg
        className="w-[115%] h-[115%] text-turmeric/25 max-w-[500px] max-h-[560px]"
        viewBox="0 0 340 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          !prefersReduced && isInView
            ? {
                scale: [1, 1.04, 1],
                opacity: [0.35, 0.55, 0.35],
              }
            : { scale: 1, opacity: 0.35 }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Outer Halo Arch following the Doctor Portrait contour */}
        <path
          d="M20 380 V 160 C 20 70, 85 20, 170 20 C 255 20, 320 70, 320 160 V 380"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="4 6"
        />

        {/* Concentric Inner Arch with delicate solid hairline */}
        <path
          d="M36 380 V 164 C 36 84, 95 36, 170 36 C 245 36, 304 84, 304 164 V 380"
          stroke="#8FA68A"
          strokeWidth="0.8"
          strokeOpacity="0.45"
        />

        {/* Sunburst radial rays at the crest of the arch */}
        <line x1="170" y1="6" x2="170" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="140" y1="10" x2="143" y2="19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="200" y1="10" x2="197" y2="19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="112" y1="21" x2="117" y2="29" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="228" y1="21" x2="223" y2="29" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="88" y1="39" x2="95" y2="46" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="252" y1="39" x2="245" y2="46" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

        {/* Tiny golden nodule points along the arch perimeter */}
        <circle cx="170" cy="20" r="2.5" fill="#D99A2B" />
        <circle cx="106" cy="46" r="2" fill="#D99A2B" />
        <circle cx="234" cy="46" r="2" fill="#D99A2B" />
        <circle cx="56" cy="98" r="2" fill="#D99A2B" />
        <circle cx="284" cy="98" r="2" fill="#D99A2B" />
      </motion.svg>
    </div>
  );
}
