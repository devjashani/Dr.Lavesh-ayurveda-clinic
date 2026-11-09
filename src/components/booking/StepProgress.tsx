'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, label: 'Service', mobileLabel: 'Service' },
  { step: 2, label: 'Doctor & Mode', mobileLabel: 'Doctor' },
  { step: 3, label: 'Date & Slot', mobileLabel: 'Slot' },
  { step: 4, label: 'Patient Info', mobileLabel: 'Patient' },
  { step: 5, label: 'Review', mobileLabel: 'Review' },
  { step: 6, label: 'Voucher', mobileLabel: 'Voucher' },
];

export function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  return (
    <div className="w-full mb-8 sm:mb-12">
      {/* Mobile Step Header */}
      <div className="flex sm:hidden items-center justify-between mb-3 px-1">
        <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold">
          Step {currentStep} of 6: {STEPS[currentStep - 1]?.label}
        </span>
        <span className="font-mono text-xs text-ink/50">
          {Math.round(((currentStep - 1) / 5) * 100)}% Complete
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-forest/15 -translate-y-1/2 z-0" />

        {/* Active filled line */}
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-turmeric -translate-y-1/2 z-0 transition-all duration-300 ease-out"
          style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
        />

        {/* Steps Nodes */}
        <div className="relative z-10 flex justify-between">
          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const isClickable = isCompleted && onStepClick;

            return (
              <div
                key={s.step}
                className="flex flex-col items-center cursor-default"
                onClick={() => isClickable && onStepClick(s.step)}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
                    isCompleted
                      ? 'bg-forest text-paper cursor-pointer hover:bg-deep-forest'
                      : isCurrent
                      ? 'bg-turmeric text-deep-forest font-bold ring-4 ring-turmeric/20 scale-110 shadow-xs'
                      : 'bg-paper border-2 border-forest/20 text-ink/40'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : s.step}
                </div>

                <span
                  className={`hidden sm:block mt-2 font-mono text-[11px] whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-deep-forest font-semibold'
                      : isCompleted
                      ? 'text-forest font-medium'
                      : 'text-ink/40'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

