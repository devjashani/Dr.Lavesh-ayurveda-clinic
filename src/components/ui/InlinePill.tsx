'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface InlinePillProps {
  src: string;
  alt?: string;
  widthEm?: number;
  heightEm?: number;
  className?: string;
  imageClassName?: string;
}

/**
 * <InlinePill>
 * Small rounded image capsule (~1.6em wide, ~0.9em high) that sits seamlessly inside a line of text,
 * aligned to the typographic baseline, used to embed a tiny botanical or clinical crop between words.
 */
export function InlinePill({
  src,
  alt = 'Botanical illustration',
  widthEm = 1.6,
  heightEm = 0.9,
  className,
  imageClassName,
}: InlinePillProps) {
  return (
    <span
      role="img"
      aria-label={alt}
      title={alt}
      className={cn(
        'group inline-flex items-center justify-center rounded-full overflow-hidden',
        'border border-forest/25 shadow-2xs mx-1 sm:mx-1.5 select-none relative',
        'transition-all duration-300 hover:border-turmeric/60 align-[-0.05em]',
        className
      )}
      style={{
        width: `${widthEm}em`,
        height: `${heightEm}em`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="64px"
        className={cn(
          'object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-115',
          imageClassName
        )}
      />
    </span>
  );
}
