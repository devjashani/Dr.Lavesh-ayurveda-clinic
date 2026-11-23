'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, AlertCircle, Loader2, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DoctorLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Invalid email or password.');
        return;
      }

      // Success: redirect to Doctor Console
      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMessage('Network error connecting to login service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#fbf9f4] text-deep-forest flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-paper border border-forest/20 rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand / Title Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-forest" />
          </div>
          <h1 className="font-display text-2xl text-deep-forest font-medium">
            Doctor Console Login
          </h1>
          <p className="font-body text-xs text-ink/70">
            Sign in to access daily video consultation queues and patient clinical summaries.
          </p>
        </div>

        {/* Doctor Persona Info Box */}
        <div className="p-3 bg-forest/5 border border-forest/10 rounded-lg text-xs font-mono text-center text-forest">
          <span className="font-semibold block text-deep-forest">Dr. Lavesh Bohra</span>
          <span>BAMS, SMIAS · Registered Ayurvedic Practitioner</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono text-ink/80 font-medium mb-1.5"
            >
              Doctor Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              placeholder="laveshbohra@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs font-mono py-2.5 px-3.5 bg-sand/30 border border-forest/25 rounded-lg focus:outline-hidden focus:border-forest text-deep-forest"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono text-ink/80 font-medium mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs font-mono py-2.5 px-3.5 bg-sand/30 border border-forest/25 rounded-lg focus:outline-hidden focus:border-forest text-deep-forest"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs rounded-lg flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email.trim() || !password}
            variant="primary"
            className="w-full py-3 bg-forest text-sand hover:bg-deep-forest text-xs font-medium cursor-pointer shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 mr-2 text-turmeric" />
                Sign in to Console
              </>
            )}
          </Button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs font-mono text-forest/70 hover:text-forest underline underline-offset-4"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
