'use client';

import React from 'react';

const items = [
  'Authentic Panchakarma',
  'Nadi Pariksha (Pulse Diagnosis)',
  'Pure Herbal Formulations',
  'Personalized Diet Plans',
  'Charaka Samhita Protocols',
  'AYUSH Registered Clinic',
  'Zero Chemical Suppressants',
];

export function TrustMarquee() {
  return (
    <section
      aria-label="Clinical Highlights"
      className="py-4 bg-cream border-y border-forest/15 overflow-hidden select-none"
    >
      <div className="flex w-max items-center animate-[marquee_38s_linear_infinite] hover:[animation-play-state:paused]">
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center mx-5 sm:mx-8">
            <span className="font-display text-sm sm:text-base font-normal tracking-wide text-deep-forest whitespace-nowrap">
              {text}
            </span>
            {/* Small leaf glyph separator */}
            <svg
              className="w-3.5 h-3.5 ml-8 text-turmeric fill-turmeric/30 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C12 2 5 7 5 13C5 17.5 8.5 21 12 21C15.5 21 19 17.5 19 13C19 7 12 2 12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 6V18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}

