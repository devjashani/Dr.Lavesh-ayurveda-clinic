import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { doctors } from '@/lib/data';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Physicians & Vaidyas | Aarogyam Ayurveda Jaipur',
  description:
    'Meet Dr. Aditya Bohra (MD Kayachikitsa), Dr. Ananya Sharma (MS Prasuti & Stri Roga), and Mukesh Gurjar (Lead Marma Specialist) at Aarogyam Ayurveda, Jaipur.',
  openGraph: {
    title: 'Our Physicians & Vaidyas | Aarogyam Ayurveda Jaipur',
    description:
      'Meet our university-trained, AYUSH-registered Ayurvedic physicians specializing in Nadi Pariksha, Panchakarma, and integrative chronic disease care.',
  },
};

export default function DoctorsPage() {
  const chief = doctors.find((d) => d.slug === 'dr-aditya-bohra') || doctors[0];
  const faculty = doctors.filter((d) => d.slug !== 'dr-aditya-bohra');

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-cream">
      {/* Page Header */}
      <Container className="mb-14 md:mb-20">
        <div className="max-w-3xl">
          <Badge variant="sage" className="mb-4">
            चिकित्सकमण्डलम् · Faculty of Medicine
          </Badge>
          <h1 className="font-display text-display-h1 text-deep-forest tracking-tight leading-[1.08] mb-6">
            Grounded in Classical Samhitas. <br />
            <span className="italic font-normal text-turmeric">
              Informed by Modern Pathology.
            </span>
          </h1>
          <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed">
            Every physician and therapist at Aarogyam holds accredited post-graduate university
            credentials and descends from traditional clinical lineages. Consultations are unhurried,
            lasting 40 to 50 minutes, honoring the ancient dictum that true diagnosis requires observing
            the whole individual, not merely silencing an isolated symptom.
          </p>
        </div>

        {/* Clinical Trust Points Bar */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 md:p-6 bg-paper rounded-[4px] border border-forest/10 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-forest shrink-0" />
            <div>
              <div className="font-mono text-xs text-forest uppercase font-medium">AYUSH Certified</div>
              <div className="font-body text-xs text-ink/70">Verified State Registration</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-turmeric shrink-0" />
            <div>
              <div className="font-mono text-xs text-forest uppercase font-medium">40+ Min Pulse OPD</div>
              <div className="font-body text-xs text-ink/70">Unhurried Assessment</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-forest shrink-0" />
            <div>
              <div className="font-mono text-xs text-forest uppercase font-medium">40+ Combined Yrs</div>
              <div className="font-body text-xs text-ink/70">Clinical Mastery</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Stethoscope className="w-5 h-5 text-clay shrink-0" />
            <div>
              <div className="font-mono text-xs text-forest uppercase font-medium">18,500+ Nadi Readings</div>
              <div className="font-body text-xs text-ink/70">Empirical Accuracy</div>
            </div>
          </div>
        </div>
      </Container>

      {/* Featured Chief Physician Spotlight Card */}
      <Container className="mb-20">
        <div className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-sm">
          {/* Subtle decorative background watermark */}
          <div className="absolute right-0 bottom-0 text-[180px] font-sanskrit text-forest/[0.03] select-none pointer-events-none translate-x-12 translate-y-12">
            वैद्य
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Portrait & Quick Meta */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative w-56 sm:w-64 md:w-72 aspect-4/5 rounded-t-full rounded-b-[4px] overflow-hidden border border-forest/20 shadow-md bg-forest/5 mb-6">
                <div className="w-full h-full bg-gradient-to-b from-forest/20 via-paper to-forest/30 flex items-center justify-center p-6 text-center">
                  <div>
                    <span className="font-sanskrit text-3xl text-forest/40 block mb-2">ॐ</span>
                    <span className="font-display text-lg text-deep-forest font-medium block">
                      {chief.name}
                    </span>
                    <span className="font-mono text-[11px] text-forest/70 block mt-1">
                      {chief.ayushRegistrationNo}
                    </span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="turmeric" className="shadow-xs">
                    Chief Physician
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5 w-full">
                <div className="flex items-center gap-2 text-xs text-ink/80 font-body">
                  <Clock className="w-3.5 h-3.5 text-turmeric shrink-0" />
                  <span>OPD: 9:00 AM – 1:30 PM & 4:30 PM – 7:30 PM</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink/80 font-body">
                  <Languages className="w-3.5 h-3.5 text-sage shrink-0" />
                  <span>Languages: English, Hindi, Rajasthani, Sanskrit</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink/80 font-body">
                  <Award className="w-3.5 h-3.5 text-clay shrink-0" />
                  <span>In-Person Consultation: ₹{chief.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Right Bio & Clinical Monograph Preview */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="forest">Chief Vaidya</Badge>
                <span className="font-sanskrit text-xs text-sage">{chief.sanskritTitle}</span>
              </div>
              <h2 className="font-display text-display-h2 text-deep-forest mb-2">
                {chief.name}
              </h2>
              <p className="font-body text-sm font-medium text-forest mb-4">
                {chief.title}
              </p>

              {/* Degrees list */}
              <div className="flex flex-wrap gap-2 mb-6">
                {chief.degrees.map((deg, i) => (
                  <span
                    key={i}
                    className="inline-block text-[11px] font-mono bg-cream px-2.5 py-1 rounded-[2px] border border-forest/10 text-ink/80"
                  >
                    {deg}
                  </span>
                ))}
              </div>

              <p className="font-body text-sm md:text-base text-ink/80 leading-relaxed mb-6">
                {chief.bio}
              </p>

              {/* Classical Quote Callout */}
              <blockquote className="p-4 rounded-[3px] bg-cream/70 border-l-2 border-turmeric text-xs md:text-sm text-ink/85 italic mb-6">
                "{chief.charakaQuote}"
              </blockquote>

              {/* Clinical Focus Chips */}
              <div className="mb-8">
                <span className="font-mono text-xs uppercase tracking-wider text-forest/70 block mb-2 font-medium">
                  Primary Clinical Focus:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {chief.specialties.map((spec, idx) => (
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
                <Button href={`/book?doctor=${chief.slug}`} variant="primary">
                  Book with Dr. Bohra
                </Button>
                <Button href={`/doctors/${chief.slug}`} variant="secondary">
                  Read Full Clinical Profile
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Rest of the Faculty: 2 Column Layout */}
      <Container className="mb-20">
        <SectionHeading
          eyebrow="Specialist Faculty & Lead Therapists"
          title="Multidisciplinary Classical Care"
          subtitle="From women's reproductive endocrinology to authentic hands-on Marma therapy, our medical team brings specialized depth to each clinical department."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faculty.map((doc) => (
            <div
              key={doc.id}
              className="bg-paper border border-forest/15 rounded-[4px] p-6 sm:p-8 flex flex-col justify-between hover:border-forest/30 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={doc.slug === 'dr-ananya-sharma' ? 'clay' : 'sage'}>
                    {doc.experienceYears}+ Years Clinical Experience
                  </Badge>
                  <span className="font-mono text-[11px] text-ink/60">
                    {doc.ayushRegistrationNo}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-20 h-24 rounded-t-full rounded-b-[3px] bg-gradient-to-b from-forest/20 via-paper to-forest/30 border border-forest/20 shrink-0 flex items-center justify-center p-2 text-center overflow-hidden">
                    <span className="font-sanskrit text-lg text-forest/50">ॐ</span>
                  </div>
                  <div>
                    <span className="font-sanskrit text-xs text-sage block">
                      {doc.sanskritTitle}
                    </span>
                    <h3 className="font-display text-xl text-deep-forest font-medium">
                      {doc.name}
                    </h3>
                    <p className="font-body text-xs font-medium text-forest/90 mt-0.5">
                      {doc.title}
                    </p>
                    <p className="font-mono text-xs text-clay mt-1">
                      Consultation: ₹{doc.consultationFee}
                    </p>
                  </div>
                </div>

                <p className="font-body text-xs sm:text-sm text-ink/75 leading-relaxed mb-5 line-clamp-3">
                  {doc.bio}
                </p>

                {/* Specialties */}
                <div className="mb-6">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-forest/70 mb-2 font-medium">
                    Specialized In:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.specialties.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-cream px-2 py-0.5 rounded-[2px] border border-forest/10 text-ink/80"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-forest/10 flex items-center justify-between gap-3">
                <Link
                  href={`/doctors/${doc.slug}`}
                  className="font-body text-xs text-forest hover:text-deep-forest underline underline-offset-4 font-medium"
                >
                  View Profile & Research
                </Link>
                <Button href={`/book?doctor=${doc.slug}`} variant="secondary" className="text-xs px-3.5 py-1.5">
                  Book Slot
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <BotanicalDivider className="my-16" />

      {/* Philosophy Section: The 4 Pillars (Chatushpada) */}
      <Container>
        <div className="bg-forest text-paper p-8 sm:p-12 rounded-[4px] border border-deep-forest relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="font-mono text-xs text-turmeric uppercase tracking-wider block mb-2 font-medium">
              Classical Philosophy · चरक संहिता सूत्रस्थान ९
            </span>
            <h3 className="font-display text-display-h3 text-paper mb-4">
              "भिषग्द्रव्याण्युपस्थाता रोगी पादचतुष्टयम्"
            </h3>
            <p className="font-body text-sm sm:text-base text-paper/80 leading-relaxed mb-6">
              According to Maharshi Charaka, successful healing requires four equal pillars: the Physician
              (Vaidya) endowed with clinical wisdom, the Botanical Medicine (Dravya) of proven purity,
              the Attending Nurse or Therapist (Upasthata) with compassionate hands, and the Patient (Rogi)
              who observes wholesome dietary discipline (Pathya). At Aarogyam, all four pillars work in
              sacred harmony.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/book" variant="primary" className="bg-turmeric text-deep-forest hover:bg-turmeric/90">
                Schedule a Consultation
              </Button>
              <Button href="/about" variant="secondary" className="border-paper/40 text-paper hover:bg-paper/10">
                Explore Clinic Heritage
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
