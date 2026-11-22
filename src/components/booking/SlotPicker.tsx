'use client';

import React from 'react';
import { Clock, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { DaySlotResponse } from '@/app/api/slots/route';

interface SlotPickerProps {
  slots: DaySlotResponse[];
  selectedSlot: string; // e.g. "10:00"
  onSelectSlot: (slotStart: string) => void;
  isLoading?: boolean;
  t?: {
    morningSlots?: string;
    eveningSlots?: string;
    noSlotsForDay?: string;
  };
}

export function SlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading = false,
  t,
}: SlotPickerProps) {
  const morningLabel = t?.morningSlots || 'Morning Slots';
  const eveningLabel = t?.eveningSlots || 'Evening Slots';
  const emptyLabel = t?.noSlotsForDay || 'No slots available on this day; try another date.';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-paper border border-forest/15 rounded-[4px] p-5 shadow-xs">
          <div className="h-4 w-36 bg-forest/10 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-forest/5 rounded-[3px] border border-forest/10 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="bg-paper border border-forest/15 rounded-[4px] p-8 text-center shadow-xs">
        <Clock className="w-8 h-8 text-forest/40 mx-auto mb-2" />
        <p className="font-body text-sm text-ink/70">{emptyLabel}</p>
      </div>
    );
  }

  const morningSlots = slots.filter((s) => s.period === 'morning');
  const eveningSlots = slots.filter((s) => s.period === 'evening');

  const renderSlotButton = (slot: DaySlotResponse) => {
    const isSelected = selectedSlot === slot.start;
    const isAvailable = slot.status === 'available';
    const isHeldOrBooked = slot.status === 'booked' || slot.status === 'held';
    const isPastOrTooSoon = slot.status === 'past' || slot.status === 'too_soon';
    const isDisabled = !isAvailable;

    return (
      <button
        key={slot.start}
        type="button"
        disabled={isDisabled}
        onClick={() => onSelectSlot(slot.start)}
        aria-label={`${slot.label} - ${slot.status}`}
        className={`min-h-[48px] p-3 rounded-[3px] border text-left transition-all relative flex items-center justify-between ${
          isSelected
            ? 'bg-forest text-paper border-forest font-medium shadow-xs ring-2 ring-forest/30 cursor-pointer'
            : isHeldOrBooked
            ? 'bg-cream/40 border-forest/10 text-ink/35 cursor-not-allowed opacity-60'
            : isPastOrTooSoon
            ? 'bg-neutral-100/70 border-forest/5 text-ink/30 cursor-not-allowed line-through opacity-45'
            : 'bg-paper text-deep-forest border-forest/15 hover:border-forest/40 hover:bg-cream/60 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock
            className={`w-3.5 h-3.5 shrink-0 ${
              isSelected ? 'text-turmeric' : isDisabled ? 'text-ink/20' : 'text-forest'
            }`}
          />
          <span className="font-mono text-xs sm:text-sm font-medium">{slot.start}</span>
        </div>

        {isSelected ? (
          <CheckCircle2 className="w-4 h-4 text-turmeric shrink-0" />
        ) : isHeldOrBooked ? (
          <span className="text-[10px] font-mono text-clay/70 bg-clay/10 px-1.5 py-0.5 rounded uppercase font-semibold">
            {slot.status === 'held' ? 'Held' : 'Booked'}
          </span>
        ) : isPastOrTooSoon ? (
          <span className="text-[9px] font-mono text-ink/40 bg-ink/5 px-1 py-0.5 rounded uppercase">
            Past
          </span>
        ) : (
          <span className="text-[10px] font-mono text-forest/60">
            Open
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* Morning Slots */}
      {morningSlots.length > 0 && (
        <div className="bg-paper border border-forest/15 rounded-[4px] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-forest/10">
            <div className="flex items-center gap-2 text-forest">
              <Sun className="w-4 h-4 text-turmeric" />
              <h4 className="font-display text-sm font-medium text-deep-forest">
                {morningLabel}
              </h4>
            </div>
            <span className="font-mono text-[11px] text-ink/60">
              10:00 AM – 01:00 PM
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {morningSlots.map(renderSlotButton)}
          </div>
        </div>
      )}

      {/* Evening Slots */}
      {eveningSlots.length > 0 && (
        <div className="bg-paper border border-forest/15 rounded-[4px] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-forest/10">
            <div className="flex items-center gap-2 text-forest">
              <Moon className="w-4 h-4 text-sage" />
              <h4 className="font-display text-sm font-medium text-deep-forest">
                {eveningLabel}
              </h4>
            </div>
            <span className="font-mono text-[11px] text-ink/60">
              05:00 PM – 07:00 PM
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {eveningSlots.map(renderSlotButton)}
          </div>
        </div>
      )}
    </div>
  );
}
