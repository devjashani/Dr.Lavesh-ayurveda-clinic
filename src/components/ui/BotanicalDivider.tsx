import React from 'react';
import { cn } from '@/lib/utils';

export interface BotanicalDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'leaf' | 'lotus' | 'minimal' | 'flourish';
  tone?: 'forest' | 'sage' | 'cream' | 'paper' | 'turmeric';
}

export function BotanicalDivider({
  variant = 'leaf',
  tone = 'sage',
  className,
  ...props
}: BotanicalDividerProps) {
  const toneStroke = {
    forest: 'stroke-forest/35 fill-forest/20 text-forest',
    sage: 'stroke-sage fill-sage/20 text-sage',
    cream: 'stroke-cream/50 fill-cream/20 text-cream',
    paper: 'stroke-paper/60 fill-paper/30 text-paper',
    turmeric: 'stroke-turmeric/60 fill-turmeric/30 text-turmeric',
  };

  const lineGradient = {
    forest: 'from-transparent via-forest/25 to-transparent',
    sage: 'from-transparent via-sage/50 to-transparent',
    cream: 'from-transparent via-cream/40 to-transparent',
    paper: 'from-transparent via-paper/50 to-transparent',
    turmeric: 'from-transparent via-turmeric/40 to-transparent',
  };

  return (
    <div
      role="separator"
      className={cn('relative flex items-center justify-center w-full py-4 my-2 select-none', className)}
      {...props}
    >
      {/* Left Hairline */}
      <div className={cn('h-px flex-1 bg-gradient-to-r', lineGradient[tone])} />

      {/* Center Motif */}
      <div className={cn('px-4 shrink-0 flex items-center justify-center', toneStroke[tone])}>
        {variant === 'leaf' && (
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            <path
              d="M14 1C14 1 8 4 6 9C4 14 7 17 14 17C21 17 24 14 22 9C20 4 14 1 14 1Z"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M14 3V15" strokeWidth="1" strokeLinecap="round" />
            <path d="M14 7C12 8 9 9 9 9" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M14 10C16 11 19 12 19 12" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="2" cy="9" r="1" fill="currentColor" />
            <circle cx="26" cy="9" r="1" fill="currentColor" />
          </svg>
        )}

        {variant === 'lotus' && (
          <svg width="34" height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Center petal */}
            <path
              d="M17 1C15 5 14 9 14 13C14 16 15.5 17 17 17C18.5 17 20 16 20 13C20 9 19 5 17 1Z"
              strokeWidth="1.1"
            />
            {/* Left petal */}
            <path
              d="M14 9C10.5 8 7 11 7 14C7 16 9.5 17 13.5 16.5"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Right petal */}
            <path
              d="M20 9C23.5 8 27 11 27 14C27 16 24.5 17 20.5 16.5"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Base line */}
            <path d="M10 18.5C14 19 20 19 24 18.5" strokeWidth="1" strokeLinecap="round" />
            <circle cx="2" cy="14" r="1" fill="currentColor" />
            <circle cx="32" cy="14" r="1" fill="currentColor" />
          </svg>
        )}

        {variant === 'flourish' && (
          <svg width="40" height="14" viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 7C17 2 13 2 10 5C7 8 4 7 1 7M20 7C23 2 27 2 30 5C33 8 36 7 39 7"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="20" cy="7" r="2" fill="currentColor" />
          </svg>
        )}

        {variant === 'minimal' && (
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-current opacity-70" />
            <div className="w-1.5 h-1.5 rotate-45 border border-current opacity-80" />
            <div className="w-1 h-1 rounded-full bg-current opacity-70" />
          </div>
        )}
      </div>

      {/* Right Hairline */}
      <div className={cn('h-px flex-1 bg-gradient-to-r', lineGradient[tone])} />
    </div>
  );
}

