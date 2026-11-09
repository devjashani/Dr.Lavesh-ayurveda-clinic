'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SEED_PATIENTS,
  SEED_APPOINTMENTS,
  CLASSICAL_MEDICINES,
  DOCTOR_SCHEDULES,
  DbPatient,
  DbAppointment,
  ClassicalMedicine,
  DoctorScheduleConfig,
} from '@/lib/data/mockSoftwareDb';
import { treatments } from '@/lib/data/treatments';
import { blogs } from '@/lib/data/blogs';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  FileText,
  Sparkles,
  BookOpen,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Activity,
  ChevronRight,
  ChevronDown,
  UserCheck,
  X,
  Shield,
  DollarSign,
  TrendingUp,
  Trash2,
  Eye,
  Menu,
  RefreshCw,
  Stethoscope,
  Pill,
  Check,
  Bed,
  ArrowUpRight,
  User,
  ShieldCheck,
  Send,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

type AdminRole = 'Admin' | 'Doctor' | 'Receptionist';
type ActiveTab =
  | 'overview'
  | 'appointments'
  | 'patients'
  | 'schedule'
  | 'prescriptions'
  | 'treatments'
  | 'blog'
  | 'settings';

export function AdminClient() {
  const [role, setRole] = useState<AdminRole>('Admin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Database states
  const [appointments, setAppointments] = useState<DbAppointment[]>(SEED_APPOINTMENTS);
  const [patients, setPatients] = useState<DbPatient[]>(SEED_PATIENTS);
  const [schedules, setSchedules] = useState<DoctorScheduleConfig[]>(DOCTOR_SCHEDULES);

  // Appointments Tab Filters
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState<string>('All');
  const [aptDoctorFilter, setAptDoctorFilter] = useState<string>('All');
  const [aptDateFilter, setAptDateFilter] = useState<'All' | 'Today' | 'Upcoming' | 'Past'>('All');
  const [isAptLoading, setIsAptLoading] = useState(false);

  // Patients Tab
  const [patientSearch, setPatientSearch] = useState('');
  const [patientPrakritiFilter, setPatientPrakritiFilter] = useState('All');
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<DbPatient | null>(null);
  const [newDoctorNote, setNewDoctorNote] = useState('');

  // Schedule Tab
  const [selectedDoctorSlug, setSelectedDoctorSlug] = useState('dr-lavesh-bohra');
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState('');

  // Prescription Builder Tab
  const [rxPatientId, setRxPatientId] = useState<string>(SEED_PATIENTS[0].id);
  const [rxDoctorSlug, setRxDoctorSlug] = useState('dr-lavesh-bohra');
  const [rxPulseGati, setRxPulseGati] = useState('Sarpa Gati (Vata-Pitta Pradhana)');
  const [rxAgniStatus, setRxAgniStatus] = useState('Vishamagni (Irregular & Bloating)');
  const [rxKoshtha, setRxKoshtha] = useState('Krura Koshtha (Vata Constipative)');
  const [rxItems, setRxItems] = useState<
    {
      medicineId: string;
      name: string;
      category: string;
      dosage: string;
      timing: string;
      anupana: string;
      durationDays: number;
    }[]
  >([
    {
      medicineId: 'med-1',
      name: 'Rasnadi Kashayam',
      category: 'Kashayam',
      dosage: '15 ml with 45 ml lukewarm water',
      timing: 'Before Meals',
      anupana: 'Lukewarm water + dry ginger',
      durationDays: 21,
    },
    {
      medicineId: 'med-4',
      name: 'Yogaraja Guggulu',
      category: 'Vati / Guggulu',
      dosage: '2 tablets twice daily',
      timing: 'After Meals',
      anupana: 'Warm water or Dashamula Kashayam',
      durationDays: 30,
    },
    {
      medicineId: 'med-7',
      name: 'Mahanarayana Taila',
      category: 'Taila',
      dosage: 'Gentle warm local application',
      timing: 'Before Morning Bath',
      anupana: 'Hot water fomentation post-application',
      durationDays: 30,
    },
  ]);
  const [rxPathya, setRxPathya] = useState(
    'Warm moong dal soup, light steamed vegetables, warm ginger water, early dinner before 7:30 PM, gentle 15-minute post-meal stroll.'
  );
  const [rxApathya, setRxApathya] = useState(
    'Raw salads, iced drinks, fermented batter (idli/dosa at night), excessive red chili, day-sleeping (Divaswapna), late night screen exposure.'
  );
  const [rxFollowUp, setRxFollowUp] = useState('Review in OPD after 21 days with joint mobility assessment');
  const [showPrintRxModal, setShowPrintRxModal] = useState(false);

  // Overview Chart Metric toggle
  const [chartMetric, setChartMetric] = useState<'volume' | 'revenue'>('volume');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Today string YYYY-MM-DD
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Derived today's stats
  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.date === todayStr);
  }, [appointments, todayStr]);

  const activeInpatientsCount = 6;
  const newPatientsThisWeek = 14;
  const monthlyRevenueInr = useMemo(() => {
    return appointments
      .filter((a) => a.status === 'Confirmed' || a.status === 'Completed')
      .reduce((sum, item) => sum + (item.feeInr || 1200), 0) + 345000; // includes treatments & pharmacy
  }, [appointments]);

  // Chart data: last 7 days + next 3 days
  const weeklyTrendData = [
    { day: 'Mon', appointments: 12, revenue: 14400, inClinic: 9, online: 3 },
    { day: 'Tue', appointments: 15, revenue: 19200, inClinic: 12, online: 3 },
    { day: 'Wed', appointments: 11, revenue: 13200, inClinic: 8, online: 3 },
    { day: 'Thu', appointments: 14, revenue: 18100, inClinic: 10, online: 4 },
    { day: 'Fri', appointments: 18, revenue: 23400, inClinic: 14, online: 4 },
    { day: 'Sat', appointments: 21, revenue: 28900, inClinic: 17, online: 4 },
    { day: 'Sun', appointments: 6, revenue: 8400, inClinic: 4, online: 2 },
  ];

  // Appointment Filtering
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        aptSearch.trim() === '' ||
        apt.patientName.toLowerCase().includes(aptSearch.toLowerCase()) ||
        apt.tokenNumber.toLowerCase().includes(aptSearch.toLowerCase()) ||
        apt.patientPhone.includes(aptSearch) ||
        apt.serviceName.toLowerCase().includes(aptSearch.toLowerCase());

      const matchesStatus = aptStatusFilter === 'All' || apt.status === aptStatusFilter;
      const matchesDoc = aptDoctorFilter === 'All' || apt.doctorSlug === aptDoctorFilter;

      let matchesDate = true;
      if (aptDateFilter === 'Today') {
        matchesDate = apt.date === todayStr;
      } else if (aptDateFilter === 'Upcoming') {
        matchesDate = apt.date >= todayStr;
      } else if (aptDateFilter === 'Past') {
        matchesDate = apt.date < todayStr;
      }

      return matchesSearch && matchesStatus && matchesDoc && matchesDate;
    });
  }, [appointments, aptSearch, aptStatusFilter, aptDoctorFilter, aptDateFilter, todayStr]);

  // Patients Filtering
  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => {
      const matchesSearch =
        patientSearch.trim() === '' ||
        pat.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        pat.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
        pat.phone.includes(patientSearch) ||
        pat.primaryDiagnosis.toLowerCase().includes(patientSearch.toLowerCase());

      const matchesPrakriti =
        patientPrakritiFilter === 'All' || pat.prakriti.includes(patientPrakritiFilter);

      return matchesSearch && matchesPrakriti;
    });
  }, [patients, patientSearch, patientPrakritiFilter]);

  // Appointment status changer handler
  const handleUpdateAppointmentStatus = (id: string, newStatus: DbAppointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  // WhatsApp quick trigger
  const handleTriggerWhatsApp = (apt: DbAppointment) => {
    const cleanPhone = apt.patientPhone.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Hari Om ${apt.patientName}, your appointment at Aarogyam Ayurveda is confirmed.\n\n` +
        `• Token: ${apt.tokenNumber}\n` +
        `• Vaidya: ${apt.doctorName}\n` +
        `• Service: ${apt.serviceName}\n` +
        `• Date: ${apt.date} at ${apt.slot}\n` +
        `• Mode: ${apt.mode === 'in-clinic' ? 'In-Clinic (Civil Lines, Jaipur)' : 'Online Video'}\n\n` +
        `Please arrive 10 minutes early. Contact: +91 141 239 8800.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  // Add clinical note to patient
  const handleAddDoctorNote = () => {
    if (!selectedPatientForDrawer || !newDoctorNote.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const newVisitEntry = {
      date: today,
      doctorName:
        role === 'Doctor' ? 'Dr. Lavesh Bohra' : 'Dr. Lavesh Bohra (Attending Vaidya)',
      diagnosis: selectedPatientForDrawer.primaryDiagnosis,
      pulseGati: 'Manduka Gati (Pitta Shamana noted, Agni stabilizing)',
      notes: newDoctorNote.trim(),
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === selectedPatientForDrawer.id) {
          const updated = {
            ...p,
            totalVisits: p.totalVisits + 1,
            lastVisitDate: today,
            pastVisits: [newVisitEntry, ...p.pastVisits],
          };
          setSelectedPatientForDrawer(updated);
          return updated;
        }
        return p;
      })
    );
    setNewDoctorNote('');
  };

  // Schedule toggle day
  const handleToggleScheduleDay = (
    doctorSlug: string,
    dayName: string,
    session: 'morning' | 'evening'
  ) => {
    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.doctorSlug !== doctorSlug) return sch;
        return {
          ...sch,
          weeklyAvailability: sch.weeklyAvailability.map((item) => {
            if (item.day !== dayName) return item;
            if (session === 'morning') {
              return { ...item, morningEnabled: !item.morningEnabled };
            } else {
              return { ...item, eveningEnabled: !item.eveningEnabled };
            }
          }),
        };
      })
    );
    setScheduleSuccessMsg('Schedule availability updated in local state');
    setTimeout(() => setScheduleSuccessMsg(''), 3000);
  };

  // Add blocked date
  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate || !newBlockedReason.trim()) return;
    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.doctorSlug !== selectedDoctorSlug) return sch;
        return {
          ...sch,
          blockedDates: [...sch.blockedDates, { date: newBlockedDate, reason: newBlockedReason.trim() }],
        };
      })
    );
    setNewBlockedDate('');
    setNewBlockedReason('');
    setScheduleSuccessMsg('Blocked date added successfully');
    setTimeout(() => setScheduleSuccessMsg(''), 3000);
  };

  // Delete blocked date
  const handleDeleteBlockedDate = (doctorSlug: string, dateStr: string) => {
    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.doctorSlug !== doctorSlug) return sch;
        return {
          ...sch,
          blockedDates: sch.blockedDates.filter((b) => b.date !== dateStr),
        };
      })
    );
  };

  // Prescription builder helpers
  const selectedRxPatient = useMemo(() => {
    return patients.find((p) => p.id === rxPatientId) || patients[0];
  }, [patients, rxPatientId]);

  const handleAddRxItem = () => {
    const med = CLASSICAL_MEDICINES[0];
    setRxItems((prev) => [
      ...prev,
      {
        medicineId: med.id,
        name: med.name,
        category: med.category,
        dosage: med.standardDosage,
        timing: med.defaultTiming,
        anupana: med.defaultAnupana,
        durationDays: 15,
      },
    ]);
  };

  const handleSelectMedInRow = (index: number, medId: string) => {
    const found = CLASSICAL_MEDICINES.find((m) => m.id === medId);
    if (!found) return;
    setRxItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        medicineId: found.id,
        name: found.name,
        category: found.category,
        dosage: found.standardDosage,
        timing: found.defaultTiming,
        anupana: found.defaultAnupana,
      };
      return copy;
    });
  };

  const handleRemoveRxItem = (index: number) => {
    setRxItems((prev) => prev.filter((_, i) => i !== index));
  };

  const simulateLoadingSkeleton = () => {
    setIsAptLoading(true);
    setTimeout(() => setIsAptLoading(false), 600);
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: appointments.length },
    { id: 'patients', label: 'Patients', icon: Users, badge: patients.length },
    { id: 'schedule', label: 'Schedule & Slots', icon: Clock, badge: null },
    { id: 'prescriptions', label: 'Prescription Builder', icon: FileText, badge: 'Rx' },
    { id: 'treatments', label: 'Therapies & Suites', icon: Sparkles, badge: treatments.length },
    { id: 'blog', label: 'Wisdom Blog', icon: BookOpen, badge: blogs.length },
    { id: 'settings', label: 'Clinic Settings', icon: Settings, badge: null },
  ] as const;

  return (
    <div className="bg-[#FAF7F0] min-h-screen text-ink flex flex-col font-sans">
      {/* Top Banner / Regulatory Bar */}
      <div className="bg-deep-forest text-cream text-[11px] py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-forest/30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-sage" />
            चिकित्सालय ईएमआर · Aarogyam Clinical EMR System
          </span>
          <span className="hidden sm:inline text-cream/40">•</span>
          <span className="hidden sm:inline text-cream/75">
            Registration: <strong>AYUSH-RJ-2018-0482</strong> (Jaipur, Rajasthan)
          </span>
        </div>
        <div className="flex items-center gap-4 text-cream/80 text-[10px] sm:text-[11px]">
          <span className="hidden md:inline font-mono">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-forest/80 text-cream border border-sage/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OPD Live
          </span>
        </div>
      </div>

      {/* Main Console Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-ink/50 backdrop-blur-xs z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#14291C] text-cream flex flex-col border-r border-forest/40 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-forest/40 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-forest/80 border border-sage/30 flex items-center justify-center text-turmeric font-serif font-bold text-lg shadow-inner">
                आ
              </div>
              <div>
                <div className="font-serif font-semibold text-sm tracking-tight text-cream">
                  Aarogyam EMR
                </div>
                <div className="text-[10px] text-sage tracking-wider uppercase">
                  Staff & Vaidya Console
                </div>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-cream/70 hover:text-cream p-1"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Role Badge */}
          <div className="px-4 py-3 bg-forest/20 border-b border-forest/30">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-sage uppercase font-mono tracking-wider text-[10px]">
                Active Role
              </span>
              <span className="text-turmeric font-medium text-[10px] font-mono">
                {role === 'Admin' ? 'Superadmin' : role === 'Doctor' ? 'Vaidya OPD' : 'Front Desk'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#1A3323] p-1.5 rounded-lg border border-forest/60">
              <div className="w-7 h-7 rounded-full bg-forest text-cream font-serif text-xs font-semibold flex items-center justify-center shrink-0">
                {role === 'Doctor' ? 'AB' : role === 'Admin' ? 'AD' : 'RD'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-cream truncate">
                  {role === 'Doctor'
                    ? 'Dr. Lavesh Bohra'
                    : role === 'Admin'
                    ? 'Administrator'
                    : 'Priya Sharma (Desk)'}
                </div>
                <div className="text-[10px] text-cream/60 truncate">
                  {role === 'Doctor'
                    ? 'Chief Vaidya · MD (Ayu)'
                    : role === 'Admin'
                    ? 'All Permissions Active'
                    : 'OPD Receptionist'}
                </div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              // Role restriction check for display
              const isRestrictedForReceptionist =
                role === 'Receptionist' && (item.id === 'settings' || item.id === 'blog');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as ActiveTab);
                    setSidebarOpen(false);
                  }}
                  disabled={isRestrictedForReceptionist}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sage/20 text-cream border-l-2 border-turmeric shadow-xs'
                      : isRestrictedForReceptionist
                      ? 'opacity-40 cursor-not-allowed text-cream/40'
                      : 'text-cream/75 hover:bg-forest/40 hover:text-cream'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-turmeric' : 'text-cream/60 group-hover:text-cream'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-turmeric text-deep-forest font-semibold'
                          : 'bg-forest/60 text-cream/70'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Exit to Public Website */}
          <div className="p-3 border-t border-forest/40 bg-forest/20 text-xs">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-forest/40 hover:bg-forest text-cream/80 hover:text-cream transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-sage" />
                View Public Site
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-cream/40" />
            </Link>
          </div>
        </aside>

        {/* Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9F4] overflow-y-auto">
          {/* Top Bar inside Content Area */}
          <header className="sticky top-0 z-30 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E8DFC9] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-ink/70 hover:bg-[#EAE2CE] transition-colors"
                aria-label="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-deep-forest tracking-tight flex items-center gap-2">
                  {navigationItems.find((n) => n.id === activeTab)?.label}
                  {activeTab === 'overview' && (
                    <span className="hidden sm:inline-block text-[11px] font-mono text-ink/60 font-normal">
                      · Daily OPD & Panchakarma Tracker
                    </span>
                  )}
                </h1>
              </div>
            </div>

            {/* Role Switcher Pills + Quick Action */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Toggle Switcher */}
              <div className="hidden sm:flex items-center bg-[#EAE2CE]/70 p-1 rounded-lg border border-[#DCD3BC] text-xs">
                <span className="text-[10px] text-ink/60 font-mono px-2 font-medium">Role:</span>
                {(['Admin', 'Doctor', 'Receptionist'] as AdminRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      role === r
                        ? 'bg-deep-forest text-cream shadow-2xs font-semibold'
                        : 'text-ink/70 hover:text-ink'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <button
                onClick={() => setActiveTab('prescriptions')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-deep-forest hover:bg-forest text-cream text-xs font-medium shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-turmeric" />
                <span className="hidden xs:inline">New</span> Prescription
              </button>
            </div>
          </header>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Today's Appointments */}
                <div className="bg-cream rounded-xl p-4 sm:p-5 border border-[#E8DFC9] shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-ink/60 font-medium mb-2">
                    <span>Today&apos;s Appointments</span>
                    <Calendar className="w-4 h-4 text-forest" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-deep-forest">
                      {todayAppointments.length > 0 ? todayAppointments.length : 8}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-medium">
                      +12% vs last Mon
                    </span>
                  </div>
                  <p className="text-[11px] text-ink/70 mt-2">
                    6 In-Clinic Pulse Consultations · 2 Online Tele-OPD
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#EAE2CE] flex items-center justify-between text-[11px]">
                    <span className="text-ink/60">Next slot: 11:15 AM</span>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-forest font-medium hover:underline flex items-center gap-0.5"
                    >
                      View queue <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 2. New Patients This Week */}
                <div className="bg-cream rounded-xl p-4 sm:p-5 border border-[#E8DFC9] shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-ink/60 font-medium mb-2">
                    <span>New Patients This Week</span>
                    <Users className="w-4 h-4 text-forest" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-deep-forest">
                      {newPatientsThisWeek}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-medium">
                      +18% MoM
                    </span>
                  </div>
                  <p className="text-[11px] text-ink/70 mt-2">
                    High intake for Amavata (Joint) & Psoriasis protocols
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#EAE2CE] flex items-center justify-between text-[11px]">
                    <span className="text-ink/60">{patients.length} Total Registered</span>
                    <button
                      onClick={() => setActiveTab('patients')}
                      className="text-forest font-medium hover:underline flex items-center gap-0.5"
                    >
                      Directory <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 3. Monthly Revenue */}
                <div className="bg-cream rounded-xl p-4 sm:p-5 border border-[#E8DFC9] shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-ink/60 font-medium mb-2">
                    <span>Monthly Clinical Revenue</span>
                    <DollarSign className="w-4 h-4 text-forest" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-deep-forest">
                      {role === 'Receptionist' ? '₹ Confidential' : `₹${monthlyRevenueInr.toLocaleString('en-IN')}`}
                    </span>
                    {role !== 'Receptionist' && (
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-medium">
                        +15.4%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink/70 mt-2">
                    {role === 'Receptionist'
                      ? 'Billing summary restricted to Administrator'
                      : 'OPD Consultations + Panchakarma + In-house Pharmacy'}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#EAE2CE] flex items-center justify-between text-[11px]">
                    <span className="text-ink/60">Target: ₹6,00,000</span>
                    <span className="font-mono text-turmeric font-semibold">81% Achieved</span>
                  </div>
                </div>

                {/* 4. Active Panchakarma / Inpatients */}
                <div className="bg-cream rounded-xl p-4 sm:p-5 border border-[#E8DFC9] shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-ink/60 font-medium mb-2">
                    <span>Active Detox & Inpatients</span>
                    <Bed className="w-4 h-4 text-forest" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-deep-forest">
                      {activeInpatientsCount}
                    </span>
                    <span className="text-[11px] font-mono text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded font-medium">
                      Suites 75% Full
                    </span>
                  </div>
                  <p className="text-[11px] text-ink/70 mt-2">
                    2 Shirodhara, 2 Kati Basti, 1 Janu Basti, 1 Virechana
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#EAE2CE] flex items-center justify-between text-[11px]">
                    <span className="text-ink/60">Dhanvantari Suite: Active</span>
                    <button
                      onClick={() => setActiveTab('treatments')}
                      className="text-forest font-medium hover:underline flex items-center gap-0.5"
                    >
                      Suites <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Performance Chart (Recharts) */}
              <div className="bg-cream rounded-xl p-5 border border-[#E8DFC9] shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-deep-forest">
                      7-Day Clinical Trend & Patient Inflow
                    </h2>
                    <p className="text-xs text-ink/65">
                      Weekly distribution of Nadi Pariksha consultations, Panchakarma therapies & tele-health
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#EAE2CE]/70 p-1 rounded-lg border border-[#DCD3BC] text-xs">
                    <button
                      onClick={() => setChartMetric('volume')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        chartMetric === 'volume'
                          ? 'bg-deep-forest text-cream shadow-2xs font-semibold'
                          : 'text-ink/70 hover:text-ink'
                      }`}
                    >
                      Appointment Volume
                    </button>
                    {role !== 'Receptionist' && (
                      <button
                        onClick={() => setChartMetric('revenue')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                          chartMetric === 'revenue'
                            ? 'bg-deep-forest text-cream shadow-2xs font-semibold'
                            : 'text-ink/70 hover:text-ink'
                        }`}
                      >
                        Revenue (₹)
                      </button>
                    )}
                  </div>
                </div>

                {/* Recharts chart area */}
                <div className="h-64 sm:h-72 w-full">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      {chartMetric === 'volume' ? (
                        <BarChart
                          data={weeklyTrendData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#EAE2CE" vertical={false} />
                          <XAxis
                            dataKey="day"
                            stroke="#5C5C54"
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: '#DCD3BC' }}
                          />
                          <YAxis
                            stroke="#5C5C54"
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: '#DCD3BC' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FBF9F4',
                              borderColor: '#DCD3BC',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                              fontSize: '12px',
                            }}
                          />
                          <Bar
                            dataKey="inClinic"
                            name="In-Clinic"
                            fill="#1F3D2B"
                            radius={[4, 4, 0, 0]}
                            stackId="a"
                          />
                          <Bar
                            dataKey="online"
                            name="Online Video"
                            fill="#8FA68A"
                            radius={[4, 4, 0, 0]}
                            stackId="a"
                          />
                        </BarChart>
                      ) : (
                        <AreaChart
                          data={weeklyTrendData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D99A2B" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#D99A2B" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#EAE2CE" vertical={false} />
                          <XAxis
                            dataKey="day"
                            stroke="#5C5C54"
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: '#DCD3BC' }}
                          />
                          <YAxis
                            stroke="#5C5C54"
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: '#DCD3BC' }}
                            tickFormatter={(val) => `₹${val / 1000}k`}
                          />
                          <Tooltip
                            formatter={(val: any) => [
                              `₹${Number(val || 0).toLocaleString('en-IN')}`,
                              'Daily Revenue',
                            ]}
                            contentStyle={{
                              backgroundColor: '#FBF9F4',
                              borderColor: '#DCD3BC',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#D99A2B"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorRev)"
                          />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full bg-[#EAE2CE]/40 animate-pulse rounded-lg flex items-center justify-center text-xs text-ink/40">
                      Loading interactive clinical analytics...
                    </div>
                  )}
                </div>
              </div>

              {/* Today's Live OPD Queue (Upcoming List) */}
              <div className="bg-cream rounded-xl p-5 border border-[#E8DFC9] shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-serif text-base font-bold text-deep-forest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Live OPD Consultation Queue
                    </h3>
                    <p className="text-xs text-ink/65">
                      Patients scheduled for today · Click &apos;Call In&apos; to begin pulse diagnosis
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs text-forest font-medium hover:underline flex items-center gap-1"
                    >
                      View all {appointments.length} appointments <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[#EAE2CE] overflow-x-auto">
                  {todayAppointments.slice(0, 5).map((apt, idx) => (
                    <div
                      key={apt.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5EFE1]/50 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-forest/10 text-deep-forest font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-deep-forest">
                              {apt.patientName}
                            </span>
                            <span className="text-[10px] font-mono bg-paper px-1.5 py-0.5 rounded border border-[#E8DFC9] text-ink/70">
                              {apt.tokenNumber}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                apt.mode === 'in-clinic'
                                  ? 'bg-sage/20 text-forest'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {apt.mode === 'in-clinic' ? 'In-Clinic' : 'Online Video'}
                            </span>
                          </div>
                          <div className="text-xs text-ink/70 flex flex-wrap items-center gap-2 mt-0.5">
                            <span>{apt.serviceName}</span>
                            <span>•</span>
                            <span className="font-mono text-ink/80">{apt.slot}</span>
                            <span>•</span>
                            <span className="text-ink/60">{apt.doctorName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium font-mono ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'Completed'
                              ? 'bg-gray-100 text-gray-700'
                              : apt.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {apt.status}
                        </span>

                        <button
                          onClick={() => handleUpdateAppointmentStatus(apt.id, 'Completed')}
                          className="px-2.5 py-1 rounded bg-[#EAE2CE] hover:bg-[#DCD3BC] text-xs font-medium text-deep-forest transition-colors"
                        >
                          {apt.status === 'Completed' ? 'Done' : 'Mark Completed'}
                        </button>

                        <button
                          onClick={() => handleTriggerWhatsApp(apt)}
                          title="Send WhatsApp Token Message"
                          className="p-1.5 rounded bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4">
              {/* Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-cream p-4 rounded-xl border border-[#E8DFC9] shadow-2xs">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={aptSearch}
                    onChange={(e) => setAptSearch(e.target.value)}
                    placeholder="Search patient, token, phone, therapy..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#FBF9F4] border border-[#DCD3BC] text-xs focus:outline-none focus:border-forest"
                  />
                  {aptSearch && (
                    <button
                      onClick={() => setAptSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Status Dropdown */}
                  <select
                    value={aptStatusFilter}
                    onChange={(e) => setAptStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FBF9F4] border border-[#DCD3BC] text-xs text-ink/80 focus:outline-none"
                  >
                    <option value="All">All Statuses ({appointments.length})</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* Doctor Dropdown */}
                  <select
                    value={aptDoctorFilter}
                    onChange={(e) => setAptDoctorFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FBF9F4] border border-[#DCD3BC] text-xs text-ink/80 focus:outline-none"
                  >
                    <option value="All">All Vaidyas</option>
                    <option value="dr-lavesh-bohra">Dr. Lavesh Bohra</option>
                    <option value="dr-ananya-sharma">Dr. Ananya Sharma</option>
                  </select>

                  {/* Date Filter */}
                  <div className="flex items-center bg-[#EAE2CE]/70 p-0.5 rounded-lg border border-[#DCD3BC]">
                    {(['All', 'Today', 'Upcoming', 'Past'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setAptDateFilter(d)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                          aptDateFilter === d
                            ? 'bg-deep-forest text-cream shadow-2xs font-semibold'
                            : 'text-ink/70 hover:text-ink'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Skeleton simulator button */}
                  <button
                    onClick={simulateLoadingSkeleton}
                    title="Test Loading Skeleton UI"
                    className="p-1.5 rounded-lg bg-[#EAE2CE] hover:bg-[#DCD3BC] text-deep-forest transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Table / List */}
              <div className="bg-cream rounded-xl border border-[#E8DFC9] shadow-2xs overflow-hidden">
                {isAptLoading ? (
                  // Skeleton State
                  <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-[#EAE2CE]/50 rounded-lg animate-pulse flex items-center justify-between px-4"
                      >
                        <div className="w-24 h-4 bg-[#DCD3BC] rounded" />
                        <div className="w-36 h-4 bg-[#DCD3BC] rounded" />
                        <div className="w-28 h-4 bg-[#DCD3BC] rounded" />
                        <div className="w-16 h-4 bg-[#DCD3BC] rounded" />
                      </div>
                    ))}
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  // Empty State
                  <div className="py-16 text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-[#EAE2CE] text-ink/40 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-deep-forest">
                      No matching appointments found
                    </h3>
                    <p className="text-xs text-ink/65 mt-1 max-w-sm mx-auto">
                      Try resetting your search query or switching your status/date filters to view
                      more clinical records.
                    </p>
                    <button
                      onClick={() => {
                        setAptSearch('');
                        setAptStatusFilter('All');
                        setAptDoctorFilter('All');
                        setAptDateFilter('All');
                      }}
                      className="mt-4 px-3 py-1.5 rounded-lg bg-deep-forest text-cream text-xs font-medium hover:bg-forest transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  // Full Table View (Desktop & Responsive)
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF7F0] border-b border-[#E8DFC9] text-ink/70 font-mono text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 font-semibold">Token</th>
                          <th className="py-3 px-4 font-semibold">Patient</th>
                          <th className="py-3 px-4 font-semibold">Therapy & Mode</th>
                          <th className="py-3 px-4 font-semibold">Doctor</th>
                          <th className="py-3 px-4 font-semibold">Date & Slot</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE2CE]">
                        {filteredAppointments.map((apt) => (
                          <tr
                            key={apt.id}
                            className="hover:bg-[#F5EFE1]/40 transition-colors group"
                          >
                            {/* Token */}
                            <td className="py-3 px-4 font-mono font-bold text-deep-forest">
                              {apt.tokenNumber}
                            </td>

                            {/* Patient */}
                            <td className="py-3 px-4">
                              <div className="font-medium text-deep-forest text-xs sm:text-sm">
                                {apt.patientName}
                              </div>
                              <div className="text-[11px] text-ink/60 font-mono">
                                {apt.patientAge}y · {apt.patientGender} · {apt.patientPhone}
                              </div>
                            </td>

                            {/* Therapy & Mode */}
                            <td className="py-3 px-4">
                              <div className="text-xs font-medium text-ink/90">
                                {apt.serviceName}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-ink/60 mt-0.5">
                                {apt.mode === 'in-clinic' ? (
                                  <span className="inline-flex items-center gap-1 text-forest">
                                    <Building className="w-3 h-3" /> In-Clinic
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-blue-700">
                                    <Activity className="w-3 h-3" /> Online Video
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Doctor */}
                            <td className="py-3 px-4 text-ink/80">{apt.doctorName}</td>

                            {/* Date & Slot */}
                            <td className="py-3 px-4">
                              <div className="font-mono text-ink/90 font-medium">{apt.date}</div>
                              <div className="text-[11px] text-ink/60">{apt.slot}</div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              <select
                                value={apt.status}
                                onChange={(e) =>
                                  handleUpdateAppointmentStatus(
                                    apt.id,
                                    e.target.value as DbAppointment['status']
                                  )
                                }
                                className={`text-[11px] font-medium font-mono px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${
                                  apt.status === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : apt.status === 'Completed'
                                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                                    : apt.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleTriggerWhatsApp(apt)}
                                  title="Send WhatsApp confirmation & reminder"
                                  className="p-1.5 rounded-md bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    const matched = patients.find((p) => p.name === apt.patientName);
                                    if (matched) {
                                      setSelectedPatientForDrawer(matched);
                                      setActiveTab('patients');
                                    }
                                  }}
                                  title="Open Patient EMR Record"
                                  className="p-1.5 rounded-md bg-[#EAE2CE] hover:bg-[#DCD3BC] text-deep-forest transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footer Count */}
                <div className="p-3 bg-[#FAF7F0] border-t border-[#E8DFC9] text-xs text-ink/65 flex items-center justify-between">
                  <span>
                    Showing <strong>{filteredAppointments.length}</strong> of{' '}
                    <strong>{appointments.length}</strong> total appointments
                  </span>
                  <span className="font-mono text-[11px]">Database: SEED_APPOINTMENTS</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PATIENTS & CLINICAL DRAWER */}
          {activeTab === 'patients' && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4">
              {/* Header & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream p-4 rounded-xl border border-[#E8DFC9] shadow-2xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Search by name, ID (e.g. ARG-2026-0101), phone, diagnosis..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#FBF9F4] border border-[#DCD3BC] text-xs focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink/60 font-mono">Prakriti:</span>
                  <select
                    value={patientPrakritiFilter}
                    onChange={(e) => setPatientPrakritiFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FBF9F4] border border-[#DCD3BC] text-xs text-ink/80 focus:outline-none"
                  >
                    <option value="All">All Prakritis</option>
                    <option value="Vata">Vata Dominant</option>
                    <option value="Pitta">Pitta Dominant</option>
                    <option value="Kapha">Kapha Dominant</option>
                  </select>
                </div>
              </div>

              {/* Patients Grid / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPatients.map((pat) => (
                  <div
                    key={pat.id}
                    onClick={() => setSelectedPatientForDrawer(pat)}
                    className="bg-cream rounded-xl p-4 border border-[#E8DFC9] hover:border-forest/50 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-serif font-bold text-sm sm:text-base text-deep-forest group-hover:text-forest transition-colors">
                            {pat.name}
                          </h3>
                          <span className="font-mono text-[10px] text-ink/60 bg-[#FAF7F0] px-1.5 py-0.5 rounded border border-[#E8DFC9]">
                            {pat.patientId}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-sage/20 text-forest font-semibold">
                          {pat.prakriti}
                        </span>
                      </div>

                      <div className="text-xs text-ink/75 space-y-1 mb-3">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-ink/55">Demographics:</span>
                          <span className="font-mono">
                            {pat.age}y · {pat.gender} · {pat.bloodGroup}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-ink/55">City:</span>
                          <span>{pat.city}</span>
                        </div>
                        <div className="text-[11px] pt-1 border-t border-[#EAE2CE]">
                          <span className="text-ink/55">Primary Diagnosis: </span>
                          <span className="font-medium text-deep-forest">
                            {pat.primaryDiagnosis}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#EAE2CE] flex items-center justify-between text-[10px] font-mono text-ink/60">
                      <span>Total Visits: {pat.totalVisits}</span>
                      <span className="text-forest font-sans flex items-center gap-0.5 font-medium group-hover:underline">
                        Open Chart <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Patient Clinical Drawer Modal */}
              <AnimatePresence>
                {selectedPatientForDrawer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex justify-end"
                  >
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="w-full max-w-2xl bg-[#FBF9F4] h-full shadow-2xl overflow-y-auto flex flex-col border-l border-[#E8DFC9]"
                    >
                      {/* Drawer Header */}
                      <div className="sticky top-0 bg-deep-forest text-cream p-4 sm:p-5 flex items-center justify-between z-10">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-serif text-lg sm:text-xl font-bold">
                              {selectedPatientForDrawer.name}
                            </h2>
                            <span className="text-xs font-mono bg-forest/80 px-2 py-0.5 rounded text-turmeric border border-sage/30">
                              {selectedPatientForDrawer.patientId}
                            </span>
                          </div>
                          <p className="text-xs text-sage mt-0.5">
                            {selectedPatientForDrawer.age}y · {selectedPatientForDrawer.gender} ·{' '}
                            {selectedPatientForDrawer.bloodGroup} · {selectedPatientForDrawer.phone}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedPatientForDrawer(null)}
                          className="text-cream/70 hover:text-cream p-1.5 rounded-lg hover:bg-forest/50 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Drawer Body */}
                      <div className="p-4 sm:p-6 space-y-6 flex-1 text-xs">
                        {/* Ayurvedic Diagnostic Assessment */}
                        <div className="bg-cream rounded-xl p-4 border border-[#E8DFC9] space-y-3">
                          <h4 className="font-serif font-bold text-sm text-deep-forest flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-forest" />
                            Ayurvedic Constitutional Assessment
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                            <div className="p-2 rounded bg-paper border border-[#E8DFC9]">
                              <span className="text-[10px] text-ink/55 block">Prakriti (Birth)</span>
                              <span className="font-semibold text-deep-forest text-xs">
                                {selectedPatientForDrawer.prakriti}
                              </span>
                            </div>
                            <div className="p-2 rounded bg-paper border border-[#E8DFC9]">
                              <span className="text-[10px] text-ink/55 block">Vikriti (Imbalance)</span>
                              <span className="font-semibold text-amber-900 text-xs">
                                {selectedPatientForDrawer.vikriti}
                              </span>
                            </div>
                            <div className="p-2 rounded bg-paper border border-[#E8DFC9]">
                              <span className="text-[10px] text-ink/55 block">Registered Date</span>
                              <span className="font-semibold text-ink/80 text-xs">
                                {selectedPatientForDrawer.registeredDate}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#EAE2CE]">
                            <span className="text-[11px] text-ink/55 font-mono">Sanskrit Diagnosis:</span>
                            <div className="font-serif text-sm font-semibold text-deep-forest mt-0.5">
                              {selectedPatientForDrawer.sanskritDiagnosis}
                            </div>
                            <p className="text-ink/75 mt-1">
                              {selectedPatientForDrawer.clinicalNotes}
                            </p>
                          </div>
                        </div>

                        {/* Active Prescriptions */}
                        <div className="bg-cream rounded-xl p-4 border border-[#E8DFC9]">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-serif font-bold text-sm text-deep-forest flex items-center gap-1.5">
                              <Pill className="w-4 h-4 text-forest" />
                              Active Prescriptions & Herbals
                            </h4>
                            <button
                              onClick={() => {
                                setRxPatientId(selectedPatientForDrawer.id);
                                setSelectedPatientForDrawer(null);
                                setActiveTab('prescriptions');
                              }}
                              className="text-[11px] text-forest font-medium hover:underline flex items-center gap-0.5"
                            >
                              Open in Rx Builder <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {selectedPatientForDrawer.activePrescriptions.map((rx, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-lg bg-paper border border-[#E8DFC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="font-semibold text-deep-forest">
                                    {rx.medicineName}
                                  </div>
                                  <div className="text-[11px] text-ink/70">
                                    {rx.dosage} · <span className="font-medium">{rx.timing}</span>
                                  </div>
                                  <div className="text-[10px] text-ink/55 font-mono">
                                    Anupana: {rx.anupana}
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sage/20 text-forest shrink-0">
                                  {rx.durationDays} Days
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Past Clinical Visits Timeline */}
                        <div className="bg-cream rounded-xl p-4 border border-[#E8DFC9] space-y-3">
                          <h4 className="font-serif font-bold text-sm text-deep-forest flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-forest" />
                            Consultation History & Pulse Records
                          </h4>
                          <div className="space-y-3 relative pl-4 border-l-2 border-sage/40">
                            {selectedPatientForDrawer.pastVisits.map((visit, i) => (
                              <div key={i} className="relative group">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-forest border-2 border-cream" />
                                <div className="text-[11px] font-mono text-ink/55">
                                  {visit.date} · {visit.doctorName}
                                </div>
                                <div className="font-semibold text-deep-forest mt-0.5">
                                  {visit.diagnosis}
                                </div>
                                <div className="text-[11px] font-mono text-turmeric bg-deep-forest/5 p-1 rounded mt-1">
                                  Pulse Note: {visit.pulseGati}
                                </div>
                                <p className="text-ink/75 mt-1 text-[11px] italic">
                                  &ldquo;{visit.notes}&rdquo;
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Live Add Clinical Note Pad */}
                        <div className="bg-cream rounded-xl p-4 border border-[#E8DFC9] space-y-2">
                          <h4 className="font-serif font-bold text-sm text-deep-forest">
                            Add New Clinical Consultation Note
                          </h4>
                          <textarea
                            value={newDoctorNote}
                            onChange={(e) => setNewDoctorNote(e.target.value)}
                            rows={3}
                            placeholder="Enter clinical observations, pulse changes (Gati), Ama reduction, or tongue findings..."
                            className="w-full p-2.5 rounded-lg bg-paper border border-[#DCD3BC] text-xs focus:outline-none focus:border-forest"
                          />
                          <button
                            onClick={handleAddDoctorNote}
                            disabled={!newDoctorNote.trim()}
                            className="px-3 py-1.5 rounded-lg bg-deep-forest text-cream text-xs font-medium hover:bg-forest disabled:opacity-40 transition-colors"
                          >
                            Append Note to Patient Record
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 4: SCHEDULE & SLOTS */}
          {activeTab === 'schedule' && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
              {/* Doctor Selector */}
              <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base font-bold text-deep-forest">
                    Weekly Vaidya Availability & Slot Configuration
                  </h2>
                  <p className="text-xs text-ink/65">
                    Configure daily morning and evening consultation sessions for in-clinic and online queues
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink/60 font-mono">Select Doctor:</span>
                  <select
                    value={selectedDoctorSlug}
                    onChange={(e) => setSelectedDoctorSlug(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[#FBF9F4] border border-[#DCD3BC] text-xs font-semibold text-deep-forest focus:outline-none"
                  >
                    <option value="dr-lavesh-bohra">Dr. Lavesh Bohra (Chief Vaidya)</option>
                    <option value="dr-ananya-sharma">Dr. Ananya Sharma (Prasuti & Stri)</option>
                  </select>
                </div>
              </div>

              {scheduleSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{scheduleSuccessMsg}</span>
                </div>
              )}

              {/* Weekly Schedule Days Table */}
              <div className="bg-cream rounded-xl border border-[#E8DFC9] shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-[#E8DFC9] bg-[#FAF7F0] flex items-center justify-between">
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-deep-forest">
                    Weekly Days (Mon – Sun)
                  </span>
                  <span className="text-[11px] font-mono text-ink/60">
                    Sundays: Strictly by prior appointment only
                  </span>
                </div>
                <div className="divide-y divide-[#EAE2CE]">
                  {schedules
                    .find((s) => s.doctorSlug === selectedDoctorSlug)
                    ?.weeklyAvailability.map((avail) => (
                      <div
                        key={avail.day}
                        className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#F5EFE1]/30 transition-colors text-xs"
                      >
                        <div className="w-32 font-semibold text-deep-forest text-sm">
                          {avail.day}
                        </div>

                        {/* Morning Slot Switch */}
                        <div className="flex-1 flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={avail.morningEnabled}
                              onChange={() =>
                                handleToggleScheduleDay(selectedDoctorSlug, avail.day, 'morning')
                              }
                              className="rounded text-forest focus:ring-forest cursor-pointer"
                            />
                            <span className="font-medium text-ink/80">Morning Session</span>
                          </label>
                          <span className="font-mono text-xs text-ink/60 bg-paper px-2 py-0.5 rounded border border-[#E8DFC9]">
                            {avail.morningEnabled ? avail.morningHours || '09:00 AM – 01:30 PM' : 'Disabled'}
                          </span>
                        </div>

                        {/* Evening Slot Switch */}
                        <div className="flex-1 flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={avail.eveningEnabled}
                              onChange={() =>
                                handleToggleScheduleDay(selectedDoctorSlug, avail.day, 'evening')
                              }
                              className="rounded text-forest focus:ring-forest cursor-pointer"
                            />
                            <span className="font-medium text-ink/80">Evening Session</span>
                          </label>
                          <span className="font-mono text-xs text-ink/60 bg-paper px-2 py-0.5 rounded border border-[#E8DFC9]">
                            {avail.eveningEnabled ? avail.eveningHours || '04:30 PM – 07:30 PM' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Blackout Dates / Leave Manager */}
              <div className="bg-cream rounded-xl p-5 border border-[#E8DFC9] shadow-2xs space-y-4">
                <h3 className="font-serif text-base font-bold text-deep-forest flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-turmeric" />
                  Doctor Leave & Blackout Dates (Auto-Disables Booking)
                </h3>
                <p className="text-xs text-ink/65">
                  Dates blocked here are immediately disabled on the public calendar to prevent double-booking.
                </p>

                {/* Add Date Form */}
                <form
                  onSubmit={handleAddBlockedDate}
                  className="flex flex-col sm:flex-row items-center gap-3 pt-2"
                >
                  <input
                    type="date"
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-paper border border-[#DCD3BC] text-xs focus:outline-none focus:border-forest font-mono"
                    required
                  />
                  <input
                    type="text"
                    value={newBlockedReason}
                    onChange={(e) => setNewBlockedReason(e.target.value)}
                    placeholder="Reason (e.g. National Ayurveda Congress / Emergency)"
                    className="w-full flex-1 px-3 py-1.5 rounded-lg bg-paper border border-[#DCD3BC] text-xs focus:outline-none focus:border-forest"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-deep-forest text-cream text-xs font-medium hover:bg-forest transition-colors whitespace-nowrap"
                  >
                    + Block Date
                  </button>
                </form>

                {/* Existing Blocked Dates */}
                <div className="divide-y divide-[#EAE2CE] pt-3">
                  {schedules
                    .find((s) => s.doctorSlug === selectedDoctorSlug)
                    ?.blockedDates.map((block) => (
                      <div
                        key={block.date}
                        className="py-2.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-semibold text-deep-forest bg-paper px-2 py-0.5 rounded border border-[#E8DFC9]">
                            {block.date}
                          </span>
                          <span className="text-ink/80">{block.reason}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteBlockedDate(selectedDoctorSlug, block.date)}
                          className="text-rose-700 hover:text-rose-900 p-1 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRESCRIPTION BUILDER */}
          {activeTab === 'prescriptions' && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
              {/* Header */}
              <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-deep-forest flex items-center gap-2">
                    <FileText className="w-5 h-5 text-forest" />
                    Classical Ayurvedic Prescription Builder
                  </h2>
                  <p className="text-xs text-ink/65">
                    Select herbs & classical Rasayanas from Samhita formulary, specify Anupana & Pathya, and generate official printable PDF letterhead.
                  </p>
                </div>
                <button
                  onClick={() => setShowPrintRxModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest hover:bg-deep-forest text-cream text-xs font-semibold shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4 text-turmeric" />
                  Generate Printable Prescription PDF
                </button>
              </div>

              {/* Top Controls: Patient & Doctor Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select Patient */}
                <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] space-y-2">
                  <label className="block text-xs font-semibold text-deep-forest">
                    Select Patient Record:
                  </label>
                  <select
                    value={rxPatientId}
                    onChange={(e) => setRxPatientId(e.target.value)}
                    className="w-full p-2 rounded-lg bg-paper border border-[#DCD3BC] text-xs font-medium text-deep-forest focus:outline-none"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patientId}) · {p.age}y {p.gender} · {p.primaryDiagnosis}
                      </option>
                    ))}
                  </select>
                  <div className="text-[11px] text-ink/60 font-mono flex items-center justify-between pt-1">
                    <span>Phone: {selectedRxPatient.phone}</span>
                    <span>Prakriti: {selectedRxPatient.prakriti}</span>
                  </div>
                </div>

                {/* Attending Vaidya & Date */}
                <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] space-y-2">
                  <label className="block text-xs font-semibold text-deep-forest">
                    Attending Vaidya:
                  </label>
                  <select
                    value={rxDoctorSlug}
                    onChange={(e) => setRxDoctorSlug(e.target.value)}
                    className="w-full p-2 rounded-lg bg-paper border border-[#DCD3BC] text-xs font-medium text-deep-forest focus:outline-none"
                  >
                    <option value="dr-lavesh-bohra">
                      Dr. Lavesh Bohra, BAMS, MD (Kayachikitsa), PhD · AYUSH-RJ-1999-4081
                    </option>
                    <option value="dr-ananya-sharma">
                      Dr. Ananya Sharma, BAMS, MS (Prasuti & Stri) · AYUSH-RJ-2012-7712
                    </option>
                  </select>
                  <div className="text-[11px] text-ink/60 font-mono flex items-center justify-between pt-1">
                    <span>Hospital Reg: AYUSH-RJ-2018-0482</span>
                    <span>Date: {todayStr}</span>
                  </div>
                </div>
              </div>

              {/* Nadi Pariksha & Agni Assessment Section */}
              <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] space-y-3">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-deep-forest">
                  Clinical Examination & Pulse (Nadi) Assessment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-ink/60 font-mono mb-1">
                      Nadi Gati (Pulse Velocity):
                    </label>
                    <select
                      value={rxPulseGati}
                      onChange={(e) => setRxPulseGati(e.target.value)}
                      className="w-full p-2 rounded-lg bg-paper border border-[#DCD3BC] text-xs focus:outline-none"
                    >
                      <option value="Sarpa Gati (Vata-Pitta Pradhana)">Sarpa Gati (Serpentine / Vata)</option>
                      <option value="Manduka Gati (Pitta-Kapha Pradhana)">Manduka Gati (Froglike / Pitta)</option>
                      <option value="Hamsa Gati (Kapha Pradhana)">Hamsa Gati (Swanlike / Kapha)</option>
                      <option value="Sannipatika Gati (Tridosha Imbalance)">Sannipatika Gati (Tridoshic)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-ink/60 font-mono mb-1">
                      Agni Status (Digestive Furnace):
                    </label>
                    <select
                      value={rxAgniStatus}
                      onChange={(e) => setRxAgniStatus(e.target.value)}
                      className="w-full p-2 rounded-lg bg-paper border border-[#DCD3BC] text-xs focus:outline-none"
                    >
                      <option value="Vishamagni (Irregular & Bloating)">Vishamagni (Irregular / Vata)</option>
                      <option value="Tikshnagni (Hyperactive & Acidity)">Tikshnagni (Hyper / Pitta)</option>
                      <option value="Mandagni (Sluggish & Heaviness)">Mandagni (Sluggish / Kapha)</option>
                      <option value="Samagni (Balanced & Effortless)">Samagni (Balanced)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-ink/60 font-mono mb-1">
                      Koshtha (Bowel Habit):
                    </label>
                    <select
                      value={rxKoshtha}
                      onChange={(e) => setRxKoshtha(e.target.value)}
                      className="w-full p-2 rounded-lg bg-paper border border-[#DCD3BC] text-xs focus:outline-none"
                    >
                      <option value="Krura Koshtha (Vata Constipative)">Krura Koshtha (Hard / Dry)</option>
                      <option value="Mridu Koshtha (Pitta Loose)">Mridu Koshtha (Soft / Rapid)</option>
                      <option value="Madhyama Koshtha (Balanced Normal)">Madhyama Koshtha (Normal)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Classical Medicines Table */}
              <div className="bg-cream rounded-xl border border-[#E8DFC9] shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-[#E8DFC9] bg-[#FAF7F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-deep-forest">
                      Prescribed Formulations ({rxItems.length})
                    </span>
                    <span className="text-[10px] bg-paper px-2 py-0.5 rounded border border-[#E8DFC9] font-mono">
                      40+ Classical Formulations Available
                    </span>
                  </div>
                  <button
                    onClick={handleAddRxItem}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-deep-forest text-cream text-xs font-medium hover:bg-forest transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-turmeric" /> Add Medicine
                  </button>
                </div>

                <div className="divide-y divide-[#EAE2CE] overflow-x-auto">
                  {rxItems.map((item, idx) => (
                    <div key={idx} className="p-4 space-y-3 bg-cream text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 rounded-full bg-forest text-cream font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <select
                            value={item.medicineId}
                            onChange={(e) => handleSelectMedInRow(idx, e.target.value)}
                            className="w-full max-w-sm p-1.5 rounded-lg bg-paper border border-[#DCD3BC] text-xs font-semibold text-deep-forest focus:outline-none"
                          >
                            {CLASSICAL_MEDICINES.map((med) => (
                              <option key={med.id} value={med.id}>
                                {med.name} ({med.category}) · {med.indications}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleRemoveRxItem(idx)}
                          className="self-end sm:self-center text-rose-700 hover:text-rose-900 p-1 flex items-center gap-1 text-[11px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      {/* Row Inputs: Dosage, Timing, Anupana, Duration */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[10px] text-ink/55 font-mono block mb-1">
                            Dosage (मात्रा):
                          </label>
                          <input
                            type="text"
                            value={item.dosage}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRxItems((prev) => {
                                const copy = [...prev];
                                copy[idx].dosage = val;
                                return copy;
                              });
                            }}
                            className="w-full p-1.5 rounded bg-paper border border-[#DCD3BC] text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-ink/55 font-mono block mb-1">
                            Timing (सेवन काल):
                          </label>
                          <select
                            value={item.timing}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRxItems((prev) => {
                                const copy = [...prev];
                                copy[idx].timing = val;
                                return copy;
                              });
                            }}
                            className="w-full p-1.5 rounded bg-paper border border-[#DCD3BC] text-xs"
                          >
                            <option value="Before Meals">Before Meals (प्राग्भक्त)</option>
                            <option value="After Meals">After Meals (पश्चाद्भक्त)</option>
                            <option value="Sunrise on Empty Stomach">Sunrise Empty Stomach (उषःपान)</option>
                            <option value="At Bedtime">At Bedtime (निशि)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-ink/55 font-mono block mb-1">
                            Anupana (अनुपान):
                          </label>
                          <input
                            type="text"
                            value={item.anupana}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRxItems((prev) => {
                                const copy = [...prev];
                                copy[idx].anupana = val;
                                return copy;
                              });
                            }}
                            className="w-full p-1.5 rounded bg-paper border border-[#DCD3BC] text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-ink/55 font-mono block mb-1">
                            Duration (Days):
                          </label>
                          <input
                            type="number"
                            value={item.durationDays}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 15;
                              setRxItems((prev) => {
                                const copy = [...prev];
                                copy[idx].durationDays = val;
                                return copy;
                              });
                            }}
                            className="w-full p-1.5 rounded bg-paper border border-[#DCD3BC] text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathya (DOs) & Apathya (DON'Ts) Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] space-y-2">
                  <label className="block text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Pathya (Wholesome Diet & Lifestyle Guidelines):
                  </label>
                  <textarea
                    rows={3}
                    value={rxPathya}
                    onChange={(e) => setRxPathya(e.target.value)}
                    className="w-full p-2 rounded-lg bg-paper border border-[#DCD3BC] text-xs focus:outline-none"
                  />
                </div>
                <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] space-y-2">
                  <label className="block text-xs font-semibold text-rose-800 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Apathya (Unwholesome Diet & Habits to Avoid):
                  </label>
                  <textarea
                    rows={3}
                    value={rxApathya}
                    onChange={(e) => setRxApathya(e.target.value)}
                    className="w-full p-2 rounded-lg bg-paper border border-[#DCD3BC] text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Printable Modal (Official Clinic Letterhead) */}
              <AnimatePresence>
                {showPrintRxModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
                  >
                    <div className="bg-cream rounded-2xl max-w-3xl w-full p-6 sm:p-8 border border-[#E8DFC9] shadow-2xl relative my-8">
                      {/* Close button */}
                      <button
                        onClick={() => setShowPrintRxModal(false)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-ink/60 hover:text-ink bg-[#EAE2CE] transition-colors print:hidden"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* CLINIC LETTERHEAD */}
                      <div className="border-b-2 border-deep-forest pb-4 mb-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-forest text-turmeric font-serif text-2xl font-bold flex items-center justify-center">
                              आ
                            </div>
                            <div>
                              <h2 className="font-serif text-xl sm:text-2xl font-bold text-deep-forest tracking-tight">
                                AAROGYAM AYURVEDIC CHIKITSALAYA
                              </h2>
                              <p className="text-[11px] text-ink/75 font-serif italic">
                                Classical Vaidya Chikitsalaya · Panchakarma Retreat & Research
                              </p>
                              <p className="text-[10px] text-ink/60 font-mono">
                                Reg No: AYUSH-RJ-2018-0482 · GMP Certified Dispensary
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-[11px] text-ink/70 font-mono hidden sm:block">
                            <div>Civil Lines, Jaipur 302006</div>
                            <div>+91 141 239 8800</div>
                            <div>contact@aarogyamayurveda.com</div>
                          </div>
                        </div>
                      </div>

                      {/* Doctor & Patient Info Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-paper rounded-lg border border-[#E8DFC9] text-xs font-mono mb-4">
                        <div>
                          <span className="text-[10px] text-ink/50 block">Patient Name</span>
                          <span className="font-bold text-deep-forest">
                            {selectedRxPatient.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-ink/50 block">ID & Demographics</span>
                          <span>
                            {selectedRxPatient.patientId} · {selectedRxPatient.age}y/
                            {selectedRxPatient.gender}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-ink/50 block">Date & Nadi Gati</span>
                          <span>
                            {todayStr} · {rxPulseGati.split(' ')[0]}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-ink/50 block">Attending Vaidya</span>
                          <span className="font-bold text-deep-forest">
                            {rxDoctorSlug === 'dr-lavesh-bohra'
                              ? 'Dr. Lavesh Bohra'
                              : 'Dr. Ananya Sharma'}
                          </span>
                        </div>
                      </div>

                      {/* Rx Formulation Table */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-serif font-bold text-lg text-deep-forest">℞</span>
                          <span className="text-xs uppercase tracking-wider text-ink/60 font-mono">
                            Aushadhi Kalpana (Medicinal Formulations)
                          </span>
                        </div>
                        <table className="w-full text-left text-xs border border-[#E8DFC9] rounded-lg overflow-hidden">
                          <thead className="bg-paper border-b border-[#E8DFC9] text-[10px] font-mono uppercase text-ink/65">
                            <tr>
                              <th className="p-2">#</th>
                              <th className="p-2">Medicine Formulation</th>
                              <th className="p-2">Dosage (मात्रा)</th>
                              <th className="p-2">Timing (काल)</th>
                              <th className="p-2">Anupana (अनुपान)</th>
                              <th className="p-2 text-right">Days</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EAE2CE]">
                            {rxItems.map((item, i) => (
                              <tr key={i}>
                                <td className="p-2 font-mono">{i + 1}</td>
                                <td className="p-2 font-semibold text-deep-forest">
                                  {item.name}
                                  <span className="text-[10px] font-normal text-ink/50 block">
                                    {item.category}
                                  </span>
                                </td>
                                <td className="p-2 font-mono">{item.dosage}</td>
                                <td className="p-2">{item.timing}</td>
                                <td className="p-2 text-ink/75">{item.anupana}</td>
                                <td className="p-2 text-right font-mono font-bold">
                                  {item.durationDays}d
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pathya / Apathya Guidelines */}
                      <div className="p-3 bg-paper rounded-lg border border-[#E8DFC9] text-xs space-y-1.5 mb-6">
                        <div>
                          <strong className="text-emerald-800">Pathya (Do&apos;s): </strong>
                          <span className="text-ink/80">{rxPathya}</span>
                        </div>
                        <div>
                          <strong className="text-rose-800">Apathya (Don&apos;ts): </strong>
                          <span className="text-ink/80">{rxApathya}</span>
                        </div>
                        <div className="pt-1 text-[11px] text-ink/60 font-mono">
                          Follow-up: {rxFollowUp}
                        </div>
                      </div>

                      {/* Doctor Signature & Legal Seal */}
                      <div className="pt-4 border-t border-[#EAE2CE] flex items-center justify-between text-xs">
                        <div className="text-[10px] text-ink/50 font-mono max-w-sm">
                          Prescription issued under Drugs and Cosmetics Act 1940 (Ayurveda/Siddha provisions). Valid for 30 days from date of issue.
                        </div>
                        <div className="text-right">
                          <div className="font-serif font-bold text-deep-forest">
                            {rxDoctorSlug === 'dr-lavesh-bohra'
                              ? 'Dr. Lavesh Bohra, MD (Kayachikitsa)'
                              : 'Dr. Ananya Sharma, MS (Prasuti)'}
                          </div>
                          <div className="text-[10px] text-ink/60 font-mono">
                            Digital Seal Verified · AYUSH Reg
                          </div>
                        </div>
                      </div>

                      {/* Print Controls */}
                      <div className="mt-6 flex items-center justify-end gap-3 print:hidden">
                        <button
                          onClick={() => setShowPrintRxModal(false)}
                          className="px-4 py-2 rounded-lg bg-[#EAE2CE] text-deep-forest text-xs font-medium hover:bg-[#DCD3BC]"
                        >
                          Close Preview
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="px-5 py-2 rounded-lg bg-deep-forest hover:bg-forest text-cream text-xs font-semibold flex items-center gap-2 shadow-xs"
                        >
                          <Printer className="w-4 h-4 text-turmeric" /> Print Prescription
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 6: TREATMENTS & SUITES */}
          {activeTab === 'treatments' && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4">
              <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-deep-forest">
                    Signature Clinical Therapies & Suites
                  </h2>
                  <p className="text-xs text-ink/65">
                    Official clinic protocols, durations, pricing & room allocations
                  </p>
                </div>
                <span className="text-xs font-mono text-sage bg-forest/80 px-2.5 py-1 rounded-full text-cream">
                  {treatments.length} Active Protocols
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {treatments.map((t) => (
                  <div
                    key={t.id}
                    className="bg-cream rounded-xl p-4 border border-[#E8DFC9] shadow-2xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif font-bold text-base text-deep-forest">
                          {t.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sage/20 text-forest">
                          {t.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-turmeric font-serif font-medium">
                        {t.sanskritName}
                      </div>
                      <p className="text-xs text-ink/75 mt-2 line-clamp-2">
                        {t.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EAE2CE] text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-ink/65">
                        <span>Duration:</span>
                        <span className="font-semibold text-deep-forest">{t.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-ink/65">
                        <span>Fee Range:</span>
                        <span className="font-semibold text-turmeric">{t.priceRange}</span>
                      </div>
                      <div className="flex items-center justify-between text-ink/65">
                        <span>Dosha:</span>
                        <span className="text-forest font-semibold">{t.primaryDosha}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: BLOG / WISDOM */}
          {activeTab === 'blog' && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4">
              <div className="bg-cream p-4 rounded-xl border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-deep-forest">
                    Wisdom & Clinical Knowledge Management
                  </h2>
                  <p className="text-xs text-ink/65">
                    Published educational guides and patient health dissertations
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-medium text-forest hover:underline flex items-center gap-1"
                >
                  View Public Blog <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-cream rounded-xl border border-[#E8DFC9] shadow-2xs divide-y divide-[#EAE2CE]">
                {blogs.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5EFE1]/30 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-mono bg-sage/20 text-forest px-2 py-0.5 rounded">
                        {b.category}
                      </span>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-deep-forest mt-1">
                        {b.title}
                      </h3>
                      <p className="text-xs text-ink/65 line-clamp-1 mt-0.5">{b.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-ink/60 shrink-0">
                      <span>{b.readTimeMinutes} min read</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        Published
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
              <div className="bg-cream p-5 rounded-xl border border-[#E8DFC9] shadow-2xs space-y-4">
                <h2 className="font-serif text-base sm:text-lg font-bold text-deep-forest">
                  Hospital & Regulatory Configuration
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] font-mono text-ink/60 block mb-1">
                      Hospital Legal Title:
                    </label>
                    <input
                      type="text"
                      defaultValue="Aarogyam Ayurvedic Chikitsalaya & Panchakarma"
                      className="w-full p-2 rounded bg-paper border border-[#DCD3BC] text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-ink/60 block mb-1">
                      State AYUSH Registration:
                    </label>
                    <input
                      type="text"
                      defaultValue="AYUSH-RJ-2018-0482"
                      className="w-full p-2 rounded bg-paper border border-[#DCD3BC] text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-ink/60 block mb-1">
                      Chief Vaidya Registration:
                    </label>
                    <input
                      type="text"
                      defaultValue="Dr. Lavesh Bohra · AYUSH-RJ-1999-4081"
                      className="w-full p-2 rounded bg-paper border border-[#DCD3BC] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-ink/60 block mb-1">
                      Default OPD Consultation Fee:
                    </label>
                    <input
                      type="text"
                      defaultValue="₹1,200 (In-Clinic) · ₹1,000 (Video)"
                      className="w-full p-2 rounded bg-paper border border-[#DCD3BC] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Integrations Card */}
              <div className="bg-cream p-5 rounded-xl border border-[#E8DFC9] shadow-2xs space-y-3">
                <h3 className="font-serif text-sm font-bold text-deep-forest">
                  Integrations & Database Status
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-paper rounded-lg border border-[#E8DFC9] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-deep-forest">
                        Supabase PostgreSQL Client Layer
                      </div>
                      <div className="text-[11px] text-ink/60 font-mono">
                        Mock Database active (`mockSoftwareDb.ts`). Ready for Supabase connection string.
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      Supabase Ready
                    </span>
                  </div>

                  <div className="p-3 bg-paper rounded-lg border border-[#E8DFC9] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-deep-forest">
                        WhatsApp Cloud Notification Gateway
                      </div>
                      <div className="text-[11px] text-ink/60 font-mono">
                        Direct wa.me protocol active with prefilled bilingual appointment tokens.
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
