'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface EyebrowProps {
  children: React.ReactNode;
  as?: 'div' | 'span' | 'p';
  className?: string;
  dotClassName?: string;
  dotColor?: 'turmeric' | 'sage' | 'forest' | 'clay';
}

/**
 * <Eyebrow>
 * Tiny uppercase label (letter-spacing 0.18em, 11-12px) with a small round accent dot before it.
 * Uses existing turmeric token for the accent dot by default.
 */
export function Eyebrow({
  children,
  as = 'div',
  className,
  dotClassName,
  dotColor = 'turmeric',
}: EyebrowProps) {
  const Component = as as React.ElementType;

  const dotColorClasses = {
    turmeric: 'bg-turmeric',
    sage: 'bg-sage',
    forest: 'bg-forest',
    clay: 'bg-clay',
  };

  return (
    <Component
      className={cn(
        'inline-flex items-center gap-2 text-[11px] sm:text-[12px] font-sans font-semibold uppercase tracking-[0.18em] text-forest select-none',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0',
          dotColorClasses[dotColor],
          dotClassName
        )}
      />
      <span>{children}</span>
    </Component>
  );
}
