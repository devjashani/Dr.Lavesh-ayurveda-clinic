import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { BOOKING_CONFIG } from '@/lib/config/booking';

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

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select(
        'id, patient_name, patient_whatsapp, patient_email, patient_age, patient_gender, service_id, doctor_name, consultation_mode, appointment_date, slot_start, slot_end, status, fee_amount, razorpay_order_id, razorpay_payment_id, paid_at, created_at'
      )
      .eq('id', id)
      .single();

    if (error || !booking) {
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
        feeAmount: booking.fee_amount || 49900,
        feeFormatted: '₹499',
        status: booking.status,
        razorpayPaymentId: booking.razorpay_payment_id || null,
        razorpayOrderId: booking.razorpay_order_id || null,
        paidAt: booking.paid_at || null,
        createdAt: booking.created_at,
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
