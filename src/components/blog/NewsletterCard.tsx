'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="bg-forest text-paper p-8 sm:p-12 rounded-[4px] border border-deep-forest relative overflow-hidden">
      <div className="max-w-2xl relative z-10">
        <span className="font-mono text-xs text-turmeric uppercase tracking-wider block mb-2 font-medium">
          Monthly Clinical Newsletter · ऋतुचर्या संवाद
        </span>
        <h3 className="font-display text-2xl sm:text-3xl text-paper mb-3">
          The Seasonal Ayurveda Letter
        </h3>
        <p className="font-body text-xs sm:text-sm text-paper/80 leading-relaxed mb-6">
          Every solar transit (Sankranti), Dr. Bohra publishes an in-depth clinical letter on seasonal
          diet adjustments, medicinal decoction recipes, and home remedies. No promotions or spam.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-[3px] bg-paper text-deep-forest flex items-center gap-3 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-forest shrink-0" />
            <span className="font-body text-xs font-medium">
              Dhanyavaad! You are subscribed to our seasonal Ayurvedic letter.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="px-4 py-2.5 rounded-[3px] bg-paper text-deep-forest text-xs font-body focus:outline-none focus:ring-1 focus:ring-turmeric w-full"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[3px] bg-turmeric text-deep-forest text-xs font-body font-medium hover:bg-turmeric/90 transition-colors shrink-0 cursor-pointer"
            >
              Subscribe Free
            </button>
          </form>
        )}

        <div className="flex items-center gap-2 text-[11px] text-paper/60 font-body mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-sage" />
          <span>We respect your medical privacy. Unsubscribe anytime with one click.</span>
        </div>
      </div>
    </div>
  );
}

