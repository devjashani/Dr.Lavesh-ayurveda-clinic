import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, ShieldCheck, HeartPulse, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Medical Disclaimer & Regulatory Notice | Vankal Ayurveda',
  description:
    'Important statutory medical disclosure regarding Ayurvedic treatments, online educational tools, and emergency health protocols.',
};

export default function DisclaimerPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      <Container className="mb-10">
        <div className="max-w-3xl">
          <Badge variant="clay" className="mb-4">
            ચિકિત્સકીય અસ્વીકરણ · Medical Disclosure
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-4">
            Statutory Medical Disclaimer & Emergency Notice
          </h1>
          <p className="font-mono text-xs text-ink/60">
            Mandatory Healthcare Disclosure Under Ministry of AYUSH & Medical Compliance Guidelines
          </p>
        </div>
      </Container>

      <Container>
        <div className="max-w-3xl bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-10 shadow-xs space-y-8 font-body text-xs sm:text-sm text-ink/80 leading-relaxed">
          {/* Urgent Emergency Callout Box */}
          <div className="p-5 rounded-[3px] bg-clay/10 border-l-4 border-clay flex items-start gap-4">
            <HeartPulse className="w-6 h-6 text-clay shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display text-base text-clay font-medium mb-1">
                Not Intended for Acute Medical Emergencies
              </h2>
              <p className="text-xs text-ink/85 leading-relaxed">
                If you are currently experiencing a medical emergency—such as acute crushing chest pain,
                shortness of breath, signs of stroke (facial drooping, slurred speech), uncontrolled arterial
                bleeding, severe head trauma, or acute poisoning—<strong>please immediately dial 112 or 108</strong>,
                or proceed to the nearest multi-specialty hospital emergency room. Information on this website is educational and does not replace medical advice. Not for emergencies. Vankal Ayurveda provides individual consultations and lifestyle care and does not operate an emergency trauma resuscitation unit.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              1. Educational Nature of Website Content
            </h2>
            <p>
              The articles, monographs, guidance notes, and educational materials provided on this website are published purely for educational and self-awareness purposes.
            </p>
            <p>
              Educational content can never replace a personalized, hands-on clinical examination by an accredited BAMS Vaidya. Do not use information on this website to self-diagnose complex conditions or formulate unsupervised herbal protocols.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              2. Individual Variability of Clinical Outcomes
            </h2>
            <p>
              Classical Ayurveda recognizes that no two human beings possess identical physiology. Therapeutic outcomes
              depend upon numerous interrelated clinical variables, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ink/75">
              <li>Individual biological constitution (Prakriti) and current doshic imbalance (Vikriti).</li>
              <li>The chronicity, tissue penetration, and cellular stage of the imbalance (Kala & Dhatu Gati).</li>
              <li>The strength of the patient’s digestive metabolic fire (Agni) and vital immune essence (Ojas).</li>
              <li>Strict, disciplined compliance with prescribed dietary restrictions (Pathya) and therapeutic lifestyle modifications.</li>
            </ul>
            <p>
              Consequently, educational examples or lifestyle discussions illustrate general classical principles under physician supervision, and do not constitute a medical promise or representation that every individual will achieve identical results.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              3. Integration with Modern Medicine
            </h2>
            <p>
              Patients undergoing consultation at Vankal Ayurveda are strictly advised <strong>never to abruptly discontinue
              or reduce prescribed modern medications</strong> (including antihypertensives, cardiac drugs,
              anticoagulants, thyroid hormones, psychiatric medications, or insulin) without the explicit consent of their
              prescribing medical specialist.
            </p>
            <p>
              Our practice works cooperatively alongside objective diagnostic reports. Any future tapering of pharmaceutical
              dosages must be guided by verified objective laboratory markers and coordinated with your primary care physician.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              4. Practitioner Registration & Pharmacopoeial Compliance
            </h2>
            <p>
              Vankal Ayurveda is led by Dr. Lavesh Bohra, BAMS (2026), SMIAS, Gujarat Ayurved University, Registered Ayurvedic Practitioner (Registration No.: to be added). All classical formulations recommended follow the standards of the Ayurvedic Pharmacopoeia of India (API).
            </p>
          </section>

          <div className="pt-4 border-t border-forest/10 flex items-center justify-between text-xs">
            <span className="text-ink/60">Have questions about clinical safety?</span>
            <Link href="/contact" className="text-forest hover:text-deep-forest underline font-medium">
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
