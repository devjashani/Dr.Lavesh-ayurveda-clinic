import { DoshaType } from './types';

export interface QuizOption {
  key: '1' | '2' | '3';
  text: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  sanskritTrait?: string;
  shortDesc?: string;
}

export interface QuizQuestion {
  id: string;
  number: number;
  category: string;
  sanskritCategory: string;
  question: string;
  context: string;
  options: QuizOption[];
}

export interface DoshaProfile {
  type: string;
  dosha: DoshaType;
  sanskritName: string;
  elements: string;
  elementSanskrit: string;
  overview: string;
  coreQualities: string[];
  strengths: string[];
  vulnerabilities: string[];
  foodsToFavor: string[];
  foodsToReduce: string[];
  dailyRoutineAdvice: string;
  classicalHerbs: string[];
  recommendedTherapySlugs: string[];
  charakaQuote: string;
}

export const TEN_QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. Body Frame
  {
    id: 'body_frame',
    number: 1,
    category: 'Body Frame & Bone Structure',
    sanskritCategory: 'शरीर रचना एवं धातु मान',
    question: 'How would you describe your natural physical frame and bone structure?',
    context: 'Reflects your innate structural skeletal density (Asthi Dhatu).',
    options: [
      {
        key: '1',
        text: 'Slender, light-boned, narrow frame. Joints may crack or protrude; hard to gain weight.',
        dosha: 'Vata',
        sanskritTrait: 'तनु-शरीर (Light & Slender)',
      },
      {
        key: '2',
        text: 'Medium, athletic, well-proportioned frame with balanced muscle tone and steady weight.',
        dosha: 'Pitta',
        sanskritTrait: 'मध्यम-शरीर (Medium & Athletic)',
      },
      {
        key: '3',
        text: 'Broad-shouldered, solid, heavy bone structure with strong musculature; gains weight easily.',
        dosha: 'Kapha',
        sanskritTrait: 'स्थूल-दृढ़-शरीर (Sturdy & Broad)',
      },
    ],
  },

  // 2. Skin
  {
    id: 'skin',
    number: 2,
    category: 'Skin Texture & Temperature',
    sanskritCategory: 'त्वचा प्रकृति एवं स्पर्श',
    question: 'How does your skin naturally feel without applying lotions or creams?',
    context: 'Reflects cutaneous hydration and micro-circulation (Twak Sara).',
    options: [
      {
        key: '1',
        text: 'Dry, rough, thin, cool to the touch; easily flakes or chaps in cold dry weather.',
        dosha: 'Vata',
        sanskritTrait: 'रूक्ष-शीत (Dry & Cool)',
      },
      {
        key: '2',
        text: 'Warm, soft, sensitive, easily flushed; prone to redness, moles, freckles, or breakouts.',
        dosha: 'Pitta',
        sanskritTrait: 'उष्ण-रक्त (Warm & Flushed)',
      },
      {
        key: '3',
        text: 'Thick, oily, supple, smooth, cool; retains youthfulness and ages very slowly.',
        dosha: 'Kapha',
        sanskritTrait: 'स्निग्ध-शीत (Supple & Oily)',
      },
    ],
  },

  // 3. Appetite
  {
    id: 'appetite',
    number: 3,
    category: 'Appetite & Hunger Intensity',
    sanskritCategory: 'अग्नि एवं क्षुधा लक्षण',
    question: 'How does your appetite and hunger behave on a day-to-day basis?',
    context: 'Assesses the baseline intensity of your digestive fire (Agni).',
    options: [
      {
        key: '1',
        text: 'Variable and unpredictable (Vishamagni). Sometimes ravenous, sometimes forget to eat for hours.',
        dosha: 'Vata',
        sanskritTrait: 'विषमाग्नि (Erratic Hunger)',
      },
      {
        key: '2',
        text: 'Strong and sharp (Tikshnagni). Must eat on time; becomes irritable or dizzy if meals are delayed.',
        dosha: 'Pitta',
        sanskritTrait: 'तीक्ष्णाग्नि (Intense Hunger)',
      },
      {
        key: '3',
        text: 'Slow and steady (Mandagni). Moderate hunger; can skip meals comfortably without distress.',
        dosha: 'Kapha',
        sanskritTrait: 'मन्दाग्नि (Slow Steady Fire)',
      },
    ],
  },

  // 4. Digestion & Bowels
  {
    id: 'digestion',
    number: 4,
    category: 'Digestion & Bowel Patterns',
    sanskritCategory: 'कोष्ठ एवं पाचन लक्षण',
    question: 'What is your typical digestion and bowel elimination pattern?',
    context: 'Assesses gut transit speed and unctuousness (Kostha).',
    options: [
      {
        key: '1',
        text: 'Dry, hard stools, tendency towards gas, bloating, or irregular constipation (Krura Kostha).',
        dosha: 'Vata',
        sanskritTrait: 'क्रूर कोष्ठ (Hard & Gassy)',
      },
      {
        key: '2',
        text: 'Soft, loose stools 2–3 times a day; sensitive to hot spices, caffeine, or sour foods (Mridu Kostha).',
        dosha: 'Pitta',
        sanskritTrait: 'मृदु कोष्ठ (Soft & Frequent)',
      },
      {
        key: '3',
        text: 'Heavy, formed, regular once-daily morning bowel movement; occasionally slow or sluggish.',
        dosha: 'Kapha',
        sanskritTrait: 'मध्यम कोष्ठ (Heavy & Regular)',
      },
    ],
  },

  // 5. Sleep
  {
    id: 'sleep',
    number: 5,
    category: 'Sleep Depth & Quality',
    sanskritCategory: 'निद्रा मान एवं स्वप्न',
    question: 'How do you naturally sleep and wake up at night?',
    context: 'Assesses nervous system rejuvenation and Tarpaka Kapha.',
    options: [
      {
        key: '1',
        text: 'Light, irregular, easily disturbed by faint sounds; frequent awakenings between 2:00–4:00 AM.',
        dosha: 'Vata',
        sanskritTrait: 'अल्प-चंचल-निद्रा (Light Sleep)',
      },
      {
        key: '2',
        text: 'Sound, moderate sleep (6–7 hours). Wakes up alert and purposeful; vivid, colorful dreams.',
        dosha: 'Pitta',
        sanskritTrait: 'मध्यम-दीप्त-निद्रा (Alert & Purposeful)',
      },
      {
        key: '3',
        text: 'Deep, heavy, uninterrupted (8–9+ hours). Difficult to wake up in the morning; feels groggy.',
        dosha: 'Kapha',
        sanskritTrait: 'गाढ-गुरु-निद्रा (Deep & Heavy)',
      },
    ],
  },

  // 6. Stress Reaction
  {
    id: 'stress_reaction',
    number: 6,
    category: 'Stress Reaction & Pressure',
    sanskritCategory: 'तनाव प्रतिक्रिया एवं मानसिक उद्वेग',
    question: 'What is your involuntary emotional response under intense stress or sudden conflict?',
    context: 'Reflects mental dosha (Manas) and autonomic resilience.',
    options: [
      {
        key: '1',
        text: 'Anxiety, nervous worry, overthinking, feeling scattered, heart palpitations, or racing thoughts.',
        dosha: 'Vata',
        sanskritTrait: 'भय-उद्वेग (Anxiety & Worry)',
      },
      {
        key: '2',
        text: 'Irritability, sharp criticism, impatience, frustration, anger, or taking control forcefully.',
        dosha: 'Pitta',
        sanskritTrait: 'क्रोध-अमर्ष (Irritability & Anger)',
      },
      {
        key: '3',
        text: 'Withdrawal, quiet resistance, seeking comfort in food, procrastination, or stubborn silence.',
        dosha: 'Kapha',
        sanskritTrait: 'आलस्य-धैर्य (Inertia & Withdrawal)',
      },
    ],
  },

  // 7. Temperature Tolerance
  {
    id: 'temperature_tolerance',
    number: 7,
    category: 'Temperature Tolerance',
    sanskritCategory: 'तापमान सहिष्णुता',
    question: 'How does your body naturally respond to external temperatures?',
    context: 'Assesses cellular metabolic warmth (Ushna vs Sheeta Guna).',
    options: [
      {
        key: '1',
        text: 'Cannot tolerate cold drafts or chilly rooms; hands and feet are frequently cold; loves warm blankets.',
        dosha: 'Vata',
        sanskritTrait: 'शीत-असह्य (Cold Sensitive)',
      },
      {
        key: '2',
        text: 'Overheats very easily; flushed red face in sun; craves cold drinks, AC, and shaded cool rooms.',
        dosha: 'Pitta',
        sanskritTrait: 'उष्ण-असह्य (Heat Sensitive)',
      },
      {
        key: '3',
        text: 'Generally comfortable in moderate temperatures, but intensely dislikes cold, damp, humid environments.',
        dosha: 'Kapha',
        sanskritTrait: 'क्लिन्न-असह्य (Damp Sensitive)',
      },
    ],
  },

  // 8. Energy Pattern
  {
    id: 'energy_pattern',
    number: 8,
    category: 'Daily Energy & Stamina',
    sanskritCategory: 'बल एवं दैनिक उत्साह',
    question: 'How does your physical stamina and energy fluctuate through the day?',
    context: 'Assesses tissue vitality (Ojas and Bala).',
    options: [
      {
        key: '1',
        text: 'Bursts of high enthusiasm and energy, followed by sudden physical exhaustion or afternoon crashes.',
        dosha: 'Vata',
        sanskritTrait: 'शीघ्र-श्रान्ति (Fluctuating Energy)',
      },
      {
        key: '2',
        text: 'Strong, focused, driven stamina; pushes through physical limits and burns out from over-exertion.',
        dosha: 'Pitta',
        sanskritTrait: 'मध्यम-उत्साह (Driven Stamina)',
      },
      {
        key: '3',
        text: 'Slow to get started in the morning, but has exceptional, steady endurance once moving.',
        dosha: 'Kapha',
        sanskritTrait: 'स्थिर-बल (Enduring Stamina)',
      },
    ],
  },

  // 9. Mood & Baseline Temperament
  {
    id: 'mood',
    number: 9,
    category: 'Mood & Baseline Temperament',
    sanskritCategory: 'मानस प्रकृति एवं स्वभाव',
    question: 'When feeling balanced and relaxed, what is your dominant emotional temperament?',
    context: 'Your innate mental essence (Sattva balance).',
    options: [
      {
        key: '1',
        text: 'Creative, imaginative, vibrant, quick-witted, talkative, artistic, and adaptable.',
        dosha: 'Vata',
        sanskritTrait: 'उत्साह-प्रमोद (Creative & Vibrant)',
      },
      {
        key: '2',
        text: 'Courageous, ambitious, sharp, logical, articulate, natural leader, and passionate.',
        dosha: 'Pitta',
        sanskritTrait: 'शौर्य-तेज (Dynamic Leader)',
      },
      {
        key: '3',
        text: 'Calm, patient, deeply loyal, loving, grounded, harmonious, forgiving, and serene.',
        dosha: 'Kapha',
        sanskritTrait: 'शान्ति-धृति (Serene & Grounded)',
      },
    ],
  },

  // 10. Weather Dislike
  {
    id: 'weather_dislike',
    number: 10,
    category: 'Climate & Weather Dislike',
    sanskritCategory: 'ऋतु असह्यता',
    question: 'Which weather condition makes you feel most physically or mentally drained?',
    context: 'Identifies environmental triggers (Ritucharya vulnerabilities).',
    options: [
      {
        key: '1',
        text: 'Dry, windy autumn and freezing winter days with harsh cold drafts.',
        dosha: 'Vata',
        sanskritTrait: 'वातकारक शिशिर (Cold Windy Days)',
      },
      {
        key: '2',
        text: 'Scorching summer heat, intense midday sun, and humid monsoon heat.',
        dosha: 'Pitta',
        sanskritTrait: 'पित्तकारक ग्रीष्म (Scorching Summer)',
      },
      {
        key: '3',
        text: 'Cold, cloudy, damp, overcast, rainy days with stagnant humidity.',
        dosha: 'Kapha',
        sanskritTrait: 'कफकारक वर्षर्तु (Damp Rainy Days)',
      },
    ],
  },
];

export const DOSHA_PROFILES: Record<string, DoshaProfile> = {
  Vata: {
    type: 'Vata Predominant',
    dosha: 'Vata',
    sanskritName: 'वात प्रकृति (वायु-आकाश प्रधान)',
    elements: 'Ether (Akasha) & Air (Vayu)',
    elementSanskrit: 'आकाश एवं वायु महाभूत',
    overview:
      'Vata governs all movement, biological rhythm, respiration, circulation, and nervous transmission in the body. Characterized by the classical qualities of lightness, dryness, coldness, mobility, and subtlety (Laghu, Ruksha, Sheeta, Chala). You are a naturally creative visionary with a quick, agile mind, though prone to nervous exhaustion, dry tissues, and erratic digestion when ungrounded.',
    coreQualities: ['Light (Laghu)', 'Dry (Ruksha)', 'Cold (Sheeta)', 'Mobile (Chala)', 'Subtle (Sukshma)'],
    strengths: [
      'Exceptional artistic creativity, quick ideation, and verbal expressiveness',
      'Naturally flexible, agile, intuitive, and enthusiastic',
      'Quick learner who embraces positive change readily',
      'Spontaneous and empathetic in interpersonal relationships',
    ],
    vulnerabilities: [
      'Susceptible to anxiety, insomnia, racing thoughts, and restless limbs',
      'Dry skin, cracking joints, lumbar stiffness, and chronic constipation',
      'Sudden energy crashes when overstimulated or meal timings are missed',
      'Erratic digestion (Vishamagni) with painful gas and abdominal bloating',
    ],
    foodsToFavor: [
      'Warm, unctuous, freshly prepared meals with pure A2 cow ghee or sesame oil',
      'Sweet, sour, and mildly salty tastes (Madhura, Amla, Lavana)',
      'Cooked root vegetables (carrots, sweet potatoes, beets), warm mung khichdi, and oats',
      'Warming digestive spices: fresh ginger, cumin, cinnamon, cardamom, and hing',
    ],
    foodsToReduce: [
      'Raw cold salads, dry crackers, puffed grains, and dehydrated snacks',
      'Iced beverages, carbonated sodas, and excessive dry stimulants (caffeine)',
      'Bitter, pungent, and astringent foods eaten cold or on the run',
      'Skipping meals or eating while working under stress',
    ],
    dailyRoutineAdvice:
      'Vata thrives on rhythm and unctuous warmth. Practice daily warm sesame oil self-massage (Abhyanga) before a warm shower. Go to sleep before 10:00 PM and avoid blue screens after twilight.',
    classicalHerbs: ['Ashwagandha (Withania somnifera)', 'Brahmi', 'Dashamoola', 'Bala', 'Shatavari'],
    recommendedTherapySlugs: ['shirodhara', 'abhyanga-swedana', 'basti-karma', 'kati-basti'],
    charakaQuote: 'तत्र रूक्षो लघुः शीतो खरः सूक्ष्मश्चलोऽनिलः — Vata is dry, light, cold, rough, subtle, and constantly mobile.',
  },

  Pitta: {
    type: 'Pitta Predominant',
    dosha: 'Pitta',
    sanskritName: 'पित्त प्रकृति (अग्नि-जल प्रधान)',
    elements: 'Fire (Agni) & Water (Jala)',
    elementSanskrit: 'अग्नि एवं जल महाभूत',
    overview:
      'Pitta governs digestion, biochemical metabolism, enzyme secretions, body temperature, and intellectual discernment (Buddhi). Characterized by hot, sharp, light, oily, and spreading qualities (Ushna, Tikshna, Laghu, Sasneha). You possess a sharp, penetrating intellect, natural leadership charisma, and a robust metabolic fire.',
    coreQualities: ['Hot (Ushna)', 'Sharp (Tikshna)', 'Oily (Sasneha)', 'Spreading (Sara)', 'Light (Laghu)'],
    strengths: [
      'Incisive intellect, strategic clarity, and decisive leadership',
      'Strong metabolic fire (Tikshnagni) and efficient cellular transformation',
      'Articulate, persuasive, and commanding communicator',
      'Naturally courageous, athletic, and goal-oriented',
    ],
    vulnerabilities: [
      'Prone to hyperacidity, acid reflux, and bile-induced heartburn',
      'Inflammatory skin dermatoses (acne, eczema, psoriasis, hives)',
      'Impatience, irritability, and sharp temper under pressure',
      'Migraines triggered by skipped meals or harsh noon sunlight',
    ],
    foodsToFavor: [
      'Cooling, sweet, bitter, and astringent tastes (Madhura, Tikta, Kashaya)',
      'Naturally sweet ripe fruits: pomegranates, sweet grapes, pears, and soaked dates',
      'Cooling fats: pure cow ghee, coconut oil, and fresh milk',
      'Cooling herbs & spices: coriander seeds, fennel, mint, and fresh cilantro',
    ],
    foodsToReduce: [
      'Deep-fried, excessively oily, or salty street snacks',
      'Fermented foods (vinegar, aged cheese, soy sauce) and sour curd',
      'Excessive garlic, raw onions, red chilies, mustard, and alcohol',
      'Late-night spicy dinners that overheat the liver',
    ],
    dailyRoutineAdvice:
      'Pitta needs cooling moderation. Spend time in tranquil natural greenery or near water during the cool evening twilight. Avoid intense competitive workouts under the midday sun.',
    classicalHerbs: ['Amalaki (Indian Gooseberry)', 'Shatavari', 'Guduchi (Giloy)', 'Chandana', 'Neem'],
    recommendedTherapySlugs: ['virechana', 'netra-tarpana', 'raktamokshana', 'shirodhara'],
    charakaQuote: 'पित्तं सस्नेहमुष्णं च तीक्ष्णं द्रवमम्लं सरं कटु — Pitta is slightly unctuous, hot, sharp, liquid, sour, and mobile.',
  },

  Kapha: {
    type: 'Kapha Predominant',
    dosha: 'Kapha',
    sanskritName: 'कफ प्रकृति (पृथ्वी-जल प्रधान)',
    elements: 'Water (Jala) & Earth (Prithvi)',
    elementSanskrit: 'जल एवं पृथ्वी महाभूत',
    overview:
      'Kapha governs biological cohesion, structural stability, cellular hydration, joint lubrication, and physical immunity (Ojas). Characterized by heavy, slow, cool, oily, smooth, and dense qualities (Guru, Manda, Sheeta, Snigdha, Sandra). You are grounded, naturally peaceful, highly resilient, and possess remarkable physical endurance and compassionate loyalty.',
    coreQualities: ['Heavy (Guru)', 'Slow (Manda)', 'Cool (Sheeta)', 'Unctuous (Snigdha)', 'Stable (Sthira)'],
    strengths: [
      'Exceptional physical stamina and natural immunity (Vyadhikshamatva)',
      'Emotional calm, patience, loyalty, and deep tolerance',
      'Deep, restorative sleep and robust joint lubrication',
      'Steady long-term memory and grounded financial prudence',
    ],
    vulnerabilities: [
      'Prone to metabolic sluggishness, easy weight gain, and water retention',
      'Mucosal congestion: chronic sinusitis, cough, and bronchial heaviness',
      'Tendency towards lethargy, procrastination, and daytime drowsiness',
      'Resistance to lifestyle change and emotional attachment',
    ],
    foodsToFavor: [
      'Light, warm, dry, and freshly prepared cooked meals',
      'Pungent, bitter, and astringent tastes (Katu, Tikta, Kashaya)',
      'Ancient grains: barley (Jau), aged millets (Ragi, Bajra), and quinoa',
      'Warming digestive spices: black pepper, ginger, Pippali, mustard, and fenugreek',
    ],
    foodsToReduce: [
      'Heavy dairy: cheese, ice cream, cold sweet condensed milk',
      'Refined white sugar, pastries, and deep-fried savory snacks',
      'Sweet, sour, and salty tastes in excessive quantities',
      'Daytime sleeping and heavy dinners eaten late at night',
    ],
    dailyRoutineAdvice:
      'Kapha requires invigorating stimulation and warmth. Rise before 6:00 AM (during the Vata dawn window) to avoid daytime heaviness. Practice vigorous morning Surya Namaskar and dry powder massage (Udwarthanam).',
    classicalHerbs: ['Trikatu (Shunthi, Maricha, Pippali)', 'Triphala', 'Guggulu', 'Punarnava', 'Tulsi'],
    recommendedTherapySlugs: ['vamana', 'gastric-agni-care', 'nasya-karma', 'abhyanga-swedana'],
    charakaQuote: 'गुरुशीतमृदुस्निग्धमधुरस्थिरपिच्छिलाः — Kapha is heavy, cool, soft, unctuous, sweet, stable, and smooth.',
  },

  'Vata-Pitta': {
    type: 'Vata-Pitta Dual Constitution',
    dosha: 'Vata-Pitta',
    sanskritName: 'वात-पित्त प्रकृति (द्विदोषज)',
    elements: 'Air, Fire & Ether',
    elementSanskrit: 'वायु, अग्नि एवं आकाश',
    overview:
      'A dynamic, intellectually brilliant combination blending Vata’s swift creativity with Pitta’s intense drive and sharp discernment. When balanced, you execute complex creative visions with formidable precision. When stressed, Vata anxiety easily cascades into Pitta irritability and digestive sensitivity.',
    coreQualities: ['Light (Laghu)', 'Active (Chala)', 'Warm-Sharp', 'Sensitive Digestive Fire'],
    strengths: [
      'Exceptional intellectual agility, quick problem solving, and visionary drive',
      'Naturally energetic, charismatic, and enthusiastic',
      'Highly adaptable yet disciplined when motivated',
    ],
    vulnerabilities: [
      'Sensitive digestive tract: prone to alternating hyperacidity and gas',
      'Insomnia triggered by late-night intense mental work',
      'Tendency to over-schedule and crash from adrenal exhaustion',
    ],
    foodsToFavor: [
      'Warm, nourishing, moderately spiced meals cooked with ghee or coconut oil',
      'Sweet root vegetables, basmati rice, soaked almonds, and fresh sweet fruits',
      'Fennel-coriander digestive infusions taken lukewarm',
    ],
    foodsToReduce: [
      'Excessive coffee, fiery chilies, vinegar, and dry crackers',
      'Skipped meals or hurried eating in front of glowing laptop screens',
    ],
    dailyRoutineAdvice:
      'Set non-negotiable boundaries around work and rest. Cultivate silent contemplation and restorative Yoga Nidra. Shield both head and eyes from excessive sensory input.',
    classicalHerbs: ['Brahmi', 'Ashwagandha', 'Shatavari', 'Ksheerabala', 'Yashtimadhu'],
    recommendedTherapySlugs: ['shirodhara', 'abhyanga-swedana', 'netra-tarpana', 'virechana'],
    charakaQuote: 'द्विदोषजाः प्रकृतयः संसृष्टलक्षणैर्ज्ञेयाः — Dual constitutions reflect the blended qualities of both active doshas.',
  },

  'Pitta-Kapha': {
    type: 'Pitta-Kapha Dual Constitution',
    dosha: 'Pitta-Kapha',
    sanskritName: 'पित्त-कफ प्रकृति (द्विदोषज)',
    elements: 'Fire, Water & Earth',
    elementSanskrit: 'अग्नि, जल एवं पृथ्वी',
    overview:
      'A powerful, resilient constitution combining Pitta’s sharp intellect with Kapha’s physical stamina and emotional stability. You have the stamina of an athlete and the strategic acumen of an executive. Balance is maintained by cooling internal heat while preventing metabolic congestion.',
    coreQualities: ['Oily (Snigdha)', 'Firm Muscle Tone', 'Strong Digestion', 'Steady Energy'],
    strengths: [
      'Exceptional physical endurance and immune strength',
      'Leadership stamina: able to carry heavy responsibilities without cracking',
      'Clear, commanding presence and grounded emotional resilience',
    ],
    vulnerabilities: [
      'Prone to inflammatory skin conditions, oily skin, and stubborn weight stagnation',
      'Metabolic syndrome risk if regular physical exercise is neglected',
      'Suppression of emotions turning into chronic silent frustration',
    ],
    foodsToFavor: [
      'Bitter greens, barley, mung beans, cucumbers, and cooling spices',
      'Fresh pomegranate juice, green apples, and herbal buttermilk (Takra)',
    ],
    foodsToReduce: [
      'Deep-fried appetizers, cheese, heavy red meats, and excess refined sugar',
      'Overeating late at night; alcohol combined with heavy savory snacks',
    ],
    dailyRoutineAdvice:
      'Engage in daily vigorous cardiovascular exercise in the cool early morning. Practice cooling pranayama (Sheetali / Sheetkari) and maintain moderation in diet.',
    classicalHerbs: ['Guduchi', 'Amalaki', 'Triphala', 'Kutki', 'Guggulu'],
    recommendedTherapySlugs: ['virechana', 'gastric-agni-care', 'raktamokshana', 'abhyanga-swedana'],
    charakaQuote: 'संसृष्टदोषाणां संसृष्टोपक्रमः — Blended doshas require harmonious balancing of heat and heaviness.',
  },

  'Vata-Kapha': {
    type: 'Vata-Kapha Dual Constitution',
    dosha: 'Vata-Kapha',
    sanskritName: 'वात-कफ प्रकृति (द्विदोषज)',
    elements: 'Air, Ether, Water & Earth',
    elementSanskrit: 'वायु, आकाश, जल एवं पृथ्वी',
    overview:
      'An intriguing combination that shares the common quality of coldness (Sheeta). You oscillate between periods of energetic creative enthusiasm and periods of quiet withdrawal. Your primary clinical key is keeping your body, digestion, and environment warm and stimulated.',
    coreQualities: ['Cold (Sheeta)', 'Fluctuating Motivation', 'Joint & Sinus Sensitivity'],
    strengths: [
      'Sensitive and compassionate temperament with imaginative depth',
      'Deep endurance when warmly inspired and supported',
    ],
    vulnerabilities: [
      'High sensitivity to cold weather, winter joint stiffness, and chronic sinus drainage',
      'Sluggish peripheral circulation, cold hands and feet',
    ],
    foodsToFavor: [
      'Hot freshly cooked soups, stews, and porridges seasoned with black pepper, ginger, and cumin',
      'Cooked grains and warm herbal teas taken throughout the day',
    ],
    foodsToReduce: [
      'Iced drinks, cold salads, ice creams, and refrigerated leftovers',
    ],
    dailyRoutineAdvice:
      'Dress warmly in layers. Daily warm herbal steam (Swedana) and warm sesame oil Abhyanga are profoundly therapeutic for your cold-sensitive constitution.',
    classicalHerbs: ['Dashamoola', 'Trikatu', 'Ashwagandha', 'Tulsi', 'Rasna'],
    recommendedTherapySlugs: ['abhyanga-swedana', 'nasya-karma', 'kati-basti', 'basti-karma'],
    charakaQuote: 'शीतं शीतेन संवृद्धं — Coldness shared by Vata and Kapha requires constant nourishing warmth.',
  },

  'Tridoshic': {
    type: 'Sama Prakriti (Tridoshic Balance)',
    dosha: 'Tridoshic',
    sanskritName: 'सम त्रिदोष प्रकृति',
    elements: 'Ether, Air, Fire, Water & Earth',
    elementSanskrit: 'पञ्चमहाभूत समतोल',
    overview:
      'The rarest and most venerated constitution in Charaka Samhita. All three bio-energies (Vata, Pitta, and Kapha) exist in near-equal proportion. You possess physical resilience, intellectual discernment, and emotional tranquility. Your health strategy focuses on preserving this natural equilibrium across changing seasons (Ritucharya).',
    coreQualities: ['Equilibrium (Samatva)', 'Adaptability', 'Resilient Ojas'],
    strengths: [
      'Exceptional all-round biological vitality and longevity potential',
      'Balanced digestion and sound, refreshing sleep',
      'Emotional equanimity and high adaptability across environments',
    ],
    vulnerabilities: [
      'Seasonal vulnerabilities if seasonal dietary transitions (Ritucharya) are ignored',
      'Tendency towards complacency regarding health routines',
    ],
    foodsToFavor: [
      'Seasonal, wholesome, fresh, balanced meals containing all six tastes (Shad Rasa)',
      'Mild culinary herbs and pure A2 cow ghee in moderation',
    ],
    foodsToReduce: [
      'Excess of any single extreme taste (too spicy, too sour, or too sweet)',
      'Artificial processed foods and unnatural circadian disruption',
    ],
    dailyRoutineAdvice:
      'Maintain your natural rhythm with Dinacharya. Seasonal Panchakarma at the junction of seasons (Ritusandhi) preserves your innate harmony.',
    classicalHerbs: ['Triphala', 'Amalaki', 'Brahmi', 'Ashwagandha', 'Guduchi'],
    recommendedTherapySlugs: ['abhyanga-swedana', 'shirodhara', 'gastric-agni-care', 'nasya-karma'],
    charakaQuote: 'समपित्तानिलकफाः केचित् — Those with balanced doshas are praised by wise physicians as truly healthy.',
  },
};
