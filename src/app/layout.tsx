import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { fraunces, dmSans, tiroDevanagari } from './fonts';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { PageTransition } from '@/components/layout/PageTransition';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://aarogyamayurveda.com'),
  title: {
    default: 'Aarogyam Ayurveda — Classical Vaidya Chikitsalaya & Panchakarma',
    template: '%s | Aarogyam Ayurveda',
  },
  description:
    'Authentic classical Ayurvedic clinic and residential Panchakarma retreat in Civil Lines, Jaipur. Precision clinical pulse diagnosis (Nadi Pariksha), personalized herbal formulations, and restorative therapies rooted in Charaka Samhita. Hospital Reg: AYUSH-RJ-2018-0482.',
  keywords: [
    'Ayurveda Clinic Jaipur',
    'Panchakarma Center Jaipur',
    'Classical Ayurveda',
    'Nadi Pariksha',
    'Dr Lavesh Bohra',
    'Shirodhara',
    'Kati Basti',
    'Charaka Samhita',
    'Ayurvedic Doctors Civil Lines',
    'AYUSH Registered Chikitsalaya',
  ],
  authors: [{ name: 'Dr. Lavesh Bohra, MD (Kayachikitsa), PhD' }],
  creator: 'Aarogyam Ayurvedic Chikitsalaya',
  publisher: 'Aarogyam Ayurveda',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: 'hi_IN',
    url: 'https://aarogyamayurveda.com',
    siteName: 'Aarogyam Ayurveda Chikitsalaya',
    title: 'Aarogyam Ayurveda — Classical Vaidya Chikitsalaya & Panchakarma',
    description:
      'Precision pulse diagnosis, classical Panchakarma bio-cleansing, and genuine Samhita herbal formulations in Jaipur. Hospital Reg: AYUSH-RJ-2018-0482.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aarogyam Ayurvedic Chikitsalaya & Panchakarma Retreat',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aarogyam Ayurveda — Classical Vaidya Chikitsalaya & Panchakarma',
    description:
      'Authentic classical Ayurvedic pulse diagnosis, residential Panchakarma, and Samhita care in Civil Lines, Jaipur.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${tiroDevanagari.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans selection:bg-sage/30 selection:text-deep-forest relative">
        {/* Subtle Paper Grain Overlay */}
        <div className="paper-grain" aria-hidden="true" />

        {/* Top Scroll Progress Line */}
        <ScrollProgress />

        {/* Global Language Context */}
        <LanguageProvider>
          {/* Smooth Scroll via Lenis & GSAP */}
          <SmoothScrollProvider>
            {/* Global Header inside Suspense */}
            <Suspense fallback={<div className="h-20" />}>
              <Navbar />
            </Suspense>

            {/* Main Content Area with Page Transitions */}
            <main className="flex-1 flex flex-col pt-20">
              <Suspense fallback={null}>
                <PageTransition>{children}</PageTransition>
              </Suspense>
            </main>

            {/* Global Footer */}
            <Footer />

            {/* WhatsApp & Mobile Floating Actions */}
            <FloatingActions />
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
