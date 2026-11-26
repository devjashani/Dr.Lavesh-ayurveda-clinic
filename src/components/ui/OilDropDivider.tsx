'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface OilDropDividerProps {
  className?: string;
  tone?: 'paper' | 'cream' | 'dark';
}

export function OilDropDivider({ className, tone = 'paper' }: OilDropDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const prefersReduced = usePrefersReducedMotion();

  const lineColor = tone === 'dark' ? 'rgba(217, 154, 43, 0.45)' : 'rgba(217, 154, 43, 0.55)';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative w-full flex flex-col items-center justify-center py-1.5 select-none pointer-events-none', className)}
    >
      <svg
        className="w-20 h-12 overflow-visible"
        viewBox="0 0 96 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical Hairline along which the oil drop descends */}
        <motion.line
          x1="48"
          y1="4"
          x2="48"
          y2="50"
          stroke={lineColor}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Falling Oil Drop (Tailored Golden Drop Shape) */}
        {!prefersReduced && (
          <motion.path
            d="M48 4 C 46 7, 44 11, 44 14 C 44 16.2, 45.8 18, 48 18 C 50.2 18, 52 16.2, 52 14 C 52 11, 50 7, 48 4 Z"
            fill="#D99A2B"
            initial={{ y: 0, opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? {
                    y: [0, 4, 34],
                    opacity: [0, 1, 0],
                    scale: [0.8, 1, 0.6],
                  }
                : { y: 0, opacity: 0 }
            }
            transition={{
              duration: 0.85,
              delay: 0.35,
              times: [0, 0.2, 1],
              ease: [0.55, 0.055, 0.675, 0.19] as const, // Accelerating downward drop
            }}
          />
        )}

        {/* Concentric Golden Oil Ripple 1 */}
        <motion.ellipse
          cx="48"
          cy="50"
          rx="18"
          ry="5"
          stroke="#D99A2B"
          strokeWidth="1.2"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: [0, 1, 2.2],
                  opacity: [0, 0.8, 0],
                }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            duration: 0.95,
            delay: prefersReduced ? 0.1 : 0.95,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        />

        {/* Concentric Golden Oil Ripple 2 */}
        <motion.ellipse
          cx="48"
          cy="50"
          rx="12"
          ry="3.5"
          stroke="#D99A2B"
          strokeWidth="0.8"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: [0, 1, 1.8],
                  opacity: [0, 0.5, 0],
                }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            duration: 0.85,
            delay: prefersReduced ? 0.2 : 1.1,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        />

        {/* Calming center impact point */}
        <motion.circle
          cx="48"
          cy="50"
          r="1.5"
          fill="#D99A2B"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: [0, 1.5, 1], opacity: [0, 0.9, 0.6] } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        />
      </svg>
    </div>
  );
}
