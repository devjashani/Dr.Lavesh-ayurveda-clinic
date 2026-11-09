/**
 * Aarogyam Ayurveda — Appointments Service Layer
 * 
 * Designed to be Supabase-ready. Currently provides an in-memory & localStorage
 * mock implementation with robust double-booking prevention.
 * 
 * To switch to Supabase in production:
 * 1. Initialize your Supabase client: import { supabase } from '@/lib/supabase'
 * 2. Replace the mock storage operations with supabase.from('appointments').insert(...)
 *    and supabase.from('appointments').select(...)
 */

export interface Appointment {
  id: string;
  tokenNumber: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  doctorId: string;
  doctorName: string;
  mode: 'in-clinic' | 'online';
  date: string; // YYYY-MM-DD
  slot: string; // e.g. "10:30 AM"
  patientName: string;
  whatsappNumber: string;
  email: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  chiefComplaint: string;
  medicalReportFileName?: string;
  knownDosha?: string;
  createdAt: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
}

export type CreateAppointmentInput = Omit<
  Appointment,
  'id' | 'tokenNumber' | 'createdAt' | 'status'
>;

// Initial mock booked slots to demonstrate real-world schedule collisions
const INITIAL_MOCK_BOOKINGS: { dateOffset: number; slot: string; doctorId: string }[] = [
  { dateOffset: 1, slot: '10:30 AM', doctorId: 'dr-lavesh-bohra' },
  { dateOffset: 1, slot: '11:15 AM', doctorId: 'dr-lavesh-bohra' },
  { dateOffset: 1, slot: '05:15 PM', doctorId: 'dr-ananya-sharma' },
  { dateOffset: 2, slot: '09:45 AM', doctorId: 'dr-lavesh-bohra' },
  { dateOffset: 2, slot: '06:00 PM', doctorId: 'mukesh-gurjar' },
];

const STORAGE_KEY = 'aarogyam_appointments_store';

function getDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function getStoredAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial mock bookings
      const seeded: Appointment[] = INITIAL_MOCK_BOOKINGS.map((b, idx) => ({
        id: `apt-mock-${idx}`,
        tokenNumber: `AAR-2026-0${100 + idx}`,
        serviceId: 'nadi-pariksha',
        serviceName: 'Nadi Pariksha & Pulse Consultation',
        serviceCategory: 'Diagnostic',
        doctorId: b.doctorId,
        doctorName: b.doctorId === 'dr-lavesh-bohra' ? 'Dr. Lavesh Bohra' : 'Dr. Ananya Sharma',
        mode: 'in-clinic',
        date: getDateString(b.dateOffset),
        slot: b.slot,
        patientName: 'Existing Patient',
        whatsappNumber: '+91 98290 12345',
        email: 'patient@example.com',
        age: 45,
        gender: 'Female',
        chiefComplaint: 'Follow-up pulse check',
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error accessing appointment storage:', e);
    return [];
  }
}

function saveAppointments(appointments: Appointment[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (e) {
    console.error('Failed to save appointments:', e);
  }
}

/**
 * Generates a unique, prestigious clinical token number
 * Format: AAR-YYYY-XXXX (e.g. AAR-2026-0421)
 */
export function generateTokenNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `AAR-${year}-${randomPart}`;
}

/**
 * Fetch all booked slots for a given date and doctor
 * Used by the slot picker to mark colliding slots as disabled.
 * 
 * Supabase equivalent:
 * const { data } = await supabase
 *   .from('appointments')
 *   .select('slot')
 *   .eq('date', date)
 *   .eq('doctor_id', doctorId)
 *   .eq('status', 'confirmed');
 */
export async function getBookedSlots(date: string, doctorId: string): Promise<string[]> {
  // Simulate network latency (150ms)
  await new Promise((r) => setTimeout(r, 120));

  const all = getStoredAppointments();
  return all
    .filter((a) => a.date === date && a.doctorId === doctorId && a.status === 'confirmed')
    .map((a) => a.slot);
}

/**
 * Checks if a specific slot is available
 */
export async function isSlotAvailable(
  date: string,
  slot: string,
  doctorId: string
): Promise<boolean> {
  const booked = await getBookedSlots(date, doctorId);
  return !booked.includes(slot);
}

/**
 * Creates and confirms a new appointment.
 * Employs atomic conflict detection to prevent double-booking.
 * 
 * Supabase equivalent:
 * const { data, error } = await supabase
 *   .from('appointments')
 *   .insert([{ ...input, token_number: token }])
 *   .select()
 *   .single();
 */
export async function createAppointment(
  input: CreateAppointmentInput
): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 350));

  const all = getStoredAppointments();

  // Double-booking check
  const isConflict = all.some(
    (a) =>
      a.date === input.date &&
      a.slot === input.slot &&
      a.doctorId === input.doctorId &&
      a.status === 'confirmed'
  );

  if (isConflict) {
    return {
      success: false,
      error: `The ${input.slot} slot on ${input.date} has just been reserved. Please select another time slot.`,
    };
  }

  const tokenNumber = generateTokenNumber();
  const newAppointment: Appointment = {
    ...input,
    id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    tokenNumber,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  };

  all.push(newAppointment);
  saveAppointments(all);

  return {
    success: true,
    appointment: newAppointment,
  };
}

/**
 * Retrieve appointment by token number
 */
export async function getAppointmentByToken(
  tokenNumber: string
): Promise<Appointment | null> {
  await new Promise((r) => setTimeout(r, 100));
  const all = getStoredAppointments();
  return all.find((a) => a.tokenNumber.toUpperCase() === tokenNumber.toUpperCase()) || null;
}

