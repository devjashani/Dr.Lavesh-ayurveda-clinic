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
    // Only run on client, check sessionStorage and reduced motion preference
    if (typeof window === 'undefined') return;

    try {
      const alreadyShown = sessionStorage.getItem('aarogyam_intro_shown');
      if (alreadyShown || prefersReduced) {
        return;
      }
      setShouldRender(true);

      // Start lifting curtain at 1.15s
      const liftTimer = setTimeout(() => {
        setIsLifting(true);
      }, 1150);

      // Finish and remove from DOM at 1.8s max
      const removeTimer = setTimeout(() => {
        sessionStorage.setItem('aarogyam_intro_shown', '1');
        setShouldRender(false);
        window.dispatchEvent(new CustomEvent('aarogyam-intro-done'));
      }, 1800);

      return () => {
        clearTimeout(liftTimer);
        clearTimeout(removeTimer);
      };
    } catch {
      // Fallback for private browsing / blocked storage
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
                opacity: 0.95,
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
        {/* Ambient subtle warm glow */}
        <div className="absolute w-72 h-72 rounded-full bg-turmeric/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* 1. Self-Drawing Leaf Logo Mark */}
          <div className="w-16 h-16 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center shadow-xs mb-4">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-forest"
            >
              {/* Outer Mudra/Leaf Contour */}
              <motion.path
                d="M12 2C12 2 6 6 5 12C4 18 9 22 12 22C15 22 20 18 19 12C18 6 12 2 12 2Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: MOTION_TOKENS.ease }}
              />
              {/* Central Stem */}
              <motion.path
                d="M12 5V19"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15, ease: MOTION_TOKENS.ease }}
              />
              {/* Veins */}
              <motion.path
                d="M12 9C9.5 10 7.5 11.5 7.5 11.5"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.25, ease: MOTION_TOKENS.ease }}
              />
              <motion.path
                d="M12 9C14.5 10 16.5 11.5 16.5 11.5"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.25, ease: MOTION_TOKENS.ease }}
              />
              <motion.path
                d="M12 13C8 14 6.5 15.5 6.5 15.5"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.32, ease: MOTION_TOKENS.ease }}
              />
              <motion.path
                d="M12 13C16 14 17.5 15.5 17.5 15.5"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.32, ease: MOTION_TOKENS.ease }}
              />
            </svg>
          </div>

          {/* 2. "Aarogyam" and "आरोग्यम्" Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.45, delay: 0.4, ease: MOTION_TOKENS.ease }}
            className="text-center"
          >
            <h1 className="font-display text-3xl sm:text-4xl text-deep-forest tracking-tight font-normal">
              Aarogyam
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.35, delay: 0.55, ease: MOTION_TOKENS.ease }}
              className="font-devanagari italic text-xs sm:text-sm text-forest/80 tracking-widest mt-0.5"
            >
              आरोग्यम् · आयुर्वेद चिकित्सालय
            </motion.p>
          </motion.div>

          {/* 3. Thin Turmeric Line Growing Underneath */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.72, ease: MOTION_TOKENS.ease }}
            className="h-[1.5px] bg-turmeric w-28 origin-center rounded-full mt-3.5 shadow-2xs"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

