export interface PatientPrescription {
  id: string;
  name: string;
  sanskritName: string;
  form: 'Kashayam (Decoction)' | 'Ghrita (Medicated Ghee)' | 'Vati / Gutika (Tablet)' | 'Taila (Oil)' | 'Churna (Powder)';
  dosage: string;
  timing: 'Before Meals' | 'After Meals' | 'At Bedtime' | 'Sunrise on Empty Stomach';
  anupana: string; // Carrier liquid e.g. "Warm water", "A2 Cow Milk with Ginger"
  durationDays: number;
  daysRemaining: number;
  refillEligible: boolean;
  instructions: string;
}

export interface PulseReading {
  date: string;
  recordedBy: string;
  dominantGati: string; // e.g. "Sarpa (Cobra - Vata)", "Manduka (Frog - Pitta)", "Hamsa (Swan - Kapha)"
  vataPercent: number;
  pittaPercent: number;
  kaphaPercent: number;
  agniStatus: 'Mandagni' | 'Vishamagni' | 'Tikshnagni' | 'Samagni';
  amaPresence: 'Mild' | 'Moderate' | 'Severe' | 'None';
  dhatuInvolvement: string[];
  clinicalNotes: string;
}

export interface PanchakarmaSession {
  dayNumber: number;
  date: string;
  procedureName: string;
  therapistName: string;
  durationMinutes: number;
  status: 'Completed' | 'Scheduled' | 'In Progress';
  observations: string;
}

export interface PatientPortalData {
  patientId: string;
  fullName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: string;
  contactNumber: string;
  email: string;
  address: string;
  attendingPhysician: string;
  physicianSlug: string;
  ayushRegistrationNo: string;
  primaryDiagnosis: string;
  sanskritDiagnosis: string;
  prakriti: string;
  vikriti: string;
  adherenceScorePercent: number;
  nextAppointmentDate: string;
  nextAppointmentTime: string;
  nextAppointmentMode: 'In-Clinic Nadi Pariksha' | 'Video Follow-Up';
  pulseHistory: PulseReading[];
  prescriptions: PatientPrescription[];
  panchakarmaSchedule: PanchakarmaSession[];
  dietGuidelines: {
    favor: string[];
    avoid: string[];
    generalPathya: string;
  };
}

export const mockPatientData: PatientPortalData = {
  patientId: 'ARG-2026-8841',
  fullName: 'Meera R. Singhania',
  age: 48,
  gender: 'Female',
  bloodGroup: 'B Positive',
  contactNumber: '+91 98290 44122',
  email: 'meera.singhania@example.com',
  address: 'B-12, Tilak Nagar, Jaipur, Rajasthan',
  attendingPhysician: 'Dr. Lavesh Bohra',
  physicianSlug: 'dr-lavesh-bohra',
  ayushRegistrationNo: '',
  primaryDiagnosis: 'Rheumatoid Arthritis with Synovial Effusion',
  sanskritDiagnosis: 'આમવાત — રસ-અસ્થિ ધાતુગત સામ વાત',
  prakriti: 'Vata-Pitta (વાત-પિત્ત)',
  vikriti: 'Vata-Kapha with Deep Ama (સામ કફ-વાત પ્રકોપ)',
  adherenceScorePercent: 92,
  nextAppointmentDate: '16 Nov 2026',
  nextAppointmentTime: '10:30 AM',
  nextAppointmentMode: 'In-Clinic Nadi Pariksha',
  pulseHistory: [
    {
      date: '02 Nov 2026',
      recordedBy: 'Dr. Lavesh Bohra',
      dominantGati: 'Sarpa-Manduka Gati (Rapid serpentine pulse with sharp Pitta spikes)',
      vataPercent: 48,
      pittaPercent: 34,
      kaphaPercent: 18,
      agniStatus: 'Vishamagni',
      amaPresence: 'Moderate',
      dhatuInvolvement: ['Rasa (Plasma)', 'Asthi (Bone)', 'Majja (Nerve/Marrow)'],
      clinicalNotes: 'Significant reduction in wrist joint heat following 7-day Castor oil decoction. Morning stiffness reduced from 90 mins to 25 mins. Continue Snehana.',
    },
    {
      date: '18 Oct 2026',
      recordedBy: 'Dr. Lavesh Bohra',
      dominantGati: 'Kathina Manduka Gati (Stiff, bounding inflammatory pulse with high resistance)',
      vataPercent: 62,
      pittaPercent: 26,
      kaphaPercent: 12,
      agniStatus: 'Mandagni',
      amaPresence: 'Severe',
      dhatuInvolvement: ['Rasa (Lymphatic)', 'Rakta (Blood)', 'Asthi (Bone)'],
      clinicalNotes: 'Initial diagnostic baseline. Bilateral wrist and MCP joint effusion. ESR 68 mm/hr. Commencing Purva Karma with Shunthi Kashayam and Chitrakadi Vati.',
    },
  ],
  prescriptions: [
    {
      id: 'rx-1',
      name: 'Rasnadi Kashayam (Classical Decoction)',
      sanskritName: 'રાસ્નાદિ કષાયમ્',
      form: 'Kashayam (Decoction)',
      dosage: '15 ml decoction mixed with 45 ml lukewarm boiled water',
      timing: 'Before Meals',
      anupana: 'Warm water with a pinch of Dry Ginger powder (Shunthi)',
      durationDays: 30,
      daysRemaining: 18,
      refillEligible: false,
      instructions: 'Take twice daily at 7:30 AM and 6:30 PM on an empty stomach. Kindles Agni and digests microvascular Ama.',
    },
    {
      id: 'rx-2',
      name: 'Simhanada Guggulu Tablets',
      sanskritName: 'સિંહનાદ ગુગ્ગુલુ',
      form: 'Vati / Gutika (Tablet)',
      dosage: '2 tablets twice daily',
      timing: 'After Meals',
      anupana: 'Warm water or Dashamoola decoction',
      durationDays: 30,
      daysRemaining: 18,
      refillEligible: true,
      instructions: 'Contains Purified Castor Oil (Eranda) and Triphala. Mobilizes joint toxins into the bowel.',
    },
    {
      id: 'rx-3',
      name: 'Guggulutikta Ghrita (Medicated Ghee)',
      sanskritName: 'ગુગ્ગુલુતિક્ત ઘૃતમ્',
      form: 'Ghrita (Medicated Ghee)',
      dosage: '10 ml warm liquid ghee',
      timing: 'Sunrise on Empty Stomach',
      anupana: 'Sip hot water continuously for 1 hour after ingestion',
      durationDays: 14,
      daysRemaining: 4,
      refillEligible: true,
      instructions: 'Deep tissue lipid oleation (Snehapana). Do not consume any cold food or drinks throughout the day.',
    },
    {
      id: 'rx-4',
      name: 'Kottamchukkadi Taila for External Warm Application',
      sanskritName: 'કોટ્ટઞ્ચુક્કાદિ તૈલમ્',
      form: 'Taila (Oil)',
      dosage: '25 ml gently warmed in a water bath',
      timing: 'Before Meals',
      anupana: 'External application followed by hot water fomentation',
      durationDays: 45,
      daysRemaining: 32,
      refillEligible: false,
      instructions: 'Apply gently over painful wrist, elbow and knee joints in direction of hair follicles. Do not massage vigorously.',
    },
  ],
  panchakarmaSchedule: [
    {
      dayNumber: 1,
      date: '04 Nov 2026',
      procedureName: 'Snehapana (Ascending Ghee Oleation Day 1)',
      therapistName: 'Ayurvedic Practitioner',
      durationMinutes: 45,
      status: 'Completed',
      observations: 'Ingested 30 ml Guggulutikta Ghrita. Digested in 3.5 hours. No nausea.',
    },
    {
      dayNumber: 2,
      date: '05 Nov 2026',
      procedureName: 'Snehapana (Day 2 - 60 ml) + Sarvanga Abhyanga',
      therapistName: 'Ayurvedic Practitioner',
      durationMinutes: 60,
      status: 'Completed',
      observations: 'Slight belching with ghee smell for 4 hours. Appetite returned at 1:30 PM.',
    },
    {
      dayNumber: 3,
      date: '06 Nov 2026',
      procedureName: 'Patra Pinda Swedana (Medicinal Leaf Bolus Fomentation)',
      therapistName: 'Ayurvedic Practitioner',
      durationMinutes: 50,
      status: 'Completed',
      observations: 'Excellent sweat induction. Marked loosening of cervical and wrist stiffness.',
    },
    {
      dayNumber: 4,
      date: '08 Nov 2026',
      procedureName: 'Virechana Karma (Therapeutic Herbal Purgation)',
      therapistName: 'Ayurvedic Practitioner',
      durationMinutes: 180,
      status: 'Completed',
      observations: 'Optimal Pitta-Kapha evacuation (12 Vegas achieved). Samsarjana Krama initiated.',
    },
    {
      dayNumber: 5,
      date: '10 Nov 2026',
      procedureName: 'Matra Basti (Medicated Enema Retention)',
      therapistName: 'Ayurvedic Practitioner',
      durationMinutes: 40,
      status: 'In Progress',
      observations: 'Administering 60 ml Sahacharadi Taila. Retention target: > 3 hours.',
    },
    {
      dayNumber: 6,
      date: '12 Nov 2026',
      procedureName: 'Shirodhara (Calming Medicated Stream)',
      therapistName: 'Ayurvedic Practitioner',
      durationMinutes: 45,
      status: 'Scheduled',
      observations: 'Scheduled to down-regulate neurogenic inflammation.',
    },
  ],
  dietGuidelines: {
    favor: [
      'Old harvested Basmati rice and red rice (Shashtika Shali)',
      'Warm Green gram (Mudga / Moong dal) soup with cumin and rock salt',
      'Boiled vegetables: Bottle gourd (Lauki), Ridge gourd (Turai), Drumstick (Shigru)',
      'Spices: Fresh ginger (Zingiber officinale), Cumin, Ajwain, Black pepper, Turmeric, Garlic in moderation',
      'Warm water boiled with dried ginger and coriander seeds for daily hydration',
    ],
    avoid: [
      'Cold, refrigerated water, ice creams, and carbonated sodas',
      'Heavy, fermented foods: Curd (Yogurt), Idli/Dosa batter, bread, aged cheeses',
      'Nightshade vegetables: Tomatoes, Eggplant (Brinjal), Raw bell peppers',
      'Deep-fried snacks, refined white flour (Maida), and artificial sweeteners',
      'Daytime sleeping (Divaswapna), which drastically aggravates Kapha and Ama',
    ],
    generalPathya:
      'Consume lunch as your primary meal between 12:00 PM and 1:30 PM. Keep dinner very light, soupy, and finish before 7:30 PM. Always sip warm water throughout the day to keep channels open.',
  },
};

