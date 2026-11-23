'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  LogOut,
  Calendar,
  Clock,
  User,
  MessageSquare,
  FileText,
  ExternalLink,
  Video,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DOCTOR_EARLY_MINUTES, CALL_GRACE_MINUTES } from '@/lib/config/call';

export interface AdminBooking {
  id: string;
  tokenNumber: string;
  serviceName: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  slot: string; // "10:30 AM"
  slotStart: string; // "10:30"
  slotEnd: string; // "10:50"
  patientName: string;
  whatsappNumber: string;
  email?: string;
  age: number;
  gender: string;
  primaryComplaint: string;
  reports: Array<{ id: string; name: string; url: string }>;
  status: 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW';
  isTestBooking?: boolean;
  feeAmount: number;
  feeFormatted: string;
  razorpayPaymentId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  patientJoinedAt?: string | null;
  doctorJoinedAt?: string | null;
  callStartedAt?: string | null;
  callEndedAt?: string | null;
  lastPatientPingAt?: string | null;
  lastDoctorPingAt?: string | null;
}

interface DoctorConsoleClientProps {
  doctorName: string;
}

export function DoctorConsoleClient({ doctorName }: DoctorConsoleClientProps) {
  const router = useRouter();

  // Console State
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [expandedComplaints, setExpandedComplaints] = useState<Record<string, boolean>>({});
  const [nowMs, setNowMs] = useState(Date.now());
  const [istTimeStr, setIstTimeStr] = useState('');
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [testModalData, setTestModalData] = useState<{
    bookingId: string;
    consultUrl: string;
    phoneLast4: string;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // 1. Live IST Clock
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      setNowMs(now);
      const str = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date(now));
      setIstTimeStr(str);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------------------------------------------
  // 2. Fetch Bookings from API
  // ---------------------------------------------------------------------------
  const fetchBookings = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch('/api/admin/bookings');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.warn('Error fetching admin bookings:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  // Initial fetch and 15-second background polling
  useEffect(() => {
    fetchBookings(false);

    const interval = setInterval(() => {
      fetchBookings(true);
    }, 15000);

    // Refresh immediately when window/tab regains focus
    const handleFocus = () => {
      fetchBookings(true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchBookings]);

  // ---------------------------------------------------------------------------
  // 3. Logout Handler
  // ---------------------------------------------------------------------------
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  // Toggle Complaint Expansion
  const toggleComplaint = (id: string) => {
    setExpandedComplaints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Instant Test Call Generator
  const handleCreateTestBooking = async () => {
    setIsCreatingTest(true);
    try {
      const res = await fetch('/api/admin/create-test-booking', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestModalData({
          bookingId: data.bookingId,
          consultUrl: data.consultUrl,
          phoneLast4: data.phoneLast4,
        });
        await fetchBookings(false);
        setActiveTab('today');
      } else {
        alert(data.message || 'Could not create test booking');
      }
    } catch {
      alert('Network error creating test appointment');
    } finally {
      setIsCreatingTest(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 4. Time Window Calculations (Per Row)
  // ---------------------------------------------------------------------------
  const getSlotWindowInfo = (
    dateStr: string,
    slotStart: string,
    slotEnd?: string,
    isTest?: boolean
  ) => {
    if (isTest) {
      return {
        windowStartMs: nowMs - 60000,
        windowEndMs: nowMs + 3600000,
        isEarly: false,
        isEnded: false,
        isActive: true,
        openTimeStr: 'Active Now (Test Mode)',
      };
    }

    const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.trim();
    const [sh, sm] = (slotStart || '10:00').split(':');
    const [eh, em] = (slotEnd || slotStart || '10:20').split(':');

    const slotStartIso = `${cleanDate}T${sh.padStart(2, '0')}:${(sm || '00').padStart(2, '0')}:00+05:30`;
    const slotEndIso = `${cleanDate}T${eh.padStart(2, '0')}:${(em || '20').padStart(2, '0')}:00+05:30`;

    const slotStartMs = new Date(slotStartIso).getTime();
    const slotEndMs = new Date(slotEndIso).getTime();

    const windowStartMs = slotStartMs - DOCTOR_EARLY_MINUTES * 60 * 1000;
    const windowEndMs = slotEndMs + CALL_GRACE_MINUTES * 60 * 1000;

    const isEarly = nowMs < windowStartMs;
    const isEnded = nowMs > windowEndMs;
    const isActive = !isEarly && !isEnded;

    // Time when room opens for doctor
    const openTimeStr = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(windowStartMs));

    return {
      windowStartMs,
      windowEndMs,
      isEarly,
      isEnded,
      isActive,
      openTimeStr,
    };
  };

  // Friendly Date Format: "Sat, 22 Nov · 4:30 PM"
  const formatFriendlyDateTime = (dateStr: string, slotStart: string) => {
    if (!dateStr || !slotStart) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      const weekday = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
      }).format(dateObj);
      const month = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        month: 'short',
      }).format(dateObj);

      const [hStr, mStr] = slotStart.split(':');
      let h = parseInt(hStr, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${weekday}, ${d} ${month} · ${h}:${mStr} ${ampm}`;
    } catch {
      return `${dateStr} · ${slotStart}`;
    }
  };

  // Check if booking was created in the last 24 hours (New Booking Alert)
  const isNewBooking = (createdAtStr?: string) => {
    if (!createdAtStr) return false;
    const createdMs = new Date(createdAtStr).getTime();
    return nowMs - createdMs < 24 * 60 * 60 * 1000;
  };

  // Check if patient is currently waiting
  const isPatientWaiting = (booking: AdminBooking) => {
    if (booking.patientJoinedAt) return true;
    if (booking.lastPatientPingAt) {
      const lastPingMs = new Date(booking.lastPatientPingAt).getTime();
      return nowMs - lastPingMs < 45000; // pinged in last 45s
    }
    return false;
  };

  // ---------------------------------------------------------------------------
  // 5. Categorize Bookings into Tabs (Today, Upcoming, Past)
  // ---------------------------------------------------------------------------
  const todayIstStr = useMemo(() => {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
    }).format(new Date(nowMs)); // YYYY-MM-DD in IST
  }, [nowMs]);

  const { todayList, upcomingList, pastList } = useMemo(() => {
    const today: AdminBooking[] = [];
    const upcoming: AdminBooking[] = [];
    const past: AdminBooking[] = [];

    bookings.forEach((b) => {
      const bDate = b.date.includes('T') ? b.date.split('T')[0] : b.date;

      if (b.status === 'COMPLETED' || b.status === 'NO_SHOW') {
        past.push(b);
      } else if (bDate === todayIstStr) {
        today.push(b);
      } else if (bDate > todayIstStr) {
        upcoming.push(b);
      } else {
        // Date has passed without completion
        past.push(b);
      }
    });

    return { todayList: today, upcomingList: upcoming, pastList: past };
  }, [bookings, todayIstStr]);

  const currentList =
    activeTab === 'all'
      ? bookings
      : activeTab === 'today'
      ? todayList
      : activeTab === 'upcoming'
      ? upcomingList
      : pastList;

  return (
    <div className="min-h-[100dvh] w-full bg-[#fbf9f4] text-deep-forest flex flex-col select-none overflow-x-hidden">
      {/* 1. Header Bar: Calm, Clinical & Functional */}
      <header className="sticky top-0 z-30 w-full bg-paper/95 backdrop-blur-md border-b border-forest/15 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-forest text-sand flex items-center justify-center font-display text-sm font-semibold">
            VA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-base sm:text-lg font-semibold text-deep-forest tracking-tight">
                Doctor Console
              </h1>
              <Badge variant="turmeric" className="text-[10px] py-0 px-2 font-mono">
                EMR Live
              </Badge>
            </div>
            <p className="font-mono text-[11px] text-forest/80">
              {doctorName} · BAMS, SMIAS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Live IST Server Clock */}
          <div className="hidden md:flex items-center gap-1.5 font-mono text-xs text-ink/70 bg-forest/5 px-3 py-1.5 rounded-full border border-forest/10">
            <Clock className="w-3.5 h-3.5 text-forest" />
            <span>{istTimeStr}</span>
          </div>

          {/* Refresh Action */}
          <button
            onClick={() => fetchBookings(true)}
            disabled={isRefreshing}
            aria-label="Refresh Queue"
            className="p-2 rounded-md hover:bg-forest/10 text-forest cursor-pointer transition-colors"
            title="Refresh appointments"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-turmeric' : ''}`}
            />
          </button>

          {/* Instant Test Call Action */}
          <Button
            onClick={handleCreateTestBooking}
            disabled={isCreatingTest}
            variant="secondary"
            className="text-xs py-1.5 px-3 bg-turmeric/20 text-deep-forest hover:bg-turmeric/35 border-turmeric/50 font-mono flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Create an active test appointment right now without Razorpay"
          >
            {isCreatingTest ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-turmeric-dark" />
            )}
            <span>+ Test Call</span>
          </Button>

          {/* Logout Action */}
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="text-xs py-1.5 px-3 bg-sand text-deep-forest hover:bg-terracotta/10 hover:text-terracotta border-forest/20 cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* 2. Main Content & Queue Tabs */}
      <main className="w-full max-w-6xl mx-auto flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Instant Test Call Banner */}
        {testModalData && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Instant Test Consultation Ready (Window Active Now)
              </span>
              <button
                onClick={() => setTestModalData(null)}
                className="text-ink/50 hover:text-deep-forest p-1 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-ink/80 font-body text-xs">
              A confirmed booking for <strong>right now</strong> has been added to your &ldquo;Today&rdquo; queue. Test video calling in two simple steps:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3.5 rounded-lg border border-emerald-200 space-y-2">
                <span className="font-semibold text-deep-forest block text-xs">1. Doctor (This Browser):</span>
                <p className="text-[11px] text-ink/70">
                  Find the appointment card below in the &ldquo;Today&rdquo; tab and click the green <strong>&ldquo;Start Video Call&rdquo;</strong> button.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-emerald-200 space-y-2">
                <span className="font-semibold text-deep-forest block text-xs">2. Patient (Second Window / Phone):</span>
                <p className="text-[11px] text-ink/70">Open the patient consultation link in an <strong>Incognito window</strong> or on your phone:</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={testModalData.consultUrl}
                    className="w-full text-[10px] p-1.5 bg-sand/30 border border-forest/20 rounded select-all font-mono"
                  />
                  <Button
                    onClick={() => window.open(testModalData.consultUrl, '_blank')}
                    variant="secondary"
                    className="text-[10px] py-1 px-2.5 shrink-0 cursor-pointer"
                  >
                    Open Link
                  </Button>
                </div>
                <div className="p-1.5 bg-emerald-100/60 rounded text-[11px] text-emerald-900 font-semibold">
                  Verification Code (Phone Last 4): <span className="font-bold underline">{testModalData.phoneLast4}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-forest/15 pb-2">
          <nav className="flex space-x-2 sm:space-x-3 overflow-x-auto" aria-label="Appointment Filters">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-forest text-sand shadow-sm'
                  : 'text-ink/70 hover:text-deep-forest hover:bg-forest/5'
              }`}
            >
              <span>All</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'all'
                    ? 'bg-sand/20 text-sand'
                    : 'bg-forest/10 text-forest'
                }`}
              >
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'today'
                  ? 'bg-forest text-sand shadow-sm'
                  : 'text-ink/70 hover:text-deep-forest hover:bg-forest/5'
              }`}
            >
              <span>Today</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'today'
                    ? 'bg-sand/20 text-sand'
                    : 'bg-forest/10 text-forest'
                }`}
              >
                {todayList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upcoming'
                  ? 'bg-forest text-sand shadow-sm'
                  : 'text-ink/70 hover:text-deep-forest hover:bg-forest/5'
              }`}
            >
              <span>Upcoming</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'upcoming'
                    ? 'bg-sand/20 text-sand'
                    : 'bg-forest/10 text-forest'
                }`}
              >
                {upcomingList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'past'
                  ? 'bg-forest text-sand shadow-sm'
                  : 'text-ink/70 hover:text-deep-forest hover:bg-forest/5'
              }`}
            >
              <span>Past</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'past'
                    ? 'bg-sand/20 text-sand'
                    : 'bg-forest/10 text-forest'
                }`}
              >
                {pastList.length}
              </span>
            </button>
          </nav>

          <span className="text-[11px] font-mono text-ink/50 hidden sm:block">
            Auto-refreshes every 15s
          </span>
        </div>

        {/* 3. Appointment List / Cards */}
        {isLoading ? (
          <div className="py-20 text-center font-mono text-xs text-forest/70 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-forest" />
            <p>Loading confirmed clinical appointments...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="py-20 text-center bg-paper rounded-xl border border-forest/15 p-8 space-y-3">
            <Calendar className="w-10 h-10 text-forest/40 mx-auto" />
            <h3 className="font-display text-base font-medium text-deep-forest">
              {activeTab === 'all'
                ? 'No consultations booked yet'
                : activeTab === 'today'
                ? 'No consultations scheduled for today'
                : activeTab === 'upcoming'
                ? 'No upcoming consultations booked'
                : 'No past consultation records found'}
            </h3>
            <p className="font-body text-xs text-ink/60 max-w-sm mx-auto">
              {activeTab === 'all'
                ? 'Patient appointments booked through the website appear here automatically.'
                : activeTab === 'today'
                ? upcomingList.length > 0
                  ? `You have ${upcomingList.length} upcoming consultation(s) scheduled for future dates.`
                  : 'Patient bookings for today will appear here as soon as payment is confirmed.'
                : 'Confirmed appointments booked through the clinic portal appear here automatically.'}
            </p>
            {activeTab === 'today' && upcomingList.length > 0 && (
              <div className="pt-2">
                <Button
                  onClick={() => setActiveTab('upcoming')}
                  variant="secondary"
                  className="text-xs py-1.5 px-4 bg-forest/10 hover:bg-forest/20 text-forest font-mono cursor-pointer"
                >
                  View {upcomingList.length} Upcoming Consultation(s) →
                </Button>
              </div>
            )}
            {activeTab !== 'all' && bookings.length > 0 && (
              <div className="pt-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-[11px] font-mono text-forest/70 hover:text-forest underline cursor-pointer"
                >
                  View all ({bookings.length}) consultations
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentList.map((booking) => {
              const windowInfo = getSlotWindowInfo(
                booking.date,
                booking.slotStart,
                booking.slotEnd,
                booking.isTestBooking
              );
              const friendlyDateTime = formatFriendlyDateTime(booking.date, booking.slotStart);
              const isNew = isNewBooking(booking.createdAt);
              const patientWaiting = isPatientWaiting(booking);
              const isExpanded = !!expandedComplaints[booking.id];

              // Clean phone for WhatsApp link (digits only)
              const cleanPhone = (booking.whatsappNumber || '').replace(/\D/g, '');
              const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                `Namaste ${booking.patientName || 'Patient'}, this is Dr. Lavesh Bohra from Vankal Ayurveda regarding your video consultation scheduled for ${friendlyDateTime}.`
              )}`;

              return (
                <article
                  key={booking.id}
                  className="bg-paper border border-forest/20 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Top Bar inside card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-forest/10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-forest shrink-0" />
                      <span className="font-display text-sm sm:text-base font-semibold text-deep-forest">
                        {friendlyDateTime}
                      </span>
                      <span className="font-mono text-xs text-ink/50 hidden sm:inline">
                        ({booking.slotStart} – {booking.slotEnd || '20m'})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* New Booking Alert Badge */}
                      {isNew && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-turmeric/20 text-turmeric-dark font-mono text-[10px] font-semibold border border-turmeric/40 animate-pulse">
                          <Sparkles className="w-3 h-3 text-turmeric" />
                          New
                        </span>
                      )}

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : booking.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {booking.status === 'CONFIRMED'
                          ? 'CONFIRMED'
                          : booking.status === 'COMPLETED'
                          ? 'COMPLETED'
                          : 'NO SHOW'}
                      </span>

                      {/* Patient Waiting Live Status Pill */}
                      {patientWaiting && booking.status === 'CONFIRMED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-sand text-[10px] font-mono font-semibold shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          Patient is waiting
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body: Patient Details & Clinical Complaint */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 text-xs font-mono">
                    {/* Patient Profile */}
                    <div className="md:col-span-4 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-forest" />
                        <span className="font-display text-sm font-semibold text-deep-forest">
                          {booking.patientName}
                        </span>
                      </div>
                      <div className="text-ink/75">
                        {booking.age} Y · {booking.gender}
                      </div>
                      <div className="text-ink/75 truncate">
                        WhatsApp: +91 {(booking.whatsappNumber || '').slice(-10)}
                      </div>
                      <div className="text-ink/50 text-[11px]">
                        Token: <span className="text-deep-forest">{booking.tokenNumber}</span>
                      </div>
                      <div className="text-forest text-[11px] font-semibold">
                        Payment: Paid ₹499
                      </div>
                    </div>

                    {/* Complaint & Medical History */}
                    <div className="md:col-span-8 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-ink/60 uppercase tracking-wider">
                          Primary Health Complaint
                        </span>
                        {booking.primaryComplaint && booking.primaryComplaint.length > 120 && (
                          <button
                            onClick={() => toggleComplaint(booking.id)}
                            className="text-[11px] text-forest hover:text-deep-forest underline cursor-pointer flex items-center gap-0.5"
                          >
                            {isExpanded ? (
                              <>
                                Less <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                Expand <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <p
                        className={`font-body text-xs text-ink/85 bg-sand/30 p-3 rounded-lg border border-forest/10 leading-relaxed ${
                          !isExpanded ? 'line-clamp-2' : ''
                        }`}
                      >
                        {booking.primaryComplaint || 'No clinical complaint provided.'}
                      </p>

                      {/* Medical Reports Links */}
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-ink/60">Reports:</span>
                        {booking.reports && booking.reports.length > 0 ? (
                          booking.reports.map((r, i) => (
                            <a
                              key={r.id || i}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-forest/10 hover:bg-forest/20 text-forest text-[11px] font-medium border border-forest/15 transition-colors"
                            >
                              <FileText className="w-3 h-3 text-forest" />
                              <span className="max-w-[140px] truncate">{r.name}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))
                        ) : (
                          <span className="text-ink/40 text-[11px] italic">None attached</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Bottom Row */}
                  <div className="pt-3 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3">
                    {/* Direct WhatsApp Contact Button */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-mono font-medium border border-emerald-200 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contact on WhatsApp</span>
                    </a>

                    {/* Start Video Call Action */}
                    <div className="flex items-center gap-2">
                      {windowInfo.isActive ? (
                        <Button
                          onClick={() => window.open(`/consult/${booking.id}?role=doctor`, '_blank')}
                          variant="primary"
                          className="text-xs py-2.5 px-5 bg-forest text-sand hover:bg-deep-forest font-semibold cursor-pointer shadow-md flex items-center gap-2"
                        >
                          <Video className="w-4 h-4 text-turmeric" />
                          <span>Start Video Call</span>
                        </Button>
                      ) : (
                        <div className="text-right">
                          <Button
                            disabled
                            variant="secondary"
                            className="text-xs py-2 px-4 opacity-50 cursor-not-allowed bg-forest/5 text-ink/50 border-forest/15"
                            aria-disabled="true"
                          >
                            <Video className="w-3.5 h-3.5 mr-1.5" />
                            <span>Start Video Call</span>
                          </Button>
                          <p className="text-[10px] font-mono text-ink/50 mt-0.5">
                            {windowInfo.isEarly
                              ? `Activates at ${windowInfo.openTimeStr} (15m before slot)`
                              : 'Consultation window ended'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
