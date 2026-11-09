import { Fraunces, DM_Sans, Tiro_Devanagari_Hindi } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
  fallback: ['Georgia', 'serif'],
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ['latin', 'devanagari'],
  variable: '--font-tiro-devanagari',
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
  fallback: ['serif'],
});
