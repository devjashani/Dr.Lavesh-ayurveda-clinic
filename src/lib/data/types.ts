export type DoshaType = 'Vata' | 'Pitta' | 'Kapha' | 'Tridoshic' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha';

export interface TreatmentProcedureStep {
  step: number;
  phase: string; // e.g. "Purva Karma", "Pradhana Karma", "Paschat Karma"
  title: string;
  description: string;
  duration?: string;
}

export interface TreatmentFAQ {
  question: string;
  answer: string;
}

export interface Treatment {
  id: string;
  slug: string;
  name: string;
  sanskritName: string;
  category: 'Panchakarma' | 'Spine & Joint' | 'Skin & Hair' | 'Lifestyle & Metabolic';
  shortDescription: string;
  longDescription: string;
  indications: string[];
  procedureSteps: TreatmentProcedureStep[];
  duration: string;
  priceRange: string;
  whatToExpect: string;
  precautions: string[];
  whoShouldAvoid: string[];
  faqs: TreatmentFAQ[];
  relatedSlugs: string[];
  featuredImage: string;
  primaryDosha: DoshaType;
  herbsUsed: string[];
  // Backwards compatibility & convenience
  tagline?: string;
  description?: string;
  durationMinutes?: number;
  recommendedDays?: number;
  priceEstimate?: string;
  contraindications?: string[];
  featured?: boolean;
  aliases?: string[];
}

export interface Condition {
  id: string;
  letter: string;
  name: string;
  sanskritName: string;
  category: string;
  doshaInvolvement: string;
  pathophysiology: string;
  clinicalSigns: string[];
  recommendedTherapySlugs: string[];
  classicalDietAdvice: string;
  quoteCharaka?: string;
}

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  sanskritTitle?: string;
  title: string;
  degrees: string[];
  experienceYears: number;
  ayushRegistrationNo: string;
  specialties: string[];
  bio: string;
  consultationFee: number;
  availableDays: string[];
  languages: string[];
  image: string;
  philosophy?: string;
  lineage?: string;
  education?: { degree: string; institution: string; year: string }[];
  publications?: { title: string; journal: string; year: string }[];
  clinicalFocus?: string[];
  opdTimings?: string;
  charakaQuote?: string;
  reviews?: { patientName: string; rating: number; date: string; comment: string; condition: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  sanskritSubheading?: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
  };
  category: 'Ritucharya' | 'Dinacharya' | 'Herbal Formulations' | 'Panchakarma Science' | 'Clinical Cases';
  readTimeMinutes: number;
  publishedAt: string;
  tags: string[];
  coverImage: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  age?: number;
  location: string;
  conditionTreated: string;
  treatmentReceived: string;
  quote: string;
  fullStory?: string;
  verifiedPatient: boolean;
  avatarImage?: string;
  doctorInCharge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'First visit' | 'Online consultation' | 'Panchakarma' | 'Payments' | 'Medicines & diet';
}
