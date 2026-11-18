'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

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
    setLanguageState(lang);
    try {
      localStorage.setItem('vankal_language', lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'GU' : 'EN');
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
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
    };
  }
  return context;
}
