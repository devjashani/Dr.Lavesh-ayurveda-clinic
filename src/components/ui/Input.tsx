'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  sanskritLabel?: string;
  icon?: React.ReactNode;
  floatingLabel?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      sanskritLabel,
      icon,
      type = 'text',
      id,
      floatingLabel = false,
      placeholder = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    if (floatingLabel && label) {
      return (
        <div className="w-full flex flex-col gap-1 text-left">
          <div className="relative flex items-center">
            {icon && (
              <div className="absolute left-3.5 text-forest/50 pointer-events-none flex items-center z-10">
                {icon}
              </div>
            )}
            <input
              id={inputId}
              type={type}
              ref={ref}
              placeholder={placeholder || ' '}
              className={cn(
                'peer w-full bg-cream/70 text-ink text-sm px-4 pt-4 pb-2 rounded-[4px] border outline-none',
                'border-forest/20 hover:border-forest/40 focus:border-turmeric focus:bg-cream focus:ring-2 focus:ring-turmeric/25 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] min-h-[48px]',
                icon && 'pl-10',
                error && 'border-clay/80 focus:border-clay focus:ring-clay/30 bg-clay/5',
                className
              )}
              {...props}
            />
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-4 top-1 text-[10px] uppercase font-mono tracking-wider text-forest/75 font-medium transition-all duration-200 pointer-events-none',
                'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-sans peer-placeholder-shown:text-ink/50',
                'peer-focus:top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-mono peer-focus:text-turmeric',
                icon && 'peer-placeholder-shown:left-10'
              )}
            >
              {label}
            </label>
          </div>

          {error ? (
            <p className="text-xs text-clay font-medium mt-0.5">{error}</p>
          ) : helperText ? (
            <p className="text-xs text-ink/60 mt-0.5">{helperText}</p>
          ) : null}
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <div className="flex items-baseline justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-semibold text-deep-forest tracking-wide uppercase"
            >
              {label}
            </label>
            {sanskritLabel && (
              <span className="text-[11px] font-serif text-sage italic">
                {sanskritLabel}
              </span>
            )}
          </div>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-forest/50 pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            placeholder={placeholder}
            className={cn(
              'w-full bg-cream/70 text-ink placeholder:text-ink/40 text-sm px-4 py-2.5 rounded-[4px] border outline-none',
              'border-forest/20 hover:border-forest/40 focus:border-turmeric focus:bg-cream focus:ring-2 focus:ring-turmeric/25 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              icon && 'pl-10',
              error && 'border-clay/80 focus:border-clay focus:ring-clay/30 bg-clay/5',
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-xs text-clay font-medium mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-ink/60 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
