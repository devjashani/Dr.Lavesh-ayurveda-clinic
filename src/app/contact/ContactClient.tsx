'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  Building,
  Navigation,
} from 'lucide-react';

const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters' }),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit Indian mobile number' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
  consultationMode: z.enum(['in-clinic', 'online']),
  preferredDate: z
    .string()
    .min(1, { message: 'Please select a preferred date' }),
  healthConcern: z
    .string()
    .min(15, { message: 'Please provide at least 15 characters describing your health symptoms' }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const WEEK_HOURS = [
  { day: 'Sunday', hours: '8:00 AM – 1:00 PM (Therapy & Follow-up Only)', dayIndex: 0 },
  { day: 'Monday', hours: '9:00 AM – 1:30 PM & 4:30 PM – 7:30 PM', dayIndex: 1 },
  { day: 'Tuesday', hours: '9:00 AM – 1:30 PM & 4:30 PM – 7:30 PM', dayIndex: 2 },
  { day: 'Wednesday', hours: '9:00 AM – 1:30 PM & 4:30 PM – 7:30 PM', dayIndex: 3 },
  { day: 'Thursday', hours: '9:00 AM – 1:30 PM & 4:30 PM – 7:30 PM', dayIndex: 4 },
  { day: 'Friday', hours: '9:00 AM – 1:30 PM & 4:30 PM – 7:30 PM', dayIndex: 5 },
  { day: 'Saturday', hours: '9:00 AM – 1:30 PM & 4:30 PM – 7:30 PM', dayIndex: 6 },
];

export function ContactClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<ContactFormData | null>(null);

  // Automatically determine today's day of week (0 to 6)
  const todayIndex = new Date().getDay();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      consultationMode: 'in-clinic',
      preferredDate: '',
      healthConcern: '',
      fullName: '',
      email: '',
      phone: '',
    },
  });

  const selectedMode = watch('consultationMode');

  const onSubmit = async (data: ContactFormData) => {
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmissionData(data);
    setIsSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Column: Form with Mode Selector (7 cols) */}
      <div className="lg:col-span-7 bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 md:p-10 shadow-xs">
        {isSubmitted && submissionData ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-forest text-paper mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-turmeric" />
            </div>
            <h3 className="font-display text-2xl text-deep-forest font-medium">
              Consultation Inquiry Received
            </h3>
            <p className="font-body text-sm text-ink/80 max-w-md mx-auto leading-relaxed">
              Dhanyavaad, <span className="font-medium text-deep-forest">{submissionData.fullName}</span>.
              Our clinical coordinator will call you at{' '}
              <span className="font-mono text-forest font-medium">{submissionData.phone}</span> within 4 business
              hours to confirm your{' '}
              <span className="font-medium">
                {submissionData.consultationMode === 'in-clinic' ? 'In-Clinic' : 'Online Video'}
              </span>{' '}
              slot for <span className="font-mono">{submissionData.preferredDate}</span>.
            </p>

            <div className="p-4 rounded-[3px] bg-cream border border-forest/10 text-xs text-ink/75 max-w-md mx-auto text-left space-y-1">
              <div className="font-mono text-[11px] uppercase text-forest font-medium">
                Your Health Note:
              </div>
              <p className="italic">"{submissionData.healthConcern}"</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Button
                href={`https://wa.me/919414012345?text=Namaste%2C%20I%20have%20submitted%20a%20consultation%20request%20for%20${encodeURIComponent(
                  submissionData.fullName
                )}%20(${submissionData.consultationMode}).`}
                variant="primary"
                external
                className="text-xs bg-turmeric text-deep-forest hover:bg-turmeric/90"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                Notify Desk on WhatsApp
              </Button>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="secondary"
                className="text-xs"
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-forest/70 font-medium block mb-1">
                Consultation Request Form
              </span>
              <h2 className="font-display text-2xl text-deep-forest font-medium">
                Schedule Your Ayurvedic Intake
              </h2>
            </div>

            {/* Mode Selector (In-Clinic vs Online) */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-deep-forest/80 mb-2 font-medium">
                Consultation Mode:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('consultationMode', 'in-clinic')}
                  className={`p-3.5 rounded-[3px] border text-left transition-all ${
                    selectedMode === 'in-clinic'
                      ? 'border-forest bg-forest text-paper shadow-xs'
                      : 'border-forest/20 bg-cream text-deep-forest hover:bg-paper'
                  }`}
                >
                  <div className="flex items-center gap-2 font-display text-sm font-medium">
                    <Building className="w-4 h-4" />
                    <span>In-Clinic Visit</span>
                  </div>
                  <div
                    className={`text-[11px] font-body mt-1 ${
                      selectedMode === 'in-clinic' ? 'text-paper/80' : 'text-ink/60'
                    }`}
                  >
                    Civil Lines, Jaipur (Nadi Pariksha)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('consultationMode', 'online')}
                  className={`p-3.5 rounded-[3px] border text-left transition-all ${
                    selectedMode === 'online'
                      ? 'border-forest bg-forest text-paper shadow-xs'
                      : 'border-forest/20 bg-cream text-deep-forest hover:bg-paper'
                  }`}
                >
                  <div className="flex items-center gap-2 font-display text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    <span>Online Video Consult</span>
                  </div>
                  <div
                    className={`text-[11px] font-body mt-1 ${
                      selectedMode === 'online' ? 'text-paper/80' : 'text-ink/60'
                    }`}
                  >
                    High-Definition Video + Medicine Courier
                  </div>
                </button>
              </div>
              {errors.consultationMode && (
                <p className="font-body text-[11px] text-clay mt-1">
                  {errors.consultationMode.message}
                </p>
              )}
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra Sharma"
                  {...register('fullName')}
                  className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                />
                {errors.fullName && (
                  <p className="font-body text-[11px] text-clay mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  Mobile Number (10 Digits) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9829012345"
                  {...register('phone')}
                  className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                />
                {errors.phone && (
                  <p className="font-body text-[11px] text-clay mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Preferred Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  {...register('email')}
                  className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                />
                {errors.email && (
                  <p className="font-body text-[11px] text-clay mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('preferredDate')}
                  className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest"
                />
                {errors.preferredDate && (
                  <p className="font-body text-[11px] text-clay mt-1">
                    {errors.preferredDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Health Concern / Symptoms */}
            <div>
              <label className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                Health Concern or Symptoms *
              </label>
              <textarea
                rows={4}
                placeholder="Describe your primary symptoms, duration of illness, and any existing medical diagnoses or medications..."
                {...register('healthConcern')}
                className="w-full px-3.5 py-2.5 rounded-[3px] bg-cream text-xs font-body text-deep-forest border border-forest/15 focus:outline-none focus:ring-1 focus:ring-forest resize-none"
              />
              {errors.healthConcern && (
                <p className="font-body text-[11px] text-clay mt-1">
                  {errors.healthConcern.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full justify-center py-3"
              >
                {isSubmitting ? (
                  'Submitting Request...'
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-2" />
                    Submit Consultation Request
                  </>
                )}
              </Button>
              <p className="font-body text-[11px] text-ink/60 text-center mt-2.5">
                Your medical data is held strictly confidential under AYUSH electronic healthcare guidelines.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Right Column: Dynamic Hours Table, Location & Quick Contacts (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Automatic Today's Hours Highlight Table */}
        <div className="bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-forest/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-turmeric" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                OPD & Clinic Timings
              </h3>
            </div>
            <Badge variant="sage" className="text-[10px]">
              Jaipur Standard Time (IST)
            </Badge>
          </div>

          <div className="space-y-1 text-xs font-body">
            {WEEK_HOURS.map((item) => {
              const isToday = item.dayIndex === todayIndex;

              return (
                <div
                  key={item.day}
                  className={`flex items-center justify-between p-2 rounded-[3px] transition-colors ${
                    isToday
                      ? 'bg-forest text-paper font-medium shadow-xs'
                      : 'text-ink/80 hover:bg-cream'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.day}</span>
                    {isToday && (
                      <span className="font-mono text-[9px] bg-turmeric text-deep-forest px-1.5 py-0.2 rounded-[2px] uppercase font-bold">
                        Today
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-mono text-[11px] ${
                      isToday ? 'text-turmeric' : 'text-ink/60'
                    }`}
                  >
                    {item.hours}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-forest/10 text-[11px] font-body text-ink/60 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-turmeric shrink-0" />
            <span>Nadi Pariksha recommended early morning (8:30 AM – 11:30 AM).</span>
          </div>
        </div>

        {/* Embedded Map & Address Card */}
        <div className="bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-clay" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
              Clinic Location & Access
            </h3>
          </div>

          <div className="text-xs font-body text-ink/80 space-y-1">
            <p className="font-medium text-deep-forest text-sm">
              Aarogyam Ayurveda Hospital & Panchakarma Center
            </p>
            <p>14, Jacob Road, Civil Lines</p>
            <p>Jaipur, Rajasthan — 302006, India</p>
          </div>

          {/* Styled Visual Map Placeholder */}
          <div className="relative w-full h-40 bg-gradient-to-br from-cream via-paper to-mist rounded-[3px] border border-forest/15 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
            <Navigation className="w-6 h-6 text-forest mb-1 animate-pulse" />
            <span className="font-display text-xs text-deep-forest font-medium">
              Civil Lines, Jaipur
            </span>
            <span className="font-mono text-[10px] text-ink/60 mt-0.5">
              26.9075° N, 75.7892° E
            </span>
            <div className="mt-2 text-[10px] font-mono bg-paper/90 px-2 py-0.5 rounded border border-forest/10 text-forest">
              1.8 km from Jaipur Junction · 11 km from Airport
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
            <Button
              href="https://wa.me/919414012345?text=Namaste%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation%20with%20Aarogyam%20Ayurveda."
              variant="primary"
              external
              className="justify-center bg-turmeric text-deep-forest hover:bg-turmeric/90 text-[11px] py-2"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1" />
              WhatsApp
            </Button>
            <Button
              href="tel:+911412389400"
              variant="secondary"
              external
              className="justify-center text-[11px] py-2"
            >
              <Phone className="w-3.5 h-3.5 mr-1" />
              Call Clinic
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
