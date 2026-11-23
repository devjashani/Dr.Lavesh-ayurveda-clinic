'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { RotatingSeal } from '@/components/ui/RotatingSeal';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { language, t } = useLanguage();

  if (pathname?.startsWith('/consult') || pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer
      suppressHydrationWarning
      className="relative bg-deep-forest text-cream pt-16 sm:pt-20 pb-12 overflow-hidden border-t border-forest/40 content-auto"
    >
      {/* Delicate ambient botanical background motif */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sage/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14">
          {/* Column 1: Brand + Mission (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Logo variant="light" />
              {/* 5. Circular rotating seal (60s/turn, tied to scroll on mobile, paused offscreen) */}
              <RotatingSeal size={86} className="shrink-0 -mt-2" />
            </div>
            <p className="text-paper/75 text-sm leading-relaxed max-w-sm pt-2 font-sans">
              {t.footer.mission}
            </p>

            <div className="pt-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-sage block mb-1">
                {t.footer.clinicalCreed}
              </span>
              <p className="font-serif italic text-cream/90 text-sm">
                &ldquo;{t.footer.creedSanskrit}&rdquo;
              </p>
              <p className="text-[11px] text-paper/60 mt-0.5">
                {t.footer.creedMeaning}
              </p>
            </div>
          </div>

          {/* Column 2: Therapies (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h3 className="text-xs uppercase font-semibold tracking-widest text-turmeric">
              {t.footer.therapies}
            </h3>
            <ul className="space-y-2 text-sm text-paper/80">
              <li>
                <Link href="/treatments/panchakarma" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {language === 'GU' ? 'પંચકર્મ શોધન સારવાર' : 'Panchakarma Detoxification'}
                </Link>
              </li>
              <li>
                <Link href="/treatments/shirodhara" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {language === 'GU' ? 'શિરોધારા અને મેધ્ય કર્મ' : 'Shirodhara & Medhya Karma'}
                </Link>
              </li>
              <li>
                <Link href="/treatments/abhyanga" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {language === 'GU' ? 'અભ્યંગ અને સ્વેદન ઉપચાર' : 'Abhyanga & Swedana Oleation'}
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {language === 'GU' ? 'જાનુ અને કટિ બસ્તિ (સાંધા અને કમર)' : 'Janu & Kati Basti (Spine & Joints)'}
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {language === 'GU' ? 'નસ્ય અને શાલક્ય તંત્ર' : 'Nasya & Shalakya Tantra (ENT)'}
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {language === 'GU' ? 'રસાયન અને રોગપ્રતિકારક શક્તિ' : 'Rasayana & Immune Rehabilitation'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links (col-span-2) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <h3 className="text-xs uppercase font-semibold tracking-widest text-turmeric">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-sm text-paper/80">
              <li>
                <Link href="/about" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {t.nav.doctors}
                </Link>
              </li>
              <li>
                <Link href="/dosha-quiz" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {t.nav.doshaQuiz}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {language === 'GU' ? 'પ્રશ્નોત્તરી (FAQ)' : 'Patient FAQs'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Clinic Info & Hours (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h3 className="text-xs uppercase font-semibold tracking-widest text-turmeric">
              {t.footer.clinicInfo}
            </h3>
            <div className="text-sm text-paper/80 space-y-2.5">
              <div>
                <p className="text-cream font-medium">
                  {language === 'GU' ? 'પરામર્શ અને સંપર્ક' : 'Consultations & Care'}
                </p>
                <p className="text-xs text-paper/70 leading-relaxed mt-0.5">
                  {t.footer.address}
                </p>
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-sage block">
                  {t.footer.hoursTitle}
                </span>
                <p className="text-xs text-paper/80 mt-0.5">
                  {t.footer.hoursMonSat}<br />
                  {t.footer.hoursSun}
                </p>
              </div>

              <div className="pt-1 text-xs space-y-1">
                <p>
                  <span className="text-sage">{language === 'GU' ? 'ફોન: ' : 'Phone: '}</span>
                  <a
                    href="tel:+919016432576"
                    className="font-mono text-paper/80 hover:text-turmeric transition-colors"
                  >
                    +91 9016432576
                  </a>
                </p>
                <p>
                  <span className="text-sage">Email: </span>
                  <span className="font-mono text-paper/80">{t.footer.email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter & Socials Banner */}
        <div className="py-8 border-y border-forest/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="font-display text-lg text-cream font-normal">
              {t.footer.newsletterTitle}
            </h3>
            <p className="text-xs text-paper/70 mt-1 leading-relaxed">
              {language === 'GU'
                ? 'શાસ્ત્રીય આહાર માર્ગદર્શિકા, ઋતુચર્યા અને આરોગ્યપ્રદ જ્ઞાન. કોઈ સ્પેમ નહીં.'
                : 'Curated classical dietary guides, seasonal detox reminders, and herb monographs from our chief physicians. No spam.'}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.newsletterPlaceholder}
                className="w-full sm:w-72 bg-forest/30 border border-forest/60 text-cream placeholder:text-cream/40 text-xs px-3.5 py-2.5 rounded-[4px] min-h-[44px] focus:outline-none focus:border-turmeric focus:ring-1 focus:ring-turmeric/40 transition-colors"
                aria-label="Email subscription"
              />
            </div>
            <button
              type="submit"
              className="bg-turmeric text-deep-forest text-xs font-semibold px-4 py-2.5 rounded-[4px] hover:bg-[#C98A20] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 min-h-[44px]"
            >
              {isSubscribed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'GU' ? 'સબ્સ્ક્રિપ્શન સફળ થયું' : 'Subscribed'}</span>
                </>
              ) : (
                <>
                  <span>{t.footer.newsletterBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* AYUSH Registration line & Legal */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-paper/60 gap-4">
          <p className="font-mono text-[11px] tracking-wide">
            {t.footer.regLine}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
              {language === 'GU' ? 'ગોપનીયતા નીતિ' : 'Privacy Policy'}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
              {language === 'GU' ? 'નિયમો અને શરતો' : 'Terms of Care'}
            </Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-cream transition-colors min-h-[36px] inline-flex items-center">
              {language === 'GU' ? 'તબીબી અસ્વીકરણ' : 'Medical Disclaimer'}
            </Link>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="pb-8 text-[11px] text-paper/50 leading-relaxed max-w-4xl">
          <span className="font-medium text-paper/70">
            {language === 'GU' ? 'તબીબી અસ્વીકરણ: ' : 'Medical Disclaimer: '}
          </span>
          {t.footer.disclaimer}
        </div>

        {/* Botanical flourish */}
        <BotanicalDivider variant="lotus" tone="paper" className="opacity-30 my-0 py-0" />

        {/* Big Faded Wordmark */}
        <div className="pt-6 text-center select-none pointer-events-none">
          <span className="font-display text-[6.4vw] sm:text-[7.5vw] lg:text-[7.5rem] tracking-[0.06em] sm:tracking-[0.1em] lg:tracking-[0.12em] font-semibold text-cream/[0.04] leading-none uppercase block whitespace-nowrap overflow-hidden">
            VANKAL AYURVEDA
          </span>
        </div>
      </div>
    </footer>
  );
}
