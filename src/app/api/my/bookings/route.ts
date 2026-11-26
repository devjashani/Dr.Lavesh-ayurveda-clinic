import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getPatientSession } from '@/lib/auth/patientSession';
import { BOOKING_CONFIG } from '@/lib/config/booking';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

export async function GET(request: NextRequest) {
  try {
    // 1. Patient Session Authentication (strictly required, else 401)
    const session = await getPatientSession();
    if (!session?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const email = session.email.trim().toLowerCase();
    const serverNow = new Date().toISOString();

    // 2. Fetch bookings for this email with status CONFIRMED, COMPLETED or NO_SHOW
    let { data: bookings, error: fetchErr } = await supabaseAdmin
      .from('bookings')
      .select(
        'id, appointment_date, slot_start, slot_end, status, fee_amount, service_id, doctor_name, patient_name, patient_age, patient_gender, created_at'
      )
      .or(`email_normalized.eq.${email},patient_email.eq.${email}`)
      .in('status', ['CONFIRMED', 'COMPLETED', 'NO_SHOW'])
      .order('appointment_date', { ascending: false })
      .order('slot_start', { ascending: false });

    if (
      fetchErr &&
      (fetchErr.code === 'PGRST204' ||
        fetchErr.code === '42703' ||
        fetchErr.message?.includes('email_normalized'))
    ) {
      const retryRes = await supabaseAdmin
        .from('bookings')
        .select(
          'id, appointment_date, slot_start, slot_end, status, fee_amount, service_id, doctor_name, patient_name, patient_age, patient_gender, created_at'
        )
        .eq('patient_email', email)
        .in('status', ['CONFIRMED', 'COMPLETED', 'NO_SHOW'])
        .order('appointment_date', { ascending: false })
        .order('slot_start', { ascending: false });
      bookings = retryRes.data;
      fetchErr = retryRes.error;
    }

    if (fetchErr) {
      console.error('[My Bookings Fetch Error]', fetchErr);
      return NextResponse.json(
        { error: 'Failed to retrieve bookings.' },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }

    // 3. Sanitize and Map ONLY Allowed Fields
    // id, bookingRef, slot_start, slot_end, status, amount, service name, serverNow
    // NEVER return phone, complaint, report files or payment ids.
    const sanitizedBookings = (bookings || []).map((b) => {
      // Format reference token: VAN-YYYY-XXXX
      const year =
        b.appointment_date?.slice(0, 4) ||
        new Date(b.created_at).getFullYear().toString();
      const hexTail = b.id.replace(/-/g, '').slice(0, 4).toUpperCase();
      const bookingRef = `VAN-${year}-${hexTail}`;

      // ISO formatted slot timestamps for unambiguous timezone calculations
      const slotStartIso = `${b.appointment_date}T${b.slot_start}:00+05:30`;
      const slotEndIso = `${b.appointment_date}T${b.slot_end || b.slot_start}:00+05:30`;

      return {
        id: b.id,
        bookingRef,
        date: b.appointment_date,
        slot_start: slotStartIso,
        slot_end: slotEndIso,
        raw_start: b.slot_start,
        raw_end: b.slot_end,
        status: b.status,
        amount: b.fee_amount, // 49900 paise = ₹499
        serviceName: BOOKING_CONFIG.service.name,
        doctorName: b.doctor_name || BOOKING_CONFIG.doctorName,
        patientName: b.patient_name || '',
        patientAge: b.patient_age || undefined,
        patientGender: b.patient_gender || '',
        serverNow,
      };
    });

    return NextResponse.json(
      {
        bookings: sanitizedBookings,
        serverNow,
        email,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error('[My Bookings Route Error]', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
