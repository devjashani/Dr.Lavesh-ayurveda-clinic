'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'auto';
  showTagline?: boolean;
  compactNavbar?: boolean;
}

export function Logo({
  className,
  variant = 'auto',
  showTagline = true,
  compactNavbar = false,
}: LogoProps) {
  const isLight = variant === 'light';
  const { language } = useLanguage();

  const brandName = compactNavbar
    ? 'VANKAL AYURVEDA'
    : language === 'GU'
    ? 'વાંકલ આયુર્વેદ'
    : 'VANKAL AYURVEDA';

  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-2.5 sm:gap-3 group select-none shrink-0', className)}
    >
      {/* Classical Leaf / Mudra SVG Mark */}
      <div
        className={cn(
          'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
          isLight
            ? 'bg-cream/10 text-cream border border-cream/20 group-hover:bg-cream/20'
            : 'bg-forest/10 text-deep-forest border border-forest/20 group-hover:bg-forest/15'
        )}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 group-hover:scale-105"
        >
          {/* Mudra / Leaf Contour */}
          <path
            d="M12 2C12 2 6 6 5 12C4 18 9 22 12 22C15 22 20 18 19 12C18 6 12 2 12 2Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central Stem */}
          <path
            d="M12 5V19"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          {/* Delicate Veins */}
          <path
            d="M12 9C9.5 10 7.5 11.5 7.5 11.5"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M12 13C14.5 14 16.5 15.5 16.5 15.5"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <circle cx="12" cy="7" r="0.75" fill="currentColor" />
        </svg>
      </div>

      {/* Wordmark Typography */}
      <div className="flex flex-col text-left justify-center">
        <span
          className={cn(
            'font-display font-semibold tracking-tight leading-none whitespace-nowrap',
            compactNavbar ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl',
            isLight ? 'text-cream' : 'text-deep-forest'
          )}
        >
          {brandName}
        </span>
        {showTagline && (
          <span
            aria-hidden="true"
            className={cn(
              'font-serif text-[10px] sm:text-[11px] leading-none font-medium mt-1 tracking-wider whitespace-nowrap',
              isLight ? 'text-cream/80' : 'text-forest'
            )}
          >
            {compactNavbar ? 'વાંકલ આયુર્વેદ' : 'વાંકલ'}
          </span>
        )}
      </div>
    </Link>
  );
}
