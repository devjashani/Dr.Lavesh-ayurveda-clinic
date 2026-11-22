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
