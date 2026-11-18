import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { doctors } from '@/lib/data';
import { IMAGES } from '@/lib/config/images';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import {
  Clock,
  Languages,
  Award,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About the Doctor | Dr. Lavesh Bohra | Vankal Ayurveda',
  description:
    'Learn about Dr. Lavesh Bohra, BAMS (2026), SMIAS, Gujarat Ayurved University, Registered Ayurvedic Practitioner at Vankal Ayurveda.',
  openGraph: {
    title: 'Dr. Lavesh Bohra | Registered Ayurvedic Practitioner | Vankal Ayurveda',
    description:
      'Individual Ayurvedic consultations and lifestyle care rooted in classical principles by Dr. Lavesh Bohra.',
  },
};

export default function DoctorsPage() {
  const doctor = doctors.find((d) => d.slug === 'dr-lavesh-bohra') || doctors[0];

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream min-h-screen">
      {/* Page Header */}
      <Container className="mb-14 md:mb-16">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            ચિકિત્સક પરિચય · Ayurvedic Practitioner
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-6">
            Grounded in Classical Samhitas. <br />
            <span className="italic font-normal text-turmeric">
              Individualized Patient Care.
            </span>
          </h1>
          <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed">
            At Vankal Ayurveda, consultations are unhurried and personalized, honoring the classical
            principle that authentic assessment requires understanding the unique individual, their
            metabolic fire (Agni), and their daily and seasonal habits.
          </p>
        </div>
      </Container>

      {/* Featured Physician Profile Card */}
      <Container className="mb-20">
        <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-sm">
          {/* Decorative background watermark */}
          <div className="absolute right-0 bottom-0 text-[180px] font-sanskrit text-forest/[0.03] select-none pointer-events-none translate-x-12 translate-y-12">
            વૈદ્ય
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Portrait & Quick Meta */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative w-56 sm:w-64 md:w-72 aspect-4/5 rounded-t-full rounded-b-[4px] overflow-hidden border border-forest/20 shadow-md bg-cream mb-6">
                <Image
                  src={IMAGES.doctorPortrait}
                  alt="Dr. Lavesh Bohra, Ayurvedic practitioner at VANKAL AYURVEDA"
                  fill
                  sizes="(max-width: 768px) 90vw, 320px"
                  className="object-cover object-top"
                  placeholder="blur"
                  blurDataURL={IMAGES.doctorPortraitBlur}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 text-cream flex items-baseline justify-between z-10">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-turmeric block">
                      Registration Status
                    </span>
                    <span className="font-mono text-[11px] font-semibold">
                      {doctor.ayushRegistrationNo}
                    </span>
                  </div>
                  <span className="font-serif italic text-[11px] text-paper/80">
                    નોંધાયેલા વૈદ્ય
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 w-full">
                <div className="flex items-center gap-2 text-xs text-ink/80 font-body">
                  <Clock className="w-3.5 h-3.5 text-turmeric shrink-0" />
                  <span>Consultations: By Prior Appointment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink/80 font-body">
                  <Languages className="w-3.5 h-3.5 text-sage shrink-0" />
                  <span>Languages: English, Hindi, Gujarati</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink/80 font-body">
                  <Award className="w-3.5 h-3.5 text-clay shrink-0" />
                  <span>Consultation Fee: ₹{doctor.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Right Bio & Details */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="forest">Ayurvedic Physician</Badge>
                <span className="font-sanskrit text-xs text-sage">{doctor.sanskritTitle}</span>
              </div>
              <h2 className="font-display text-display-h2 text-deep-forest mb-2">
                {doctor.name}
              </h2>
              <p className="font-body text-sm font-medium text-forest mb-4">
                {doctor.title}
              </p>

              {/* Degrees list */}
              <div className="flex flex-wrap gap-2 mb-6">
                {doctor.degrees.map((deg, i) => (
                  <span
                    key={i}
                    className="inline-block text-[11px] font-mono bg-cream px-2.5 py-1 rounded-[2px] border border-forest/10 text-ink/80"
                  >
                    {deg}
                  </span>
                ))}
              </div>

              <p className="font-body text-sm md:text-base text-ink/80 leading-relaxed mb-6">
                {doctor.bio}
              </p>

              {/* Classical Quote Callout */}
              <blockquote className="p-4 rounded-[3px] bg-cream/70 border-l-2 border-turmeric text-xs md:text-sm text-ink/85 italic mb-6">
                "{doctor.charakaQuote}"
              </blockquote>

              {/* Clinical Focus Chips */}
              <div className="mb-8">
                <span className="font-mono text-xs uppercase tracking-wider text-forest/70 block mb-2 font-medium">
                  Practice Focus:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {doctor.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-forest/5 text-deep-forest px-3 py-1 rounded-full border border-forest/15"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-forest/10">
                <Button href={`/book?doctor=${doctor.slug}`} variant="primary">
                  Book Consultation
                </Button>
                <Button href={`/doctors/${doctor.slug}`} variant="secondary">
                  Read Full Profile
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <BotanicalDivider className="my-16" />

      {/* Philosophy Section */}
      <Container>
        <div className="bg-forest text-paper p-8 sm:p-12 rounded-[4px] border border-deep-forest relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="font-mono text-xs text-turmeric uppercase tracking-wider block mb-2 font-medium">
              Classical Philosophy · ચરક સંહિતા સૂત્રસ્થાન ૩૦
            </span>
            <h3 className="font-display text-display-h3 text-paper mb-4">
              "પ્રયોજનં ચાસ્ય સ્વસ્થસ્ય સ્વાસ્થ્યરક્ષણમાતુરસ્ય વિકારપ્રશમનં ચ||"
            </h3>
            <p className="font-body text-sm sm:text-base text-paper/80 leading-relaxed mb-6">
              The purpose of Ayurveda is twofold: to preserve the pristine health of the healthy and
              to pacify disorders in the afflicted. At Vankal Ayurveda, we prioritize individual
              understanding, providing personalized dietary regimens (Ahara), balanced routines (Dinacharya),
              and seasonal care (Ritucharya).
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/book" variant="primary" className="bg-turmeric text-deep-forest hover:bg-turmeric/90">
                Schedule a Consultation
              </Button>
              <Button href="/about" variant="secondary" className="border-paper/40 text-paper hover:bg-paper/10">
                About Our Approach
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
