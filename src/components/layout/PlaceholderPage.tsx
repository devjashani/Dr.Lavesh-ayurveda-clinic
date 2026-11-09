import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Sparkles, Calendar, BookOpen, Compass } from 'lucide-react';

export interface PlaceholderPageProps {
  title: string;
  sanskritTitle?: string;
  category?: string;
  description: string;
  badge?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export function PlaceholderPage({
  title,
  sanskritTitle,
  category = 'Sanctuary Directory',
  description,
  badge = 'Blueprint in Preparation',
  breadcrumbs = [{ label: 'Home', href: '/' }],
  children,
}: PlaceholderPageProps) {
  return (
    <div className="py-16 sm:py-24">
      <Container size="narrow">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-ink/60 mb-6 font-mono">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-deep-forest underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-forest font-semibold">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
          <span>/</span>
          <span className="text-forest font-semibold">{title}</span>
        </nav>

        {/* Category & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="sage" dot>
            {category}
          </Badge>
          <Badge variant="cream">
            {badge}
          </Badge>
        </div>

        {/* Header */}
        <h1 className="text-display-h1 text-deep-forest font-normal tracking-tight">
          {title}
        </h1>

        {sanskritTitle && (
          <p className="font-serif italic text-xl text-forest/80 mt-2">
            {sanskritTitle}
          </p>
        )}

        <p className="text-body-lg text-ink/75 mt-4 leading-relaxed">
          {description}
        </p>

        <BotanicalDivider variant="leaf" tone="sage" className="my-8" />

        {/* Content or Children */}
        {children ? (
          <div className="my-6">{children}</div>
        ) : (
          <div className="bg-cream/80 border border-forest/15 rounded-[4px] p-6 sm:p-8 text-sm text-ink/80 space-y-4">
            <div className="flex items-center gap-2 text-forest font-semibold">
              <Sparkles className="w-4 h-4 text-turmeric" />
              <span>Module Architectural Blueprint (Step 1 Foundation)</span>
            </div>
            <p className="leading-relaxed">
              This module route is registered and connected to the Aarogyam global navigation, responsive viewport system, and Lenis smooth scroll engine. Full patient interactions, booking logic, and clinical records are authored in subsequent milestones.
            </p>
          </div>
        )}

        {/* Action navigation */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/" variant="secondary" size="md" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
            Back to Home
          </Button>
          <Button href="/design-system" variant="primary" size="md" icon={<Sparkles className="w-4 h-4 text-turmeric" />}>
            Inspect Design System
          </Button>
          <Button href="/book" variant="turmeric" size="md" icon={<Calendar className="w-4 h-4" />}>
            Book Consultation
          </Button>
        </div>
      </Container>
    </div>
  );
}

