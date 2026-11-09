'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { StatBlock } from '@/components/motion';

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
  return (
    <section className="py-16 sm:py-20 bg-cream border-b border-forest/15 relative">
      <Container size="default">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, idx) => (
            <StatBlock
              key={stat.label}
              value={stat.value}
              decimals={stat.decimals || 0}
              suffix={stat.suffix}
              label={stat.label}
              sanskrit={stat.sanskrit}
              sub={stat.sub}
              delay={idx * 0.15}
              duration={2.2}
              showDivider={idx < stats.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
