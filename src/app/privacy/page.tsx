import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Patient Data Protection | Aarogyam Ayurveda',
  description:
    'Our commitment to safeguarding patient health data, digital medical records, and diagnostic privacy under Indian telemedicine guidelines.',
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      <Container className="mb-10">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            गोपनीयता नीति · Patient Confidentiality
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-4">
            Privacy Policy & Clinical Data Protection
          </h1>
          <p className="font-mono text-xs text-ink/60">
            Last Updated & Verified: October 2026 · Compliant with Ministry of AYUSH & Indian Telemedicine Regulations
          </p>
        </div>
      </Container>

      <Container>
        <div className="max-w-3xl bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-10 shadow-xs space-y-8 font-body text-xs sm:text-sm text-ink/80 leading-relaxed">
          {/* Summary Box */}
          <div className="p-4 rounded-[3px] bg-cream border border-forest/10 flex items-start gap-3">
            <Lock className="w-5 h-5 text-forest shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-xs uppercase font-medium text-deep-forest block mb-1">
                The Sacred Trust of Vaidya-Rogi Privacy
              </span>
              In classical Ayurvedic ethics, medical confidentiality is a sacred vow. We never sell, rent,
              or commercialize patient diagnostic records, pulse readings, photographs, or health histories.
              Your data exists solely to guide your clinical treatment.
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              1. Information We Collect
            </h2>
            <p>
              When you schedule a consultation, engage with our online Dosha assessment, or undergo Panchakarma therapy at Aarogyam Ayurveda, we collect the following categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink/75">
              <li>Personal identity details: Full legal name, date of birth, biological sex, contact address, and telephone number.</li>
              <li>Clinical health records: Prior medical diagnoses, current pharmaceutical prescriptions, pathology blood tests, radiological scans, surgical history, and allergy logs.</li>
              <li>Ayurvedic diagnostic findings: Radial pulse parameters (Nadi), Prakriti-Vikriti assessments, tongue photographs (Jihwa), digestive patterns, and bowel habits.</li>
              <li>Financial records: Consultation fee invoices, insurance claim documents, and digital transaction receipts. (We do not store credit card CVVs or bank PINs).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              2. How Your Clinical Information is Used
            </h2>
            <p>Your health data is utilized exclusively for legitimate medical objectives:</p>
            <ul className="list-disc pl-5 space-y-1 text-ink/75">
              <li>Formulating individualized Ayurvedic treatment plans, herbal decoction prescriptions, and dietary (Pathya) instructions.</li>
              <li>Dispensing freshly prepared medicinal formulations from our licensed in-house pharmacy.</li>
              <li>Communicating appointment reminders, lab report follow-ups, and dietary compliance updates.</li>
              <li>Processing health insurance reimbursement documentation in accordance with IRDAI AYUSH mandates.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              3. Data Storage & Electronic Health Records (EHR) Security
            </h2>
            <p>
              In alignment with the Digital Information Security in Healthcare guidelines and standard encryption benchmarks:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink/75">
              <li>All digital medical records and video consultation channels are encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
              <li>Physical clinical files at our Civil Lines, Jaipur hospital are stored in restricted-access archives accessible only by attending Vaidyas and certified paramedical staff.</li>
              <li>We maintain digital records for a mandatory statutory retention period of 5 years following your last active consultation, after which data may be securely purged upon written patient request.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              4. Patient Rights & Record Access
            </h2>
            <p>
              As a patient of Aarogyam Ayurveda, you retain the fundamental right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink/75">
              <li>Request a certified digital copy of your consultation summaries, pulse assessments, and prescriptions at any time via your registered email.</li>
              <li>Request corrections to contact details or typographical errors in your demographic records.</li>
              <li>Opt out of educational newsletters or wellness bulletins at any point without impacting your clinical care.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              5. Contact Our Data Protection Officer
            </h2>
            <p>
              For questions regarding medical privacy, data correction, or regulatory compliance, please contact:
            </p>
            <div className="p-3 bg-cream rounded-[3px] border border-forest/10 font-mono text-xs space-y-1">
              <div>Medical Records & Privacy Officer</div>
              <div>Aarogyam Ayurveda Hospital, 14 Jacob Road, Civil Lines, Jaipur 302006</div>
              <div>Email: <a href="mailto:privacy@aarogyamayurveda.com" className="text-forest underline">privacy@aarogyamayurveda.com</a></div>
              <div>Phone: +91 141 238 9400</div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
