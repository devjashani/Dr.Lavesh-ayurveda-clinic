import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: string;
  sanskritEyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: 'left' | 'center' | 'asymmetric';
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  sanskritEyebrow,
  title,
  subtitle,
  align = 'left',
  size = 'md',
  dark = false,
  className,
  ...props
}: SectionHeadingProps) {
  const alignContainer = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto max-w-3xl',
    asymmetric: 'text-left items-start md:grid md:grid-cols-12 md:gap-8 md:items-end',
  };

  const titleSizes = {
    sm: 'text-display-h3',
    md: 'text-display-h2',
    lg: 'text-display-h1',
  };

  if (align === 'asymmetric') {
    return (
      <div className={cn('w-full mb-12 sm:mb-16', className)} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="md:col-span-7">
            {(eyebrow || sanskritEyebrow) && (
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                <span
                  className={cn(
                    'text-eyebrow font-medium tracking-widest',
                    dark ? 'text-sage' : 'text-forest'
                  )}
                >
                  {eyebrow}
                </span>
                {sanskritEyebrow && (
                  <span
                    className={cn(
                      'text-xs font-serif italic ml-1',
                      dark ? 'text-cream/90' : 'text-forest font-medium'
                    )}
                  >
                    • {sanskritEyebrow}
                  </span>
                )}
              </div>
            )}
            <h2
              className={cn(
                titleSizes[size],
                'font-display font-normal tracking-tight',
                dark ? 'text-cream' : 'text-deep-forest'
              )}
            >
              {title}
            </h2>
          </div>

          {subtitle && (
            <div className="md:col-span-5 md:pb-1">
              <p
                className={cn(
                  'text-body-base leading-relaxed',
                  dark ? 'text-paper/80' : 'text-ink/75'
                )}
              >
                {subtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('flex flex-col mb-10 sm:mb-14', alignContainer[align], className)}
      {...props}
    >
      {(eyebrow || sanskritEyebrow) && (
        <div className="flex items-center gap-2 mb-3.5">
          <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
          <span
            className={cn(
              'text-eyebrow font-medium tracking-widest',
              dark ? 'text-sage' : 'text-forest'
            )}
          >
            {eyebrow}
          </span>
          {sanskritEyebrow && (
            <span
              className={cn(
                'text-xs font-serif italic ml-1',
                dark ? 'text-cream/90' : 'text-forest font-medium'
              )}
            >
              • {sanskritEyebrow}
            </span>
          )}
        </div>
      )}

      <h2
        className={cn(
          titleSizes[size],
          'font-display font-normal tracking-tight',
          dark ? 'text-cream' : 'text-deep-forest'
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'text-body-base mt-4 max-w-2xl leading-relaxed',
            dark ? 'text-paper/80' : 'text-ink/75',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
