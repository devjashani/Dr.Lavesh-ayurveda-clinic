import { Doctor } from './types';
import { IMAGES } from '@/lib/config/images';

export const doctors: Doctor[] = [
  {
    id: 'dr-lavesh-bohra',
    slug: 'dr-lavesh-bohra',
    name: 'Dr. Lavesh Bohra',
    sanskritTitle: 'નોંધાયેલા આયુર્વેદ ચિકિત્સક',
    title: 'Registered Ayurvedic Practitioner',
    degrees: ['BAMS (2026), SMIAS, Gujarat Ayurved University'],
    experienceYears: 0,
    ayushRegistrationNo: 'Registration No.: to be added',
    specialties: [
      'Individual Ayurvedic Consultations',
      'Personalized Lifestyle Care (Ahara & Vihara)',
      'Circadian & Seasonal Routines (Dinacharya & Ritucharya)',
      'Classical Ayurvedic Nutrition',
    ],
    bio: 'Dr. Lavesh Bohra is a Registered Ayurvedic Practitioner who completed his BAMS (2026) from SMIAS, Gujarat Ayurved University. His clinical practice focuses on individual Ayurvedic consultations and personalized lifestyle care, guiding individuals through tailored diet, daily routines, and seasonal health management.',
    philosophy:
      'Ayurveda views the individual as an integrated whole, where sustained well-being arises from balanced digestive fire (Agni), harmonious bodily humors (Doshas), and mindful daily habits. Through thorough clinical consultation and personalized dietary and lifestyle guidance, we work together to restore and maintain your natural equilibrium.',
    education: [
      {
        degree: 'Bachelor of Ayurvedic Medicine & Surgery (BAMS)',
        institution: 'SMIAS, Gujarat Ayurved University',
        year: '2026',
      },
    ],
    clinicalFocus: [
      'Individual constitutional assessment (Prakriti analysis)',
      'Digestive wellness and metabolic care (Agni balance)',
      'Personalized dietary roadmaps (Ahara)',
      'Daily wellness routines and stress balance (Dinacharya & Vihara)',
      'Seasonal health transitions (Ritucharya)',
    ],
    opdTimings: 'Monday to Saturday: By prior appointment',
    consultationFee: 1200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    languages: ['English', 'Hindi', 'Gujarati'],
    image: IMAGES.doctorPortrait,
    charakaQuote:
      'સ્વસ્થસ્ય સ્વાસ્થ્યરક્ષણમાતુરસ્ય વિકારપ્રશમનં ચ|| — To protect the health of the healthy and pacify imbalances in the afflicted.',
    reviews: [],
  },
];
