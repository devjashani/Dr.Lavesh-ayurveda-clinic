'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  usePrefersReducedMotion,
  useIsMobile,
} from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface BlurRevealProps {
  children: string | React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  mode?: 'lines' | 'words';
  stagger?: number;
  trigger?: 'load' | 'scroll';
  delay?: number;
  duration?: number;
  className?: string;
  itemClassName?: string;
}

/**
 * <BlurReveal>
 * Text reveal that transitions from blur(8px) + opacity 0.2 + translateY(12px) to sharp.
 * - Props: mode ("lines" | "words"), stagger, trigger ("load" | "scroll").
 * - On mobile (< 768px): uses blur(4px) and animates by lines only for paragraphs to protect performance.
 * - Respects prefers-reduced-motion (shows final sharp state immediately).
 * - Includes aria-label with the full text for screen reader clarity.
 * - Hydration-safe progressive enhancement: visible by default in SSR HTML.
 */
export function BlurReveal({
  children,
  as = 'p',
  mode = 'words',
  stagger,
  trigger = 'scroll',
  delay = 0,
  duration = 0.75,
  className,
  itemClassName,
}: BlurRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Extract plain text string for aria-label and splitting
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join(' ');
    if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
      return extractText((node.props as { children?: React.ReactNode }).children);
    }
    return '';
  };

  const fullText = extractText(children);

  // On mobile (< 768px), force line-mode for paragraphs to protect frame rate
  const isParagraph = as === 'p';
  const effectiveMode = isMobile && isParagraph ? 'lines' : mode;

  // Stagger timing default
  const defaultStagger = effectiveMode === 'words' ? 0.035 : 0.08;
  const activeStagger = stagger ?? defaultStagger;

  // Split content based on mode
  let items: string[] = [];
  if (effectiveMode === 'lines') {
    items = fullText.split('\n').filter((l) => l.trim().length > 0);
    if (items.length <= 1) {
      items = [fullText];
    }
  } else {
    items = fullText.split(/\s+/).filter((w) => w.length > 0);
  }

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || prefersReduced) return;

      const targets = el.querySelectorAll('.blur-reveal-target');
      if (!targets.length) return;

      const blurAmount = isMobile ? 'blur(4px)' : 'blur(8px)';

      gsap.fromTo(
        targets,
        {
          filter: blurAmount,
          opacity: 0.2,
          y: 12,
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration,
          stagger: activeStagger,
          delay,
          ease: 'power2.out',
          scrollTrigger:
            trigger === 'scroll'
              ? {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                }
              : undefined,
        }
      );
    },
    {
      scope: containerRef,
      dependencies: [
        prefersReduced,
        isMobile,
        effectiveMode,
        trigger,
        delay,
        duration,
        activeStagger,
        items.length,
      ],
    }
  );

  const Component = as as React.ElementType;

  return (
    <Component
      ref={containerRef}
      aria-label={fullText}
      className={cn(className)}
    >
      {effectiveMode === 'lines'
        ? items.map((line, idx) => (
            <span key={idx} className="block overflow-hidden pb-0.5">
              <span className={cn('blur-reveal-target block', itemClassName)}>
                {line}
              </span>
            </span>
          ))
        : items.map((word, idx) => (
            <span
              key={idx}
              className={cn(
                'blur-reveal-target inline-block whitespace-nowrap mr-[0.26em] last:mr-0',
                itemClassName
              )}
            >
              {word}
            </span>
          ))}
    </Component>
  );
}
