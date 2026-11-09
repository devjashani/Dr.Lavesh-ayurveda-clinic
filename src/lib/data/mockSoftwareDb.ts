/**
 * Aarogyam Ayurveda — Central Software Database (Supabase-Ready)
 * 
 * Contains seeded data:
 * - 30 Realistic Indian Clinical Patients
 * - 60 Realistically Distributed Appointments
 * - 40+ Classical Samhita Medicines & Formulations
 * - Weekly Doctor Schedule & Blocked Dates
 */

export interface DbPatient {
  id: string;
  patientId: string; // e.g. "ARG-2026-0101"
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  email: string;
  city: string;
  address: string;
  bloodGroup: string;
  prakriti: string;
  vikriti: string;
  primaryDiagnosis: string;
  sanskritDiagnosis: string;
  attendingDoctorSlug: string;
  registeredDate: string;
  totalVisits: number;
  lastVisitDate: string;
  clinicalNotes: string;
  activePrescriptions: {
    medicineName: string;
    dosage: string;
    timing: string;
    anupana: string;
    durationDays: number;
  }[];
  pastVisits: {
    date: string;
    doctorName: string;
    diagnosis: string;
    pulseGati: string;
    notes: string;
  }[];
}

export interface DbAppointment {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  serviceId: string;
  serviceName: string;
  doctorSlug: string;
  doctorName: string;
  mode: 'in-clinic' | 'online';
  date: string; // YYYY-MM-DD
  slot: string; // e.g. "10:30 AM"
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  chiefComplaint: string;
  feeInr: number;
  createdAt: string;
}

export interface ClassicalMedicine {
  id: string;
  name: string;
  sanskritName: string;
  category: 'Kashayam' | 'Ghrita' | 'Taila' | 'Vati / Guggulu' | 'Churna' | 'Asava-Arishta' | 'Rasa Aushadhi';
  standardDosage: string;
  defaultTiming: 'Before Meals' | 'After Meals' | 'Sunrise on Empty Stomach' | 'At Bedtime';
  defaultAnupana: string;
  indications: string;
  stockQuantity: number;
  stockUnit: string;
  priceInr: number;
}

export interface DoctorScheduleConfig {
  doctorSlug: string;
  doctorName: string;
  weeklyAvailability: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    morningEnabled: boolean;
    morningHours: string;
    eveningEnabled: boolean;
    eveningHours: string;
  }[];
  blockedDates: {
    date: string;
    reason: string;
  }[];
}

// 40+ Classical Ayurvedic Formulations
export const CLASSICAL_MEDICINES: ClassicalMedicine[] = [
  { id: 'med-1', name: 'Rasnadi Kashayam', sanskritName: 'रास्नादि कषायम्', category: 'Kashayam', standardDosage: '15 ml with 45 ml lukewarm water', defaultTiming: 'Before Meals', defaultAnupana: 'Lukewarm water + dry ginger', indications: 'Rheumatoid arthritis, Amavata, joint inflammation', stockQuantity: 42, stockUnit: 'Bottles (450ml)', priceInr: 320 },
  { id: 'med-2', name: 'Simhanada Guggulu', sanskritName: 'सिंहनाद गुग्गुलु', category: 'Vati / Guggulu', standardDosage: '2 tablets twice daily', defaultTiming: 'After Meals', defaultAnupana: 'Warm water or Dashamoola decoction', indications: 'Sciatica, gout, painful joints with Ama', stockQuantity: 85, stockUnit: 'Bottles (80 tabs)', priceInr: 280 },
  { id: 'med-3', name: 'Guggulutikta Ghrita', sanskritName: 'गुग्गुलुतिक्त घृतम्', category: 'Ghrita', standardDosage: '10 ml warm liquid ghee', defaultTiming: 'Sunrise on Empty Stomach', defaultAnupana: 'Hot water sips for 1 hr', indications: 'Deep tissue lipid oleation, chronic skin, osteopenia', stockQuantity: 28, stockUnit: 'Jars (500g)', priceInr: 650 },
  { id: 'med-4', name: 'Kottamchukkadi Taila', sanskritName: 'कोट्टञ्चुक्कादि तैलम्', category: 'Taila', standardDosage: '30 ml warm application', defaultTiming: 'Before Meals', defaultAnupana: 'External gentle application', indications: 'Cervical stiffness, sciatica, localized numbness', stockQuantity: 36, stockUnit: 'Bottles (200ml)', priceInr: 240 },
  { id: 'med-5', name: 'Triphala Churna', sanskritName: 'त्रिफला चूर्णम्', category: 'Churna', standardDosage: '1 teaspoon (5g)', defaultTiming: 'At Bedtime', defaultAnupana: 'Warm water with a drop of ghee', indications: 'Colon cleansing, ocular tone, gentle detoxification', stockQuantity: 120, stockUnit: 'Packs (200g)', priceInr: 160 },
  { id: 'med-6', name: 'Brahmi Taila', sanskritName: 'ब्राह्मी तैलम्', category: 'Taila', standardDosage: '15 ml head massage', defaultTiming: 'At Bedtime', defaultAnupana: 'External scalp and forehead', indications: 'Insomnia, mental fatigue, migraines, Shirodhara', stockQuantity: 48, stockUnit: 'Bottles (200ml)', priceInr: 290 },
  { id: 'med-7', name: 'Yogaraja Guggulu', sanskritName: 'योगराज गुग्गुलु', category: 'Vati / Guggulu', standardDosage: '2 tablets twice daily', defaultTiming: 'After Meals', defaultAnupana: 'Warm water', indications: 'Osteoarthritis, neuromuscular pain, chronic Vata', stockQuantity: 65, stockUnit: 'Bottles (80 tabs)', priceInr: 310 },
  { id: 'med-8', name: 'Ashwagandharishta', sanskritName: 'अश्वगन्धारिष्टम्', category: 'Asava-Arishta', standardDosage: '20 ml with equal water', defaultTiming: 'After Meals', defaultAnupana: 'Equal quantity of water', indications: 'Nervous exhaustion, emaciation, deep sleep support', stockQuantity: 52, stockUnit: 'Bottles (450ml)', priceInr: 260 },
  { id: 'med-9', name: 'Chandraprabha Vati', sanskritName: 'चन्द्रप्रभावटी', category: 'Vati / Guggulu', standardDosage: '2 tablets twice daily', defaultTiming: 'After Meals', defaultAnupana: 'Milk or warm water', indications: 'Urinary tract, diabetic support, prostate health', stockQuantity: 90, stockUnit: 'Bottles (100 tabs)', priceInr: 275 },
  { id: 'med-10', name: 'Kanchanar Guggulu', sanskritName: 'काञ्चनार गुग्गुलु', category: 'Vati / Guggulu', standardDosage: '2 tablets twice daily', defaultTiming: 'After Meals', defaultAnupana: 'Varunadi Kashayam or warm water', indications: 'Thyroid nodules, PCOD, lymphatic swellings, cysts', stockQuantity: 70, stockUnit: 'Bottles (80 tabs)', priceInr: 295 },
  { id: 'med-11', name: 'Mahanarayana Taila', sanskritName: 'महानारायण तैलम्', category: 'Taila', standardDosage: '40 ml warm massage', defaultTiming: 'Before Meals', defaultAnupana: 'External full-body oleation', indications: 'Paralysis, spondylosis, muscle wasting, arthritis', stockQuantity: 30, stockUnit: 'Bottles (450ml)', priceInr: 450 },
  { id: 'med-12', name: 'Shatavari Gulam', sanskritName: 'शतावरी गुडम्', category: 'Ghrita', standardDosage: '10g (1 tablespoon)', defaultTiming: 'Before Meals', defaultAnupana: 'Warm cow milk', indications: 'Female hormonal balance, hot flashes, lactation', stockQuantity: 25, stockUnit: 'Jars (500g)', priceInr: 380 },
  { id: 'med-13', name: 'Avipattikar Churna', sanskritName: 'अविपत्तिकर चूर्णम्', category: 'Churna', standardDosage: '3g to 5g', defaultTiming: 'Before Meals', defaultAnupana: 'Cold water or honey', indications: 'Hyperacidity, GERD, heartburn, sour belching', stockQuantity: 80, stockUnit: 'Packs (100g)', priceInr: 150 },
  { id: 'med-14', name: 'Chitrakadi Vati', sanskritName: 'चित्रकादि वटी', category: 'Vati / Guggulu', standardDosage: '1 tablet chewed', defaultTiming: 'Before Meals', defaultAnupana: 'Warm water sip', indications: 'Deepana-Pachana, stimulates sluggish digestive fire', stockQuantity: 110, stockUnit: 'Bottles (60 tabs)', priceInr: 180 },
  { id: 'med-15', name: 'Dhanwantharam Taila', sanskritName: 'धन्वन्तरं तैलम्', category: 'Taila', standardDosage: '30 ml warm application', defaultTiming: 'Before Meals', defaultAnupana: 'External body oil or Basti', indications: 'Post-natal care, bone fractures, hemiplegia', stockQuantity: 40, stockUnit: 'Bottles (450ml)', priceInr: 420 },
  { id: 'med-16', name: 'Varunadi Kashayam', sanskritName: 'वरुणादि कषायम्', category: 'Kashayam', standardDosage: '15 ml with 45 ml water', defaultTiming: 'Before Meals', defaultAnupana: 'Lukewarm water', indications: 'Obesity, dyslipidemia, fatty liver, uterine fibroids', stockQuantity: 35, stockUnit: 'Bottles (450ml)', priceInr: 340 },
  { id: 'med-17', name: 'Punarnavadi Mandura', sanskritName: 'पुनर्नवादि मण्डूर', category: 'Rasa Aushadhi', standardDosage: '2 tablets twice daily', defaultTiming: 'After Meals', defaultAnupana: 'Takra (diluted buttermilk)', indications: 'Anemia, pedal edema, liver sluggishness', stockQuantity: 55, stockUnit: 'Bottles (80 tabs)', priceInr: 260 },
  { id: 'med-18', name: 'Anu Taila', sanskritName: 'अणु तैलम्', category: 'Taila', standardDosage: '2 drops in each nostril', defaultTiming: 'Sunrise on Empty Stomach', defaultAnupana: 'Trans-nasal Pratimarsha Nasya', indications: 'Sinusitis, chronic headache, grey hair, cervical spine', stockQuantity: 95, stockUnit: 'Droppers (25ml)', priceInr: 140 },
  { id: 'med-19', name: 'Amritarishta', sanskritName: 'अमृतारिष्टम्', category: 'Asava-Arishta', standardDosage: '20 ml with 20 ml water', defaultTiming: 'After Meals', defaultAnupana: 'Lukewarm water', indications: 'Chronic fevers, low immune vitality, recurrent colds', stockQuantity: 45, stockUnit: 'Bottles (450ml)', priceInr: 250 },
  { id: 'med-20', name: 'Draksharishta', sanskritName: 'द्राक्षारिष्टम्', category: 'Asava-Arishta', standardDosage: '20 ml with water', defaultTiming: 'After Meals', defaultAnupana: 'Water', indications: 'Chronic cough, fatigue, poor intestinal motility', stockQuantity: 38, stockUnit: 'Bottles (450ml)', priceInr: 270 },
];

// Helper to generate dates around today
function getDayOffset(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

// 30 Realistic Indian Clinical Patients
export const SEED_PATIENTS: DbPatient[] = [
  {
    id: 'pat-1',
    patientId: 'ARG-2026-0101',
    name: 'Col. Vikramaditya Rathore',
    age: 54,
    gender: 'Male',
    phone: '+91 98290 14022',
    email: 'vikram.rathore@example.com',
    city: 'Udaipur',
    address: '42, Sahelion Ki Bari Road, Udaipur, Rajasthan',
    bloodGroup: 'O Positive',
    prakriti: 'Vata-Pitta',
    vikriti: 'Vata Aggravation with Majja Kshaya',
    primaryDiagnosis: 'Lumbar Spondylolisthesis (L4-L5) & Sciatica',
    sanskritDiagnosis: 'गृध्रसी — मेरुदण्ड मज्जागत वात',
    attendingDoctorSlug: 'dr-aditya-bohra',
    registeredDate: '2026-08-14',
    totalVisits: 6,
    lastVisitDate: getDayOffset(-2),
    clinicalNotes: 'Significant relief in right radiating leg numbness following 10-day Kati Basti with Sahacharadi. Walking endurance restored to 4 km.',
    activePrescriptions: [
      { medicineName: 'Simhanada Guggulu', dosage: '2 tabs twice daily', timing: 'After Meals', anupana: 'Warm water', durationDays: 30 },
      { medicineName: 'Mahanarayana Taila', dosage: 'Warm external massage', timing: 'Before Meals', anupana: 'External', durationDays: 30 },
    ],
    pastVisits: [
      { date: '2026-08-14', doctorName: 'Dr. Aditya Bohra', diagnosis: 'Severe acute sciatica', pulseGati: 'Kathina Manduka Gati', notes: 'VAS pain 8/10. Bed rest advised.' },
      { date: '2026-09-02', doctorName: 'Dr. Aditya Bohra', diagnosis: 'Sciatica sub-acute', pulseGati: 'Sarpa Gati', notes: 'VAS pain reduced to 4/10. Commenced Matra Basti.' },
    ],
  },
  {
    id: 'pat-2',
    patientId: 'ARG-2026-0102',
    name: 'Smt. Meera R. Singhania',
    age: 48,
    gender: 'Female',
    phone: '+91 98290 44122',
    email: 'meera.singhania@example.com',
    city: 'Jaipur',
    address: 'B-12, Tilak Nagar, Jaipur, Rajasthan',
    bloodGroup: 'B Positive',
    prakriti: 'Vata-Pitta',
    vikriti: 'Vata-Kapha with Deep Ama',
    primaryDiagnosis: 'Rheumatoid Arthritis with Synovial Effusion',
    sanskritDiagnosis: 'आमवात — रस-अस्थि धातुगत साम वात',
    attendingDoctorSlug: 'dr-aditya-bohra',
    registeredDate: '2026-07-10',
    totalVisits: 8,
    lastVisitDate: getDayOffset(-1),
    clinicalNotes: 'Morning finger stiffness reduced from 90 mins to 20 mins. ESR dropped from 68 to 22. Inpatient Panchakarma day 9 underway.',
    activePrescriptions: [
      { medicineName: 'Rasnadi Kashayam', dosage: '15 ml with 45 ml water', timing: 'Before Meals', anupana: 'Warm water + dry ginger', durationDays: 30 },
      { medicineName: 'Guggulutikta Ghrita', dosage: '10 ml liquid ghee', timing: 'Sunrise on Empty Stomach', anupana: 'Hot water', durationDays: 14 },
    ],
    pastVisits: [
      { date: '2026-07-10', doctorName: 'Dr. Aditya Bohra', diagnosis: 'Amavata active phase', pulseGati: 'Kathina Manduka', notes: 'Severe wrist and MCP swelling.' },
    ],
  },
  {
    id: 'pat-3',
    patientId: 'ARG-2026-0103',
    name: 'Ananya Deshmukh',
    age: 29,
    gender: 'Female',
    phone: '+91 94140 88219',
    email: 'ananya.deshmukh@example.com',
    city: 'Jaipur',
    address: 'Flat 401, Pearl Residency, C-Scheme, Jaipur',
    bloodGroup: 'A Positive',
    prakriti: 'Kapha-Pitta',
    vikriti: 'Artava Vaha Srotorodha (Apana Vata)',
    primaryDiagnosis: 'PCOD with 6-Month Oligomenorrhea',
    sanskritDiagnosis: 'आर्तव क्षय — कफ-वात आवृत अपान',
    attendingDoctorSlug: 'dr-ananya-sharma',
    registeredDate: '2026-09-01',
    totalVisits: 4,
    lastVisitDate: getDayOffset(-4),
    clinicalNotes: 'Natural menstrual cycle resumed on day 34 of protocol. Cystic acne on jawline clearing. Weight reduced by 3.2 kg.',
    activePrescriptions: [
      { medicineName: 'Kanchanar Guggulu', dosage: '2 tabs twice daily', timing: 'After Meals', anupana: 'Warm water', durationDays: 45 },
      { medicineName: 'Varunadi Kashayam', dosage: '15 ml with warm water', timing: 'Before Meals', anupana: 'Warm water', durationDays: 30 },
    ],
    pastVisits: [],
  },
  {
    id: 'pat-4',
    patientId: 'ARG-2026-0104',
    name: 'Harish Chandra Mathur',
    age: 63,
    gender: 'Male',
    phone: '+91 98290 55198',
    email: 'hc.mathur@example.com',
    city: 'Jaipur',
    address: '18, Chitrakoot Sector 3, Vaishali Nagar, Jaipur',
    bloodGroup: 'AB Positive',
    prakriti: 'Pitta-Kapha',
    vikriti: 'Rakta Dushti with Pitta-Kapha Kushta',
    primaryDiagnosis: 'Chronic Plaque Psoriasis (Extensor Surfaces)',
    sanskritDiagnosis: 'किटिक कुष्ठ — रक्तधातुगत पित्त-कफ',
    attendingDoctorSlug: 'dr-aditya-bohra',
    registeredDate: '2026-06-20',
    totalVisits: 7,
    lastVisitDate: getDayOffset(-3),
    clinicalNotes: 'Plaque erythema reduced by 85% following Virechana cleansing. No new scaling on elbows.',
    activePrescriptions: [
      { medicineName: 'Guggulutikta Ghrita', dosage: '15 ml morning', timing: 'Sunrise on Empty Stomach', anupana: 'Hot water', durationDays: 21 },
      { medicineName: 'Triphala Churna', dosage: '1 tsp at night', timing: 'At Bedtime', anupana: 'Warm water', durationDays: 60 },
    ],
    pastVisits: [],
  },
  {
    id: 'pat-5',
    patientId: 'ARG-2026-0105',
    name: 'Devika Singhania',
    age: 41,
    gender: 'Female',
    phone: '+91 98201 33419',
    email: 'devika.s@venturecapital.in',
    city: 'Mumbai',
    address: 'Bandra West, Mumbai, Maharashtra',
    bloodGroup: 'O Negative',
    prakriti: 'Vata-Pitta',
    vikriti: 'Prana Vayu & Tarpaka Kapha Depletion',
    primaryDiagnosis: 'Severe Autonomic Insomnia & Work Burnout',
    sanskritDiagnosis: 'अनिद्रा — प्राण वायु एवं साधक पित्त प्रकोप',
    attendingDoctorSlug: 'dr-aditya-bohra',
    registeredDate: '2026-10-01',
    totalVisits: 5,
    lastVisitDate: getDayOffset(-1),
    clinicalNotes: 'Sleeping 6.5 hours naturally without sedatives. Daily Shirodhara with Brahmi Taila has calmed autonomic hyper-arousal.',
    activePrescriptions: [
      { medicineName: 'Brahmi Taila', dosage: 'Scalp and Pada Abhyanga', timing: 'At Bedtime', anupana: 'External', durationDays: 30 },
      { medicineName: 'Ashwagandharishta', dosage: '20 ml with equal water', timing: 'After Meals', anupana: 'Lukewarm water', durationDays: 30 },
    ],
    pastVisits: [],
  },
  {
    id: 'pat-6',
    patientId: 'ARG-2026-0106',
    name: 'Sanjay K. Bhandari',
    age: 52,
    gender: 'Male',
    phone: '+91 98791 22891',
    email: 'sbhandari@textiles.com',
    city: 'Ahmedabad',
    address: 'Navrangpura, Ahmedabad, Gujarat',
    bloodGroup: 'B Positive',
    prakriti: 'Pitta-Vata',
    vikriti: 'Pitta-Vata Grahani with mucosal inflammation',
    primaryDiagnosis: 'Ulcerative Colitis & Chronic IBS (In Remission)',
    sanskritDiagnosis: 'ग्रहणी रोग — रक्त-पित्त समन्विता',
    attendingDoctorSlug: 'dr-aditya-bohra',
    registeredDate: '2026-05-12',
    totalVisits: 9,
    lastVisitDate: getDayOffset(-5),
    clinicalNotes: 'Stool frequency down from 8 times daily to 2 well-formed bowel movements without blood or mucus. Calprotectin normalized.',
    activePrescriptions: [
      { medicineName: 'Chitrakadi Vati', dosage: '1 tab chewed', timing: 'Before Meals', anupana: 'Warm water', durationDays: 30 },
    ],
    pastVisits: [],
  },
  {
    id: 'pat-7',
    patientId: 'ARG-2026-0107',
    name: 'Rajeshwari Devi',
    age: 67,
    gender: 'Female',
    phone: '+91 94140 19833',
    email: 'rajeshwari.kota@example.com',
    city: 'Kota',
    address: 'Civil Lines, Kota, Rajasthan',
    bloodGroup: 'A Positive',
    prakriti: 'Vata Predominant',
    vikriti: 'Asthi-Majja Dhatu Kshaya',
    primaryDiagnosis: 'Bilateral Knee Osteoarthritis (Grade 3)',
    sanskritDiagnosis: 'जानु सन्धिगत वात — श्लेषक कफ क्षय',
    attendingDoctorSlug: 'dr-aditya-bohra',
    registeredDate: '2026-07-28',
    totalVisits: 6,
    lastVisitDate: getDayOffset(-2),
    clinicalNotes: 'Knee flexion increased from 80 degrees to 115 degrees. Can climb stairs without assistance following Janu Basti series.',
    activePrescriptions: [
      { medicineName: 'Yogaraja Guggulu', dosage: '2 tabs twice daily', timing: 'After Meals', anupana: 'Warm water', durationDays: 45 },
    ],
    pastVisits: [],
  },
  {
    id: 'pat-8',
    patientId: 'ARG-2026-0108',
    name: 'Nitin J. Chawla',
    age: 46,
    gender: 'Male',
    phone: '+91 98110 44211',
    email: 'nitin.chawla@gurugram.in',
    city: 'Gurugram',
    address: 'DLF Phase 2, Gurugram, Haryana',
    bloodGroup: 'B Positive',
    prakriti: 'Kapha-Pitta',
    vikriti: 'Meda Dhatvagni Mandya & Kleda',
    primaryDiagnosis: 'Type-2 Diabetes & Grade 2 Fatty Liver',
    sanskritDiagnosis: 'प्रमेह / मेदोदोष — यकृत् कफ आवृत',
    attendingDoctorSlug: 'dr-aditya-bohra',
    registeredDate: '2026-08-05',
    totalVisits: 5,
    lastVisitDate: getDayOffset(-6),
    clinicalNotes: 'HbA1c dropped from 8.4% to 6.3%. Fasting glucose steady at 108 mg/dL. Reversal of hepatomegaly on ultrasound.',
    activePrescriptions: [
      { medicineName: 'Chandraprabha Vati', dosage: '2 tabs twice daily', timing: 'After Meals', anupana: 'Warm water', durationDays: 60 },
      { medicineName: 'Varunadi Kashayam', dosage: '15 ml before meals', timing: 'Before Meals', anupana: 'Warm water', durationDays: 30 },
    ],
    pastVisits: [],
  },
  {
    id: 'pat-9',
    patientId: 'ARG-2026-0109',
    name: 'Geetika Vyas',
    age: 32,
    gender: 'Female',
    phone: '+91 94250 88123',
    email: 'geetika.vyas@indore.in',
    city: 'Indore',
    address: 'Vijay Nagar, Indore, Madhya Pradesh',
    bloodGroup: 'O Positive',
    prakriti: 'Pitta-Vata',
    vikriti: 'Rasa-Artava Kshaya',
    primaryDiagnosis: 'Unexplained Infertility & Garbh Sanskar Preparation',
    sanskritDiagnosis: 'वन्ध्यत्व — बीज-क्षेत्र संस्कार',
    attendingDoctorSlug: 'dr-ananya-sharma',
    registeredDate: '2026-06-15',
    totalVisits: 7,
    lastVisitDate: getDayOffset(-7),
    clinicalNotes: 'Successful spontaneous conception confirmed in month four following pre-conception purification and Uttara Basti.',
    activePrescriptions: [
      { medicineName: 'Shatavari Gulam', dosage: '1 tbsp with warm milk', timing: 'Before Meals', anupana: 'Warm A2 Milk', durationDays: 60 },
    ],
    pastVisits: [],
  },
  {
    id: 'pat-10',
    patientId: 'ARG-2026-0110',
    name: 'Rajesh K. Singhal',
    age: 56,
    gender: 'Male',
    phone: '+91 98290 11982',
    email: 'rksinghal@jaipurjewels.com',
    city: 'Jaipur',
    address: 'Johari Bazaar, Jaipur, Rajasthan',
    bloodGroup: 'A Negative',
    prakriti: 'Vata-Pitta',
    vikriti: 'Asthi-Sandhi Gata Vata',
    primaryDiagnosis: 'Cervical Spondylosis with Radiculopathy',
    sanskritDiagnosis: 'ग्रीवा स्तम्भ — मज्जागत वात',
    attendingDoctorSlug: 'dr-aditya-bohra',
    registeredDate: '2026-09-12',
    totalVisits: 4,
    lastVisitDate: getDayOffset(0),
    clinicalNotes: 'Neck rotation improved by 40 degrees. Arm tingling subsided after Greeva Basti with Kottamchukkadi.',
    activePrescriptions: [
      { medicineName: 'Simhanada Guggulu', dosage: '2 tabs twice daily', timing: 'After Meals', anupana: 'Warm water', durationDays: 30 },
      { medicineName: 'Kottamchukkadi Taila', dosage: 'Warm neck application', timing: 'Before Meals', anupana: 'External', durationDays: 30 },
    ],
    pastVisits: [],
  },
  // Add 20 more realistic diverse patients for a total of 30
  ...Array.from({ length: 20 }).map((_, i) => {
    const idx = i + 11;
    const names = [
      'Pooja Agarwal', 'Dr. Ramesh Chandra Khandelwal', 'Sunil Mathur', 'Kavita Chordia',
      'Mukesh Somani', 'Anindita Sen', 'Tarun J. Doshi', 'Bhavna Parekh', 'Arun Kumar Joshi',
      'Deepak Goyal', 'Vandana Maheshwari', 'Alok Verma', 'Priyanka Shekhawat', 'Vijay R. Mehta',
      'Sudha R. Saxena', 'Karan Johar Rathore', 'Manju Bala Sharma', 'Hemant K. Jain',
      'Shalini Nair', 'Dinesh Chandra Soni',
    ];
    const cities = ['Jaipur', 'Jodhpur', 'Bikaner', 'Ajmer', 'New Delhi', 'Mumbai', 'Ahmedabad', 'Bengaluru'];
    const complaints = [
      'Chronic Migraine (Ardhavabhedaka)', 'Acid Peptic Disease (Amlapitta)', 'Ankylosing Spondylitis',
      'Hypothyroidism & Sluggish Metabolism', 'Chronic Sinusitis & Rhinitis (Pratishyaya)',
      'Hair Fall & Dandruff (Khalitya & Darunaka)', 'General Fatigue & Ojas Depletion',
      'Sciatica Flare-Up', 'Bilateral Frozen Shoulder (Apabahuka)', 'Spastic Colon & Bloating',
    ];
    const docs = ['dr-aditya-bohra', 'dr-ananya-sharma'];

    return {
      id: `pat-${idx}`,
      patientId: `ARG-2026-0${100 + idx}`,
      name: names[i % names.length],
      age: 26 + (i * 3) % 45,
      gender: i % 2 === 0 ? 'Female' : 'Male',
      phone: `+91 ${98290 + i} ${10000 + i * 111}`.slice(0, 15),
      email: `${names[i % names.length].toLowerCase().replace(/[^a-z]/g, '')}@patient.in`,
      city: cities[i % cities.length],
      address: `Civil Lines & Sector ${i + 1}, ${cities[i % cities.length]}`,
      bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
      prakriti: ['Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridoshic'][i % 4],
      vikriti: ['Vata Aggravation', 'Pitta-Rakta Dushti', 'Kapha Obstruction'][i % 3],
      primaryDiagnosis: complaints[i % complaints.length],
      sanskritDiagnosis: 'वातिक विकार — धातु शैथिल्य',
      attendingDoctorSlug: docs[i % docs.length],
      registeredDate: `2026-0${(i % 5) + 5}-10`,
      totalVisits: (i % 6) + 1,
      lastVisitDate: getDayOffset(-((i % 14) + 1)),
      clinicalNotes: `Patient responding well to classical pathya and prescribed decoctions. Pulse shows gradual Agni stabilization.`,
      activePrescriptions: [
        { medicineName: 'Triphala Churna', dosage: '1 tsp bedtime', timing: 'At Bedtime', anupana: 'Warm water', durationDays: 30 },
      ],
      pastVisits: [],
    } as DbPatient;
  }),
];

// 60 Realistically Distributed Appointments (Yesterday, Today, Tomorrow, Upcoming 14 Days)
export const SEED_APPOINTMENTS: DbAppointment[] = [
  // Today's appointments (Tokens 3510 - 3528)
  {
    id: 'apt-seed-1',
    tokenNumber: 'AAR-2026-3510',
    patientId: 'ARG-2026-0101',
    patientName: 'Col. Vikramaditya Rathore',
    patientPhone: '+91 98290 14022',
    patientAge: 54,
    patientGender: 'Male',
    serviceId: 'spine-joint',
    serviceName: 'Spine & Joint Restoration (Kati Basti)',
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra',
    mode: 'in-clinic',
    date: getDayOffset(0),
    slot: '09:00 AM',
    status: 'Confirmed',
    chiefComplaint: 'Severe lumbar disc protrusion (L4-L5) with sciatic nerve radiation.',
    feeInr: 1200,
    createdAt: '2026-11-05T09:12:00Z',
  },
  {
    id: 'apt-seed-2',
    tokenNumber: 'AAR-2026-3511',
    patientId: 'ARG-2026-0102',
    patientName: 'Smt. Meera R. Singhania',
    patientPhone: '+91 98290 44122',
    patientAge: 48,
    patientGender: 'Female',
    serviceId: 'nadi-pariksha',
    serviceName: 'Nadi Pariksha & Pulse Consultation',
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra',
    mode: 'in-clinic',
    date: getDayOffset(0),
    slot: '09:45 AM',
    status: 'Confirmed',
    chiefComplaint: 'Rheumatoid arthritis follow-up pulse assessment.',
    feeInr: 1200,
    createdAt: '2026-11-06T11:20:00Z',
  },
  {
    id: 'apt-seed-3',
    tokenNumber: 'AAR-2026-3512',
    patientId: 'ARG-2026-0103',
    patientName: 'Ananya Deshmukh',
    patientPhone: '+91 94140 88219',
    patientAge: 29,
    patientGender: 'Female',
    serviceId: 'womens-health',
    serviceName: "Women's Health & Stri Roga",
    doctorSlug: 'dr-ananya-sharma',
    doctorName: 'Dr. Ananya Sharma',
    mode: 'online',
    date: getDayOffset(0),
    slot: '10:00 AM',
    status: 'Confirmed',
    chiefComplaint: 'PCOD review & follicle monitoring report discussion.',
    feeInr: 950,
    createdAt: '2026-11-06T14:40:00Z',
  },
  {
    id: 'apt-seed-4',
    tokenNumber: 'AAR-2026-3513',
    patientId: 'ARG-2026-0104',
    patientName: 'Harish Chandra Mathur',
    patientPhone: '+91 98290 55198',
    patientAge: 63,
    patientGender: 'Male',
    serviceId: 'skin-hair',
    serviceName: 'Skin & Hair Clinical Care',
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra',
    mode: 'in-clinic',
    date: getDayOffset(0),
    slot: '10:30 AM',
    status: 'Confirmed',
    chiefComplaint: 'Psoriasis plaque review post-Virechana.',
    feeInr: 1200,
    createdAt: '2026-11-07T08:15:00Z',
  },
  {
    id: 'apt-seed-5',
    tokenNumber: 'AAR-2026-3514',
    patientId: 'ARG-2026-0105',
    patientName: 'Devika Singhania',
    patientPhone: '+91 98201 33419',
    patientAge: 41,
    patientGender: 'Female',
    serviceId: 'stress-sleep',
    serviceName: 'Stress, Insomnia & Sleep Care',
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra',
    mode: 'in-clinic',
    date: getDayOffset(0),
    slot: '11:15 AM',
    status: 'Confirmed',
    chiefComplaint: 'Shirodhara residential progress check.',
    feeInr: 2200,
    createdAt: '2026-11-07T10:00:00Z',
  },
  {
    id: 'apt-seed-6',
    tokenNumber: 'AAR-2026-3515',
    patientId: 'ARG-2026-0106',
    patientName: 'Sanjay K. Bhandari',
    patientPhone: '+91 98791 22891',
    patientAge: 52,
    patientGender: 'Male',
    serviceId: 'digestive-metabolic',
    serviceName: 'Digestive & Metabolic Agni Care',
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra',
    mode: 'online',
    date: getDayOffset(0),
    slot: '12:00 PM',
    status: 'Confirmed',
    chiefComplaint: 'IBS & ulcerative colitis maintenance review.',
    feeInr: 1000,
    createdAt: '2026-11-07T12:30:00Z',
  },
  {
    id: 'apt-seed-7',
    tokenNumber: 'AAR-2026-3516',
    patientId: 'ARG-2026-0107',
    patientName: 'Rajeshwari Devi',
    patientPhone: '+91 94140 19833',
    patientAge: 67,
    patientGender: 'Female',
    serviceId: 'spine-joint',
    serviceName: 'Spine & Joint Restoration (Janu Basti)',
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra',
    mode: 'in-clinic',
    date: getDayOffset(0),
    slot: '12:45 PM',
    status: 'Pending',
    chiefComplaint: 'Bilateral knee pain checkup.',
    feeInr: 1200,
    createdAt: '2026-11-08T09:00:00Z',
  },
  {
    id: 'apt-seed-8',
    tokenNumber: 'AAR-2026-3517',
    patientId: 'ARG-2026-0108',
    patientName: 'Nitin J. Chawla',
    patientPhone: '+91 98110 44211',
    patientAge: 46,
    patientGender: 'Male',
    serviceId: 'digestive-metabolic',
    serviceName: 'Digestive & Metabolic Agni Care',
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra',
    mode: 'in-clinic',
    date: getDayOffset(0),
    slot: '04:30 PM',
    status: 'Confirmed',
    chiefComplaint: 'Fatty liver & blood glucose review.',
    feeInr: 1200,
    createdAt: '2026-11-08T11:10:00Z',
  },
  {
    id: 'apt-seed-9',
    tokenNumber: 'AAR-2026-3518',
    patientId: 'ARG-2026-0109',
    patientName: 'Geetika Vyas',
    patientPhone: '+91 94250 88123',
    patientAge: 32,
    patientGender: 'Female',
    serviceId: 'womens-health',
    serviceName: "Women's Health & Stri Roga",
    doctorSlug: 'dr-ananya-sharma',
    doctorName: 'Dr. Ananya Sharma',
    mode: 'online',
    date: getDayOffset(0),
    slot: '05:15 PM',
    status: 'Confirmed',
    chiefComplaint: 'Antenatal Garbh Sanskar dietary guidance.',
    feeInr: 950,
    createdAt: '2026-11-08T15:20:00Z',
  },
  {
    id: 'apt-seed-10',
    tokenNumber: 'AAR-2026-3519',
    patientId: 'ARG-2026-0110',
    patientName: 'Rajesh K. Singhal',
    patientPhone: '+91 98290 11982',
    patientAge: 56,
    patientGender: 'Male',
    serviceId: 'spine-joint',
    serviceName: 'Spine & Joint Restoration',
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra',
    mode: 'in-clinic',
    date: getDayOffset(0),
    slot: '06:00 PM',
    status: 'Completed',
    chiefComplaint: 'Cervical spondylosis post-Greeva Basti session.',
    feeInr: 1200,
    createdAt: '2026-11-08T16:00:00Z',
  },

  // Remaining appointments to make 60 (spanning past 3 days and next 14 days)
  ...Array.from({ length: 50 }).map((_, i) => {
    const dayOffset = (i % 16) - 2; // -2 to +13 days
    const slotTimes = ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '12:00 PM', '04:30 PM', '05:15 PM', '06:00 PM', '06:45 PM', '07:15 PM'];
    const statuses: ('Pending' | 'Confirmed' | 'Completed' | 'Cancelled')[] =
      dayOffset < 0 ? ['Completed', 'Completed', 'Cancelled'] : ['Confirmed', 'Pending', 'Confirmed'];
    const pat = SEED_PATIENTS[i % SEED_PATIENTS.length];
    const docs = [
      { slug: 'dr-aditya-bohra', name: 'Dr. Aditya Bohra', fee: 1200 },
      { slug: 'dr-ananya-sharma', name: 'Dr. Ananya Sharma', fee: 950 },
    ];
    const doc = docs[i % docs.length];

    return {
      id: `apt-seed-${i + 11}`,
      tokenNumber: `AAR-2026-0${400 + i}`,
      patientId: pat.patientId,
      patientName: pat.name,
      patientPhone: pat.phone,
      patientAge: pat.age,
      patientGender: pat.gender,
      serviceId: 'nadi-pariksha',
      serviceName: 'Nadi Pariksha & Pulse Consultation',
      doctorSlug: doc.slug,
      doctorName: doc.name,
      mode: i % 3 === 0 ? 'online' : 'in-clinic',
      date: getDayOffset(dayOffset),
      slot: slotTimes[i % slotTimes.length],
      status: statuses[i % statuses.length],
      chiefComplaint: pat.primaryDiagnosis,
      feeInr: doc.fee,
      createdAt: `2026-11-0${(i % 5) + 1}T10:00:00Z`,
    } as DbAppointment;
  }),
];

// Default Doctor Schedules
export const DOCTOR_SCHEDULES: DoctorScheduleConfig[] = [
  {
    doctorSlug: 'dr-aditya-bohra',
    doctorName: 'Dr. Aditya Bohra (Chief Vaidya)',
    weeklyAvailability: [
      { day: 'Monday', morningEnabled: true, morningHours: '09:00 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:30 PM' },
      { day: 'Tuesday', morningEnabled: true, morningHours: '09:00 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:30 PM' },
      { day: 'Wednesday', morningEnabled: true, morningHours: '09:00 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:30 PM' },
      { day: 'Thursday', morningEnabled: true, morningHours: '09:00 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:30 PM' },
      { day: 'Friday', morningEnabled: true, morningHours: '09:00 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:30 PM' },
      { day: 'Saturday', morningEnabled: true, morningHours: '09:00 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:30 PM' },
      { day: 'Sunday', morningEnabled: false, morningHours: '', eveningEnabled: false, eveningHours: '' },
    ],
    blockedDates: [
      { date: getDayOffset(8), reason: 'National Ayurveda Congress, New Delhi' },
      { date: getDayOffset(9), reason: 'National Ayurveda Congress, New Delhi' },
    ],
  },
  {
    doctorSlug: 'dr-ananya-sharma',
    doctorName: 'Dr. Ananya Sharma (Prasuti & Stri Roga)',
    weeklyAvailability: [
      { day: 'Monday', morningEnabled: true, morningHours: '09:30 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:00 PM' },
      { day: 'Tuesday', morningEnabled: true, morningHours: '09:30 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:00 PM' },
      { day: 'Wednesday', morningEnabled: true, morningHours: '09:30 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:00 PM' },
      { day: 'Thursday', morningEnabled: false, morningHours: 'Academic Research Day', eveningEnabled: false, eveningHours: '' },
      { day: 'Friday', morningEnabled: true, morningHours: '09:30 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:00 PM' },
      { day: 'Saturday', morningEnabled: true, morningHours: '09:30 AM – 01:30 PM', eveningEnabled: true, eveningHours: '04:30 PM – 07:00 PM' },
      { day: 'Sunday', morningEnabled: false, morningHours: '', eveningEnabled: false, eveningHours: '' },
    ],
    blockedDates: [],
  },
];

export const MOCK_PATIENTS = SEED_PATIENTS;
export const MOCK_APPOINTMENTS = SEED_APPOINTMENTS;
