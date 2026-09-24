import { EnglishLevel } from './levels';

export interface SimulatorTopic {
  id: string;
  title: string;
  category: string;
  level: EnglishLevel;
  prompt: string;
  bulletPoints: string[];
  suggestedVocabulary: string[];
}

export const SIMULATOR_TOPICS: SimulatorTopic[] = [
  // BEGINNER TOPICS
  {
    id: 'beg_1',
    title: 'My Favorite Food',
    category: 'Daily Life',
    level: 'beginner',
    prompt: 'Describe your favorite food or meal. What makes it special to you?',
    bulletPoints: ['What the food is and what it looks/tastes like', 'When and where you usually eat it', 'Why you enjoy it so much'],
    suggestedVocabulary: ['delicious', 'traditional', 'flavorful', 'ingredients', 'homemade', 'enjoyable'],
  },
  {
    id: 'beg_2',
    title: 'My Family & Home',
    category: 'Personal Life',
    level: 'beginner',
    prompt: 'Talk about your family members and where you live.',
    bulletPoints: ['Who is in your family', 'What activities you do together', 'What you like about your home'],
    suggestedVocabulary: ['supportive', 'neighborhood', 'together', 'hometown', 'cozy', 'celebrate'],
  },
  {
    id: 'beg_3',
    title: 'My Daily Routine',
    category: 'Habits',
    level: 'beginner',
    prompt: 'Walk through what a typical weekday looks like for you from morning to night.',
    bulletPoints: ['What time you wake up', 'Your main activities during the day', 'How you relax in the evening'],
    suggestedVocabulary: ['schedule', 'productive', 'commute', 'unwind', 'habit', 'morning routine'],
  },
  {
    id: 'beg_4',
    title: 'A Place I Want to Visit',
    category: 'Travel',
    level: 'beginner',
    prompt: 'Describe a city or country you would love to travel to in the future.',
    bulletPoints: ['Where this place is located', 'What tourist spots or scenery you want to see', 'Who you want to travel with'],
    suggestedVocabulary: ['destination', 'explore', 'landmark', 'sightseeing', 'culture', 'memorable'],
  },

  // INTERMEDIATE TOPICS
  {
    id: 'int_1',
    title: 'The Impact of Remote Work',
    category: 'Modern Work',
    level: 'intermediate',
    prompt: 'Share your perspective on working from home compared to working in a traditional office.',
    bulletPoints: ['The main benefits of remote work', 'Challenges with communication or isolation', 'What a balanced future looks like'],
    suggestedVocabulary: ['flexibility', 'work-life balance', 'collaboration', 'productivity', 'commute', 'hybrid model'],
  },
  {
    id: 'int_2',
    title: 'Social Media & Mental Health',
    category: 'Society & Tech',
    level: 'intermediate',
    prompt: 'How has the rise of social media platforms affected the way people connect and feel about themselves?',
    bulletPoints: ['Positive aspects of digital connectivity', 'Negative side effects like comparison or screen fatigue', 'Ways to maintain healthy digital habits'],
    suggestedVocabulary: ['algorithmic feed', 'screen time', 'genuine connection', 'digital detox', 'self-esteem', 'engagement'],
  },
  {
    id: 'int_3',
    title: 'Lifelong Learning in the Digital Age',
    category: 'Personal Growth',
    level: 'intermediate',
    prompt: 'Why has continuous learning and upskilling become critical for modern professionals?',
    bulletPoints: ['How rapidly industries and technology change', 'Online tools and courses available today', 'A skill you recently learned or want to master'],
    suggestedVocabulary: ['adaptability', 'upskilling', 'mastery', 'online resources', 'career resilience', 'curiosity'],
  },
  {
    id: 'int_4',
    title: 'Sustainable Living Habits',
    category: 'Environment',
    level: 'intermediate',
    prompt: 'What everyday actions can individuals take to live more sustainably and protect the environment?',
    bulletPoints: ['Reducing plastic and food waste', 'Energy conservation at home', 'The role of public awareness'],
    suggestedVocabulary: ['eco-friendly', 'carbon footprint', 'conservation', 'renewable', 'consumption', 'responsibility'],
  },

  // ADVANCED TOPICS
  {
    id: 'adv_1',
    title: 'AI, Automation, and the Future of Labor',
    category: 'Technology & Economy',
    level: 'advanced',
    prompt: 'Analyze how generative artificial intelligence and autonomous systems will reshape the global workforce over the next decade.',
    bulletPoints: ['Which industries face the greatest disruption', 'The emergence of novel roles requiring human creativity & emotional intelligence', 'Policy and economic frameworks to ensure equitable transition'],
    suggestedVocabulary: ['paradigm shift', 'automation', 'cognitive augmentation', 'displacement', 'ubiquitous', 'reskilling initiatives'],
  },
  {
    id: 'adv_2',
    title: 'Leadership in Times of Crisis',
    category: 'Executive & Management',
    level: 'advanced',
    prompt: 'Examine the essential attributes and communication strategies of effective leaders navigating unprecedented uncertainty.',
    bulletPoints: ['Balancing transparency with organizational reassurance', 'Decisive decision-making with incomplete information', 'Fostering psychological safety and resilience among teams'],
    suggestedVocabulary: ['strategic foresight', 'stakeholder alignment', 'empathetic leadership', 'agility', 'mitigate risk', 'accountability'],
  },
  {
    id: 'adv_3',
    title: 'Ethics in Biotechnology & Genetic Engineering',
    category: 'Bioethics & Science',
    level: 'advanced',
    prompt: 'Debate the ethical boundaries surrounding modern genetic modification, CRISPR technology, and personalized medicine.',
    bulletPoints: ['The potential eradication of hereditary diseases', 'Ethical dilemmas regarding gene editing and biological equity', 'International regulatory governance'],
    suggestedVocabulary: ['bioethics', 'therapeutic intervention', 'germline editing', 'socioeconomic disparity', 'regulatory oversight', 'precedent'],
  },
  {
    id: 'adv_4',
    title: 'Globalization vs. Economic Localization',
    category: 'Geopolitics & Commerce',
    level: 'advanced',
    prompt: 'Evaluate the tension between interconnected global supply chains and the resurgence of domestic manufacturing priorities.',
    bulletPoints: ['Vulnerabilities exposed by global supply shocks', 'Economic efficiency vs. national security and resilience', 'The socio-political implications for emerging markets'],
    suggestedVocabulary: ['supply chain resilience', 'protectionism', 'interdependence', 'deglobalization', 'economic sovereignty', 'macroeconomic volatility'],
  },
];
