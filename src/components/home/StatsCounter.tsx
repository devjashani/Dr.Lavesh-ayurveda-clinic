'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';

interface StatItem {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  sanskrit: string;
  sub: string;
}

const stats: StatItem[] = [
  {
    value: 18500,
    suffix: '+',
    label: 'Patients Restored to Health',
    sanskrit: 'रोगमुक्त जन',
    sub: 'Chronic condition remissions documented since 2002',
  },
  {
    value: 24,
    suffix: '+',
    label: 'Years of Practice',
    sanskrit: 'अनुभव वर्ष',
    sub: 'Unbroken clinical lineage in Jaipur, Rajasthan',
  },
  {
    value: 28,
    suffix: '',
    label: 'Samhita Therapies',
    sanskrit: 'शास्त्रीय चिकित्सा',
    sub: 'Full-spectrum classical Panchakarma protocols',
  },
  {
    value: 4.96,
    suffix: ' / 5',
    decimals: 2,
    label: 'Verified Patient Rating',
    sanskrit: 'संतुष्टि प्रमाण',
    sub: 'From 1,420+ independently audited patient reviews',
  },
];

export function StatsCounter() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 bg-cream border-b border-forest/15 relative"
    >
      <Container size="default">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-forest/15">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col text-center ${idx > 0 ? 'pt-6 sm:pt-0 sm:px-6' : 'sm:pr-6'}`}
            >
              <div className="font-display text-4xl sm:text-5xl font-normal text-deep-forest tracking-tight">
                {hasAnimated
                  ? stat.decimals
                    ? stat.value.toFixed(stat.decimals)
                    : stat.value.toLocaleString('en-IN')
                  : '0'}
                <span className="text-[#9E6517]">{stat.suffix}</span>
              </div>

              <div className="mt-2">
                <span className="text-xs uppercase font-semibold tracking-wider text-forest block">
                  {stat.label}
                </span>
                <span className="font-serif italic text-xs text-forest/85 font-medium block mt-0.5">
                  {stat.sanskrit}
                </span>
                <p className="text-[11px] text-ink/75 mt-1 leading-snug">
                  {stat.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

