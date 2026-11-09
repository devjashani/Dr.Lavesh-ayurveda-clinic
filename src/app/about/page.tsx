import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  Building2,
  FileCheck2,
  Scroll,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Aarogyam Ayurveda · Lineage, Philosophy & Facility Tour',
  description:
    'Discover the living lineage of Aarogyam Ayurveda in Civil Lines, Jaipur. Four generations of Rajasthan Vaidyas bridging canonical Charaka Samhita wisdom with modern NABL-verified safety.',
  keywords: [
    'About Aarogyam Ayurveda',
    'Ayurveda lineage Jaipur',
    'Dr Lavesh Bohra background',
    'Panchakarma facility Civil Lines',
    'Classical Ayurveda hospital Rajasthan',
  ],
  openGraph: {
    title: 'About Aarogyam Ayurveda · Vedic Roots, Clinical Safety',
    description:
      'Four generations of Rajasthan Vaidyas bridging canonical Charaka Samhita wisdom with modern clinical safety.',
    url: 'https://aarogyamayurveda.com/about',
    siteName: 'Aarogyam Classical Ayurveda Clinic',
    locale: 'en_IN',
    type: 'website',
  },
};

const TIMELINE_MILESTONES = [
  {
    year: '1948',
    title: 'Mewar Court Vaidya Tradition',
    sanskrit: 'राजवैद्य परम्परा',
    description:
      'Rajvaidya Pt. Vishwanath Bohra serves as a respected classical physician in the royal court of Mewar, compounding single-origin medicated oils and rasayanas from wild Aravalli botanicals.',
  },
  {
    year: '1974',
    title: 'Establishment of the Jaipur Aushadhashala',
    sanskrit: 'औषधशाला प्रतिष्ठापनम्',
    description:
      'The family establishes a dedicated classical compounding apothecary in Jaipur, standardizing Snehapaka protocols and classical decoctions strictly adhering to Sharangdhara Samhita guidelines.',
  },
  {
    year: '1999',
    title: 'Modern Clinical Integration by Dr. Lavesh Bohra',
    sanskrit: 'कायचिकित्सा अनुसन्धानम्',
    description:
      'Dr. Lavesh Bohra graduates from the National Institute of Ayurveda (NIA) and formalizes the Aarogyam clinical framework, integrating objective lab diagnostics with classical Nadi Pariksha.',
  },
  {
    year: '2012',
    title: 'Haveli Panchakarma Sanctuary Opens in Civil Lines',
    sanskrit: 'आरोग्यम् पञ्चकर्म निकेतनम्',
    description:
      'A historic colonial-era Jaipur haveli is restored with natural lime-plaster walls, private copper Droni suites, and specialized acoustic shielding for meditative Shirodhara therapy.',
  },
  {
    year: '2018',
    title: 'AYUSH Accreditation & Research Registry',
    sanskrit: 'आयुष मान्यता एवं अभिलेख',
    description:
      'The clinic receives formal AYUSH hospital registration (AYUSH-RJ-2018-0482) and initiates retrospective cohort studies on Basti Karma efficacy in lumbar disc pathologies.',
  },
  {
    year: '2026',
    title: 'Living Classical Healthcare for 34 Nations',
    sanskrit: 'वैश्विक आयुर्वेद सेवा',
    description:
      'Over 18,500 patients from 34 countries have completed authenticated Panchakarma bio-cleansing and Nadi Pariksha regimens at our Civil Lines sanctuary.',
  },
];

const CERTIFICATIONS = [
  {
    title: 'Ministry of AYUSH Registered',
    code: 'AYUSH-RJ-2018-0482',
    description: 'Officially registered classical Ayurveda hospital adhering to national standards of clinical governance.',
  },
  {
    title: 'NABL-Accredited Herbal Testing',
    code: 'Heavy Metals & Microbial Purity',
    description: 'Every batch of in-house oil, ghrita, and decoction is tested for lead, cadmium, mercury, and arsenic safety.',
  },
  {
    title: 'NCISM Certified Faculty',
    code: 'BAMS, MD, MS Degrees Verified',
    description: 'All resident vaidyas hold university postgraduate degrees from NIA Jaipur, BHU Varanasi, and GAU Jamnagar.',
  },
  {
    title: 'NABH Safety & Hygiene Protocols',
    code: 'Clean Clinical Standards',
    description: 'Sterile linen handling, single-patient disposable equipment, and hospital-grade sanitization in all therapy suites.',
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
          <span className="text-forest font-semibold">About Aarogyam</span>
        </nav>

        {/* HERO SECTION: The Story of the Clinic */}
        <section className="mb-20 pb-16 border-b border-forest/15">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-turmeric shrink-0" />
            <span className="text-eyebrow font-semibold text-forest tracking-widest">
              Our Lineage & Heritage · चतुष्पीढ़ी वैद्य परम्परा
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-display-h1 text-deep-forest font-normal tracking-tight">
                Vedic Roots. Clinical Safety. Living Lineage.
              </h1>

              <p className="font-devanagari text-turmeric text-2xl sm:text-3xl font-normal">
                आरोग्यं मूलमुत्तमम् — Health is the supreme foundation of all life endeavors
              </p>

              <div className="space-y-4 text-body-base text-ink/80 leading-relaxed pt-3 font-sans">
                <p>
                  Aarogyam Ayurveda was established not as a modern wellness brand, but as the natural
                  continuation of four generations of classical Vaidya scholarship in Rajasthan. Founded by
                  Rajvaidya Pt. Vishwanath Bohra and today led by his grandson, <strong>Dr. Lavesh Bohra, MD (Ayurveda)</strong>,
                  our clinic stands as a rare bridge between the profound philosophical depths of the
                  <em> Charaka Samhita</em> and modern clinical rigor.
                </p>
                <p>
                  In an era where Ayurveda is frequently diluted into cosmetic spa packages, scented candle
                  treatments, or commercial herbal marketing, Aarogyam remains uncompromising in its allegiance
                  to canonical medicine. We treat diseases at their biological root through precision radial
                  pulse diagnosis (<em>Nadi Pariksha</em>), authenticated Panchakarma bio-cleansing, and single-batch
                  classical herbal pharmacology.
                </p>
              </div>
            </div>

            {/* Quick Lineage Trust Box */}
            <div className="lg:col-span-4 bg-cream border-2 border-forest/20 rounded-[4px] p-6 space-y-4 shadow-xs">
              <span className="text-xs font-mono uppercase tracking-wider text-turmeric font-semibold block">
                Foundational Tenets
              </span>

              <div className="space-y-3 text-xs text-ink/80">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span><strong>Zero Commercial Spa Protocols:</strong> Every therapy is a classical medical intervention.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span><strong>Individualized Pulse Diagnosis:</strong> Therapies prescribed exclusively after Nadi Pariksha.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span><strong>Single-Origin Classical Herbs:</strong> In-house compounding with zero chemical adulterants.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span><strong>Full Inpatient Care:</strong> Private Haveli suites for comprehensive residential cleansing.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-forest/10 flex items-center justify-between text-xs font-mono text-sage">
                <span>Civil Lines, Jaipur</span>
                <span>Est. 1999</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: VISION, MISSION, & ETHICS AS THREE LARGE TYPOGRAPHIC STATEMENTS */}
        <section className="mb-24 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold block">
              Our Compass · सिद्धान्त त्रयी
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
                  01 · The Vision (दृष्टि)
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-deep-forest font-normal leading-snug">
                  To restore Ayurveda as a sovereign, precision medical science.
                </h3>
              </div>
              <p className="text-body-sm text-ink/75 leading-relaxed pt-4 border-t border-forest/10">
                To elevate classical Samhita healthcare beyond symptomatic wellness, proving through
                measurable biochemical outcomes that authentic Panchakarma is an unmatched cellular restorative.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="p-8 sm:p-10 bg-forest text-cream rounded-[4px] flex flex-col justify-between space-y-6 shadow-xs group">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block">
                  02 · The Mission (ध्येय)
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-cream font-normal leading-snug">
                  Treat the root, honour the Prakriti, never compromise on safety.
                </h3>
              </div>
              <p className="text-body-sm text-cream/80 leading-relaxed pt-4 border-t border-cream/15">
                Every patient receives personalized attention rooted in eighth-fold diagnosis (*Ashtavidha Pariksha*),
                guided by physicians who hold formal university post-graduate degrees and generational clinical lineage.
              </p>
            </div>

            {/* Ethics Statement */}
            <div className="p-8 sm:p-10 bg-cream/90 border border-forest/20 rounded-[4px] flex flex-col justify-between space-y-6 shadow-xs group hover:border-forest/50 transition-colors">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-clay font-semibold block">
                  03 · The Ethics (आचार रसायन)
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-deep-forest font-normal leading-snug">
                  Transparent clinical truth over commercial promises.
                </h3>
              </div>
              <p className="text-body-sm text-ink/75 leading-relaxed pt-4 border-t border-forest/10">
                We make no unverified miracle claims. When an acute surgical intervention or allopathic referral
                is warranted, we advocate for the patient first. We maintain complete transparency in formulations and fees.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: CLINIC TOUR AS AN ASYMMETRIC GALLERY */}
        <section className="mb-24 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block mb-1">
                The Healing Sanctuary · सिविल लाइन्स निकेतनम्
              </span>
              <h2 className="text-display-h2 text-deep-forest font-normal">
                Inside Our Jaipur Haveli
              </h2>
            </div>
            <p className="text-xs font-mono text-sage max-w-sm">
              Restored heritage architecture featuring acoustic isolation, natural lime walls, and authentic brass Dronis.
            </p>
          </div>

          {/* Asymmetric Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Gallery Item 1: Large Featured (7 cols) */}
            <div className="md:col-span-7 relative aspect-16/10 rounded-[4px] overflow-hidden border border-forest/20 bg-forest/10 shadow-xs group">
              <Image
                src="/images/treatments/panchakarma.jpg"
                alt="Central Panchakarma Courtyard"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-cream">
                <span className="text-[10px] font-mono text-turmeric uppercase tracking-wider block">
                  Sanctuary Architecture
                </span>
                <h4 className="text-lg font-serif font-normal">
                  The Central Courtyard & Inpatient Haveli Wing
                </h4>
                <p className="text-xs text-cream/75 mt-0.5 line-clamp-1">
                  Air-cooled with central fountain mist and planted with Tulsi, Neem, and sacred Kadamba trees.
                </p>
              </div>
            </div>

            {/* Gallery Item 2: Vertical (5 cols) */}
            <div className="md:col-span-5 relative aspect-4/3 md:aspect-auto rounded-[4px] overflow-hidden border border-forest/20 bg-forest/10 shadow-xs group">
              <Image
                src="/images/treatments/shirodhara.jpg"
                alt="Acoustically Isolated Shirodhara Suite"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-cream">
                <span className="text-[10px] font-mono text-turmeric uppercase tracking-wider block">
                  Sensory Healing
                </span>
                <h4 className="text-lg font-serif font-normal">
                  Sound-Attenuated Shirodhara Suites
                </h4>
                <p className="text-xs text-cream/75 mt-0.5 line-clamp-1">
                  Private suites equipped with suspended copper vessels and handmade teakwood Dronis.
                </p>
              </div>
            </div>

            {/* Gallery Item 3: Equal Width (4 cols) */}
            <div className="md:col-span-4 relative aspect-16/10 rounded-[4px] overflow-hidden border border-forest/20 bg-forest/10 shadow-xs group">
              <Image
                src="/images/treatments/apothecary.jpg"
                alt="In-house Classical Compounding Apothecary"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-cream">
                <span className="text-[10px] font-mono text-turmeric uppercase tracking-wider block">
                  Aushadhashala
                </span>
                <h4 className="text-base font-serif font-normal">
                  In-House Compounding Apothecary
                </h4>
              </div>
            </div>

            {/* Gallery Item 4: Equal Width (4 cols) */}
            <div className="md:col-span-4 relative aspect-16/10 rounded-[4px] overflow-hidden border border-forest/20 bg-forest/10 shadow-xs group">
              <Image
                src="/images/treatments/abhyanga.jpg"
                alt="Private Abhyanga Steam Chambers"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-cream">
                <span className="text-[10px] font-mono text-turmeric uppercase tracking-wider block">
                  Swedana Room
                </span>
                <h4 className="text-base font-serif font-normal">
                  Artisanal Wooden Steam Chambers
                </h4>
              </div>
            </div>

            {/* Gallery Item 5: Equal Width (4 cols) */}
            <div className="md:col-span-4 relative aspect-16/10 rounded-[4px] overflow-hidden border border-forest/20 bg-forest/10 shadow-xs group">
              <Image
                src="/images/treatments/herbs.jpg"
                alt="Botanical Herb Curation Bench"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-cream">
                <span className="text-[10px] font-mono text-turmeric uppercase tracking-wider block">
                  Pharmacognosy
                </span>
                <h4 className="text-base font-serif font-normal">
                  Raw Botanical Authentication Bench
                </h4>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: TIMELINE OF THE CLINIC'S JOURNEY */}
        <section className="mb-24 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block">
              Historical Milestones · यात्रा एवं कालक्रम
            </span>
            <h2 className="text-display-h2 text-deep-forest font-normal">
              78 Years of Unbroken Healing
            </h2>
          </div>

          <div className="relative pl-6 sm:pl-10 space-y-10 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-forest/20">
            {TIMELINE_MILESTONES.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Node */}
                <div className="absolute -left-6 sm:-left-10 top-0 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-paper border-2 border-forest flex items-center justify-center font-mono text-xs font-bold text-forest group-hover:bg-forest group-hover:text-cream transition-colors shadow-2xs">
                  {item.year.slice(2)}
                </div>

                <div className="bg-cream/80 border border-forest/15 rounded-[4px] p-6 sm:p-7 space-y-2 group-hover:border-forest/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-turmeric font-bold tracking-wider">
                      {item.year}
                    </span>
                    <span className="font-devanagari text-xs text-forest/70">
                      {item.sanskrit}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-deep-forest font-normal">
                    {item.title}
                  </h3>

                  <p className="text-body-sm text-ink/80 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: CERTIFICATIONS & REGISTRATIONS */}
        <section className="mb-20 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold block">
              Governance & Accreditations · प्रमाणीकरण
            </span>
            <h2 className="text-display-h2 text-deep-forest font-normal">
              Certified Clinical Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CERTIFICATIONS.map((cert, i) => (
              <div
                key={i}
                className="p-6 bg-cream/70 border border-forest/15 rounded-[4px] space-y-3 shadow-2xs"
              >
                <ShieldCheck className="w-6 h-6 text-turmeric" />
                <h4 className="font-serif font-medium text-deep-forest text-base">
                  {cert.title}
                </h4>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-paper border border-forest/15 text-forest font-semibold">
                  {cert.code}
                </span>
                <p className="text-xs text-ink/75 leading-relaxed">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA: Book a Visit */}
        <div className="bg-forest text-cream rounded-[4px] p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-turmeric font-semibold block">
              Visit Our Jaipur Sanctuary
            </span>
            <h3 className="text-display-h2 font-normal text-cream tracking-tight">
              Begin Your Healing Journey with Classical Pulse Diagnosis
            </h3>
            <p className="text-body-base text-cream/80 leading-relaxed">
              Experience the authentic atmosphere of our Civil Lines clinic. Meet Dr. Lavesh Bohra
              for an individualized Nadi Pariksha and personalized clinical roadmap.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button href="/book" variant="turmeric" size="lg" icon={<ShieldCheck className="w-4 h-4" />}>
                Book Nadi Pariksha Consultation
              </Button>
              <Button href="/treatments" variant="secondary" size="lg" className="bg-transparent text-cream border-cream/30 hover:bg-cream/10">
                Explore Classical Therapies
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
