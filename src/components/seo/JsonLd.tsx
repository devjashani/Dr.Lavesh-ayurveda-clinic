import React from 'react';

export function JsonLd() {
  const clinicSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: 'VANKAL AYURVEDA',
    alternateName: 'વાંકલ આયુર્વેદ',
    description:
      'Individual Ayurvedic consultations and personalized lifestyle care guided by Dr. Lavesh Bohra, Registered Ayurvedic Practitioner.',
    url: 'https://vankalayurveda.com',
    logo: 'https://vankalayurveda.com/logo.png',
    image: 'https://vankalayurveda.com/og-image.jpg',
    telephone: '+91 9016432576',
    email: 'vankalayurveda@gmail.com',
    priceRange: '₹₹',
    medicalSpecialty: [
      'https://schema.org/Holistic',
      'https://schema.org/PrimaryCare',
      'Ayurveda',
    ],
    founder: {
      '@type': 'Physician',
      name: 'Dr. Lavesh Bohra',
      jobTitle: 'Registered Ayurvedic Practitioner',
      medicalSpecialty: 'Ayurveda & Lifestyle Care',
      description:
        'Registered Ayurvedic Practitioner. BAMS (2026), SMIAS, Gujarat Ayurved University. Focusing on individual consultations and lifestyle care.',
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'SMIAS, Gujarat Ayurved University',
      },
    },
    physician: [
      {
        '@type': 'Physician',
        name: 'Dr. Lavesh Bohra',
        jobTitle: 'Registered Ayurvedic Practitioner · BAMS (2026)',
        telephone: '+91 9016432576',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
    />
  );
}
