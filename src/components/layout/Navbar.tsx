'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Logo } from './Logo';
import { Button } from '@/components/ui/Button';
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
      transition: { staggerChildren: 0.05, delayChildren: 0.12 },
    },
  };

  const navItemVariants: Variants = {
    closed: { opacity: 0, y: 22 },
    open: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Solid background after 40px
      setIsScrolled(currentScrollY > 40);

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 5) {
          // Scrolling down
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
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
          'fixed top-0 left-0 right-0 z-50 pl-safe pr-safe transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isScrolled
            ? 'bg-paper/95 backdrop-blur-sm border-b border-forest/15 shadow-[0_4px_20px_rgba(20,41,28,0.03)] pt-[calc(env(safe-area-inset-top,0px)+0.875rem)] pb-3.5 sm:pt-[calc(env(safe-area-inset-top,0px)+1rem)] sm:pb-4'
            : 'bg-transparent border-b border-transparent pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] pb-4 sm:pt-[calc(env(safe-area-inset-top,0px)+1.75rem)] sm:pb-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 xl:px-6 2xl:px-10 flex items-center justify-between gap-4 xl:gap-6 2xl:gap-10 h-11 sm:h-12">
          {/* 1. Logo Block */}
          <div className="shrink-0 flex items-center h-11">
            <Logo />
          </div>

          {/* 2. Desktop Navigation Links Container */}
          <nav className="hidden xl:flex items-center min-w-0 gap-x-6 2xl:gap-x-8 shrink-0 h-11">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-1.5 py-2 text-[15px] 2xl:text-[16px] tracking-wide transition-colors duration-200 group inline-flex items-center flex-col whitespace-nowrap shrink-0 min-h-[44px] justify-center',
                    isActive
                      ? 'text-deep-forest font-semibold'
                      : 'text-ink/80 hover:text-deep-forest'
                  )}
                >
                  <span
                    className={cn(
                      'whitespace-nowrap transition-colors',
                      language === 'GU' ? 'font-serif leading-[1.6]' : 'font-sans leading-[1.6]'
                    )}
                  >
                    {language === 'GU' ? link.sanskrit : link.label}
                  </span>

                  {/* Underline draws left to right on hover */}
                  <span
                    className={cn(
                      'absolute bottom-1 left-0 w-full h-[1.5px] origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none',
                      isActive
                        ? 'bg-turmeric scale-x-100'
                        : 'bg-deep-forest scale-x-0 group-hover:scale-x-100'
                    )}
                  />

                  {/* Active link has a small turmeric dot */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavDot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-turmeric shadow-xs pointer-events-none"
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Action Block (Language Toggle + Book Button) */}
          <div className="hidden xl:flex items-center gap-3 2xl:gap-4 shrink-0 h-11">
            {/* Language Toggle */}
            <div className="flex items-center bg-cream/70 rounded-[4px] p-0.5 border border-forest/15 text-xs font-medium shrink-0 h-9">
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                aria-label="Switch to English"
                className={cn(
                  'px-2.5 py-1 rounded-[3px] transition-all duration-200 cursor-pointer whitespace-nowrap h-8 flex items-center',
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
                  'px-2.5 py-1 rounded-[3px] transition-all duration-200 cursor-pointer whitespace-nowrap h-8 flex items-center',
                  language === 'GU'
                    ? 'bg-deep-forest text-cream font-semibold shadow-xs'
                    : 'text-ink/70 hover:text-deep-forest'
                )}
              >
                ગુજ
              </button>
            </div>

            {/* Book Consultation Button */}
            <Button
              href="/book"
              variant="primary"
              size="sm"
              showArrow
              className="h-11 px-6 py-3 whitespace-nowrap shrink-0"
            >
              {t.nav.bookConsultation}
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex xl:hidden items-center gap-2.5 sm:gap-3 shrink-0">
            <Button href="/book" variant="primary" size="sm" className="hidden sm:inline-flex md:text-xs min-h-[44px] whitespace-nowrap shrink-0">
              {language === 'GU' ? 'પરામર્શ' : 'Book'}
            </Button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-deep-forest hover:bg-forest/10 rounded-[4px] transition-colors focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Menu with Circular Expanding Clip-Path & Staggered Reveal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-paper flex flex-col justify-between pt-[calc(env(safe-area-inset-top,0px)+5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] px-6 sm:px-10 overflow-y-auto pl-safe pr-safe relative"
          >
            {/* Large Faded Heritage Ornament in Background */}
            <div
              aria-hidden="true"
              className="absolute -right-20 -bottom-20 w-[110vw] max-w-[520px] h-[110vw] max-h-[520px] opacity-[0.06] text-forest pointer-events-none select-none z-0"
            >
              <BotanicalDivider variant="lotus" className="w-full h-full" />
            </div>

            {/* Header info & Close Button */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-forest/15">
              <span className="text-xs uppercase tracking-widest text-forest font-semibold">
                {t.nav.menu}
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-deep-forest hover:bg-forest/10 rounded-[4px] transition-colors focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.97]"
                aria-label="Close Navigation Menu"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Nav list with staggered children and min-48px tap targets */}
            <motion.nav
              variants={navListVariants}
              initial="closed"
              animate="open"
              className="relative z-10 flex flex-col gap-1 py-4 my-auto"
            >
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div key={link.href} variants={navItemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between min-h-[48px] py-3 px-2.5 rounded-[4px] border-b border-forest/10 group transition-all active:scale-[0.97]',
                        isActive
                          ? 'text-deep-forest bg-forest/5 font-semibold'
                          : 'text-ink/80 hover:text-deep-forest hover:bg-forest/5'
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-xs font-mono text-sage">0{index + 1}</span>
                        <span className="font-display text-xl sm:text-2xl font-normal tracking-tight group-hover:translate-x-1 transition-transform">
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

            {/* Bottom Actions: Language Toggle & Book Button */}
            <div className="relative z-10 space-y-4 pt-4 border-t border-forest/15 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-forest/80 font-medium">
                  {language === 'GU' ? 'ભાષા પસંદ કરો' : 'Select Language'}
                </span>
                <div className="flex items-center bg-cream rounded-[4px] p-0.5 border border-forest/15 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setLanguage('EN')}
                    aria-label="Switch to English"
                    className={cn(
                      'px-3.5 py-1.5 rounded-[3px] min-h-[38px] transition-colors cursor-pointer active:scale-[0.97]',
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
                      'px-3.5 py-1.5 rounded-[3px] min-h-[38px] transition-colors cursor-pointer active:scale-[0.97]',
                      language === 'GU'
                        ? 'bg-deep-forest text-cream font-semibold shadow-xs'
                        : 'text-ink/70 hover:text-deep-forest'
                    )}
                  >
                    ગુજરાતી
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openBookingSheet();
                }}
                className="w-full min-h-[50px] rounded-[4px] bg-deep-forest text-cream font-medium text-base shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-all btn-primary-ripple"
              >
                <span>{t.nav.bookConsultation}</span>
                <ArrowUpRight className="w-4 h-4 text-turmeric" />
              </button>

              <p className="text-center text-xs text-ink/50 pt-1">
                VANKAL AYURVEDA • વાંકલ આયુર્વેદ
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

