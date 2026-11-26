'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  LogOut,
  Mail,
  KeyRound,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  CalendarPlus,
  RefreshCw,
  Lock,
  Pill,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { calculateCallWindow } from '@/lib/config/call';
import { downloadPrescriptionPdf } from '@/lib/prescription/pdf';

export interface PatientBookingItem {
  id: string;
  bookingRef: string;
  date: string;
  slot_start: string;
  slot_end: string;
  raw_start: string;
  raw_end: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW';
  amount: number;
  serviceName: string;
  doctorName: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  serverNow: string;
}

/**
 * Formats date and time into a friendly string:
 * "Sat, 22 Nov · 4:30 PM" (IST)
 */
function formatFriendlyDateTime(
  dateStr: string,
  slotStart: string,
  lang: 'EN' | 'GU' = 'EN'
): string {
  if (!dateStr || !slotStart) return '';
  try {
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
  } catch {
    return `${dateStr} · ${slotStart}`;
  }
}

/**
 * Generates and triggers a client-side .ics calendar file download
 */
function downloadIcsCalendarFile({
  bookingRef,
  serviceName,
  doctorName,
  slotStartIso,
  slotEndIso,
  consultUrl,
}: {
  bookingRef: string;
  serviceName: string;
  doctorName: string;
  slotStartIso: string;
  slotEndIso: string;
  consultUrl: string;
}) {
  const formatIcsTime = (iso: string) => {
    return new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startUtc = formatIcsTime(slotStartIso);
  const endUtc = formatIcsTime(slotEndIso);

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vankal Ayurveda//Patient Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:vankal-${bookingRef}-${Date.now()}@vankalayurveda.com`,
    `DTSTAMP:${formatIcsTime(new Date().toISOString())}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:Vankal Ayurveda: ${serviceName} (${bookingRef})`,
    `DESCRIPTION:Ayurvedic Clinical Consultation with ${doctorName}.\\nJoin Video Room: ${consultUrl}\\nBooking Reference: ${bookingRef}`,
    `LOCATION:${consultUrl}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vankal-Ayurveda-${bookingRef}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function MyBookingsClient() {
  const { t, language } = useLanguage();
  const strings = t.myBookings;

  // Session & Data State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [patientEmail, setPatientEmail] = useState<string | null>(null);
  const [bookings, setBookings] = useState<PatientBookingItem[]>([]);
  const [serverNowIso, setServerNowIso] = useState<string>(new Date().toISOString());
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Sign-in Form State (Signed out & Code entry)
  const [authStep, setAuthStep] = useState<'email' | 'otp'>('email');
  const [emailInput, setEmailInput] = useState<string>('');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);
  const [isEmailUnavailable, setIsEmailUnavailable] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  // Six OTP Input Refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 30-Second Countdown timer for Resend code
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Fetch Bookings & Active Session from server (reads cookies safely via API)
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const res = await fetch('/api/my/bookings');
      if (res.status === 401) {
        setPatientEmail(null);
        setBookings([]);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await res.json();
      setPatientEmail(data.email || null);
      setBookings(data.bookings || []);
      if (data.serverNow) {
        setServerNowIso(data.serverNow);
      }
    } catch (err) {
      console.error('Error fetching patient bookings:', err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle Send Code (Step 1)
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError(language === 'GU' ? 'કૃપા કરીને માન્ય ઈમેલ દાખલ કરો.' : 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    setIsEmailUnavailable(false);
    setEmailSuccessMessage(null);

    try {
      const res = await fetch('/api/my/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      if (res.status === 503) {
        setIsEmailUnavailable(true);
        setAuthError(strings.emailUnavailable);
        return;
      }

      // Parity 200 response
      setAuthStep('otp');
      setDigits(['', '', '', '', '', '']);
      setResendCountdown(30); // 30s cooldown as specified
      setEmailSuccessMessage(strings.codeSentSuccess);

      // Focus first digit box after step transition
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } catch {
      setAuthError(language === 'GU' ? 'સર્વર સાથે સંપર્ક થઈ શક્યો નથી.' : 'Unable to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Verify OTP Code (Step 2)
  const handleVerifyOtp = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6 || !/^\d{6}$/.test(codeToVerify)) {
      setAuthError(strings.invalidCodeError);
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/my/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim().toLowerCase(),
          code: codeToVerify,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Generic error with remaining attempts hidden
        setAuthError(strings.invalidCodeError);
        // Clear digits on error and focus first box
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      // Successful verification
      setPatientEmail(data.email || emailInput.trim().toLowerCase());
      setAuthStep('email');
      setDigits(['', '', '', '', '', '']);
      await fetchBookings();
    } catch {
      setAuthError(strings.invalidCodeError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Six-Digit Box Handlers (paste, auto-advance, backspace, auto-submit)
  const handleDigitChange = (index: number, val: string) => {
    // Take only numbers
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const char = cleaned.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setAuthError(null);

    // Auto-advance
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit on 6th digit if all filled
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerifyOtp(fullCode);
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index] === '' && index > 0) {
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);
    setAuthError(null);

    // Focus last filled box
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if all 6 digits pasted
    if (pasted.length === 6) {
      handleVerifyOtp(pasted);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await fetch('/api/my/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setPatientEmail(null);
      setBookings([]);
      setAuthStep('email');
      setEmailInput('');
      setDigits(['', '', '', '', '', '']);
    }
  };

  // ---------------------------------------------------------------------------
  // STATE A & B: SIGNED OUT / CODE ENTRY
  // ---------------------------------------------------------------------------
  if (!patientEmail) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-paper border border-forest/20 rounded-[4px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(20,41,28,0.04)]">
          {/* Header */}
          <div className="text-center mb-7">
            <span className="font-mono text-[11px] tracking-widest uppercase text-turmeric block mb-1.5 font-medium">
              {language === 'GU' ? 'દર્દી પોર્ટલ' : 'PATIENT PORTAL'}
            </span>
            <h1 className="font-serif text-2xl sm:text-[26px] text-deep-forest font-medium">
              {strings.signOutTitle}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink/75 mt-2 leading-relaxed">
              {strings.emailHelper}
            </p>
          </div>

          {/* Screen Reader Error Announcement */}
          {authError && (
            <div role="alert" aria-live="polite" className="sr-only">
              {authError}
            </div>
          )}

          {/* Service Unavailable Alert (503) */}
          {isEmailUnavailable && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-[3px] bg-amber-50/90 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{strings.emailUnavailable}</p>
            </div>
          )}

          {/* Generic Error Alert */}
          {authError && !isEmailUnavailable && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-[3px] bg-clay/10 border border-clay/30 text-clay text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{authError}</span>
            </div>
          )}

          {/* STATE A: Signed Out (Email input) */}
          {authStep === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label
                  htmlFor="portalEmail"
                  className="block font-mono text-xs uppercase text-deep-forest/80 mb-1.5 font-medium"
                >
                  {strings.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="portalEmail"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={strings.emailPlaceholder}
                    className="w-full min-h-[48px] pl-10 pr-3.5 py-2.5 rounded-[3px] bg-cream text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] rounded-[3px] bg-forest text-sand hover:bg-deep-forest font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-turmeric" />
                    <span>{strings.sendingCode}</span>
                  </>
                ) : (
                  <>
                    <span>{strings.sendCode}</span>
                    <ArrowRight className="w-4 h-4 text-turmeric" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STATE B: Code Entry (6 single-digit boxes) */}
          {authStep === 'otp' && (
            <div className="space-y-5">
              {emailSuccessMessage && (
                <div className="p-3 rounded-[3px] bg-forest/5 border border-forest/20 text-forest text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{emailSuccessMessage}</span>
                </div>
              )}

              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest/80 mb-1.5 font-medium text-center">
                  {strings.enterCodeTitle}
                </label>
                <p className="font-sans text-[11px] text-ink/65 text-center mb-3">
                  {strings.codeHelper}
                </p>

                {/* 6 Responsive Code Boxes (No horizontal scroll at 360px) */}
                <div className="flex justify-center gap-2 sm:gap-2.5 max-w-[320px] mx-auto">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      aria-label={`Digit ${idx + 1}`}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      onPaste={handleDigitPaste}
                      className="w-11 sm:w-12 h-12 text-center font-mono text-xl sm:text-2xl font-bold rounded-[3px] bg-cream border border-forest/20 text-deep-forest focus:outline-none focus:ring-1 focus:ring-forest transition-colors"
                    />
                  ))}
                </div>
              </div>

              {isSubmitting && (
                <div className="text-center font-mono text-xs text-forest/70 flex items-center justify-center gap-2 py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-forest" />
                  <span>{strings.verifyingCode}</span>
                </div>
              )}

              {/* Actions: Resend Code & Use Different Email */}
              <div className="pt-2 border-t border-forest/10 flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('email');
                    setDigits(['', '', '', '', '', '']);
                    setAuthError(null);
                  }}
                  className="text-ink/70 hover:text-forest underline transition-colors cursor-pointer"
                >
                  ← {strings.useDifferentEmail}
                </button>

                <button
                  type="button"
                  disabled={resendCountdown > 0 || isSubmitting}
                  onClick={() => handleSendCode()}
                  className="text-forest hover:text-deep-forest font-medium disabled:text-ink/40 transition-colors cursor-pointer"
                >
                  {resendCountdown > 0
                    ? strings.resendIn.replace('{seconds}', String(resendCountdown))
                    : strings.resendCode}
                </button>
              </div>
            </div>
          )}

          {/* Calm Footer Security Note */}
          <div className="mt-7 pt-4 border-t border-forest/10 text-center">
            <p className="font-mono text-[11px] text-ink/50">
              🔒 {language === 'GU' ? 'સુરક્ષિત સત્ર · એકલ-ઉપયોગ ચકાસણી' : 'Secure patient session · One-time verification'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STATE C: SIGNED IN PATIENT DASHBOARD
  // ---------------------------------------------------------------------------
  const serverNowMs = new Date(serverNowIso).getTime();

  // Split bookings into Upcoming and Past using slotEnd and status
  const upcomingBookings = bookings.filter((b) => {
    const endMs = new Date(b.slot_end).getTime();
    return b.status === 'CONFIRMED' && endMs > serverNowMs;
  });

  const pastBookings = bookings.filter((b) => {
    const endMs = new Date(b.slot_end).getTime();
    return b.status !== 'CONFIRMED' || endMs <= serverNowMs;
  });

  const activeList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header Row: Title, Signed in as, Sign out */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-forest/15">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-deep-forest font-medium">
            {strings.headerTitle}
          </h1>
          <p className="font-mono text-xs text-ink/70 mt-1">
            {strings.signedInAs} <strong className="text-deep-forest font-semibold">{patientEmail}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchBookings}
            title="Refresh bookings"
            className="p-2.5 rounded-[3px] border border-forest/20 text-forest hover:bg-forest/5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-[40px] px-3.5 py-2 rounded-[3px] border border-forest/20 bg-paper text-deep-forest hover:bg-clay/10 hover:text-clay text-xs font-mono font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{strings.signOut}</span>
          </button>
        </div>
      </div>

      {/* Tabs: Upcoming & Past */}
      <div className="mt-6 flex border-b border-forest/15 gap-8">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 font-mono text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'upcoming'
              ? 'border-forest text-deep-forest font-semibold'
              : 'border-transparent text-ink/60 hover:text-forest'
          }`}
        >
          <span>{strings.tabUpcoming}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-forest/10 text-forest font-mono">
            {upcomingBookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`pb-3 font-mono text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'past'
              ? 'border-forest text-deep-forest font-semibold'
              : 'border-transparent text-ink/60 hover:text-forest'
          }`}
        >
          <span>{strings.tabPast}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-forest/10 text-forest font-mono">
            {pastBookings.length}
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="bg-paper/70 border border-forest/10 rounded-[4px] p-6 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-forest/10 rounded w-44" />
                  <div className="h-4 bg-forest/10 rounded w-20" />
                </div>
                <div className="h-5 bg-forest/15 rounded w-60" />
                <div className="flex gap-3 pt-2">
                  <div className="h-9 bg-forest/10 rounded w-32" />
                  <div className="h-9 bg-forest/10 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State with Retry */}
        {!isLoading && fetchError && (
          <div className="bg-paper border border-clay/30 rounded-[4px] p-8 text-center">
            <AlertCircle className="w-8 h-8 text-clay mx-auto mb-3" />
            <h2 className="font-serif text-lg text-deep-forest font-medium">
              {strings.errorTitle}
            </h2>
            <p className="font-sans text-xs text-ink/70 mt-1 max-w-sm mx-auto leading-relaxed">
              {strings.errorDesc}
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={fetchBookings}
                className="min-h-[40px] px-4 py-2 rounded-[3px] bg-forest text-sand text-xs font-mono font-medium hover:bg-deep-forest transition-colors cursor-pointer"
              >
                {strings.retry}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !fetchError && activeList.length === 0 && (
          <div className="bg-paper border border-forest/15 rounded-[4px] p-8 sm:p-12 text-center">
            <Calendar className="w-8 h-8 text-forest/40 mx-auto mb-3" />
            <h2 className="font-serif text-lg text-deep-forest font-medium">
              {strings.emptyTitle}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ink/70 mt-1 max-w-sm mx-auto leading-relaxed">
              {strings.emptyDesc}
            </p>
            <div className="mt-5">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-[3px] bg-forest text-sand text-xs font-medium hover:bg-deep-forest transition-colors shadow-xs"
              >
                <span>{strings.bookConsultation} ({strings.fee499})</span>
                <ArrowRight className="w-3.5 h-3.5 text-turmeric" />
              </Link>
            </div>
          </div>
        )}

        {/* Booking Cards List */}
        {!isLoading && !fetchError && activeList.length > 0 && (
          <div className="space-y-4">
            {activeList.map((booking) => {
              const friendlyDate = formatFriendlyDateTime(booking.date, booking.raw_start, language);
              const consultUrl =
                typeof window !== 'undefined'
                  ? `${window.location.origin}/consult/${booking.id}?role=patient`
                  : `/consult/${booking.id}?role=patient`;

              // Calculate 10-minute early entrance window using serverNow from API
              const windowInfo = calculateCallWindow(
                booking.date,
                booking.raw_start,
                booking.raw_end,
                'patient',
                serverNowMs
              );

              // Status Chip Mapping
              const statusLabel =
                booking.status === 'CONFIRMED'
                  ? strings.statusConfirmed
                  : booking.status === 'COMPLETED'
                  ? strings.statusCompleted
                  : strings.statusMissed;

              const statusStyle =
                booking.status === 'CONFIRMED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : booking.status === 'COMPLETED'
                  ? 'bg-forest/10 text-forest border-forest/20'
                  : 'bg-clay/10 text-clay border-clay/20';

              return (
                <div
                  key={booking.id}
                  className="bg-paper border border-forest/20 rounded-[4px] p-5 sm:p-6 shadow-xs hover:border-forest/40 transition-all"
                >
                  {/* Card Header: Friendly Date, Status Chip, Price, Booking Ref */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-forest/10">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-sm sm:text-base font-semibold text-deep-forest">
                          {friendlyDate}
                        </span>
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded-[2px] border font-medium ${statusStyle}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 font-mono text-xs text-ink/75">
                        <span className="font-medium text-forest">{strings.videoConsultation}</span>
                        <span className="text-forest/30">·</span>
                        <span className="font-semibold text-deep-forest">{strings.fee499}</span>
                        <span className="text-forest/30">·</span>
                        <span className="text-ink/60">{booking.bookingRef}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right font-mono text-xs text-ink/60">
                      <span>{booking.doctorName}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Action 1: Join Video Call (Upcoming Only) */}
                      {activeTab === 'upcoming' && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          {windowInfo.isInWindow ? (
                            <Link
                              href={`/consult/${booking.id}?role=patient`}
                              className="min-h-[44px] px-4 py-2.5 rounded-[3px] bg-forest hover:bg-deep-forest text-sand text-xs font-medium transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5 text-turmeric" />
                              <span>{strings.joinVideoCall}</span>
                            </Link>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                disabled
                                className="min-h-[44px] px-4 py-2.5 rounded-[3px] bg-forest/10 border border-forest/20 text-ink/60 text-xs font-mono font-medium opacity-65 cursor-not-allowed inline-flex items-center gap-2"
                              >
                                <Lock className="w-3.5 h-3.5 text-forest/60" />
                                <span>{strings.joinVideoCall}</span>
                              </button>
                              <span className="font-mono text-[10px] text-forest/70">
                                {strings.linkActivatesHelper}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action 2: Receipt View Link */}
                      <Link
                        href={`/book/confirmed?booking=${booking.id}`}
                        className="min-h-[44px] px-3.5 py-2.5 rounded-[3px] border border-forest/20 bg-cream text-deep-forest text-xs font-mono hover:bg-forest/5 transition-colors inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-forest/70" />
                        <span>{strings.receipt}</span>
                      </Link>

                      {/* Action 2b: Download Prescription PDF (for completed or confirmed calls) */}
                      {booking.status === 'COMPLETED' && (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `/api/call/prescription?bookingId=${booking.id}`,
                                { cache: 'no-store' }
                              );
                              const data = await res.json();
                              if (res.ok && data.success && data.prescription) {
                                downloadPrescriptionPdf({
                                  bookingRef: booking.bookingRef,
                                  appointmentDate: booking.date,
                                  slotLabel: `${booking.raw_start} – ${booking.raw_end}`,
                                  patientName: booking.patientName || patientEmail || 'Patient',
                                  patientAge: booking.patientAge,
                                  patientGender: booking.patientGender,
                                  doctorName: booking.doctorName,
                                  medicines: data.prescription.medicines || [],
                                  clinicalAdvice: data.prescription.clinicalAdvice || '',
                                });
                              }
                            } catch {
                              // silent fail
                            }
                          }}
                          className="min-h-[44px] px-3.5 py-2.5 rounded-[3px] border border-turmeric/40 bg-turmeric/15 text-deep-forest text-xs font-mono font-semibold hover:bg-turmeric/25 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pill className="w-3.5 h-3.5 text-turmeric-dark" />
                          <span>{language === 'GU' ? 'પ્રિસ્ક્રિપ્શન' : 'Prescription'}</span>
                        </button>
                      )}
                    </div>

                    {/* Action 3: Add to Calendar (.ics download) */}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          downloadIcsCalendarFile({
                            bookingRef: booking.bookingRef,
                            serviceName: booking.serviceName,
                            doctorName: booking.doctorName,
                            slotStartIso: booking.slot_start,
                            slotEndIso: booking.slot_end,
                            consultUrl,
                          })
                        }
                        className="min-h-[44px] px-3.5 py-2.5 rounded-[3px] border border-forest/20 bg-cream text-deep-forest text-xs font-mono hover:bg-forest/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-forest/70" />
                        <span>{strings.addToCalendar}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Need to change your slot? Contact us. (One line, no cancel/reschedule buttons) */}
            <div className="pt-6 text-center font-mono text-xs text-ink/70">
              <Link
                href="/contact"
                className="hover:text-forest underline underline-offset-4 transition-colors"
              >
                {strings.needChangeSlot}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
