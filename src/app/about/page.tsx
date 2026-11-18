import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import {
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Building,
  HeartHandshake,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Vankal Ayurveda · Philosophy & Individual Care',
  description:
    'Learn about Vankal Ayurveda. Individual Ayurvedic consultations and personalized lifestyle care guided by Dr. Lavesh Bohra, BAMS (2026), SMIAS, Gujarat Ayurved University.',
  openGraph: {
    title: 'About Vankal Ayurveda · Classical Wisdom, Individual Care',
    description:
      'Grounded in Charaka Samhita wisdom. Individual Ayurvedic consultations, personalized nutrition, and lifestyle care.',
    url: 'https://vankalayurveda.com/about',
    siteName: 'Vankal Ayurveda',
    locale: 'en_IN',
    type: 'website',
  },
};

const VERIFIED_CREDENTIALS = [
  {
    title: 'Attending Practitioner',
    code: 'Dr. Lavesh Bohra',
    description: 'Registered Ayurvedic Practitioner providing individualized clinical consultations.',
    icon: <HeartHandshake className="w-6 h-6 text-turmeric" />,
  },
  {
    title: 'Medical Degree',
    code: 'BAMS (2026)',
    description: 'Bachelor of Ayurvedic Medicine & Surgery from SMIAS, Gujarat Ayurved University.',
    icon: <GraduationCap className="w-6 h-6 text-turmeric" />,
  },
  {
    title: 'Regulatory Status',
    code: 'Registration No.: to be added',
    description: 'Registered Ayurvedic Practitioner adhering to classical Ayurvedic ethics.',
    icon: <ShieldCheck className="w-6 h-6 text-turmeric" />,
  },
  {
    title: 'Practice Focus',
    code: 'Consultation & Lifestyle Care',
    description: 'Individualized dietary roadmaps (Ahara), daily routines (Dinacharya), and seasonal care (Ritucharya).',
    icon: <Compass className="w-6 h-6 text-turmeric" />,
  },
];

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <Container size="default">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-ink/60 mb-6">
          <Link href="/" className="hover:text-deep-forest underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-deep-forest font-medium">About</span>
        </nav>

        {/* HERO SECTION: The Story of Vankal Ayurveda */}
        <section className="mb-20 pb-16 border-b border-forest/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
            <span className="text-eyebrow font-semibold text-forest tracking-widest">
              Our Clinical Philosophy · આયુર્વેદ સિદ્ધાંત
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-display-h1 text-deep-forest font-normal tracking-tight">
                Classical Roots. Individual Care. Living Discipline.
              </h1>

              <p className="font-gujarati text-turmeric text-2xl sm:text-3xl font-normal">
                આરોગ્યં મૂલમુત્તમમ્ — Health is the supreme foundation of all life endeavors
              </p>

              <div className="space-y-4 text-body-base text-ink/80 leading-relaxed pt-3 font-sans">
                <p>
                  Vankal Ayurveda is dedicated to practicing Ayurveda as a thoughtful, personalized
                  science of life. Led by <strong>Dr. Lavesh Bohra, BAMS (2026, SMIAS, Gujarat Ayurved University)</strong>,
                  our practice stands for thorough diagnostic inquiry rooted in the principles of
                  the <em>Charaka Samhita</em>.
                </p>
                <p>
                  In a landscape where health is often hurried or reduced to superficial routines,
                  Vankal focuses on what truly matters: understanding the whole person. We examine
                  your unique biological constitution (<em>Prakriti</em>), assess metabolic balance
                  (<em>Agni</em>), and tailor actionable daily and seasonal habits to restore your
                  body’s innate equilibrium.
                </p>
              </div>
            </div>

            {/* Quick Tenets Box */}
            <div className="lg:col-span-4 bg-cream border-2 border-forest/20 rounded-[4px] p-6 space-y-4 shadow-xs">
              <span className="text-xs font-mono uppercase tracking-wider text-turmeric font-semibold block">
                Foundational Principles
              </span>

              <div className="space-y-3 text-xs text-ink/80">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span><strong>Classical Grounding:</strong> Grounded in authentic Samhita medical texts.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span><strong>Individualized Consultation:</strong> Every recommendation is tailored to your unique Prakriti.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span><strong>Ahara & Vihara Focus:</strong> Nutrition, daily routine, and seasonal discipline as primary medicine.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span><strong>Transparent Guidance:</strong> Honest clinical advice with zero unverified miracle claims.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-forest/10 flex items-center justify-between text-xs font-mono text-sage">
                <span>Location: to be added</span>
                <span>Registered Practitioner</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THREE GUIDING CONVICTIONS */}
        <section className="mb-24 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold block">
              Our Compass · સિદ્ધાંત ત્રયી
            </span>
            <h2 className="text-display-h2 text-deep-forest font-normal">
              Three Guiding Convictions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vision Statement */}
            <div className="p-8 sm:p-10 bg-cream/90 border border-forest/20 rounded-[4px] flex flex-col justify-between space-y-6 shadow-xs group hover:border-forest/50 transition-colors">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block">
                  01 · The Vision (દૃષ્ટિ)
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-deep-forest font-normal leading-snug">
                  To honor Ayurveda as a personalized science of health.
                </h3>
              </div>
              <p className="text-body-sm text-ink/75 leading-relaxed pt-4 border-t border-forest/10">
                To move beyond superficial commercialization, proving that individualized lifestyle,
                circadian discipline, and classical nutrition build enduring well-being.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="p-8 sm:p-10 bg-forest text-cream rounded-[4px] flex flex-col justify-between space-y-6 shadow-xs group">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block">
                  02 · The Mission (ધ્યેય)
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-cream font-normal leading-snug">
                  Understand the root, honor the Prakriti, guide with care.
                </h3>
              </div>
              <p className="text-body-sm text-cream/80 leading-relaxed pt-4 border-t border-cream/15">
                Every individual receives attentive, unhurried guidance rooted in classical assessment,
                with practical advice suited to modern daily life.
              </p>
            </div>

            {/* Ethics Statement */}
            <div className="p-8 sm:p-10 bg-cream/90 border border-forest/20 rounded-[4px] flex flex-col justify-between space-y-6 shadow-xs group hover:border-forest/50 transition-colors">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-clay font-semibold block">
                  03 · The Ethics (આચાર રસાયન)
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-deep-forest font-normal leading-snug">
                  Honest guidance over commercial promises.
                </h3>
              </div>
              <p className="text-body-sm text-ink/75 leading-relaxed pt-4 border-t border-forest/10">
                We make no unsubstantiated claims or commercial promises. When modern medical care
                or emergency intervention is required, we advocate for the individual first.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: PRACTITIONER CREDENTIALS */}
        <section className="mb-20 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold block">
              Professional Credentials · પ્રમાણ
            </span>
            <h2 className="text-display-h2 text-deep-forest font-normal">
              Practitioner & Clinical Background
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VERIFIED_CREDENTIALS.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-cream/70 border border-forest/15 rounded-[4px] space-y-3 shadow-2xs"
              >
                {item.icon}
                <h4 className="font-serif font-medium text-deep-forest text-base">
                  {item.title}
                </h4>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-paper border border-forest/15 text-forest font-semibold">
                  {item.code}
                </span>
                <p className="text-xs text-ink/75 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA: Book Consultation */}
        <div className="bg-forest text-cream rounded-[4px] p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block">
              Personalized Consultation
            </span>
            <h3 className="text-display-h2 font-normal text-cream tracking-tight">
              Begin Your Journey with Classical Ayurvedic Care
            </h3>
            <p className="text-body-base text-cream/80 leading-relaxed">
              Schedule an individual consultation with Dr. Lavesh Bohra for personalized dietary
              and lifestyle guidance tailored to your constitutional needs.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button href="/book" variant="turmeric" size="lg" icon={<ShieldCheck className="w-4 h-4" />}>
                Book Consultation
              </Button>
              <Button href="/doctors" variant="secondary" size="lg" className="bg-transparent text-cream border-cream/30 hover:bg-cream/10">
                About the Doctor
              </Button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <BotanicalDivider variant="lotus" className="w-96 h-96" />
          </div>
        </div>
      </Container>
    </div>
  );
}
