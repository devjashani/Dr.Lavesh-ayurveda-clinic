import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { fraunces, dmSans, notoSerifGujarati, notoSansGujarati } from './fonts';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { PageTransition } from '@/components/layout/PageTransition';
import { IntroPreloader } from '@/components/layout/IntroPreloader';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { BookingSheetProvider } from '@/lib/context/BookingSheetContext';
import { BottomSheetBooking } from '@/components/booking/BottomSheetBooking';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://vankalayurveda.com'),
  title: {
    default: 'VANKAL AYURVEDA — Classical Ayurveda & Lifestyle Care',
    template: '%s | VANKAL AYURVEDA',
  },
  description:
    'Individual Ayurvedic consultations and personalized lifestyle care guided by Dr. Lavesh Bohra, BAMS (2026), SMIAS, Gujarat Ayurved University. Grounded in classical Charaka Samhita principles.',
  keywords: [
    'Ayurveda Consultation',
    'Dr Lavesh Bohra',
    'Classical Ayurveda',
    'Prakriti Assessment',
    'Ayurvedic Diet Ahara',
    'Dinacharya',
    'Ritucharya',
    'Charaka Samhita',
    'VANKAL AYURVEDA',
  ],
  authors: [{ name: 'Dr. Lavesh Bohra, BAMS (2026)' }],
  creator: 'VANKAL AYURVEDA',
  publisher: 'VANKAL AYURVEDA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: 'gu_IN',
    url: 'https://vankalayurveda.com',
    siteName: 'VANKAL AYURVEDA',
    title: 'VANKAL AYURVEDA — Classical Ayurveda & Lifestyle Care',
    description:
      'Individual Ayurvedic consultations and personalized lifestyle care guided by Dr. Lavesh Bohra, BAMS (2026), SMIAS, Gujarat Ayurved University.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VANKAL AYURVEDA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VANKAL AYURVEDA — Classical Ayurveda & Lifestyle Care',
    description:
      'Individual Ayurvedic consultations and personalized lifestyle care guided by Dr. Lavesh Bohra, BAMS (2026).',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#14291C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${dmSans.variable} ${notoSerifGujarati.variable} ${notoSansGujarati.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-paper text-ink font-sans selection:bg-sage/30 selection:text-deep-forest relative"
      >
        {/* First-load Session Intro Preloader */}
        <IntroPreloader />

        {/* Subtle Paper Grain Overlay */}
        <div className="paper-grain" aria-hidden="true" />

        {/* Top Scroll Progress Line */}
        <ScrollProgress />

        {/* Global Language Context */}
        <LanguageProvider>
          {/* Global Mobile Booking Bottom Sheet */}
          <BookingSheetProvider>
            {/* Smooth Scroll via Lenis & GSAP */}
            <SmoothScrollProvider>
              {/* Global Header inside Suspense */}
              <Suspense fallback={<div className="h-20" />}>
                <Navbar />
              </Suspense>

              {/* Main Content Area with Page Transitions */}
              <main className="flex-1 flex flex-col pt-14 sm:pt-20 lang-crossfade">
                <Suspense fallback={null}>
                  <PageTransition>{children}</PageTransition>
                </Suspense>
              </main>

              {/* Global Footer */}
              <Footer />

              {/* WhatsApp & Mobile Floating Actions */}
              <FloatingActions />

              {/* Global Mobile Bottom Sheet Booking Form */}
              <BottomSheetBooking />
            </SmoothScrollProvider>
          </BookingSheetProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
