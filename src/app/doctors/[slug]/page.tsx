import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { doctors } from '@/lib/data/doctors';
import { IMAGES } from '@/lib/config/images';
import {
  Clock,
  Languages,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return doctors.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor) {
    return {
      title: 'Physician Not Found | Vankal Ayurveda',
      description: 'The requested Ayurvedic physician profile could not be found.',
    };
  }

  return {
    title: `${doctor.name} | Registered Ayurvedic Practitioner | Vankal Ayurveda`,
    description: `${doctor.title}. ${doctor.degrees.join(', ')}. ${doctor.bio.slice(0, 150)}...`,
    openGraph: {
      title: `${doctor.name} | Vankal Ayurveda`,
      description: doctor.bio.slice(0, 160),
    },
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor || doctor.slug !== 'dr-lavesh-bohra') {
    notFound();
  }

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Breadcrumbs */}
      <Container className="mb-6">
        <nav className="flex items-center gap-2 text-xs font-mono text-ink/60">
          <Link href="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/doctors" className="hover:text-forest transition-colors">
            Doctor
          </Link>
          <span>/</span>
          <span className="text-forest font-medium">{doctor.name}</span>
        </nav>
      </Container>

      {/* Main Profile Layout */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Physician Card & Logistics (4 cols) */}
          <div className="lg:col-span-4 bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs space-y-6 lg:sticky lg:top-28">
            <div className="text-center">
              <div className="relative w-40 sm:w-48 aspect-4/5 rounded-t-full rounded-b-[3px] mx-auto overflow-hidden border border-forest/20 shadow-xs bg-cream mb-4">
                <Image
                  src={IMAGES.doctorPortrait}
                  alt="Dr. Lavesh Bohra, Ayurvedic practitioner at VANKAL AYURVEDA"
                  fill
                  sizes="(max-width: 768px) 90vw, 200px"
                  className="object-cover object-top"
                  placeholder="blur"
                  blurDataURL={IMAGES.doctorPortraitBlur}
                />
              </div>
              <h1 className="font-display text-2xl text-deep-forest font-medium">
                {doctor.name}
              </h1>
              <span className="font-sanskrit text-xs text-sage block mt-0.5">
                {doctor.sanskritTitle}
              </span>
              <p className="font-body text-xs font-medium text-forest/90 mt-1">
                {doctor.title}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cream border border-forest/15 text-[11px] font-mono text-forest">
                <ShieldCheck className="w-3.5 h-3.5 text-turmeric" />
                <span>{doctor.ayushRegistrationNo}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-forest/10 text-xs text-ink/80 font-body">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-turmeric shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-deep-forest block">Consultation Hours</span>
                  <span className="text-ink/70">Monday – Saturday: By prior appointment</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Languages className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-deep-forest block">Languages</span>
                  <span className="text-ink/70">{doctor.languages.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-clay shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-deep-forest block">Consultation Fee</span>
                  <span className="text-ink/70">
                    ₹{doctor.consultationFee} (Includes Prakriti assessment & lifestyle plan)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button href={`/book?doctor=${doctor.slug}`} variant="primary" className="w-full justify-center">
                Book Consultation
              </Button>
            </div>
          </div>

          {/* Right Column: Bio, Philosophy, Education, Focus (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Bio Card */}
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
              <Badge variant="forest" className="mb-4">
                Clinical Overview
              </Badge>
              <h2 className="font-display text-2xl sm:text-3xl text-deep-forest mb-4">
                About Dr. Lavesh Bohra
              </h2>
              <p className="font-body text-sm sm:text-base text-ink/80 leading-relaxed mb-4">
                {doctor.bio}
              </p>
              <div className="p-4 rounded-[3px] bg-cream/70 border-l-2 border-turmeric text-xs md:text-sm text-ink/85 italic">
                "{doctor.charakaQuote}"
              </div>
            </div>

            {/* Philosophy Card */}
            {doctor.philosophy && (
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                    Clinical Philosophy & Approach
                  </h3>
                </div>
                <p className="font-body text-sm sm:text-base text-ink/80 leading-relaxed">
                  {doctor.philosophy}
                </p>
              </div>
            )}

            {/* Education Card */}
            {doctor.education && (
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                  <Building className="w-4 h-4 text-forest" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                    Medical Qualifications
                  </h3>
                </div>
                <div className="space-y-4">
                  {doctor.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3.5 bg-cream rounded-[3px] border border-forest/10"
                    >
                      <div>
                        <h4 className="font-body text-sm font-medium text-deep-forest">
                          {edu.degree}
                        </h4>
                        <p className="font-body text-xs text-ink/70 mt-0.5">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-forest bg-paper px-2 py-0.5 rounded-[2px] border border-forest/15 shrink-0 ml-3">
                        {edu.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Focus Card */}
            {doctor.clinicalFocus && (
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                    Practice Areas & Consultation Focus
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.clinicalFocus.map((focus, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-[3px] bg-cream/70 border border-forest/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                      <span className="font-body text-xs text-ink/85 font-medium">
                        {focus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Booking Prompt */}
            <div className="p-8 bg-paper border border-forest/20 rounded-[4px] text-center space-y-4">
              <h3 className="font-display text-2xl text-deep-forest">
                Consult with {doctor.name}
              </h3>
              <p className="font-body text-sm text-ink/75 max-w-xl mx-auto">
                Schedule an individual Ayurvedic consultation or personalized lifestyle care session with Dr. Lavesh Bohra.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button href={`/book?doctor=${doctor.slug}`} variant="primary">
                  Book Appointment Now
                </Button>
                <Button href="/doctors" variant="secondary">
                  Back to Doctor Overview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
