'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Video,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { BookingDraft } from '@/lib/config/booking';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

const DRAFT_STORAGE_KEY = 'vankal_booking_draft';

function formatFriendlyDateTime(
  dateStr: string,
  slotStart: string,
  lang: 'EN' | 'GU' = 'EN'
): string {
  if (!dateStr || !slotStart) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

  const locale = lang === 'GU' ? 'gu-IN' : 'en-IN';
  const weekday = new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  }).format(dateObj);
  const month = new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Kolkata',
    month: 'short',
  }).format(dateObj);

  const [hStr, mStr] = slotStart.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const time12 = `${h}:${mStr} ${ampm}`;

  return `${weekday}, ${d} ${month} · ${time12}`;
}

export function ReviewClient() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [consentAgreed, setConsentAgreed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSlotTaken, setIsSlotTaken] = useState<boolean>(false);

  // 1. Read draft from sessionStorage inside useEffect; if none, redirect to /book
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!stored) {
        router.replace('/book');
        return;
      }
      const parsed: BookingDraft = JSON.parse(stored);
      if (!parsed.patientName || !parsed.date || !parsed.slotStart || !parsed.patientEmail) {
        router.replace('/book');
        return;
      }
      setDraft(parsed);
    } catch {
      router.replace('/book');
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking || !draft) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center font-mono text-xs text-forest/70">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-forest" />
        <span>Loading booking review...</span>
      </div>
    );
  }

  const friendlyDateTime = formatFriendlyDateTime(draft.date, draft.slotStart, language);

  // 2. Razorpay Popup Checkout Flow
  const handlePayNow = async () => {
    if (!consentAgreed || isSubmitting) return;

    setIsSubmitting(true);
    setPaymentError(null);
    setIsSlotTaken(false);

    try {
      // Step A: Create order and lock slot hold on server
      const createOrderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: draft.patientName,
          patientWhatsapp: draft.patientWhatsapp,
          patientEmail: draft.patientEmail.trim().toLowerCase(),
          patientAge: draft.patientAge,
          patientGender: draft.patientGender,
          primaryComplaint: draft.primaryComplaint,
          reportFileIds: draft.reportFileIds || [],
          date: draft.date,
          slotStart: draft.slotStart,
          slotEnd: draft.slotEnd,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.success) {
        if (orderData.code === 'SLOT_UNAVAILABLE') {
          setIsSlotTaken(true);
          setPaymentError(
            language === 'GU'
              ? 'આ સમય સ્લોટ હમણાં જ અન્ય દર્દી દ્વારા બુક થઈ ગયો છે. કૃપા કરીને અન્ય સમય સ્લોટ પસંદ કરો.'
              : 'This time slot was just taken by another patient. Please choose another time slot.'
          );
        } else {
          setPaymentError(orderData.message || 'Could not initialize payment order.');
        }
        setIsSubmitting(false);
        return;
      }

      // Step B: In Test Mode (when Razorpay live keys are not configured), auto-confirm and redirect
      if (orderData.isTestMode) {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: orderData.bookingId,
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: 'mock_test_signature',
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          sessionStorage.removeItem(DRAFT_STORAGE_KEY);
          router.push(verifyData.redirectUrl);
          return;
        } else {
          setPaymentError(verifyData.message || 'Payment test confirmation failed.');
          setIsSubmitting(false);
          return;
        }
      }

      // Ensure Razorpay checkout script is loaded and ready
      if (typeof window !== 'undefined' && !window.Razorpay) {
        const loaded = await new Promise<boolean>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

        if (!loaded || !window.Razorpay) {
          setPaymentError(
            language === 'GU'
              ? 'ચુકવણી ગેટવે સ્ક્રિપ્ટ લોડ થઈ શકી નથી. કૃપા કરીને થોડી ક્ષણો પછી ફરી પ્રયાસ કરો.'
              : 'Payment gateway script failed to load. Please check your internet connection and try again.'
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Step B: Open Razorpay Checkout Popup
      const options = {
        key: orderData.keyId,
        amount: orderData.amount, // 49900 paise strictly from server
        currency: orderData.currency,
        name: 'VANKAL AYURVEDA',
        description: 'Video Consultation with Dr. Lavesh Bohra',
        order_id: orderData.orderId,
        prefill: {
          name: draft.patientName,
          contact: draft.patientWhatsapp,
          email: draft.patientEmail.trim().toLowerCase(),
        },
        theme: {
          color: '#1F3D2B', // Deep forest palette
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setPaymentError(
              language === 'GU'
                ? 'ચુકવણી વિન્ડો બંધ કરવામાં આવી છે. તમારો ડ્રાફ્ટ સુરક્ષિત છે, તમે ગમે ત્યારે ફરી પ્રયાસ કરી શકો છો.'
                : 'Payment window was closed. Your appointment draft is saved and you can retry.'
            );
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            // Step C: Verify payment signature server-side
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId: orderData.bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Clear draft on successful booking
              sessionStorage.removeItem(DRAFT_STORAGE_KEY);
              router.push(verifyData.redirectUrl);
            } else {
              setPaymentError(
                verifyData.message ||
                  (language === 'GU'
                    ? 'ચુકવણી ચકાસણી નિષ્ફળ થઈ. કૃપા કરીને ક્લિનિક હેલ્પલાઇનનો સંપર્ક કરો.'
                    : 'Payment verification failed. Please contact the clinic if money was deducted.')
              );
              setIsSubmitting(false);
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setPaymentError(
              language === 'GU'
                ? 'સર્વર ચકાસણીમાં ક્ષતિ આવી. જો ફી કપાઈ ગઈ હોય તો ચિંતા કરશો નહીં, સંપર્ક કરો.'
                : 'Payment verification network error. If amount was debited, our desk will confirm your appointment.'
            );
            setIsSubmitting(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzpInstance.on('payment.failed', (resp: any) => {
        setIsSubmitting(false);
        setPaymentError(
          language === 'GU'
            ? `ચુકવણી નિષ્ફળ થઈ: ${resp.error?.description || 'કૃપા કરીને અન્ય વિકલ્પ સાથે ફરી પ્રયાસ કરો.'}`
            : `Payment failed: ${resp.error?.description || 'Please try again or use another payment method.'}`
        );
      });

      rzpInstance.open();
    } catch (err) {
      console.error('Order creation error:', err);
      setPaymentError(
        language === 'GU'
          ? 'ચુકવણી શરૂ કરવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : 'Could not initialize payment. Please check your internet connection and retry.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Load Razorpay script only on this review page */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-36 lg:pb-16 overflow-x-hidden">
        {/* 2-Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-forest/70 uppercase tracking-wider">
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 text-forest hover:text-deep-forest hover:underline transition-colors cursor-pointer"
            >
              <span className="w-5 h-5 rounded-full bg-forest/10 border border-forest/30 text-forest flex items-center justify-center text-[11px] font-mono">
                ✓
              </span>
              <span>{t.booking.step1Title}</span>
            </Link>
            <span className="text-forest/30">·</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-deep-forest">
              <span className="w-5 h-5 rounded-full bg-forest text-paper flex items-center justify-center text-[11px] font-mono">
                2
              </span>
              <span>{t.booking.step2Title}</span>
            </span>
          </div>

          {/* Edit Link back to /book */}
          <Link
            href="/book"
            className="inline-flex items-center gap-1 text-xs font-mono text-forest hover:text-deep-forest hover:underline transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.booking.editLink}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl text-deep-forest font-medium tracking-tight">
            {t.booking.reviewTitle}
          </h1>
          <p className="font-body text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
            {t.booking.reviewSubtitle}
          </p>
        </div>

        {/* Review Cards (Session Summary & Patient Profile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Card 1: Session Summary */}
          <div className="bg-paper border border-forest/15 rounded-[4px] p-5 sm:p-6 shadow-xs space-y-3.5 text-xs font-body">
            <span className="font-mono text-[11px] uppercase tracking-wider text-forest font-semibold block pb-2 border-b border-forest/10">
              {t.booking.sessionSummaryTitle}
            </span>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.serviceLabel}</span>
              <span className="font-medium text-deep-forest">{t.booking.videoConsult}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.attendingVaidyaLabel}</span>
              <span className="font-medium text-deep-forest">{draft.doctorName}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.modeLabel}</span>
              <span className="font-medium text-forest flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-turmeric" />
                <span>{t.booking.modeOnlineVideo}</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.dateSlotLabel}</span>
              <span className="font-mono font-medium text-deep-forest">{friendlyDateTime}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-ink/70 font-medium">{t.booking.feeLabel}</span>
              <span className="font-display font-semibold text-deep-forest text-base">
                ₹499
              </span>
            </div>
          </div>

          {/* Card 2: Patient Profile */}
          <div className="bg-paper border border-forest/15 rounded-[4px] p-5 sm:p-6 shadow-xs space-y-3.5 text-xs font-body">
            <span className="font-mono text-[11px] uppercase tracking-wider text-forest font-semibold block pb-2 border-b border-forest/10">
              {t.booking.patientProfileTitle}
            </span>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.patientNameLabel}</span>
              <span className="font-medium text-deep-forest">{draft.patientName}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.whatsappNumberLabel}</span>
              <span className="font-mono text-deep-forest">{draft.patientWhatsapp}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.emailLabelReview}</span>
              <span className="font-body text-deep-forest">
                {draft.patientEmail}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.ageGenderLabel}</span>
              <span className="text-deep-forest">
                {draft.patientAge} yrs · {draft.patientGender}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-forest/5">
              <span className="text-ink/60">{t.booking.attachedReportsLabel}</span>
              <span className="font-mono text-forest">
                {draft.reportFileIds?.length
                  ? `${draft.reportFileIds.length} file(s) attached`
                  : t.booking.noReportsAttached}
              </span>
            </div>

            <div className="pt-1">
              <span className="text-ink/60 block mb-1">{t.booking.primaryComplaintLabel}:</span>
              <p className="italic text-ink/80 bg-cream/70 p-2.5 rounded-[3px] border border-forest/10 line-clamp-3">
                &quot;{draft.primaryComplaint}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* 4. Neutral Online Payment & Video Notice */}
        <div className="p-4 rounded-[4px] bg-cream border border-forest/15 mb-6 space-y-1.5 text-xs font-body text-ink/80">
          <div className="flex items-center gap-2 font-medium text-deep-forest">
            <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
            <span>{t.booking.onlinePaymentNotice}</span>
          </div>
          <p className="text-[11px] text-ink/65 pl-6">
            {t.booking.videoPlatformNotice}
          </p>
        </div>

        {/* 5. Consent Checkbox (Exact Blueprint Text) */}
        <div className="p-4 sm:p-5 rounded-[4px] bg-paper border border-forest/15 mb-6 shadow-xs">
          <label htmlFor="consentCheckbox" className="flex items-start gap-3 cursor-pointer select-none">
            <input
              id="consentCheckbox"
              type="checkbox"
              checked={consentAgreed}
              onChange={(e) => setConsentAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest focus-visible:ring-2 focus-visible:ring-forest cursor-pointer shrink-0"
            />
            <span className="font-body text-xs text-ink/85 leading-relaxed">
              {t.booking.consentCheckboxText}
            </span>
          </label>
        </div>

        {/* Error or Conflict Alert Banner */}
        {paymentError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-[3px] text-xs font-body text-rose-900 flex items-start justify-between gap-3 shadow-xs"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{paymentError}</p>
                {isSlotTaken && (
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-forest underline font-semibold mt-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Choose another time slot on /book</span>
                  </Link>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPaymentError(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-mono uppercase cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 6. Pay Action (Desktop) */}
        <div className="hidden lg:flex flex-col items-end gap-3 pt-4 border-t border-forest/10">
          <button
            type="button"
            disabled={!consentAgreed || isSubmitting}
            onClick={handlePayNow}
            className="min-h-[48px] px-8 py-3.5 rounded-[3px] bg-turmeric text-deep-forest font-sans text-sm font-semibold hover:bg-turmeric/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{t.booking.paySecurelyBtn}</span>
            )}
          </button>

          <div className="flex items-center gap-3 text-[11px] font-mono text-ink/60">
            <span className="flex items-center gap-1 text-forest">
              <Lock className="w-3 h-3 text-turmeric" />
              <span>{t.booking.paymentsSecuredBy}</span>
            </span>
            <span>·</span>
            <Link href="/terms" className="hover:underline">
              {t.booking.termsLink}
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:underline">
              {t.booking.privacyLink}
            </Link>
            <span>·</span>
            <Link href="/refund-policy" className="hover:underline">
              {t.booking.refundPolicyLink}
            </Link>
          </div>
        </div>

        {/* 7. Mobile Sticky Bottom Pay Area (1024px and below) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-forest/15 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-lg">
          <div className="max-w-md mx-auto space-y-2">
            <button
              type="button"
              disabled={!consentAgreed || isSubmitting}
              onClick={handlePayNow}
              className="w-full min-h-[48px] py-3.5 px-6 rounded-[3px] bg-turmeric text-deep-forest font-sans text-sm font-semibold hover:bg-turmeric/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{t.booking.paySecurelyBtn}</span>
              )}
            </button>

            <div className="flex items-center justify-between text-[10px] font-mono text-ink/60 px-1">
              <span className="flex items-center gap-1 text-forest">
                <Lock className="w-2.5 h-2.5 text-turmeric" />
                <span>{t.booking.paymentsSecuredBy}</span>
              </span>
              <div className="flex items-center gap-2">
                <Link href="/terms" className="hover:underline">
                  {t.booking.termsLink}
                </Link>
                <span>·</span>
                <Link href="/privacy" className="hover:underline">
                  {t.booking.privacyLink}
                </Link>
                <span>·</span>
                <Link href="/refund-policy" className="hover:underline">
                  {t.booking.refundPolicyLink}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
