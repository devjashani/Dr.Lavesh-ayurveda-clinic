import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'auto';
  showTagline?: boolean;
}

export function Logo({
  className,
  variant = 'auto',
  showTagline = true,
}: LogoProps) {
  const isLight = variant === 'light';

  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-3 group select-none', className)}
    >
      {/* Classical Leaf / Mudra SVG Mark */}
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
          isLight
            ? 'bg-cream/10 text-cream border border-cream/20 group-hover:bg-cream/20'
            : 'bg-forest/10 text-deep-forest border border-forest/20 group-hover:bg-forest/15'
        )}
      >
        <svg
          width="24"
          height="24"
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
      <div className="flex flex-col text-left">
        <span
          className={cn(
            'font-display text-xl sm:text-2xl font-semibold tracking-tight leading-none',
            isLight ? 'text-cream' : 'text-deep-forest'
          )}
        >
          Aarogyam
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={cn(
              'font-sans text-[10px] tracking-[0.2em] uppercase font-medium',
              isLight ? 'text-cream/70' : 'text-forest/80'
            )}
          >
            Ayurveda
          </span>
          {showTagline && (
            <>
              <span aria-hidden="true" className={cn('text-[9px] opacity-40', isLight ? 'text-cream' : 'text-ink')}>
                •
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'font-serif text-[11px] italic leading-none font-medium',
                  isLight ? 'text-cream/80' : 'text-forest'
                )}
              >
                आरोग्यम्
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

