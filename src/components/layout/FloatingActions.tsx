'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, MessageCircle, ArrowUp } from 'lucide-react';
import { Magnetic } from '@/components/motion';
import { MOTION_TOKENS, usePrefersReducedMotion } from '@/lib/motion';

export function FloatingActions() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(Math.max(currentScroll / totalHeight, 0), 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  const showBackToTop = scrollY > 600;

  // SVG ring parameters (radius 18, circumference 2 * pi * 18 ~ 113.097)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <>
      {/* Floating Action Cluster: WhatsApp + Back to Top */}
      <aside
        aria-label="Quick Actions & Consultation Help"
        className="fixed bottom-20 sm:bottom-8 right-5 sm:right-8 z-40 flex flex-col items-end gap-3 pointer-events-none"
      >
        {/* Back to Top Button with Circular Scroll-Progress Ring */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3, ease: MOTION_TOKENS.ease }}
              className="pointer-events-auto"
            >
              <Magnetic strength={6}>
                <button
                  type="button"
                  onClick={scrollToTop}
                  aria-label="Scroll back to top of page"
                  title="Back to top"
                  className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-deep-forest text-cream flex items-center justify-center shadow-[0_4px_16px_rgba(20,41,28,0.25)] border border-forest/40 hover:border-turmeric hover:text-turmeric transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turmeric"
                >
                  {/* Circular SVG Progress Ring */}
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
                    viewBox="0 0 44 44"
                    aria-hidden="true"
                  >
                    {/* Background track */}
                    <circle
                      cx="22"
                      cy="22"
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-forest/30"
                    />
                    {/* Active progress stroke in turmeric */}
                    <circle
                      cx="22"
                      cy="22"
                      r={radius}
                      fill="none"
                      stroke="#D99A2B"
                      strokeWidth="2.2"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-[stroke-dashoffset] duration-100 ease-linear"
                    />
                  </svg>

                  <ArrowUp className="w-4 h-4 text-paper/85 group-hover:text-turmeric group-hover:-translate-y-0.5 transition-transform duration-200" />
                </button>
              </Magnetic>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating WhatsApp Action */}
        <div className="pointer-events-auto flex items-center group">
          <a
            href="https://wa.me/911412458890?text=Namaste%20Aarogyam%20Ayurveda%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Vaidya Desk on WhatsApp"
            className="relative h-12 sm:h-14 rounded-full bg-deep-forest text-cream flex items-center shadow-[0_8px_24px_rgba(20,41,28,0.25)] hover:border-turmeric/60 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] border border-forest/30 pl-3.5 pr-3.5 sm:pl-4 sm:pr-4 group overflow-hidden"
          >
            {/* Gentle pulse ring */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-turmeric/50 animate-pulse-ring-6s pointer-events-none"
            />

            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-turmeric stroke-[1.75] shrink-0 transition-transform duration-300 group-hover:scale-110" />

            {/* Expands on hover to show 'Chat with us' */}
            <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] whitespace-nowrap text-xs sm:text-sm font-medium tracking-wide text-cream select-none">
              Chat with us
            </span>
          </a>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Bar (Visible on mobile screens < 640px) */}
      <nav
        aria-label="Mobile quick actions"
        className="fixed sm:hidden bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-forest/20 px-4 py-2.5 flex items-center gap-3 shadow-[0_-4px_16px_rgba(20,41,28,0.06)]"
      >
        <a
          href="tel:+911412458890"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-[4px] border border-forest/30 text-deep-forest font-medium text-xs bg-cream active:bg-paper transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-forest" />
          <span>Call Clinic</span>
        </a>

        <Link
          href="/book"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-[4px] bg-deep-forest text-cream font-medium text-xs shadow-xs active:bg-forest transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-turmeric" />
          <span>Book Consult</span>
        </Link>
      </nav>
    </>
  );
}
