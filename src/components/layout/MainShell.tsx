'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Applies top navbar clearance padding only on public pages where the fixed Navbar renders.
 * Full-bleed workspaces (/consult, /admin) hide the Navbar and occupy the exact viewport without top whitespace.
 */
export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullBleedRoute =
    pathname?.startsWith('/consult') || pathname?.startsWith('/admin');

  return (
    <main
      className={cn(
        'flex-1 flex flex-col lang-crossfade',
        !isFullBleedRoute && 'pt-14 sm:pt-20'
      )}
    >
      {children}
    </main>
  );
}
