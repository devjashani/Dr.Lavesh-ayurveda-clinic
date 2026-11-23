/**
 * Create an Instant Test Video Call Booking in Supabase
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/create-test-booking.ts
 */

import { supabaseAdmin } from '../src/lib/supabase';
import { BOOKING_CONFIG } from '../src/lib/config/booking';

async function main() {
  console.log('================================================================');
  console.log('🩺 VANKAL AYURVEDA — INSTANT TEST BOOKING GENERATOR');
  console.log('================================================================\n');

  const now = new Date();
  const istDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
  });
  const todayDate = istDateFormatter.format(now); // YYYY-MM-DD

  const istTimeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const [currHStr, currMStr] = istTimeFormatter.format(now).split(':');
  const currH = parseInt(currHStr, 10);
  const currM = parseInt(currMStr, 10);

  // Slot starts 5 minutes ago and ends 30 minutes from now so window is active right now
  const startTotalM = Math.max(0, currH * 60 + currM - 5);
  const endTotalM = Math.min(23 * 60 + 59, currH * 60 + currM + 30);

  const slotStartH = Math.floor(startTotalM / 60);
  const slotStartM = startTotalM % 60;
  const slotEndH = Math.floor(endTotalM / 60);
  const slotEndM = endTotalM % 60;

  const slotStart = `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`;
  const slotEnd = `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`;

  const testPhone = '9016432576';
  const nowIso = now.toISOString();

  console.log(`📅 Date (IST): ${todayDate}`);
  console.log(`⏰ Active Slot: ${slotStart} to ${slotEnd} (Window is ACTIVE NOW)`);
  console.log(`👤 Patient: Dev Jashani (Live Video Test)`);
  console.log(`📱 WhatsApp Number: +91 ${testPhone} (Last 4 digits: ${testPhone.slice(-4)})`);

  const { data: booking, error: insertError } = await supabaseAdmin
    .from('bookings')
    .insert({
      patient_name: 'Dev Jashani (Live Video Test)',
      patient_whatsapp: testPhone,
      patient_email: 'test@vankalayurveda.com',
      patient_age: 26,
      patient_gender: 'Male',
      primary_complaint: 'Testing live Agora video consultation between Doctor Console and Patient room.',
      report_file_ids: [],
      service_id: BOOKING_CONFIG.service.id,
      doctor_id: BOOKING_CONFIG.doctorId,
      doctor_name: BOOKING_CONFIG.doctorName,
      consultation_mode: 'online',
      appointment_date: todayDate,
      slot_start: slotStart,
      slot_end: slotEnd,
      status: 'CONFIRMED',
      fee_amount: 49900,
      razorpay_order_id: `order_dev_test_${Date.now()}`,
      razorpay_payment_id: `pay_dev_test_${Date.now()}`,
      paid_at: nowIso,
    })
    .select('id, appointment_date, slot_start, slot_end, patient_name, patient_whatsapp')
    .single();

  if (insertError || !booking) {
    console.error('\n❌ Failed to insert test booking:', insertError?.message || insertError);
    process.exit(1);
  }

  console.log('\n✅ Confirmed Test Booking Created Successfully!');
  console.log(`🆔 Booking ID: ${booking.id}`);
  console.log('----------------------------------------------------------------');
  console.log('HOW TO TEST VIDEO CALLING:');
  console.log('----------------------------------------------------------------');
  console.log('1. AS DOCTOR:');
  console.log('   - Open http://localhost:3000/admin');
  console.log('   - Look at the "Today" tab.');
  console.log('   - Click the green "Start Video Call" button on this appointment.');
  console.log('\n2. AS PATIENT (Open in Incognito window or on your phone):');
  console.log(`   - Direct URL: http://localhost:3000/consult/${booking.id}`);
  console.log(`   - When prompted for phone verification, enter: ${testPhone.slice(-4)}`);
  console.log('   - Grant Camera & Mic permissions.');
  console.log('   - Click "Join Video Consultation".');
  console.log('\n3. Both doctor and patient will connect on live video and audio!');
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
