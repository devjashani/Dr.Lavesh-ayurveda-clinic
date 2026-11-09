'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArchImage } from '@/components/ui/ArchImage';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  Sparkles,
  Calendar,
  Compass,
  FileText,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  Droplet,
} from 'lucide-react';

export default function DesignSystemPage() {
  const [motionTrigger, setMotionTrigger] = useState(0);

  const colors = [
    { name: 'Paper', token: '--color-paper', hex: '#F6F1E7', usage: 'Primary canvas background, soothing parchment warmth', textDark: true },
    { name: 'Cream', token: '--color-cream', hex: '#FBF8F1', usage: 'Card surfaces, input backgrounds, subtle elevated tiers', textDark: true },
    { name: 'Forest', token: '--color-forest', hex: '#1F3D2B', usage: 'Brand anchor, secondary actions, botanical lines, borders', textDark: false },
    { name: 'Deep Forest', token: '--color-deep-forest', hex: '#14291C', usage: 'Primary action buttons, high-contrast headings, footer foundation', textDark: false },
    { name: 'Sage', token: '--color-sage', hex: '#8FA68A', usage: 'Healing accents, secondary botanical tags, tranquil dividers', textDark: true },
    { name: 'Turmeric', token: '--color-turmeric', hex: '#D99A2B', usage: 'Therapeutic gold, active highlights, key CTAs, warm accents', textDark: false },
    { name: 'Clay', token: '--color-clay', hex: '#B5603A', usage: 'Terracotta earth, Pitta indications, alert/warning states', textDark: false },
    { name: 'Ink', token: '--color-ink', hex: '#1B1B18', usage: 'Primary editorial body copy, high legibility serif titles', textDark: false },
    { name: 'Mist', token: '--color-mist', hex: '#E4EADF', usage: 'Gentle washes, disabled states, subtle container fills', textDark: true },
  ];

  const doshaOptions = [
    { value: 'vata', label: 'Vata (Wind & Space)', sanskrit: 'वात' },
    { value: 'pitta', label: 'Pitta (Fire & Water)', sanskrit: 'पित्त' },
    { value: 'kapha', label: 'Kapha (Earth & Water)', sanskrit: 'कफ' },
    { value: 'tridoshic', label: 'Tridoshic (Equilibrium)', sanskrit: 'त्रिदोष' },
  ];

  return (
    <div className="py-12 sm:py-20">
      <Container size="default">
        {/* Header / Intro */}
        <div className="mb-16 pb-8 border-b border-forest/15">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-forest/15 text-xs text-forest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-turmeric" />
            <span className="font-mono uppercase tracking-widest text-[11px]">Living Specification v1.0</span>
            <span>•</span>
            <span className="font-serif italic">आरोग्यम् व्याकरणम्</span>
          </div>

          <h1 className="text-display-hero text-deep-forest font-normal tracking-tight">
            Aarogyam Design System
          </h1>

          <p className="text-body-lg text-ink/75 max-w-3xl mt-4 leading-relaxed">
            <strong className="text-deep-forest font-semibold">Calm clinical meets classical Ayurveda.</strong>{' '}
            A restrained, tactile visual grammar crafted for restorative health care. We pair the editorial gravitas of{' '}
            <em>Fraunces</em> and classical Devanagari with clinical clarity in <em>DM Sans</em>, encased in grounded earth pigments.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-forest/10 text-xs">
            <div>
              <span className="text-forest/60 block font-mono uppercase tracking-wider">Display Type</span>
              <span className="font-display font-medium text-sm text-deep-forest">Fraunces (Optical 9-144)</span>
            </div>
            <div>
              <span className="text-forest/60 block font-mono uppercase tracking-wider">Body & Clinical</span>
              <span className="font-sans font-medium text-sm text-deep-forest">DM Sans</span>
            </div>
            <div>
              <span className="text-forest/60 block font-mono uppercase tracking-wider">Epigraph Accents</span>
              <span className="font-serif italic text-sm text-deep-forest">Tiro Devanagari Hindi</span>
            </div>
            <div>
              <span className="text-forest/60 block font-mono uppercase tracking-wider">Motion Cadence</span>
              <span className="font-mono text-sm text-deep-forest">0.6s–1.2s Deceleration</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Color Palette */}
        <section id="colors" className="mb-20">
          <SectionHeading
            eyebrow="Color Palette"
            sanskritEyebrow="वर्ण योजना"
            title="Rooted Earth & Botanical Pigments"
            subtitle="Strictly zero neon and zero artificial violet gradients. Every color is inspired by raw Ayurvedic materia medica: sun-dried turmeric root, hand-milled clay, Himalayan pine, and aged herbal decoctions."
            align="asymmetric"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {colors.map((c) => (
              <div
                key={c.hex}
                className="bg-cream/90 rounded-[4px] border border-forest/15 p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(20,41,28,0.03)] hover:border-forest/35 transition-all duration-300"
              >
                <div
                  className="w-full h-24 rounded-[3px] border border-forest/10 relative p-3 flex flex-col justify-between"
                  style={{ backgroundColor: c.hex }}
                >
                  <span
                    className={`font-mono text-[11px] font-semibold tracking-wider ${
                      c.textDark ? 'text-ink/80' : 'text-cream'
                    }`}
                  >
                    {c.hex}
                  </span>
                  <span
                    className={`text-xs font-medium tracking-wide ${
                      c.textDark ? 'text-ink/70' : 'text-cream/80'
                    }`}
                  >
                    {c.token}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-lg font-medium text-deep-forest">
                    {c.name}
                  </h3>
                  <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                    {c.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BotanicalDivider variant="lotus" tone="sage" className="my-16" />

        {/* SECTION 2: Typography */}
        <section id="typography" className="mb-20">
          <SectionHeading
            eyebrow="Fluid Typography"
            sanskritEyebrow="लिपि विज्ञान"
            title="Expressive Clamp-based Typography"
            subtitle="Scales gracefully across mobile (360px) to ultra-wide desktop (1440px+). Headings employ Fraunces with variable optical sizing, evoking timeless apothecary manuals and palm-leaf manuscripts."
            align="left"
          />

          <div className="bg-cream/70 border border-forest/15 rounded-[4px] p-6 sm:p-10 space-y-10 divide-y divide-forest/10">
            {/* Display Hero */}
            <div className="pt-2">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-sage font-medium">
                  Display Hero • clamp(2.75rem, 5.5vw + 1rem, 5.25rem)
                </span>
                <span className="text-xs text-ink/50">Leading: 1.05 • Weight: 500</span>
              </div>
              <h1 className="text-display-hero text-deep-forest">
                The Living Science of Balance
              </h1>
              <p className="font-serif italic text-forest/80 text-xl mt-2">
                &ldquo;आयुः कामयमानेन धर्मार्थसुखसाधनम्। आयुर्वेदोपदेशेषु विधेयः परमादरः॥&rdquo;
              </p>
            </div>

            {/* Display H1 */}
            <div className="pt-8">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-sage font-medium">
                  Display H1 • clamp(2.25rem, 3.8vw + 0.5rem, 3.75rem)
                </span>
                <span className="text-xs text-ink/50">Leading: 1.1 • Weight: 500</span>
              </div>
              <h2 className="text-display-h1 text-deep-forest">
                Precision Pulse Diagnosis & Rasayana
              </h2>
            </div>

            {/* Display H2 */}
            <div className="pt-8">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-sage font-medium">
                  Display H2 • clamp(1.75rem, 2.6vw + 0.4rem, 2.75rem)
                </span>
                <span className="text-xs text-ink/50">Leading: 1.18</span>
              </div>
              <h3 className="text-display-h2 text-deep-forest">
                Authentic 5-Fold Panchakarma Detoxification
              </h3>
            </div>

            {/* Display H3 */}
            <div className="pt-8">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-sage font-medium">
                  Display H3 • clamp(1.35rem, 1.8vw + 0.25rem, 2rem)
                </span>
                <span className="text-xs text-ink/50">Leading: 1.25</span>
              </div>
              <h4 className="text-display-h3 text-deep-forest">
                Constitutional Dietetics & Circadian Ritucharya
              </h4>
            </div>

            {/* Body Scales */}
            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-sage font-medium block mb-2">
                  Body Large • clamp(1.0625rem, 1.25rem)
                </span>
                <p className="text-body-lg text-ink/80 leading-relaxed">
                  In classical Ayurveda, disease is not seen as an alien invader but as a disruption of innate biological rhythms. By assessing the three bodily bio-regulators—Vata, Pitta, and Kapha—we formulate therapeutics that awaken your cellular intelligence.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-sage font-medium block mb-2">
                  Body Base & Eyebrow • 1rem / 0.75rem
                </span>
                <div className="text-eyebrow text-forest mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-turmeric" />
                  <span>Clinical Indication Matrix</span>
                </div>
                <p className="text-body-base text-ink/75 leading-relaxed">
                  Every formulation prescribed at Aarogyam is prepared using cold-pressed medicinal oils and triple-tested decoctions. We adhere strictly to the Pharmacopoeial Standards of India and Charaka Samhita guidelines.
                </p>
              </div>
            </div>
          </div>
        </section>

        <BotanicalDivider variant="leaf" tone="sage" className="my-16" />

        {/* SECTION 3: Buttons & Interactive Elements */}
        <section id="buttons" className="mb-20">
          <SectionHeading
            eyebrow="Interactive Elements"
            sanskritEyebrow="क्रिया विधि"
            title="Buttons & Animated Underlines"
            subtitle="No hyperactive micro-bounces or neon glows. Interactions provide tranquil tactile reassurance with deliberate cubic-bezier easing."
            align="asymmetric"
          />

          <div className="bg-cream/70 border border-forest/15 rounded-[4px] p-6 sm:p-8 space-y-8">
            {/* Primary & Secondary Row */}
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-sage mb-4">
                Button Hierarchy (Primary, Secondary, Turmeric, Ghost)
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="md" showArrow>
                  Book Consultation
                </Button>
                <Button variant="secondary" size="md" icon={<Calendar className="w-4 h-4 text-forest" />}>
                  View Clinic Schedule
                </Button>
                <Button variant="turmeric" size="md">
                  Take Dosha Assessment
                </Button>
                <Button variant="ghost" size="md" icon={<Compass className="w-4 h-4" />}>
                  Explore Apothecary
                </Button>
              </div>
            </div>

            {/* Sizing Scale */}
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-sage mb-4">
                Size Variants (Small, Medium, Large)
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">
                  Small CTA
                </Button>
                <Button variant="primary" size="md">
                  Standard Medium
                </Button>
                <Button variant="primary" size="lg" showArrow>
                  Expansive Large Action
                </Button>
              </div>
            </div>

            {/* Loading & States */}
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-sage mb-4">
                States (Loading, Disabled, Text Link with Animated Underline)
              </h4>
              <div className="flex flex-wrap items-center gap-6">
                <Button variant="primary" size="md" isLoading>
                  Verifying Pulse Records
                </Button>
                <Button variant="secondary" size="md" disabled>
                  Fully Booked Today
                </Button>
                <div className="flex items-center gap-6">
                  <Button variant="text-link" size="md" href="/treatments">
                    Read classical Panchakarma monograph
                  </Button>
                  <Button variant="text-link" size="md" href="/doctors">
                    Meet Senior Vaidya Dr. Bohra
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <BotanicalDivider variant="minimal" tone="forest" className="my-16" />

        {/* SECTION 4: Badges & Tags */}
        <section id="badges" className="mb-20">
          <SectionHeading
            eyebrow="Taxonomy & Metadata"
            sanskritEyebrow="लक्षण पट्टिका"
            title="Badges, Dosha Tags & Clinical Markers"
            subtitle="Gentle organic markers for constitutional categorization, certification, and clinical status without shouting."
            align="left"
          />

          <div className="bg-cream/70 border border-forest/15 rounded-[4px] p-6 sm:p-8 space-y-6">
            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-sage mb-3">
                Constitutional & Dosha Tags
              </h4>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="sage" dot>
                  Vata Pacifying (वात शामक)
                </Badge>
                <Badge variant="turmeric" dot>
                  Pitta Cooling (पित्त शामक)
                </Badge>
                <Badge variant="clay" dot>
                  Kapha Mobilizing (कफ नाशक)
                </Badge>
                <Badge variant="forest" dot>
                  Tridoshic Harmony (त्रिदोष समत्व)
                </Badge>
                <Badge variant="paper">
                  NABH Accredited Facility
                </Badge>
                <Badge variant="cream">
                  AYUSH Certified Pharmacy
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-mono tracking-wider text-sage mb-3">
                Therapy Categories & Timing
              </h4>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="forest" size="sm">
                  14-Day Inpatient
                </Badge>
                <Badge variant="sage" size="sm">
                  Cold-Pressed Sesame Base
                </Badge>
                <Badge variant="turmeric" size="sm">
                  Medicated Ghee (Ghrita)
                </Badge>
                <Badge variant="clay" size="sm">
                  Marma Stimulation
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <BotanicalDivider variant="lotus" tone="turmeric" className="my-16" />

        {/* SECTION 5: Form Fields & Clinical Data Entry */}
        <section id="forms" className="mb-20">
          <SectionHeading
            eyebrow="Clinical Form Controls"
            sanskritEyebrow="प्रपत्र घटक"
            title="Clean, Reassuring Form Elements"
            subtitle="Designed for patient intake, appointment scheduling, and pulse diagnosis notes. High legibility, crisp 1px borders, and zero blur gimmickry."
            align="asymmetric"
          />

          <div className="bg-cream/70 border border-forest/15 rounded-[4px] p-6 sm:p-10">
            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <Input
                label="Patient Full Name"
                sanskritLabel="रोगी नाम"
                placeholder="e.g. Meera Singhania"
                icon={<User className="w-4 h-4" />}
                helperText="As printed on government health ID or Aadhaar"
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="meera@example.com"
                icon={<Mail className="w-4 h-4" />}
                helperText="For consultation summary and prescription delivery"
              />

              {/* Phone */}
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98290 12345"
                icon={<Phone className="w-4 h-4" />}
                helperText="WhatsApp confirmation will be sent here"
              />

              {/* Dosha / Category Select */}
              <Select
                label="Primary Health Focus / Constitution"
                placeholder="Select constitutional focus"
                options={doshaOptions}
                helperText="If unknown, select 'Tridoshic' or book pulse diagnosis"
              />

              {/* Error State Demonstration */}
              <div className="md:col-span-2">
                <Input
                  label="Preferred Date of Arrival"
                  type="date"
                  error="Selected date falls on a clinic purification day (Ekadashi). Please select another date."
                />
              </div>

              {/* Symptoms / Notes Textarea */}
              <div className="md:col-span-2">
                <Textarea
                  label="Chief Health Concerns & Digestion (Agni) Notes"
                  sanskritLabel="लक्षण एवं अग्नि विवरण"
                  placeholder="Please describe symptoms, sleep pattern, digestion quality, and any existing allopathic medications..."
                  rows={4}
                  helperText="All health disclosures are protected under strict Vaidya-patient medical confidentiality."
                />
              </div>

              {/* Action row */}
              <div className="md:col-span-2 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-forest">
                  <ShieldCheck className="w-4 h-4 text-sage" />
                  <span>256-bit Encrypted Health Record • AYUSH Compliant</span>
                </div>
                <Button variant="primary" size="md" showArrow>
                  Submit Health Summary
                </Button>
              </div>
            </form>
          </div>
        </section>

        <BotanicalDivider variant="leaf" tone="forest" className="my-16" />

        {/* SECTION 6: Arch Image Masks & Classical Visual Shapes */}
        <section id="arch-images" className="mb-20">
          <SectionHeading
            eyebrow="Architectural Shapes"
            sanskritEyebrow="तोरण रूप"
            title="Arch-Shaped Image Masks & Asymmetry"
            subtitle="Classical Indian temple and haveli arches (Torana) combined with crisp clinical framing. Replaces generic rounded-2xl cards with organic, grounded silhouettes."
            align="asymmetric"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Top Arch Portrait */}
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-sage block mb-2 font-medium">
                Style: Top Arch (rounded-t-[140px])
              </span>
              <ArchImage
                src="/images/treatments/shirodhara.jpg"
                alt="Shirodhara classical therapy session"
                aspectRatio="portrait"
                archStyle="top-arch"
                caption="Shirodhara with Brahmi Thailam"
                sanskritCaption="शिरोधारा विधान"
              />
            </div>

            {/* Full Arch */}
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-sage block mb-2 font-medium">
                Style: Full Arch (rounded-t-full)
              </span>
              <ArchImage
                src="/images/treatments/abhyanga.jpg"
                alt="Abhyanga therapeutic herbal oil massage"
                aspectRatio="portrait"
                archStyle="full-arch"
                caption="Synchronized Abhyanga Massage"
                sanskritCaption="अभ्यङ्ग एवं स्वेदन"
              />
            </div>

            {/* Organic Asymmetrical Arch */}
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-sage block mb-2 font-medium">
                Style: Organic Asymmetric Mask
              </span>
              <ArchImage
                src="/images/treatments/herbs.jpg"
                alt="Classical raw Ayurvedic herbs and mortar"
                aspectRatio="portrait"
                archStyle="organic"
                caption="Sun-Dried Herbal Apothecary"
                sanskritCaption="औषध शाला"
              />
            </div>
          </div>
        </section>

        <BotanicalDivider variant="lotus" tone="sage" className="my-16" />

        {/* SECTION 7: Motion & Easing Specification */}
        <section id="motion" className="mb-20">
          <SectionHeading
            eyebrow="Motion Language"
            sanskritEyebrow="गति तत्व"
            title="Serene Deceleration & Restraint"
            subtitle="Detailed in MOTION.md. Every motion honors the calm cadence of healing: cubic-bezier(0.22, 1, 0.36, 1), 600ms–1200ms durations, and zero bounce."
            align="left"
          />

          <div className="bg-cream/70 border border-forest/15 rounded-[4px] p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forest/10">
              <div>
                <h4 className="font-display text-lg text-deep-forest">
                  Live Interactive Easing Benchmark
                </h4>
                <p className="text-xs text-ink/70 mt-1">
                  Click the button below to observe the restorative glide of our primary calm deceleration curve.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setMotionTrigger((prev) => prev + 1)}
              >
                Trigger Motion Glide
              </Button>
            </div>

            {/* Visualizer Tracks */}
            <div className="space-y-6">
              {/* Calm Curve */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-deep-forest">
                    Aarogyam Calm Easing: cubic-bezier(0.22, 1, 0.36, 1) • 900ms
                  </span>
                  <span className="font-mono text-sage">Restorative • Recommended</span>
                </div>
                <div className="h-4 bg-paper rounded-full border border-forest/15 relative overflow-hidden">
                  <div
                    key={`calm-${motionTrigger}`}
                    className="h-full w-24 bg-forest rounded-full transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: motionTrigger % 2 === 0 ? 'translateX(0%)' : 'translateX(350%)' }}
                  />
                </div>
              </div>

              {/* Standard Linear/Ease */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-ink/60">
                    Standard CSS Ease (Abrupt Stop)
                  </span>
                  <span className="font-mono text-ink/40">Generic Digital</span>
                </div>
                <div className="h-4 bg-paper rounded-full border border-forest/15 relative overflow-hidden">
                  <div
                    key={`ease-${motionTrigger}`}
                    className="h-full w-24 bg-ink/30 rounded-full transition-all duration-[900ms] ease-in-out"
                    style={{ transform: motionTrigger % 2 === 0 ? 'translateX(0%)' : 'translateX(350%)' }}
                  />
                </div>
              </div>
            </div>

            {/* Principles summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-forest/10 text-xs">
              <div className="p-3 bg-paper rounded border border-forest/10">
                <span className="font-semibold text-deep-forest block mb-1">Text Line Reveals</span>
                <p className="text-ink/70">Headings reveal upward line-by-line masked in overflow-hidden containers.</p>
              </div>
              <div className="p-3 bg-paper rounded border border-forest/10">
                <span className="font-semibold text-deep-forest block mb-1">No Jitter or Bouncing</span>
                <p className="text-ink/70">Zero oscillatory spring overshoots. Motion comes to a serene resting stop.</p>
              </div>
              <div className="p-3 bg-paper rounded border border-forest/10">
                <span className="font-semibold text-deep-forest block mb-1">Reduced Motion Native</span>
                <p className="text-ink/70">Automatically disables spatial translation for users preferring reduced motion.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note in Design System */}
        <div className="text-center py-12 border-t border-forest/15 text-xs text-ink/60">
          <p className="font-serif italic text-forest text-sm mb-1">
            &ldquo;शान्तं प्रशान्तं निर्दोषम्&rdquo; — Serene, thoroughly peaceful, and devoid of flaw.
          </p>
          <p>Aarogyam Ayurveda Design System • End of Specification</p>
        </div>
      </Container>
    </div>
  );
}

