import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { requireDoctor, requirePatientAccess } from '@/lib/agora/auth';
import { getPatientSession } from '@/lib/auth/patientSession';
import { getPrescriptionRecord, savePrescriptionRecord } from '@/lib/prescription/store';
import { normalizeMedicineOrder, PrescribedMedicine } from '@/lib/prescription/types';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

const uuidSchema = z.string().uuid({ message: 'Invalid booking ID format' });

const medicineInputSchema = z.object({
  id: z.string().max(80).optional(),
  name: z.string().trim().min(1, 'Medicine name is required').max(200),
  dosage: z.string().trim().max(120).optional().default(''),
  timing: z.string().trim().max(160).optional().default(''),
  duration: z.string().trim().max(80).optional().default(''),
});

const postBodySchema = z.object({
  bookingId: z.string().uuid({ message: 'Invalid booking ID format' }),
  action: z.enum(['add', 'remove', 'save_all']).default('add'),
  medicine: medicineInputSchema.optional(),
  medicineId: z.string().max(80).optional(),
  medicines: z.array(medicineInputSchema).max(50).optional(),
  clinicalAdvice: z.string().trim().max(3000).optional(),
});

async function authorizeViewer(
  request: NextRequest,
  bookingId: string
): Promise<{ authorized: boolean; status?: number; role?: 'doctor' | 'patient' }> {
  // 1. Doctor authorization
  const doctorAuth = await requireDoctor(request);
  if (doctorAuth.authorized) {
    return { authorized: true, role: 'doctor' };
  }

  // 2. Patient call proof cookie or header (set when entering call room)
  const proofAuth = requirePatientAccess(request, bookingId);
  if (proofAuth.authorized) {
    return { authorized: true, role: 'patient' };
  }

  // 3. Patient session cookie (My Bookings login)
  const patientSession = await getPatientSession();
  if (patientSession?.email) {
    let bookingEmail = '';
    const res1 = await supabaseAdmin
      .from('bookings')
      .select('email_normalized, patient_email')
      .eq('id', bookingId)
      .maybeSingle();

    if (!res1.error && res1.data) {
      bookingEmail = (res1.data.email_normalized || res1.data.patient_email || '')
        .trim()
        .toLowerCase();
    } else {
      const res2 = await supabaseAdmin
        .from('bookings')
        .select('patient_email')
        .eq('id', bookingId)
        .maybeSingle();
      if (!res2.error && res2.data) {
        bookingEmail = (res2.data.patient_email || '').trim().toLowerCase();
      }
    }

    if (bookingEmail && bookingEmail === patientSession.email.trim().toLowerCase()) {
      return { authorized: true, role: 'patient' };
    }
    return { authorized: false, status: 403 };
  }

  return { authorized: false, status: 401 };
}

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get('bookingId') || '';
    if (!uuidSchema.safeParse(bookingId).success) {
      return NextResponse.json(
        { success: false, code: 'INVALID_ID', message: 'Valid bookingId is required.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const auth = await authorizeViewer(request, bookingId);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Unauthorized to view prescription.' },
        { status: auth.status || 401, headers: NO_CACHE_HEADERS }
      );
    }

    const prescription = await getPrescriptionRecord(bookingId);
    return NextResponse.json(
      { success: true, prescription },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[Prescription GET Error]', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Could not load prescription.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only authenticated doctor can write or modify prescriptions
    const doctorAuth = await requireDoctor(request);
    if (!doctorAuth.authorized) {
      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED',
          message: doctorAuth.error || 'Only the doctor can update prescriptions.',
        },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const rawBody = await request.json().catch(() => null);
    const parsed = postBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Invalid prescription payload.',
          errors: parsed.error.issues,
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const { bookingId, action, medicine, medicineId, medicines, clinicalAdvice } = parsed.data;

    // Ensure booking exists
    const { data: bookingRow, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('id', bookingId)
      .maybeSingle();

    if (bookingErr || !bookingRow) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Booking not found.' },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const existing = await getPrescriptionRecord(bookingId);
    let nextMedicines: PrescribedMedicine[] = existing.medicines;
    let nextAdvice = clinicalAdvice !== undefined ? clinicalAdvice : existing.clinicalAdvice;

    if (action === 'add' && medicine) {
      const newMed: PrescribedMedicine = {
        id:
          medicine.id ||
          (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
        order: existing.medicines.length + 1,
        name: medicine.name,
        dosage: medicine.dosage || '',
        timing: medicine.timing || '',
        duration: medicine.duration || '',
        addedAt: new Date().toISOString(),
      };
      nextMedicines = normalizeMedicineOrder([...existing.medicines, newMed]);
    } else if (action === 'remove' && medicineId) {
      nextMedicines = normalizeMedicineOrder(
        existing.medicines.filter((item) => item.id !== medicineId)
      );
    } else if (action === 'save_all') {
      if (medicines !== undefined) {
        nextMedicines = normalizeMedicineOrder(
          medicines.map((item, idx) => ({
            id: item.id || `med-${Date.now()}-${idx}`,
            order: idx + 1,
            name: item.name,
            dosage: item.dosage || '',
            timing: item.timing || '',
            duration: item.duration || '',
            addedAt: new Date().toISOString(),
          }))
        );
      }
      if (clinicalAdvice !== undefined) {
        nextAdvice = clinicalAdvice;
      }
    }

    const saved = await savePrescriptionRecord(
      {
        bookingId,
        medicines: nextMedicines,
        clinicalAdvice: nextAdvice,
        updatedAt: new Date().toISOString(),
      },
      doctorAuth.email || 'dr-lavesh-bohra'
    );

    return NextResponse.json(
      { success: true, prescription: saved },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[Prescription POST Error]', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Could not save prescription.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
