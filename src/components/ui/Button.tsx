'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text-link' | 'ghost' | 'turmeric';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  isLoading?: boolean;
  showArrow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disableMagnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      external,
      isLoading = false,
      showArrow = false,
      icon,
      iconPosition = 'right',
      disableMagnetic = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
      if (disableMagnetic || typeof window === 'undefined') return;
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      const maxDist = 5;
      const clampedX = Math.max(-maxDist, Math.min(maxDist, relX * 0.12));
      const clampedY = Math.max(-maxDist, Math.min(maxDist, relY * 0.12));
      e.currentTarget.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
      e.currentTarget.style.transition = 'transform 0.1s ease-out';
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    };

    const baseStyles =
      'relative inline-flex items-center justify-center font-medium tracking-wide focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forest/40 disabled:opacity-50 disabled:pointer-events-none select-none overflow-hidden';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-[3px]',
      md: 'text-sm px-5 py-2.5 gap-2 rounded-[4px]',
      lg: 'text-base px-7 py-3.5 gap-2.5 rounded-[4px]',
    };

    const variantStyles = {
      primary:
        'bg-deep-forest text-cream border border-deep-forest active:bg-[#0E1C13] shadow-[0_1px_2px_rgba(20,41,28,0.12)]',
      secondary:
        'bg-transparent text-forest border border-forest/40 hover:bg-cream hover:border-forest active:bg-paper',
      turmeric:
        'bg-turmeric text-deep-forest font-semibold border border-turmeric hover:bg-[#C98A20] active:bg-[#B57816]',
      ghost:
        'bg-transparent text-forest hover:bg-forest/5 active:bg-forest/10 border border-transparent',
      'text-link':
        'bg-transparent text-forest p-0 hover:text-deep-forest animated-underline font-serif tracking-normal rounded-none border-none shadow-none overflow-visible',
    };

    const content = (
      <>
        {/* Slower bottom wipe layer for primary button */}
        {variant === 'primary' && (
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[#254B33] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0"
          />
        )}

        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
          {!isLoading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
          {!isLoading && showArrow && (
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 shrink-0" />
          )}
        </span>
      </>
    );

    if (href) {
      const linkClasses = cn(
        baseStyles,
        variant !== 'text-link' && sizeStyles[size],
        variantStyles[variant],
        'group cursor-pointer',
        className
      );

      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={linkClasses}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          href={href}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={linkClasses}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          baseStyles,
          variant !== 'text-link' && sizeStyles[size],
          variantStyles[variant],
          'group cursor-pointer',
          className
        )}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
