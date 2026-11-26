'use client';

import React, { useState, useEffect } from 'react';
import { Pill, Send, Trash2, Loader2, CheckCircle2, FileText } from 'lucide-react';
import type {
  ConsultationPrescription,
  PrescribedMedicine,
} from '@/lib/prescription/types';

interface DoctorPrescriptionPanelProps {
  bookingId: string;
  medicines: PrescribedMedicine[];
  clinicalAdvice: string;
  onPrescriptionChange: (updated: ConsultationPrescription) => void;
  variant?: 'dark' | 'light';
}

export function DoctorPrescriptionPanel({
  bookingId,
  medicines,
  clinicalAdvice,
  onPrescriptionChange,
  variant = 'dark',
}: DoctorPrescriptionPanelProps) {
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timing, setTiming] = useState('');
  const [duration, setDuration] = useState('');
  const [adviceDraft, setAdviceDraft] = useState(clinicalAdvice || '');
  const [isSending, setIsSending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isSavingAdvice, setIsSavingAdvice] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setAdviceDraft(clinicalAdvice || '');
  }, [clinicalAdvice]);

  const isDark = variant === 'dark';

  const showSuccessFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleAddMedicine = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanedName = medName.trim();
    if (!cleanedName || isSending) return;

    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/call/prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          action: 'add',
          medicine: {
            name: cleanedName,
            dosage: dosage.trim(),
            timing: timing.trim(),
            duration: duration.trim(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Could not send medicine.');
        return;
      }

      onPrescriptionChange(data.prescription);
      setMedName('');
      setDosage('');
      setTiming('');
      setDuration('');
      showSuccessFeedback('Sent live to patient');
    } catch {
      setErrorMsg('Network error sending medicine.');
    } finally {
      setIsSending(false);
    }
  };

  const handleRemoveMedicine = async (medicineId: string) => {
    setRemovingId(medicineId);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/call/prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          action: 'remove',
          medicineId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onPrescriptionChange(data.prescription);
      } else {
        setErrorMsg(data.message || 'Could not remove medicine.');
      }
    } catch {
      setErrorMsg('Network error updating prescription.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleSaveAdvice = async () => {
    setIsSavingAdvice(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/call/prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          action: 'save_all',
          clinicalAdvice: adviceDraft,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onPrescriptionChange(data.prescription);
        showSuccessFeedback('Clinical advice synced');
      } else {
        setErrorMsg(data.message || 'Could not save clinical advice.');
      }
    } catch {
      setErrorMsg('Network error saving clinical advice.');
    } finally {
      setIsSavingAdvice(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Feedback / Error Status */}
      {errorMsg && (
        <div className="px-2.5 py-1.5 rounded bg-red-500/15 border border-red-400/30 text-[11px] font-mono text-red-300">
          {errorMsg}
        </div>
      )}
      {feedback && (
        <div className="px-2.5 py-1.5 rounded bg-emerald-500/20 border border-emerald-400/35 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Ordered Prescription Feed */}
      <div className="flex-1 min-h-[120px] max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
        {medicines.length === 0 ? (
          <div
            className={`p-3 rounded-lg border text-center space-y-1 ${
              isDark
                ? 'bg-black/40 border-white/10 text-neutral-400'
                : 'bg-cream border-forest/15 text-ink/65'
            }`}
          >
            <Pill className="w-4 h-4 mx-auto opacity-60" />
            <p className="text-[11px] font-mono">
              Type a medicine below to display it live on the patient&apos;s screen.
            </p>
          </div>
        ) : (
          <ol className="space-y-1.5">
            {medicines.map((med, idx) => (
              <li
                key={med.id}
                className={`p-2.5 rounded-lg border flex items-start justify-between gap-2 ${
                  isDark
                    ? 'bg-black/45 border-white/12 text-white'
                    : 'bg-cream border-forest/15 text-deep-forest'
                }`}
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${
                      isDark ? 'text-amber-400' : 'text-forest'
                    }`}
                  >
                    {med.order || idx + 1}.
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-snug break-words">{med.name}</p>
                    {(med.dosage || med.timing || med.duration) && (
                      <p
                        className={`text-[10px] font-mono mt-0.5 ${
                          isDark ? 'text-emerald-300/90' : 'text-forest/80'
                        }`}
                      >
                        {[med.dosage, med.timing, med.duration].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(med.id)}
                  disabled={removingId === med.id}
                  aria-label={`Remove ${med.name}`}
                  className={`p-1 rounded transition-colors shrink-0 cursor-pointer ${
                    isDark
                      ? 'text-neutral-400 hover:text-red-400 hover:bg-white/10'
                      : 'text-ink/50 hover:text-clay hover:bg-clay/10'
                  }`}
                >
                  {removingId === med.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Chat-Box Style Medicine Composer */}
      <form
        onSubmit={handleAddMedicine}
        className={`p-2.5 rounded-lg border space-y-2 ${
          isDark ? 'bg-black/55 border-white/15' : 'bg-paper border-forest/20'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
            placeholder="Write medicine name (e.g. Triphala Churna)"
            className={`flex-1 min-w-0 px-2.5 py-2 rounded text-xs font-body focus:outline-none ${
              isDark
                ? 'bg-neutral-900 border border-white/20 text-white placeholder:text-neutral-400 focus:border-amber-400'
                : 'bg-cream border border-forest/20 text-deep-forest placeholder:text-ink/40 focus:border-forest'
            }`}
          />
          <button
            type="submit"
            disabled={!medName.trim() || isSending}
            aria-label="Send medicine live to patient"
            className={`px-3 py-2 rounded font-mono text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-forest hover:bg-deep-forest text-paper'
            }`}
          >
            {isSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Add</span>
          </button>
        </div>

        {/* Optional Dosage / Timing / Duration Row */}
        <div className="grid grid-cols-3 gap-1.5">
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Dose (1 tsp)"
            className={`px-2 py-1.5 rounded text-[11px] font-mono focus:outline-none ${
              isDark
                ? 'bg-neutral-900/90 border border-white/15 text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400'
                : 'bg-cream border border-forest/15 text-deep-forest placeholder:text-ink/40 focus:border-forest'
            }`}
          />
          <input
            type="text"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            placeholder="Timing (After food)"
            className={`px-2 py-1.5 rounded text-[11px] font-mono focus:outline-none ${
              isDark
                ? 'bg-neutral-900/90 border border-white/15 text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400'
                : 'bg-cream border border-forest/15 text-deep-forest placeholder:text-ink/40 focus:border-forest'
            }`}
          />
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Days (15 days)"
            className={`px-2 py-1.5 rounded text-[11px] font-mono focus:outline-none ${
              isDark
                ? 'bg-neutral-900/90 border border-white/15 text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400'
                : 'bg-cream border border-forest/15 text-deep-forest placeholder:text-ink/40 focus:border-forest'
            }`}
          />
        </div>
      </form>

      {/* Clinical Advice / Pathya Notes */}
      <div className="space-y-1.5 pt-1 border-t border-white/10">
        <div className="flex items-center justify-between">
          <label
            className={`text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1 ${
              isDark ? 'text-neutral-400' : 'text-forest/75'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Diet / Pathya &amp; Clinical Advice</span>
          </label>
          <button
            type="button"
            onClick={handleSaveAdvice}
            disabled={isSavingAdvice}
            className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-amber-300'
                : 'bg-forest/10 hover:bg-forest/20 text-forest font-semibold'
            }`}
          >
            {isSavingAdvice ? 'Saving...' : 'Save Advice'}
          </button>
        </div>
        <textarea
          rows={2}
          value={adviceDraft}
          onChange={(e) => setAdviceDraft(e.target.value)}
          placeholder="Warm water in morning, avoid sour/fermented foods..."
          className={`w-full px-2.5 py-2 rounded text-[11px] font-body focus:outline-none resize-none ${
            isDark
              ? 'bg-black/45 border border-white/15 text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400'
              : 'bg-cream border border-forest/15 text-deep-forest placeholder:text-ink/40 focus:border-forest'
          }`}
        />
      </div>
    </div>
  );
}
