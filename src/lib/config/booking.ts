import { Video } from 'lucide-react';

export interface BookingServiceConfig {
  id: string;
  name: string;
  sanskrit: string;
  category: string;
  tagline: string;
  duration: string;
  feeInr: number;
  feePaise: number;
  icon?: any;
}

export const BOOKING_SERVICE: BookingServiceConfig = {
  id: 'video-consultation',
  name: 'Video Consultation',
  sanskrit: 'વિડિયો પરામર્શ',
  category: 'Clinical Consultation',
  tagline: 'Direct one-on-one Ayurvedic consultation with personalized clinical evaluation and lifestyle guidance.',
  duration: '30 Mins',
  feeInr: 499,
  feePaise: 49900,
  icon: Video,
};

export const BOOKING_SERVICES: BookingServiceConfig[] = [BOOKING_SERVICE];

export const MIN_LEAD_MINUTES = 60;
export const DOCTOR_NAME = 'Dr. Lavesh Bohra';
export const DOCTOR_ID = 'dr-lavesh-bohra';

export const BOOKING_CONFIG = {
  minLeadMinutes: MIN_LEAD_MINUTES,
  doctorName: DOCTOR_NAME,
  doctorId: DOCTOR_ID,
  service: BOOKING_SERVICE,
} as const;

export interface BookingDraft {
  serviceId: string;
  serviceName: string;
  fee: number;
  feePaise: number;
  doctorId: string;
  doctorName: string;
  mode: 'online';
  date: string;
  slotStart: string;
  slotEnd: string;
  slotLabel: string;
  patientName: string;
  patientWhatsapp: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  primaryComplaint: string;
  reportFileIds: string[];
  reportFileNames: string[];
  createdAt: string;
}
