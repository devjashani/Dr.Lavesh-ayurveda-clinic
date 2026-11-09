'use client';

import React from 'react';
import Link from 'next/link';
import { Appointment } from '@/lib/services/appointments';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Printer,
  Share2,
  CalendarPlus,
  ShieldCheck,
  CheckCircle2,
  Video,
  Building,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface AppointmentVoucherProps {
  appointment: Appointment;
  onBookAnother?: () => void;
}

/**
 * Clean SVG QR Code matrix for the appointment token
 */
function AppointmentQRCode({ value }: { value: string }) {
  // Generates a deterministic, crisp 21x21 QR-like matrix for aesthetics
  return (
    <div className="w-28 h-28 p-2 bg-paper rounded-[3px] border border-forest/20 shadow-xs flex flex-col items-center justify-center shrink-0">
      <svg
        viewBox="0 0 25 25"
        className="w-full h-full text-deep-forest"
        fill="currentColor"
      >
        {/* Corner 1 */}
        <rect x="1" y="1" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="3" y="3" width="3" height="3" />
        {/* Corner 2 */}
        <rect x="17" y="1" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="19" y="3" width="3" height="3" />
        {/* Corner 3 */}
        <rect x="1" y="17" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="3" y="19" width="3" height="3" />
        {/* Data points */}
        <rect x="9" y="2" width="2" height="1" />
        <rect x="12" y="2" width="1" height="2" />
        <rect x="14" y="1" width="2" height="1" />
        <rect x="10" y="5" width="1" height="3" />
        <rect x="12" y="6" width="3" height="1" />
        <rect x="9" y="10" width="7" height="1" />
        <rect x="2" y="10" width="3" height="1" />
        <rect x="6" y="12" width="1" height="3" />
        <rect x="20" y="10" width="3" height="1" />
        <rect x="18" y="13" width="2" height="2" />
        <rect x="10" y="13" width="2" height="3" />
        <rect x="14" y="14" width="2" height="2" />
        <rect x="9" y="18" width="2" height="1" />
        <rect x="12" y="17" width="1" height="3" />
        <rect x="10" y="22" width="4" height="1" />
        <rect x="17" y="18" width="2" height="2" />
        <rect x="20" y="19" width="3" height="1" />
        <rect x="18" y="22" width="5" height="1" />
      </svg>
      <span className="font-mono text-[8px] text-forest/70 mt-1 uppercase">Scan at Desk</span>
    </div>
  );
}

export function AppointmentVoucher({
  appointment,
  onBookAnother,
}: AppointmentVoucherProps) {
  // Format Google Calendar URL
  const formatGoogleCalendarUrl = () => {
    const title = encodeURIComponent(
      `Aarogyam Ayurveda: ${appointment.serviceName} with ${appointment.doctorName}`
    );
    // Parse date and slot e.g. "2026-11-12" and "10:30 AM"
    const dateFormatted = appointment.date.replace(/-/g, '');
    const startTimeStr = appointment.slot.includes('PM') && !appointment.slot.startsWith('12')
      ? `${parseInt(appointment.slot.split(':')[0], 10) + 12}${appointment.slot.split(':')[1].replace(/\s?[AP]M/, '')}00`
      : `${appointment.slot.split(':')[0].padStart(2, '0')}${appointment.slot.split(':')[1].replace(/\s?[AP]M/, '')}00`;

    const startDateTime = `${dateFormatted}T${startTimeStr.padStart(6, '0')}`;
    // Add 45 mins for end time roughly
    const endDateTime = `${dateFormatted}T${(parseInt(startTimeStr, 10) + 4500).toString().padStart(6, '0')}`;

    const details = encodeURIComponent(
      `Appointment Token: ${appointment.tokenNumber}\nPatient: ${appointment.patientName}\nDoctor: ${appointment.doctorName}\nService: ${appointment.serviceName}\nMode: ${appointment.mode}\n\nPreparation: Please arrive 2.5 hours after food or fasting for accurate pulse reading.`
    );
    const location = encodeURIComponent(
      appointment.mode === 'in-clinic'
        ? 'Aarogyam Ayurveda Hospital, 14 Jacob Road, Civil Lines, Jaipur'
        : `Online Video Consult: https://meet.aarogyamayurveda.com/room/${appointment.tokenNumber}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
  };

  // Format WhatsApp Share text
  const formatWhatsAppShareUrl = () => {
    const text = encodeURIComponent(
      `Namaste, my Ayurvedic consultation at Aarogyam Ayurveda is confirmed!\n\n🏷️ Token: ${appointment.tokenNumber}\n🩺 Doctor: ${appointment.doctorName}\n📋 Service: ${appointment.serviceName}\n🗓️ Date: ${appointment.date} at ${appointment.slot}\n📍 Mode: ${appointment.mode === 'in-clinic' ? 'Civil Lines, Jaipur' : 'Online Video'}\n\nHospital Reg: AYUSH-RJ-2018-0482`
    );
    return `https://wa.me/?text=${text}`;
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Top Congratulatory Banner */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-forest text-paper mx-auto flex items-center justify-center shadow-md">
          <CheckCircle2 className="w-8 h-8 text-turmeric" />
        </div>
        <Badge variant="turmeric" className="mx-auto mt-2">
          Consultation Confirmed · टोकन पत्रम्
        </Badge>
        <h2 className="font-display text-2xl sm:text-3xl text-deep-forest font-medium">
          Your Healing Session is Scheduled
        </h2>
        <p className="font-body text-xs sm:text-sm text-ink/75 max-w-md mx-auto">
          A confirmation SMS and WhatsApp message have been dispatched to{' '}
          <span className="font-mono text-forest font-medium">{appointment.whatsappNumber}</span>.
        </p>
      </div>

      {/* The Printable Appointment Voucher Card */}
      <div
        id="appointment-voucher"
        className="bg-paper border-2 border-forest/30 rounded-[6px] p-6 sm:p-8 shadow-md relative overflow-hidden print:border-black print:shadow-none"
      >
        {/* Subtle Watermark */}
        <div className="absolute right-0 bottom-0 text-[140px] font-sanskrit text-forest/[0.03] select-none pointer-events-none translate-x-8 translate-y-8">
          आरोग्यम्
        </div>

        {/* Header of the Voucher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-forest/15">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-medium text-lg text-deep-forest">
                Aarogyam Ayurveda
              </span>
              <Badge variant="sage" className="text-[10px]">
                Hospital Reg: AYUSH-RJ-2018-0482
              </Badge>
            </div>
            <p className="font-mono text-xs text-ink/60 mt-0.5">
              14, Jacob Road, Civil Lines, Jaipur, Rajasthan 302006
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="font-mono text-[10px] uppercase text-forest/70 font-semibold block">
              Official Token
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-deep-forest tracking-wider">
              {appointment.tokenNumber}
            </span>
          </div>
        </div>

        {/* Voucher Body: 2 Columns with QR */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center border-b border-forest/15">
          <div className="sm:col-span-8 space-y-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-forest/70 font-medium block">
                Consultation Service
              </span>
              <h3 className="font-display text-lg text-deep-forest font-medium">
                {appointment.serviceName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-body">
              <div>
                <span className="font-mono text-[10px] text-ink/50 uppercase block">Physician</span>
                <span className="font-medium text-deep-forest">{appointment.doctorName}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-ink/50 uppercase block">Mode</span>
                <span className="font-medium text-forest flex items-center gap-1">
                  {appointment.mode === 'in-clinic' ? (
                    <>
                      <Building className="w-3.5 h-3.5 text-forest" />
                      In-Clinic (Jaipur)
                    </>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5 text-forest" />
                      Online Video Call
                    </>
                  )}
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-ink/50 uppercase block">Date</span>
                <span className="font-mono font-medium text-deep-forest">{appointment.date}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-ink/50 uppercase block">Time Slot</span>
                <span className="font-mono font-medium text-turmeric">{appointment.slot}</span>
              </div>
            </div>

            {/* Patient Meta */}
            <div className="pt-2 border-t border-forest/10 flex flex-wrap items-center gap-3 text-xs font-body text-ink/75">
              <span><strong>Patient:</strong> {appointment.patientName}</span>
              <span>•</span>
              <span>{appointment.age} yrs ({appointment.gender})</span>
              <span>•</span>
              <span className="font-mono">{appointment.whatsappNumber}</span>
            </div>
          </div>

          <div className="sm:col-span-4 flex flex-col items-center sm:items-end justify-center">
            <AppointmentQRCode value={appointment.tokenNumber} />
          </div>
        </div>

        {/* Nadi Pariksha Clinical Preparation Checklist */}
        <div className="pt-5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-deep-forest">
            <Sparkles className="w-3.5 h-3.5 text-turmeric" />
            <span>Pre-Consultation Instructions (नाड़ी परीक्षा पूर्व नियम):</span>
          </div>
          <ul className="text-xs font-body text-ink/75 space-y-1 list-disc pl-5">
            <li>Maintain fasting or a minimum 2.5-hour gap after a light meal for clear pulse diagnosis.</li>
            <li>Avoid caffeine, tea, cigarettes, and strenuous exercise prior to your appointment.</li>
            <li>Bring all past medical tests (CBC, MRI, thyroid, ultrasound) and active prescriptions.</li>
            {appointment.mode === 'online' && (
              <li>Video link will be active 10 minutes prior at: <span className="font-mono text-forest">meet.aarogyamayurveda.com/room/{appointment.tokenNumber}</span></li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Buttons: PDF Download, Google Calendar, WhatsApp Share */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={handlePrint}
          variant="primary"
          className="justify-center text-xs py-3 bg-forest hover:bg-deep-forest cursor-pointer"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Download / Print PDF
        </Button>

        <Button
          href={formatGoogleCalendarUrl()}
          variant="secondary"
          external
          className="justify-center text-xs py-3 border-forest/20 hover:border-forest/40"
        >
          <CalendarPlus className="w-4 h-4 mr-1.5 text-forest" />
          Add to Google Calendar
        </Button>

        <Button
          href={formatWhatsAppShareUrl()}
          variant="secondary"
          external
          className="justify-center text-xs py-3 border-forest/20 hover:border-forest/40"
        >
          <Share2 className="w-4 h-4 mr-1.5 text-forest" />
          Share on WhatsApp
        </Button>
      </div>

      {/* Book Another Link */}
      {onBookAnother && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBookAnother}
            className="text-xs font-mono text-forest hover:text-deep-forest underline underline-offset-4 cursor-pointer"
          >
            ← Schedule Another Appointment
          </button>
        </div>
      )}
    </div>
  );
}

