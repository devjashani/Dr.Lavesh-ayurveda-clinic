import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Clinical Care | Aarogyam Ayurveda',
  description:
    'Patient clinical agreements, consultation scheduling, Panchakarma cancellation rules, and pharmacy dispensing policies.',
};

export default function TermsPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      <Container className="mb-10">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            सेवा नियमावली · Terms of Clinical Care
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-4">
            Terms of Service & Clinical Agreement
          </h1>
          <p className="font-mono text-xs text-ink/60">
            Effective Date: October 2026 · Governing In-Clinic & Telemedicine Services
          </p>
        </div>
      </Container>

      <Container>
        <div className="max-w-3xl bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-10 shadow-xs space-y-8 font-body text-xs sm:text-sm text-ink/80 leading-relaxed">
          {/* Welcome Intro */}
          <p>
            Welcome to Aarogyam Ayurveda. By scheduling an appointment, participating in an online consultation,
            or admitted for residential Panchakarma care at our facility in Civil Lines, Jaipur, you enter into
            a mutual therapeutic relationship governed by the terms set forth below.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              1. Nature of Ayurvedic Clinical Practice
            </h2>
            <p>
              Aarogyam Ayurveda provides healthcare services rooted in the classical Samhitas of Charaka,
              Sushruta, and Vagbhata, delivered by physicians holding recognized degrees (BAMS / MD / MS Ayurveda)
              registered with the National Commission for Indian System of Medicine (NCISM) and state AYUSH councils.
            </p>
            <p>
              Ayurvedic diagnosis (including Nadi Pariksha) evaluates doshic imbalances, metabolic vitality (Agni),
              and tissue integrity (Dhatus). While highly complementary to modern laboratory investigations, it is
              distinct in its diagnostic terminology and treatment paradigms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              2. Appointment Booking, Fees & Cancellations
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-ink/75">
              <li>
                <strong>Consultation Fees:</strong> Consultation fees (e.g. ₹1,200 for Dr. Lavesh Bohra, ₹950 for Dr. Ananya Sharma) cover the professional diagnostic evaluation and prescription design. Medicines, specialized therapeutic procedures (Kati Basti, Shirodhara), and laboratory tests are billed separately.
              </li>
              <li>
                <strong>OPD Rescheduling:</strong> Individual appointments may be rescheduled up to 12 hours prior to the scheduled slot without penalty. Missed appointments without notice may forfeit the reservation fee.
              </li>
              <li>
                <strong>Panchakarma Package Commitments:</strong> Multi-day residential Panchakarma cycles require significant institutional resource dedication (customized medicated oils, therapy suite allocation, fresh decoction preparation). Cancellations made at least 48 hours prior to commencement receive a 90% refund or full credit toward future dates.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              3. Telemedicine & Video Consultations
            </h2>
            <p>
              Online video consultations are conducted strictly in compliance with the Ministry of AYUSH
              Telemedicine Practice Guidelines. Video consultations are intended for clinical evaluation,
              chronic disease follow-up, and dietary guidance. In situations involving acute trauma, severe
              chest pain, high fever with altered sensorium, or medical emergencies, patients must immediately
              report to a local hospital emergency department.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              4. Pharmacy Dispensing & Herbal Medicine Quality
            </h2>
            <p>
              Medicines dispensed by Aarogyam Ayurveda are formulated according to classical pharmacopoeial
              standards in GMP-certified facilities and tested for heavy metal purity (ICP-MS). Patients agree to
              consume prescribed formulations strictly according to the indicated dosage, Anupana (carrier liquid),
              and timing. Never share customized herbal formulations with others.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              5. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms are governed by the laws of India. Any legal dispute, arbitration, or claim arising
              out of clinical services provided by Aarogyam Ayurveda shall fall under the exclusive jurisdiction
              of the competent courts in Jaipur, Rajasthan.
            </p>
          </section>

          <div className="pt-4 border-t border-forest/10 flex items-center justify-between text-xs">
            <span className="text-ink/60">Questions regarding our clinical terms?</span>
            <Link href="/contact" className="text-forest hover:text-deep-forest underline font-medium">
              Contact Hospital Administration
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
