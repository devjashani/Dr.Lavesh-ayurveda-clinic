'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pill, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { PrescribedMedicine } from '@/lib/prescription/types';

interface PatientLivePrescriptionOverlayProps {
  medicines: PrescribedMedicine[];
  clinicalAdvice?: string;
}

export function PatientLivePrescriptionOverlay({
  medicines,
  clinicalAdvice,
}: PatientLivePrescriptionOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [justAddedToast, setJustAddedToast] = useState(false);
  const prevCountRef = useRef<number>(medicines.length);

  // Auto-expand and pulse briefly whenever the doctor prescribes a new medicine live
  useEffect(() => {
    if (medicines.length > prevCountRef.current) {
      setIsExpanded(true);
      setJustAddedToast(true);
      const timer = setTimeout(() => setJustAddedToast(false), 3000);
      prevCountRef.current = medicines.length;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = medicines.length;
  }, [medicines.length]);

  return (
    <aside
      aria-label="Live Prescription Medicines"
      className="absolute top-16 left-3 sm:left-5 z-25 w-[248px] sm:w-[300px] max-w-[calc(100vw-24px)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#0a1f14]/88 backdrop-blur-xl border border-amber-400/35 rounded-xl shadow-2xl overflow-hidden text-white transition-all">
        {/* Header Bar (Click to Expand / Collapse) */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 bg-black/35 hover:bg-black/45 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <Pill className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-[11px] font-semibold tracking-wide text-white truncate">
              Rx · Prescribed Medicines
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">
              {medicines.length}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-neutral-300" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-300" />
            )}
          </div>
        </button>

        {/* Live Update Pulse Toast */}
        {justAddedToast && (
          <div className="px-3 py-1.5 bg-emerald-600/90 text-white text-[10px] font-mono flex items-center gap-1.5 border-b border-emerald-400/30">
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span>Dr. Bohra added a medicine</span>
          </div>
        )}

        {/* Ordered Medicine List Body */}
        {isExpanded && (
          <div className="p-3 max-h-[42dvh] overflow-y-auto space-y-2">
            {medicines.length === 0 ? (
              <div className="py-3 px-2 text-center space-y-1">
                <p className="font-mono text-[11px] text-neutral-300">
                  Waiting for doctor&apos;s prescription...
                </p>
                <p className="font-body text-[10px] text-neutral-400 leading-relaxed">
                  Medicines prescribed by Dr. Bohra during the call appear live here.
                </p>
              </div>
            ) : (
              <ol className="space-y-2">
                {medicines.map((med, index) => (
                  <li
                    key={med.id}
                    className="p-2.5 rounded-lg bg-white/8 border border-white/12 space-y-0.5 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-[11px] font-bold text-amber-400 shrink-0 mt-0.5">
                        {med.order || index + 1}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xs sm:text-sm font-medium text-white leading-snug break-words">
                          {med.name}
                        </p>
                        {(med.dosage || med.timing || med.duration) && (
                          <p className="font-mono text-[10px] text-emerald-200/90 mt-0.5 leading-relaxed">
                            {[med.dosage, med.timing, med.duration]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {clinicalAdvice && clinicalAdvice.trim().length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-300/90 block mb-0.5">
                  Doctor Advice
                </span>
                <p className="font-body text-[11px] text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {clinicalAdvice}
                </p>
              </div>
            )}

            {medicines.length > 0 && (
              <p className="text-[10px] font-mono text-neutral-400 pt-1 text-center">
                Downloadable PDF ready when call ends
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
