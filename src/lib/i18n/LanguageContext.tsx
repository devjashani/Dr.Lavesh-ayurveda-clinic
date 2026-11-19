'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  isCrossfading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Read stored preference ONLY after mount to prevent hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vankal_language') as Language;
      if (stored === 'EN' || stored === 'GU') {
        setLanguageState(stored);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Sync <html lang="..."> attribute and data-lang attribute on client
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const langAttr = language === 'GU' ? 'gu' : 'en';
      document.documentElement.lang = langAttr;
      document.documentElement.setAttribute('data-lang', langAttr);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    setIsCrossfading(true);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-lang-switching', 'true');
    }

    // Smooth opacity crossfade (100ms fade-out, swap language, 100ms fade-in = 200ms total)
    setTimeout(() => {
      setLanguageState(lang);
      try {
        localStorage.setItem('vankal_language', lang);
      } catch {
        // Ignore
      }
      setTimeout(() => {
        setIsCrossfading(false);
        if (typeof document !== 'undefined') {
          document.documentElement.removeAttribute('data-lang-switching');
        }
      }, 100);
    }, 100);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'GU' : 'EN');
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isCrossfading }}>
      <div
        className={`transition-opacity duration-200 ease-in-out min-h-full flex flex-col flex-1 ${
          isCrossfading ? 'opacity-20' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'EN' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations.EN,
      isCrossfading: false,
    };
  }
  return context;
}
