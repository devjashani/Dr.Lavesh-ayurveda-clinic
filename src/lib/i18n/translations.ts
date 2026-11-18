import { en } from './en';
import { gu } from './gu';

export type Language = 'EN' | 'GU';

export type TranslationDictionary = typeof en;

export const translations: Record<Language, TranslationDictionary> = {
  EN: en,
  GU: gu,
};

export { en, gu };
