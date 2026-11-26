import { supabaseAdmin } from '@/lib/supabase';
import {
  ConsultationPrescription,
  normalizeMedicineOrder,
} from '@/lib/prescription/types';

// In-process memory fallback for local dev or storage outages
const globalForRx = globalThis as unknown as {
  __vankalRxCache?: Map<string, ConsultationPrescription>;
};

const rxMemoryCache =
  globalForRx.__vankalRxCache || new Map<string, ConsultationPrescription>();
if (!globalForRx.__vankalRxCache) {
  globalForRx.__vankalRxCache = rxMemoryCache;
}

function emptyPrescription(bookingId: string): ConsultationPrescription {
  return {
    bookingId,
    medicines: [],
    clinicalAdvice: '',
    updatedAt: new Date(0).toISOString(),
  };
}

function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    Boolean(error.message?.includes('consultation_prescriptions'))
  );
}

function getStoragePath(bookingId: string): string {
  return `prescriptions/${bookingId}.json`;
}

/**
 * Reads a consultation prescription with resilient fallback:
 * 1. Primary: public.consultation_prescriptions table
 * 2. Fallback: Supabase Storage JSON in 'medical-reports' bucket
 * 3. Memory cache fallback
 */
export async function getPrescriptionRecord(
  bookingId: string
): Promise<ConsultationPrescription> {
  // 1. Primary Postgres table
  const { data, error } = await supabaseAdmin
    .from('consultation_prescriptions')
    .select('booking_id, medicines, clinical_advice, updated_at')
    .eq('booking_id', bookingId)
    .maybeSingle();

  if (!error && data) {
    const parsed: ConsultationPrescription = {
      bookingId: data.booking_id,
      medicines: normalizeMedicineOrder(Array.isArray(data.medicines) ? data.medicines : []),
      clinicalAdvice: data.clinical_advice || '',
      updatedAt: data.updated_at || new Date().toISOString(),
    };
    rxMemoryCache.set(bookingId, parsed);
    return parsed;
  }

  if (!error && !data) {
    // Table exists, no row yet (check memory cache just in case)
    return rxMemoryCache.get(bookingId) || emptyPrescription(bookingId);
  }

  if (isMissingTableError(error)) {
    // 2. Resilient fallback to Supabase Storage JSON
    try {
      const { data: blob, error: dlErr } = await supabaseAdmin.storage
        .from('medical-reports')
        .download(getStoragePath(bookingId));

      if (!dlErr && blob) {
        const text = await blob.text();
        const json = JSON.parse(text) as ConsultationPrescription;
        const parsed: ConsultationPrescription = {
          bookingId,
          medicines: normalizeMedicineOrder(json.medicines || []),
          clinicalAdvice: json.clinicalAdvice || '',
          updatedAt: json.updatedAt || new Date().toISOString(),
        };
        rxMemoryCache.set(bookingId, parsed);
        return parsed;
      }
    } catch {
      // Fall through to memory cache
    }
  }

  return rxMemoryCache.get(bookingId) || emptyPrescription(bookingId);
}

/**
 * Persists a consultation prescription with resilient fallback across DB -> Storage -> Memory.
 */
export async function savePrescriptionRecord(
  prescription: ConsultationPrescription,
  updatedBy?: string
): Promise<ConsultationPrescription> {
  const nowIso = new Date().toISOString();
  const normalized: ConsultationPrescription = {
    bookingId: prescription.bookingId,
    medicines: normalizeMedicineOrder(prescription.medicines),
    clinicalAdvice: prescription.clinicalAdvice.trim(),
    updatedAt: nowIso,
  };

  rxMemoryCache.set(normalized.bookingId, normalized);

  // 1. Attempt primary table upsert
  const { error: dbErr } = await supabaseAdmin
    .from('consultation_prescriptions')
    .upsert(
      {
        booking_id: normalized.bookingId,
        medicines: normalized.medicines,
        clinical_advice: normalized.clinicalAdvice,
        updated_by: updatedBy || 'dr-lavesh-bohra',
        updated_at: nowIso,
      },
      { onConflict: 'booking_id' }
    );

  if (!dbErr) {
    return normalized;
  }

  if (isMissingTableError(dbErr)) {
    // 2. Fallback to Supabase Storage JSON so persistence works across Vercel instances before migration
    try {
      const payload = Buffer.from(JSON.stringify(normalized), 'utf8');
      await supabaseAdmin.storage
        .from('medical-reports')
        .upload(getStoragePath(normalized.bookingId), payload, {
          contentType: 'application/json',
          upsert: true,
        });
    } catch (storageErr) {
      console.warn('[Prescription Fallback Storage Warning]', storageErr);
    }
  } else {
    console.warn('[Prescription DB Upsert Warning]', dbErr.message);
  }

  return normalized;
}
