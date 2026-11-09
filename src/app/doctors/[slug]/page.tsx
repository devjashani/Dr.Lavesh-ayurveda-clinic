import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { doctors } from '@/lib/data/doctors';
import {
  Clock,
  MapPin,
  Calendar,
  Languages,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Phone,
  MessageCircle,
  FileText,
  Star,
  CheckCircle2,
  GraduationCap,
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
      title: 'Physician Not Found | Aarogyam Ayurveda',
      description: 'The requested Ayurvedic physician profile could not be found.',
    };
  }

  return {
    title: `${doctor.name} (${doctor.sanskritTitle || 'Vaidya'}) | Aarogyam Ayurveda Jaipur`,
    description: `${doctor.title} with ${doctor.experienceYears}+ years clinical experience. ${doctor.bio.slice(0, 150)}...`,
    openGraph: {
      title: `${doctor.name} | Aarogyam Ayurveda Medical Faculty`,
      description: doctor.bio.slice(0, 160),
    },
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor) {
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
            Faculty
          </Link>
          <span>/</span>
          <span className="text-forest font-medium">{doctor.name}</span>
        </nav>
      </Container>

      {/* Main Profile Layout */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Portrait & Sticky Consultation Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 shadow-xs text-center">
              {/* Arch Portrait Graphic */}
              <div className="relative mx-auto w-48 sm:w-56 aspect-4/5 rounded-t-full rounded-b-[4px] overflow-hidden border border-forest/20 shadow-md bg-forest/5 mb-5">
                <div className="w-full h-full bg-gradient-to-b from-forest/20 via-paper to-forest/30 flex items-center justify-center p-6 text-center">
                  <div>
                    <span className="font-sanskrit text-4xl text-forest/40 block mb-2">ॐ</span>
                    <span className="font-display text-base text-deep-forest font-medium block">
                      {doctor.name}
                    </span>
                    <span className="font-mono text-[10px] text-forest/70 block mt-1">
                      {doctor.ayushRegistrationNo}
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant="sage" className="mb-2">
                {doctor.experienceYears}+ Years Clinical Practice
              </Badge>
              <h1 className="font-display text-2xl text-deep-forest font-medium">
                {doctor.name}
              </h1>
              <p className="font-sanskrit text-xs text-sage mt-0.5">
                {doctor.sanskritTitle}
              </p>
              <p className="font-body text-xs text-forest/90 font-medium mt-1 mb-4">
                {doctor.title}
              </p>

              {/* Consultation Details */}
              <div className="p-3 bg-cream rounded-[3px] border border-forest/10 text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between items-center py-1 border-b border-forest/5">
                  <span className="text-ink/60">Initial Consultation</span>
                  <span className="font-mono font-medium text-deep-forest text-sm">
                    ₹{doctor.consultationFee}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-forest/5">
                  <span className="text-ink/60">Registration</span>
                  <span className="font-mono text-xs text-forest">
                    {doctor.ayushRegistrationNo}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-forest/5">
                  <span className="text-ink/60">Mode</span>
                  <span className="text-xs text-ink/80 font-medium">
                    In-Clinic & Video
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-ink/60">Days</span>
                  <span className="text-xs text-ink/80 font-medium">
                    {doctor.availableDays.length === 7
                      ? 'Mon – Sun'
                      : `${doctor.availableDays[0]} – ${doctor.availableDays[doctor.availableDays.length - 1]}`}
                  </span>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="space-y-3">
                <Button
                  href={`/book?doctor=${doctor.slug}`}
                  variant="primary"
                  className="w-full justify-center"
                >
                  Book with {doctor.name.split(' ')[0]} {doctor.name.split(' ')[1]}
                </Button>
                <Button
                  href="https://wa.me/919414012345?text=Namaste%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation%20with%20Aarogyam%20Ayurveda."
                  variant="secondary"
                  external
                  className="w-full justify-center text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-forest" />
                  Inquire via WhatsApp
                </Button>
              </div>
            </div>

            {/* OPD Hours Box */}
            <div className="bg-paper border border-forest/15 rounded-[4px] p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-turmeric" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                  OPD & Clinical Timings
                </h3>
              </div>
              <p className="font-body text-xs text-ink/80 leading-relaxed mb-3">
                {doctor.opdTimings}
              </p>
              <div className="flex items-center gap-2 text-xs text-ink/60">
                <MapPin className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>Civil Lines Clinic, Jaipur</span>
              </div>
            </div>

            {/* Languages Spoken */}
            <div className="bg-paper border border-forest/15 rounded-[4px] p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="w-4 h-4 text-sage" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                  Languages Spoken
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {doctor.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="text-xs bg-cream px-2.5 py-1 rounded-[2px] border border-forest/10 text-ink/80 font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: In-depth Monograph */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header intro & Biography */}
            <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
              <div className="mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-forest/70 font-medium">
                  Clinical Monograph
                </span>
                <h2 className="font-display text-display-h2 text-deep-forest mt-1">
                  Biography & Practice
                </h2>
              </div>
              <p className="font-body text-sm sm:text-base text-ink/85 leading-relaxed mb-6">
                {doctor.bio}
              </p>

              {/* Degrees list */}
              <div className="space-y-2 pt-4 border-t border-forest/10">
                <span className="font-mono text-xs uppercase tracking-wider text-forest/70 font-medium block">
                  Academic Qualifications:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {doctor.degrees.map((deg, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs bg-cream p-2.5 rounded-[2px] border border-forest/10 text-deep-forest"
                    >
                      <GraduationCap className="w-4 h-4 text-forest shrink-0" />
                      <span>{deg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinical Philosophy & Charaka Quote */}
            {doctor.philosophy && (
              <div className="bg-forest text-paper rounded-[4px] p-6 sm:p-8 border border-deep-forest relative overflow-hidden">
                <div className="relative z-10">
                  <span className="font-mono text-xs text-turmeric uppercase tracking-wider block mb-2 font-medium">
                    Clinical Philosophy · दर्शनम्
                  </span>
                  {doctor.charakaQuote && (
                    <blockquote className="font-display text-lg sm:text-xl text-paper/95 italic mb-4 border-l-2 border-turmeric pl-4">
                      "{doctor.charakaQuote}"
                    </blockquote>
                  )}
                  <p className="font-body text-xs sm:text-sm text-paper/85 leading-relaxed">
                    {doctor.philosophy}
                  </p>
                </div>
              </div>
            )}

            {/* Lineage & Tradition */}
            {doctor.lineage && (
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-clay" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                    Vaidya Lineage & Hospital Mentorship
                  </h3>
                </div>
                <p className="font-body text-sm text-ink/80 leading-relaxed">
                  {doctor.lineage}
                </p>
              </div>
            )}

            {/* Clinical Focus & Conditions Treated */}
            {doctor.clinicalFocus && (
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
                <div className="mb-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-forest/70 font-medium">
                    Specialized Pathologies
                  </span>
                  <h3 className="font-display text-xl text-deep-forest mt-1">
                    Clinical Focus & Conditions
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.clinicalFocus.map((focus, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-[3px] bg-cream border border-forest/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                      <span className="font-body text-xs text-ink/85 font-medium">
                        {focus}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-forest/10 flex items-center justify-between text-xs">
                  <span className="text-ink/60">
                    Explore associated therapies in our directory:
                  </span>
                  <Link
                    href="/conditions"
                    className="text-forest hover:text-deep-forest font-medium underline underline-offset-4 flex items-center gap-1"
                  >
                    View All Conditions <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Education Timeline */}
            {doctor.education && (
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                  <Building className="w-4 h-4 text-forest" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                    Formal Medical University Qualifications
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

            {/* Publications & Research */}
            {doctor.publications && doctor.publications.length > 0 && (
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-turmeric" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-deep-forest font-medium">
                    Published Clinical Research & Papers
                  </h3>
                </div>
                <div className="space-y-3">
                  {doctor.publications.map((pub, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-[3px] bg-cream/70 border border-forest/10"
                    >
                      <h4 className="font-body text-xs sm:text-sm font-medium text-deep-forest leading-snug">
                        "{pub.title}"
                      </h4>
                      <p className="font-mono text-[11px] text-forest/80 mt-1">
                        {pub.journal} · {pub.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Patient Reviews */}
            {doctor.reviews && doctor.reviews.length > 0 && (
              <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-forest/70 font-medium">
                      Patient Testimonies
                    </span>
                    <h3 className="font-display text-xl text-deep-forest mt-0.5">
                      Clinical Outcomes & Patient Reviews
                    </h3>
                  </div>
                  <Badge variant="sage">Verified Cases</Badge>
                </div>

                <div className="space-y-4">
                  {doctor.reviews.map((rev, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-[3px] bg-cream border border-forest/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-body text-sm font-medium text-deep-forest">
                            {rev.patientName}
                          </span>
                          <span className="text-xs text-ink/50 ml-2">({rev.date})</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-turmeric">
                          {[...Array(rev.rating)].map((_, r) => (
                            <Star key={r} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-forest">
                        Condition: {rev.condition}
                      </div>
                      <p className="font-body text-xs sm:text-sm text-ink/80 italic leading-relaxed">
                        "{rev.comment}"
                      </p>
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
                Schedule a 40-minute in-person radial pulse diagnosis in Civil Lines, Jaipur,
                or book an online video consultation from anywhere in the world.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button href={`/book?doctor=${doctor.slug}`} variant="primary">
                  Book Appointment Now
                </Button>
                <Button href="/doctors" variant="secondary">
                  View All Physicians
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
