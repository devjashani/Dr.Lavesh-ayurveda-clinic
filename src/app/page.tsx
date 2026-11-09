import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustMarquee } from '@/components/home/TrustMarquee';
import { PhilosophySection } from '@/components/home/PhilosophySection';
import { SignatureTherapies } from '@/components/home/SignatureTherapies';
import { DoshaTeaser } from '@/components/home/DoshaTeaser';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { DoctorSection } from '@/components/home/DoctorSection';
import { ConditionsCloud } from '@/components/home/ConditionsCloud';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { StatsCounter } from '@/components/home/StatsCounter';
import { BlogPreview } from '@/components/home/BlogPreview';
import { FinalCta } from '@/components/home/FinalCta';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO */}
      <HeroSection />

      {/* 2. TRUST STRIP */}
      <TrustMarquee />

      {/* 3. PHILOSOPHY */}
      <PhilosophySection />

      {/* 4. SIGNATURE THERAPIES */}
      <SignatureTherapies />

      {/* 5. DOSHA QUIZ TEASER */}
      <DoshaTeaser />

      {/* 6. PROCESS */}
      <ProcessTimeline />

      {/* 7. DOCTOR */}
      <DoctorSection />

      {/* 8. CONDITIONS */}
      <ConditionsCloud />

      {/* 9. TESTIMONIALS */}
      <TestimonialsCarousel />

      {/* 10. STATS */}
      <StatsCounter />

      {/* 11. BLOG PREVIEW */}
      <BlogPreview />

      {/* 12. FINAL CTA */}
      <FinalCta />
    </div>
  );
}
