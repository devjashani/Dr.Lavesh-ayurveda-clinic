'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ArchFrameProps {
  src?: string;
  alt?: string;
  aspectRatio?: string;
  children?: React.ReactNode;
  offsetRing?: boolean;
  ringClassName?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * <ArchFrame>
 * Arch-shaped image mask (rounded top, flat bottom) with a thin offset outline ring and soft shadow.
 * Evokes classical Ayurvedic temple arches and restorative botanical glasshouses.
 */
export function ArchFrame({
  src,
  alt = 'Vankal Ayurveda',
  aspectRatio = 'aspect-[3/4]',
  children,
  offsetRing = true,
  ringClassName,
  className,
  imageClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: ArchFrameProps) {
  return (
    <div className={cn('relative inline-block w-full', className)}>
      {/* Thin Offset Outline Ring */}
      {offsetRing && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute -inset-2 sm:-inset-3 rounded-t-full rounded-b-none',
            'border border-forest/20 pointer-events-none z-0',
            ringClassName
          )}
        />
      )}

      {/* Main Arch Container with Soft Shadow */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-t-full rounded-b-none bg-cream',
          'shadow-[0_16px_40px_rgba(20,41,28,0.08)] z-10',
          aspectRatio
        )}
      >
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn('object-cover', imageClassName)}
          />
        )}
        {children}
      </div>
    </div>
  );
}
