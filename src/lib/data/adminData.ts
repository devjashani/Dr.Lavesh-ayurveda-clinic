export interface AdminAppointmentQueueItem {
  id: string;
  tokenNumber: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  serviceName: string;
  doctorSlug: string;
  doctorName: string;
  mode: 'in-clinic' | 'online';
  slotTime: string;
  status: 'Waiting' | 'In Consultation' | 'Completed' | 'Upcoming';
  chiefComplaint: string;
  prakriti?: string;
}

export interface TherapySuiteRoom {
  id: string;
  name: string;
  sanskritName: string;
  type: 'Shirodhara' | 'Swedana Steam' | 'Basti Karma' | 'Abhyanga Suite';
  currentStatus: 'Occupied' | 'Available' | 'Sanitizing';
  currentPatient?: string;
  therapistName?: string;
  timeRemainingMinutes?: number;
  nextScheduledTime?: string;
}

export interface InpatientBed {
  bedNumber: string;
  roomType: 'Heritage Suite' | 'Deluxe AC' | 'Semi-Private';
  patientName: string;
  conditionTreated: string;
  admissionDate: string;
  plannedDischargeDate: string;
  dayOfPanchakarma: number;
  attendingPhysician: string;
  dietStage: 'Snehapana' | 'Virechana Peya' | 'Samsarjana Krama' | 'Normal Pathya';
}

export interface PharmacyStockItem {
  id: string;
  name: string;
  sanskritName: string;
  batchNumber: string;
  form: 'Kashayam' | 'Ghrita' | 'Taila' | 'Vati / Guggulu' | 'Churna';
  currentStock: string;
  stockUnit: string;
  minimumThreshold: string;
  status: 'Optimal' | 'Low Stock' | 'Critical Reorder';
  gmpCertified: boolean;
  icpmsHeavyMetalStatus: 'Passed (Safe)' | 'Pending Laboratory QC';
  leadPpm: number; // safe limit < 10 ppm
  mercuryPpm: number; // safe limit < 1 ppm
  mfgDate: string;
  expDate: string;
}

export interface AdminDashboardData {
  stats: {
    todayTotalAppointments: number;
    completedConsultations: number;
    waitingPatients: number;
    activeInpatientBeds: number;
    totalBeds: number;
    activeTherapySuites: number;
    totalTherapySuites: number;
    pharmacyLowStockCount: number;
    todayRevenueInr: number;
  };
  todayQueue: AdminAppointmentQueueItem[];
  therapySuites: TherapySuiteRoom[];
  inpatientBeds: InpatientBed[];
  pharmacyInventory: PharmacyStockItem[];
}

export const mockAdminData: AdminDashboardData = {
  stats: {
    todayTotalAppointments: 18,
    completedConsultations: 7,
    waitingPatients: 4,
    activeInpatientBeds: 8,
    totalBeds: 10,
    activeTherapySuites: 3,
    totalTherapySuites: 4,
    pharmacyLowStockCount: 2,
    todayRevenueInr: 38400,
  },
  todayQueue: [
    {
      id: 'apt-101',
      tokenNumber: 'AAR-2026-3510',
      patientName: 'Col. Vikramaditya Rathore',
      age: 54,
      gender: 'Male',
      phone: '+91 98290 14022',
      serviceName: 'Nadi Pariksha & Spine Care',
      doctorSlug: 'dr-aditya-bohra',
      doctorName: 'Dr. Aditya Bohra',
      mode: 'in-clinic',
      slotTime: '09:00 AM',
      status: 'In Consultation',
      chiefComplaint: 'Severe lumbar disc protrusion (L4-L5) with sciatic nerve radiation.',
      prakriti: 'Vata-Pitta',
    },
    {
      id: 'apt-102',
      tokenNumber: 'AAR-2026-3482',
      patientName: 'Smt. Meera R. Singhania',
      age: 48,
      gender: 'Female',
      phone: '+91 98290 44122',
      serviceName: 'Rheumatoid Arthritis Clinical Review',
      doctorSlug: 'dr-aditya-bohra',
      doctorName: 'Dr. Aditya Bohra',
      mode: 'in-clinic',
      slotTime: '09:45 AM',
      status: 'Waiting',
      chiefComplaint: 'Follow-up pulse check after 14-day Castor oil and Rasnadi decoction.',
      prakriti: 'Vata-Pitta',
    },
    {
      id: 'apt-103',
      tokenNumber: 'AAR-2026-3519',
      patientName: 'Ananya Deshmukh',
      age: 29,
      gender: 'Female',
      phone: '+91 94140 88219',
      serviceName: "Women's Health & PCOD Protocol",
      doctorSlug: 'dr-ananya-sharma',
      doctorName: 'Dr. Ananya Sharma',
      mode: 'online',
      slotTime: '10:00 AM',
      status: 'Waiting',
      chiefComplaint: 'Irregular cycles (45-day gaps), cystic acne, and weight stagnation.',
      prakriti: 'Kapha-Pitta',
    },
    {
      id: 'apt-104',
      tokenNumber: 'AAR-2026-3522',
      patientName: 'Harish Chandra Mathur',
      age: 63,
      gender: 'Male',
      phone: '+91 98290 55198',
      serviceName: 'Psoriasis & Skin Detoxification',
      doctorSlug: 'dr-aditya-bohra',
      doctorName: 'Dr. Aditya Bohra',
      mode: 'in-clinic',
      slotTime: '10:30 AM',
      status: 'Waiting',
      chiefComplaint: 'Bilateral elbow plaque scaling; preparing for Virechana bio-cleansing.',
      prakriti: 'Pitta-Kapha',
    },
    {
      id: 'apt-105',
      tokenNumber: 'AAR-2026-3525',
      patientName: 'Devika Singhania',
      age: 41,
      gender: 'Female',
      phone: '+91 98201 33419',
      serviceName: 'Chronic Insomnia & Shirodhara Intake',
      doctorSlug: 'dr-aditya-bohra',
      doctorName: 'Dr. Aditya Bohra',
      mode: 'in-clinic',
      slotTime: '11:15 AM',
      status: 'Upcoming',
      chiefComplaint: 'Autonomic nervous exhaustion, severe sleep latency (>90 mins).',
      prakriti: 'Vata-Pitta',
    },
    {
      id: 'apt-106',
      tokenNumber: 'AAR-2026-3530',
      patientName: 'Sanjay K. Bhandari',
      age: 52,
      gender: 'Male',
      phone: '+91 98791 22891',
      serviceName: 'Ulcerative Colitis & IBS (Grahani)',
      doctorSlug: 'dr-aditya-bohra',
      doctorName: 'Dr. Aditya Bohra',
      mode: 'online',
      slotTime: '12:00 PM',
      status: 'Upcoming',
      chiefComplaint: 'Stool frequency down to 2 times daily; reviewing Takra therapy progress.',
      prakriti: 'Pitta-Vata',
    },
    {
      id: 'apt-100',
      tokenNumber: 'AAR-2026-3470',
      patientName: 'Rajesh K. Singhal',
      age: 56,
      gender: 'Male',
      phone: '+91 98290 11982',
      serviceName: 'Knee Osteoarthritis (Janu Sandhigata Vata)',
      doctorSlug: 'dr-aditya-bohra',
      doctorName: 'Dr. Aditya Bohra',
      mode: 'in-clinic',
      slotTime: '08:30 AM',
      status: 'Completed',
      chiefComplaint: 'Post-Janu Basti joint mobility check. VAS pain reduced to 2/10.',
      prakriti: 'Vata Predominant',
    },
  ],
  therapySuites: [
    {
      id: 'suite-1',
      name: 'Shirodhara Suite 1 (Brahmi Vana)',
      sanskritName: 'शिरोधरा कक्ष — १',
      type: 'Shirodhara',
      currentStatus: 'Occupied',
      currentPatient: 'Devika Singhania',
      therapistName: 'Mukesh Gurjar',
      timeRemainingMinutes: 20,
      nextScheduledTime: '11:30 AM',
    },
    {
      id: 'suite-2',
      name: 'Steam & Snehana Chamber',
      sanskritName: 'स्नेहन-स्वेदन कक्ष — २',
      type: 'Swedana Steam',
      currentStatus: 'Sanitizing',
      nextScheduledTime: '10:45 AM (Col. Vikramaditya)',
    },
    {
      id: 'suite-3',
      name: 'Kati & Janu Basti Suite',
      sanskritName: 'बस्ति कर्म कक्ष — ३',
      type: 'Basti Karma',
      currentStatus: 'Occupied',
      currentPatient: 'Rajeshwari Devi (Janu Basti)',
      therapistName: 'Ramesh Kumawat',
      timeRemainingMinutes: 15,
      nextScheduledTime: '11:15 AM',
    },
    {
      id: 'suite-4',
      name: 'Abhyanga & Marma Therapy Suite',
      sanskritName: 'अभ्यङ्ग एवं मर्म कक्ष — ४',
      type: 'Abhyanga Suite',
      currentStatus: 'Available',
      nextScheduledTime: '11:00 AM',
    },
  ],
  inpatientBeds: [
    {
      bedNumber: 'Suite 101',
      roomType: 'Heritage Suite',
      patientName: 'Harish Chandra Mathur (63 yrs)',
      conditionTreated: 'Chronic Plaque Psoriasis (Kitibha Kushta)',
      admissionDate: '01 Nov 2026',
      plannedDischargeDate: '21 Nov 2026',
      dayOfPanchakarma: 9,
      attendingPhysician: 'Dr. Aditya Bohra',
      dietStage: 'Virechana Peya',
    },
    {
      bedNumber: 'Suite 102',
      roomType: 'Heritage Suite',
      patientName: 'Devika Singhania (41 yrs)',
      conditionTreated: 'Severe Autonomic Insomnia (Anidra)',
      admissionDate: '05 Nov 2026',
      plannedDischargeDate: '15 Nov 2026',
      dayOfPanchakarma: 5,
      attendingPhysician: 'Dr. Aditya Bohra',
      dietStage: 'Normal Pathya',
    },
    {
      bedNumber: 'Deluxe 201',
      roomType: 'Deluxe AC',
      patientName: 'Smt. Rajeshwari Devi (67 yrs)',
      conditionTreated: 'Bilateral Knee Osteoarthritis',
      admissionDate: '03 Nov 2026',
      plannedDischargeDate: '17 Nov 2026',
      dayOfPanchakarma: 7,
      attendingPhysician: 'Dr. Aditya Bohra',
      dietStage: 'Snehapana',
    },
    {
      bedNumber: 'Deluxe 202',
      roomType: 'Deluxe AC',
      patientName: 'Nitin J. Chawla (46 yrs)',
      conditionTreated: 'Fatty Liver & Metabolic Detox',
      admissionDate: '06 Nov 2026',
      plannedDischargeDate: '13 Nov 2026',
      dayOfPanchakarma: 4,
      attendingPhysician: 'Dr. Aditya Bohra',
      dietStage: 'Snehapana',
    },
  ],
  pharmacyInventory: [
    {
      id: 'pharma-1',
      name: 'Brahmi Taila (Medicated Sesame Oil)',
      sanskritName: 'ब्राह्मी तैलम्',
      batchNumber: 'BT-2026-09',
      form: 'Taila',
      currentStock: '24',
      stockUnit: 'Litres',
      minimumThreshold: '10 Litres',
      status: 'Optimal',
      gmpCertified: true,
      icpmsHeavyMetalStatus: 'Passed (Safe)',
      leadPpm: 0.12,
      mercuryPpm: 0.02,
      mfgDate: '10 Sep 2026',
      expDate: 'Sep 2029',
    },
    {
      id: 'pharma-2',
      name: 'Guggulutikta Ghrita (A2 Cow Ghee)',
      sanskritName: 'गुग्गुलुतिक्त घृतम्',
      batchNumber: 'GTG-2026-14',
      form: 'Ghrita',
      currentStock: '18',
      stockUnit: 'Litres',
      minimumThreshold: '8 Litres',
      status: 'Optimal',
      gmpCertified: true,
      icpmsHeavyMetalStatus: 'Passed (Safe)',
      leadPpm: 0.08,
      mercuryPpm: 0.01,
      mfgDate: '04 Oct 2026',
      expDate: 'Oct 2028',
    },
    {
      id: 'pharma-3',
      name: 'Simhanada Guggulu Tablets (Purified Castor + Triphala)',
      sanskritName: 'सिंहनाद गुग्गुलु',
      batchNumber: 'SG-2026-03',
      form: 'Vati / Guggulu',
      currentStock: '850',
      stockUnit: 'Tablets',
      minimumThreshold: '1,500 Tablets',
      status: 'Low Stock',
      gmpCertified: true,
      icpmsHeavyMetalStatus: 'Passed (Safe)',
      leadPpm: 0.45,
      mercuryPpm: 0.05,
      mfgDate: '12 Aug 2026',
      expDate: 'Aug 2029',
    },
    {
      id: 'pharma-4',
      name: 'Rasnadi Kashayam Concentrated Decoction',
      sanskritName: 'रास्नादि कषायम्',
      batchNumber: 'RK-2026-18',
      form: 'Kashayam',
      currentStock: '32',
      stockUnit: 'Bottles (450ml)',
      minimumThreshold: '15 Bottles',
      status: 'Optimal',
      gmpCertified: true,
      icpmsHeavyMetalStatus: 'Passed (Safe)',
      leadPpm: 0.15,
      mercuryPpm: 0.03,
      mfgDate: '28 Sep 2026',
      expDate: 'Sep 2029',
    },
    {
      id: 'pharma-5',
      name: 'Kottamchukkadi Taila for External Oleation',
      sanskritName: 'कोट्टञ्चुक्कादि तैलम्',
      batchNumber: 'KT-2026-07',
      form: 'Taila',
      currentStock: '6',
      stockUnit: 'Litres',
      minimumThreshold: '12 Litres',
      status: 'Low Stock',
      gmpCertified: true,
      icpmsHeavyMetalStatus: 'Passed (Safe)',
      leadPpm: 0.22,
      mercuryPpm: 0.04,
      mfgDate: '15 Aug 2026',
      expDate: 'Aug 2029',
    },
  ],
};

