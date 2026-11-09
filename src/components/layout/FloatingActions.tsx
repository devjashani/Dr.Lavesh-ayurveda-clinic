'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Calendar, MessageCircle } from 'lucide-react';

export function FloatingActions() {
  return (
    <>
      {/* Floating WhatsApp Action (Desktop & Mobile) */}
      <aside
        aria-label="Direct Vaidya Consultation via WhatsApp"
        className="fixed bottom-20 sm:bottom-8 right-5 sm:right-8 z-40 flex items-center group"
      >
        {/* Subtle tooltip on hover */}
        <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded bg-deep-forest text-cream text-xs font-medium tracking-wide shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with Vaidya Desk
        </span>

        <a
          href="https://wa.me/911412458890?text=Namaste%20Aarogyam%20Ayurveda%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Vaidya Desk on WhatsApp"
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1F3D2B] text-cream flex items-center justify-center shadow-[0_8px_24px_rgba(20,41,28,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 border border-forest/30"
        >
          {/* Subtle concentric pulse ring */}
          <span
            className="absolute inset-0 rounded-full bg-forest/40 animate-ping pointer-events-none opacity-40"
            style={{ animationDuration: '3.6s' }}
          />

          <MessageCircle className="w-6 h-6 stroke-[1.75]" />
        </a>
      </aside>

      {/* Mobile Sticky Bottom Bar (Visible on mobile screens < 640px) */}
      <nav
        aria-label="Mobile quick actions"
        className="fixed sm:hidden bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-forest/20 px-4 py-2.5 flex items-center gap-3 shadow-[0_-4px_16px_rgba(20,41,28,0.06)]"
      >
        <a
          href="tel:+911412458890"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-[4px] border border-forest/30 text-deep-forest font-medium text-xs bg-cream active:bg-paper transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-forest" />
          <span>Call Clinic</span>
        </a>

        <Link
          href="/book"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-[4px] bg-deep-forest text-cream font-medium text-xs shadow-xs active:bg-forest transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-turmeric" />
          <span>Book Consult</span>
        </Link>
      </nav>
    </>
  );
}

