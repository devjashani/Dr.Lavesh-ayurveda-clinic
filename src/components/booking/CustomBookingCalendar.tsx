'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';

interface CustomBookingCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  minDate?: string;
  maxDaysAhead?: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CustomBookingCalendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDaysAhead = 60,
}: CustomBookingCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialDate = selectedDate ? new Date(selectedDate) : today;
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  // Shift Monday to index 0 (0 = Mon, 6 = Sun)
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  // Maximum allowed selectable date
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDaysAhead);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const isPrevDisabled =
    currentYear < today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonth <= today.getMonth());

  return (
    <div className="bg-paper border border-forest/15 rounded-[4px] p-5 sm:p-6 shadow-xs select-none">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-forest/10">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-forest" />
          <h3 className="font-display text-base sm:text-lg text-deep-forest font-medium">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            aria-label="Previous Month"
            className="p-1.5 rounded-[3px] border border-forest/10 text-deep-forest hover:bg-cream disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="p-1.5 rounded-[3px] border border-forest/10 text-deep-forest hover:bg-cream transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {WEEKDAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={`font-mono text-[11px] uppercase tracking-wider py-1 font-medium ${
              i === 6 ? 'text-clay/80' : 'text-forest/70'
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Empty padding slots before first day */}
        {Array.from({ length: startingDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {Array.from({ length: totalDays }).map((_, idx) => {
          const dayNum = idx + 1;
          const thisDate = new Date(currentYear, currentMonth, dayNum);
          thisDate.setHours(0, 0, 0, 0);

          const isoString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isSelected = selectedDate === isoString;
          const isToday = thisDate.getTime() === today.getTime();
          const isPast = thisDate.getTime() < today.getTime();
          const isFutureBeyondLimit = thisDate.getTime() > maxDate.getTime();
          const isSunday = thisDate.getDay() === 0;

          // Sundays require prior residential admission / emergency reservation
          const isDisabled = isPast || isFutureBeyondLimit || isSunday;

          return (
            <button
              key={isoString}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(isoString)}
              className={`relative aspect-square rounded-[3px] flex flex-col items-center justify-center text-xs sm:text-sm font-body transition-all cursor-pointer ${
                isSelected
                  ? 'bg-forest text-paper font-medium shadow-xs scale-102 ring-2 ring-forest/30'
                  : isDisabled
                  ? isSunday
                    ? 'bg-clay/5 text-clay/40 cursor-not-allowed border border-clay/10'
                    : 'text-ink/25 cursor-not-allowed bg-cream/40'
                  : 'text-deep-forest hover:bg-cream border border-forest/10 hover:border-forest/30'
              }`}
            >
              <span>{dayNum}</span>

              {/* Sunday note dot */}
              {isSunday && !isPast && (
                <span className="text-[8px] font-mono text-clay/70 scale-90 leading-none">
                  By Appt
                </span>
              )}

              {/* Today indicator dot */}
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-turmeric absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Legend & Sunday Rule Note */}
      <div className="mt-5 pt-3 border-t border-forest/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-ink/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-forest" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-turmeric" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-clay/20 border border-clay/30" />
            <span>Sunday (By Appt Only)</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-ink/60">
          <AlertCircle className="w-3 h-3 text-clay shrink-0" />
          <span>Sundays reserved for residential Panchakarma.</span>
        </div>
      </div>
    </div>
  );
}

