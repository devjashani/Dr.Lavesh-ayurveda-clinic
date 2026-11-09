import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact & Clinic Location | Aarogyam Ayurveda Civil Lines Jaipur',
  description:
    'Book an in-person Nadi Pariksha consultation at our Civil Lines, Jaipur clinic or schedule an online video consultation with Dr. Aditya Bohra.',
  openGraph: {
    title: 'Contact Aarogyam Ayurveda | Civil Lines, Jaipur',
    description:
      'Schedule consultations, access clinic timings, directions from Jaipur Junction, and direct WhatsApp inquiry lines.',
  },
};

export default function ContactPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Page Header */}
      <Container className="mb-10 md:mb-14">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            सम्पर्क सूत्र · Connect with our Clinical Team
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-6">
            Begin Your Healing Dialogue. <br />
            <span className="italic font-normal text-turmeric">
              In-Clinic or Online.
            </span>
          </h1>
          <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed">
            Located in the serene diplomatic enclave of Civil Lines, Jaipur, Aarogyam provides a calm,
            restorative sanctuary for authentic healing. Submit your inquiry below, or contact our
            reception team directly via phone or WhatsApp.
          </p>
        </div>
      </Container>

      {/* Main Form & Hours Client Component */}
      <Container>
        <ContactClient />
      </Container>
    </div>
  );
}
