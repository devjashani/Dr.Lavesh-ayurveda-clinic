'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOTION_TOKENS, usePrefersReducedMotion } from '@/lib/motion';

export function IntroPreloader() {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isLifting, setIsLifting] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    try {
      const alreadyShown = sessionStorage.getItem('vankal_intro_shown');
      if (alreadyShown || prefersReduced) {
        return;
      }
      setShouldRender(true);

      // Start lifting curved curtain at 1.4s
      const liftTimer = setTimeout(() => {
        setIsLifting(true);
      }, 1400);

      // Complete and unmount from DOM at 2.05s (under 2.2s threshold)
      const removeTimer = setTimeout(() => {
        sessionStorage.setItem('vankal_intro_shown', '1');
        setShouldRender(false);
        window.dispatchEvent(new CustomEvent('vankal-intro-done'));
      }, 2050);

      return () => {
        clearTimeout(liftTimer);
        clearTimeout(removeTimer);
      };
    } catch {
      // Fallback for private browsing
    }
  }, [prefersReduced]);

  if (!isMounted || !shouldRender || prefersReduced) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="intro-overlay"
        initial={{ clipPath: 'inset(0% 0% 0% 0% round 0 0 0 0)' }}
        animate={
          isLifting
            ? {
                clipPath: 'inset(0% 0% 100% 0% round 0 0 60% 60%)',
                opacity: 0.96,
              }
            : {
                clipPath: 'inset(0% 0% 0% 0% round 0 0 0 0)',
                opacity: 1,
              }
        }
        transition={{
          duration: 0.65,
          ease: MOTION_TOKENS.ease,
        }}
        className="fixed inset-0 z-[100] bg-paper flex flex-col items-center justify-center select-none pointer-events-none"
        aria-hidden="true"
      >
        {/* Subtle ambient warm glow */}
        <div className="absolute w-72 h-72 rounded-full bg-turmeric/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Pranayama Breathing Center: expanding and contracting thin accent ring with self-drawing logo mark */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-5">
            {/* 1. Thin Pranayama Breathing Ring in Turmeric Accent */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0.3 }}
              animate={{
                scale: [0.85, 1.25, 1.0],
                opacity: [0.3, 0.85, 0.5],
              }}
              transition={{
                duration: 1.3,
                times: [0, 0.52, 1],
                ease: [0.45, 0.05, 0.55, 0.95],
              }}
              className="absolute inset-0 rounded-full border border-turmeric shadow-[0_0_14px_rgba(217,154,43,0.35)] pointer-events-none"
            />

            {/* Inner background disc */}
            <div className="w-14 h-14 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center shadow-xs">
              {/* 2. Self-Drawing Logo Mark with stroke-dashoffset */}
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-deep-forest"
              >
                {/* Outer Mudra/Leaf Contour */}
                <motion.path
                  d="M12 2C12 2 6 6 5 12C4 18 9 22 12 22C15 22 20 18 19 12C18 6 12 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.65, ease: MOTION_TOKENS.ease }}
                />
                {/* Central Stem */}
                <motion.path
                  d="M12 5V19"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.2, ease: MOTION_TOKENS.ease }}
                />
                {/* Leaf Veins */}
                <motion.path
                  d="M12 9C9.5 10 7.5 11.5 7.5 11.5"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.32, ease: MOTION_TOKENS.ease }}
                />
                <motion.path
                  d="M12 9C14.5 10 16.5 11.5 16.5 11.5"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.32, ease: MOTION_TOKENS.ease }}
                />
                <motion.path
                  d="M12 13C8 14 6.5 15.5 6.5 15.5"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.42, ease: MOTION_TOKENS.ease }}
                />
                <motion.path
                  d="M12 13C16 14 17.5 15.5 17.5 15.5"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.42, ease: MOTION_TOKENS.ease }}
                />
              </svg>
            </div>
          </div>

          {/* 3. VANKAL AYURVEDA Wordmark fades up */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: MOTION_TOKENS.ease }}
            className="text-center"
          >
            <h1 className="font-display text-2xl sm:text-4xl text-deep-forest tracking-tight font-normal">
              VANKAL AYURVEDA
            </h1>
            {/* 4. Gujarati Name વાંકલ appears beneath */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ duration: 0.35, delay: 0.72, ease: MOTION_TOKENS.ease }}
              className="font-serif italic text-xs sm:text-sm text-forest/85 tracking-widest mt-1"
            >
              વાંકલ
            </motion.p>
          </motion.div>

          {/* Thin accent underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.85, ease: MOTION_TOKENS.ease }}
            className="h-[1.5px] bg-turmeric w-24 origin-center rounded-full mt-3.5 shadow-2xs"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
