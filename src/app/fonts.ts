import { Fraunces, DM_Sans, Noto_Serif_Gujarati, Noto_Sans_Gujarati } from 'next/font/google';

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

export const notoSerifGujarati = Noto_Serif_Gujarati({
  subsets: ['gujarati', 'latin'],
  variable: '--font-noto-serif-gujarati',
  display: 'swap',
  weight: ['400', '600', '700'],
  fallback: ['serif'],
});

export const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati', 'latin'],
  variable: '--font-noto-sans-gujarati',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  fallback: ['sans-serif'],
});
