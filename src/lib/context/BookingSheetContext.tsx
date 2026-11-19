'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface BookingSheetContextType {
  isOpen: boolean;
  openBookingSheet: () => void;
  closeBookingSheet: () => void;
  toggleBookingSheet: () => void;
}

const BookingSheetContext = createContext<BookingSheetContextType | undefined>(undefined);

export function BookingSheetProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const openBookingSheet = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeBookingSheet = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleBookingSheet = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close sheet on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Global custom event listener & mobile link interception
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-booking-sheet', handleCustomOpen);

    // Intercept clicks on links / buttons pointing to /book on mobile screens (< 768px)
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't intercept if already on the /book page or on desktop screens
      if (window.innerWidth >= 768 || window.location.pathname === '/book') return;

      const target = (e.target as HTMLElement).closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href');
      const isBookingTrigger =
        target.getAttribute('data-booking-trigger') === 'true' ||
        href === '/book' ||
        href?.startsWith('/book?');

      if (isBookingTrigger) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener('open-booking-sheet', handleCustomOpen);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return (
    <BookingSheetContext.Provider
      value={{
        isOpen,
        openBookingSheet,
        closeBookingSheet,
        toggleBookingSheet,
      }}
    >
      {children}
    </BookingSheetContext.Provider>
  );
}

export function useBookingSheet() {
  const context = useContext(BookingSheetContext);
  if (!context) {
    return {
      isOpen: false,
      openBookingSheet: () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('open-booking-sheet'));
        }
      },
      closeBookingSheet: () => {},
      toggleBookingSheet: () => {},
    };
  }
  return context;
}
