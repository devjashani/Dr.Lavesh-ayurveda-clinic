'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const navLinks = [
  { href: '/', label: 'Home', sanskrit: 'गृह' },
  { href: '/about', label: 'About', sanskrit: 'परिचय' },
  { href: '/treatments', label: 'Treatments', sanskrit: 'चिकित्सा' },
  { href: '/conditions', label: 'Conditions', sanskrit: 'व्याधि' },
  { href: '/doctors', label: 'Doctors', sanskrit: 'वैद्य' },
  { href: '/dosha-quiz', label: 'Dosha Quiz', sanskrit: 'प्रकृति' },
  { href: '/blog', label: 'Wisdom', sanskrit: 'ज्ञान' },
  { href: '/contact', label: 'Contact', sanskrit: 'संपर्क' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const lastScrollY = useRef(0);

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
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isScrolled
            ? 'bg-paper/95 backdrop-blur-sm border-b border-forest/15 shadow-[0_4px_20px_rgba(20,41,28,0.03)] py-3'
            : 'bg-transparent border-b border-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative py-1 text-sm tracking-wide transition-colors duration-200 group',
                    isActive
                      ? 'text-deep-forest font-semibold'
                      : 'text-ink/80 hover:text-deep-forest'
                  )}
                >
                  <span className={language === 'HI' ? 'font-serif text-sm' : ''}>
                    {language === 'HI' ? link.sanskrit : link.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-turmeric rounded-full"
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center bg-cream/70 rounded-[4px] p-0.5 border border-forest/15 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={cn(
                  'px-2 py-1 rounded-[3px] transition-all duration-200 cursor-pointer',
                  language === 'EN'
                    ? 'bg-deep-forest text-cream font-semibold shadow-xs'
                    : 'text-ink/70 hover:text-deep-forest'
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('HI')}
                className={cn(
                  'px-2 py-1 rounded-[3px] font-serif transition-all duration-200 cursor-pointer',
                  language === 'HI'
                    ? 'bg-deep-forest text-cream font-semibold shadow-xs'
                    : 'text-ink/70 hover:text-deep-forest'
                )}
              >
                हिं
              </button>
            </div>

            {/* Book Consultation Button */}
            <Button href="/book" variant="primary" size="sm" showArrow className="min-h-[44px]">
              {t.nav.bookConsultation}
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex xl:hidden items-center gap-3">
            <Button href="/book" variant="primary" size="sm" className="hidden sm:inline-flex md:text-xs min-h-[44px]">
              {language === 'HI' ? 'परामर्श' : 'Book'}
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

      {/* Full-Screen Mobile Navigation Menu with Staggered Reveal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-paper flex flex-col justify-between pt-24 pb-8 px-6 sm:px-10 overflow-y-auto"
          >
            {/* Header info / language */}
            <div className="flex items-center justify-between pb-4 border-b border-forest/15">
              <span className="text-xs uppercase tracking-widest text-forest font-semibold">
                Menu & Directory
              </span>
              <div className="flex items-center bg-cream rounded p-0.5 border border-forest/15 text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('EN')}
                  className={cn(
                    'px-2.5 py-1 rounded transition-colors',
                    language === 'EN' ? 'bg-deep-forest text-cream font-semibold' : 'text-ink/70'
                  )}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('HI')}
                  className={cn(
                    'px-2.5 py-1 rounded font-serif transition-colors',
                    language === 'HI' ? 'bg-deep-forest text-cream font-semibold' : 'text-ink/70'
                  )}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* Nav list */}
            <nav className="flex flex-col gap-3 py-6">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.05 * index,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-baseline justify-between py-2 border-b border-forest/10 group',
                        isActive ? 'text-deep-forest' : 'text-ink/80 hover:text-deep-forest'
                      )}
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-mono text-sage">0{index + 1}</span>
                        <span className="font-display text-2xl font-normal tracking-tight group-hover:translate-x-1 transition-transform">
                          {language === 'HI' ? link.sanskrit : link.label}
                        </span>
                      </div>
                      <span className="font-serif text-sm italic text-forest/60">
                        {language === 'HI' ? link.label : link.sanskrit}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="space-y-4 pt-4">
              <BotanicalDivider variant="leaf" tone="sage" />
              <div className="grid grid-cols-2 gap-3">
                <Button href="/book" variant="primary" size="lg" className="w-full">
                  Book Consultation
                </Button>
                <Button href="/portal" variant="secondary" size="lg" className="w-full">
                  Patient Portal
                </Button>
              </div>
              <p className="text-center text-xs text-ink/50 pt-2">
                Aarogyam Ayurvedic Chikitsalaya • Civil Lines, Jaipur
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

