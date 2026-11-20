'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  arrowClassName?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

/**
 * <PillButton>
 * Rounded-full button with label and a small circular arrow chip on the right.
 * - On hover: the arrow chip slides 3px right, and the background fills slowly.
 * - On press: scales to 0.97.
 * - Variants: 'dark' (default), 'light', 'outline'.
 */
export function PillButton({
  children,
  variant = 'dark',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className,
  arrowClassName,
  icon,
  ariaLabel,
}: PillButtonProps) {
  const sizeClasses = {
    sm: 'text-xs py-1.5 pl-4 pr-1.5 gap-2.5 min-h-[38px]',
    md: 'text-xs sm:text-sm py-2 pl-5 pr-2 gap-3 min-h-[46px]',
    lg: 'text-sm sm:text-base py-2.5 pl-6 pr-2.5 gap-4 min-h-[52px]',
  };

  const arrowSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const baseClasses = cn(
    'group relative rounded-full inline-flex items-center justify-between overflow-hidden',
    'font-sans font-medium tracking-wide select-none touch-manipulation',
    'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
    'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turmeric',
    sizeClasses[size],
    disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
    className
  );

  const isDark = variant === 'dark';
  const isLight = variant === 'light';

  const variantClasses = isDark
    ? 'bg-deep-forest text-cream border border-forest/30 shadow-[0_4px_16px_rgba(20,41,28,0.18)]'
    : isLight
    ? 'bg-cream text-deep-forest border border-forest/20 shadow-2xs'
    : 'bg-transparent text-deep-forest border border-forest/35 hover:border-forest/70';

  const backgroundFillClasses = isDark
    ? 'bg-forest/85'
    : isLight
    ? 'bg-paper'
    : 'bg-cream/90';

  const arrowChipClasses = isDark
    ? 'bg-turmeric text-deep-forest'
    : isLight
    ? 'bg-deep-forest text-cream'
    : 'bg-forest/15 text-deep-forest group-hover:bg-deep-forest group-hover:text-cream';

  const content = (
    <>
      {/* Slow Background Fill on Hover */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none',
          backgroundFillClasses
        )}
      />

      {/* Button Label */}
      <span className="relative z-10">{children}</span>

      {/* Small Circular Arrow Chip */}
      <span
        aria-hidden="true"
        className={cn(
          'relative z-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'group-hover:translate-x-[3px]',
          arrowSizes[size],
          arrowChipClasses,
          arrowClassName
        )}
      >
        {icon ?? <ArrowRight className={iconSizes[size]} />}
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(baseClasses, variantClasses)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(baseClasses, variantClasses)}
    >
      {content}
    </button>
  );
}
