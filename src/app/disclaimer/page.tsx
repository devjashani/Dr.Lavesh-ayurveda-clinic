import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, ShieldCheck, HeartPulse, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Medical Disclaimer & Regulatory Notice | Aarogyam Ayurveda',
  description:
    'Important statutory medical disclosure regarding Ayurvedic treatments, online educational tools, and emergency health protocols.',
};

export default function DisclaimerPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      <Container className="mb-10">
        <div className="max-w-3xl">
          <Badge variant="clay" className="mb-4">
            चिकित्सकीय अस्वीकरण · Medical Disclosure
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
                or proceed to the nearest multi-specialty hospital emergency room. Aarogyam Ayurveda is a planned
                elective clinic and does not operate an emergency trauma resuscitation unit.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              1. Educational Nature of Website Content & Online Tools
            </h2>
            <p>
              The articles, monographs, clinical case studies, videos, and interactive tools provided on this website—including
              the <strong>Dosha Quiz (/dosha-quiz)</strong> and the <strong>Panchakarma Estimator (/planner)</strong>—are
              published purely for educational and self-awareness purposes.
            </p>
            <p>
              An automated online questionnaire or digital article can never replace a hands-on, eight-fold clinical
              examination (Ashtavidha Pariksha) by an accredited BAMS / MD Vaidya. Do not use information on this website
              to self-diagnose complex conditions or formulate unsupervised herbal protocols.
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
              <li>The chronicity, tissue penetration, and cellular stage of the illness (Kala & Dhatu Gati).</li>
              <li>The strength of the patient’s digestive metabolic fire (Agni) and vital immune essence (Ojas).</li>
              <li>Strict, disciplined compliance with prescribed dietary restrictions (Pathya) and therapeutic lifestyle modifications.</li>
            </ul>
            <p>
              Consequently, case studies, patient testimonials, and clinical improvement percentages described on this
              website illustrate documented patient recoveries under physician supervision, but do not constitute a legal
              or medical guarantee that every individual will achieve identical results.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              3. Integration with Allopathic Pharmaceuticals
            </h2>
            <p>
              Patients undergoing treatment at Aarogyam Ayurveda are strictly advised <strong>never to abruptly discontinue
              or reduce prescribed modern allopathic medications</strong> (including antihypertensives, cardiac drugs,
              anticoagulants, thyroid hormones, psychiatric medications, or insulin) without the explicit consent of their
              prescribing medical specialist.
            </p>
            <p>
              Our physicians work cooperatively alongside modern pathology and radiology. Any future tapering of pharmaceutical
              dosages must be guided by verified objective laboratory markers and coordinated with your primary care physician.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-lg sm:text-xl text-deep-forest font-medium">
              4. AYUSH Regulatory & Pharmacopoeial Compliance
            </h2>
            <p>
              Aarogyam Ayurveda operates under valid state licensing issued by the Department of AYUSH, Government of
              Rajasthan (Hospital Reg: AYUSH-RJ-2018-0482). All classical formulations dispensed are prepared in accordance
              with the Ayurvedic Pharmacopoeia of India (API) under Good Manufacturing Practice (GMP) certifications.
            </p>
          </section>

          <div className="pt-4 border-t border-forest/10 flex items-center justify-between text-xs">
            <span className="text-ink/60">Have questions about clinical safety?</span>
            <Link href="/contact" className="text-forest hover:text-deep-forest underline font-medium">
              Speak with our Medical Directorate
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
