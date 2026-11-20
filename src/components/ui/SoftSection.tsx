'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SoftSectionProps {
  children: React.ReactNode;
  as?: 'section' | 'div' | 'article';
  gradient?: 'paper-to-cream' | 'cream-to-paper' | 'subtle' | 'none';
  roundedTop?: boolean;
  cardOverlap?: boolean;
  container?: boolean;
  containerSize?: 'default' | 'narrow' | 'wide' | 'full';
  className?: string;
  containerClassName?: string;
  id?: string;
}

/**
 * <SoftSection>
 * Restorative section wrapper featuring a very soft vertical gradient between existing tokens (paper to cream),
 * generous whitespace padding, and an optional rounded top edge allowing sections to overlap like cards.
 */
export function SoftSection({
  children,
  as = 'section',
  gradient = 'paper-to-cream',
  roundedTop = false,
  cardOverlap = false,
  container = true,
  containerSize = 'default',
  className,
  containerClassName,
  id,
}: SoftSectionProps) {
  const Component = as as React.ElementType;

  const gradientClasses = {
    'paper-to-cream': 'bg-gradient-to-b from-paper via-cream/60 to-cream',
    'cream-to-paper': 'bg-gradient-to-b from-cream via-paper/70 to-paper',
    subtle: 'bg-gradient-to-b from-paper via-cream/35 to-paper',
    none: 'bg-paper',
  };

  const containerSizes = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-none',
  };

  const isCardOverlapping = roundedTop || cardOverlap;

  return (
    <Component
      id={id}
      className={cn(
        'w-full relative py-16 sm:py-24 lg:py-32',
        gradientClasses[gradient],
        isCardOverlapping && [
          'rounded-t-[32px] sm:rounded-t-[48px] -mt-8 sm:-mt-12',
          'shadow-[0_-8px_32px_rgba(20,41,28,0.04)] border-t border-forest/10 z-10',
        ],
        className
      )}
    >
      {container ? (
        <div
          className={cn(
            'mx-auto px-5 sm:px-8 lg:px-12',
            containerSizes[containerSize],
            containerClassName
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
}
