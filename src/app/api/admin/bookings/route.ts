import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireDoctor } from '@/lib/agora/auth';
import { BOOKING_CONFIG } from '@/lib/config/booking';
import { extractReportFilename, resolveBookingReportsBatch } from '@/lib/utils/reports';

export async function GET(request: NextRequest) {
  try {
    // 1. Require Doctor Auth
    const doctorAuth = await requireDoctor(request);
    if (!doctorAuth.authorized) {
      return NextResponse.json(
        {
          success: false,
          code: 'UNAUTHORIZED',
          message: doctorAuth.error || 'Doctor authentication required.',
        },
        { status: 401 }
      );
    }

    // 2. Resilient query for all clinical bookings using select('*')
    // select('*') dynamically adapts to whatever columns exist in Supabase and avoids column mismatch errors
    let rawBookings: any[] = [];

    const res1 = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('appointment_date', { ascending: false });

    if (!res1.error && res1.data) {
      rawBookings = res1.data;
    } else {
      console.warn('Admin bookings select(*) with order by appointment_date warning:', res1.error?.message);
      const res2 = await supabaseAdmin
        .from('bookings')
        .select('*');
      if (!res2.error && res2.data) {
        rawBookings = res2.data;
      } else {
        console.error('All admin booking queries failed:', res2.error?.message);
        rawBookings = [];
      }
    }

    // Filter out only explicitly cancelled or expired records (keep all test and clinical bookings)
    const activeBookings = (rawBookings || []).filter((b) => {
      const statusUpper = (b.status || '').toUpperCase();
      const isTest =
        Boolean(b.razorpay_order_id?.startsWith('order_test_')) ||
        Boolean(b.razorpay_order_id?.startsWith('order_dev_test_')) ||
        Boolean(b.razorpay_payment_id?.startsWith('pay_test_')) ||
        Boolean(b.razorpay_payment_id?.startsWith('pay_dev_test_')) ||
        b.patient_whatsapp?.includes('9016432576') ||
        b.patient_whatsapp?.includes('6377408157') ||
        b.patient_whatsapp?.includes('9876543210');

      if (isTest) return true;
      if (statusUpper === 'CANCELLED' || statusUpper === 'EXPIRED') return false;
      return true;
    });

    // 3. Resolve report URLs (direct Cloudinary HTTPS URLs pass through; legacy Supabase paths are signed)
    const reportUrlMap = await resolveBookingReportsBatch(
      activeBookings.map((b) => b.report_file_ids)
    );

    // 4. Transform into clean typed response for doctor console
    const formattedBookings = activeBookings.map((b) => {
      const [hStr, mStr] = (b.slot_start || '10:00').split(':');
      let h = parseInt(hStr, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      const formattedSlot = `${h}:${mStr || '00'} ${ampm}`;

      const year = b.created_at ? new Date(b.created_at).getFullYear() : 2026;
      const idPrefix = typeof b.id === 'string' ? b.id.slice(0, 4).toUpperCase() : '0000';
      const tokenNumber = `VAN-${year}-${idPrefix}`;

      const isTestBooking =
        Boolean(b.razorpay_order_id?.startsWith('order_test_')) ||
        Boolean(b.razorpay_order_id?.startsWith('order_dev_test_')) ||
        Boolean(b.razorpay_payment_id?.startsWith('pay_test_')) ||
        Boolean(b.razorpay_payment_id?.startsWith('pay_dev_test_')) ||
        b.patient_whatsapp?.includes('9016432576') ||
        b.patient_whatsapp?.includes('6377408157') ||
        b.patient_whatsapp?.includes('9876543210');

      let status = (b.status || 'CONFIRMED').toUpperCase();
      if (isTestBooking && status === 'PENDING_PAYMENT') {
        status = 'CONFIRMED';
        // Auto-heal status in background
        supabaseAdmin.from('bookings').update({ status: 'CONFIRMED' }).eq('id', b.id).then(() => {});
      }

      const reports = (Array.isArray(b.report_file_ids) ? b.report_file_ids : []).map(
        (pathOrUrl: string, idx: number) => ({
          id: pathOrUrl,
          name: extractReportFilename(pathOrUrl, idx),
          url: reportUrlMap.get(pathOrUrl) || (pathOrUrl.startsWith('http') ? pathOrUrl : '#'),
        })
      );

      return {
        id: b.id,
        tokenNumber,
        serviceName: BOOKING_CONFIG.service.name,
        doctorName: b.doctor_name || BOOKING_CONFIG.doctorName,
        date: b.appointment_date,
        slot: formattedSlot,
        slotStart: b.slot_start || '10:00',
        slotEnd: b.slot_end || '10:20',
        patientName: b.patient_name || 'Patient',
        whatsappNumber: b.patient_whatsapp || '',
        email: b.patient_email || '',
        age: b.patient_age || 0,
        gender: b.patient_gender || 'Other',
        primaryComplaint: b.primary_complaint || '',
        reports,
        status,
        isTestBooking,
        feeAmount: b.fee_amount || 49900,
        feeFormatted: '₹499',
        razorpayPaymentId: b.razorpay_payment_id || null,
        paidAt: b.paid_at || null,
        createdAt: b.created_at || new Date().toISOString(),
        patientJoinedAt: b.patient_joined_at || null,
        doctorJoinedAt: b.doctor_joined_at || null,
        callStartedAt: b.call_started_at || null,
        callEndedAt: b.call_ended_at || null,
        lastPatientPingAt: b.last_patient_ping_at || null,
        lastDoctorPingAt: b.last_doctor_ping_at || null,
      };
    });

    return NextResponse.json({
      success: true,
      serverNow: new Date().toISOString(),
      bookings: formattedBookings,
    });
  } catch (err) {
    console.error('Admin bookings handler error:', err instanceof Error ? err.message : 'Unknown');
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Could not fetch bookings.' },
      { status: 500 }
    );
  }
}
