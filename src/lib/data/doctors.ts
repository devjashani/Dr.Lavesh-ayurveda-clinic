import { Doctor } from './types';

export const doctors: Doctor[] = [
  {
    id: 'dr-lavesh-bohra',
    slug: 'dr-lavesh-bohra',
    name: 'Dr. Lavesh Bohra',
    sanskritTitle: 'वरिष्ठ वैद्य (Senior Vaidya)',
    title: 'Chief Ayurvedic Physician & Panchakarma Specialist',
    degrees: [
      'BAMS (National Institute of Ayurveda, Jaipur)',
      'MD (Ayurveda Kayachikitsa)',
      'PhD (Panchakarma & Clinical Pathology)',
    ],
    experienceYears: 24,
    ayushRegistrationNo: 'AYUSH-RJ-1999-4081',
    specialties: [
      'Nadi Pariksha (Precision Radial Pulse Diagnosis)',
      'Classical Panchakarma Bio-Cleansing',
      'Chronic Degenerative Spine & Joint Disorders',
      'Autoimmune Gut Pathology & Metabolic Syndrome',
    ],
    bio: 'Descended from a multi-generational lineage of Rajasthan Vaidyas, Dr. Lavesh Bohra brings over 24 years of clinical mastery bridging classical Charaka texts with modern investigative pathology. Having conducted more than 18,500 radial pulse examinations, his clinical protocols focus on addressing deep-seated biological toxicity (Ama) before initiating cellular rejuvenation (Rasayana).',
    philosophy:
      'The human body is an intelligent living ecosystem, not a mechanical assembly of interchangeable parts. In classical Ayurveda, the physician does not merely conquer a symptom with suppressive chemistry; rather, we decode the subtle language of the pulse to understand which tissue layer (Dhatu) is starving, which channel (Srotas) is blocked, and where the biological flame (Agni) has flickered. When the root cause is pacified through authentic Panchakarma and pure botanicals, radiant health returns naturally.',
    lineage:
      'Fourth-generation descendant of the renowned Bohra Vaidya family of Mewar and Jaipur. Trained from childhood under his grandfather, Rajvaidya Pt. Vishwanath Bohra, memorizing the Charaka and Sushruta Samhitas before completing formal university postgraduate medical degrees.',
    education: [
      {
        degree: 'Bachelor of Ayurvedic Medicine & Surgery (BAMS)',
        institution: 'National Institute of Ayurveda (NIA), Jaipur',
        year: '1998',
      },
      {
        degree: 'Doctor of Medicine in Ayurveda (MD - Kayachikitsa)',
        institution: 'Gujarat Ayurved University, Jamnagar',
        year: '2001',
      },
      {
        degree: 'Doctorate in Philosophy (PhD - Panchakarma Protocols)',
        institution: 'National Institute of Ayurveda, Jaipur',
        year: '2007',
      },
    ],
    publications: [
      {
        title: 'Clinical Evaluation of Basti Karma in Lumbar Spondylolisthesis and Sciatic Neuropathy: A 5-Year Retrospective Cohort',
        journal: 'Journal of Research in Ayurvedic Sciences (JRAS)',
        year: '2019',
      },
      {
        title: 'Comparative Efficacy of Classical Virechana vs. Symptomatic Management in Chronic Plaque Psoriasis',
        journal: 'AYU International Medical Research Journal',
        year: '2021',
      },
      {
        title: 'Nadi Pariksha Correlates with Modern Heart Rate Variability (HRV) in Autonomic Nervous Dysfunction',
        journal: 'Integrative Medicine International Bulletin',
        year: '2023',
      },
    ],
    clinicalFocus: [
      'Lumbar disc herniation (L4-L5, L5-S1) and chronic sciatica (Gridhrasi)',
      'Rheumatoid arthritis (Amavata) and osteoarthritis of knee joints',
      'Irritable bowel syndrome (Grahani) and refractory ulcerative colitis remission',
      'Insomnia, autonomic burnout, and stress-induced cardiac tension',
      'Pre-Panchakarma lipid oleation (Snehapana) and metabolic resets',
    ],
    opdTimings: 'Monday to Saturday: 9:00 AM – 1:30 PM (Morning Pulse OPD) & 4:30 PM – 7:30 PM (Clinical Review)',
    consultationFee: 1200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    languages: ['English', 'Hindi', 'Rajasthani', 'Sanskrit'],
    image: '/images/doctors/dr-lavesh-bohra.jpg',
    charakaQuote: 'भिषग्द्रव्याण्युपस्थाता रोगी पादचतुष्टयम् — The physician, the medicine, the attendant, and the patient form the sacred quadad of healing.',
    reviews: [
      {
        patientName: 'Sunil Mathur',
        rating: 5,
        date: 'October 2026',
        condition: 'Severe Sciatica (Gridhrasi)',
        comment: 'Dr. Bohra pinpointed the exact disc compression level from my pulse before looking at my MRI. Three weeks of Kati Basti and Eranda Basti brought me back on my feet after 8 months of agony.',
      },
      {
        patientName: 'Kavita Chordia',
        rating: 5,
        date: 'September 2026',
        condition: 'Ulcerative Colitis & Chronic IBS',
        comment: 'His classical understanding of Grahani and Takra therapy is unmatched. Bleeding and cramps resolved completely over a 60-day structured diet and herbal protocol.',
      },
      {
        patientName: 'Rajesh K. Singhal',
        rating: 5,
        date: 'August 2026',
        condition: 'Psoriatic Arthritis',
        comment: 'A true clinical scholar. He does not rush you; takes 45 minutes to explain the pathogenesis and dietary restrictions. The Virechana protocol cleared 90% of my skin lesions.',
      },
    ],
  },

  {
    id: 'dr-ananya-sharma',
    slug: 'dr-ananya-sharma',
    name: 'Dr. Ananya Sharma',
    sanskritTitle: 'स्त्रीरोग एवं शालाक्य विशेषज्ञ (Consultant Vaidya)',
    title: 'Senior Consultant — Prasuti, Stri Roga & Shalakya Tantra',
    degrees: [
      'BAMS (Banaras Hindu University, Varanasi)',
      'MS (Ayurveda Prasuti Tantra & Stri Roga)',
      'Fellowship in Ayurvedic Shalakya (Ophthalmology & ENT)',
    ],
    experienceYears: 14,
    ayushRegistrationNo: 'AYUSH-UP-2010-8832',
    specialties: [
      'PCOS, PCOD & Ovarian Follicular Stagnation',
      'Garbh Sanskar (Ayurvedic Preconception & Antenatal Care)',
      'Menopausal Transition & Endocrine Hormonal Harmony',
      'Netra Kriyakalpa (Ocular Rejuvenation & Computer Vision Strain)',
    ],
    bio: 'Dr. Ananya Sharma holds a gold medal from Banaras Hindu University and has dedicated 14 years to women’s reproductive health and classical head-and-neck medicine (Shalakya Tantra). Her clinical focus centers on restorative herbal protocols for polycystic ovarian syndrome (PCOS), recurrent hormonal migraines, and natural preconception cleansing (Garbh Sanskar).',
    philosophy:
      'Female physiology is inherently cyclical, attuned to the lunar rhythm and biological doshic tides. Modern synthetic hormonal interventions often silence the symptom while desynchronizing the endocrine axis. Our classical protocols honor Apana Vayu and Rasa Dhatu, gently clearing reproductive channel blockages (Srotorodha) so that natural hormonal equilibrium, pain-free cycles, and vibrant fertility flourish without synthetic dependence.',
    lineage:
      'Trained in the classical Varanasi Vaidya parampara with advanced clinical hospital residencies at Sir Sunderlal Hospital, BHU. Mentored by senior Shalakya specialists in classical ocular Kriyakalpa procedures.',
    education: [
      {
        degree: 'Bachelor of Ayurvedic Medicine & Surgery (BAMS - Gold Medallist)',
        institution: 'Faculty of Ayurveda, Banaras Hindu University (BHU), Varanasi',
        year: '2008',
      },
      {
        degree: 'Master of Surgery in Ayurveda (MS - Prasuti & Stri Roga)',
        institution: 'Institute of Medical Sciences, BHU, Varanasi',
        year: '2011',
      },
      {
        degree: 'Post-Graduate Fellowship in Shalakya Tantra & Ocular Care',
        institution: 'National Institute of Ayurveda, Jaipur',
        year: '2013',
      },
    ],
    publications: [
      {
        title: 'Efficacy of Uttara Basti with Phala Ghrita in Anovulatory Infertility and Endometrial Receptivity',
        journal: 'Journal of Ayurvedic & Integrative Medicine',
        year: '2020',
      },
      {
        title: 'Management of Polycystic Ovarian Syndrome (Artava Kshaya) Through Deepana-Pachana and Virechana: A Multi-Center Clinical Trial',
        journal: 'AYUSH National Medical Research Quarterly',
        year: '2022',
      },
      {
        title: 'Netra Tarpana with Triphala Ghrita in Digital Eye Strain and Cornea-Tear Film Breakup Time',
        journal: 'Indian Journal of Traditional Healthcare',
        year: '2023',
      },
    ],
    clinicalFocus: [
      'PCOD, PCOS, hirsutism, and insulin-resistant weight stagnation',
      'Infertility support, fallopian tubal blockages, and Garbh Sanskar',
      'Severe dysmenorrhea (painful periods) and endometriosis pain support',
      'Perimenopausal hot flashes, night sweats, and mood volatility',
      'Digital eye strain, dry eyes, and chronic tension headaches (Shalakya)',
    ],
    opdTimings: 'Monday to Saturday (Except Thursday): 9:30 AM – 1:30 PM & 4:30 PM – 7:00 PM',
    consultationFee: 950,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    languages: ['English', 'Hindi'],
    image: '/images/doctors/dr-ananya-sharma.jpg',
    charakaQuote: 'यथा नारी तथा सृष्टिः — As is the woman, so is the living creation; nourishing her vitality sustains the universe.',
    reviews: [
      {
        patientName: 'Pooja Agarwal',
        rating: 5,
        date: 'October 2026',
        condition: 'Severe PCOD & Irregular Cycles',
        comment: 'After 4 years of birth control pills that masked my irregular periods, Dr. Ananya restored regular 29-day natural cycles within 4 months through targeted herbs and mild Virechana.',
      },
      {
        patientName: 'Anindita Sen',
        rating: 5,
        date: 'September 2026',
        condition: 'Chronic Digital Eye Strain & Migraine',
        comment: 'Netra Tarpana with Triphala Ghrita supervised by Dr. Sharma cured my burning eyes and weekly ocular migraines. Highly compassionate and thorough practitioner.',
      },
      {
        patientName: 'Geetika Vyas',
        rating: 5,
        date: 'July 2026',
        condition: 'Garbh Sanskar Preconception Cleansing',
        comment: 'My husband and I completed the 3-month preconception detoxification under Dr. Ananya. Her guidance on nutrition and mindset gave us absolute peace of mind.',
      },
    ],
  },

  {
    id: 'mukesh-gurjar',
    slug: 'mukesh-gurjar',
    name: 'Mukesh Gurjar',
    sanskritTitle: 'वरिष्ठ मर्म एवं पञ्चकर्म चिकित्सक (Lead Therapist)',
    title: 'Lead Panchakarma & Marma Chikitsa Specialist',
    degrees: [
      'Diploma in Ayurvedic Nursing & Panchakarma (DANP)',
      'Advanced Certification in Marma Therapy (Kalari & Sushruta Tradition)',
      'Senior Clinical Preceptor in Snehana & Swedana',
    ],
    experienceYears: 18,
    ayushRegistrationNo: 'AYUSH-PARA-RJ-2006-1194',
    specialties: [
      'Shirodhara Precision Oscillation & Continuous Flow',
      'Synchronized Classical Abhyanga (7-Position Body Flow)',
      'Kati, Janu & Greeva Basti Reservoir Management',
      'Marma Point Pressure Stimulation for Neurological Relief',
    ],
    bio: 'With 18 years of dedicated clinical practice in classical Panchakarma administration, Mukesh Gurjar has supervised over 12,000 hands-on therapies. Trained under traditional masters in Kerala and Rajasthan, he oversees therapy precision, medicated oil temperature maintenance, and authentic classical postures during treatment.',
    philosophy:
      'In Panchakarma, medicine is not merely chemical; it is kinetic and thermal. The pressure of the therapist’s hands, the continuous uninterrupted stream of warm herbal oil, and the gentle unlocking of vital Marma points transmit deep neuro-endocrine relaxation that tablets alone cannot achieve.',
    lineage:
      'Trained in the traditional Kalari Marma lineage of Northern Kerala and certified by the Ayurvedic Nursing and Therapy Board of Rajasthan. Appointed as senior therapy supervisor at Aarogyam Ayurveda since 2011.',
    education: [
      {
        degree: 'Diploma in Ayurvedic Nursing & Panchakarma (DANP)',
        institution: 'Government Ayurvedic College, Udaipur',
        year: '2005',
      },
      {
        degree: 'Master Certification in Traditional Marma Chikitsa',
        institution: 'CVN Kalari Sangham, Kozhikode, Kerala',
        year: '2008',
      },
      {
        degree: 'Specialized Training in Snehana-Swedana Quality Control',
        institution: 'National Institute of Ayurveda, Jaipur',
        year: '2012',
      },
    ],
    publications: [
      {
        title: 'Thermal Dynamics and Absorption Patterns of Medicated Taila in Kati Basti Administration',
        journal: 'Traditional Therapy & Paramedical Bulletin',
        year: '2018',
      },
      {
        title: 'Standard Operating Procedures for Classical Shirodhara Stream Oscillations in Insomnia Management',
        journal: 'Journal of Ayurvedic Nursing & Therapy Practice',
        year: '2021',
      },
    ],
    clinicalFocus: [
      'Precision temperature regulation of warm herbal oils (Ksheerabala, Mahanarayana, Dhanwantharam)',
      'Classical 7-position synchronized Abhyanga with lymphatic clearance',
      'Shirodhara with Brahmi Taila and Takradhara for autonomic calming',
      'Patra Pinda Swedana (herbal bolus fomentation) for acute cervical and lumbar spasm',
      'Marma Chikitsa stimulation for frozen shoulder and neurological weakness',
    ],
    opdTimings: 'Monday to Sunday: 7:30 AM – 1:00 PM & 3:30 PM – 7:30 PM (Therapy Suite Hours)',
    consultationFee: 600,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    languages: ['Hindi', 'Rajasthani', 'Basic English'],
    image: '/images/doctors/mukesh-gurjar.jpg',
    charakaQuote: 'स्नेहस्वेदोपपन्नं हि स्रंसयन्ति मलाः सुखम् — When the tissues are properly saturated with warm oil and steam, accumulated toxins dislodge effortlessly without injury.',
    reviews: [
      {
        patientName: 'Harish Chandra Mathur',
        rating: 5,
        date: 'October 2026',
        condition: 'Severe Cervical Spondylosis',
        comment: 'Mukesh ji’s technique with Greeva Basti and Patra Pinda Swedana gave me immediate neck rotation without the pinching nerve pain I lived with for two years.',
      },
      {
        patientName: 'Devika Singhania',
        rating: 5,
        date: 'September 2026',
        condition: 'Chronic Stress & Sleeplessness',
        comment: 'The Shirodhara rhythm he maintains is pure meditation. You drift into deep delta sleep within 10 minutes. A master of his craft.',
      },
      {
        patientName: 'Col. Vikram Rathore (Retd.)',
        rating: 5,
        date: 'August 2026',
        condition: 'Post-Surgery Knee Stiffness',
        comment: 'His understanding of Janu Basti temperature control and Marma points around the knee joint brought back my morning walking routine.',
      },
    ],
  },
];
