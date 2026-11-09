'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/motion';

const items = [
  'Authentic Panchakarma',
  'Nadi Pariksha (Pulse Diagnosis)',
  'Pure Herbal Formulations',
  'Personalized Diet Plans',
  'Charaka Samhita Protocols',
  'AYUSH Registered Clinic',
  'Zero Chemical Suppressants',
];

export function TrustMarquee() {
  const prefersReduced = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // We duplicate items to create a continuous seamless loop
  const displayItems = [...items, ...items, ...items, ...items];

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Current speed multiplier smoothly interpolated with Lerp (decelerates to 0.25x on hover)
  const speedRef = useRef(0.9);

  useAnimationFrame((_, delta) => {
    if (prefersReduced) return;

    // Smoothly lerp towards target speed: 0.22 on hover, 0.9 normal
    const targetSpeed = isHovered ? 0.22 : 0.9;
    speedRef.current += (targetSpeed - speedRef.current) * 0.05;

    // Normalizing for 60fps (delta / 16.67)
    const factor = Math.min(delta / 16.67, 2.0);
    const moveBy = speedRef.current * factor;

    let currentX = x.get() - moveBy;

    if (contentRef.current) {
      // Loop point is half of the content width
      const halfWidth = contentRef.current.scrollWidth / 2;
      if (Math.abs(currentX) >= halfWidth) {
        currentX += halfWidth;
      }
    }

    x.set(currentX);
  });

  return (
    <section
      aria-label="Clinical Highlights & Trust Pillars"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-4 bg-cream border-y border-forest/15 overflow-hidden select-none cursor-default relative"
    >
      <div ref={containerRef} className="w-full overflow-hidden flex">
        <motion.div
          ref={contentRef}
          style={{ x }}
          className="flex w-max items-center will-change-transform"
        >
          {displayItems.map((text, idx) => (
            <div key={idx} className="flex items-center mx-5 sm:mx-8">
              <span className="font-display text-sm sm:text-base font-normal tracking-wide text-deep-forest whitespace-nowrap">
                {text}
              </span>
              {/* Small leaf glyph separator */}
              <svg
                className="w-3.5 h-3.5 ml-8 text-turmeric fill-turmeric/30 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2C12 2 5 7 5 13C5 17.5 8.5 21 12 21C15.5 21 19 17.5 19 13C19 7 12 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 6V18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
