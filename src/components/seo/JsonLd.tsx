import React from 'react';

export function JsonLd() {
  const clinicSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: 'Aarogyam Ayurvedic Chikitsalaya & Panchakarma Research Centre',
    alternateName: 'आरोग्यम आयुर्वेदिक चिकित्सालय',
    description:
      'Authentic classical Ayurvedic clinic and Panchakarma retreat in Civil Lines, Jaipur. Specializing in clinical pulse diagnosis (Nadi Pariksha), spine and joint restoration, gastrointestinal Agni balancing, and residential detox therapies.',
    url: 'https://aarogyamayurveda.com',
    logo: 'https://aarogyamayurveda.com/logo.png',
    image: 'https://aarogyamayurveda.com/og-image.jpg',
    telephone: '+911412398800',
    email: 'contact@aarogyamayurveda.com',
    priceRange: '₹₹',
    medicalSpecialty: [
      'https://schema.org/Holistic',
      'https://schema.org/PrimaryCare',
      'Ayurveda',
      'Panchakarma',
      'Kayachikitsa',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '42, Raj Bhavan Road, Civil Lines',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302006',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '26.9056',
      longitude: '75.7873',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '09:00',
        closes: '19:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '14:00',
        description: 'By Prior Appointment Only',
      },
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Government AYUSH Hospital License',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Department of AYUSH, Government of Rajasthan',
      },
      validIn: {
        '@type': 'AdministrativeArea',
        name: 'Rajasthan, India',
      },
      identifier: 'AYUSH-RJ-2018-0482',
    },
    founder: {
      '@type': 'Physician',
      name: 'Dr. Aditya Bohra',
      jobTitle: 'Chief Ayurvedic Physician & Panchakarma Specialist',
      medicalSpecialty: 'Kayachikitsa & Panchakarma',
      description:
        'Senior Ayurvedic Physician with 24+ years clinical experience in Nadi Pariksha and Panchakarma. Alumnus of National Institute of Ayurveda, Jaipur.',
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'National Institute of Ayurveda, Jaipur',
      },
      identifier: 'AYUSH-RJ-1999-4081',
    },
    physician: [
      {
        '@type': 'Physician',
        name: 'Dr. Aditya Bohra',
        jobTitle: 'Chief Vaidya · BAMS, MD (Kayachikitsa), PhD',
        telephone: '+911412398800',
        identifier: 'AYUSH-RJ-1999-4081',
      },
      {
        '@type': 'Physician',
        name: 'Dr. Ananya Sharma',
        jobTitle: 'Senior Vaidya · BAMS, MS (Prasuti & Stri Roga)',
        telephone: '+911412398800',
        identifier: 'AYUSH-RJ-2012-7712',
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

