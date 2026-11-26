/**
 * VANKAL AYURVEDA — Video Call Configuration (Agora)
 * 
 * Strict time window and participant constraints:
 * - Patient: can enter room from 10 minutes prior to slot start
 * - Doctor: can enter room from 15 minutes prior to slot start
 * - Both: call window stays active until slot_end + 15 minutes (CALL_GRACE_MINUTES)
 * - Numeric UIDs: Doctor = 1, Patient = 2 (assigned strictly by server, never from client)
 */

import { CLINIC_SCHEDULE } from '@/lib/config/schedule';

export const PATIENT_EARLY_MINUTES = 10;
export const DOCTOR_EARLY_MINUTES = 15;
export const CALL_GRACE_MINUTES = 15;

export const AGORA_UIDS = {
  doctor: 1,
  patient: 2,
} as const;

export type CallRole = 'doctor' | 'patient';

export interface CallWindowInfo {
  slotStartMs: number;
  slotEndMs: number;
  windowStartMs: number;
  windowEndMs: number;
  windowOpensAt: string; // ISO string
  windowClosesAt: string; // ISO string
  isTooEarly: boolean;
  isInWindow: boolean;
  isEnded: boolean;
  secondsRemaining: number;
}

/**
 * Normalizes HH:mm or HH:mm:ss to HH:mm
 */
function normalizeTime(timeStr?: string): string {
  if (!timeStr) return '10:00';
  const parts = timeStr.trim().split(':');
  const h = parts[0].padStart(2, '0');
  const m = (parts[1] || '00').padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Calculates slot end time given start time and duration (default 30 mins)
 */
function addMinutesToTime(timeStr: string, minutes: number): string {
  const [h, m] = normalizeTime(timeStr).split(':').map(Number);
  const totalMins = h * 60 + m + minutes;
  const newH = Math.floor(totalMins / 60) % 24;
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

/**
 * Computes call access window in Asia/Kolkata timezone (UTC+05:30)
 * strictly using server timestamp.
 */
export function calculateCallWindow(
  dateStr: string, // YYYY-MM-DD or ISO string
  slotStart: string, // HH:mm
  slotEnd?: string, // HH:mm (optional, defaults to slotDurationMinutes)
  role: CallRole = 'patient',
  serverNowMs: number = Date.now()
): CallWindowInfo {
  // Normalize date string to YYYY-MM-DD
  const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.trim();
  const cleanStart = normalizeTime(slotStart);
  const cleanEnd = slotEnd
    ? normalizeTime(slotEnd)
    : addMinutesToTime(cleanStart, CLINIC_SCHEDULE.slotDurationMinutes);

  // Parse IST slot boundaries (Asia/Kolkata is UTC+05:30)
  const slotStartIso = `${cleanDate}T${cleanStart}:00+05:30`;
  const slotEndIso = `${cleanDate}T${cleanEnd}:00+05:30`;

  const slotStartMs = new Date(slotStartIso).getTime();
  const slotEndMs = new Date(slotEndIso).getTime();

  const earlyMinutes = role === 'doctor' ? DOCTOR_EARLY_MINUTES : PATIENT_EARLY_MINUTES;
  const windowStartMs = slotStartMs - earlyMinutes * 60 * 1000;
  const windowEndMs = slotEndMs + CALL_GRACE_MINUTES * 60 * 1000;

  const isTooEarly = serverNowMs < windowStartMs;
  const isEnded = serverNowMs > windowEndMs;
  const isInWindow = !isTooEarly && !isEnded;

  const secondsRemaining = isEnded ? 0 : Math.max(0, Math.floor((windowEndMs - serverNowMs) / 1000));

  return {
    slotStartMs,
    slotEndMs,
    windowStartMs,
    windowEndMs,
    windowOpensAt: new Date(windowStartMs).toISOString(),
    windowClosesAt: new Date(windowEndMs).toISOString(),
    isTooEarly,
    isInWindow,
    isEnded,
    secondsRemaining,
  };
}

/**
 * Formats a clean, safe Agora channel name from bookingId.
 * Letters, numbers, and underscores only, max 64 chars.
 */
export function deriveChannelName(bookingId: string): string {
  const cleanId = bookingId.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 48);
  return `vankal_${cleanId}`;
}
