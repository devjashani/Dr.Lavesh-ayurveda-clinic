'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { StepProgress } from '@/components/booking/StepProgress';
import { CustomBookingCalendar } from '@/components/booking/CustomBookingCalendar';
import { SlotPicker } from '@/components/booking/SlotPicker';
import { AppointmentVoucher } from '@/components/booking/AppointmentVoucher';
import { doctors } from '@/lib/data/doctors';
import { treatments } from '@/lib/data/treatments';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  createAppointment,
  Appointment,
  CreateAppointmentInput,
} from '@/lib/services/appointments';
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
  Printer,
  Compass,
  Building,
  Video,
  UploadCloud,
  FileCheck,
  X,
  HeartPulse,
  Activity,
  Layers,
} from 'lucide-react';

export interface BookingService {
  id: string;
  name: string;
  sanskrit: string;
  category: string;
  tagline: string;
  duration: string;
  feeEstimate: string;
  icon: any;
}

export const BOOKING_SERVICES: BookingService[] = [
  {
    id: 'nadi-pariksha',
    name: 'Nadi Pariksha & Consultation',
    sanskrit: 'नाड़ी परीक्षा एवं मौलिक निदान',
    category: 'Diagnostic',
    tagline: 'Precision 8-fold radial pulse diagnosis evaluating 7 tissue layers (Dhatus) and Agni.',
    duration: '45 Mins',
    feeEstimate: '₹1,200',
    icon: Activity,
  },
  {
    id: 'panchakarma',
    name: 'Panchakarma Bio-Cleansing',
    sanskrit: 'पञ्चकर्म शोधन चिकित्सा',
    category: 'Systemic Detox',
    tagline: 'Intensive cellular detoxification: internal oleation (Snehana), Swedana, and Karma.',
    duration: '7 to 21 Days',
    feeEstimate: '₹2,500 / session',
    icon: Sparkles,
  },
  {
    id: 'spine-joint',
    name: 'Spine & Joint Restoration',
    sanskrit: 'सन्धि एवं मेरुदण्ड चिकित्सा',
    category: 'Musculoskeletal',
    tagline: 'Targeted Kati, Janu, and Greeva Basti reservoirs for sciatica, arthritis & disc bulges.',
    duration: '50 Mins',
    feeEstimate: '₹1,800',
    icon: Compass,
  },
  {
    id: 'skin-hair',
    name: 'Skin & Hair Clinical Care',
    sanskrit: 'त्वक् एवं केश विकार',
    category: 'Dermatological',
    tagline: 'Deep blood purification (Rakta Shodhana) for psoriasis, chronic eczema, and hair loss.',
    duration: '40 Mins',
    feeEstimate: '₹1,200',
    icon: Layers,
  },
  {
    id: 'womens-health',
    name: "Women's Health & Stri Roga",
    sanskrit: 'स्त्रीरोग एवं प्रसूति तन्त्र',
    category: 'Endocrinology',
    tagline: 'Restorative protocols for PCOD, hormonal dysregulation, cycle health & Garbh Sanskar.',
    duration: '45 Mins',
    feeEstimate: '₹950',
    icon: HeartPulse,
  },
  {
    id: 'digestive-metabolic',
    name: 'Digestive & Metabolic Agni Care',
    sanskrit: 'अग्नि एवं ग्रहणी चिकित्सा',
    category: 'Gastroenterology',
    tagline: 'Deepana-Pachana therapy for chronic IBS, ulcerative colitis, GERD, and fatty liver.',
    duration: '40 Mins',
    feeEstimate: '₹1,200',
    icon: Sparkles,
  },
  {
    id: 'stress-sleep',
    name: 'Stress, Insomnia & Sleep Care',
    sanskrit: 'शिरोधरा एवं अनिद्रा शमन',
    category: 'Neuro-Psychological',
    tagline: 'Rhythmic warm Brahmi oil Shirodhara and herbal nervines calming Prana Vayu.',
    duration: '50 Mins',
    feeEstimate: '₹2,200',
    icon: Clock,
  },
];

const SESSION_STORAGE_KEY = 'aarogyam_booking_session';

export function BookClient() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();

  // URL query params
  const paramDosha = searchParams.get('dosha');
  const paramTherapy = searchParams.get('therapy');
  const paramPackage = searchParams.get('package');
  const paramConcern = searchParams.get('concern');
  const paramDoctor = searchParams.get('doctor');

  // Step state: 1 to 6
  const [step, setStep] = useState<number>(1);

  // Form selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>('nadi-pariksha');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(paramDoctor || 'dr-aditya-bohra');
  const [selectedMode, setSelectedMode] = useState<'in-clinic' | 'online'>('in-clinic');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Patient Details
  const [fullName, setFullName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [chiefComplaint, setChiefComplaint] = useState<string>('');
  const [attachedFileName, setAttachedFileName] = useState<string>('');
  const [knownDosha, setKnownDosha] = useState<string>('');
  const [consentAgreed, setConsentAgreed] = useState<boolean>(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingError, setBookingError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Confirmed appointment result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // 1. Initialize from URL params or sessionStorage
  useEffect(() => {
    // Check sessionStorage first
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.selectedServiceId) setSelectedServiceId(parsed.selectedServiceId);
          if (parsed.selectedDoctorId) setSelectedDoctorId(parsed.selectedDoctorId);
          if (parsed.selectedMode) setSelectedMode(parsed.selectedMode);
          if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
          if (parsed.selectedSlot) setSelectedSlot(parsed.selectedSlot);
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.whatsappNumber) setWhatsappNumber(parsed.whatsappNumber);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.age) setAge(parsed.age);
          if (parsed.gender) setGender(parsed.gender);
          if (parsed.chiefComplaint) setChiefComplaint(parsed.chiefComplaint);
          if (parsed.step && parsed.step < 6) setStep(parsed.step);
        }
      } catch (e) {
        console.warn('Could not read sessionStorage:', e);
      }
    }

    // Process URL Query Parameters override
    if (paramDoctor && doctors.some((d) => d.slug === paramDoctor || d.id === paramDoctor)) {
      setSelectedDoctorId(paramDoctor);
    }

    if (paramDosha) {
      setKnownDosha(paramDosha);
    } else if (typeof window !== 'undefined') {
      try {
        const savedDosha = localStorage.getItem('aarogyam_dosha_result');
        if (savedDosha) {
          const parsed = JSON.parse(savedDosha);
          if (parsed?.typeName) {
            setKnownDosha(parsed.typeName);
          }
        }
      } catch (e) {
        console.warn('Could not read localStorage dosha:', e);
      }
    }

    if (paramPackage) {
      setSelectedServiceId('panchakarma');
      const slugs = paramPackage.split(',');
      const names = slugs
        .map((s) => treatments.find((t) => t.slug === s)?.name || s)
        .join(', ');
      setChiefComplaint((prev) => prev || `Panchakarma Package Request: ${names}`);
    } else if (paramTherapy) {
      const therapy = treatments.find((t) => t.slug === paramTherapy);
      if (therapy) {
        if (therapy.slug.includes('basti') || therapy.category === 'Spine & Joint') {
          setSelectedServiceId('spine-joint');
        } else if (therapy.slug.includes('shirodhara')) {
          setSelectedServiceId('stress-sleep');
        } else if (therapy.category === 'Panchakarma') {
          setSelectedServiceId('panchakarma');
        } else if (therapy.category === 'Skin & Hair') {
          setSelectedServiceId('skin-hair');
        }
        setChiefComplaint((prev) => prev || `Therapy Consultation: ${therapy.name} (${therapy.sanskritName})`);
      }
    } else if (paramConcern) {
      if (paramConcern.toLowerCase().includes('spine') || paramConcern.toLowerCase().includes('sciatica') || paramConcern.toLowerCase().includes('arthritis')) {
        setSelectedServiceId('spine-joint');
      } else if (paramConcern.toLowerCase().includes('skin') || paramConcern.toLowerCase().includes('psoriasis')) {
        setSelectedServiceId('skin-hair');
      } else if (paramConcern.toLowerCase().includes('pcod') || paramConcern.toLowerCase().includes('women')) {
        setSelectedServiceId('womens-health');
      } else if (paramConcern.toLowerCase().includes('ibs') || paramConcern.toLowerCase().includes('gut') || paramConcern.toLowerCase().includes('acidity')) {
        setSelectedServiceId('digestive-metabolic');
      } else if (paramConcern.toLowerCase().includes('insomnia') || paramConcern.toLowerCase().includes('stress')) {
        setSelectedServiceId('stress-sleep');
      }
      setChiefComplaint((prev) => prev || `Health Inquiry: ${paramConcern}`);
    }
  }, [paramDosha, paramTherapy, paramPackage, paramConcern, paramDoctor]);

  // Set default initial date (tomorrow, or Monday if Sunday)
  useEffect(() => {
    if (!selectedDate) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip Sunday
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  // Persist session state whenever user changes fields (unless confirmed)
  useEffect(() => {
    if (step < 6 && typeof window !== 'undefined') {
      try {
        const stateToSave = {
          step,
          selectedServiceId,
          selectedDoctorId,
          selectedMode,
          selectedDate,
          selectedSlot,
          fullName,
          whatsappNumber,
          email,
          age,
          gender,
          chiefComplaint,
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.warn('Failed to save booking state:', e);
      }
    }
  }, [
    step,
    selectedServiceId,
    selectedDoctorId,
    selectedMode,
    selectedDate,
    selectedSlot,
    fullName,
    whatsappNumber,
    email,
    age,
    gender,
    chiefComplaint,
  ]);

  // Active service object
  const currentService = useMemo(() => {
    return BOOKING_SERVICES.find((s) => s.id === selectedServiceId) || BOOKING_SERVICES[0];
  }, [selectedServiceId]);

  // Active doctor object
  const currentDoctor = useMemo(() => {
    return doctors.find((d) => d.slug === selectedDoctorId || d.id === selectedDoctorId) || doctors[0];
  }, [selectedDoctorId]);

  // Step Validation Helpers
  const validateStep1 = () => {
    if (!selectedServiceId) {
      setErrors({ service: 'Please select a consultation service or clinical concern' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    if (!selectedDoctorId) {
      setErrors({ doctor: 'Please choose an attending physician' });
      return false;
    }
    if (!selectedMode) {
      setErrors({ mode: 'Please select consultation mode (In-Clinic or Online)' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!selectedDate) errs.date = 'Please select an appointment date on the calendar';
    if (!selectedSlot) errs.slot = 'Please select a morning or evening time slot';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Full name must be at least 3 characters';
    }
    // Indian WhatsApp mobile validation: 10 digits starting with 6-9
    const cleanPhone = whatsappNumber.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.whatsappNumber = 'Please enter a valid 10-digit Indian WhatsApp mobile number';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 115) {
      errs.age = 'Please enter a valid age between 1 and 115';
    }
    if (!chiefComplaint.trim() || chiefComplaint.trim().length < 10) {
      errs.chiefComplaint = 'Please describe your health concern or symptoms (min 10 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep5 = () => {
    if (!consentAgreed) {
      setErrors({ consent: 'Please confirm your consent to the clinical consultation terms' });
      return false;
    }
    setErrors({});
    return true;
  };

  // Step Navigation handlers
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
    else if (step === 4 && validateStep4()) setStep(5);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setErrors({});
      setBookingError('');
      setStep((s) => s - 1);
    }
  };

  // Final Submission Handler with Supabase-ready service layer & double-booking prevention
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep5()) return;

    setIsSubmitting(true);
    setBookingError('');

    try {
      const input: CreateAppointmentInput = {
        serviceId: currentService.id,
        serviceName: currentService.name,
        serviceCategory: currentService.category,
        doctorId: currentDoctor.slug,
        doctorName: currentDoctor.name,
        mode: selectedMode,
        date: selectedDate,
        slot: selectedSlot,
        patientName: fullName.trim(),
        whatsappNumber: whatsappNumber.trim().startsWith('+91')
          ? whatsappNumber.trim()
          : `+91 ${whatsappNumber.trim()}`,
        email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@aarogyam-patient.local`,
        age: parseInt(age, 10),
        gender,
        chiefComplaint: chiefComplaint.trim(),
        medicalReportFileName: attachedFileName || undefined,
        knownDosha: knownDosha || undefined,
      };

      const result = await createAppointment(input);

      if (!result.success || !result.appointment) {
        setBookingError(result.error || 'This slot was just reserved. Please choose another slot.');
        setIsSubmitting(false);
        // Step back to slot selection
        setStep(3);
        return;
      }

      // Success: Save confirmed appointment and advance to Step 6
      setConfirmedAppointment(result.appointment);
      setIsSubmitting(false);
      setStep(6);

      // Clear pending draft from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setBookingError('An unexpected network error occurred while reserving your slot. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Handle file attachment simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: 'File exceeds 15 MB limit' }));
        return;
      }
      setAttachedFileName(file.name);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.file;
        return copy;
      });
    }
  };

  const handleBookAnother = () => {
    setConfirmedAppointment(null);
    setStep(1);
    setFullName('');
    setWhatsappNumber('');
    setEmail('');
    setAge('');
    setChiefComplaint('');
    setAttachedFileName('');
    setConsentAgreed(false);
  };

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      <Container size="default">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="text-xs font-mono text-ink/60 mb-3">
            <Link href="/" className="hover:text-forest transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-forest font-medium">Appointment Desk</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="sage" className="text-[10px]">
                  AYUSH License: AYUSH-RJ-2018-0482
                </Badge>
                {knownDosha && (
                  <Badge variant="turmeric" className="text-[10px]">
                    Prakriti Detected: {knownDosha}
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08]">
                {t.booking.title}
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-forest">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Unhurried 40+ Min Diagnostic Assessment</span>
            </div>
          </div>
        </div>

        {/* 6-Step Visual Progress Bar */}
        <StepProgress
          currentStep={step}
          onStepClick={(s) => {
            if (s < step && step < 6) setStep(s);
          }}
        />

        {/* Double-booking / System Error Banner */}
        {bookingError && (
          <div className="mb-6 p-4 rounded-[4px] bg-clay/10 border-l-4 border-clay flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-clay shrink-0 mt-0.5" />
            <div className="text-xs font-body text-ink/80 leading-relaxed">
              <span className="font-mono uppercase font-semibold text-clay block mb-0.5">
                Slot Collision Notice
              </span>
              {bookingError}
            </div>
          </div>
        )}

        {/* STEP 1: CONCERN & SERVICE */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-1">
                  Step 1 of 5 · सेवा चयन
                </span>
                <h2 className="font-display text-2xl text-deep-forest font-medium">
                  Select Your Primary Clinical Concern or Service
                </h2>
                <p className="font-body text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  Choose the specialized therapeutic department most aligned with your current health
                  symptoms. Your attending Vaidya will refine this during radial pulse palpation.
                </p>
              </div>

              {errors.service && (
                <p className="font-body text-xs text-clay mb-4 font-medium">{errors.service}</p>
              )}

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BOOKING_SERVICES.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  const Icon = srv.icon;

                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedServiceId(srv.id);
                        setErrors({});
                      }}
                      className={`p-5 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cream border-forest ring-2 ring-forest/30 shadow-xs'
                          : 'bg-paper border-forest/15 hover:border-forest/40 hover:bg-cream/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[10px] text-forest/70 uppercase tracking-wider font-semibold">
                            {srv.category}
                          </span>
                          <span className="font-mono text-xs text-clay font-medium">
                            {srv.feeEstimate}
                          </span>
                        </div>

                        <div className="flex items-start gap-3 mb-2">
                          <div
                            className={`p-2 rounded-[3px] shrink-0 mt-0.5 ${
                              isSelected ? 'bg-forest text-paper' : 'bg-cream text-forest border border-forest/15'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-display text-base text-deep-forest font-medium">
                              {srv.name}
                            </h3>
                            <span className="font-sanskrit text-xs text-sage block">
                              {srv.sanskrit}
                            </span>
                          </div>
                        </div>

                        <p className="font-body text-xs text-ink/75 leading-relaxed mt-2">
                          {srv.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-forest/10 flex items-center justify-between text-xs font-mono text-ink/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-turmeric" />
                          {srv.duration}
                        </span>
                        <div className="flex items-center gap-1.5 text-forest font-medium">
                          {isSelected ? (
                            <span className="flex items-center gap-1 text-forest">
                              <CheckCircle2 className="w-4 h-4 text-turmeric" /> Selected
                            </span>
                          ) : (
                            <span className="text-ink/40">Click to Select</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 1 Actions */}
              <div className="mt-8 pt-5 border-t border-forest/10 flex justify-end">
                <Button onClick={handleNextStep} variant="primary" className="min-h-[44px]">
                  {language === 'HI' ? 'वैद्य एवं माध्यम चुनें' : 'Continue to Doctor & Mode'}
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: DOCTOR & MODE */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-1">
                  Step 2 of 5 · चिकित्सक एवं विधि
                </span>
                <h2 className="font-display text-2xl text-deep-forest font-medium">
                  Choose Attending Vaidya & Consultation Mode
                </h2>
                <p className="font-body text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  Select your physician and indicate whether you will visit our Civil Lines, Jaipur clinic
                  for hands-on pulse palpation, or connect via high-definition video telemedicine.
                </p>
              </div>

              {/* Consultation Mode Selector */}
              <div className="mb-8">
                <label className="block font-mono text-xs uppercase tracking-wider text-deep-forest font-medium mb-3">
                  Consultation Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setSelectedMode('in-clinic')}
                    className={`p-4 rounded-[4px] border cursor-pointer transition-all ${
                      selectedMode === 'in-clinic'
                        ? 'bg-cream border-forest ring-2 ring-forest/30 shadow-xs'
                        : 'bg-paper border-forest/15 hover:border-forest/35'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5 font-display text-base text-deep-forest font-medium">
                      <Building className="w-4 h-4 text-forest" />
                      <span>In-Clinic Visit (Jaipur)</span>
                      {selectedMode === 'in-clinic' && (
                        <CheckCircle2 className="w-4 h-4 text-turmeric ml-auto" />
                      )}
                    </div>
                    <p className="font-body text-xs text-ink/75 leading-relaxed">
                      14 Jacob Road, Civil Lines. Precision radial pulse diagnosis (Nadi Pariksha)
                      conducted in an unhurried, calm clinical environment.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedMode('online')}
                    className={`p-4 rounded-[4px] border cursor-pointer transition-all ${
                      selectedMode === 'online'
                        ? 'bg-cream border-forest ring-2 ring-forest/30 shadow-xs'
                        : 'bg-paper border-forest/15 hover:border-forest/35'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5 font-display text-base text-deep-forest font-medium">
                      <Video className="w-4 h-4 text-forest" />
                      <span>Online Video Consultation</span>
                      {selectedMode === 'online' && (
                        <CheckCircle2 className="w-4 h-4 text-turmeric ml-auto" />
                      )}
                    </div>
                    <p className="font-body text-xs text-ink/75 leading-relaxed">
                      Encrypted HD video intake. Includes digital prescription generation and temperature-controlled
                      herbal medicine dispatch to your home across India.
                    </p>
                  </div>
                </div>
              </div>

              {/* Doctor Cards Selector */}
              <div className="space-y-3">
                <label className="block font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                  Select Attending Physician:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.slug || selectedDoctorId === doc.id;

                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.slug)}
                        className={`p-4 rounded-[4px] border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cream border-forest ring-2 ring-forest/30 shadow-xs'
                            : 'bg-paper border-forest/15 hover:border-forest/35'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px] text-forest/70 uppercase">
                              {doc.experienceYears}+ Yrs Exp
                            </span>
                            <span className="font-mono text-xs font-semibold text-deep-forest">
                              ₹{doc.consultationFee}
                            </span>
                          </div>

                          <div className="w-12 h-14 rounded-t-full rounded-b-[2px] bg-forest/10 border border-forest/20 flex items-center justify-center font-sanskrit text-forest/60 text-lg mb-2">
                            ॐ
                          </div>

                          <h3 className="font-display text-base text-deep-forest font-medium leading-snug">
                            {doc.name}
                          </h3>
                          <span className="font-sanskrit text-xs text-sage block mb-1">
                            {doc.sanskritTitle}
                          </span>
                          <p className="font-body text-xs text-forest/90 font-medium mb-2">
                            {doc.title}
                          </p>
                          <p className="font-body text-[11px] text-ink/70 line-clamp-2 leading-relaxed">
                            {doc.bio}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-forest/10 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-ink/50">{doc.ayushRegistrationNo}</span>
                          {isSelected ? (
                            <span className="text-forest font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-turmeric" /> Selected
                            </span>
                          ) : (
                            <span className="text-ink/40">Select</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="mt-8 pt-5 border-t border-forest/10 flex items-center justify-between">
                <Button onClick={handlePrevStep} variant="secondary" className="min-h-[44px]">
                  <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                  {t.booking.backBtn}
                </Button>
                <Button onClick={handleNextStep} variant="primary" className="min-h-[44px]">
                  {language === 'HI' ? 'तिथि एवं स्लॉट चुनें' : 'Continue to Date & Slot'}
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: DATE & TIME SLOT */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-1">
                  Step 3 of 5 · तिथि एवं समय
                </span>
                <h2 className="font-display text-2xl text-deep-forest font-medium">
                  Select Appointment Date & Time Slot
                </h2>
                <p className="font-body text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  Choose a date from our interactive calendar. Morning slots are ideal for fasting
                  radial pulse diagnosis. Reserved slots are disabled automatically.
                </p>
              </div>

              {(errors.date || errors.slot) && (
                <div className="p-3 mb-4 rounded-[3px] bg-clay/10 border border-clay/20 text-xs text-clay">
                  {errors.date || errors.slot}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Custom Calendar (6 cols) */}
                <div className="lg:col-span-6 space-y-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium block">
                    1. Select Date:
                  </span>
                  <CustomBookingCalendar
                    selectedDate={selectedDate}
                    onSelectDate={(d) => {
                      setSelectedDate(d);
                      setErrors({});
                    }}
                  />
                </div>

                {/* Right: Slot Picker (6 cols) */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium block">
                      2. Available Slots for {selectedDate}:
                    </span>
                    <Badge variant="sage" className="text-[10px]">
                      {currentDoctor.name}
                    </Badge>
                  </div>

                  <SlotPicker
                    selectedDate={selectedDate}
                    selectedDoctorId={currentDoctor.slug}
                    selectedSlot={selectedSlot}
                    onSelectSlot={(s) => {
                      setSelectedSlot(s);
                      setErrors({});
                    }}
                  />
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="mt-8 pt-5 border-t border-forest/10 flex items-center justify-between">
                <Button onClick={handlePrevStep} variant="secondary" className="min-h-[44px]">
                  <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                  {t.booking.backBtn}
                </Button>
                <Button onClick={handleNextStep} variant="primary" className="min-h-[44px]">
                  {language === 'HI' ? 'रोगी विवरण भरें' : 'Continue to Patient Details'}
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: PATIENT DETAILS & ATTACHMENT */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-1">
                  Step 4 of 5 · रोगी विवरण
                </span>
                <h2 className="font-display text-2xl text-deep-forest font-medium">
                  Patient Health Details & Clinical Notes
                </h2>
                <p className="font-body text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  Provide patient demographic information and a description of your primary symptoms.
                  You may also upload past medical reports or blood panels (optional).
                </p>
              </div>

              <div className="space-y-5 max-w-3xl">
                {/* Full Name & WhatsApp Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra Sharma"
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs sm:text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                    {errors.fullName && (
                      <p className="font-body text-[11px] text-clay mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                      WhatsApp Mobile Number (+91) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-ink/60">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={whatsappNumber.replace('+91', '').trim()}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="9829012345"
                        maxLength={10}
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-[3px] bg-cream text-xs sm:text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                      />
                    </div>
                    {errors.whatsappNumber ? (
                      <p className="font-body text-[11px] text-clay mt-1">{errors.whatsappNumber}</p>
                    ) : (
                      <p className="font-body text-[10px] text-ink/50 mt-1">
                        We send token confirmation and pre-pulse fasting instructions via WhatsApp.
                      </p>
                    )}
                  </div>
                </div>

                {/* Email, Age, Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ramesh@example.com"
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs sm:text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                    {errors.email && (
                      <p className="font-body text-[11px] text-clay mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                      Patient Age *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={115}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 48"
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs sm:text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                    {errors.age && (
                      <p className="font-body text-[11px] text-clay mt-1">{errors.age}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                      Gender *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs sm:text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Primary Complaint / Symptoms */}
                <div>
                  <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                    Primary Health Complaint & Chronicity *
                  </label>
                  <textarea
                    rows={4}
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="Describe your current symptoms, how long you have experienced them, any ongoing allopathic medications, and previous treatments..."
                    className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs sm:text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest resize-none"
                  />
                  {errors.chiefComplaint && (
                    <p className="font-body text-[11px] text-clay mt-1">{errors.chiefComplaint}</p>
                  )}
                </div>

                {/* Optional File Upload for Prior Reports */}
                <div>
                  <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                    Upload Prior Diagnostic Reports (Optional)
                  </label>
                  <div className="border-2 border-dashed border-forest/20 rounded-[4px] p-4 bg-cream/50 text-center hover:bg-cream transition-colors relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {attachedFileName ? (
                      <div className="flex items-center justify-center gap-2 text-xs font-mono text-forest">
                        <FileCheck className="w-4 h-4 text-turmeric" />
                        <span className="font-medium">{attachedFileName}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAttachedFileName('');
                          }}
                          className="p-1 hover:text-clay"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-6 h-6 text-forest/60 mx-auto" />
                        <p className="font-body text-xs text-ink/70">
                          Click or drag prior blood tests, MRIs, or discharge summaries (PDF/JPG up to 15 MB)
                        </p>
                        <span className="font-mono text-[10px] text-ink/40">
                          Files are encrypted and accessible only to your attending physician.
                        </span>
                      </div>
                    )}
                  </div>
                  {errors.file && (
                    <p className="font-body text-[11px] text-clay mt-1">{errors.file}</p>
                  )}
                </div>
              </div>

              {/* Step 4 Actions */}
              <div className="mt-8 pt-5 border-t border-forest/10 flex items-center justify-between">
                <Button onClick={handlePrevStep} variant="secondary" className="min-h-[44px]">
                  <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                  {t.booking.backBtn}
                </Button>
                <Button onClick={handleNextStep} variant="primary" className="min-h-[44px]">
                  {language === 'HI' ? 'समीक्षा एवं पुष्टि' : 'Review & Confirm'}
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: REVIEW & CONSENT */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-1">
                  Step 5 of 5 · समीक्षा एवं सहमति
                </span>
                <h2 className="font-display text-2xl text-deep-forest font-medium">
                  Review Appointment Details & Confirm
                </h2>
                <p className="font-body text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  Verify your consultation parameters before generating your official Aarogyam token voucher.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Consultation Details */}
                <div className="p-5 rounded-[4px] bg-cream border border-forest/10 space-y-3 text-xs font-body">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-forest font-semibold block">
                    Session Summary
                  </span>
                  <div className="flex justify-between py-1 border-b border-forest/5">
                    <span className="text-ink/60">Service</span>
                    <span className="font-medium text-deep-forest">{currentService.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-forest/5">
                    <span className="text-ink/60">Attending Vaidya</span>
                    <span className="font-medium text-deep-forest">{currentDoctor.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-forest/5">
                    <span className="text-ink/60">Mode</span>
                    <span className="font-medium text-forest">
                      {selectedMode === 'in-clinic' ? 'In-Clinic (Civil Lines, Jaipur)' : 'Online Video Call'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-forest/5">
                    <span className="text-ink/60">Date & Slot</span>
                    <span className="font-mono font-medium text-deep-forest">
                      {selectedDate} at {selectedSlot}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink/60">Consultation Fee</span>
                    <span className="font-mono font-semibold text-deep-forest text-sm">
                      ₹{currentDoctor.consultationFee}
                    </span>
                  </div>
                </div>

                {/* Patient Summary */}
                <div className="p-5 rounded-[4px] bg-cream border border-forest/10 space-y-3 text-xs font-body">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-forest font-semibold block">
                    Patient Profile
                  </span>
                  <div className="flex justify-between py-1 border-b border-forest/5">
                    <span className="text-ink/60">Name</span>
                    <span className="font-medium text-deep-forest">{fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-forest/5">
                    <span className="text-ink/60">WhatsApp</span>
                    <span className="font-mono text-deep-forest">+91 {whatsappNumber.replace('+91', '').trim()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-forest/5">
                    <span className="text-ink/60">Age / Gender</span>
                    <span className="text-deep-forest">{age} yrs · {gender}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-forest/5">
                    <span className="text-ink/60">Attached Reports</span>
                    <span className="font-mono text-forest">{attachedFileName || 'None'}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-ink/60 block mb-0.5">Health Note:</span>
                    <p className="italic text-ink/80 line-clamp-2">"{chiefComplaint}"</p>
                  </div>
                </div>
              </div>

              {/* Fasting Reminder Notice */}
              <div className="p-4 rounded-[4px] bg-mist/60 border border-forest/20 mb-6 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                <div className="text-xs font-body text-ink/80 leading-relaxed">
                  <span className="font-mono uppercase font-semibold text-deep-forest block mb-0.5">
                    Pre-Consultation Clinical Advice:
                  </span>
                  For maximum radial pulse accuracy, please fast or maintain at least 2.5 hours gap after eating.
                  Avoid coffee, tea, and heavy exercise. Payment is collected at the clinic reception or via UPI
                  prior to video link activation.
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="p-4 rounded-[4px] bg-paper border border-forest/15 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => {
                      setConsentAgreed(e.target.checked);
                      setErrors({});
                    }}
                    className="mt-1 h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest cursor-pointer"
                  />
                  <span className="font-body text-xs text-ink/80 leading-relaxed">
                    I consent to the Ayurvedic diagnostic evaluation and agree to the clinic consultation terms.
                    I understand that classical pulse examination assesses subtle tissue energetics (Dhatus) in
                    coordination with modern medical investigations.
                  </span>
                </label>
                {errors.consent && (
                  <p className="font-body text-[11px] text-clay mt-1.5 pl-7">{errors.consent}</p>
                )}
              </div>

              {/* Step 5 Actions */}
              <div className="mt-8 pt-5 border-t border-forest/10 flex items-center justify-between">
                <Button onClick={handlePrevStep} variant="secondary" disabled={isSubmitting} className="min-h-[44px]">
                  <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                  {t.booking.backBtn}
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  variant="primary"
                  disabled={isSubmitting}
                  className="bg-turmeric text-deep-forest hover:bg-turmeric/90 min-h-[44px]"
                >
                  {isSubmitting ? (
                    language === 'HI' ? 'स्लॉट आरक्षित किया जा रहा है...' : 'Reserving Slot...'
                  ) : (
                    <>
                      {t.booking.submitBtn}
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 6: CONFIRMATION VOUCHER */}
        {step === 6 && confirmedAppointment && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <AppointmentVoucher
              appointment={confirmedAppointment}
              onBookAnother={handleBookAnother}
            />
          </motion.div>
        )}
      </Container>
    </div>
  );
}
