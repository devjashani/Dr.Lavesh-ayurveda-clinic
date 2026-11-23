import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw, ArrowLeft, ShieldCheck, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Vankal Ayurveda',
  description:
    'Official cancellation and refund policy for online video consultations and clinic appointments at Vankal Ayurveda.',
};

export default function RefundPolicyPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      <Container className="mb-10">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            રિફંડ નીતિ · Cancellation & Refund Policy
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="font-mono text-xs text-ink/60">
            Effective Date: November 2026 · Governing Online Video Consultations
          </p>
        </div>
      </Container>

      <Container>
        <div className="max-w-3xl bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-10 shadow-xs space-y-8 font-body text-xs sm:text-sm text-ink/80 leading-relaxed">
          {/* Summary Box */}
          <div className="p-4 rounded-[3px] bg-cream border border-forest/10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-xs uppercase font-medium text-deep-forest block mb-1">
                Transparent Clinical Scheduling
              </span>
              Every consultation slot is dedicated one-on-one time with Dr. Lavesh Bohra. We maintain clear and honest cancellation guidelines to respect both patient scheduling needs and clinical practitioner availability.
            </div>
          </div>

          {/* Section 1: Video Consultation Appointments */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              1. Video Consultation Rescheduling & Cancellation
            </h2>
            <p>
              When you reserve a video consultation slot, our clinical system reserves that time exclusively for your diagnostic evaluation. The video consultation takes place on this website. Join from your booking page 10 minutes before your slot.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Cancellation Window:</strong> [Refund window: to be confirmed by clinic]. If you cancel within the eligible notice window prior to your scheduled slot time, you are eligible for a refund or slot rescheduling.
              </li>
              <li>
                <strong>Rescheduling Policy:</strong> Patients may request to reschedule their consultation date or time once without penalty, subject to doctor availability and [Rescheduling notice window: to be confirmed by clinic].
              </li>
              <li>
                <strong>Missed Appointments / No-Shows:</strong> If a patient fails to join the video call without prior notice, the slot fee is non-refundable as the practitioner’s reserved clinical time cannot be reallocated.
              </li>
            </ul>
          </section>

          {/* Section 2: Online Payment Processing & Refunds */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              2. Online Payment Processing & Refund Timeline
            </h2>
            <p>
              All online payments are securely processed through Razorpay. In cases where a refund is approved (such as timely cancellations, accidental duplicate transactions, or practitioner unavailability):
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Refunds are credited back to the original source payment method (bank account, UPI, credit/debit card) used during booking.
              </li>
              <li>
                Standard banking processing takes between <strong>5 to 7 business days</strong> depending on your issuing bank.
              </li>
              <li>
                No cash refunds are provided for online digital transactions.
              </li>
            </ul>
          </section>

          {/* Section 3: Clinic-Initiated Rescheduling */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              3. Clinic-Initiated Changes or Emergency Cancellations
            </h2>
            <p>
              In the rare event that Dr. Lavesh Bohra is called away due to clinical emergencies or unforeseen technical interruptions, patients will be offered an immediate choice of:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Priority rescheduling to the next earliest mutually convenient time slot; or</li>
              <li>A 100% full refund of the ₹499 consultation fee.</li>
            </ul>
          </section>

          {/* Section 4: Contact for Billing & Inquiries */}
          <section className="space-y-3 pt-4 border-t border-forest/10">
            <h2 className="font-display text-base sm:text-lg text-deep-forest font-medium">
              4. Contact Consultation Desk
            </h2>
            <p>
              For cancellation or refund requests, please contact our clinical desk with your appointment details:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 font-mono text-xs pt-2">
              <span className="flex items-center gap-1.5 text-forest">
                <Phone className="w-4 h-4 text-turmeric" />
                <span>+91 9016432576</span>
              </span>
              <span className="flex items-center gap-1.5 text-forest">
                <Mail className="w-4 h-4 text-turmeric" />
                <span>care@vankalayurveda.com</span>
              </span>
            </div>
          </section>

          {/* Back to Booking Link */}
          <div className="pt-6 border-t border-forest/10">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 text-forest hover:text-deep-forest font-mono text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Appointment Booking</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
