import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { TreatmentFaqAccordion } from '@/components/treatments/TreatmentFaqAccordion';
import { treatments } from '@/lib/data/treatments';
import {
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  HeartHandshake,
  FileCheck2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all 12 treatments + their classical aliases
export async function generateStaticParams() {
  const allSlugs = treatments.flatMap((t) => [t.slug, ...(t.aliases || [])]);
  return allSlugs.map((slug) => ({ slug }));
}

// Dynamic SEO metadata per treatment
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = treatments.find(
    (t) => t.slug === slug || t.aliases?.includes(slug)
  );

  if (!treatment) {
    return {
      title: 'Therapy Not Found | Aarogyam Ayurveda',
      description: 'The requested classical Ayurvedic therapy could not be located.',
    };
  }

  return {
    title: `${treatment.name} (${treatment.sanskritName}) | Classical Therapy Jaipur`,
    description: `${treatment.shortDescription} Classical protocol documented in Ayurveda Samhitas. Duration: ${treatment.duration}. Fee: ${treatment.priceRange}.`,
    keywords: [
      treatment.name,
      treatment.sanskritName,
      'Ayurveda therapy Jaipur',
      ...treatment.indications.slice(0, 5),
    ],
    openGraph: {
      title: `${treatment.name} | Aarogyam Ayurveda Clinic`,
      description: treatment.shortDescription,
      images: [
        {
          url: treatment.featuredImage,
          width: 1200,
          height: 630,
          alt: treatment.name,
        },
      ],
      type: 'article',
      locale: 'en_IN',
    },
  };
}

export default async function TreatmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const treatment = treatments.find(
    (t) => t.slug === slug || t.aliases?.includes(slug)
  );

  if (!treatment) {
    notFound();
  }

  // Related therapies from the relatedSlugs list or same category
  const relatedTreatments = treatments
    .filter(
      (t) =>
        t.slug !== treatment.slug &&
        (treatment.relatedSlugs.includes(t.slug) || t.category === treatment.category)
    )
    .slice(0, 3);

  return (
    <div className="py-10 sm:py-16">
      <Container size="default">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-2 text-xs text-ink/60 mb-6 font-mono"
        >
          <Link href="/" className="hover:text-deep-forest underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/treatments" className="hover:text-deep-forest underline">
            Treatments
          </Link>
          <span>/</span>
          <span className="text-forest font-semibold">{treatment.name}</span>
        </nav>

        {/* HERO SECTION */}
        <div className="mb-12 pb-10 border-b border-forest/15">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="sage" dot>
              {treatment.category}
            </Badge>
            <Badge variant="turmeric" dot>
              {treatment.primaryDosha} Pacifying
            </Badge>
            <span className="text-xs font-mono text-ink/60">
              Charaka & Sushruta Samhita Reference
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-display-h1 text-deep-forest font-normal tracking-tight">
                {treatment.name}
              </h1>
              <p className="font-devanagari text-turmeric text-2xl sm:text-3xl mt-2 tracking-wide font-normal">
                {treatment.sanskritName}
              </p>
              <p className="text-body-lg text-ink/80 mt-4 leading-relaxed font-serif italic text-lg sm:text-xl">
                &ldquo;{treatment.tagline || treatment.shortDescription}&rdquo;
              </p>
            </div>

            {/* Quick Hero CTA for mobile/desktop */}
            <div className="flex sm:hidden flex-wrap gap-3">
              <Button href={`/book?therapy=${treatment.slug}`} variant="turmeric" size="sm">
                Book This Therapy
              </Button>
            </div>
          </div>

          {/* Quick Facts Bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-cream/90 border border-forest/15 rounded-[4px]">
            <div className="p-3 bg-paper rounded border border-forest/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-forest/70 block mb-1">
                Duration & Course
              </span>
              <span className="text-xs sm:text-sm font-semibold text-deep-forest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-turmeric shrink-0" />
                {treatment.duration}
              </span>
            </div>

            <div className="p-3 bg-paper rounded border border-forest/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-forest/70 block mb-1">
                Estimated Price
              </span>
              <span className="text-xs sm:text-sm font-semibold text-deep-forest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-turmeric shrink-0" />
                {treatment.priceRange}
              </span>
            </div>

            <div className="p-3 bg-paper rounded border border-forest/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-forest/70 block mb-1">
                Constitutional Focus
              </span>
              <span className="text-xs sm:text-sm font-semibold text-deep-forest flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-sage shrink-0" />
                {treatment.primaryDosha} Dominance
              </span>
            </div>

            <div className="p-3 bg-paper rounded border border-forest/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-forest/70 block mb-1">
                Supervision
              </span>
              <span className="text-xs sm:text-sm font-semibold text-deep-forest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-forest shrink-0" />
                Senior Physician Guided
              </span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT: Content (8) + Sticky Booking Card (4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT: CLINICAL CONTENT (8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Featured Image */}
            <div className="relative aspect-16/9 rounded-[4px] overflow-hidden border border-forest/15 bg-forest/5 shadow-xs">
              <Image
                src={treatment.featuredImage}
                alt={treatment.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-paper/90 backdrop-blur-xs px-3 py-1.5 rounded-[3px] border border-forest/20 text-xs font-mono text-deep-forest">
                Aarogyam Panchakarma Wing · Civil Lines, Jaipur
              </div>
            </div>

            {/* Comprehensive Clinical Overview */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                <h2 className="text-display-h2 text-deep-forest font-normal">
                  Classical Description & Mechanism
                </h2>
              </div>
              <p className="text-body-base text-ink/80 leading-relaxed font-sans pt-1">
                {treatment.longDescription}
              </p>

              {/* Materia Medica / Key Formulations */}
              {treatment.herbsUsed && treatment.herbsUsed.length > 0 && (
                <div className="p-4 bg-cream/70 border border-forest/10 rounded-[3px] mt-4">
                  <span className="text-xs font-mono uppercase text-forest font-semibold block mb-2 tracking-wider">
                    Classical Materia Medica Utilized:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {treatment.herbsUsed.map((herb, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-paper border border-forest/15 text-deep-forest"
                      >
                        <Leaf className="w-3 h-3 text-sage" />
                        {herb}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Clinical Indications as Chips */}
            <section className="space-y-4 pt-4 border-t border-forest/10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                <h2 className="text-display-h2 text-deep-forest font-normal">
                  Clinical Indications (रोग लक्षण)
                </h2>
              </div>
              <p className="text-body-sm text-ink/70">
                This classical therapy is traditionally prescribed to help support and manage the
                following conditions:
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {treatment.indications.map((ind, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-cream border border-forest/20 text-deep-forest text-xs sm:text-sm font-medium shadow-2xs hover:border-forest/40 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                    <span>{ind}</span>
                  </span>
                ))}
              </div>
            </section>

            {/* Procedure as Numbered Stepper */}
            <section className="space-y-6 pt-4 border-t border-forest/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                  <h2 className="text-display-h2 text-deep-forest font-normal">
                    The Procedure (विधि एवं प्रक्रिया)
                  </h2>
                </div>
                <span className="text-xs font-mono text-sage tracking-wider uppercase hidden sm:inline">
                  3 Classical Phases
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-forest/20">
                {treatment.procedureSteps.map((step) => (
                  <div key={step.step} className="relative group">
                    {/* Stepper Node */}
                    <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-paper border-2 border-forest flex items-center justify-center text-xs font-mono font-bold text-forest group-hover:bg-forest group-hover:text-cream transition-colors shadow-2xs">
                      {step.step < 10 ? `0${step.step}` : step.step}
                    </div>

                    <div className="bg-cream/70 border border-forest/15 rounded-[4px] p-5 sm:p-6 space-y-2 group-hover:border-forest/30 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-turmeric uppercase font-semibold tracking-wider">
                          {step.phase}
                        </span>
                        {step.duration && (
                          <span className="text-[11px] font-mono text-ink/60 bg-paper px-2 py-0.5 rounded border border-forest/10">
                            {step.duration}
                          </span>
                        )}
                      </div>

                      <h3 className="text-display-h3 text-deep-forest font-normal">
                        {step.title}
                      </h3>

                      <p className="text-body-sm text-ink/80 leading-relaxed pt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What to Expect During & After Session */}
            <section className="space-y-4 pt-4 border-t border-forest/10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                <h2 className="text-display-h2 text-deep-forest font-normal">
                  What to Expect
                </h2>
              </div>
              <div className="p-5 sm:p-6 bg-paper rounded-[4px] border border-forest/15 space-y-3">
                <p className="text-body-base text-ink/80 leading-relaxed">
                  {treatment.whatToExpect}
                </p>
              </div>
            </section>

            {/* Precautions (Do's & Don'ts) */}
            <section className="space-y-4 pt-4 border-t border-forest/10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                <h2 className="text-display-h2 text-deep-forest font-normal">
                  Clinical Precautions & Care
                </h2>
              </div>
              <ul className="space-y-2.5">
                {treatment.precautions.map((prec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-body-sm text-ink/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest mt-2 shrink-0" />
                    <span>{prec}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* "Who Should Avoid" (Bordered Caution Note) */}
            <section className="p-6 sm:p-7 bg-clay/5 border-2 border-clay/30 rounded-[4px] space-y-4">
              <div className="flex items-center gap-2.5 text-clay">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-display-h3 font-normal text-clay tracking-tight">
                  Who Should Avoid This Therapy (अनर्ह · Contraindications)
                </h3>
              </div>
              <p className="text-body-sm text-ink/80 leading-relaxed">
                In classical Ayurvedic medicine, safety takes precedence over intervention. This
                therapy is contraindicated or requires specific physician evaluation under the
                following conditions:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {treatment.whoShouldAvoid.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs sm:text-sm text-ink/85 bg-paper/80 p-2.5 rounded border border-clay/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-clay mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-ink/60 font-mono italic pt-1">
                * If you are pregnant, nursing, recovering from surgery, or taking cardiovascular
                medication, disclose all medical history to Dr. Aditya Bohra during pulse diagnosis.
              </p>
            </section>

            {/* Interactive FAQ Accordion */}
            <section className="space-y-4 pt-4 border-t border-forest/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                  <h2 className="text-display-h2 text-deep-forest font-normal">
                    Frequently Asked Questions
                  </h2>
                </div>
                <span className="text-xs font-mono text-sage uppercase">
                  Patient Queries
                </span>
              </div>
              <p className="text-body-sm text-ink/70">
                Common questions answered by our clinical team regarding preparation, sensations, and
                post-therapy care.
              </p>

              <TreatmentFaqAccordion faqs={treatment.faqs} />
            </section>

            {/* Medical Disclaimer Note */}
            <div className="p-4 sm:p-5 bg-cream/50 border border-forest/15 rounded-[3px] text-xs text-ink/70 leading-relaxed font-mono">
              <div className="font-semibold text-deep-forest mb-1 uppercase tracking-wider">
                Clinical Governance & Disclaimer:
              </div>
              All therapeutic protocols at Aarogyam Ayurveda are personalized classical procedures
              prescribed in accordance with the Drugs and Cosmetics Act (Ayurveda, Siddha, and Unani
              regulations) and standard AYUSH clinical guidelines. Results vary based on individual
              Prakriti (biological constitution), stage of pathology (Kriya Kala), and adherence to
              the prescribed dietary regimen (Pathya-Apathya).
            </div>
          </div>

          {/* RIGHT: STICKY BOOKING SIDEBAR (4 Cols) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-cream border-2 border-forest/20 rounded-[4px] p-6 sm:p-7 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-turmeric font-semibold block mb-1">
                  Classical Protocol Reservation
                </span>
                <h3 className="text-display-h3 text-deep-forest font-normal">
                  Schedule {treatment.name}
                </h3>
              </div>

              {/* Price Callout */}
              <div className="p-4 bg-paper rounded border border-forest/15 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink/60 block">
                  Therapy Price Range (Jaipur Clinic)
                </span>
                <div className="text-xl sm:text-2xl font-serif font-semibold text-deep-forest">
                  {treatment.priceRange}
                </div>
                <span className="text-[11px] text-sage font-mono block">
                  Includes pure single-batch classical oils & pre-therapy pulse check
                </span>
              </div>

              {/* Slot hint */}
              <div className="flex items-center gap-2.5 p-3 rounded bg-forest/5 border border-forest/15 text-xs text-deep-forest">
                <Calendar className="w-4 h-4 text-forest shrink-0" />
                <div>
                  <span className="font-semibold block">Next Available Slot:</span>
                  <span className="text-ink/75 font-mono text-[11px]">
                    Tomorrow at 10:30 AM · Morning Nadi Pariksha
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  href={`/book?therapy=${treatment.slug}`}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Book Consultation & Therapy
                </Button>

                <Button
                  href={`https://wa.me/919829012345?text=${encodeURIComponent(
                    `Hello Dr. Bohra's team at Aarogyam Ayurveda, I would like to inquire about the ${treatment.name} therapy.`
                  )}`}
                  variant="secondary"
                  size="md"
                  external
                  className="w-full justify-center bg-paper"
                  icon={<MessageCircle className="w-4 h-4 text-[#25D366]" />}
                >
                  Quick WhatsApp Inquiry
                </Button>
              </div>

              {/* Four Clinical Assurances */}
              <div className="pt-4 border-t border-forest/15 space-y-3 text-xs text-ink/80">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                  <span>100% Classical single-source herbal oils</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                  <span>Private sterile Haveli therapy suites</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                  <span>Male therapists for men / Female for women</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                  <span>Personalized post-therapy diet (Pathya)</span>
                </div>
              </div>

              {/* Contact Help */}
              <div className="pt-4 border-t border-forest/15 text-center">
                <span className="text-[11px] font-mono text-ink/60 block mb-1">
                  Prefer direct phone consultation?
                </span>
                <a
                  href="tel:+911412223456"
                  className="text-xs font-semibold text-deep-forest hover:text-forest inline-flex items-center gap-1.5 underline"
                >
                  <Phone className="w-3.5 h-3.5 text-turmeric" />
                  +91 141 222 3456 (Civil Lines Desk)
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* RELATED TREATMENTS SECTION */}
        {relatedTreatments.length > 0 && (
          <div className="mt-20 pt-12 border-t border-forest/15">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-eyebrow font-semibold text-forest uppercase tracking-widest block mb-1">
                  Synergistic Protocols
                </span>
                <h2 className="text-display-h2 text-deep-forest font-normal">
                  Related Classical Therapies
                </h2>
              </div>
              <Button href="/treatments" variant="text-link" size="sm">
                View all 12 therapies
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTreatments.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/treatments/${rel.slug}`}
                  className="group bg-cream/70 hover:bg-cream border border-forest/15 hover:border-forest/35 rounded-[4px] p-5 transition-all duration-300 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="relative aspect-16/10 rounded-[3px] overflow-hidden mb-4 bg-forest/10">
                      <Image
                        src={rel.featuredImage}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-paper/90 text-[10px] font-mono px-2 py-0.5 rounded-full border border-forest/15 text-deep-forest">
                        {rel.category}
                      </div>
                    </div>

                    <span className="font-devanagari text-turmeric text-xs block mb-1">
                      {rel.sanskritName}
                    </span>

                    <h3 className="text-display-h3 text-deep-forest font-normal group-hover:text-forest transition-colors">
                      {rel.name}
                    </h3>

                    <p className="text-body-sm text-ink/75 mt-2 line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-forest/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-ink/60">{rel.duration}</span>
                    <span className="font-medium text-forest group-hover:text-turmeric inline-flex items-center gap-1 transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
