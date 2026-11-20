'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { cn } from '@/lib/utils';

export interface AccentProps {
  children: React.ReactNode;
  as?: 'span' | 'em';
  className?: string;
  lang?: 'en' | 'gu' | 'EN' | 'GU';
  style?: React.CSSProperties;
}

/**
 * <Accent>
 * Mixed-style headline word component.
 * - In English: renders the word in the existing serif (Fraunces) at italic style.
 * - In Gujarati: Gujarati typography has no italic. Sets font-style: normal and font-synthesis: none,
 *   rendering the word in the accent color (turmeric) with a slightly heavier weight.
 * Example: "Ayurveda, <Accent>finally</Accent> understood."
 */
export function Accent({
  children,
  as = 'span',
  className,
  lang,
  style,
}: AccentProps) {
  const languageContext = useLanguage();
  const currentLang = (lang ?? languageContext?.language ?? 'EN').toUpperCase();
  const isGujarati = currentLang === 'GU';

  const Component = as as React.ElementType;

  if (isGujarati) {
    return (
      <Component
        className={cn(
          'font-gujarati font-semibold text-turmeric not-italic inline-block',
          className
        )}
        style={{
          fontStyle: 'normal',
          fontSynthesis: 'none',
          ...style,
        }}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={cn(
        'font-serif italic font-light sm:font-normal text-forest/95 selection:text-deep-forest inline-block',
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}
