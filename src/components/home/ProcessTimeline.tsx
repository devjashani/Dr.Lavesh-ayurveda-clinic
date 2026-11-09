'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Stethoscope, Activity, FileSpreadsheet, RefreshCw, Check } from 'lucide-react';
import { Reveal } from '@/components/motion';
import { usePrefersReducedMotion, MOTION_TOKENS } from '@/lib/motion';

interface ProcessStep {
  number: string;
  title: string;
  sanskrit: string;
  duration: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
}

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Initial Vaidya Consultation',
    sanskrit: 'रोगि परीक्षा (Patient Intake)',
    duration: '30–45 Minutes',
    description:
      'We begin with an in-depth conversation exploring your full health history, past allopathic reports, sleep architecture, bowel patterns, and emotional temperament.',
    details: [
      'Review of blood panels & MRI/X-ray scans',
      'Digestive fire (Agni) evaluation',
      'Daily circadian habit audit',
    ],
    icon: <Stethoscope className="w-5 h-5 text-forest" />,
  },
  {
    number: '02',
    title: 'Nadi Pariksha (Pulse Reading)',
    sanskrit: 'नाडी परीक्षा (Radial Pulse Diagnosis)',
    duration: 'Morning Recommended',
    description:
      'Dr. Bohra places three fingers on your radial artery to listen to the subtle vibrational frequencies of Vata, Pitta, and Kapha across seven deep tissue layers (Saptadhatus).',
    details: [
      'Detects latent inflammation before symptoms manifest',
      'Pinpoints organ stress & channel blockage (Srotorodha)',
      'Evaluates cellular endotoxin (Ama) accumulation',
    ],
    icon: <Activity className="w-5 h-5 text-forest" />,
  },
  {
    number: '03',
    title: 'Personalized Chikitsa & Diet Plan',
    sanskrit: 'चिकित्सा एवं पथ्यापथ्य योजना',
    duration: 'Same-day Prescription',
    description:
      'You receive an exact medical blueprint: personalized Panchakarma schedule, custom herbal decoctions (Kashayams), and a strict list of compatible foods (Pathya) vs foods to eliminate (Apathya).',
    details: [
      'Prescriptions for lab-tested herbal formulations',
      'Customized oil blends prepared in our apothecary',
      'Seasonal dietary & lifestyle rhythm schedule',
    ],
    icon: <FileSpreadsheet className="w-5 h-5 text-forest" />,
  },
  {
    number: '04',
    title: 'Monitored Follow-up & Rasayana',
    sanskrit: 'पुनरावलोकन एवं रसायन',
    duration: 'Ongoing Care',
    description:
      'Healing in Ayurveda is a monitored transition. As your symptoms abate, we transition you to Rasayana (longevity & cellular rejuvenation) so remission is permanent and drug-free.',
    details: [
      'Bi-weekly pulse checks to track Dosha normalization',
      'Gradual tapering of therapeutic herbs',
      'Long-term immunity and metabolic stabilization',
    ],
    icon: <RefreshCw className="w-5 h-5 text-forest" />,
  },
];

/**
 * Animated Node Indicator that turns turmeric when the drawing line reaches it
 */
function StepTimelineNode({
  stepNumber,
  threshold,
  scrollYProgress,
}: {
  stepNumber: string;
  threshold: number;
  scrollYProgress: MotionValue<number>;
}) {
  const [isReached, setIsReached] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setIsReached(true);
      return;
    }
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsReached(latest >= threshold);
    });
    return () => unsubscribe();
  }, [scrollYProgress, threshold, prefersReduced]);

  return (
    <motion.div
      animate={
        isReached
          ? {
              backgroundColor: '#D99A2B',
              borderColor: '#D99A2B',
              color: '#14291C',
              scale: [1, 1.2, 1],
              boxShadow: '0 0 16px rgba(217, 154, 43, 0.65)',
            }
          : {
              backgroundColor: '#F6F1E7',
              borderColor: '#1F3D2B',
              color: '#14291C',
              scale: 1,
              boxShadow: '0 2px 6px rgba(20, 41, 28, 0.08)',
            }
      }
      transition={{ duration: 0.35, ease: MOTION_TOKENS.ease }}
      className="absolute left-6 sm:left-1/2 top-1.5 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold z-10 select-none"
    >
      {isReached ? (
        <span className="flex items-center justify-center font-bold">
          {stepNumber}
        </span>
      ) : (
        <span>{stepNumber}</span>
      )}
    </motion.div>
  );
}

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Track scroll progress for the vertical drawing line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 60%', 'end 80%'],
  });

  const lineHeight = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ['100%', '100%'] : ['0%', '100%']
  );

  // Thresholds where the vertical line reaches each node
  const nodeThresholds = [0.08, 0.36, 0.68, 0.95];

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-28 bg-cream/70 border-b border-forest/15 relative overflow-hidden"
    >
      <Container size="default">
        <Reveal delay={0} direction="up">
          <SectionHeading
            eyebrow="Clinical Protocol"
            sanskritEyebrow="चिकित्सा क्रम"
            title="The Four Stages of Ayurvedic Restoration"
            subtitle="Our systematic methodology bridges classical 8-fold diagnostics (Ashtavidha Pariksha) with continuous clinical monitoring to ensure lasting reversal."
            align="asymmetric"
          />
        </Reveal>

        <div className="relative max-w-4xl mx-auto mt-16">
          {/* Vertical Track Background Line */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-[2px] bg-forest/15 -translate-x-1/2" />

          {/* Vertical Dynamic Drawing Line in Turmeric */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-6 sm:left-1/2 top-4 w-[2px] bg-turmeric -translate-x-1/2 origin-top shadow-[0_0_8px_rgba(217,154,43,0.5)] z-0"
          />

          {/* Steps */}
          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const threshold = nodeThresholds[idx] ?? idx * 0.3;

              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-8 sm:gap-14`}
                >
                  {/* Center Node Indicator with Dynamic Turmeric Fill on Scroll */}
                  <StepTimelineNode
                    stepNumber={step.number}
                    threshold={threshold}
                    scrollYProgress={scrollYProgress}
                  />

                  {/* Content Box (takes half width on desktop) */}
                  <div
                    className={`ml-14 sm:ml-0 sm:w-1/2 ${
                      isEven ? 'sm:text-right' : 'sm:text-left'
                    }`}
                  >
                    <Reveal delay={idx * 0.08} direction={isEven ? 'right' : 'left'} blur={true}>
                      <div className="p-6 rounded-[4px] bg-paper border border-forest/15 shadow-xs space-y-3 hover:border-forest/35 transition-colors">
                        <div
                          className={`flex items-center gap-2 text-xs ${
                            isEven ? 'sm:justify-end' : 'sm:justify-start'
                          }`}
                        >
                          <Badge variant="sage" size="sm">
                            {step.duration}
                          </Badge>
                          <span className="font-serif italic text-forest/70 text-xs">
                            {step.sanskrit}
                          </span>
                        </div>

                        <h3 className="font-display text-xl sm:text-2xl font-normal text-deep-forest">
                          {step.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
                          {step.description}
                        </p>

                        <ul
                          className={`text-xs space-y-1 text-forest/90 pt-2 border-t border-forest/10 ${
                            isEven ? 'sm:text-right' : 'sm:text-left'
                          }`}
                        >
                          {step.details.map((d, dIdx) => (
                            <li key={dIdx}>• {d}</li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  </div>

                  {/* Empty half for spacing balance */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
