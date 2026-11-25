import { sendEmail } from '@/lib/email/send';
import { BOOKING_CONFIG } from '@/lib/config/booking';

export interface ConfirmedBookingEmailRecord {
  id: string;
  patient_name: string;
  patient_whatsapp: string;
  patient_email?: string | null;
  email_normalized?: string | null;
  patient_age?: number | null;
  patient_gender?: string | null;
  doctor_name?: string | null;
  appointment_date: string;
  slot_start: string;
  slot_end?: string | null;
  fee_amount?: number | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formats booking ID and appointment date into VAN-YYYY-XXXX reference.
 */
export function formatBookingReference(bookingId: string, appointmentDate?: string): string {
  const year = appointmentDate?.slice(0, 4) || new Date().getFullYear().toString();
  const hexTail = bookingId.replace(/-/g, '').slice(0, 4).toUpperCase();
  return `VAN-${year}-${hexTail}`;
}

function formatTime12h(time24?: string | null): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  if (Number.isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mStr || '00'} ${ampm}`;
}

/**
 * Formats appointment date and time in friendly IST display string.
 */
export function formatFriendlySlotIst(
  dateStr: string,
  slotStart: string,
  slotEnd?: string | null
): string {
  if (!dateStr || !slotStart) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const dateLabel = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(dateObj);

    const start12 = formatTime12h(slotStart);
    const end12 = slotEnd ? formatTime12h(slotEnd) : '';
    return end12
      ? `${dateLabel} · ${start12} – ${end12} IST`
      : `${dateLabel} · ${start12} IST`;
  } catch {
    return `${dateStr} · ${slotStart} IST`;
  }
}

/**
 * Builds the confirmation email sent to the patient after payment confirmation.
 */
export function buildPatientBookingConfirmationEmail({
  booking,
  siteUrl,
}: {
  booking: ConfirmedBookingEmailRecord;
  siteUrl: string;
}) {
  const bookingRef = formatBookingReference(booking.id, booking.appointment_date);
  const slotDisplay = formatFriendlySlotIst(
    booking.appointment_date,
    booking.slot_start,
    booking.slot_end
  );
  const doctorName = booking.doctor_name || BOOKING_CONFIG.doctorName;
  const feeInr = Math.round((booking.fee_amount || BOOKING_CONFIG.service.feePaise) / 100);
  const myBookingsUrl = `${siteUrl}/my-bookings`;
  const receiptUrl = `${siteUrl}/book/confirmed?booking=${booking.id}`;
  const supportEmail = process.env.NEXT_PUBLIC_CLINIC_EMAIL || 'vankalayurveda@gmail.com';
  const patientEmail = (booking.email_normalized || booking.patient_email || '').trim().toLowerCase();

  const subject = `Confirmed: Your VANKAL AYURVEDA Consultation (${bookingRef})`;

  const text = `Namaste ${booking.patient_name},

Your video consultation with ${doctorName} is confirmed.

Booking Reference: ${bookingRef}
Date & Time: ${slotDisplay}
Consultation Mode: Video Consultation
Consultation Fee: ₹${feeInr} (Paid)

ACCESS YOUR BOOKING & VIDEO CALL:
Click the link below and sign in with this email (${patientEmail}) to open My Bookings. From there you can download your receipt, add to calendar, and join the Video Call 10 minutes before your scheduled slot:
${myBookingsUrl}

View Receipt & Booking Confirmation:
${receiptUrl}

Need to change your slot or have questions?
Email: ${supportEmail}
Phone / WhatsApp: +91 9016432576

Warm regards,
${doctorName}
VANKAL AYURVEDA · Classical Ayurvedic Healthcare`;

  const safeName = escapeHtml(booking.patient_name);
  const safeDoctor = escapeHtml(doctorName);
  const safeSlot = escapeHtml(slotDisplay);
  const safeRef = escapeHtml(bookingRef);
  const safeEmail = escapeHtml(patientEmail);
  const safeSupportEmail = escapeHtml(supportEmail);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FBF9F4; margin: 0; padding: 24px; color: #1F3D2B;">
  <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2D9C8; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <div style="background-color: #1F3D2B; padding: 24px 32px; text-align: center;">
      <h1 style="color: #FBF9F4; margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 0.05em;">VANKAL AYURVEDA</h1>
      <p style="color: #D4AF37; margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Appointment Confirmed</p>
    </div>

    <div style="padding: 32px;">
      <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #14291C;">
        Namaste <strong>${safeName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #4A5568;">
        Your individual Ayurvedic video consultation with <strong>${safeDoctor}</strong> has been confirmed.
      </p>

      <div style="background: #F7F5EF; border: 1px solid #E2D9C8; border-radius: 6px; padding: 18px 20px; margin: 24px 0;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 13px; color: #14291C;">
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Booking Reference</td>
            <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 700;">${safeRef}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Date &amp; Time</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${safeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Consultation</td>
            <td style="padding: 6px 0; text-align: right;">Video Consultation · ${safeDoctor}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Fee Paid</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">&#8377;${feeInr}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0 16px 0;">
        <a href="${myBookingsUrl}" style="background-color: #1F3D2B; color: #FBF9F4; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; display: inline-block;">
          Open My Bookings &amp; Video Call &rarr;
        </a>
      </div>

      <p style="font-size: 12px; color: #64748B; text-align: center; line-height: 1.6; margin-bottom: 24px;">
        Sign in on <strong>My Bookings</strong> using <strong>${safeEmail}</strong> to view your slot, download your receipt, or click <strong>Join Video Call</strong> (activates 10 minutes before your consultation).
      </p>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${receiptUrl}" style="color: #1F3D2B; font-size: 13px; text-decoration: underline;">
          View Booking Receipt
        </a>
      </div>

      <p style="font-size: 12px; color: #94A3B8; line-height: 1.5; border-top: 1px solid #E2D9C8; padding-top: 18px; margin-bottom: 0;">
        Need help or want to reschedule? Write to <a href="mailto:${safeSupportEmail}" style="color: #1F3D2B;">${safeSupportEmail}</a> or call +91 9016432576.
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Builds the new-booking alert email sent to Dr. Lavesh Bohra and the clinic desk.
 */
export function buildDoctorBookingAlertEmail({
  booking,
  siteUrl,
}: {
  booking: ConfirmedBookingEmailRecord;
  siteUrl: string;
}) {
  const bookingRef = formatBookingReference(booking.id, booking.appointment_date);
  const slotDisplay = formatFriendlySlotIst(
    booking.appointment_date,
    booking.slot_start,
    booking.slot_end
  );
  const adminUrl = `${siteUrl}/admin`;
  const consultUrl = `${siteUrl}/consult/${booking.id}`;
  const patientEmail = (booking.email_normalized || booking.patient_email || '').trim().toLowerCase() || 'Not provided';
  const ageGender = [
    booking.patient_age ? `${booking.patient_age} yrs` : '',
    booking.patient_gender || '',
  ]
    .filter(Boolean)
    .join(' · ');

  const subject = `New Patient Booking: ${booking.patient_name} · ${slotDisplay}`;

  const text = `Namaste Dr. Lavesh Bohra,

A new video consultation booking has been confirmed and paid (₹499).

Booking Reference: ${bookingRef}
Scheduled Slot: ${slotDisplay}
Patient Name: ${booking.patient_name}${ageGender ? ` (${ageGender})` : ''}
WhatsApp / Phone: ${booking.patient_whatsapp}
Patient Email: ${patientEmail}

Open Doctor Console (to view primary complaint & patient intake):
${adminUrl}

Direct Consultation Video Room (opens 15 mins before slot):
${consultUrl}

— VANKAL AYURVEDA Clinical Desk`;

  const safeName = escapeHtml(booking.patient_name);
  const safeSlot = escapeHtml(slotDisplay);
  const safeRef = escapeHtml(bookingRef);
  const safePhone = escapeHtml(booking.patient_whatsapp || '');
  const safeEmail = escapeHtml(patientEmail);
  const safeAgeGender = escapeHtml(ageGender);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FBF9F4; margin: 0; padding: 24px; color: #1F3D2B;">
  <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2D9C8; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <div style="background-color: #14291C; padding: 22px 32px; text-align: center;">
      <h1 style="color: #FBF9F4; margin: 0; font-size: 19px; font-weight: 500; letter-spacing: 0.04em;">New Consultation Booked</h1>
      <p style="color: #D99A2B; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;">${safeSlot}</p>
    </div>

    <div style="padding: 28px 32px;">
      <p style="font-size: 14px; line-height: 1.6; margin-top: 0; color: #14291C;">
        Namaste Dr. Lavesh Bohra, a patient appointment has been confirmed and paid (&#8377;499).
      </p>

      <div style="background: #F7F5EF; border: 1px solid #E2D9C8; border-radius: 6px; padding: 16px 20px; margin: 20px 0;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 13px; color: #14291C;">
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Booking Ref</td>
            <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 700;">${safeRef}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Patient</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${safeName}${safeAgeGender ? ` (${safeAgeGender})` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Slot (IST)</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${safeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Phone / WhatsApp</td>
            <td style="padding: 6px 0; text-align: right;">${safePhone}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Patient Email</td>
            <td style="padding: 6px 0; text-align: right;">${safeEmail}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0 12px 0;">
        <a href="${adminUrl}" style="background-color: #1F3D2B; color: #FBF9F4; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; display: inline-block; margin: 4px;">
          Open Doctor Console &rarr;
        </a>
        <a href="${consultUrl}" style="background-color: #D99A2B; color: #14291C; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; display: inline-block; margin: 4px;">
          Join Video Room
        </a>
      </div>

      <p style="font-size: 12px; color: #94A3B8; line-height: 1.5; border-top: 1px solid #E2D9C8; padding-top: 16px; margin-top: 22px; margin-bottom: 0;">
        Clinical intake notes and uploaded patient reports are kept exclusively inside the protected Doctor Console (/admin).
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Resolves deduplicated list of doctor & clinic alert recipient emails.
 */
export function getDoctorAlertRecipients(): string[] {
  const raw = [
    process.env.DOCTOR_EMAIL || 'laveshbohra@gmail.com',
    process.env.NEXT_PUBLIC_CLINIC_EMAIL || 'vankalayurveda@gmail.com',
    ...(process.env.DOCTOR_ALERT_EMAILS || '').split(','),
  ];

  const unique = new Set<string>();
  for (const item of raw) {
    const cleaned = item.trim().toLowerCase();
    if (cleaned && cleaned.includes('@')) {
      unique.add(cleaned);
    }
  }
  return Array.from(unique);
}

/**
 * Dispatches both patient confirmation and doctor/clinic alert emails concurrently.
 */
export async function sendBookingConfirmationEmails(
  booking: ConfirmedBookingEmailRecord,
  siteUrl: string
): Promise<void> {
  const tasks: Promise<unknown>[] = [];

  const patientEmail = (booking.email_normalized || booking.patient_email || '')
    .trim()
    .toLowerCase();

  if (patientEmail) {
    const patientPayload = buildPatientBookingConfirmationEmail({ booking, siteUrl });
    tasks.push(
      sendEmail({
        to: patientEmail,
        subject: patientPayload.subject,
        html: patientPayload.html,
        text: patientPayload.text,
      }).catch((err) => {
        console.error('[Booking Email] Patient delivery error:', err);
      })
    );
  }

  const doctorRecipients = getDoctorAlertRecipients();
  if (doctorRecipients.length > 0) {
    const doctorPayload = buildDoctorBookingAlertEmail({ booking, siteUrl });
    for (const recipient of doctorRecipients) {
      tasks.push(
        sendEmail({
          to: recipient,
          subject: doctorPayload.subject,
          html: doctorPayload.html,
          text: doctorPayload.text,
        }).catch((err) => {
          console.error('[Booking Email] Doctor alert delivery error:', err);
        })
      );
    }
  }

  await Promise.allSettled(tasks);
}
