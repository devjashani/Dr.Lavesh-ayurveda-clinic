'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Phone,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  Video,
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

export function ContactClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<ContactFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      consultationMode: 'online',
      preferredDate: '',
      healthConcern: '',
      fullName: '',
      email: '',
      phone: '',
    },
  });

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
                href={`https://wa.me/919016432576?text=Namaste%2C%20I%20have%20submitted%20a%20consultation%20request%20for%20${encodeURIComponent(
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

            {/* Mode Info (Online Video Consultation Only) */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-deep-forest/80 mb-2 font-medium">
                Consultation Mode:
              </label>
              <div className="p-3.5 rounded-[3px] border border-forest bg-forest text-paper shadow-xs flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-display text-sm font-medium">
                    <Video className="w-4 h-4 text-turmeric" />
                    <span>Online Video Consultation</span>
                  </div>
                  <div className="text-[11px] font-body mt-1 text-paper/80">
                    High-Definition 1-on-1 Ayurvedic Video Consultation
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-paper/15 text-turmeric shrink-0">
                  Active
                </span>
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase text-deep-forest/80 mb-1 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
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

      {/* Right Column: OPD Timings, Location & Quick Contacts (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* OPD Timings Highlight Card */}
        <div className="bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-forest/10">
            <Clock className="w-4 h-4 text-turmeric" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
              OPD Timings
            </h3>
          </div>

          <div className="p-3 bg-cream/70 rounded-[3px] border border-forest/10 space-y-1">
            <p className="font-mono text-xs text-deep-forest font-medium">
              Morning: 10:00 AM – 01:00 PM IST
            </p>
            <p className="font-mono text-xs text-deep-forest font-medium">
              Evening: 05:00 PM – 08:10 PM IST (Mon – Sat)
            </p>
          </div>
        </div>

        {/* Online Consultation Desk Card */}
        <div className="bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-forest" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
              Online Consultation Desk
            </h3>
          </div>

          <div className="text-xs font-body text-ink/80 space-y-1">
            <p className="font-medium text-deep-forest text-sm">
              Vankal Ayurveda
            </p>
            <p className="text-ink/70">
              All consultations are currently conducted online via secure video call.
            </p>
          </div>

          {/* Contact Details Card */}
          <div className="pt-2 space-y-2 text-xs">
            <div className="p-2.5 rounded-[3px] bg-cream/70 border border-forest/10 flex items-center justify-between">
              <span className="font-mono text-[11px] text-forest">WhatsApp:</span>
              <a
                href="https://wa.me/919016432576"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-ink/80 hover:text-turmeric transition-colors"
              >
                +91 9016432576
              </a>
            </div>
            <div className="p-2.5 rounded-[3px] bg-cream/70 border border-forest/10 flex items-center justify-between">
              <span className="font-mono text-[11px] text-forest">Phone:</span>
              <a
                href="tel:+919016432576"
                className="font-mono text-ink/80 hover:text-turmeric transition-colors"
              >
                +91 9016432576
              </a>
            </div>
            <div className="p-2.5 rounded-[3px] bg-cream/70 border border-forest/10 flex items-center justify-between">
              <span className="font-mono text-[11px] text-forest">Email:</span>
              <a
                href="mailto:vankalayurveda@gmail.com"
                className="font-mono text-ink/80 hover:text-turmeric transition-colors"
              >
                vankalayurveda@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
