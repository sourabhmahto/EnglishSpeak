export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LevelInfo {
  id: EnglishLevel;
  code: string;
  name: string;
  cefr: string;
  ttsRate: number;
  description: string;
  speakingGoal: string;
  guidance: {
    vocabulary: string;
    sentenceComplexity: string;
    correctionsPolicy: string;
    speechSpeedDescription: string;
  };
}

export const LEVELS: Record<EnglishLevel, LevelInfo> = {
  beginner: {
    id: 'beginner',
    code: 'A1-A2',
    name: 'Beginner',
    cefr: 'A1 - A2 (Foundations)',
    ttsRate: 0.8,
    description: 'Simple sentences, clear pronunciation, patient pace, and helpful sentence starters.',
    speakingGoal: 'Build confidence with everyday conversational fundamentals.',
    guidance: {
      vocabulary: 'Basic high-frequency vocabulary, avoid rare idioms.',
      sentenceComplexity: 'Short, clear, single-clause sentences.',
      correctionsPolicy: 'Gentle positive reinforcement, highlight major mistakes only, provide helpful starter phrases.',
      speechSpeedDescription: '0.8x gentle tempo with clear articulation.',
    },
  },
  intermediate: {
    id: 'intermediate',
    code: 'B1-B2',
    name: 'Intermediate',
    cefr: 'B1 - B2 (Independent)',
    ttsRate: 1.0,
    description: 'Natural conversational flow, common phrasal verbs, filler detection, and grammar enhancements.',
    speakingGoal: 'Expand vocabulary range, reduce fillers, and speak fluently without long hesitations.',
    guidance: {
      vocabulary: 'Natural conversational idioms, phrasal verbs, and connecting words.',
      sentenceComplexity: 'Compound and complex sentences with natural clauses.',
      correctionsPolicy: 'Point out recurring grammar issues, filler words, and suggest native alternatives.',
      speechSpeedDescription: '1.0x normal conversational pace.',
    },
  },
  advanced: {
    id: 'advanced',
    code: 'C1-C2',
    name: 'Advanced',
    cefr: 'C1 - C2 (Proficient)',
    ttsRate: 1.05,
    description: 'Sophisticated discourse, debates, nuanced phrasing, executive communication, and high precision.',
    speakingGoal: 'Master native-like collocations, rhetorical flexibility, and persuasive articulation.',
    guidance: {
      vocabulary: 'Sophisticated collocations, academic & executive expressions, nuanced tone.',
      sentenceComplexity: 'Varied structures, conditional nuance, rhetorical balance.',
      correctionsPolicy: 'Strict critique of subtle inaccuracies, precision upgrades (C1/C2 alternatives).',
      speechSpeedDescription: '1.05x brisk native cadence.',
    },
  },
};

export const LEVEL_LIST: LevelInfo[] = Object.values(LEVELS);
