import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BotanicalDivider } from '@/components/ui/BotanicalDivider';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 lg:py-32">
      <Container size="narrow" className="text-center">
        {/* Sanskrit Inscription */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-forest/15 text-xs text-forest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-turmeric" />
          <span className="font-serif italic">सर्वे सन्तु निरामयाः (May all be free from illness)</span>
        </div>

        {/* 404 Code with Classical Numerals */}
        <div className="relative mb-2">
          <span className="font-display text-8xl sm:text-9xl font-light text-forest/10 select-none block tracking-widest">
            ४०४
          </span>
          <span className="absolute inset-0 flex items-center justify-center font-display text-4xl sm:text-5xl font-medium text-deep-forest">
            Path in Restoration
          </span>
        </div>

        {/* Description */}
        <p className="text-body-base text-ink/75 max-w-lg mx-auto leading-relaxed mt-4">
          The page or therapy record you are seeking is currently not aligned in our digital apothecary. Allow us to guide you back to equilibrium.
        </p>

        <BotanicalDivider variant="lotus" tone="sage" className="my-8 max-w-xs mx-auto" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <Button href="/" variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
            Return to Sanctuary (Home)
          </Button>
          <Button href="/treatments" variant="secondary" size="md" icon={<Compass className="w-4 h-4" />}>
            Explore Treatments
          </Button>
        </div>

        <div className="mt-12 text-xs text-ink/50">
          Need immediate assistance? Call our clinic care line:{' '}
          <a href="tel:+911412458890" className="text-deep-forest underline hover:text-forest">
            +91 (141) 245-8890
          </a>
        </div>
      </Container>
    </div>
  );
}

