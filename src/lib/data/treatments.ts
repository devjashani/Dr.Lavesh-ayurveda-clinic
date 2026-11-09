import { Treatment } from './types';

export const treatments: Treatment[] = [
  // 1. VAMANA
  {
    id: 'vamana',
    slug: 'vamana',
    name: 'Vamana Karma',
    sanskritName: 'वमन कर्म (ऊर्ध्वभाग शोधन)',
    category: 'Panchakarma',
    primaryDosha: 'Kapha',
    tagline: 'Therapeutic emesis targeting deep-seated Kapha toxins and upper respiratory congestion.',
    shortDescription:
      'A classical bio-cleansing protocol designed to eliminate aggravated Kapha dosha from the stomach (Amashaya) and respiratory micro-channels.',
    longDescription:
      'Vamana Karma is the premier therapy among the five classical Panchakarma evacuations for disorders where Kapha is the primary morbid factor. Documented in the Charaka Samhita Kalpasthana, Vamana acts at the root seat of Kapha — the stomach and chest. Following systematic preparatory internal and external unction (Snehana and Swedana), the liquefied toxins migrate from peripheral tissues into the gastrointestinal tract, where they are gently expelled under continuous physician supervision using classical decoctions like Madanaphala and Yashtimadhu.',
    indications: [
      'Chronic Bronchial Asthma (Tamaka Shwasa) in remission phase',
      'Allergic Rhinitis, Chronic Sinusitis & Post-Nasal Drip',
      'Kapha-predominant Skin Dermatoses (Kushta)',
      'Sluggish Metabolism, Hypothyroid Support & Heaviness',
      'Recurrent Tonsillitis & Upper Respiratory Mucosal Congestion',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Preparation · 3–5 Days)',
        title: 'Deepana, Pachana & Medicated Snehapana',
        description:
          'Daily administration of escalating doses of medicated ghee (such as Tiktaka Ghrita) at sunrise to loosen fat-soluble toxins, followed by whole-body herbal steam fomentation on the final evening.',
        duration: '3 to 5 Days',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Therapeutic Emesis · Morning Session)',
        title: 'Monitored Administration of Emetic Formulations',
        description:
          'In the Kapha hours of early morning, the patient is administered a soothing draught of milk or sugarcane juice, followed by a calibrated decoction of Madanaphala (Randia dumetorum) and Licorice. Gentle, controlled emesis occurs rhythmically while pulse, blood pressure, and urges (Vegas) are clinically logged.',
        duration: '90–120 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Post-Therapy Care · 3–7 Days)',
        title: 'Dhumapana & Samsarjana Krama Diet',
        description:
          'Gentle inhalation of medicated herbal smoke (Dhumapana) to clear residual cranial passages, followed by a strict graduated nutritional ladder progressing from light warm rice water (Manda) to rice gruel (Peya) and mung soup (Yusha) to rekindle digestive fire (Agni).',
        duration: '3 to 7 Days',
      },
    ],
    duration: '7 to 10 Days comprehensive protocol',
    durationMinutes: 120,
    priceRange: '₹14,000 – ₹18,000 (Complete Protocol)',
    priceEstimate: '₹16,000 for 7-day protocol',
    whatToExpect:
      'During the preliminary days, you may feel mild digestive fullness and natural lethargy as toxins dislodge. On the therapy morning, emesis is gentle and rhythmic, without painful dry retching. Following the procedure, patients universally report an immediate lightness in the chest, heightened sensory acuity, and clear respiration.',
    precautions: [
      'Follow the prescribed liquid-only preparatory dinner strictly the evening prior.',
      'Refrain from day sleep, air conditioning, and cold water exposure during the entire protocol.',
      'Maintain sexual abstinence and avoid emotional stress or intense physical exertion.',
      'Do not suppress natural bodily urges such as yawning or sneezing during recovery.',
    ],
    whoShouldAvoid: [
      'Individuals with active hypertension or unstable cardiovascular conditions',
      'Patients with active peptic ulcers, hematemesis, or hiatus hernia',
      'Pregnant women or those currently menstruating',
      'Severely emaciated individuals or children under 12 years of age',
      'Those with acute exhaustion, dehydration, or recent ocular surgery',
    ],
    contraindications: [
      'Hypertension',
      'Active peptic ulceration',
      'Cardiac history',
      'Pregnancy',
      'Severe general emaciation',
    ],
    faqs: [
      {
        question: 'Is Vamana painful or violent like food poisoning vomiting?',
        answer:
          'No. Unlike sudden food poisoning vomiting which causes acidic abdominal spasms, classical Vamana is preceded by internal lubrication (Snehana) with medicinal ghee. The throat and esophagus are shielded by soothing drinks, making the expulsion smooth, effortless, and calming.',
      },
      {
        question: 'Why do I need to drink medicated ghee for several days beforehand?',
        answer:
          'Medicated ghee penetrates deep lipid barriers and cellular membranes across your body. It binds hydrophobic toxins (Ama) and directs them toward the digestive tract so they can be evacuated without tissue damage.',
      },
      {
        question: 'What diet must I follow after the therapy day?',
        answer:
          'Because the digestive fire (Agni) is deliberately cooled after cleansing, you follow Samsarjana Krama — a calibrated 3-to-7 day sequence starting with strained thin warm rice water (Manda), progressing to thick rice gruel (Peya), seasoned mung soup (Yusha), and finally soft cooked grains.',
      },
    ],
    relatedSlugs: ['virechana', 'nasya-karma', 'gastric-agni-care'],
    featuredImage: '/images/treatments/panchakarma.jpg',
    herbsUsed: ['Madanaphala', 'Yashtimadhu (Licorice)', 'Vacha', 'Pippali', 'Saindhava Lavana'],
    featured: false,
    aliases: ['vamana-karma'],
  },

  // 2. VIRECHANA
  {
    id: 'virechana',
    slug: 'virechana',
    name: 'Virechana Karma',
    sanskritName: 'विरेचन कर्म (अधोभाग शोधन)',
    category: 'Panchakarma',
    primaryDosha: 'Pitta',
    tagline: 'Targeted therapeutic purgation clearing morbid Pitta, hepatic heat, and inflammatory toxins.',
    shortDescription:
      'The classical gold standard for Pitta disorders, systematically flushing accumulated heat toxins from the liver, gallbladder, and small intestine.',
    longDescription:
      'Virechana Karma is the second cardinal evacuation procedure of classical Panchakarma, expelling morbid Pitta and inflammatory toxins (Rakta dushti) downward through the bowels. In the Ayurvedic paradigm, the small intestine (Grahani) and liver are the central seats of Pitta dosha. When heat and bile accumulate due to diet, stress, or seasonal factors (Sharad Ritu), Virechana cleanses these organs at a cellular level, cooling the blood, supporting healthy skin turnover, and regulating liver enzymes.',
    indications: [
      'Plaque Psoriasis, Eczema, Dermatitis & Urticaria (Sheetapitta)',
      'Chronic Hyperacidity, GERD & Bile Reflux (Amlapitta)',
      'Hepatic Congestion, Non-Alcoholic Fatty Liver Support & Jaundice',
      'Chronic Migraine with Visual Auras & Throbbing Heat Sensations',
      'Recurrent Boils, Acne Vulgaris & Inflammatory Blood Impurities',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Preparation · 4–7 Days)',
        title: 'Agni Deepana & Medicated Snehapana',
        description:
          'Administration of bitter cooling medicated ghee (such as Mahatiktaka Ghrita or Guggulutiktaka Ghrita) in calibrated morning doses to bind lipophilic hepatic toxins, followed by gentle unctuous warm oil massages (Abhyanga) and herbal steam.',
        duration: '4 to 7 Days',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Purgation Morning)',
        title: 'Administration of Calibrated Virechana Herbals',
        description:
          'At roughly 8:30 AM after physician verification of bowel sounds and pulse, a classical herbal purgative (Trivrit Lehyam, Avipattikar Churna, or Eranda Tailam) is administered in lukewarm water. Evacuation unfolds smoothly over 3 to 5 hours with zero abdominal cramping.',
        duration: '4–5 Hours observation',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Graduated Nourishment · 3–5 Days)',
        title: 'Samsarjana Krama & Hydration Protocol',
        description:
          'Once bowel activity concludes naturally, the patient receives warm electrolyte decoctions followed by warm freshly cooked light rice broths and cumin-infused water to gradually restore enzymatic vitality.',
        duration: '3 to 5 Days',
      },
    ],
    duration: '8 to 12 Days full clinical protocol',
    durationMinutes: 90,
    priceRange: '₹12,500 – ₹16,500 (Complete Protocol)',
    priceEstimate: '₹14,500 for 7-day protocol',
    whatToExpect:
      'The morning of Virechana produces regular, effortless bowel movements accompanied by a gradual release of systemic internal heat. You may experience mild thirst and cool sensations in the limbs. Post-procedure rest brings profound mental calm, clearer skin complexion, and a feeling of internal freshness.',
    precautions: [
      'Sip only warm water during the purgation day; cold beverages are strictly prohibited.',
      'Rest in a tranquil, draft-free room without exposure to direct noon sun or heavy electronic screens.',
      'Refrain from heavy, oily, spicy, or sour foods for at least 7 days post-procedure.',
      'Do not engage in high-intensity cardiovascular workouts until the physician grants clearance.',
    ],
    whoShouldAvoid: [
      'Individuals suffering from active ulcerative colitis or bleeding hemorrhoids',
      'Patients with acute diarrhea, dysentery, or severe dehydration',
      'Pregnant or lactating mothers',
      'Patients recovering from recent abdominal surgery or severe physical trauma',
      'Elderly frail patients with profound loss of muscular tone (Alpa Bala)',
    ],
    contraindications: [
      'Active ulcerative colitis',
      'Bleeding rectal fissures',
      'Severe dehydration',
      'Pregnancy',
      'Recent bowel surgery',
    ],
    faqs: [
      {
        question: 'Will Virechana cause painful abdominal cramps or diarrhea?',
        answer:
          'No. Unlike chemical over-the-counter laxatives that irritate the colon lining, Virechana is administered only after extensive internal lubrication (Snehana). The bowel evacuations are smooth, water-assisted, and non-spasmodic.',
      },
      {
        question: 'How does Virechana help stubborn skin disorders like psoriasis?',
        answer:
          'According to classical dermatological treatises (Kushta Chikitsa), skin pathologies originate from disturbed Rakta (blood) and Pitta doshas. The liver is the principal filter for blood. Virechana flushes metabolic toxins from the hepatic-biliary axis, addressing the foundational trigger of autoimmune skin flare-ups.',
      },
      {
        question: 'Can I continue my regular work during the Virechana protocol?',
        answer:
          'During the preparatory ghee days, you can maintain light desk work. On the actual purgation day (Pradhana Karma) and the subsequent 48 hours, full physical rest at home or in our clinic day-ward is strongly advised.',
      },
    ],
    relatedSlugs: ['raktamokshana', 'gastric-agni-care', 'basti-karma'],
    featuredImage: '/images/treatments/herbs.jpg',
    herbsUsed: ['Trivrit (Operculina turpethum)', 'Haritaki', 'Eranda Tailam', 'Kutki', 'Amalaki'],
    featured: false,
    aliases: ['virechana-karma'],
  },

  // 3. BASTI KARMA
  {
    id: 'basti-karma',
    slug: 'basti-karma',
    name: 'Basti Karma',
    sanskritName: 'बस्ति कर्म (अर्धचिकित्सा)',
    category: 'Panchakarma',
    primaryDosha: 'Vata',
    tagline: 'Revered in classical texts as half of all Ayurvedic medicine: medicated enema therapy for Vata rejuvenation.',
    shortDescription:
      'The supreme therapy for chronic Vata disorders, utilizing calibrated herbal decoctions and unctuous medicated oils to pacify degenerative conditions.',
    longDescription:
      'Maharishi Charaka famously stated that Basti constitutes 50% of the entire Ayurvedic pharmacopeia (Ardha Chikitsa). Because the colon (Pakwashaya) is the primary reservoir and control room of Vata dosha, systemic degeneration, joint decay, neuro-muscular atrophy, and chronic lower back pain originate here. Basti introduces micro-emulsified medicinal decoctions (Niruha) and lipid carriers (Anuvasana) into the rectal mucosa, nourishing the enteric nervous system and balancing bone-mineral metabolism (Asthi Dhatu).',
    indications: [
      'Sciatica, Lumbar Disc Herniation & Degenerative Disc Disease',
      'Osteoarthritis (Sandhigata Vata) & Ankylosing Spondylitis',
      'Motor Neuron Disorders, Parkinsonism & Peripheral Neuropathy',
      'Chronic Constipation, Spastic Colon & Abdominal Bloating',
      'Premature Sarcopenia, Post-Menopausal Bone Density Loss & Chronic Fatigue',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Pre-Basti Massage & Steam)',
        title: 'Localized Abhyanga & Nadi Swedana',
        description:
          'The lower abdomen, sacrum, and lower extremities are treated with warm medicated Vata-pacifying oils (Sahacharadi Tailam) followed by focused herbal steam to relax the pelvic floor and dilate local micro-channels (Srotas).',
        duration: '30 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Therapeutic Administration)',
        title: 'Calibrated Infusion of Anuvasana or Niruha Basti',
        description:
          'The patient lies in the classical left lateral Sims posture. Using specialized sterile equipment, warm medicated oil (Anuvasana) or a freshly emulsified warm decoction of Dashamoola, honey, rock salt, and herbal paste (Niruha) is infused gently without pressure.',
        duration: '20–30 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Retention & Rest)',
        title: 'Monitored Retention & Warm Hydration',
        description:
          'The patient rests flat while the therapist gently pats the buttocks and sacrum to facilitate painless retention. Oil bastis are retained for hours; decoction bastis evacuate naturally within 15 to 45 minutes, followed by a warm shower and light khichdi.',
        duration: '45–60 Minutes',
      },
    ],
    duration: '8-day (Yoga Basti) to 15-day (Kala Basti) protocol',
    durationMinutes: 60,
    priceRange: '₹16,000 – ₹24,000 (8-Day Yoga Basti Cycle)',
    priceEstimate: '₹18,000 for 8-day Yoga Basti protocol',
    whatToExpect:
      'Administration is virtually painless and feels like a warm sensation in the pelvic region. Niruha (decoction) induces a thorough and deeply satisfying release of trapped pelvic gas and compacted fecal matter. Anuvasana (oil) is retained comfortably and produces profound systemic groundedness and joint lubrication.',
    precautions: [
      'Take only a light, warm meal about 2 hours before an Anuvasana (oil) Basti session.',
      'Niruha (decoction) Basti must be taken on an empty stomach in the morning.',
      'Avoid air conditioning, cold showers, long drives, and strenuous physical exertion on therapy days.',
      'Sip warm cumin-infused water throughout the day to support intestinal mobility.',
    ],
    whoShouldAvoid: [
      'Patients with active, heavily bleeding anorectal piles or acute anal fissures',
      'Individuals with acute systemic fever (Nava Jwara) or severe indigestion with undigested toxins (Ama)',
      'Immediately following heavy meals or during acute cholera/dysentery',
      'Patients with intestinal obstruction or suspected bowel perforation',
    ],
    contraindications: [
      'Active bleeding piles',
      'Acute anal fissures',
      'Acute fever with Ama',
      'Intestinal obstruction',
      'Severe diarrhea',
    ],
    faqs: [
      {
        question: 'Is Basti simply a modern water colon-cleanser or colonic irrigation?',
        answer:
          'No. Commercial colon hydrotherapy uses gallons of ordinary water to forcibly wash the bowel, which Ayurveda warns can severely aggravate Vata dosha and dry out the mucosa. Basti uses calibrated, lipophilic herbal emulsions (warm oils, decoctions, rock salt, and wild honey) that nourish the mucosal lining and enter systemic circulation via mesenteric lymphatics.',
      },
      {
        question: 'What is the difference between Yoga Basti and Kala Basti?',
        answer:
          'Yoga Basti is an 8-day course consisting of 5 oil bastis and 3 decoction bastis, ideal for moderate joint stiffness and constipation. Kala Basti is a comprehensive 16-day schedule recommended for entrenched neurological deficits, chronic sciatica, and autoimmune arthritis.',
      },
      {
        question: 'Will I be able to retain the oil during my daily routine?',
        answer:
          'Yes. Anuvasana Basti uses small volumes (60–100 ml) of warm herbal oil that the colon absorbs naturally. Most patients experience zero urgency and retain the oil comfortably for 4 to 12 hours.',
      },
    ],
    relatedSlugs: ['kati-basti', 'abhyanga-swedana', 'janu-basti'],
    featuredImage: '/images/treatments/shirodhara.jpg',
    herbsUsed: ['Dashamoola', 'Bala (Sida cordifolia)', 'Sahacharadi Tailam', 'Ksheerabala', 'Saindhava Lavana'],
    featured: false,
    aliases: ['basti'],
  },

  // 4. NASYA KARMA
  {
    id: 'nasya-karma',
    slug: 'nasya-karma',
    name: 'Nasya Karma',
    sanskritName: 'नस्य कर्म (शिरोविरेचन)',
    category: 'Panchakarma',
    primaryDosha: 'Kapha',
    tagline: 'Trans-nasal cranial therapy clearing sinuses, cervical tension, and soothing upper-clavicular neural pathways.',
    shortDescription:
      'The classical gateway to the head (Nasa hi Shiraso Dwaram), infusing medicated herbal oils into the nasal passages to clear sinus channels and cranial micro-circulation.',
    longDescription:
      'In Ayurvedic anatomical treatises, the nostrils are considered the direct doorway to the cranial vault and sensory organs (Indriyas). Nasya Karma utilizes this unique trans-mucosal pathway to deliver potent neuro-protective herbs directly to the brain, olfactory bulb, and paranasal sinuses. Following thorough facial Marma stimulation and warm herbal steam, drops of classical formulations like Anu Thailam or Shadbindu Taila are administered, liquefying stagnant mucus, relieving migraine pressure, and nourishing cervical nerve roots.',
    indications: [
      'Chronic Migraine, Cluster Headaches & Hemicrania (Ardhavabhedaka)',
      'Cervical Spondylosis, Stiff Neck & Trapezius Muscle Spasms',
      'Chronic Allergic Sinusitis, Post-Nasal Drip & Deviated Septum Congestion',
      'Premature Greying of Hair, Hair Thinning & Alopecia Areata support',
      'Facial Nerve Palsy (Ardita), Tinnitus & Frozen Shoulder (Apabahuka)',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Facial Preparation)',
        title: 'Mukha Abhyanga & Nadi Swedana',
        description:
          'Gentle circular massage of the forehead, temples, cheekbones, and neck using warm herbal oils (such as Ksheerabala), followed by focused herbal steam towel wraps to liquefy dense mucosal secretions.',
        duration: '20 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Nasal Instillation)',
        title: 'Drops of Medicated Oil in Supine Posture',
        description:
          'With the head slightly tilted backwards, the physician administers 4 to 8 drops of warm medicated herbal oil (Anu Thailam or Shadbindu Taila) into each nostril while the patient inhales gently. The soles, palms, and neck are simultaneously massaged.',
        duration: '15 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Elimination & Soothing)',
        title: 'Gargling, Kavala & Medicated Smoke (Dhumapana)',
        description:
          'The patient expels any secretions draining into the back of the throat without swallowing. A warm salt-water gargle and optional mild herbal smoke inhalation soothe the throat and seal the mucosal lining against cold air.',
        duration: '15 Minutes',
      },
    ],
    duration: '45 to 60 Minutes per session (7-day course recommended)',
    durationMinutes: 45,
    priceRange: '₹1,200 – ₹1,800 per session / ₹8,500 (7-Day Course)',
    priceEstimate: '₹1,400 per session',
    whatToExpect:
      'Immediately upon oil instillation, you will feel a warm sensation in the sinuses and behind the eyes. Mucus will loosen and drain into the throat, which you will spit out into a sterile bowl. Within 15 minutes of rinsing, patients experience a dramatic sensation of mental lightness, cleared sinuses, and reduced neck stiffness.',
    precautions: [
      'Do not consume cold water, ice creams, or refrigerated meals for 24 hours following Nasya.',
      'Protect the head and ears from strong wind, air conditioning drafts, and direct sunlight.',
      'Do not take a cold head shower on the day of therapy.',
      'Avoid daytime naps immediately after the procedure.',
    ],
    whoShouldAvoid: [
      'Individuals immediately after a heavy meal or with severe acute indigestion',
      'Patients with acute viral rhinitis with high fever and yellow purulent discharge',
      'Intoxicated persons or immediately after excessive alcohol consumption',
      'Immediately following an exhausting long walk or during active heavy bleeding',
      'Children under 7 years or adults over 80 years for intensive Marsha Nasya (mild Pratimarsha is allowed)',
    ],
    contraindications: [
      'Acute coryza with active fever',
      'Immediately after heavy meals',
      'Severe respiratory distress',
      'Immediate post-bath state',
    ],
    faqs: [
      {
        question: 'Does the medicated oil burn or sting the nostrils?',
        answer:
          'A mild, brief tingling or tickling sensation is completely normal for 1 to 2 minutes as the herbal compounds penetrate the sinus membranes. It is quickly soothed by warm throat gargles and rhythmic breathing.',
      },
      {
        question: 'Can Nasya help with my chronic cervical spondylosis and shoulder pain?',
        answer:
          'Yes. Classical texts classify cervical pain as Manyastambha (stiff neck), an upper-body Vata disorder. Nasya stimulates the cranial nerves and vascular plexus that supply the neck muscles, helping relieve deep fascial spasm.',
      },
      {
        question: 'How many sessions are recommended for chronic sinusitis or migraine?',
        answer:
          'A classical cycle of 7 consecutive days (Navana Nasya) is standard. For deeply entrenched conditions, two 7-day cycles spaced 2 weeks apart provide optimal clinical outcomes.',
      },
    ],
    relatedSlugs: ['shirodhara', 'greeva-basti', 'vamana'],
    featuredImage: '/images/treatments/apothecary.jpg',
    herbsUsed: ['Anu Thailam', 'Shadbindu Taila', 'Ksheerabala 101', 'Karpura (Camphor)', 'Vacha'],
    featured: false,
    aliases: ['nasya'],
  },

  // 5. RAKTAMOKSHANA
  {
    id: 'raktamokshana',
    slug: 'raktamokshana',
    name: 'Raktamokshana (Jalaukavacharana)',
    sanskritName: 'रक्तमोक्षण (जलौकावचारण)',
    category: 'Skin & Hair',
    primaryDosha: 'Pitta',
    tagline: 'Classical bio-purification using medical leeches to eliminate localized toxic blood and venous stasis.',
    shortDescription:
      'Sushruta’s classical bloodletting therapy utilizing medicinal leeches (Jalauka) to drain deep-seated Pitta-Rakta toxins from chronic skin lesions and congested veins.',
    longDescription:
      'Pioneered in the surgical treatise Sushruta Samhita, Jalaukavacharana (leech therapy) is the gentlest and most refined method of Raktamokshana. When inflammatory toxins (Ama and morbid Pitta) vitiate the blood tissue (Rakta Dhatu), stubborn chronic conditions like varicose ulcers, psoriatic plaques, and eczema fail to respond to oral medications alone. Medical leeches selectively extract deoxygenated, inflamed blood while injecting powerful bio-active peptides (including hirudin, calin, and vasodilators) that dissolve micro-clots, reduce tissue edema, and promote healthy micro-capillary revascularization.',
    indications: [
      'Chronic Plaque Psoriasis & Non-Healing Eczematous Lesions',
      'Varicose Veins, Venous Stasis Dermatitis & Deep Venous Congestion',
      'Acute Gouty Arthritis Flare-ups (Vatarakta)',
      'Alopecia Areata (Indralupta) & Patchy Hair Loss with Scalp Congestion',
      'Diabetic Foot Ulcers (under sterile integrative medical supervision)',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Lesion Preparation & Leech Activation)',
        title: 'Skin Disinfection & Leech Awakening',
        description:
          'The target site is cleansed thoroughly with sterile water and turmeric decoction. Certified, laboratory-bred medicinal leeches (Hirudo medicinalis / Nirvisha Jalauka) are awakened in turmeric-infused water to stimulate active appetite.',
        duration: '15 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Application & Attachment)',
        title: 'Controlled Attachment & Bio-Active Secretion',
        description:
          'The leech is guided to the lesion edge. Once it attaches (forming the characteristic horseshoe bite), a moist sterile cotton gauze is placed over it. The leech feeds painlessly for 30 to 60 minutes, removing 10–20 ml of toxic venous blood while infusing natural anti-inflammatory enzymes.',
        duration: '45–60 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Detachment & Wound Care)',
        title: 'Haridra Dusting & Sterile Compression Bandage',
        description:
          'The leech releases voluntarily or is gently coaxed with turmeric powder. The puncture wound is dusted with classical Shatadhouta Ghrita and pure Haridra (Turmeric) powder, followed by a sterile pressure dressing to permit beneficial weeping of fluid for a few hours.',
        duration: '20 Minutes',
      },
    ],
    duration: '60 to 90 Minutes per sitting (3 to 5 sessions spaced weekly)',
    durationMinutes: 60,
    priceRange: '₹2,500 – ₹4,000 per sitting (Includes sterile leeches & dressings)',
    priceEstimate: '₹3,000 per sitting',
    whatToExpect:
      'The initial attachment feels like a brief, minor ant bite lasting less than 30 seconds, after which the saliva’s natural anesthetic properties render the area completely numb. Following detachment, mild continuous oozing of dark fluid for 4 to 8 hours is expected and therapeutic. Skin discoloration and swelling typically decrease significantly within 48 hours.',
    precautions: [
      'Keep the sterile dressing undisturbed and dry for at least 12 hours post-session.',
      'Refrain from scratching the bite mark as it begins to heal; apply sterile coconut oil if itchy.',
      'Avoid strenuous exercise, hot sauna baths, and swimming for 48 hours.',
      'A baseline complete blood count (CBC) and bleeding profile is verified before the first session.',
    ],
    whoShouldAvoid: [
      'Patients with diagnosed hemophilia, severe thrombocytopenia, or active bleeding diathesis',
      'Patients on high-dose modern anticoagulant or blood-thinner medications',
      'Severely anemic individuals with Hemoglobin levels below 9 g/dL',
      'Active systemic sepsis or uncontrolled high-grade bacterial infections',
      'Patients with known severe allergic reactions to leech saliva',
    ],
    contraindications: [
      'Hemophilia',
      'Severe anemia (Hb < 9 g/dL)',
      'High-dose anticoagulants',
      'Active systemic bacteremia',
    ],
    faqs: [
      {
        question: 'Are the medical leeches reused between different patients?',
        answer:
          'Never. At Aarogyam Ayurveda, we maintain the strictest international bio-safety protocols. Every medicinal leech is used exclusively for one patient and is subsequently ethically preserved or disposed of in accordance with clinical bio-waste regulations. There is zero cross-contamination risk.',
      },
      {
        question: 'Does the procedure hurt?',
        answer:
          'Aside from a minor prick akin to a mosquito or small ant bite for the first 20 seconds, the therapy is painless. The leech secretes a natural anesthetic in its saliva that numbs the local cutaneous nerve endings throughout the session.',
      },
      {
        question: 'Why does the wound continue to bleed after the leech drops off?',
        answer:
          'Leech saliva contains hirudin, a natural compound that prevents blood clotting for a few hours. This continuous gentle oozing is clinically deliberate; it decongests stagnant capillary beds and expels residual inflammatory fluid.',
      },
    ],
    relatedSlugs: ['virechana', 'abhyanga-swedana', 'netra-tarpana'],
    featuredImage: '/images/treatments/herbs.jpg',
    herbsUsed: ['Nirvisha Jalauka', 'Haridra (Curcuma longa)', 'Triphala Kwatha', 'Shatadhouta Ghrita', 'Yashtimadhu'],
    featured: false,
    aliases: ['rakta-mokshana'],
  },

  // 6. SHIRODHARA
  {
    id: 'shirodhara',
    slug: 'shirodhara',
    name: 'Shirodhara Therapy',
    sanskritName: 'शिरोधारा (मूर्धतैल विधानम्)',
    category: 'Lifestyle & Metabolic',
    primaryDosha: 'Vata',
    tagline: 'Continuous, meditative pouring of warm herbalized oils over the forehead, soothing brainwave rhythms and sleep cycles.',
    shortDescription:
      'A deeply restorative classical neuro-sensory therapy where a steady, rhythmic stream of warm herbal oil is poured across the third-eye center (Ajna Marma).',
    longDescription:
      'Shirodhara is renowned worldwide as Ayurveda’s most sublime mind-body therapy. The term derives from the Sanskrit words Shiras (head) and Dhara (continuous stream). During the session, warm, medicated herbal oil (or herbal decoctions, buttermilk, or milk depending on Prakriti) flows from a suspended copper vessel in a continuous, oscillating arc across the forehead. This continuous rhythmic pressure stimulates the micro-circulation of the hypothalamus, dampens excessive sympathetic nervous system activation, balances Prana Vayu and Tarpaka Kapha, and shifts the brain into restorative alpha and theta brainwave states.',
    indications: [
      'Chronic Insomnia, Fragmented Sleep & Circadian Rhythm Dysregulation',
      'Generalized Anxiety, Chronic Occupational Stress & Mental Fatigue',
      'Hypertension & Elevated Sympathetic Nervous Tension',
      'Tension Headaches, Stress-Induced Migraine & Cognitive Fog',
      'Post-Traumatic Stress, Emotional Grief & Nervous Breakdown Recovery',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Sensory Grounding)',
        title: 'Head, Neck & Shoulder Shiro-Abhyanga',
        description:
          'The patient is comfortably positioned on an unctuous teakwood Droni table. A gentle 15-minute scalp, neck, and shoulder massage using warm Brahmi or Ksheerabala oil grounds the sensory organs and prepares the nervous system.',
        duration: '15 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (The Flowing Stream)',
        title: 'Oscillating Rhythmic Shirodhara Stream',
        description:
          'Warm medicated herbal oil at exact body temperature (37–38°C) is steadily poured from a copper Dhara vessel onto the forehead. The therapist moves the stream in hypnotic rhythmic patterns across the Ajna and Murdha Marma points while soothing classical ragas play softly.',
        duration: '40–50 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Integration & Rest)',
        title: 'Scalp Cleansing, Ear Protection & Rest',
        description:
          'Excess oil is gently wiped, the scalp is swaddled in a warm towel, and ears are protected with organic cotton plugs. The patient rests in a quiet dimly lit recovery room while sipping warm ginger-licorice infusion.',
        duration: '20 Minutes',
      },
    ],
    duration: '60 to 75 Minutes per session (3, 7, or 14-day cycles)',
    durationMinutes: 60,
    priceRange: '₹2,400 – ₹3,200 per session / ₹15,000 (7-Day Program)',
    priceEstimate: '₹2,600 per session',
    whatToExpect:
      'Within minutes of the warm oil touching your forehead, your racing thoughts slow down dramatically. Most patients enter a twilight state between waking and sleep (Yoga Nidra). You will emerge feeling deeply centered, emotionally calm, and pleasantly unhurried.',
    precautions: [
      'Do not wash your oiled hair with cold water on the same day; use warm water with gentle herbal powders (Shikakai).',
      'Keep your head, ears, and neck shielded from direct ceiling fan blasts, air conditioning, and cold winds.',
      'Refrain from screens, loud music, intense meetings, or driving long distances immediately after the session.',
      'Avoid heavy, oily, or chilled meals following your treatment.',
    ],
    whoShouldAvoid: [
      'Individuals with acute high fever, active chills, or severe head cold with thick sinus congestion',
      'Patients with active, open scalp wounds, severe weeping scalp infections, or recent cranial trauma',
      'Severe nausea, vomiting, or acute food intoxication',
      'Patients experiencing extreme acute psychosis or unmonitored manic agitation',
    ],
    contraindications: [
      'Acute coryza and fever',
      'Open scalp lesions',
      'Severe acute nausea',
      'Recent skull trauma',
    ],
    faqs: [
      {
        question: 'What kind of oil is used during Shirodhara?',
        answer:
          'The oil is strictly chosen based on your constitution (Prakriti) and current imbalance. We frequently formulate warm sesame oils infused with Brahmi, Ashwagandha, Jatamansi, and Chandana. For high Pitta heat or migraines, cooling Takradhara (medicated buttermilk) or Ksheeradhara (medicated herbal milk) is utilized.',
      },
      {
        question: 'How many sessions will I need to see improvements in insomnia?',
        answer:
          'While a single session provides immediate stress reduction and deep relaxation, lasting resolution of chronic sleep architecture disturbances typically requires a minimum sequence of 7 consecutive daily sessions.',
      },
      {
        question: 'Can I wash my hair immediately after the therapy?',
        answer:
          'We recommend leaving the medicinal oil on your scalp for at least 2 to 3 hours (or overnight if comfortable) so the nourishing lipid-soluble phytonutrients can penetrate the cranial micro-vessels. When washing, use lukewarm water and our natural herbal hair wash.',
      },
    ],
    relatedSlugs: ['nasya-karma', 'abhyanga-swedana', 'kati-basti'],
    featuredImage: '/images/treatments/shirodhara.jpg',
    herbsUsed: ['Brahmi (Bacopa monnieri)', 'Ashwagandha', 'Jatamansi', 'Ksheerabala Tailam', 'Shankhpushpi'],
    featured: true,
    aliases: ['shirodhara-therapy'],
  },

  // 7. ABHYANGA & SWEDANA
  {
    id: 'abhyanga-swedana',
    slug: 'abhyanga-swedana',
    name: 'Abhyanga & Swedana',
    sanskritName: 'अभ्यङ्ग एवं स्वेदन (स्नेहन-स्वेदन)',
    category: 'Spine & Joint',
    primaryDosha: 'Vata',
    tagline: 'Synchronized four-hand warm herbal oil massage followed by whole-body therapeutic botanical steam fomentation.',
    shortDescription:
      'The foundational daily therapy of classical Ayurveda, bathing the bodily tissues in medicated herbal oils to dissolve stiffness, pacify Vata, and promote lymphatic detoxification.',
    longDescription:
      'Documented in the Dinacharya chapters of Ashtanga Hridaya, Abhyanga is far more than a relaxing massage; it is an unctuous biological treatment. Two trained therapists execute synchronized, rhythmic strokes in the direction of arterial blood flow (Anuloma), guiding warm herbal oils through the seven anatomical tissue layers (Dhatus). This is immediately followed by Bashpa Swedana — a whole-body steam box treatment using decoctions of Dashamoola and Nirgundi that opens the sweat pores (Srotas), dislodges trapped metabolic wastes (Ama), and leaves joints supple and flexible.',
    indications: [
      'Generalized Body Aches, Fibromyalgia & Myofascial Pain Syndrome',
      'Early Osteoarthritis, Chronic Muscle Stiffness & Restricted Joint Mobility',
      'Systemic Vata Exhaustion, Burnout & Physical Emaciation (Karshya)',
      'Poor Peripheral Blood Circulation & Dry Cutaneous Scaling',
      'Post-Operative or Post-Viral Convalescence and Vitality Restoration',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Sensory Alignment)',
        title: 'Marmasthan Oil Application & Posture Setup',
        description:
          'The patient is seated comfortably on the teakwood Droni. Medicated herbal oil calibrated to the patient’s body constitution is applied to the vertex of the head (Shiro-Abhyanga) and feet (Pada-Abhyanga).',
        duration: '10 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Synchronized Four-Hand Body Massage)',
        title: 'Seven-Position Synchronized Anuloma Massage',
        description:
          'Two therapists apply continuous, pressurized rhythmic strokes across the entire body in seven classical positions (sitting, supine, right lateral, prone, left lateral, supine, sitting), systematically activating 107 Marma energy junctions.',
        duration: '50–60 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Herbal Steam Box & Bath)',
        title: 'Bashpa Swedana Steam & Snana',
        description:
          'The patient sits in an artisanal herbal steam chamber with the head kept cool and outside. Medicated vapor from Dashamoola herbs induces gentle, full-body diaphoresis. A warm herbal bath with natural gram flour (Snana Churna) removes excess surface oil.',
        duration: '20–25 Minutes',
      },
    ],
    duration: '75 to 90 Minutes per session',
    durationMinutes: 75,
    priceRange: '₹2,200 – ₹3,000 per session / ₹13,500 (7-Session Package)',
    priceEstimate: '₹2,400 per session',
    whatToExpect:
      'Warm medicated oils permeate the skin, producing an immediate release of muscular tightness. During the herbal steam chamber, you will sweat profusely, feeling metabolic heaviness melt away. Afterwards, your limbs feel unburdened, flexible, deeply rested, and your skin feels remarkably soft and nourished.',
    precautions: [
      'Do not eat a heavy meal within 2 hours before the treatment.',
      'Drink plenty of warm water or herbal infusion after sweating to support fluid balance.',
      'Avoid stepping into direct air conditioning or taking cold showers immediately following steam.',
      'Rest quietly for at least 1 hour post-session before engaging in driving or physical work.',
    ],
    whoShouldAvoid: [
      'Individuals with active acute fever (Nava Jwara) or severe bacterial infection',
      'Severe acute indigestion with heavy tongue coating (high Ama state)',
      'Acute infectious rashes or contagious skin dermatoses',
      'First trimester of pregnancy or active heavy menstruation',
      'Patients with active deep vein thrombosis (DVT) or acute phlebitis',
    ],
    contraindications: [
      'Active acute fever',
      'High systemic Ama (thick coated tongue)',
      'Deep vein thrombosis',
      'First trimester of pregnancy',
    ],
    faqs: [
      {
        question: 'How is authentic Ayurvedic Abhyanga different from a regular spa massage?',
        answer:
          'Commercial spa massages use neutral base oils with added fragrances mainly for muscular rubbing. Classical Abhyanga utilizes customized, pharmacologically active medicinal oils brewed for days with hundreds of classical herbs. The strokes are precisely aligned with Marma points and vascular channels to stimulate internal organ vitality.',
      },
      {
        question: 'Why is the head kept outside the herbal steam box?',
        answer:
          'Classical Ayurvedic physiology mandates that the brain, sensory eyes, and heart must never be subjected to excessive heat. Our steam chambers permit the whole body to experience detoxifying heat while keeping your cranial center cool and protected with cold herbal compresses.',
      },
      {
        question: 'How frequently should one undergo Abhyanga & Swedana?',
        answer:
          'While healthy individuals can receive Abhyanga weekly for longevity and immune strength (Ojas), those recovering from chronic musculoskeletal pain or burnout benefit most from an intensive 7-day to 14-day consecutive course.',
      },
    ],
    relatedSlugs: ['kati-basti', 'janu-basti', 'basti-karma'],
    featuredImage: '/images/treatments/abhyanga.jpg',
    herbsUsed: ['Mahanarayan Tailam', 'Kottakkal Dhanwantharam', 'Sahacharadi Tailam', 'Dashamoola', 'Nirgundi'],
    featured: false,
    aliases: ['abhyanga'],
  },

  // 8. KATI BASTI
  {
    id: 'kati-basti',
    slug: 'kati-basti',
    name: 'Kati Basti',
    sanskritName: 'कटि बस्ति (पृष्ठशूल शामक)',
    category: 'Spine & Joint',
    primaryDosha: 'Vata',
    tagline: 'Specialized warm herbal oil reservoir constructed over the lumbosacral spine for deep disc and sciatic nerve restoration.',
    shortDescription:
      'A targeted external retention therapy where warm, medicated anti-inflammatory oils are pooled over the lower back inside an organic black gram dough reservoir.',
    longDescription:
      'Kati Basti is one of Ayurveda’s most celebrated non-invasive interventions for lumbosacral pathologies. The word Kati denotes the lower back and Basti signifies retention. A sealed dam crafted from freshly kneaded black gram flour (Masha) is placed securely over the lumbar spine (typically L3–S1). Continuously replenished, warm, herbal-infused oils such as Mahanarayan and Sahacharadi are pooled inside the reservoir. The persistent therapeutic warmth and lipid-soluble phytocompounds penetrate deep through the paraspinal musculature, rehydrating degenerated intervertebral discs, easing sciatic nerve impingement, and restoring lumbar spinal flexibility.',
    indications: [
      'Lumbar Spondylosis, Disc Herniation (Bulge/Protrusion) & Sciatica (Gridhrasi)',
      'Chronic Lower Backache, Paraspinal Spasms & Sacroiliitis',
      'Spinal Canal Stenosis & Age-Related Facet Joint Arthropathy',
      'Post-Surgical Lumbar Stiffness & Postural Lower Back Strain',
      'Coccygodynia (Tailbone Pain) & Sacral Nerve Irritation',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Spine Preparation)',
        title: 'Prone Alignment & Reservoir Construction',
        description:
          'The patient lies prone on the treatment couch. A small dam is constructed from organic black-gram paste, shaped into a ring, and adhered leak-proof over the lumbosacral vertebrae.',
        duration: '15 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Medicated Oil Pooling)',
        title: 'Continuous Warm Herbal Oil Retention',
        description:
          'Warm medicated herbal oil (Mahanarayan and Murivenna) heated to a precise 40–42°C is slowly poured into the dough ring. As the oil cools, small amounts are systematically replaced with fresh warm oil, maintaining an unbroken therapeutic temperature throughout.',
        duration: '35–45 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Post-Pool Massage & Patra Pinda Swedana)',
        title: 'Dough Removal & Leaf Bolus Fomentation',
        description:
          'The oil is collected and the dough ring is gently removed. The lumbar region is treated with a brief restorative massage and warm herbal leaf bolus fomentation (Patra Pinda Swedana) to lock in the therapeutic heat.',
        duration: '15 Minutes',
      },
    ],
    duration: '45 to 60 Minutes per session (5 to 7-day course recommended)',
    durationMinutes: 45,
    priceRange: '₹1,500 – ₹2,200 per session / ₹9,500 (7-Day Program)',
    priceEstimate: '₹1,600 per session',
    whatToExpect:
      'The sensation of warm, fragrant herbal oil resting over your tight lumbar spine provides immediate comforting relief. Chronic muscle spasms unwind as the heat permeates deep into the spinal joints. Most patients experience significant reduction in sciatic radiating pain within 3 to 4 consecutive sessions.',
    precautions: [
      'Avoid sudden bending forward, lifting heavy weights, or long bumpy commutes after treatment.',
      'Wear a supportive lumbar binder if advised by Dr. Bohra during travel.',
      'Do not expose your bare lower back to cold air conditioning drafts or fans.',
      'Apply a warm hot water bag at night if mild soreness occurs during the first two days.',
    ],
    whoShouldAvoid: [
      'Patients with acute open wounds, active skin ulcers, or boils over the lumbosacral area',
      'Acute vertebral fractures, spinal cord compression with sudden loss of bladder/bowel control',
      'Known metastatic spinal tumors or active tuberculosis of the spine (Pott’s spine)',
      'Severe acute febrile illnesses or active inflammatory skin eruptions over the back',
    ],
    contraindications: [
      'Spinal cord compression with sphincter loss',
      'Recent vertebral fracture',
      'Spinal malignancies',
      'Open back lesions',
    ],
    faqs: [
      {
        question: 'Can Kati Basti help me avoid spinal disc surgery?',
        answer:
          'For mild to moderate lumbar disc bulges, protrusions, and sciatica, classical Kati Basti combined with internal herbal medicines and Yogic posture rehabilitation has helped hundreds of our patients avoid invasive surgical interventions. However, acute cauda equina syndrome with loss of bowel/bladder reflexes requires emergency surgical evaluation.',
      },
      {
        question: 'What is the black-gram dough ring made of?',
        answer:
          'The ring is crafted freshly each morning from stone-ground organic black gram flour (Urad dal / Masha). In Ayurveda, black gram is a premier unctuous (Snigdha), Vata-pacifying grain that forms an elastic, leak-proof barrier without irritating sensitive skin.',
      },
      {
        question: 'How many days of treatment will I need for sciatica?',
        answer:
          'A consecutive protocol of 7 to 10 sessions is typically prescribed for sciatica, often combined with localized Nadi Swedana (steam) and internal Vata-regulating decoctions.',
      },
    ],
    relatedSlugs: ['greeva-basti', 'janu-basti', 'basti-karma'],
    featuredImage: '/images/treatments/abhyanga.jpg',
    herbsUsed: ['Mahanarayan Tailam', 'Murivenna', 'Sahacharadi Tailam', 'Dashamoola', 'Masha (Urad Dal)'],
    featured: false,
    aliases: ['kati-basti-therapy'],
  },

  // 9. JANU BASTI
  {
    id: 'janu-basti',
    slug: 'janu-basti',
    name: 'Janu Basti',
    sanskritName: 'जानु बस्ति (सन्धिगतवात शामक)',
    category: 'Spine & Joint',
    primaryDosha: 'Vata',
    tagline: 'Therapeutic warm medicated oil pooling over knee joints to restore synovial fluid and relieve osteoarthritis pain.',
    shortDescription:
      'A specialized localized reservoir therapy for degenerative knee joint disorders, nourishing articular cartilage and replenishing synovial fluid (Shleshaka Kapha).',
    longDescription:
      'The knee joint (Janu Sandhi) bears the primary mechanical burden of human locomotion and is highly vulnerable to age-related wear, cartilage erosion, and Vata-induced dryness (Sandhigata Vata). Janu Basti involves constructing dough reservoirs over both anterior knee joints and filling them with warm, pharmacologically prepared anti-arthritic herbal oils. The prolonged, localized hydrostatic warmth encourages micro-circulation around the patella, lubricates the joint capsule, reduces crepitus (joint clicking), and softens contracted collateral ligaments.',
    indications: [
      'Osteoarthritis of the Knee Joint (Janu Sandhigata Vata)',
      'Joint Stiffness, Morning Immobility & Painful Crepitus (Clicking)',
      'Ligamentous Sprains, Tendonitis & Chondromalacia Patellae',
      'Post-Traumatic Knee Stiffness & Sports Rehabilitation',
      'Supportive Therapy for Delaying Total Knee Replacement (TKR)',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Knee Alignment & Dough Enclosure)',
        title: 'Sealing the Black-Gram Dough Rings',
        description:
          'The patient lies supine with small bolsters under the knees. Dough rings of kneaded black gram flour are formed around both patellar regions and carefully sealed against leakage.',
        duration: '10 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Hydrostatic Warm Oil Retention)',
        title: 'Continuous Pooling of Cartilage-Nourishing Oils',
        description:
          'Warm medicated oils such as Ksheerabala, Sahacharadi, and Mahanarayan are poured into the knee reservoirs. The temperature is sustained at 39–41°C for 30 to 40 minutes through continuous thermal cycling.',
        duration: '35–40 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Herbal Bolus & Mobilization)',
        title: 'Gentle Joint Massage & Churna Pinda Swedana',
        description:
          'The dough is detached and the knees are treated with a gentle circular massage followed by warm herbal powder bolus fomentation (Churna Pinda Swedana) to alleviate residual edema.',
        duration: '15 Minutes',
      },
    ],
    duration: '45 to 60 Minutes per session (7 to 14-day protocol)',
    durationMinutes: 45,
    priceRange: '₹1,600 – ₹2,400 per session (Both Knees) / ₹10,500 (7-Day Cycle)',
    priceEstimate: '₹1,800 per session',
    whatToExpect:
      'Warmth radiates into the deep recesses of the knee joint, relieving that heavy, bone-grinding sensation typical of osteoarthritis. As synovial viscosity improves over consecutive sessions, climbing stairs and rising from chairs becomes noticeably smoother and less painful.',
    precautions: [
      'Avoid high-impact jumping, deep squats, or sitting cross-legged on the floor during the treatment period.',
      'Wear warm trousers and avoid direct cold drafts on the exposed knee joints.',
      'Perform the gentle quadriceps isometric exercises demonstrated by our physiotherapist.',
      'Sip warm water and avoid sour, fermented foods that aggravate joint inflammation.',
    ],
    whoShouldAvoid: [
      'Patients with acute septic arthritis or bacterial joint effusion with high local heat and redness',
      'Unreduced acute knee fractures or complete ACL/meniscus ruptures requiring orthopedic surgical repair',
      'Open cuts, weeping eczema, or boils surrounding the knee caps',
      'Acute severe gouty joint flare-ups with hyper-sensitive skin (use Raktamokshana instead)',
    ],
    contraindications: [
      'Septic bacterial arthritis',
      'Acute knee fractures',
      'Complete ligamentous avulsions',
      'Open knee lesions',
    ],
    faqs: [
      {
        question: 'Can Janu Basti help regenerate lost knee cartilage?',
        answer:
          'While complete bone-on-bone Grade IV osteoarthritis cannot be fully reversed to adolescent cartilage, Janu Basti significantly nourishes remaining cartilage chondrocytes, replenishes synovial fluid (Shleshaka Kapha), reduces inflammatory cytokines, and dramatically restores pain-free functional walking.',
      },
      {
        question: 'Are both knees treated during the same appointment?',
        answer:
          'Yes. Both knees are treated simultaneously using paired dough reservoirs so that joint balance and biomechanical posture improve equally.',
      },
      {
        question: 'How long do the benefits of Janu Basti last?',
        answer:
          'With a 7 to 10-day comprehensive protocol combined with prescribed herbal formulations and weight management, patients typically enjoy sustained symptom relief for 6 to 12 months before requiring a seasonal maintenance cycle.',
      },
    ],
    relatedSlugs: ['kati-basti', 'greeva-basti', 'abhyanga-swedana'],
    featuredImage: '/images/treatments/herbs.jpg',
    herbsUsed: ['Ksheerabala Tailam', 'Mahanarayan Tailam', 'Sahacharadi Tailam', 'Rasna', 'Guggulu'],
    featured: false,
    aliases: ['janu-basti-therapy'],
  },

  // 10. GREEVA BASTI
  {
    id: 'greeva-basti',
    slug: 'greeva-basti',
    name: 'Greeva Basti',
    sanskritName: 'ग्रीवा बस्ति (मन्यास्तम्भ शामक)',
    category: 'Spine & Joint',
    primaryDosha: 'Vata',
    tagline: 'Localized warm herbal oil reservoir for cervical spondylosis, neck rigidity, and repetitive strain tension.',
    shortDescription:
      'A specialized cervical retention therapy that bathes the neck vertebrae in warm medicated oils, melting trapezius stiffness and easing radiating arm pain.',
    longDescription:
      'Modern sedentary desk work, prolonged smartphone use ("text neck"), and age-related disc degeneration have made cervical spondylosis an epidemic. In Ayurveda, this corresponds to Manyastambha (stiff neck) and Greeva Graha. Greeva Basti places a specialized dough enclosure over the posterior cervical and upper thoracic vertebrae (C3–T1). The continuous reservoir of warm, anti-Vata herbal oils relieves pressure on the brachial plexus, soothes chronic occipital headaches, restores cervical lordosis, and eliminates numb sensations radiating down the fingertips.',
    indications: [
      'Cervical Spondylosis, Disc Bulges & Cervical Radiculopathy',
      'Chronic Neck Rigidity, "Text Neck" Syndrome & Muscle Spasms',
      'Tension Headaches originating from the Suboccipital Muscles',
      'Numbness, Tingling & Weakness radiating into the Arms or Hands',
      'Whiplash Injury Recovery & Postural Upper Trapezius Fatigue',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Cervical Placement)',
        title: 'Prone Cushioning & Reservoir Sealing',
        description:
          'The patient lies prone with the forehead rested on a specialized ergonomic cervical pillow. A firm dough ring of black-gram flour is sealed over the lower neck and upper trapezius zone.',
        duration: '10 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Therapeutic Oil Retention)',
        title: 'Continuous Warm Herbal Oil Flow',
        description:
          'Warm medicated oils such as Karpasasthyadi and Dhanwantharam Tailam are poured into the reservoir and maintained at 40°C for 30 to 40 minutes to deeply hydrate the cervical disc spaces and relax the paraspinal muscles.',
        duration: '35–40 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Trapezius Massage & Fomentation)',
        title: 'Dough Removal, Gentle Massage & Nadi Swedana',
        description:
          'The oil is absorbed, the dough is cleared, and the upper back and shoulder blades are treated with a gentle soothing massage followed by soft herbal steam fomentation (Nadi Swedana).',
        duration: '15 Minutes',
      },
    ],
    duration: '45 to 60 Minutes per session (5 to 7-day program)',
    durationMinutes: 45,
    priceRange: '₹1,500 – ₹2,200 per session / ₹9,500 (7-Day Program)',
    priceEstimate: '₹1,600 per session',
    whatToExpect:
      'You will feel a profound dissolving of tension at the base of your skull and across the tops of your shoulders. Range of neck rotation improves immediately after the first session, and that dull, grinding stiffness fades into relaxed mobility.',
    precautions: [
      'Do not sleep on oversized, hard, or overly thick pillows; use an ergonomic cervical roll.',
      'Refrain from keeping your head bent downward at a laptop or phone for extended periods.',
      'Protect the neck from cold drafts from car windows, ceiling fans, or air conditioners.',
      'Avoid sudden violent jerks or cracking of the neck.',
    ],
    whoShouldAvoid: [
      'Patients with acute unstable cervical spinal fractures or severe spinal cord compression',
      'Acute open boils, carbuncles, or cuts over the cervical region',
      'Patients with acute dizziness caused by benign paroxysmal positional vertigo (BPPV) during prone positioning',
      'Active febrile conditions with severe systemic malaise',
    ],
    contraindications: [
      'Unstable cervical fractures',
      'Acute severe cervical myelopathy',
      'Open lesions on the posterior neck',
      'High acute fever',
    ],
    faqs: [
      {
        question: 'Can Greeva Basti help with numbness in my fingers?',
        answer:
          'Yes. Cervical radiculopathy occurs when compressed cervical nerve roots radiate tingling and numbness into the shoulders, forearms, and fingers. By reducing local disc edema and paraspinal muscle clamping, Greeva Basti relieves nerve root compression.',
      },
      {
        question: 'How is Greeva Basti combined with Nasya?',
        answer:
          'For stubborn cervical spondylosis, Dr. Bohra frequently recommends combining morning Nasya (to stimulate cranial-cervical circulation from the front) with evening Greeva Basti (to nourish the vertebrae from the back). This dual approach yields synergistic relief.',
      },
      {
        question: 'Will I need to wear a cervical collar after therapy?',
        answer:
          'Unless specifically instructed by our physician for severe acute instability, routine collar immobilization is discouraged because gentle natural movement and muscle re-education support faster healing.',
      },
    ],
    relatedSlugs: ['kati-basti', 'nasya-karma', 'shirodhara'],
    featuredImage: '/images/treatments/apothecary.jpg',
    herbsUsed: ['Karpasasthyadi Tailam', 'Dhanwantharam Tailam', 'Ksheerabala', 'Bala', 'Dashamoola'],
    featured: false,
    aliases: ['greeva-basti-therapy'],
  },

  // 11. NETRA TARPANA
  {
    id: 'netra-tarpana',
    slug: 'netra-tarpana',
    name: 'Netra Tarpana',
    sanskritName: 'नेत्र तर्पण (अक्षितर्पण विधानम्)',
    category: 'Skin & Hair',
    primaryDosha: 'Pitta',
    tagline: 'Deeply unctuous medicated ghee pooling over the eyes for digital strain, dry eye syndrome, and optic nerve nourishment.',
    shortDescription:
      'A classical ocular rejuvenation therapy (Kriyakalpa) where sterile medicated ghee is pooled over open eyes inside black-gram dough enclosures to soothe severe digital fatigue.',
    longDescription:
      'Described in the Shalakya Tantra (ophthalmology branch) of Sushruta Samhita, Netra Tarpana is Ayurveda’s supreme intervention for the visual apparatus. In modern times, prolonged screen exposure and blue light over-stimulate Alochaka Pitta and deplete the natural lubricating tear film (Tarpaka Kapha). Netra Tarpana constructs leak-proof dams around both ocular orbits and fills them with lukewarm, organic medicated ghee (such as Triphala Ghrita or Jeevantyadi Ghrita). The patient opens and blinks their eyes inside the golden pool, allowing the fat-soluble vitamins and antioxidants to deeply bathe the cornea, sclera, retina, and ciliary muscles.',
    indications: [
      'Digital Eye Strain (Computer Vision Syndrome), Burning & Ocular Dryness (Shushkakshipaka)',
      'Early Myopia Progression, Eye Fatigue & Focusing Weakness (Asthenopia)',
      'Chronic Blepharitis, Photophobia & Environmental Irritant Sensitivity',
      'Supportive Care for Optic Nerve Nourishment & Glaucoma pressure stabilization',
      'Early-stage Cataract Prevention (Timira) & Night Vision support',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Purva Karma (Facial Massage & Enclosure)',
        title: 'Orbital Marma Massage & Dough Enclosure',
        description:
          'A soothing 10-minute massage of the temples, brow ridge, and under-eye Marma points is followed by sealing circular dough barriers crafted from organic black-gram flour around both orbital sockets.',
        duration: '15 Minutes',
      },
      {
        step: 2,
        phase: 'Pradhana Karma (Medicated Ghee Pooling)',
        title: 'Blinking within the Warm Herbal Ghee Pool',
        description:
          'Sterile, clarified Triphala Ghrita or Jeevantyadi Ghrita warmed to body temperature is poured slowly into the reservoirs until eyelashes are submerged. The patient slowly blinks, rotates the eyes, and looks in all directions for 15 to 20 minutes.',
        duration: '20–25 Minutes',
      },
      {
        step: 3,
        phase: 'Paschat Karma (Ghee Drainage & Dark Rest)',
        title: 'Drainage, Warm Fomentation & Dark Glasses',
        description:
          'The ghee is drained, the dough removed, and the orbits are cleansed with sterile warm rose water. Mild herbal steam is applied to the cheeks, and the patient rests in a dimmed room wearing dark protective sunglasses.',
        duration: '15 Minutes',
      },
    ],
    duration: '45 to 60 Minutes per session (3 to 7-day protocol)',
    durationMinutes: 45,
    priceRange: '₹1,500 – ₹2,200 per session / ₹9,000 (5-Day Protocol)',
    priceEstimate: '₹1,600 per session',
    whatToExpect:
      'Opening your eyes inside the warm golden ghee feels surprising for a few seconds, but quickly becomes wonderfully soothing. The burning grit and dry friction disappear entirely. Following the treatment, colors appear more vibrant and eyes feel refreshed and deeply rested.',
    precautions: [
      'Avoid looking at mobile screens, laptops, television, or direct bright sunlight for at least 3 to 4 hours post-treatment.',
      'Wear the provided protective UV/dark glasses when stepping outdoors.',
      'Do not wash eyes with cold tap water on the therapy day; avoid rubbing your eyes.',
      'Do not drive immediately after the session, as vision may remain softly blurred by the residual lipid film for 30 minutes.',
    ],
    whoShouldAvoid: [
      'Patients with acute active bacterial conjunctivitis (pink eye) with thick purulent discharge',
      'Acute corneal ulcers, recent cataract surgery, or LASIK laser within the last 6 months',
      'Active high fever, severe head colds, or sinus congestion',
      'Acute ocular trauma or foreign object penetration',
    ],
    contraindications: [
      'Active bacterial conjunctivitis',
      'Recent ocular surgery (< 6 months)',
      'Corneal ulceration',
      'Acute high fever',
    ],
    faqs: [
      {
        question: 'Does the medicated ghee sting or burn the eyes?',
        answer:
          'No. The medicated ghee is meticulously prepared, sterile, and adjusted to exact physiological body temperature. You may feel a mild soothing unctuous sensation, but absolutely no stinging or caustic irritation.',
      },
      {
        question: 'How long will my vision remain blurry after the treatment?',
        answer:
          'Because a thin, protective layer of clarified medicinal ghee naturally coats the cornea, vision will remain gently hazy for approximately 20 to 30 minutes. This is completely harmless and clears naturally with blinking.',
      },
      {
        question: 'Can Netra Tarpana help people who work 10+ hours a day on computers?',
        answer:
          'It is arguably the single most effective therapeutic intervention for modern software engineers and digital professionals. A 5-session course restores natural tear film stability and dramatically reduces end-of-day eye strain and tension headaches.',
      },
    ],
    relatedSlugs: ['shirodhara', 'nasya-karma', 'raktamokshana'],
    featuredImage: '/images/treatments/apothecary.jpg',
    herbsUsed: ['Triphala Ghrita', 'Jeevantyadi Ghrita', 'Mahatiktaka Ghrita', 'Gulab Jala', 'Masha Flour'],
    featured: false,
    aliases: ['netra-tarpana-therapy'],
  },

  // 12. GASTRIC & AGNI CARE
  {
    id: 'gastric-agni-care',
    slug: 'gastric-agni-care',
    name: 'Gastric & Agni Care',
    sanskritName: 'अग्नि दीपन एवं कोष्ठ शुद्धि',
    category: 'Lifestyle & Metabolic',
    primaryDosha: 'Tridoshic',
    tagline: 'Comprehensive digestive fire revitalization, metabolic reset, and gut microbiome restoration.',
    shortDescription:
      'A holistic classical protocol addressing the root source of 90% of chronic illnesses (Mandagni) through targeted herbal decoctions, gentle abdominal fomentation, and dietary rehabilitation.',
    longDescription:
      'In the foundational aphorisms of Charaka Samhita, all systemic illnesses arise from impaired digestive fire: "Rogaah Sarvepi Mande Agnow". When Agni is weak or erratic, food ferments in the gut to create Ama — an antigenic, sticky metabolic toxin that clogs biological channels (Srotas). Gastric & Agni Care is a structured clinical program combining classical Deepana-Pachana herbs (digestive stimulants and carminatives), localized warm herbal abdominal castor oil packs (Udar-Basti/Swedana), and personalized dietary regimens (Ahara Vidhi) that heal the gut mucosal barrier, normalize bowel frequency, and boost cellular metabolic vitality.',
    indications: [
      'Irritable Bowel Syndrome (IBS / Grahani Dosha) & Chronic Bloating',
      'Acid Peptic Disorder, Non-Ulcer Dyspepsia & Chronic GERD (Amlapitta)',
      'Chronic Idiopathic Constipation, Sluggish Transit & Incomplete Evacuation',
      'Metabolic Sluggishness, Fatty Liver Grade 1–2 Support & Insulin Resistance',
      'Post-Antibiotic Gut Dysbiosis, Food Intolerances & Chronic Leaky Gut',
    ],
    procedureSteps: [
      {
        step: 1,
        phase: 'Phase 1: Deepana & Pachana (Metabolic Rekindling)',
        title: 'Digestive Kindle Formulations & Pulse Analysis',
        description:
          'Detailed Nadi Pariksha assesses digestive enzymes and gut microbial balance. The patient is initiated on classical digestive kindle elixirs such as Chitrakadi Vati, Hingwashtak, and freshly brewed ginger-cumin decoctions taken before meals.',
        duration: 'Days 1 to 5',
      },
      {
        step: 2,
        phase: 'Phase 2: Localized Abdominal Therapies (Udar Swedana)',
        title: 'Castor-Herbal Abdominal Fomentation & Marma Stimulation',
        description:
          'Warm medicated castor and sesame oils are applied over the epigastrium and colon in rhythmic peristaltic circles, followed by localized steam fomentation and gentle Nabhi (navel) Marma stimulation to release trapped autonomic spasms.',
        duration: '45 Minutes per clinical session',
      },
      {
        step: 3,
        phase: 'Phase 3: Ahara Vidhi & Gut Microbiome Stabilization',
        title: 'Takra Kalpana & Samsarjana Diet',
        description:
          'The patient is transitioned onto therapeutic buttermilk elixirs (Takra Kalpana) seasoned with roasted cumin, curry leaves, and rock salt, which classical texts venerate as the supreme probiotic for healing the intestinal lining.',
        duration: 'Ongoing 14-day protocol',
      },
    ],
    duration: '14 to 21 Days comprehensive lifestyle & therapy protocol',
    durationMinutes: 60,
    priceRange: '₹8,500 – ₹14,000 (Complete Diagnostic & Therapeutic Protocol)',
    priceEstimate: '₹9,500 for full 14-day protocol',
    whatToExpect:
      'Within 3 to 4 days of beginning the customized Agni protocol, excessive gas, post-meal brain fog, and abdominal distension diminish. Bowel movements become regular, formed, and non-sticky. Energy levels throughout the day stabilize without sudden mid-afternoon fatigue crashes.',
    precautions: [
      'Do not consume ice-cold water, chilled beverages, or refrigerated leftovers during the protocol.',
      'Leave at least 4 hours between major meals to allow the previous meal to digest completely (Jirna Ahara).',
      'Chew food mindfully in a calm environment without smartphone or television distractions.',
      'Avoid raw cold salads at dinner; favor warm, cooked, spiced vegetable soups and lentils.',
    ],
    whoShouldAvoid: [
      'Patients with active, heavily bleeding gastrointestinal ulcers or acute intestinal perforation',
      'Acute appendicitis or sudden unexplained surgical acute abdomen',
      'Patients experiencing acute severe infectious gastroenteritis with dehydration (requires emergency IV fluids)',
      'Severe end-stage liver failure with ascites without close hospital supervision',
    ],
    contraindications: [
      'Acute bleeding GI ulcers',
      'Suspected acute appendicitis',
      'Severe dehydration',
      'Acute bowel perforation',
    ],
    faqs: [
      {
        question: 'Why does Ayurveda place such heavy emphasis on digestive fire (Agni)?',
        answer:
          'According to classical Ayurveda, you are not merely what you eat, but what you digest, absorb, and metabolize. A strong Agni transforms food into glowing vitality (Ojas); a weak Agni transforms even the healthiest organic salad into toxic, inflammation-causing sludge (Ama).',
      },
      {
        question: 'What is Takra Kalpana and why is it recommended for IBS?',
        answer:
          'Takra is churned medicinal buttermilk from which fat has been removed. Charaka Samhita states: "He who drinks Takra regularly never falls sick." It is light to digest, astringent, promotes healthy gut flora, and heals the inflamed epithelial lining of the colon.',
      },
      {
        question: 'Can this protocol help with chronic acid reflux without modern antacids?',
        answer:
          'Yes. Long-term modern antacids often suppress stomach acid without solving underlying poor motility or biliary regurgitation. Our protocol regulates bile flow, cools inflammatory heat in the stomach, and strengthens the lower esophageal sphincter naturally.',
      },
    ],
    relatedSlugs: ['virechana', 'basti-karma', 'vamana'],
    featuredImage: '/images/treatments/apothecary.jpg',
    herbsUsed: ['Hingwashtak Churna', 'Chitrakadi Vati', 'Takra (Medicated Buttermilk)', 'Shunthi', 'Jeeraka'],
    featured: false,
    aliases: ['panchakarma', 'gastric-care', 'deepana-pachana'],
  },
];
