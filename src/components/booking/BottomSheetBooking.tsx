'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Phone, Mail, User, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useBookingSheet } from '@/lib/context/BookingSheetContext';

export function BottomSheetBooking() {
  const { isOpen, closeBookingSheet } = useBookingSheet();
  const { language, t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    concern: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [shakingField, setShakingField] = useState<string | null>(null);

  const sheetRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus first input when sheet opens
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setIsSubmitted(false);
      setErrors({});
      setShakingField(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeBookingSheet();
        return;
      }

      // Focus trap within the sheet
      if (e.key === 'Tab' && sheetRef.current) {
        const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeBookingSheet]);

  const triggerErrorShake = (fieldName: string) => {
    setShakingField(fieldName);
    setTimeout(() => {
      setShakingField(null);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};

    if (!formData.name.trim()) {
      newErrors.name = true;
      triggerErrorShake('name');
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = true;
      if (!newErrors.name) triggerErrorShake('phone');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);

    // Optional haptics: feature-detected 10ms gentle vibration (ignored on iOS)
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore devices where vibration is disabled or unsupported
      }
    }
  };

  const concerns = [
    t.hero.concernOption1,
    t.hero.concernOption2,
    t.hero.concernOption3,
    t.hero.concernOption4,
    t.hero.concernOption5,
  ];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex flex-col justify-end" role="dialog" aria-modal="true">
          {/* Dimmed backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeBookingSheet}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 32,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 90 || info.velocity.y > 400) {
                closeBookingSheet();
              }
            }}
            className="relative z-10 w-full max-w-lg mx-auto bg-paper rounded-t-[20px] shadow-[0_-12px_40px_rgba(20,41,28,0.25)] border-t border-forest/20 px-5 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom,0px))] max-h-[90dvh] overflow-y-auto"
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center py-2 cursor-grab active:cursor-grabbing touch-none select-none">
              <div className="w-12 h-1.5 rounded-full bg-forest/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-forest/15">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-forest/10 flex items-center justify-center text-forest">
                  <Calendar className="w-4 h-4 text-turmeric" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-deep-forest leading-tight">
                    {t.nav.bookConsultation}
                  </h3>
                  <p className="text-[11px] font-mono text-forest/75 tracking-wider">
                    {language === 'GU' ? 'ડૉ. લવેશ બોહરા · વૈદ્ય પરામર્શ' : 'Dr. Lavesh Bohra · BAMS (2026)'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeBookingSheet}
                className="w-9 h-9 rounded-full bg-forest/10 hover:bg-forest/20 text-deep-forest flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-turmeric"
                aria-label="Close booking modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-4">
                {/* Success self-drawing animated check mark */}
                <div className="w-16 h-16 mx-auto">
                  <svg className="w-full h-full text-forest" viewBox="0 0 48 48" fill="none">
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="21"
                      stroke="#1F3D2B"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    />
                    <motion.path
                      d="M14 24.5L21 31.5L34 17.5"
                      stroke="#D99A2B"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
                    />
                  </svg>
                </div>

                <div role="status" className="font-display font-medium text-deep-forest text-lg">
                  {t.hero.requestReceived}
                </div>

                <p className="text-sm text-ink/75 max-w-xs mx-auto leading-relaxed">
                  {language === 'GU'
                    ? `અમારો પરામર્શ ડેસ્ક સમયની પુષ્ટિ માટે ${formData.phone} પર સંપર્ક કરશે.`
                    : `Our consultation desk will contact you at ${formData.phone} to confirm your appointment timing.`}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={closeBookingSheet}
                    className="px-6 py-2.5 rounded-[4px] bg-deep-forest text-cream font-medium text-sm shadow-xs active:scale-[0.97] transition-all cursor-pointer"
                  >
                    {language === 'GU' ? 'સમજાયું (બંધ કરો)' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* 1. Name Input with Floating Label and Gentle Shake on Error */}
                <div
                  className={`relative ${
                    shakingField === 'name' ? 'animate-gentle-shake' : ''
                  }`}
                >
                  <div className="absolute left-3.5 top-3.5 text-forest/40 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    ref={firstInputRef}
                    id="sheet-book-name"
                    name="name"
                    type="text"
                    inputMode="text"
                    autoComplete="name"
                    required
                    placeholder=" "
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: false });
                    }}
                    className={`peer w-full bg-cream border text-sm pl-10 pr-3.5 pt-4 pb-1.5 rounded-[4px] text-ink focus:outline-none focus:ring-2 transition-all min-h-[48px] ${
                      errors.name
                        ? 'border-clay/80 focus:border-clay focus:ring-clay/20'
                        : 'border-forest/20 focus:border-turmeric focus:ring-turmeric/25'
                    }`}
                    aria-label={t.hero.fieldName}
                  />
                  <label
                    htmlFor="sheet-book-name"
                    className="absolute left-10 top-1 text-[10px] uppercase font-mono tracking-wider text-forest/80 font-medium transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-sans peer-placeholder-shown:text-ink/50 peer-focus:top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-mono peer-focus:text-turmeric"
                  >
                    {t.hero.fieldName} *
                  </label>
                  {errors.name && (
                    <span className="text-[11px] text-clay font-medium block mt-1 pl-1">
                      {language === 'GU' ? 'કૃપા કરીને આપનું પૂરું નામ લખો' : 'Please enter your name'}
                    </span>
                  )}
                </div>

                {/* 2. Phone Input with Floating Label and Gentle Shake on Error */}
                <div
                  className={`relative ${
                    shakingField === 'phone' ? 'animate-gentle-shake' : ''
                  }`}
                >
                  <div className="absolute left-3.5 top-3.5 text-forest/40 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="sheet-book-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder=" "
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: false });
                    }}
                    className={`peer w-full bg-cream border text-sm pl-10 pr-3.5 pt-4 pb-1.5 rounded-[4px] text-ink focus:outline-none focus:ring-2 transition-all min-h-[48px] ${
                      errors.phone
                        ? 'border-clay/80 focus:border-clay focus:ring-clay/20'
                        : 'border-forest/20 focus:border-turmeric focus:ring-turmeric/25'
                    }`}
                    aria-label={t.hero.fieldPhone}
                  />
                  <label
                    htmlFor="sheet-book-phone"
                    className="absolute left-10 top-1 text-[10px] uppercase font-mono tracking-wider text-forest/80 font-medium transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-sans peer-placeholder-shown:text-ink/50 peer-focus:top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-mono peer-focus:text-turmeric"
                  >
                    {t.hero.fieldPhone} *
                  </label>
                  {errors.phone && (
                    <span className="text-[11px] text-clay font-medium block mt-1 pl-1">
                      {language === 'GU' ? 'કૃપા કરીને માન્ય મોબાઈલ નંબર દાખલ કરો' : 'Please enter a valid 10-digit phone number'}
                    </span>
                  )}
                </div>

                {/* 3. Optional Email Input with Floating Label */}
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-forest/40 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="sheet-book-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="peer w-full bg-cream border border-forest/20 text-sm pl-10 pr-3.5 pt-4 pb-1.5 rounded-[4px] text-ink focus:outline-none focus:border-turmeric focus:ring-2 focus:ring-turmeric/25 transition-all min-h-[48px]"
                    aria-label="Email Address (Optional)"
                  />
                  <label
                    htmlFor="sheet-book-email"
                    className="absolute left-10 top-1 text-[10px] uppercase font-mono tracking-wider text-forest/80 font-medium transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:font-sans peer-placeholder-shown:text-ink/50 peer-focus:top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-mono peer-focus:text-turmeric"
                  >
                    {language === 'GU' ? 'ઈમેઇલ (વૈકલ્પિક)' : 'Email Address (Optional)'}
                  </label>
                </div>

                {/* 4. Health Concern Select */}
                <div className="relative">
                  <select
                    id="sheet-book-concern"
                    name="concern"
                    value={formData.concern}
                    onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                    className="w-full bg-cream border border-forest/20 text-sm px-3.5 py-3 rounded-[4px] text-ink/80 focus:outline-none focus:border-turmeric focus:ring-2 focus:ring-turmeric/25 transition-all cursor-pointer min-h-[48px]"
                    aria-label={t.hero.fieldConcern}
                  >
                    <option value="">{t.hero.fieldConcern}</option>
                    {concerns.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trust Inscription */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-forest/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-turmeric shrink-0" />
                  <span>
                    {language === 'GU'
                      ? 'આપની માહિતી ગુપ્ત અને સુરક્ષિત રાખવામાં આવે છે.'
                      : 'Your health inquiry is confidential & reviewed directly by the Vaidya.'}
                  </span>
                </div>

                {/* Submit Button with Touch Press and Soft Ripple */}
                <button
                  type="submit"
                  className="w-full min-h-[50px] rounded-[4px] bg-deep-forest text-cream font-medium text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-all btn-primary-ripple mt-2"
                >
                  <span>{t.hero.formBtn}</span>
                  <ArrowRight className="w-4 h-4 text-turmeric" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
