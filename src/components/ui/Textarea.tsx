import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  sanskritLabel?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, sanskritLabel, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <div className="flex items-baseline justify-between">
            <label
              htmlFor={textareaId}
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

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-cream/70 text-ink placeholder:text-ink/40 text-sm px-4 py-2.5 rounded-[4px] border transition-all duration-200 outline-none resize-y',
            'border-forest/20 hover:border-forest/40 focus:border-forest focus:bg-cream focus:ring-1 focus:ring-forest/20',
            error && 'border-clay/80 focus:border-clay focus:ring-clay/30 bg-clay/5',
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs text-clay font-medium mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-ink/60 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

