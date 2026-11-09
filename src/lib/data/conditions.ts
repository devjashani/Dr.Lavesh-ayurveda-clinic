import { Condition } from './types';

export const conditions: Condition[] = [
  // A - ACIDITY & IBS
  {
    id: 'acidity-ibs',
    letter: 'A',
    name: 'Acidity & Irritable Bowel Syndrome',
    sanskritName: 'अम्लपित्त एवं ग्रहणी दोष',
    category: 'Gastrointestinal & Metabolism',
    doshaInvolvement: 'Pitta-Vata aggravation with Mandagni (sluggish digestive fire)',
    pathophysiology:
      'Impairment of Pachaka Pitta and Samana Vayu creates fermentation (Vidagdha Ajeerna) in the stomach and small intestine. Acidic toxins irritate the mucosal barrier, leading to alternating diarrhea and constipation, chronic reflux, and visceral hypersensitivity.',
    clinicalSigns: [
      'Heartburn, sour belching & retrosternal burning (Hrit-Kanthadaha)',
      'Alternating loose stools and hard pellets with mucus (Grahani)',
      'Severe post-meal abdominal distension and crampy pain',
      'Loss of appetite alternating with ravenous false hunger',
    ],
    recommendedTherapySlugs: ['gastric-agni-care', 'virechana', 'basti-karma'],
    classicalDietAdvice:
      'Favor medicated churned buttermilk (Takra) with roasted cumin and rock salt. Strictly avoid raw unpeeled vegetables, chilies, vinegar, fried foods, and late-night dinners.',
    quoteCharaka: 'तक्रं तु ग्रहणीदोषे दीपनं ग्राहि लाघवम् — Churned buttermilk is the supreme restorative for gut mucosal vitality.',
  },

  // A - ARTHRITIS
  {
    id: 'arthritis',
    letter: 'A',
    name: 'Arthritis & Degenerative Joint Disorders',
    sanskritName: 'सन्धिगत वात एवं आमवात',
    category: 'Musculoskeletal & Autoimmune',
    doshaInvolvement: 'Vata dominance in joints (Sandhigata) or Ama-Vata systemic toxicity',
    pathophysiology:
      'In Osteoarthritis (Sandhigata Vata), unctuous synovial fluid (Shleshaka Kapha) dries out due to aggravated Vata, eroding articular cartilage. In Rheumatoid Arthritis (Amavata), systemic antigenic toxins (Ama) lodge in synovial membranes, triggering inflammatory heat and joint swelling.',
    clinicalSigns: [
      'Joint stiffness, especially pronounced during cold mornings (Stambha)',
      'Audible clicking and bone-grinding sensations during movement (Atopa)',
      'Severe pain while ascending stairs or standing up from seated posture',
      'Joint warmth, symmetrical swelling, and migratory aches in Amavata',
    ],
    recommendedTherapySlugs: ['janu-basti', 'abhyanga-swedana', 'kati-basti', 'basti-karma'],
    classicalDietAdvice:
      'Favor warm, lightly spiced mung dal khichdi, garlic decoctions in sesame oil, and ginger tea. Strictly eliminate curd, nightshades (potatoes, tomatoes), and chilled beverages.',
    quoteCharaka: 'सन्धिवातप्रशमनं तैलं स्वेदो बस्तिकर्म च — Medicated oils, fomentation, and Basti are the pillars of joint restoration.',
  },

  // D - DIABETES SUPPORT
  {
    id: 'diabetes-support',
    letter: 'D',
    name: 'Diabetes & Metabolic Support',
    sanskritName: 'प्रमेह चिकित्सा एवं मेदोरोध',
    category: 'Endocrine & Metabolic',
    doshaInvolvement: 'Kapha-Pitta dominance affecting Medo Dhatu (adipose tissue) and Kleda',
    pathophysiology:
      'Excessive consumption of sweet, heavy foods and physical inactivity weaken Agni, causing sluggish fluid stagnation (Kleda) and impaired glucose tissue assimilation. Over time, morbid Kapha vitiates Medo Dhatu and progresses through 20 types of Prameha into Madhumeha.',
    clinicalSigns: [
      'Frequent, cloudy, excessive urination (Prabhuta Avila Mutrata)',
      'Numbness and burning sensations in the soles and palms (Kara-Pada Daha)',
      'Uncontrollable sweet cravings, chronic dry mouth, and post-lunch drowsiness',
      'Slow-healing superficial cuts and persistent fatigue despite adequate sleep',
    ],
    recommendedTherapySlugs: ['gastric-agni-care', 'virechana', 'vamana'],
    classicalDietAdvice:
      'Favor bitter gourds (Karela), barley (Yava), roasted chickpeas (Chana), fenugreek seeds (Methi), and Amla. Avoid polished white rice, refined sugars, sweet fruits, and midday naps.',
    quoteCharaka: 'व्यायामः प्रमेहाणां श्रेष्ठम् — Classical physical activity and metabolic detoxification are unmatched for glucose harmony.',
  },

  // H - HAIR FALL & ALOPECIA
  {
    id: 'hair-fall',
    letter: 'H',
    name: 'Hair Fall & Alopecia',
    sanskritName: 'खालित्य एवं पालित्य (शिरोरोग)',
    category: 'Dermatological & Cranial',
    doshaInvolvement: 'Pitta-Vata imbalance combined with Rakta (blood) channel obstruction',
    pathophysiology:
      'Morbid body heat (Pitta) scorched by emotional stress, irregular food timing, or chemical hair dyes travels to the hair follicles (Romakupa) alongside Vata. Vata dislodges the hair root while Kapha and Rakta block micro-circulation, preventing new follicular regeneration.',
    clinicalSigns: [
      'Diffuse hair thinning, widening partition, and excessive shedding during washing',
      'Premature greying (Palitya) before age 35 with burning scalp sensations',
      'Patchy, circular bald spots without inflammatory signs (Alopecia Areata / Indralupta)',
      'Dry, brittle hair shafts prone to splitting and persistent dandruff (Darunak)',
    ],
    recommendedTherapySlugs: ['nasya-karma', 'shirodhara', 'raktamokshana'],
    classicalDietAdvice:
      'Incorporate fresh Amla, soaked black raisins, curry leaves, and sesame seeds daily. Avoid excessively salty snacks, deep-fried junk food, and synthetic shampoos.',
    quoteCharaka: 'नासा हि शिरसो द्वारं — Nasal therapy nourishes cranial micro-channels directly to restore follicular root strength.',
  },

  // I - INSOMNIA
  {
    id: 'insomnia',
    letter: 'I',
    name: 'Insomnia & Sleep Disturbances',
    sanskritName: 'अनिद्रा एवं निद्रानाश',
    category: 'Neurological & Mental Health',
    doshaInvolvement: 'High Vata and Pitta vitiating the heart, sensory organs, and Manovaha Srotas',
    pathophysiology:
      'The seat of consciousness (Hridaya) and sensory nerves (Indriyas) require nourishing Tarpaka Kapha and restful Ojas to detach from sensory stimuli at night. Hyperactive Prana and Vyana Vata, combined with mental anxiety, over-activate the mind, preventing natural restorative sleep.',
    clinicalSigns: [
      'Difficulty falling asleep despite extreme physical exhaustion (Sleep-onset delay)',
      'Frequent nighttime awakenings (2:00 AM – 4:00 AM) with racing, ungrounded thoughts',
      'Unrefreshing, dream-saturated sleep leading to next-day fatigue and mental brain fog',
      'Daytime irritability, dark under-eye circles, and heart palpitations',
    ],
    recommendedTherapySlugs: ['shirodhara', 'abhyanga-swedana', 'nasya-karma'],
    classicalDietAdvice:
      'Warm A2 cow’s milk infused with nutmeg (Jaiphal) and Ashwagandha at bedtime. Gentle foot massage (Pada Abhyanga) with warm sesame oil before sleeping.',
    quoteCharaka: 'निद्रायत्तं सुखं दुःखं पुष्टिः कार्श्यं बलाबलम् — Sound sleep is the foundational pillar of physical nourishment and emotional joy.',
  },

  // M - MIGRAINE
  {
    id: 'migraine',
    letter: 'M',
    name: 'Migraine & Chronic Headaches',
    sanskritName: 'अर्धावभेदक एवं सूर्यवर्त',
    category: 'Neurological & Cranial',
    doshaInvolvement: 'Vata-Pitta vitiation causing vascular spasms in cranial micro-channels',
    pathophysiology:
      'Suppression of natural urges, skipping meals, or sudden exposure to harsh sunlight aggravates Vata and Pitta in the cervical and cranial arteries. Vata triggers sudden intense unilateral vasoconstriction, followed by inflammatory Pitta vasodilation that creates pulsating hemicranial agony.',
    clinicalSigns: [
      'Unilateral throbbing or pulsating pain centered behind one eye or temple',
      'Intense photophobia (light sensitivity) and phonophobia (sound aversion)',
      'Associated nausea, vomiting, dizziness, or visual zig-zag auras prior to onset',
      'Headache escalating with sunrise and peaking at midday (Suryavarta pattern)',
    ],
    recommendedTherapySlugs: ['nasya-karma', 'shirodhara', 'greeva-basti', 'virechana'],
    classicalDietAdvice:
      'Consume cooling sweet fruits (pomegranates, sweet grapes), coriander-cumin tea, and avoid aged cheese, fermented batters, and skipped breakfasts.',
    quoteCharaka: 'शिरोविरेचनं कुर्यात् — Trans-nasal cranial cleansing is the paramount remedy for unilateral migraine attacks.',
  },

  // O - OBESITY
  {
    id: 'obesity',
    letter: 'O',
    name: 'Obesity & Stubborn Weight',
    sanskritName: 'स्थौल्य एवं मेदोरोग',
    category: 'Endocrine & Metabolic',
    doshaInvolvement: 'Excessive Medas (fat tissue) blocking Vata in the abdomen, stoking false hunger',
    pathophysiology:
      'Morbid Kapha and sluggish Agni produce immature fat tissue (Amapradosha Medas). This excess fat tissue clogs internal channels (Srotorodha), preventing nutrition from reaching deeper tissues (bone and reproductive fluid) while trapping Vata in the gut, which fans Tikshnagni (abnormal false hunger).',
    clinicalSigns: [
      'Inability to lose weight despite strict calorie deprivation diets',
      'Excessive sweating with distinct body odor (Swedabadha and Daurgandhya)',
      'Shortness of breath on minimal exertion and heavy lethargy after eating',
      'Central abdominal and waist adiposity accompanied by joint heaviness',
    ],
    recommendedTherapySlugs: ['gastric-agni-care', 'abhyanga-swedana', 'vamana', 'virechana'],
    classicalDietAdvice:
      'Favor ancient grains like barley (Jau), aged millets, honey with lukewarm water at sunrise, and dry herbal powder massage (Udwarthanam). Strictly avoid cheese, sweets, and daytime naps.',
    quoteCharaka: 'मेदसाऽऽवृतमार्गत्वात् पुष्यन्ति न च धातवः — When channels are blocked by fat, tissues starve despite overnutrition.',
  },

  // P - PCOD / PCOS
  {
    id: 'pcod',
    letter: 'P',
    name: 'PCOD, PCOS & Hormonal Imbalance',
    sanskritName: 'आर्तव क्षय एवं ग्रन्थि रोग',
    category: 'Women’s Health & Hormones',
    doshaInvolvement: 'Apana Vata dysfunction combined with Kapha-Avarana (channel obstruction)',
    pathophysiology:
      'The female reproductive system (Artava Vaha Srotas) is governed by Apana Vayu. Sedentary habits, insulin resistance, and stress cause Kapha to envelop Apana Vayu. The stagnant Kapha forms multiple follicular cysts in the ovaries while obstructed Vata prevents regular ovulation and healthy menstrual flow.',
    clinicalSigns: [
      'Irregular, delayed, or absent menstrual cycles (Oligomenorrhea / Amenorrhea)',
      'Excessive facial hair growth (Hirsutism), jawline hormonal acne, and scalp thinning',
      'Unexplained weight gain concentrated around the lower abdomen',
      'Anovulatory infertility and persistent mood swings before anticipated periods',
    ],
    recommendedTherapySlugs: ['basti-karma', 'virechana', 'gastric-agni-care'],
    classicalDietAdvice:
      'Favor anti-inflammatory spices like turmeric, cinnamon, fenugreek seeds, and sesame. Avoid commercial dairy with added hormones, refined flours, and sugary pastries.',
    quoteCharaka: 'बस्तिरार्तवदोषेषु परं हितम् — Classical Basti therapy is unmatched for balancing ovarian cycles and clearing uterine channels.',
  },

  // P - PSORIASIS & ECZEMA
  {
    id: 'psoriasis',
    letter: 'P',
    name: 'Psoriasis & Chronic Eczema',
    sanskritName: 'किटिभ कुष्ठ एवं विचार्चिका',
    category: 'Dermatological & Autoimmune',
    doshaInvolvement: 'Vata and Kapha dominant in Kitibha; Pitta and Rakta dominant in inflamed eczema',
    pathophysiology:
      'Chronic consumption of incompatible food combinations (Viruddha Ahara like fish with milk) disrupts digestion, generating deep-seated toxic heat (Ama-Visha). These toxins leach into the blood plasma (Rasa) and red blood cells (Rakta), triggering abnormal keratinocyte hyper-proliferation and dry silvery plaques.',
    clinicalSigns: [
      'Well-demarcated silvery-scaled plaques, particularly over elbows, knees, and scalp',
      'Intense, uncontrollable itching that bleeds upon scratching (Auspitz sign)',
      'Severe skin dryness, thick leather-like scaling (Lichenification), and painful fissuring',
      'Seasonal winter flare-ups with joint stiffness (Psoriatic arthritis overlap)',
    ],
    recommendedTherapySlugs: ['virechana', 'raktamokshana', 'gastric-agni-care'],
    classicalDietAdvice:
      'Favor bitter greens (Karela, Methi, Neem leaf decoctions), mung beans, and coconut oil topically. Strictly eliminate curd, fermented foods, seafood, brinjal, and sour citrus fruits.',
    quoteCharaka: 'रक्तमोक्षणं कुष्ठेषु प्रशस्तम् — Targeted blood-cleansing through leeches and purgation clears deep-seated dermatological plaques.',
  },

  // S - SCIATICA
  {
    id: 'sciatica',
    letter: 'S',
    name: 'Sciatica & Lumbar Disc Herniation',
    sanskritName: 'गृध्रसी (कटिशूल)',
    category: 'Spine & Musculoskeletal',
    doshaInvolvement: 'Severe Vata or Vata-Kapha vitiation in the Kandaras (lumbar tendons and sciatic nerve)',
    pathophysiology:
      'The term Gridhrasi comes from Gridhra (vulture), illustrating the characteristic limping, tilted gait of the sufferer. Aggravated Vata dehydrates the lumbar discs (L4-L5, L5-S1), causing them to bulge and compress the sciatic nerve roots, radiating sharp, electric shock-like agony from hip to heel.',
    clinicalSigns: [
      'Sharp, radiating shooting pain starting at the buttock and traveling down the back of the leg',
      'Numbness, tingling, "pins and needles", and heavy weakness in the calf and foot',
      'Inability to walk long distances or bend forward to tie shoelaces without severe agony',
      'Morning lumbar rigidity and pain aggravated by sitting on soft, low couches',
    ],
    recommendedTherapySlugs: ['kati-basti', 'basti-karma', 'abhyanga-swedana'],
    classicalDietAdvice:
      'Favor nourishing warm broths cooked with garlic (Lashuna Ksheera Paka), unctuous sesame oil, and Dashamoola tea. Avoid dry roasted snacks, cold salads, and lifting heavy weights.',
    quoteCharaka: 'गृध्रस्यां कटिबस्तिः स्यात् — Kati Basti combined with medicated unction relieves deep sciatic nerve entrapment.',
  },

  // S - STRESS & BURNOUT
  {
    id: 'stress',
    letter: 'S',
    name: 'Chronic Stress, Anxiety & Burnout',
    sanskritName: 'चित्तोद्वेग एवं मनोवह स्रोतोरोध',
    category: 'Neurological & Mental Health',
    doshaInvolvement: 'Raja and Tama mental doshas combined with aggravated Prana and Vyana Vata',
    pathophysiology:
      'Excessive sensory overload, emotional suppression, and chronic digital stimulation destabilize Prana Vata, which resides in the head and governs thoughts. Over time, high stress depletes Ojas (our core immune and emotional reserve), causing autonomic nervous system hyper-arousal, adrenal exhaustion, and chronic physical fatigue.',
    clinicalSigns: [
      'Constant feeling of dread, restless internal agitation, and panic flutter in the chest',
      'Chronic mental exhaustion, decision fatigue, and emotional detachment (Burnout)',
      'Severe muscle clamping across the upper shoulders, jaw clenching (Bruxism), and tension headaches',
      'Digestive spasms directly triggered by emotional stress (Brain-gut axis dysfunction)',
    ],
    recommendedTherapySlugs: ['shirodhara', 'abhyanga-swedana', 'nasya-karma'],
    classicalDietAdvice:
      'Favor warm freshly cooked grounding foods with ghee, sweet juicy fruits, chamomile and Brahmi tea. Practice 10 minutes of alternate nostril breathing (Nadi Shodhana) before meals.',
    quoteCharaka: 'धीधैर्यात्मादिविज्ञानं मनोदोषौषधं परम् — Cultivating sensory rest, clarity, and classical unction is the true medicine for the overwhelmed mind.',
  },

  // T - THYROID IMBALANCE
  {
    id: 'thyroid',
    letter: 'T',
    name: 'Thyroid Dysregulation (Hypo & Hyper)',
    sanskritName: 'गलगण्ड एवं धातु अग्नि मन्दता',
    category: 'Endocrine & Metabolic',
    doshaInvolvement: 'Kapha-Vata dominance affecting the throat Marma and cellular Agni (Dhatvagni)',
    pathophysiology:
      'The thyroid gland sits at the junction of the chest (Uras) and throat (Kantha). In Hypothyroidism, sluggish Kapha and Ama obstruct the cellular metabolic fire (Bhutagni), causing systemic sluggishness, fluid retention, and weight gain. In Hashimoto’s, autoimmune heat (Pitta) exacerbates glandular inflammation.',
    clinicalSigns: [
      'Pervasive, unshakeable morning fatigue despite 8–9 hours of sleep',
      'Extreme intolerance to cold weather, dry flaky skin, and outer eyebrow thinning',
      'Unexplained weight gain, facial puffiness, and chronic hoarseness of voice',
      'Sluggish digestion, chronic constipation, and low mood bordering on mild depression',
    ],
    recommendedTherapySlugs: ['vamana', 'greeva-basti', 'gastric-agni-care', 'nasya-karma'],
    classicalDietAdvice:
      'Favor Kanchanar decoctions, guggulu preparations, roasted coriander seed water, and rock salt. Avoid raw cruciferous vegetables (cabbage, cauliflower, broccoli) unless thoroughly cooked with spices.',
    quoteCharaka: 'कफमेदोहरैर्युक्तो गलगण्डप्रशान्तये — Formulations that clear sluggish Kapha and fat channels bring harmony to the thyroid axis.',
  },
];

