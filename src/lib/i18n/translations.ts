export type Language = 'EN' | 'HI';

export interface TranslationDictionary {
  nav: {
    home: string;
    about: string;
    treatments: string;
    conditions: string;
    doctors: string;
    doshaQuiz: string;
    wisdom: string;
    contact: string;
    bookConsultation: string;
    portal: string;
    admin: string;
  };
  hero: {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
    subhead: string;
    ctaBook: string;
    ctaQuiz: string;
    trust1: string;
    trust2: string;
    trust3: string;
    slotAvailable: string;
    slotTime: string;
    formTitle: string;
    formSub: string;
    fieldName: string;
    fieldPhone: string;
    fieldConcern: string;
    formBtn: string;
    concernOption1: string;
    concernOption2: string;
    concernOption3: string;
    concernOption4: string;
    concernOption5: string;
  };
  booking: {
    title: string;
    subtitle: string;
    steps: {
      concern: string;
      doctor: string;
      slot: string;
      details: string;
      review: string;
      confirm: string;
    };
    modeClinic: string;
    modeVideo: string;
    consultFee: string;
    patientName: string;
    phoneLabel: string;
    ageLabel: string;
    genderLabel: string;
    female: string;
    male: string;
    other: string;
    concernLabel: string;
    consentText: string;
    submitBtn: string;
    nextBtn: string;
    backBtn: string;
    voucherTitle: string;
    printPdf: string;
    addToCalendar: string;
    shareWhatsApp: string;
  };
  footer: {
    mission: string;
    clinicalCreed: string;
    creedSanskrit: string;
    creedMeaning: string;
    quickLinks: string;
    therapies: string;
    clinicInfo: string;
    hoursTitle: string;
    hoursMonSat: string;
    hoursSun: string;
    address: string;
    phone: string;
    disclaimer: string;
    copyright: string;
    regLine: string;
    newsletterTitle: string;
    newsletterPlaceholder: string;
    newsletterBtn: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  EN: {
    nav: {
      home: 'Home',
      about: 'About',
      treatments: 'Treatments',
      conditions: 'Conditions',
      doctors: 'Doctors',
      doshaQuiz: 'Dosha Quiz',
      wisdom: 'Wisdom',
      contact: 'Contact',
      bookConsultation: 'Book Consultation',
      portal: 'Patient Portal',
      admin: 'Vaidya EMR',
    },
    hero: {
      eyebrow: 'Classical Ayurveda · Panchakarma · Nadi Pariksha',
      titleStart: 'Ancient Healing Wisdom,',
      titleAccent: 'Clinical Precision.',
      titleEnd: '',
      subhead:
        'Rooted in Charaka Samhita. Precision pulse diagnosis, personalized herbal therapies, and classical residential Panchakarma in Civil Lines, Jaipur.',
      ctaBook: 'Book Consultation',
      ctaQuiz: 'Take the Dosha Quiz',
      trust1: 'Authentic Samhita Protocols',
      trust2: '24+ Years Clinical Experience',
      trust3: 'AYUSH Certified Chikitsalaya',
      slotAvailable: 'Next Available Slot Today',
      slotTime: '11:15 AM · Dr. Lavesh Bohra',
      formTitle: 'Schedule Pulse Diagnosis',
      formSub: 'Direct appointment with Senior Vaidya',
      fieldName: 'Your Full Name',
      fieldPhone: 'WhatsApp Mobile Number',
      fieldConcern: 'Primary Health Concern',
      formBtn: 'Confirm Appointment',
      concernOption1: 'Joint & Spine Pain (Sandhigata Vata)',
      concernOption2: 'Chronic Digestive Issues (Agni & IBS)',
      concernOption3: 'Skin, Psoriasis & Allergies',
      concernOption4: 'Stress, Insomnia & Anxiety',
      concernOption5: 'Full Panchakarma Detoxification',
    },
    booking: {
      title: 'Schedule Your Ayurvedic Consultation',
      subtitle:
        'Choose your primary health concern, select your attending Vaidya, and confirm an in-clinic or video appointment.',
      steps: {
        concern: 'Concern & Service',
        doctor: 'Doctor & Mode',
        slot: 'Date & Time Slot',
        details: 'Patient Details',
        review: 'Review & Consent',
        confirm: 'Confirmation Voucher',
      },
      modeClinic: 'In-Clinic (Civil Lines, Jaipur)',
      modeVideo: 'Online Video Tele-Consultation',
      consultFee: 'Consultation Fee',
      patientName: 'Patient Full Name',
      phoneLabel: 'WhatsApp Mobile (+91)',
      ageLabel: 'Age in Years',
      genderLabel: 'Biological Gender',
      female: 'Female',
      male: 'Male',
      other: 'Other',
      concernLabel: 'Chief Health Complaint & Symptoms',
      consentText:
        'I consent to classical Ayurvedic pulse examination and health consultation in accordance with clinic protocols.',
      submitBtn: 'Confirm & Generate Token',
      nextBtn: 'Proceed to Next Step',
      backBtn: 'Back',
      voucherTitle: 'Official Appointment Token Voucher',
      printPdf: 'Print / Download PDF',
      addToCalendar: 'Add to Google Calendar',
      shareWhatsApp: 'Share on WhatsApp',
    },
    footer: {
      mission:
        'Preserving classical Charaka & Sushruta healing wisdom through compassionate, precision clinical care. We treat the patient root-cause, not merely the symptom.',
      clinicalCreed: 'Clinical Creed',
      creedSanskrit: 'स्वस्थस्य स्वास्थ्य रक्षणं आतुरस्य विकार प्रशमनं च॥',
      creedMeaning: 'Protecting the health of the healthy; pacifying disease in the afflicted.',
      quickLinks: 'Quick Links',
      therapies: 'Classical Therapies',
      clinicInfo: 'Clinic Information',
      hoursTitle: 'Consultation Hours',
      hoursMonSat: 'Mon – Sat: 09:00 AM – 07:30 PM',
      hoursSun: 'Sunday: By Prior Booking Only',
      address: '42, Raj Bhavan Road, Civil Lines, Jaipur, Rajasthan 302006',
      phone: '+91 141 239 8800',
      disclaimer:
        'Disclaimer: Ayurvedic treatments are individualized based on Prakriti and Vikriti diagnosis. Not intended as self-medication.',
      copyright: '© 2026 Aarogyam Ayurvedic Chikitsalaya & Research Centre. All rights reserved.',
      regLine: 'Hospital Registration: AYUSH-RJ-2018-0482 · GMP Certified Herbal Dispensary',
      newsletterTitle: 'Ayurvedic Wisdom Newsletter',
      newsletterPlaceholder: 'Enter your email address',
      newsletterBtn: 'Subscribe',
    },
  },
  HI: {
    nav: {
      home: 'गृह',
      about: 'परिचय',
      treatments: 'चिकित्सा',
      conditions: 'रोगोपचार',
      doctors: 'वैद्य',
      doshaQuiz: 'प्रकृति परीक्षण',
      wisdom: 'आरोग्य ज्ञान',
      contact: 'संपर्क',
      bookConsultation: 'परामर्श बुक करें',
      portal: 'रोगी पोर्टल',
      admin: 'वैद्य ईएमआर',
    },
    hero: {
      eyebrow: 'शास्त्रीय आयुर्वेद · पंचकर्म · नाड़ी परीक्षा',
      titleStart: 'प्राचीन वैदिक ज्ञान,',
      titleAccent: 'विशुद्ध नैदानिक चिकित्सा।',
      titleEnd: '',
      subhead:
        'चरक संहिता के सिद्धांतों पर आधारित। जयपुर के सिविल लाइन्स में सटीक नाड़ी परीक्षा, व्यक्तिगत हर्बल चिकित्सा और संपूर्ण आवासीय पंचकर्म।',
      ctaBook: 'परामर्श बुक करें',
      ctaQuiz: 'प्रकृति परीक्षण करें',
      trust1: 'प्रामाणिक संहिता प्रोटोकॉल',
      trust2: '२४+ वर्षों का नैदानिक अनुभव',
      trust3: 'आयुष प्रमाणित चिकित्सालय',
      slotAvailable: 'आज उपलब्ध अगला परामर्श समय',
      slotTime: 'प्रातः ११:१५ · डॉ. आदित्य बोहरा',
      formTitle: 'नाड़ी परीक्षा समय बुक करें',
      formSub: 'वरिष्ठ वैद्य के साथ प्रत्यक्ष परामर्श',
      fieldName: 'आपका पूरा नाम',
      fieldPhone: 'व्हाट्सएप मोबाइल नंबर',
      fieldConcern: 'मुख्य स्वास्थ्य समस्या',
      formBtn: 'अपॉइंटमेंट पुष्टि करें',
      concernOption1: 'संधिवात एवं मेरुदण्ड पीड़ा (संधिगत वात)',
      concernOption2: 'दीर्घकालिक पाचन विकार (अग्निमांद्य एवं संग्रहणी)',
      concernOption3: 'त्वचा विकार, सोरायसिस एवं एलर्जी',
      concernOption4: 'तनाव, अनिद्रा एवं मानसिक व्यग्रता',
      concernOption5: 'संपूर्ण पंचकर्म शोधन चिकित्सा',
    },
    booking: {
      title: 'अपना आयुर्वेदिक परामर्श बुक करें',
      subtitle:
        'अपनी मुख्य स्वास्थ्य समस्या चुनें, चिकित्सक का चयन करें और चिकित्सालय अथवा ऑनलाइन वीडियो परामर्श निश्चित करें।',
      steps: {
        concern: 'स्वास्थ्य समस्या',
        doctor: 'वैद्य एवं माध्यम',
        slot: 'तिथि एवं समय स्लॉट',
        details: 'रोगी विवरण',
        review: 'समीक्षा एवं सहमति',
        confirm: 'परामर्श प्रमाण पत्र',
      },
      modeClinic: 'चिकित्सालय में (सिविल लाइन्स, जयपुर)',
      modeVideo: 'ऑनलाइन वीडियो परामर्श',
      consultFee: 'परामर्श शुल्क',
      patientName: 'रोगी का पूरा नाम',
      phoneLabel: 'व्हाट्सएप मोबाइल (+91)',
      ageLabel: 'आयु (वर्षों में)',
      genderLabel: 'लिंग',
      female: 'महिला',
      male: 'पुरुष',
      other: 'अन्य',
      concernLabel: 'रोग के मुख्य लक्षण एवं समस्या',
      consentText:
        'मैं शास्त्रीय नाड़ी परीक्षा एवं आयुर्वेदिक परामर्श के नियमों तथा चिकित्सालय प्रोटोकॉल से सहमत हूँ।',
      submitBtn: 'पुष्टि करें एवं टोकन प्राप्त करें',
      nextBtn: 'अगले चरण पर जाएं',
      backBtn: 'पीछे जाएं',
      voucherTitle: 'आधिकारिक परामर्श टोकन प्रमाण पत्र',
      printPdf: 'पीडीएफ प्रिंट / डाउनलोड करें',
      addToCalendar: 'गूगल कैलेंडर में जोड़ें',
      shareWhatsApp: 'व्हाट्सएप पर साझा करें',
    },
    footer: {
      mission:
        'महर्षि चरक एवं सुश्रुत की प्राचीन चिकित्सा पद्धति को समर्पित। हम केवल लक्षणों का नहीं, बल्कि मूल कारण (दोष-दूष्य सम्मूर्च्छना) का उपचार करते हैं।',
      clinicalCreed: 'चिकित्सीय ध्येय वाक्य',
      creedSanskrit: 'स्वस्थस्य स्वास्थ्य रक्षणं आतुरस्य विकार प्रशमनं च॥',
      creedMeaning: 'स्वस्थ व्यक्ति के स्वास्थ्य की रक्षा करना तथा रोगी के विकारों का शमन करना।',
      quickLinks: 'त्वरित संपर्क',
      therapies: 'शास्त्रीय चिकित्साएं',
      clinicInfo: 'चिकित्सालय विवरण',
      hoursTitle: 'परामर्श समय',
      hoursMonSat: 'सोमवार – शनिवार: प्रातः 09:00 – सायं 07:30',
      hoursSun: 'रविवार: केवल पूर्व अपॉइंटमेंट द्वारा',
      address: '४२, राजभवन मार्ग, सिविल लाइन्स, जयपुर, राजस्थान ३०२००६',
      phone: '+91 141 239 8800',
      disclaimer:
        'वैधानिक सूचना: प्रत्येक व्यक्ति की चिकित्सा उसकी प्रकृति एवं विकृति के अनुरूप भिन्न होती है। इसे स्व-चिकित्सा का आधार न बनाएं।',
      copyright: '© २०२६ आरोग्यम आयुर्वेदिक चिकित्सालय एवं शोध केंद्र। सर्वाधिकार सुरक्षित।',
      regLine: 'चिकित्सालय पंजीकरण: आयुष-आरजे-2018-0482 · जीएमपी प्रमाणित औषधालय',
      newsletterTitle: 'आरोग्य अमृत पत्रिका',
      newsletterPlaceholder: 'अपना ईमेल दर्ज करें',
      newsletterBtn: 'सदस्यता लें',
    },
  },
};

