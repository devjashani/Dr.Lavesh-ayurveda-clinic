import React from 'react';
import type { Metadata } from 'next';
import { testimonials } from '@/lib/data';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { TestimonialsClient } from './TestimonialsClient';
import { AlertCircle, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Patient Clinical Outcomes & Testimonials | Aarogyam Ayurveda',
  description:
    'Read verified patient case reflections on Panchakarma, sciatica, rheumatoid arthritis, PCOD, and psoriasis at Aarogyam Ayurveda, Jaipur.',
  openGraph: {
    title: 'Patient Clinical Outcomes & Testimonials | Aarogyam Ayurveda',
    description:
      'Verified case recoveries with documented lab markers and functional improvements supervised by Dr. Lavesh Bohra and Dr. Ananya Sharma.',
  },
};

export default function TestimonialsPage() {
  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Page Header */}
      <Container className="mb-10">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            रोगी अनुभूतयः · Verified Patient Clinical Outcomes
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-6">
            Real Patient Journeys. <br />
            <span className="italic font-normal text-turmeric">
              Documented Clinical Recoveries.
            </span>
          </h1>
          <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed">
            We measure clinical success not in vague promises, but in restored joint mobility, normalized
            inflammatory blood markers, reduced synthetic medication dependence, and rejuvenated vitality.
          </p>
        </div>
      </Container>

      {/* Mandatory Statutory Clinical Disclaimer Note */}
      <Container className="mb-12">
        <div className="p-4 md:p-5 rounded-[4px] bg-paper border border-forest/20 flex items-start gap-3.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-clay shrink-0 mt-0.5" />
          <div className="text-xs font-body text-ink/80 leading-relaxed">
            <span className="font-mono uppercase font-medium text-deep-forest block mb-0.5">
              Clinical Disclaimer & Regulatory Note (AYUSH / Medical Compliance):
            </span>
            Ayurvedic therapeutic outcomes vary significantly based on an individual’s unique biological
            constitution (Prakriti), disease chronicity (Kala), tissue pathology (Dhatu Dushti), metabolic fire
            (Agni), and strict compliance with prescribed dietary restrictions (Pathya). These testimonials
            reflect individual verified patient experiences and should not be construed as universal or
            guaranteed cure claims for any specific illness.
          </div>
        </div>
      </Container>

      {/* Interactive Filterable Masonry */}
      <TestimonialsClient testimonials={testimonials} />

      <BotanicalDivider className="my-16" />

      {/* Bottom CTA to Begin Consultation */}
      <Container>
        <div className="bg-forest text-paper p-8 sm:p-12 rounded-[4px] border border-deep-forest relative overflow-hidden text-center max-w-4xl mx-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <Badge variant="turmeric" className="mx-auto">
              Start Your Healing Journey
            </Badge>
            <h3 className="font-display text-display-h3 text-paper">
              Discuss Your Condition with Our Chief Vaidya
            </h3>
            <p className="font-body text-xs sm:text-sm text-paper/85 leading-relaxed">
              Whether you are suffering from chronic spine pain, autoimmune flare-ups, gut dysbiosis,
              or sleep disorders, our clinical team will formulate a precise classical roadmap.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button href="/book" variant="primary" className="bg-turmeric text-deep-forest hover:bg-turmeric/90">
                Book Initial Consultation
              </Button>
              <Button href="/planner" variant="secondary" className="border-paper/40 text-paper hover:bg-paper/10">
                Estimate Panchakarma Package
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
