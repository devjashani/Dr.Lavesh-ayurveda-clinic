'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Video,
  Building,
  Upload,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  FileText,
  Loader2,
  Calendar as CalendarIcon,
  User,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { BOOKING_CONFIG, BookingDraft } from '@/lib/config/booking';
import { CustomBookingCalendar } from '@/components/booking/CustomBookingCalendar';
import { SlotPicker } from '@/components/booking/SlotPicker';
import { DayScheduleResponse, DaySlotResponse } from '@/app/api/slots/route';

// Schema for Patient Details Validation
const patientDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(60, 'Full name cannot exceed 60 characters'),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6–9'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  age: z
    .number({ message: 'Please enter a valid age' })
    .int('Age must be a whole number')
    .min(1, 'Age must be between 1 and 120')
    .max(120, 'Age must be between 1 and 120'),
  gender: z.enum(['Female', 'Male', 'Other'], {
    message: 'Please select a gender',
  }),
  primaryComplaint: z
    .string()
    .trim()
    .min(10, 'Please describe your primary complaint (at least 10 characters)')
    .max(600, 'Primary complaint cannot exceed 600 characters'),
});

type PatientFormData = z.infer<typeof patientDetailsSchema>;

export interface UploadedReportItem {
  id: string; // Cloudinary HTTPS URL (or fallback storage path)
  publicId?: string;
  resourceType?: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export type { BookingDraft };

const DRAFT_STORAGE_KEY = 'vankal_booking_draft';

/**
 * Formats date and time into a friendly string:
 * "Sat, 22 Nov · 4:30 PM"
 */
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

  // Convert "HH:mm" to 12h
  const [hStr, mStr] = slotStart.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const time12 = `${h}:${mStr} ${ampm}`;

  return `${weekday}, ${d} ${month} · ${time12}`;
}

export function BookClient() {
  const router = useRouter();
  const { t, language } = useLanguage();

  // Mode state (Video is selected by default; In-Person is disabled)
  const selectedMode = 'online';

  // Schedule state from GET /api/slots
  const [scheduleDays, setScheduleDays] = useState<DayScheduleResponse[]>([]);
  const [serverNow, setServerNow] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(true);
  const [slotNotice, setSlotNotice] = useState<string | null>(null);

  // Selected date & slot
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Report files state
  const [uploadedReports, setUploadedReports] = useState<UploadedReportItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // React Hook Form for Patient Details
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientDetailsSchema),
    mode: 'onChange',
  });

  const complaintValue = watch('primaryComplaint') || '';

  // 1. Fetch live slots from API
  const fetchSlots = useCallback(async () => {
    try {
      const res = await fetch('/api/slots', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch slots');
      const data = await res.json();
      if (data.success && data.days) {
        setScheduleDays(data.days);
        if (data.serverNow) setServerNow(data.serverNow);
      }
    } catch (err) {
      console.warn('Slot fetch error:', err);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  // 2. Initial mount: load saved draft if present, fetch slots, setup interval & visibility listener
  useEffect(() => {
    // Restore saved draft only after mount to prevent hydration mismatch
    try {
      const saved = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed: Partial<BookingDraft> = JSON.parse(saved);
        if (parsed.patientName) setValue('fullName', parsed.patientName, { shouldValidate: true });
        if (parsed.patientWhatsapp) {
          const rawPhone = parsed.patientWhatsapp.replace(/^\+91/, '');
          setValue('whatsappNumber', rawPhone, { shouldValidate: true });
        }
        if (parsed.patientEmail) setValue('email', parsed.patientEmail, { shouldValidate: true });
        if (parsed.patientAge) setValue('age', parsed.patientAge, { shouldValidate: true });
        if (parsed.patientGender) setValue('gender', parsed.patientGender, { shouldValidate: true });
        if (parsed.primaryComplaint) setValue('primaryComplaint', parsed.primaryComplaint, { shouldValidate: true });
        if (parsed.date) setSelectedDate(parsed.date);
        if (parsed.slotStart) setSelectedSlot(parsed.slotStart);
        if (parsed.reportFileIds && parsed.reportFileNames) {
          const restored: UploadedReportItem[] = parsed.reportFileIds.map((id, idx) => ({
            id,
            name: parsed.reportFileNames?.[idx] || `Report-${idx + 1}`,
            size: 0,
            progress: 100,
            status: 'complete',
          }));
          setUploadedReports(restored);
        }
      }
    } catch (e) {
      console.warn('Could not read draft from sessionStorage:', e);
    }

    fetchSlots();

    // Refresh every 60 seconds
    const interval = setInterval(fetchSlots, 60000);

    // Refresh on tab focus and visibilitychange
    const handleFocus = () => fetchSlots();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchSlots();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchSlots, setValue]);

  // 3. Keep slot selection synced with latest schedule
  useEffect(() => {
    if (!scheduleDays.length) return;

    // Check if the currently selected slot became unavailable
    if (selectedDate && selectedSlot) {
      const day = scheduleDays.find((d) => d.date === selectedDate);
      const slot = day?.slots.find((s) => s.start === selectedSlot);
      if (!slot || slot.status !== 'available') {
        setSelectedSlot('');
        setSlotNotice(
          t.booking.slotUnavailableGentle ||
            'The selected time slot is no longer available. Please choose another time.'
        );
      }
    }

    // Auto-select the first date that has an available slot if not selected
    if (!selectedDate) {
      const firstOpenDay = scheduleDays.find(
        (d) => d.isOpen && d.slots.some((s) => s.status === 'available')
      );
      if (firstOpenDay) {
        setSelectedDate(firstOpenDay.date);
      }
    }
  }, [scheduleDays, selectedDate, selectedSlot, t.booking.slotUnavailableGentle]);

  // Available dates for calendar (days where isOpen is true)
  const availableDates = useMemo(() => {
    return scheduleDays.filter((d) => d.isOpen).map((d) => d.date);
  }, [scheduleDays]);

  const disabledDates = useMemo(() => {
    return scheduleDays.filter((d) => !d.isOpen).map((d) => d.date);
  }, [scheduleDays]);

  const serverToday = useMemo(() => {
    if (!serverNow) return undefined;
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(serverNow));
  }, [serverNow]);

  const serverMaxDate = useMemo(() => {
    if (!scheduleDays.length) return undefined;
    return scheduleDays[scheduleDays.length - 1].date;
  }, [scheduleDays]);

  // Current day's slots
  const currentDaySlots: DaySlotResponse[] = useMemo(() => {
    if (!selectedDate || !scheduleDays.length) return [];
    const day = scheduleDays.find((d) => d.date === selectedDate);
    return day?.slots || [];
  }, [selectedDate, scheduleDays]);

  // File Upload to Cloudinary (via server /api/uploads/cloudinary)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    if (uploadedReports.length + newFiles.length > 3) {
      setUploadError('Maximum 3 files allowed.');
      return;
    }

    setUploadError(null);

    for (const file of newFiles) {
      // 4MB limit = 4 * 1024 * 1024 bytes
      if (file.size > 4 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds 4MB limit.`);
        continue;
      }

      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError(`File "${file.name}" is not a valid PDF or image.`);
        continue;
      }

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newReport: UploadedReportItem = {
        id: tempId,
        name: file.name,
        size: file.size,
        progress: 25,
        status: 'uploading',
      };

      setUploadedReports((prev) => [...prev, newReport]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/uploads/cloudinary', {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json().catch(() => ({}));

        if (!uploadRes.ok || !uploadJson.success || !uploadJson.url) {
          const errMessage = uploadJson.message || 'Upload failed. Please try again.';
          setUploadError(errMessage);
          setUploadedReports((prev) => prev.filter((r) => r.id !== tempId));
        } else {
          setUploadedReports((prev) =>
            prev.map((r) =>
              r.id === tempId
                ? {
                    ...r,
                    id: uploadJson.url,
                    publicId: uploadJson.publicId || undefined,
                    resourceType: uploadJson.resourceType || undefined,
                    status: 'complete',
                    progress: 100,
                  }
                : r
            )
          );
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setUploadError(message);
        setUploadedReports((prev) => prev.filter((r) => r.id !== tempId));
      }
    }

    e.target.value = '';
  };

  const handleRemoveReport = async (reportId: string) => {
    const target = uploadedReports.find((r) => r.id === reportId);
    setUploadedReports((prev) => prev.filter((r) => r.id !== reportId));
    try {
      if (!reportId.startsWith('temp-')) {
        await fetch('/api/uploads/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicId: target?.publicId || reportId,
            resourceType: target?.resourceType,
          }),
        });
      }
    } catch {
      // Ignore cleanup error
    }
  };

  // Form Submission -> Save Draft & Navigate to /book/review
  const onSubmit = (formData: PatientFormData) => {
    if (!selectedDate || !selectedSlot) return;

    const currentSlotObj = currentDaySlots.find((s) => s.start === selectedSlot);
    const slotEnd = currentSlotObj?.end || '';
    const slotLabel = currentSlotObj?.label || `${selectedSlot} – ${slotEnd}`;

    const draft: BookingDraft = {
      serviceId: BOOKING_CONFIG.service.id,
      serviceName: BOOKING_CONFIG.service.name,
      fee: BOOKING_CONFIG.service.feeInr,
      feePaise: BOOKING_CONFIG.service.feePaise,
      doctorId: BOOKING_CONFIG.doctorId,
      doctorName: BOOKING_CONFIG.doctorName,
      mode: 'online',
      date: selectedDate,
      slotStart: selectedSlot,
      slotEnd,
      slotLabel,
      patientName: formData.fullName,
      patientWhatsapp: `+91${formData.whatsappNumber}`,
      patientEmail: formData.email.trim().toLowerCase(),
      patientAge: formData.age,
      patientGender: formData.gender,
      primaryComplaint: formData.primaryComplaint,
      reportFileIds: uploadedReports.filter((r) => r.status === 'complete').map((r) => r.id),
      reportFileNames: uploadedReports.filter((r) => r.status === 'complete').map((r) => r.name),
      createdAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('Failed saving draft to sessionStorage:', e);
    }

    router.push('/book/review');
  };

  const isContinueEnabled = isValid && Boolean(selectedDate) && Boolean(selectedSlot) && selectedMode === 'online';

  const friendlySummary = formatFriendlyDateTime(selectedDate, selectedSlot, language);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-36 lg:pb-16 overflow-x-hidden">
      {/* Page Header Row: 2-Step Indicator (Left) & My Bookings Outline Pill Button (Right) */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-2 font-mono text-xs text-forest/70 uppercase tracking-wider">
          <span className="inline-flex items-center gap-1.5 font-semibold text-deep-forest">
            <span className="w-5 h-5 rounded-full bg-forest text-paper flex items-center justify-center text-[11px] font-mono">
              1
            </span>
            {t.booking.step1Title}
          </span>
          <span className="text-forest/30">·</span>
          <span className="inline-flex items-center gap-1.5 text-ink/40">
            <span className="w-5 h-5 rounded-full border border-forest/20 text-ink/50 flex items-center justify-center text-[11px] font-mono">
              2
            </span>
            {t.booking.step2Title}
          </span>
        </div>

        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-forest/30 text-forest hover:bg-forest hover:text-sand text-xs font-mono transition-colors shrink-0"
        >
          <User className="w-3.5 h-3.5 text-forest" />
          <span className="hidden xs:inline sm:inline">{t.myBookings?.navLink || 'My Bookings'}</span>
          <span className="xs:hidden sm:hidden">{language === 'GU' ? 'બુકિંગ્સ' : 'Bookings'}</span>
        </Link>
      </div>

      {/* Main 2-Column Desktop / Single Column Mobile Layout */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN (~56%): Consultation Mode & Patient Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 1. Consultation Mode Card */}
            <div className="bg-paper border border-forest/15 rounded-[4px] p-5 sm:p-7 shadow-xs">
              <h2 className="font-display text-lg text-deep-forest font-medium mb-4 flex items-center gap-2">
                <Video className="w-4 h-4 text-forest" />
                <span>{t.booking.modeTitle}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Active Video Consultation Card */}
                <div
                  className="p-4 sm:p-5 rounded-[3px] border-2 border-forest bg-cream/70 text-deep-forest shadow-xs relative flex flex-col justify-between select-none"
                  role="radio"
                  aria-checked="true"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 font-display text-base font-medium text-deep-forest">
                      <Video className="w-4 h-4 text-turmeric" />
                      <span>{t.booking.videoConsult}</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-forest shrink-0" />
                  </div>

                  <p className="font-body text-xs text-ink/75 leading-relaxed mb-4">
                    {t.booking.videoConsultDesc}
                  </p>

                  <div className="pt-2 border-t border-forest/10 flex items-center justify-between">
                    <span className="font-mono text-xs text-forest/70 uppercase">
                      {t.booking.consultFee}
                    </span>
                    <span className="font-display text-lg font-semibold text-deep-forest">
                      {t.booking.fee499}
                    </span>
                  </div>
                </div>

                {/* Disabled In-Person Consultation Card */}
                <div
                  className="p-4 sm:p-5 rounded-[3px] border border-forest/10 bg-cream/30 text-ink/40 opacity-55 cursor-not-allowed select-none flex flex-col justify-between"
                  aria-disabled="true"
                  tabIndex={-1}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 font-display text-base font-medium">
                      <Building className="w-4 h-4" />
                      <span>{t.booking.inPersonConsult}</span>
                    </div>
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-clay/10 text-clay border border-clay/20 font-semibold tracking-wider">
                      {t.booking.currentlyUnavailable}
                    </span>
                  </div>

                  <p className="font-body text-xs text-ink/50 leading-relaxed mb-4">
                    In-clinic OPD appointments are temporarily unavailable.
                  </p>

                  <div className="pt-2 border-t border-forest/5 flex items-center justify-between">
                    <span className="font-mono text-xs text-ink/40 uppercase">Mode</span>
                    <span className="font-mono text-xs text-ink/40">In-Clinic</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Patient Details Card */}
            <div className="bg-paper border border-forest/15 rounded-[4px] p-5 sm:p-7 shadow-xs space-y-5">
              <h2 className="font-display text-lg text-deep-forest font-medium border-b border-forest/10 pb-3">
                {t.booking.patientDetailsTitle}
              </h2>

              {/* Full Name */}
              <div>
                <label htmlFor="patientFullName" className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  {t.booking.fullNameLabel} *
                </label>
                <input
                  id="patientFullName"
                  type="text"
                  placeholder={t.booking.fullNamePlaceholder}
                  {...register('fullName')}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-[3px] bg-cream text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest focus-visible:ring-2 focus-visible:ring-forest"
                />
                {errors.fullName && (
                  <p role="alert" aria-live="polite" className="font-body text-xs text-clay mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* WhatsApp Number with +91 Prefix */}
              <div>
                <label htmlFor="patientWhatsapp" className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  {t.booking.whatsappLabel} *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 min-h-[48px] rounded-l-[3px] border border-r-0 border-forest/15 bg-forest/5 text-deep-forest font-mono text-sm font-semibold select-none">
                    +91
                  </span>
                  <input
                    id="patientWhatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder={t.booking.whatsappPlaceholder}
                    {...register('whatsappNumber')}
                    className="flex-1 min-h-[48px] px-3.5 py-2.5 rounded-r-[3px] bg-cream text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest focus-visible:ring-2 focus-visible:ring-forest"
                  />
                </div>
                <p className="font-mono text-[11px] text-ink/60 mt-1">
                  {t.booking.whatsappHelper}
                </p>
                {errors.whatsappNumber && (
                  <p role="alert" aria-live="polite" className="font-body text-xs text-clay mt-1">{errors.whatsappNumber.message}</p>
                )}
              </div>

              {/* Email Address (Optional) */}
              <div>
                <label htmlFor="patientEmail" className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  {t.booking.emailLabel}
                </label>
                <input
                  id="patientEmail"
                  type="email"
                  inputMode="email"
                  placeholder={t.booking.emailPlaceholder}
                  {...register('email')}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-[3px] bg-cream text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest focus-visible:ring-2 focus-visible:ring-forest"
                />
                {errors.email && (
                  <p role="alert" aria-live="polite" className="font-body text-xs text-clay mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Age & Gender (Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientAge" className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                    {t.booking.ageShortLabel} (1–120) *
                  </label>
                  <input
                    id="patientAge"
                    type="number"
                    min="1"
                    max="120"
                    placeholder={t.booking.agePlaceholder}
                    {...register('age', { valueAsNumber: true })}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-[3px] bg-cream text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest focus-visible:ring-2 focus-visible:ring-forest"
                  />
                  {errors.age && (
                    <p role="alert" aria-live="polite" className="font-body text-xs text-clay mt-1">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="patientGender" className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                    {t.booking.genderLabel} *
                  </label>
                  <select
                    id="patientGender"
                    defaultValue=""
                    {...register('gender')}
                    className="w-full min-h-[48px] px-3.5 py-2.5 rounded-[3px] bg-cream text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest focus-visible:ring-2 focus-visible:ring-forest cursor-pointer"
                  >
                    <option value="" disabled>
                      {t.booking.genderSelectPlaceholder}
                    </option>
                    <option value="Female">{t.booking.female}</option>
                    <option value="Male">{t.booking.male}</option>
                    <option value="Other">{t.booking.other}</option>
                  </select>
                  {errors.gender && (
                    <p role="alert" aria-live="polite" className="font-body text-xs text-clay mt-1">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              {/* Primary Complaint */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="primaryComplaint" className="block font-mono text-xs uppercase text-deep-forest/80 font-medium">
                    {t.booking.complaintLabel} *
                  </label>
                  <span className="font-mono text-[10px] text-ink/50">
                    {complaintValue.length}/600
                  </span>
                </div>
                <textarea
                  id="primaryComplaint"
                  rows={4}
                  maxLength={600}
                  placeholder={t.booking.complaintPlaceholder}
                  {...register('primaryComplaint')}
                  className="w-full px-3.5 py-3 rounded-[3px] bg-cream text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest focus-visible:ring-2 focus-visible:ring-forest min-h-[100px]"
                />
                {errors.primaryComplaint && (
                  <p role="alert" aria-live="polite" className="font-body text-xs text-clay mt-1">
                    {errors.primaryComplaint.message}
                  </p>
                )}
              </div>

              {/* Reports Upload (Optional) */}
              <div className="pt-2 border-t border-forest/10">
                <label className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  {t.booking.reportsLabel}
                </label>
                <p className="font-body text-xs text-ink/65 mb-3">
                  {t.booking.reportsDesc}
                </p>

                {/* Upload Picker Button */}
                {uploadedReports.length < 3 && (
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[48px] rounded-[3px] border border-dashed border-forest/30 bg-cream/50 text-deep-forest font-mono text-xs hover:bg-cream hover:border-forest cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-forest" />
                    <span>{t.booking.uploadButton}</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {uploadError && (
                  <p className="font-body text-xs text-clay mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadError}</span>
                  </p>
                )}

                {/* Uploaded Files List */}
                {uploadedReports.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-2.5 rounded-[3px] bg-cream border border-forest/15 text-xs font-mono"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-forest shrink-0" />
                          {report.id.startsWith('http') ? (
                            <a
                              href={report.id}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate max-w-[180px] sm:max-w-xs text-deep-forest underline hover:text-forest"
                            >
                              {report.name}
                            </a>
                          ) : (
                            <span className="truncate max-w-[180px] sm:max-w-xs text-deep-forest">
                              {report.name}
                            </span>
                          )}
                          {report.status === 'uploading' && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-turmeric shrink-0" />
                          )}
                          {report.status === 'complete' && (
                            <span className="text-[10px] text-forest/70 font-sans">
                              ✓ {t.booking.uploadSuccess}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveReport(report.id)}
                          className="text-clay/80 hover:text-clay p-1 rounded transition-colors cursor-pointer"
                          aria-label="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (~44%): Date, Slot, Summary (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6 self-start">
            {/* Slot Notification Banner (Gentle notice when slot becomes unavailable) */}
            {slotNotice && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-[3px] text-xs font-body text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{slotNotice}</span>
                  <button
                    type="button"
                    onClick={() => setSlotNotice(null)}
                    className="block font-mono text-[10px] underline uppercase mt-1 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Calendar */}
            <CustomBookingCalendar
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedSlot('');
                setSlotNotice(null);
              }}
              minDate={serverToday}
              maxDate={serverMaxDate}
              maxDaysAhead={14}
              availableDates={availableDates}
              disabledDates={disabledDates}
            />

            {/* Slot Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-display text-sm font-medium text-deep-forest flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-forest" />
                  <span>{t.booking.dateTimeTitle}</span>
                </h3>
              </div>

              <SlotPicker
                slots={currentDaySlots}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => {
                  setSelectedSlot(slot);
                  setSlotNotice(null);
                }}
                isLoading={isLoadingSlots}
                t={{
                  morningSlots: t.booking.morningSlots,
                  eveningSlots: t.booking.eveningSlots,
                  noSlotsForDay: t.booking.noSlotsForDay,
                }}
              />
            </div>

            {/* Summary Box & Continue (Desktop) */}
            <div className="hidden lg:block bg-paper border border-forest/15 rounded-[4px] p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-forest/10">
                <span className="font-mono text-[10px] uppercase text-forest/70 block mb-1">
                  Appointment Summary
                </span>
                {selectedDate && selectedSlot ? (
                  <p className="font-display text-sm text-deep-forest font-medium">
                    {friendlySummary} · {t.booking.videoConsult} · {t.booking.fee499}
                  </p>
                ) : (
                  <p className="font-body text-xs text-ink/50 italic">
                    {t.booking.summaryPlaceholder}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink/60">Total Consultation Fee</span>
                <span className="font-display text-base font-semibold text-deep-forest">
                  ₹499
                </span>
              </div>

              <button
                type="submit"
                disabled={!isContinueEnabled}
                className="w-full min-h-[48px] py-3.5 px-6 rounded-[3px] bg-forest text-paper font-sans text-sm font-medium hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">{t.booking.continueBtn}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar (1024px and below) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-forest/15 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-lg">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex-1 min-w-0">
              {selectedDate && selectedSlot ? (
                <div className="truncate">
                  <p className="font-mono text-[11px] text-deep-forest font-medium truncate">
                    {friendlySummary}
                  </p>
                  <span className="font-display text-xs font-semibold text-forest">
                    ₹499 (Video)
                  </span>
                </div>
              ) : (
                <p className="font-body text-xs text-ink/60 leading-tight">
                  {t.booking.summaryPlaceholder}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isContinueEnabled}
              className="min-h-[48px] py-2.5 px-5 rounded-[3px] bg-forest text-paper font-sans text-xs sm:text-sm font-medium hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span className="whitespace-nowrap">{t.booking.continueBtn}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
