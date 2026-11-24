'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function MagicLinkVerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { t, language } = useLanguage();
  const strings = t.myBookings;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // If token is absent
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 sm:py-28">
        <div className="bg-paper border border-forest/20 rounded-[4px] p-6 sm:p-8 text-center shadow-xs">
          <AlertCircle className="w-10 h-10 text-clay mx-auto mb-3" />
          <h1 className="font-serif text-xl sm:text-2xl text-deep-forest font-medium">
            {strings.expiredLinkTitle}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink/75 mt-2 leading-relaxed">
            {strings.expiredLinkDesc}
          </p>
          <div className="mt-6">
            <Link
              href="/my-bookings"
              className="inline-flex items-center gap-2 min-h-[48px] px-5 py-2.5 rounded-[3px] bg-forest text-sand text-xs font-medium hover:bg-deep-forest transition-colors shadow-xs"
            >
              <span>{strings.sendNewCode}</span>
              <ArrowRight className="w-3.5 h-3.5 text-turmeric" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle Explicit Confirmation
  // The GET page does NOT consume the token (protects against automated email link scanners)
  const handleConfirmSignIn = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/my/auth/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || strings.expiredLinkDesc);
        return;
      }

      // Successful token consumption and session creation
      router.replace('/my-bookings');
    } catch {
      setError(
        language === 'GU'
          ? 'સર્વર સાથે સંપર્ક થઈ શક્યો નથી. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : 'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 sm:py-28">
      <div className="bg-paper border border-forest/20 rounded-[4px] p-6 sm:p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4 text-forest">
          <KeyRound className="w-6 h-6" />
        </div>

        <span className="font-mono text-[11px] uppercase tracking-widest text-turmeric block font-medium mb-1">
          {language === 'GU' ? 'સુરક્ષિત સાઇન-ઇન' : 'PATIENT ACCESS'}
        </span>
        <h1 className="font-serif text-2xl text-deep-forest font-medium">
          {strings.confirmSignInTitle}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink/75 mt-2 leading-relaxed">
          {strings.confirmSignInDesc}
        </p>

        {/* Expired or Used Link Error State with "Send a new code" button */}
        {error ? (
          <div className="mt-6 space-y-4">
            <div
              role="alert"
              className="p-3.5 rounded-[3px] bg-clay/10 border border-clay/30 text-clay text-xs text-left flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>

            <Link
              href="/my-bookings"
              className="w-full min-h-[48px] rounded-[3px] bg-forest text-sand hover:bg-deep-forest font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{strings.sendNewCode}</span>
              <ArrowRight className="w-3.5 h-3.5 text-turmeric" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleConfirmSignIn}
              disabled={isSubmitting}
              className="w-full min-h-[48px] rounded-[3px] bg-forest text-sand hover:bg-deep-forest font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-turmeric" />
                  <span>{strings.confirmingBtn}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-turmeric" />
                  <span>{strings.confirmSignInBtn}</span>
                </>
              )}
            </button>

            <Link
              href="/my-bookings"
              className="block text-center font-mono text-xs text-ink/60 hover:text-forest transition-colors pt-2"
            >
              {strings.useDifferentEmail}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

