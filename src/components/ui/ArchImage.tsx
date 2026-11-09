import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ArchImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: 'portrait' | 'tall' | 'square' | 'wide';
  caption?: string;
  sanskritCaption?: string;
  priority?: boolean;
  archStyle?: 'top-arch' | 'full-arch' | 'ogee' | 'organic';
  border?: boolean;
}

export function ArchImage({
  src,
  alt,
  width = 600,
  height = 800,
  aspectRatio = 'portrait',
  caption,
  sanskritCaption,
  priority = false,
  archStyle = 'top-arch',
  border = true,
  className,
  ...props
}: ArchImageProps) {
  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    tall: 'aspect-[9/14]',
    square: 'aspect-square',
    wide: 'aspect-[4/3]',
  };

  const archClasses = {
    'top-arch': 'rounded-t-[140px] sm:rounded-t-[180px] rounded-b-[4px]',
    'full-arch': 'rounded-t-full rounded-b-[4px]',
    ogee: 'rounded-t-[120px] rounded-b-[24px]',
    organic: 'rounded-tl-[160px] rounded-tr-[40px] rounded-br-[140px] rounded-bl-[20px]',
  };

  return (
    <figure className={cn('relative group flex flex-col', className)} {...props}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-cream/80',
          aspectClasses[aspectRatio],
          archClasses[archStyle],
          border && 'ring-1 ring-forest/15 shadow-[0_8px_30px_rgba(20,41,28,0.06)]'
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />

        {/* Ambient fine inner border */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 z-10',
            archClasses[archStyle],
            'ring-1 ring-inset ring-cream/40'
          )}
        />
      </div>

      {(caption || sanskritCaption) && (
        <figcaption className="mt-3 flex items-baseline justify-between text-xs text-ink/70 px-1">
          {caption && <span className="font-sans font-medium">{caption}</span>}
          {sanskritCaption && (
            <span className="font-serif italic text-forest/80 ml-auto">
              {sanskritCaption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

