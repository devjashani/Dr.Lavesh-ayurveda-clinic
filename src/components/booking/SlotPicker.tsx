'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Sun, Moon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getBookedSlots } from '@/lib/services/appointments';

interface SlotPickerProps {
  selectedDate: string;
  selectedDoctorId: string;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

const MORNING_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '12:00 PM',
  '12:45 PM',
];

const EVENING_SLOTS = [
  '04:30 PM',
  '05:15 PM',
  '06:00 PM',
  '06:45 PM',
  '07:15 PM',
];

export function SlotPicker({
  selectedDate,
  selectedDoctorId,
  selectedSlot,
  onSelectSlot,
}: SlotPickerProps) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCurrent = true;
    async function fetchBookings() {
      if (!selectedDate || !selectedDoctorId) return;
      setLoading(true);
      try {
        const booked = await getBookedSlots(selectedDate, selectedDoctorId);
        if (isCurrent) {
          setBookedSlots(booked);
          // If current selectedSlot is already booked on this date, clear selection
          if (booked.includes(selectedSlot)) {
            onSelectSlot('');
          }
        }
      } catch (err) {
        console.error('Error fetching booked slots:', err);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    fetchBookings();
    return () => {
      isCurrent = false;
    };
  }, [selectedDate, selectedDoctorId]);

  const renderSlotButton = (time: string) => {
    const isBooked = bookedSlots.includes(time);
    const isSelected = selectedSlot === time;

    return (
      <button
        key={time}
        type="button"
        disabled={isBooked}
        onClick={() => onSelectSlot(time)}
        className={`p-3 rounded-[3px] border text-left transition-all relative flex items-center justify-between cursor-pointer ${
          isSelected
            ? 'bg-forest text-paper border-forest font-medium shadow-xs ring-2 ring-forest/30'
            : isBooked
            ? 'bg-cream/40 border-forest/10 text-ink/30 cursor-not-allowed'
            : 'bg-paper text-deep-forest border-forest/15 hover:border-forest/40 hover:bg-cream/60'
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-turmeric' : isBooked ? 'text-ink/20' : 'text-forest'}`} />
          <span className="font-mono text-xs sm:text-sm font-medium">{time}</span>
        </div>

        {isBooked ? (
          <span className="text-[10px] font-mono text-clay/70 bg-clay/10 px-1.5 py-0.5 rounded uppercase font-semibold">
            Booked
          </span>
        ) : isSelected ? (
          <CheckCircle2 className="w-4 h-4 text-turmeric" />
        ) : (
          <span className="text-[10px] font-mono text-forest/60">
            Available
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Morning Slots */}
      <div className="bg-paper border border-forest/15 rounded-[4px] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-forest/10">
          <div className="flex items-center gap-2 text-forest">
            <Sun className="w-4 h-4 text-turmeric" />
            <h4 className="font-display text-sm font-medium text-deep-forest">
              Morning Pulse OPD & Sessions
            </h4>
          </div>
          <span className="font-mono text-[11px] text-ink/60">
            09:00 AM – 01:30 PM
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {MORNING_SLOTS.map(renderSlotButton)}
        </div>
      </div>

      {/* Evening Slots */}
      <div className="bg-paper border border-forest/15 rounded-[4px] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-forest/10">
          <div className="flex items-center gap-2 text-forest">
            <Moon className="w-4 h-4 text-sage" />
            <h4 className="font-display text-sm font-medium text-deep-forest">
              Evening Clinical Reviews
            </h4>
          </div>
          <span className="font-mono text-[11px] text-ink/60">
            04:30 PM – 07:30 PM
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {EVENING_SLOTS.map(renderSlotButton)}
        </div>
      </div>

      {/* Live availability note */}
      <div className="flex items-center gap-2 text-xs font-mono text-ink/60 px-1">
        <Clock className="w-3.5 h-3.5 text-turmeric shrink-0" />
        <span>
          Each consultation slot is reserved for 40 to 45 minutes of dedicated diagnostic assessment.
        </span>
      </div>
    </div>
  );
}

