import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { BOOKING_CONFIG } from '@/lib/config/booking';
import { isRazorpayLiveConfigured } from '@/lib/razorpay';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, code: 'INVALID_ID', message: 'Invalid appointment ID' },
        { status: 400 }
      );
    }

    const fullSelect =
      'id, patient_name, patient_whatsapp, patient_email, patient_age, patient_gender, primary_complaint, report_file_ids, service_id, doctor_name, consultation_mode, appointment_date, slot_start, slot_end, status, fee_amount, razorpay_order_id, razorpay_payment_id, paid_at, created_at, doctor_joined_at, patient_joined_at, call_started_at, call_ended_at, last_patient_ping_at, last_doctor_ping_at';
    const baseSelect =
      'id, patient_name, patient_whatsapp, patient_email, patient_age, patient_gender, primary_complaint, report_file_ids, service_id, doctor_name, consultation_mode, appointment_date, slot_start, slot_end, status, fee_amount, razorpay_order_id, razorpay_payment_id, paid_at, created_at';

    let booking: any = null;
    const res1 = await supabaseAdmin
      .from('bookings')
      .select(fullSelect)
      .eq('id', id)
      .single();

    if (!res1.error && res1.data) {
      booking = res1.data;
    } else {
      const res2 = await supabaseAdmin
        .from('bookings')
        .select(baseSelect)
        .eq('id', id)
        .single();
      if (!res2.error && res2.data) {
        booking = res2.data;
      }
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Format human-friendly slot e.g. "10:30 AM"
    const [hStr, mStr] = (booking.slot_start || '10:00').split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const formattedSlot = `${h}:${mStr} ${ampm}`;

    const year = booking.created_at
      ? new Date(booking.created_at).getFullYear()
      : new Date().getFullYear();
    const tokenNumber = `VAN-${year}-${booking.id.slice(0, 4).toUpperCase()}`;

    const isTestMode =
      !isRazorpayLiveConfigured() ||
      Boolean(booking.razorpay_order_id?.startsWith('order_test_')) ||
      Boolean(booking.razorpay_payment_id?.startsWith('pay_test_'));

    // Generate signed URLs for uploaded medical reports if available
    let signedReports: Array<{ id: string; name: string; url: string }> = [];
    if (booking.report_file_ids && Array.isArray(booking.report_file_ids) && booking.report_file_ids.length > 0) {
      try {
        const { data: urls } = await supabaseAdmin.storage
          .from('medical-reports')
          .createSignedUrls(booking.report_file_ids, 3600); // 1 hour access

        if (urls && Array.isArray(urls)) {
          signedReports = urls
            .filter((u) => !!u.signedUrl && !u.error)
            .map((u, idx) => {
              const rawPath = u.path || booking.report_file_ids[idx];
              const parts = rawPath.split('/');
              const filename = parts[parts.length - 1].replace(/^\d+_/, '') || `Report-${idx + 1}`;
              return {
                id: rawPath,
                name: filename,
                url: u.signedUrl as string,
              };
            });
        }
      } catch (storageErr) {
        console.warn('Could not generate signed report URLs:', storageErr);
      }
    }

    return NextResponse.json({
      success: true,
      serverTime: new Date().toISOString(),
      booking: {
        id: booking.id,
        tokenNumber,
        serviceName: BOOKING_CONFIG.service.name,
        doctorName: booking.doctor_name || BOOKING_CONFIG.doctorName,
        mode: booking.consultation_mode || 'online',
        date: booking.appointment_date,
        slot: formattedSlot,
        slotStart: booking.slot_start,
        slotEnd: booking.slot_end,
        patientName: booking.patient_name,
        whatsappNumber: booking.patient_whatsapp,
        email: booking.patient_email || '',
        age: booking.patient_age,
        gender: booking.patient_gender,
        primaryComplaint: booking.primary_complaint || '',
        reports: signedReports,
        feeAmount: booking.fee_amount || 49900,
        feeFormatted: '₹499',
        status: booking.status,
        isTestMode,
        razorpayPaymentId: booking.razorpay_payment_id || null,
        razorpayOrderId: booking.razorpay_order_id || null,
        paidAt: booking.paid_at || null,
        createdAt: booking.created_at,
        patientJoinedAt: booking.patient_joined_at || null,
        doctorJoinedAt: booking.doctor_joined_at || null,
        callStartedAt: booking.call_started_at || null,
        callEndedAt: booking.call_ended_at || null,
      },
    });
  } catch (err) {
    console.error('Error fetching booking details:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Could not retrieve appointment record' },
      { status: 500 }
    );
  }
}
