import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sanskrit?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-deep-forest tracking-wide uppercase"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none bg-cream/70 text-ink text-sm px-4 py-2.5 pr-10 rounded-[4px] border transition-all duration-200 outline-none cursor-pointer',
              'border-forest/20 hover:border-forest/40 focus:border-forest focus:bg-cream focus:ring-1 focus:ring-forest/20',
              error && 'border-clay/80 focus:border-clay focus:ring-clay/30 bg-clay/5',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-ink/40">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} {opt.sanskrit ? `(${opt.sanskrit})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 w-4 h-4 text-forest/60 pointer-events-none" />
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

Select.displayName = 'Select';

