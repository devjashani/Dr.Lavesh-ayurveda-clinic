'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Logo } from './Logo';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useBookingSheet } from '@/lib/context/BookingSheetContext';

export const navLinks = [
  { href: '/', label: 'Home', sanskrit: 'મુખ્ય' },
  { href: '/about', label: 'About', sanskrit: 'વિશે' },
  { href: '/treatments', label: 'Treatments', sanskrit: 'સારવાર' },
  { href: '/conditions', label: 'Conditions', sanskrit: 'રોગ' },
  { href: '/doctors', label: 'Doctor', sanskrit: 'વૈદ્ય' },
  { href: '/dosha-quiz', label: 'Dosha Quiz', sanskrit: 'ક્વિઝ' },
  { href: '/contact', label: 'Contact', sanskrit: 'સંપર્ક' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { openBookingSheet } = useBookingSheet();

  const lastScrollY = useRef(0);

  // Framer Motion variants for circular expanding clip-path and staggered links
  const menuVariants: Variants = {
    closed: {
      clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 35,
      },
    },
    open: {
      clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)',
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 240,
        damping: 28,
      },
    },
  };

  const navListVariants: Variants = {
    closed: {
      transition: { staggerChildren: 0.025, staggerDirection: -1 },
    },
    open: {
      transition: { staggerChildren: 0.045, delayChildren: 0.1 },
    },
  };

  const navItemVariants: Variants = {
    closed: { opacity: 0, y: 18 },
    open: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Pill becomes slightly more opaque after 40px scroll
      setIsScrolled(currentScrollY > 40);

      // Hide on scroll down, show on scroll up (transform only)
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 6) {
          // Scrolling down
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 6) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        // Near top
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          'pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 px-5 min-[390px]:px-6 sm:px-8 lg:px-12 pl-safe pr-safe',
          isScrolled || isMobileMenuOpen
            ? 'max-xl:bg-paper/95 max-xl:backdrop-blur-md max-xl:border-b max-xl:border-forest/10 max-xl:shadow-2xs'
            : 'max-xl:bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* ============================================================ */}
          {/* 1. Left: Logo (Leaf Mark + Brand Wordmark + Compact Gujarati) */}
          {/* ============================================================ */}
          <div className="flex-1 flex items-center justify-start min-w-0 pl-1 sm:pl-0">
            <Logo compactNavbar />
          </div>

          {/* ============================================================ */}
          {/* 2. Center: Floating Frosted Pill with all 7 Navigation Links  */}
          {/* ============================================================ */}
          <nav
            aria-label="Main Navigation"
            className={cn(
              'hidden xl:inline-flex items-center gap-1 p-1.5 rounded-full border transition-all duration-300 select-none shrink-0',
              'backdrop-blur-[12px] shadow-[0_2px_12px_rgba(20,41,28,0.06)]',
              isScrolled
                ? 'bg-paper/85 border-forest/20 shadow-[0_4px_16px_rgba(20,41,28,0.08)]'
                : 'bg-paper/60 border-forest/15'
            )}
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/');

              const label = language === 'GU' ? link.sanskrit : link.label;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 text-sm whitespace-nowrap rounded-full transition-colors duration-200 select-none z-10 flex items-center justify-center min-h-[36px]',
                    language === 'GU' ? 'font-serif' : 'font-sans',
                    isActive
                      ? 'text-deep-forest font-semibold'
                      : 'text-ink/75 hover:text-deep-forest hover:bg-forest/5 font-normal'
                  )}
                >
                  <span>{label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavChip"
                      className="absolute inset-0 rounded-full bg-forest/10 border border-forest/10 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ============================================================ */}
          {/* 3. Right: Language Toggle & Dark Pill "Book Consultation"    */}
          {/* ============================================================ */}
          <div className="hidden xl:flex flex-1 items-center justify-end gap-3 min-w-0">
            {/* Language Toggle (EN | ગુજ) */}
            <div className="flex items-center bg-cream/70 backdrop-blur-xs rounded-full p-1 border border-forest/15 text-xs font-medium shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                aria-label="Switch to English"
                className={cn(
                  'px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap text-xs',
                  language === 'EN'
                    ? 'bg-deep-forest text-cream font-semibold shadow-xs'
                    : 'text-ink/70 hover:text-deep-forest'
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('GU')}
                aria-label="Switch to Gujarati"
                className={cn(
                  'px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap text-xs',
                  language === 'GU'
                    ? 'bg-deep-forest text-cream font-semibold shadow-xs'
                    : 'text-ink/70 hover:text-deep-forest'
                )}
              >
                ગુજ
              </button>
            </div>

            {/* Dark Pill "Book Consultation" with Small Circular Arrow Chip */}
            <Link
              href="/book"
              className="h-10 px-4 rounded-full bg-deep-forest text-cream hover:bg-forest transition-colors duration-200 text-xs sm:text-sm font-medium inline-flex items-center gap-2 shadow-xs whitespace-nowrap group shrink-0 select-none"
            >
              <span>{t.nav.bookConsultation}</span>
              <span className="w-5 h-5 rounded-full bg-cream/15 group-hover:bg-cream/25 transition-colors flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-3 h-3 text-turmeric transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* 4. Mobile / Tablet Header Controls (< 1280px / < xl)         */}
          {/* ============================================================ */}
          <div className="flex xl:hidden items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Toggle: Preserved in the menu bar, hidden from the main first page */}
            {isMobileMenuOpen && (
              <div className="flex items-center bg-cream/90 rounded-full p-0.5 border border-forest/15 text-[11px] font-medium shrink-0 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => setLanguage('EN')}
                  aria-label="Switch to English"
                  className={cn(
                    'px-2 py-0.5 rounded-full transition-colors whitespace-nowrap',
                    language === 'EN'
                      ? 'bg-deep-forest text-cream font-semibold'
                      : 'text-ink/70'
                  )}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('GU')}
                  aria-label="Switch to Gujarati"
                  className={cn(
                    'px-2 py-0.5 rounded-full transition-colors whitespace-nowrap',
                    language === 'GU'
                      ? 'bg-deep-forest text-cream font-semibold'
                      : 'text-ink/70'
                  )}
                >
                  ગુજ
                </button>
              </div>
            )}

            {/* Compact Book Button on Tablet */}
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-deep-forest text-cream text-xs font-medium shadow-xs whitespace-nowrap shrink-0 hover:bg-forest transition-colors"
            >
              <span>{language === 'GU' ? 'પરામર્શ' : 'Book'}</span>
              <ArrowUpRight className="w-3 h-3 text-turmeric" />
            </Link>

            {/* Hamburger / Close Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-deep-forest hover:bg-forest/10 rounded-full transition-colors focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center bg-paper/90 backdrop-blur-xs border border-forest/15 shadow-2xs"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.75]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 5. Full-Screen Mobile Sheet with Circular Clip-Path Reveal   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-paper flex flex-col justify-between pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] px-5 min-[390px]:px-6 sm:px-10 overflow-y-auto pl-safe pr-safe relative"
          >
            {/* Heritage Ornament in Background */}
            <div
              aria-hidden="true"
              className="absolute -right-20 -bottom-20 w-[110vw] max-w-[520px] h-[110vw] max-h-[520px] opacity-[0.06] text-forest pointer-events-none select-none z-0"
            >
              <BotanicalDivider variant="lotus" className="w-full h-full" />
            </div>

            {/* Nav list with staggered children and min-48px tap targets (All 7 links visible) */}
            <motion.nav
              variants={navListVariants}
              initial="closed"
              animate="open"
              className="relative z-10 flex flex-col gap-0.5 py-1.5 my-auto"
            >
              {navLinks.map((link, index) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname === link.href || pathname.startsWith(link.href + '/');

                return (
                  <motion.div key={link.href} variants={navItemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between min-h-[46px] py-2 px-3 rounded-lg border-b border-forest/10 group transition-all active:scale-[0.98]',
                        isActive
                          ? 'text-deep-forest bg-forest/10 font-semibold'
                          : 'text-ink/80 hover:text-deep-forest hover:bg-forest/5'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-sage">0{index + 1}</span>
                        <span className="font-display text-lg sm:text-xl font-normal tracking-tight group-hover:translate-x-1 transition-transform">
                          {language === 'GU' ? link.sanskrit : link.label}
                        </span>
                      </div>
                      <span className="font-serif text-sm italic text-forest/60">
                        {language === 'GU' ? link.label : link.sanskrit}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Bottom Actions: Preserved Language Selection & Book Button */}
            <div className="relative z-10 space-y-3 pt-3 border-t border-forest/15 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-forest/80 font-medium">
                  {language === 'GU' ? 'ભાષા પસંદ કરો' : 'Select Language'}
                </span>
                <div className="flex items-center bg-cream rounded-full p-1 border border-forest/15 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setLanguage('EN')}
                    aria-label="Switch to English"
                    className={cn(
                      'px-3.5 py-1.5 rounded-full min-h-[38px] transition-colors cursor-pointer active:scale-[0.97]',
                      language === 'EN'
                        ? 'bg-deep-forest text-cream font-semibold shadow-xs'
                        : 'text-ink/70 hover:text-deep-forest'
                    )}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('GU')}
                    aria-label="Switch to Gujarati"
                    className={cn(
                      'px-3.5 py-1.5 rounded-full min-h-[38px] transition-colors cursor-pointer active:scale-[0.97]',
                      language === 'GU'
                        ? 'bg-deep-forest text-cream font-semibold shadow-xs'
                        : 'text-ink/70 hover:text-deep-forest'
                    )}
                  >
                    ગુજરાતી
                  </button>
                </div>
              </div>

              <Link
                href="/book"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full min-h-[48px] rounded-full bg-deep-forest text-cream font-medium text-sm sm:text-base shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-all hover:bg-forest"
              >
                <span>{t.nav.bookConsultation}</span>
                <span className="w-5 h-5 rounded-full bg-cream/15 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 text-turmeric" />
                </span>
              </Link>

              <p className="text-center text-[11px] text-ink/50 pt-0.5">
                VANKAL AYURVEDA • વાંકલ આયુર્વેદ
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
