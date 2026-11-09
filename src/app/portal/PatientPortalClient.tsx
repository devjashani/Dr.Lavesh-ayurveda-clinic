'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { SEED_PATIENTS, DbPatient } from '@/lib/data/mockSoftwareDb';
import {
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  Sparkles,
  ArrowRight,
  LogOut,
  Pill,
  Utensils,
  Leaf,
  Activity,
  CalendarX,
  CalendarCheck,
  Edit3,
  Save,
  FileText,
  KeyRound,
  Check,
  Building,
  Video,
} from 'lucide-react';

const PATIENT_SESSION_KEY = 'aarogyam_logged_in_patient';

export function PatientPortalClient() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<DbPatient | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'visits' | 'prescriptions' | 'diet' | 'dosha' | 'profile'
  >('dashboard');

  // Next Appointment & Reschedule State
  const [nextAppointment, setNextAppointment] = useState({
    tokenNumber: 'AAR-2026-3511',
    doctorName: 'Dr. Lavesh Bohra',
    doctorSlug: 'dr-lavesh-bohra',
    serviceName: 'Nadi Pariksha & Pulse Consultation',
    date: 'Tomorrow, 10 Nov 2026',
    dateIso: '2026-11-10',
    slot: '09:45 AM',
    mode: 'in-clinic',
    status: 'Confirmed',
  });

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleNewDate, setRescheduleNewDate] = useState('2026-11-12');
  const [rescheduleNewSlot, setRescheduleNewSlot] = useState('11:15 AM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable Profile State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Check stored patient session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PATIENT_SESSION_KEY);
        if (saved) {
          const pat = JSON.parse(saved);
          setCurrentUser(pat);
          setProfileName(pat.name);
          setProfileEmail(pat.email);
          setProfileCity(pat.city);
          setProfileAddress(pat.address);
        }
      } catch (e) {
        console.warn('Error reading patient session:', e);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // OTP Login Handlers
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const clean = mobileNumber.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(clean)) {
      setAuthError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (enteredOtp.trim() !== '123456') {
      setAuthError('Invalid OTP code. Please enter the demo code: 123456');
      return;
    }

    // Find patient by phone or fallback to Meera Singhania
    const clean = mobileNumber.replace(/\D/g, '').slice(-10);
    const matched =
      SEED_PATIENTS.find((p) => p.phone.replace(/\D/g, '').includes(clean)) ||
      SEED_PATIENTS[1]; // Smt. Meera Singhania

    setCurrentUser(matched);
    setProfileName(matched.name);
    setProfileEmail(matched.email);
    setProfileCity(matched.city);
    setProfileAddress(matched.address);

    if (typeof window !== 'undefined') {
      localStorage.setItem(PATIENT_SESSION_KEY, JSON.stringify(matched));
    }
  };

  const handleDemoLogin = (patientIndex = 1) => {
    const pat = SEED_PATIENTS[patientIndex]; // Meera Singhania
    setCurrentUser(pat);
    setProfileName(pat.name);
    setProfileEmail(pat.email);
    setProfileCity(pat.city);
    setProfileAddress(pat.address);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PATIENT_SESSION_KEY, JSON.stringify(pat));
    }
    showToast(`Logged in as ${pat.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOtpSent(false);
    setEnteredOtp('');
    setMobileNumber('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PATIENT_SESSION_KEY);
    }
  };

  // Reschedule & Cancel Handlers
  const handleConfirmReschedule = () => {
    setNextAppointment((prev) => ({
      ...prev,
      date: rescheduleNewDate,
      slot: rescheduleNewSlot,
      status: 'Rescheduled',
    }));
    setRescheduleModalOpen(false);
    showToast(`Appointment rescheduled to ${rescheduleNewDate} at ${rescheduleNewSlot}`);
  };

  const handleConfirmCancel = () => {
    setNextAppointment((prev) => ({
      ...prev,
      status: 'Cancelled',
    }));
    setCancelModalOpen(false);
    showToast('Your appointment has been cancelled. Our front desk has been notified.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updated = {
        ...currentUser,
        name: profileName,
        email: profileEmail,
        city: profileCity,
        address: profileAddress,
      };
      setCurrentUser(updated);
      setProfileSaved(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(PATIENT_SESSION_KEY, JSON.stringify(updated));
      }
      setTimeout(() => setProfileSaved(false), 3000);
      showToast('Profile records updated successfully');
    }
  };

  const handlePrintPrescription = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // -------------------------------------------------------------
  // SCREEN 1: OTP LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen flex items-center justify-center">
        <Container size="narrow">
          <div className="bg-paper border border-forest/20 rounded-[6px] p-6 sm:p-10 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 text-[140px] font-sanskrit text-forest/[0.03] select-none pointer-events-none translate-x-8 translate-y-8">
              स्वास्थ्य
            </div>

            <div className="text-center max-w-sm mx-auto mb-8 space-y-2">
              <Badge variant="sage" className="mx-auto text-[10px]">
                रोगी स्वास्थ्य विवरण · Patient Portal
              </Badge>
              <h1 className="font-display text-2xl sm:text-3xl text-deep-forest font-medium">
                Access Your Health Records
              </h1>
              <p className="font-body text-xs text-ink/75 leading-relaxed">
                Log in using your registered Indian mobile number to view pulse records, active
                prescriptions, and dietary guidelines.
              </p>
            </div>

            {authError && (
              <div className="p-3 mb-5 rounded-[3px] bg-clay/10 border border-clay/20 text-xs text-clay font-body">
                {authError}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 max-w-sm mx-auto">
                <div>
                  <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                    Registered Mobile Number (+91)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-ink/60">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98290 44122"
                      maxLength={10}
                      required
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-[3px] bg-cream text-xs sm:text-sm font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center py-2.5">
                  Send OTP Code
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>

                <div className="pt-4 border-t border-forest/10 text-center">
                  <span className="font-mono text-[11px] text-ink/50 block mb-2">
                    Reviewing the application?
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin(1)}
                    className="w-full py-2 px-3 rounded-[3px] bg-cream hover:bg-forest/10 border border-forest/20 text-xs font-body text-forest font-medium transition-colors cursor-pointer"
                  >
                    ⚡ Quick Demo Login as Meera Singhania
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-sm mx-auto">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-xs uppercase text-deep-forest font-medium">
                      Enter 6-Digit OTP
                    </label>
                    <span className="font-mono text-[10px] text-turmeric font-semibold">
                      Demo Code: 123456
                    </span>
                  </div>
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full px-3.5 py-2.5 text-center tracking-widest font-mono text-lg rounded-[3px] bg-cream text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest font-bold"
                  />
                  <p className="font-body text-[11px] text-ink/60 mt-1">
                    Simulated SMS dispatched to +91 {mobileNumber}. Use <strong>123456</strong> to enter.
                  </p>
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center py-2.5 bg-turmeric text-deep-forest hover:bg-turmeric/90">
                  Verify & Access Records
                </Button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-forest hover:underline font-mono text-[11px]"
                  >
                    ← Change Phone Number
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnteredOtp('123456')}
                    className="text-turmeric hover:underline font-mono text-[11px]"
                  >
                    Auto-Fill 123456
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-forest/10 flex items-center justify-center gap-2 text-[11px] font-mono text-ink/50">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>Compliant with Indian Telemedicine & DISHA Medical Data Guidelines</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: AUTHENTICATED PATIENT PORTAL
  // -------------------------------------------------------------
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-deep-forest text-paper px-4 py-3 rounded-[4px] shadow-lg text-xs font-body flex items-center gap-2 border border-forest/30">
          <CheckCircle2 className="w-4 h-4 text-turmeric shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Container size="default">
        {/* Top Header Strip */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="sage" className="text-[10px]">
                Hospital ID: {currentUser.patientId}
              </Badge>
              <Badge variant="turmeric" className="text-[10px]">
                Prakriti: {currentUser.prakriti}
              </Badge>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-mono text-ink/60 hover:text-clay flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block">
                रोगी स्वास्थ्य विवरण · Welcome Back
              </span>
              <h1 className="font-display text-2xl sm:text-3xl text-deep-forest font-medium">
                {currentUser.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={handlePrintPrescription}
                variant="secondary"
                className="text-xs py-2 px-3 border-forest/20 hover:border-forest/40"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Print Medical Summary
              </Button>
              <Button
                href="/book"
                variant="primary"
                className="text-xs py-2 px-3 bg-turmeric text-deep-forest hover:bg-turmeric/90"
              >
                Book New Session
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none border-b border-forest/15">
          {[
            { key: 'dashboard', label: 'Dashboard & Next Visit', icon: Calendar },
            { key: 'visits', label: `Past Visits (${currentUser.pastVisits.length + 1})`, icon: Activity },
            { key: 'prescriptions', label: `Prescriptions (${currentUser.activePrescriptions.length})`, icon: Pill },
            { key: 'diet', label: 'Diet & Pathya', icon: Utensils },
            { key: 'dosha', label: 'Dosha Constitution', icon: Sparkles },
            { key: 'profile', label: 'Profile & Contact', icon: User },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-[4px] text-xs sm:text-sm font-body transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-paper text-deep-forest font-semibold border-t-2 border-x border-forest/20 border-t-forest shadow-xs'
                    : 'text-ink/70 hover:text-deep-forest'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-forest' : 'text-ink/40'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD & NEXT VISIT */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* NEXT APPOINTMENT CARD */}
            <div className="bg-paper border-2 border-forest/20 rounded-[6px] p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest/10">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-0.5">
                    आगामी परामर्श · Scheduled Visit
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl text-deep-forest font-medium">
                    {nextAppointment.serviceName}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-forest bg-forest/10 px-2 py-0.5 rounded font-semibold">
                    Token: {nextAppointment.tokenNumber}
                  </span>
                  <Badge
                    variant={
                      nextAppointment.status === 'Confirmed'
                        ? 'sage'
                        : nextAppointment.status === 'Rescheduled'
                        ? 'turmeric'
                        : 'clay'
                    }
                    className="text-[10px]"
                  >
                    {nextAppointment.status}
                  </Badge>
                </div>
              </div>

              {/* Appointment Details Grid */}
              <div className="py-5 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-body">
                <div>
                  <span className="text-ink/50 font-mono text-[10px] uppercase block">Attending Vaidya</span>
                  <span className="font-medium text-deep-forest text-sm">{nextAppointment.doctorName}</span>
                </div>
                <div>
                  <span className="text-ink/50 font-mono text-[10px] uppercase block">Date</span>
                  <span className="font-mono font-medium text-deep-forest text-sm">{nextAppointment.date}</span>
                </div>
                <div>
                  <span className="text-ink/50 font-mono text-[10px] uppercase block">Time Slot</span>
                  <span className="font-mono font-medium text-turmeric text-sm">{nextAppointment.slot}</span>
                </div>
                <div>
                  <span className="text-ink/50 font-mono text-[10px] uppercase block">Mode & Location</span>
                  <span className="font-medium text-forest flex items-center gap-1 mt-0.5">
                    {nextAppointment.mode === 'in-clinic' ? (
                      <>
                        <Building className="w-3.5 h-3.5 text-forest" />
                        Civil Lines, Jaipur
                      </>
                    ) : (
                      <>
                        <Video className="w-3.5 h-3.5 text-forest" />
                        Online Video Room
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Pre-Consultation Instructions */}
              <div className="p-4 rounded-[4px] bg-cream border border-forest/10 text-xs font-body text-ink/80 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-turmeric shrink-0 mt-0.5" />
                <div>
                  <strong>Pre-Pulse Fasting Rule:</strong> Arrive on an empty stomach or allow 2.5 hours
                  after a light meal for clear Nadi Pariksha. Avoid coffee, tea, and heavy exertion.
                </div>
              </div>

              {/* Actions: Reschedule & Cancel */}
              {nextAppointment.status !== 'Cancelled' && (
                <div className="pt-5 mt-5 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setRescheduleModalOpen(true)}
                      variant="primary"
                      className="text-xs py-1.5 px-3 bg-forest hover:bg-deep-forest cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 mr-1" />
                      Reschedule Slot
                    </Button>
                    <button
                      type="button"
                      onClick={() => setCancelModalOpen(true)}
                      className="text-xs font-mono text-clay hover:text-clay/80 underline underline-offset-2 px-2 py-1 cursor-pointer"
                    >
                      Cancel Appointment
                    </button>
                  </div>

                  <Link
                    href="https://wa.me/919414012345?text=Namaste%2C%20I%20have%20an%20inquiry%20regarding%20my%20appointment%20token%20"
                    target="_blank"
                    className="text-xs font-body text-forest hover:underline flex items-center gap-1"
                  >
                    Need Directions / Reception Help?
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Two-Column Cards: Prescriptions & Diet Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Prescriptions Snapshot */}
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-forest/10">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-forest" />
                    <h3 className="font-display text-base text-deep-forest font-medium">
                      Active Herbal Medicines
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('prescriptions')}
                    className="text-xs font-mono text-forest hover:underline"
                  >
                    View All ({currentUser.activePrescriptions.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {currentUser.activePrescriptions.map((rx, i) => (
                    <div
                      key={i}
                      className="p-3 bg-cream rounded-[3px] border border-forest/10 text-xs font-body"
                    >
                      <div className="font-medium text-deep-forest">{rx.medicineName}</div>
                      <div className="text-[11px] text-forest font-mono mt-0.5">
                        {rx.dosage} · {rx.timing}
                      </div>
                      <div className="text-[11px] text-ink/60 mt-0.5">
                        Anupana: {rx.anupana} ({rx.durationDays} days)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathya Diet Snapshot */}
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-forest/10">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-clay" />
                    <h3 className="font-display text-base text-deep-forest font-medium">
                      Personalized Pathya Diet
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('diet')}
                    className="text-xs font-mono text-forest hover:underline"
                  >
                    Full Diet Chart →
                  </button>
                </div>

                <div className="space-y-2 text-xs font-body">
                  <div className="p-3 bg-cream rounded-[3px] border border-forest/10 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-forest font-semibold block">
                      Foods to Favor (पथ्य):
                    </span>
                    <p className="text-ink/80 text-[11px]">
                      Moong dal soup, old Basmati rice, Lauki (bottle gourd), boiled warm water with dry ginger.
                    </p>
                  </div>

                  <div className="p-3 bg-cream rounded-[3px] border border-forest/10 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-clay font-semibold block">
                      Foods to Avoid (अपथ्य):
                    </span>
                    <p className="text-ink/80 text-[11px]">
                      Curd (yogurt), tomatoes, fermented dough, ice-cold water, daytime sleeping.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAST VISITS TIMELINE */}
        {activeTab === 'visits' && (
          <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-forest/10">
              <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-0.5">
                चिकित्सा इतिहास · Clinical History
              </span>
              <h2 className="font-display text-2xl text-deep-forest font-medium">
                Pulse Examination & Consultation Records
              </h2>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-forest/20 space-y-8">
              {/* Latest Visit */}
              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-forest ring-4 ring-forest/20" />
                <div className="bg-cream p-5 rounded-[4px] border border-forest/10 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-mono text-xs text-forest font-bold">
                      Session Date: {currentUser.lastVisitDate}
                    </span>
                    <Badge variant="sage" className="text-[10px]">
                      Pulse Reading: Sarpa-Manduka Gati
                    </Badge>
                  </div>
                  <h4 className="font-display text-base text-deep-forest font-medium">
                    {currentUser.primaryDiagnosis}
                  </h4>
                  <p className="text-xs font-body text-ink/80 leading-relaxed">
                    {currentUser.clinicalNotes}
                  </p>
                </div>
              </div>

              {/* Past Visits from Seed Data */}
              {currentUser.pastVisits.map((v, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-turmeric ring-4 ring-turmeric/20" />
                  <div className="bg-cream p-5 rounded-[4px] border border-forest/10 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-mono text-xs text-forest font-bold">
                        Session Date: {v.date}
                      </span>
                      <span className="font-mono text-xs text-ink/60">{v.doctorName}</span>
                    </div>
                    <div className="text-xs font-body">
                      <strong>Diagnosis:</strong> {v.diagnosis} · <strong>Pulse:</strong> {v.pulseGati}
                    </div>
                    <p className="text-xs font-body text-ink/75 italic">"{v.notes}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRESCRIPTIONS LIST (WITH PRINTABLE MOCK PDF) */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest/10 mb-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-0.5">
                    रसशाला पर्ची · Official Prescription Monograph
                  </span>
                  <h2 className="font-display text-2xl text-deep-forest font-medium">
                    Prescribed Classical Formulations
                  </h2>
                </div>
                <Button
                  onClick={handlePrintPrescription}
                  variant="primary"
                  className="text-xs py-2 bg-turmeric text-deep-forest hover:bg-turmeric/90"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Download / Print PDF
                </Button>
              </div>

              {/* Printable Clinic Letterhead Layout */}
              <div className="print:border print:border-black p-6 bg-cream rounded-[4px] border border-forest/15 space-y-6">
                {/* Letterhead Header */}
                <div className="flex justify-between items-start pb-4 border-b border-forest/15">
                  <div>
                    <h3 className="font-display text-lg text-deep-forest font-medium">
                      Aarogyam Ayurveda Hospital
                    </h3>
                    <p className="font-mono text-[10px] text-ink/60">
                      14, Jacob Road, Civil Lines, Jaipur · AYUSH-RJ-2018-0482
                    </p>
                    <p className="font-mono text-[10px] text-forest mt-0.5">
                      Chief Physician: Dr. Lavesh Bohra, MD (Kayachikitsa) · Reg: AYUSH-RJ-1999-4081
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-ink/60">Patient ID: </span>
                    <strong className="text-deep-forest">{currentUser.patientId}</strong> <br />
                    <span className="text-ink/60">Date: </span>
                    <span>{currentUser.lastVisitDate}</span>
                  </div>
                </div>

                {/* Patient Summary */}
                <div className="grid grid-cols-3 gap-2 text-xs font-body bg-paper p-3 rounded-[3px] border border-forest/10">
                  <div><strong>Patient:</strong> {currentUser.name}</div>
                  <div><strong>Age / Gender:</strong> {currentUser.age} yrs · {currentUser.gender}</div>
                  <div><strong>Diagnosis:</strong> {currentUser.primaryDiagnosis}</div>
                </div>

                {/* Prescription Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-body border-collapse">
                    <thead>
                      <tr className="bg-paper border-b border-forest/20 font-mono text-[11px] uppercase text-forest">
                        <th className="py-2.5 px-3">Medicine / Formulation</th>
                        <th className="py-2.5 px-3">Dosage & Timing</th>
                        <th className="py-2.5 px-3">Anupana (Vehicle)</th>
                        <th className="py-2.5 px-3 text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest/10">
                      {currentUser.activePrescriptions.map((rx, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-3 font-medium text-deep-forest">
                            {rx.medicineName}
                          </td>
                          <td className="py-3 px-3">
                            <span className="block font-medium">{rx.dosage}</span>
                            <span className="font-mono text-[11px] text-forest">{rx.timing}</span>
                          </td>
                          <td className="py-3 px-3 text-ink/75">{rx.anupana}</td>
                          <td className="py-3 px-3 text-right font-mono">{rx.durationDays} Days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Vaidya Signature Mock */}
                <div className="pt-6 flex justify-between items-end text-xs font-mono text-ink/70">
                  <div>
                    <span>Pharmacopoeial Standard: Ayurvedic Pharmacopoeia of India (API)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-sanskrit text-sm text-forest block">वैद्य हस्ताक्षर</span>
                    <span className="font-bold text-deep-forest block">Dr. Lavesh Bohra, MD</span>
                    <span className="text-[10px] text-ink/50">Digital Seal Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIET & PATHYA */}
        {activeTab === 'diet' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-forest/10">
                <Leaf className="w-4 h-4 text-forest" />
                <h3 className="font-display text-lg text-deep-forest font-medium">
                  Wholesome Pathya (Foods to Favor)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs font-body text-ink/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                  <span>Warm Moong dal (green gram) soup boiled with ginger, cumin, and rock salt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                  <span>Old harvested Basmati rice, soft khichdi with 1/2 tsp cow ghee.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                  <span>Vegetables: Lauki (bottle gourd), Turai (ridge gourd), Parwal (pointed gourd).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                  <span>Warm boiled water with a pinch of dry ginger (Shunthi Jala) for all-day drinking.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-forest/10">
                <AlertCircle className="w-4 h-4 text-clay" />
                <h3 className="font-display text-lg text-deep-forest font-medium">
                  Harmful Apathya (Foods to Strictly Avoid)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs font-body text-ink/80">
                <li className="flex items-start gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-clay/10 text-clay flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✕</span>
                  <span>Curd (Yogurt) in all forms, especially at night (severely obstructs channels).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-clay/10 text-clay flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✕</span>
                  <span>Sour, fermented items: Vinegar, pickles, fermented batter (Idli/Dosa), stale leftovers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-clay/10 text-clay flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✕</span>
                  <span>Nightshades: Tomatoes, Eggplant (Brinjal), and excess red chilies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-clay/10 text-clay flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">✕</span>
                  <span>Daytime sleep (Divaswapna), which thickens Kapha and aggravates joint stiffness.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 5: DOSHA CONSTITUTION */}
        {activeTab === 'dosha' && (
          <div className="max-w-2xl bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-forest/10">
              <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-0.5">
                प्रकृति निदान · Constitutional Blueprint
              </span>
              <h2 className="font-display text-2xl text-deep-forest font-medium">
                Prakriti: {currentUser.prakriti}
              </h2>
              <p className="font-body text-xs text-ink/75 mt-1">
                Your innate biological constitution determined at birth, paired with your current
                pathological imbalance (Vikriti: {currentUser.vikriti}).
              </p>
            </div>

            {/* Visual Doshic Meters */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-forest font-semibold">Vata (वायु एवं आकाश)</span>
                  <span>52%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-forest/10 overflow-hidden">
                  <div className="h-full bg-forest" style={{ width: '52%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-turmeric font-semibold">Pitta (अग्नि एवं जल)</span>
                  <span>34%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-turmeric/10 overflow-hidden">
                  <div className="h-full bg-turmeric" style={{ width: '34%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-clay font-semibold">Kapha (जल एवं पृथ्वी)</span>
                  <span>14%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-clay/10 overflow-hidden">
                  <div className="h-full bg-clay" style={{ width: '14%' }} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-cream rounded-[4px] border border-forest/10 text-xs font-body text-ink/80 space-y-2">
              <span className="font-bold text-deep-forest block">Physician's Guidance for Vata-Pitta:</span>
              <p className="leading-relaxed">
                Your constitution combines the kinetic mobility and dryness of Vata with the sharp,
                metabolic heat of Pitta. Prioritize grounding warm oils (Snehana), structured sleep times,
                and sweet-bitter tastes while minimizing pungent spices and intense midday heat.
              </p>
            </div>

            <div className="pt-2">
              <Button href="/dosha-quiz" variant="secondary" className="text-xs">
                Retake Full 10-Question Dosha Quiz
              </Button>
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE EDIT */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="pb-4 border-b border-forest/10">
              <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block mb-0.5">
                रोगी विवरण · Demographic Profile
              </span>
              <h2 className="font-display text-2xl text-deep-forest font-medium">
                Edit Contact Details
              </h2>
            </div>

            {profileSaved && (
              <div className="p-3 bg-forest text-paper text-xs rounded-[3px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-turmeric" />
                <span>Changes saved to your digital medical record.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                    Mobile Number (Locked)
                  </label>
                  <input
                    type="text"
                    value={currentUser.phone}
                    disabled
                    className="w-full px-3.5 py-2 rounded-[3px] bg-cream/50 text-xs font-mono text-ink/50 border border-forest/10 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                  Postal Address
                </label>
                <textarea
                  rows={3}
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest resize-none"
                />
              </div>

              <Button type="submit" variant="primary" className="text-xs">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Profile Updates
              </Button>
            </form>
          </div>
        )}

        {/* RESCHEDULE MODAL */}
        <AnimatePresence>
          {rescheduleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-forest/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-paper border border-forest/20 rounded-[6px] p-6 max-w-md w-full shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-forest/10">
                  <h3 className="font-display text-lg text-deep-forest font-medium">
                    Reschedule Appointment
                  </h3>
                  <button onClick={() => setRescheduleModalOpen(false)} className="text-ink/40 hover:text-ink">
                    ✕
                  </button>
                </div>

                <p className="text-xs font-body text-ink/80">
                  Select a new date and available slot for your consultation with {nextAppointment.doctorName}.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                      New Date
                    </label>
                    <input
                      type="date"
                      value={rescheduleNewDate}
                      onChange={(e) => setRescheduleNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-deep-forest font-medium mb-1">
                      Available Slot
                    </label>
                    <select
                      value={rescheduleNewSlot}
                      onChange={(e) => setRescheduleNewSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15"
                    >
                      <option value="09:00 AM">09:00 AM (Morning Pulse)</option>
                      <option value="10:30 AM">10:30 AM (Morning Pulse)</option>
                      <option value="11:15 AM">11:15 AM (Morning Pulse)</option>
                      <option value="04:30 PM">04:30 PM (Evening Review)</option>
                      <option value="06:00 PM">06:00 PM (Evening Review)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-forest/10">
                  <Button onClick={() => setRescheduleModalOpen(false)} variant="secondary" className="text-xs">
                    Keep Current Slot
                  </Button>
                  <Button onClick={handleConfirmReschedule} variant="primary" className="text-xs bg-turmeric text-deep-forest hover:bg-turmeric/90">
                    Confirm Reschedule
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CANCEL MODAL */}
        <AnimatePresence>
          {cancelModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-forest/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-paper border border-clay/30 rounded-[6px] p-6 max-w-md w-full shadow-lg space-y-4"
              >
                <div className="flex items-center gap-2 text-clay pb-2 border-b border-forest/10">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-display text-lg font-medium text-deep-forest">
                    Cancel Appointment?
                  </h3>
                </div>

                <p className="text-xs font-body text-ink/80 leading-relaxed">
                  Are you sure you wish to cancel your scheduled appointment on{' '}
                  <strong>{nextAppointment.date} at {nextAppointment.slot}</strong>? Your reserved slot will
                  be released to waiting patients.
                </p>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-forest/10">
                  <Button onClick={() => setCancelModalOpen(false)} variant="secondary" className="text-xs">
                    Keep Appointment
                  </Button>
                  <Button onClick={handleConfirmCancel} variant="primary" className="text-xs bg-clay text-paper hover:bg-clay/90">
                    Yes, Cancel Slot
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
