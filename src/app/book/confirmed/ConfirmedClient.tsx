'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  CalendarPlus,
  Printer,
  Share2,
  Video,
  Download,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ConfirmedBookingData {
  id: string;
  tokenNumber: string;
  serviceName: string;
  doctorName: string;
  mode: string;
  date: string;
  slot: string;
  slotStart: string;
  slotEnd: string;
  patientName: string;
  whatsappNumber: string;
  email?: string;
  age: number;
  gender: string;
  feeAmount: number;
  feeFormatted: string;
  status: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paidAt?: string;
  createdAt: string;
}

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

function formatPaymentTimestamp(isoString?: string): string {
  if (!isoString) return 'Confirmed Online';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date) + ' IST';
  } catch {
    return isoString;
  }
}

function VoucherQRCode({ value }: { value: string }) {
  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 p-2 bg-paper rounded-[3px] border border-forest/20 shadow-xs flex flex-col items-center justify-center shrink-0">
      <svg
        viewBox="0 0 25 25"
        className="w-full h-full text-deep-forest"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="3" y="3" width="3" height="3" />
        <rect x="17" y="1" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="19" y="3" width="3" height="3" />
        <rect x="1" y="17" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="3" y="19" width="3" height="3" />
        <rect x="9" y="2" width="2" height="1" />
        <rect x="12" y="2" width="1" height="2" />
        <rect x="14" y="1" width="2" height="1" />
        <rect x="10" y="5" width="1" height="3" />
        <rect x="12" y="6" width="3" height="1" />
        <rect x="9" y="10" width="7" height="1" />
        <rect x="2" y="10" width="3" height="1" />
        <rect x="6" y="12" width="1" height="3" />
        <rect x="20" y="10" width="3" height="1" />
        <rect x="18" y="13" width="2" height="2" />
        <rect x="10" y="13" width="2" height="3" />
        <rect x="14" y="14" width="2" height="2" />
        <rect x="9" y="18" width="2" height="1" />
        <rect x="12" y="17" width="1" height="3" />
        <rect x="10" y="22" width="4" height="1" />
        <rect x="17" y="18" width="2" height="2" />
        <rect x="20" y="19" width="3" height="1" />
        <rect x="18" y="22" width="5" height="1" />
      </svg>
      <span className="font-mono text-[8px] text-forest/70 mt-1 uppercase tracking-tight">
        {value.slice(-6)}
      </span>
    </div>
  );
}

export function ConfirmedClient() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const bookingId = searchParams.get('booking');

  const [booking, setBooking] = useState<ConfirmedBookingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Server time synchronization (offset in ms: serverTime - clientLocalTime)
  const [serverOffsetMs, setServerOffsetMs] = useState<number>(0);
  const [nowMs, setNowMs] = useState<number>(Date.now());

  // Video call state
  const [joiningCall, setJoiningCall] = useState<boolean>(false);
  const [videoLinkError, setVideoLinkError] = useState<string | null>(null);

  // Fetch Booking data and sync Server Time
  const fetchBooking = useCallback(async () => {
    if (!bookingId) {
      setError(
        language === 'GU'
          ? 'કોઈ એપોઇન્ટમેન્ટ સંદર્ભ મળ્યો નથી. કૃપા કરીને નવી એપોઇન્ટમેન્ટ બુક કરો.'
          : 'No appointment reference provided. Please schedule a consultation.'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const data = await res.json();

      if (res.ok && data.success && data.booking) {
        if (data.serverTime) {
          const sTime = new Date(data.serverTime).getTime();
          setServerOffsetMs(sTime - Date.now());
        }
        setBooking(data.booking);
      } else {
        setError(
          data.message ||
            (language === 'GU'
              ? 'એપોઇન્ટમેન્ટ વિગતો લાવવામાં સમસ્યા આવી.'
              : 'Could not load appointment details.')
        );
      }
    } catch (err) {
      console.error('Error fetching confirmed booking:', err);
      setError(
        language === 'GU'
          ? 'સર્વર સાથે સંપર્ક કરવામાં ભૂલ થઈ.'
          : 'Network error retrieving appointment record.'
      );
    } finally {
      setLoading(false);
    }
  }, [bookingId, language]);

  useEffect(() => {
    fetchBooking();

    // Re-check booking and sync server time every 30 seconds
    const interval30s = setInterval(() => {
      fetchBooking();
    }, 30000);

    return () => clearInterval(interval30s);
  }, [fetchBooking]);

  // Local second timer synced to server time
  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now() + serverOffsetMs);
    }, 1000);
    return () => clearInterval(timer);
  }, [serverOffsetMs]);

  // Handle Video Call join click
  const handleJoinVideoCall = async () => {
    if (!booking) return;
    setJoiningCall(true);
    setVideoLinkError(null);

    try {
      const res = await fetch(`/api/bookings/${booking.id}/video-link`);
      const data = await res.json();

      if (res.ok && data.success && data.joinUrl) {
        window.open(data.joinUrl, '_blank', 'noopener,noreferrer');
      } else {
        setVideoLinkError(
          data.message ||
            (language === 'GU'
              ? 'વિડિઓ કૉલ લિંક હજી સક્રિય નથી થઈ.'
              : 'Video call link is not active yet.')
        );
      }
    } catch (err) {
      console.error('Error opening video call:', err);
      setVideoLinkError(
        language === 'GU'
          ? 'વિડિઓ કૉલ શરૂ કરવામાં ક્ષતિ આવી.'
          : 'Network error connecting to video consultation.'
      );
    } finally {
      setJoiningCall(false);
    }
  };

  // Google Calendar URL formatting (IST)
  const getGoogleCalendarUrl = () => {
    if (!booking) return '#';
    const title = encodeURIComponent(
      `Vankal Ayurveda: Video Consultation with ${booking.doctorName}`
    );
    const dateFormatted = booking.date.replace(/-/g, '');
    const [hStr, mStr] = (booking.slotStart || '10:00').split(':');
    const startDateTime = `${dateFormatted}T${hStr.padStart(2, '0')}${mStr.padStart(2, '0')}00`;
    const [ehStr, emStr] = (booking.slotEnd || '10:20').split(':');
    const endDateTime = `${dateFormatted}T${ehStr.padStart(2, '0')}${emStr.padStart(2, '0')}00`;

    const details = encodeURIComponent(
      `Appointment Token: ${booking.tokenNumber}\nBooking ID: ${booking.id}\nPatient: ${booking.patientName}\nDoctor: ${booking.doctorName}\nService: Video Consultation (₹499 Paid)\nMode: Online Video Call\n\nVideo call link activates 10 minutes prior to slot.`
    );
    const location = encodeURIComponent('Online Video Consultation · Vankal Ayurveda');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
  };

  // Download real .ics iCalendar file
  const handleDownloadIcs = () => {
    if (!booking) return;
    try {
      const startUtc = new Date(`${booking.date}T${booking.slotStart}:00+05:30`)
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
      const endUtc = new Date(`${booking.date}T${booking.slotEnd || booking.slotStart}:00+05:30`)
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');

      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Vankal Ayurveda//Video Consultation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:vankal-${booking.id}@vankalayurveda.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
        `DTSTART:${startUtc}`,
        `DTEND:${endUtc}`,
        `SUMMARY:Vankal Ayurveda: Video Consultation with ${booking.doctorName}`,
        `DESCRIPTION:Booking ID: ${booking.id}\\nToken: ${booking.tokenNumber}\\nPatient: ${booking.patientName}\\nService: Video Consultation (INR 499 Paid)\\nVideo link activates 10 minutes before slot.`,
        'LOCATION:Online Video Call · Vankal Ayurveda',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vankal-consultation-${booking.tokenNumber}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ICS generation error:', err);
    }
  };

  // Format WhatsApp Share text (strictly booking ID, date/time and link; no medical complaints)
  const getWhatsAppShareUrl = () => {
    if (!booking) return '#';
    const friendlyTime = formatFriendlyDateTime(booking.date, booking.slotStart, language);
    const link =
      typeof window !== 'undefined'
        ? window.location.href
        : `https://vankalayurveda.com/book/confirmed?booking=${booking.id}`;
    const text = encodeURIComponent(
      `Namaste, my Ayurvedic Video Consultation at Vankal Ayurveda is confirmed!\n\n🏷️ Token: ${booking.tokenNumber}\n🩺 Doctor: ${booking.doctorName}\n📋 Service: Video Consultation\n🗓️ Date: ${friendlyTime}\n💳 Amount Paid: ₹499\n🔗 Booking Receipt: ${link}`
    );
    return `https://wa.me/?text=${text}`;
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-28 text-center font-mono text-xs text-forest/70">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-forest" />
        <span>
          {language === 'GU'
            ? 'કન્ફર્મ થયેલ એપોઇન્ટમેન્ટ વિગતો લોડ થઈ રહી છે...'
            : 'Loading confirmed appointment details...'}
        </span>
      </div>
    );
  }

  // Not confirmed or Error state
  if (error || !booking || booking.status !== 'CONFIRMED') {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-display text-xl text-deep-forest font-medium">
          {booking && booking.status !== 'CONFIRMED'
            ? language === 'GU'
              ? 'એપોઇન્ટમેન્ટ હજુ કન્ફર્મ થયેલ નથી'
              : 'Appointment Not Yet Confirmed'
            : language === 'GU'
            ? 'એપોઇન્ટમેન્ટ રેકોર્ડ મળ્યો નથી'
            : 'Appointment Record Not Found'}
        </h2>
        <p className="font-body text-xs sm:text-sm text-ink/70">
          {booking && booking.status !== 'CONFIRMED'
            ? language === 'GU'
              ? `આ એપોઇન્ટમેન્ટની વર્તમાન સ્થિતિ '${booking.status}' છે. જો તમે ચુકવણી પૂર્ણ કરી હોય, તો કૃપા કરીને થોડી ક્ષણો પ્રતીક્ષા કરો અથવા ક્લિનિક ડેસ્કનો સંપર્ક કરો.`
              : `Current appointment status is '${booking.status}'. If you just finished payment, please wait a moment or reach out to our clinical desk.`
            : error ||
              (language === 'GU'
                ? 'આ એપોઇન્ટમેન્ટ રેકોર્ડ ઉપલબ્ધ નથી. કૃપા કરીને નવી મુલાકાત બુક કરો.'
                : 'We could not locate this appointment. Please schedule a new consultation.')}
        </p>
        <div className="pt-2">
          <Link
            href="/book"
            className="inline-flex items-center text-xs font-mono text-forest hover:text-deep-forest underline underline-offset-4"
          >
            ← {language === 'GU' ? 'નવી એપોઇન્ટમેન્ટ બુક કરો' : 'Schedule a consultation'}
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Slot & Server Timing
  const slotStartMs = new Date(`${booking.date}T${booking.slotStart}:00+05:30`).getTime();
  const slotEndMs = new Date(
    `${booking.date}T${booking.slotEnd || booking.slotStart}:00+05:30`
  ).getTime();
  const activationMs = slotStartMs - 10 * 60 * 1000; // 10 minutes prior to slot

  const isPreActivation = nowMs < activationMs;
  const isWindowActive = nowMs >= activationMs && nowMs <= slotEndMs;
  const isPostSlot = nowMs > slotEndMs;

  // Format Countdown String
  let countdownText = '';
  if (isPreActivation) {
    const diffSec = Math.max(0, Math.floor((activationMs - nowMs) / 1000));
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    if (days > 0) {
      countdownText = `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      countdownText = `${hours}h ${minutes}m ${seconds}s`;
    } else {
      countdownText = `${minutes}m ${seconds}s`;
    }
  }

  const friendlyDateTime = formatFriendlyDateTime(booking.date, booking.slotStart, language);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* 1. "Booking Confirmed" Animated Header (Reduced-motion safe) */}
      <div role="status" aria-live="polite" className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-forest text-sand mx-auto flex items-center justify-center shadow-md motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300">
          <CheckCircle2 className="w-9 h-9 text-turmeric" />
        </div>
        <Badge variant="turmeric" className="mx-auto">
          {language === 'GU' ? 'બુકિંગ કન્ફર્મ થયું · ટોકન પત્રમ્' : 'Booking Confirmed · Official Token'}
        </Badge>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-deep-forest font-medium">
          {language === 'GU'
            ? 'તમારું વિડીયો કન્સલ્ટેશન કન્ફર્મ થયું છે'
            : 'Your Video Consultation is Confirmed'}
        </h1>
        <div className="font-mono text-xs text-forest font-semibold tracking-wider">
          {language === 'GU' ? 'બુકિંગ આઈડી:' : 'Booking ID:'}{' '}
          <span className="text-deep-forest select-all">{booking.tokenNumber}</span>
          <span className="text-ink/40 ml-2 font-normal text-[11px]">({booking.id})</span>
        </div>
      </div>

      {/* 2. Video Call Block (Server-Time Controlled Countdown & Gated Activation) */}
      <div className="bg-forest/5 border-2 border-forest/20 rounded-[6px] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest/15 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-forest text-paper flex items-center justify-center shrink-0">
              <Video className="w-4 h-4 text-turmeric" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg text-deep-forest font-medium">
                {language === 'GU' ? 'વિડીયો કન્સલ્ટેશન વિન્ડો' : 'Video Consultation Window'}
              </h2>
              <span className="font-mono text-[11px] text-forest block">
                {friendlyDateTime} IST
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isWindowActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {language === 'GU' ? 'કન્સલ્ટેશન સક્રિય છે' : 'Session Active Now'}
              </span>
            )}
            {isPreActivation && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-forest/80 bg-forest/10 border border-forest/20">
                <Clock className="w-3 h-3 text-forest" />
                <span suppressHydrationWarning>
                  {language === 'GU' ? 'સક્રિય થવામાં:' : 'Activates in:'} {countdownText}
                </span>
              </span>
            )}
            {isPostSlot && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono text-ink/50 bg-ink/5 border border-ink/15">
                {language === 'GU' ? 'સ્લોટ પૂર્ણ થયો' : 'Slot Concluded'}
              </span>
            )}
          </div>
        </div>

        {/* Video Call Instructions & Gated Join Button */}
        <div className="space-y-3">
          <div className="text-xs font-body text-ink/80 leading-relaxed">
            {isWindowActive ? (
              <p className="text-emerald-900 font-medium">
                {language === 'GU'
                  ? 'ડૉ. લવેશ બોહરા સાથેનો તમારો વિડીયો કૉલ શરૂ થઈ ગયો છે. સલામત સત્રમાં જોડાવા માટે નીચે બટન પર ક્લિક કરો.'
                  : 'Your video consultation room with Dr. Lavesh Bohra is active. Click below to join the secure session.'}
              </p>
            ) : isPostSlot ? (
              <p className="text-ink/60">
                {language === 'GU'
                  ? 'આ પરામર્શ સમય પૂર્ણ થઈ ગયો છે. નવી મુલાકાત માટે મુખ્ય પૃષ્ઠ પર જાઓ.'
                  : 'This scheduled consultation window has ended. If you missed your appointment, please contact the clinic desk.'}
              </p>
            ) : (
              <p>
                {language === 'GU'
                  ? `સુરક્ષા પ્રોટોકોલ અનુસાર વિડીયો લિંક આપના સ્લોટ સમયના ૧૦ મિનિટ પહેલાં (${booking.slot}) સક્રિય થશે.`
                  : `For privacy and clinic schedule adherence, your secure video link activates exactly 10 minutes before your slot (${booking.slot}).`}
              </p>
            )}
          </div>

          {videoLinkError && (
            <div className="p-2.5 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs rounded-[4px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{videoLinkError}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            {isWindowActive ? (
              <Button
                onClick={handleJoinVideoCall}
                disabled={joiningCall}
                variant="primary"
                className="w-full sm:w-auto text-xs py-3 px-6 bg-forest hover:bg-deep-forest text-sand font-medium cursor-pointer"
              >
                {joiningCall ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Video className="w-4 h-4 mr-2 text-turmeric" />
                )}
                {language === 'GU' ? 'હમણાં વિડીયો કૉલમાં જોડાઓ' : 'Join Video Call Now'}
              </Button>
            ) : (
              <div className="space-y-1">
                <Button
                  disabled
                  variant="secondary"
                  className="w-full sm:w-auto text-xs py-3 px-6 opacity-60 cursor-not-allowed bg-forest/10 border-forest/20 text-ink/60"
                  aria-disabled="true"
                >
                  <Lock className="w-3.5 h-3.5 mr-2 text-forest/60" />
                  {language === 'GU' ? 'વિડીયો કૉલમાં જોડાઓ' : 'Join Video Call'}
                </Button>
                <p className="text-[11px] font-mono text-forest/70">
                  {language === 'GU'
                    ? 'લિંક સ્લોટ સમયના ૧૦ મિનિટ પહેલાં સક્રિય થશે'
                    : 'Link activates 10 minutes before your slot'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-forest/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-ink/65">
          <span>
            {language === 'GU' ? 'સહાયતા નંબર:' : 'Helpdesk:'}{' '}
            <a href="tel:+919016432576" className="text-forest underline font-medium">
              +91 9016432576
            </a>
          </span>
          <span className="text-forest/80">
            {language === 'GU' ? 'વૈદ્ય: ડૉ. લવેશ બોહરા' : 'Attending: Dr. Lavesh Bohra (BAMS)'}
          </span>
        </div>
      </div>

      {/* 3. Official Payment Receipt (Called "Payment Receipt", not a tax invoice) */}
      <div
        id="payment-receipt"
        className="bg-paper border-2 border-forest/25 rounded-[6px] p-6 sm:p-8 shadow-sm space-y-6 print:border-black print:shadow-none"
      >
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-forest/15">
          <div>
            <span className="font-display font-medium text-lg sm:text-xl text-deep-forest block">
              VANKAL AYURVEDA
            </span>
            <p className="font-mono text-xs text-ink/60 mt-0.5">
              Dr. Lavesh Bohra · BAMS (2026), SMIAS, Gujarat Ayurved University
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="font-mono text-xs uppercase tracking-wider text-forest font-bold block">
              {language === 'GU' ? 'ચુકવણી રસીદ' : 'Payment Receipt'}
            </span>
            <span className="font-mono text-lg sm:text-xl font-bold text-deep-forest tracking-wider">
              {booking.tokenNumber}
            </span>
          </div>
        </div>

        {/* Receipt Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center border-b border-forest/15 pb-6">
          <div className="sm:col-span-8 space-y-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-forest/70 font-semibold block">
                {language === 'GU' ? 'પરામર્શ સેવા' : 'Service'}
              </span>
              <h3 className="font-display text-lg text-deep-forest font-medium">
                {booking.serviceName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-body">
              <div>
                <span className="font-mono text-[10px] text-ink/50 uppercase block">
                  {language === 'GU' ? 'દર્દીનું નામ' : 'Patient Name'}
                </span>
                <span className="font-medium text-deep-forest">{booking.patientName}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-ink/50 uppercase block">
                  {language === 'GU' ? 'વૈદ્ય' : 'Attending Doctor'}
                </span>
                <span className="font-medium text-deep-forest">{booking.doctorName}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-ink/50 uppercase block">
                  {language === 'GU' ? 'તારીખ અને સમય સ્લોટ' : 'Date & Slot'}
                </span>
                <span className="font-mono font-medium text-forest">{friendlyDateTime}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-ink/50 uppercase block">
                  {language === 'GU' ? 'ચૂકવેલ રકમ' : 'Amount Paid'}
                </span>
                <span className="font-mono font-bold text-forest text-sm">
                  {booking.feeFormatted}
                </span>
              </div>
            </div>

            {/* Verification IDs */}
            <div className="pt-3 border-t border-forest/10 space-y-1 text-[11px] font-mono text-ink/75">
              <div>
                <span className="text-ink/50 uppercase">
                  {language === 'GU' ? 'રેઝરપે પેમેન્ટ આઈડી:' : 'Razorpay Payment ID:'}
                </span>{' '}
                <span className="font-semibold text-deep-forest">
                  {booking.razorpayPaymentId || 'Verified'}
                </span>
              </div>
              <div>
                <span className="text-ink/50 uppercase">
                  {language === 'GU' ? 'ચુકવણી તારીખ/સમય:' : 'Payment Date/Time:'}
                </span>{' '}
                <span>{formatPaymentTimestamp(booking.paidAt || booking.createdAt)}</span>
              </div>
              <div>
                <span className="text-ink/50 uppercase">
                  {language === 'GU' ? 'બુકિંગ આઈડી:' : 'Booking ID:'}
                </span>{' '}
                <span>{booking.id}</span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-4 flex flex-col items-center sm:items-end justify-center">
            <VoucherQRCode value={booking.tokenNumber} />
          </div>
        </div>

        {/* Footer note: Explicitly Payment Receipt, not a tax invoice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-ink/55">
          <span>Official Payment Receipt · Vankal Ayurveda</span>
          <span>Online Clinical Consultation Service</span>
        </div>
      </div>

      {/* 4. Action Buttons: Download Receipt (PDF), Print, Calendar (.ics + Google), WhatsApp Share */}
      <div className="space-y-3 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handlePrint}
            variant="primary"
            className="justify-center text-xs py-3 bg-forest hover:bg-deep-forest cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5" />
            {language === 'GU' ? 'રસીદ ડાઉનલોડ કરો (PDF)' : 'Download Receipt (PDF)'}
          </Button>

          <Button
            onClick={handlePrint}
            variant="secondary"
            className="justify-center text-xs py-3 border-forest/25 hover:border-forest/50 cursor-pointer"
          >
            <Printer className="w-4 h-4 mr-1.5 text-forest" />
            {language === 'GU' ? 'પ્રિન્ટ કરો' : 'Print Receipt'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            href={getGoogleCalendarUrl()}
            variant="secondary"
            external
            className="justify-center text-xs py-3 border-forest/20 hover:border-forest/40"
          >
            <CalendarPlus className="w-4 h-4 mr-1.5 text-forest" />
            {language === 'GU' ? 'Google કેલેન્ડર' : 'Google Calendar'}
          </Button>

          <Button
            onClick={handleDownloadIcs}
            variant="secondary"
            className="justify-center text-xs py-3 border-forest/20 hover:border-forest/40 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 mr-1.5 text-forest" />
            {language === 'GU' ? 'Add to Calendar (.ics)' : 'Add to Calendar (.ics)'}
          </Button>

          <Button
            href={getWhatsAppShareUrl()}
            variant="secondary"
            external
            className="justify-center text-xs py-3 border-forest/20 hover:border-forest/40"
          >
            <Share2 className="w-4 h-4 mr-1.5 text-forest" />
            {language === 'GU' ? 'WhatsApp પર શેર કરો' : 'Share on WhatsApp'}
          </Button>
        </div>
      </div>

      {/* Return to Home / Schedule Another */}
      <div className="text-center pt-2 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-mono text-forest hover:text-deep-forest underline underline-offset-4"
        >
          ← {language === 'GU' ? 'મુખ્ય પૃષ્ઠ પર પાછા જાઓ' : 'Return to Homepage'}
        </Link>
      </div>
    </div>
  );
}
