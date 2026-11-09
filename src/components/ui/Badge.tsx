import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'forest' | 'sage' | 'turmeric' | 'clay' | 'cream' | 'paper' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  variant = 'sage',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-wider uppercase',
    md: 'text-xs px-3 py-1 tracking-wide',
  };

  const variantStyles = {
    forest: 'bg-forest/10 text-deep-forest border border-forest/20',
    sage: 'bg-sage/15 text-forest border border-sage/35',
    turmeric: 'bg-turmeric/15 text-[#946210] border border-turmeric/35',
    clay: 'bg-clay/15 text-clay border border-clay/30',
    cream: 'bg-cream text-ink border border-paper/80 shadow-[0_1px_2px_rgba(27,27,24,0.04)]',
    paper: 'bg-paper text-forest border border-forest/15',
    outline: 'bg-transparent text-forest border border-forest/30',
  };

  const dotStyles = {
    forest: 'bg-forest',
    sage: 'bg-sage',
    turmeric: 'bg-turmeric',
    clay: 'bg-clay',
    cream: 'bg-sage',
    paper: 'bg-forest',
    outline: 'bg-forest',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full select-none transition-colors duration-200',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotStyles[variant])} />}
      {children}
    </span>
  );
}

