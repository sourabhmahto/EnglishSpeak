import { EnglishLevel } from './levels';

export interface ShadowingExerciseItem {
  id: string;
  sentence: string;
  focusArea: string; // e.g. "Linking & Rhythm", "Intonation", "Connected Speech"
  tips: string;
}

export interface RapidFireQuestionItem {
  id: string;
  question: string;
  timeLimitSeconds: number;
  starterHint: string;
  targetLengthWords: number;
}

export interface IdiomOfTheDayItem {
  id: string;
  idiom: string;
  meaning: string;
  exampleSentence: string;
  originOrContext: string;
  speakingChallenge: string;
}

export interface DailyWorkoutData {
  level: EnglishLevel;
  title: string;
  durationMinutes: number;
  shadowing: ShadowingExerciseItem[];
  rapidFire: RapidFireQuestionItem[];
  idiom: IdiomOfTheDayItem;
}

export const DAILY_WORKOUTS: Record<EnglishLevel, DailyWorkoutData> = {
  beginner: {
    level: 'beginner',
    title: 'Daily Fluency Foundation (10 min)',
    durationMinutes: 10,
    shadowing: [
      {
        id: 'sh_beg_1',
        sentence: 'I really enjoy going for a walk in the morning when the air is fresh.',
        focusArea: 'Rhythm & Breath Groups',
        tips: 'Pause naturally after "morning" and link "walk in the" smoothly.',
      },
      {
        id: 'sh_beg_2',
        sentence: 'Could you please let me know what time the next train arrives?',
        focusArea: 'Polite Intonation Rise',
        tips: 'Let your voice rise slightly at the end of the question.',
      },
      {
        id: 'sh_beg_3',
        sentence: 'Last weekend we visited a lovely family restaurant near the lake.',
        focusArea: 'Past Tense Articulation',
        tips: 'Pronounce the "-ed" in "visited" clearly as /ɪd/.',
      },
    ],
    rapidFire: [
      {
        id: 'rf_beg_1',
        question: 'What is your favorite meal of the day and why?',
        timeLimitSeconds: 20,
        starterHint: 'My favorite meal is breakfast because...',
        targetLengthWords: 15,
      },
      {
        id: 'rf_beg_2',
        question: 'What did you do first thing this morning?',
        timeLimitSeconds: 20,
        starterHint: 'First thing this morning, I woke up and...',
        targetLengthWords: 15,
      },
      {
        id: 'rf_beg_3',
        question: 'Where is one place you feel most relaxed?',
        timeLimitSeconds: 20,
        starterHint: 'I feel most relaxed when I am at...',
        targetLengthWords: 15,
      },
    ],
    idiom: {
      id: 'idiom_beg_1',
      idiom: 'Piece of cake',
      meaning: 'Something that is very easy or simple to do.',
      exampleSentence: 'The English listening test was a piece of cake for her.',
      originOrContext: 'Commonly used in informal everyday conversations when describing effortless tasks.',
      speakingChallenge: 'Use "piece of cake" in a sentence to describe a task you found surprisingly easy this week.',
    },
  },
  intermediate: {
    level: 'intermediate',
    title: 'Conversational Momentum & Phrasal Precision (10 min)',
    durationMinutes: 10,
    shadowing: [
      {
        id: 'sh_int_1',
        sentence: 'To be completely honest, we need to rethink our approach before committing more resources.',
        focusArea: 'Conversational Cadence & Stress',
        tips: 'Emphasize "completely honest" and "rethink" with natural downbeats.',
      },
      {
        id: 'sh_int_2',
        sentence: 'Although the initial rollout encountered a few hurdles, the team adapted remarkably quickly.',
        focusArea: 'Subordinate Clause Transition',
        tips: 'Keep the pitch elevated through "hurdles" before releasing into "the team adapted".',
      },
      {
        id: 'sh_int_3',
        sentence: 'I would be keen to schedule a follow-up discussion once the preliminary metrics are finalized.',
        focusArea: 'Professional Collocations',
        tips: 'Blend "follow-up discussion" and "preliminary metrics" without hesitation.',
      },
    ],
    rapidFire: [
      {
        id: 'rf_int_1',
        question: 'How do you handle productivity when feeling overwhelmed by multiple deadlines?',
        timeLimitSeconds: 25,
        starterHint: 'When facing tight deadlines, I prioritize by...',
        targetLengthWords: 30,
      },
      {
        id: 'rf_int_2',
        question: 'What is one technological innovation that drastically improved your daily routine?',
        timeLimitSeconds: 25,
        starterHint: 'One innovation that has made a huge difference is...',
        targetLengthWords: 30,
      },
      {
        id: 'rf_int_3',
        question: 'If you could learn any new professional skill in 30 days, what would it be and why?',
        timeLimitSeconds: 25,
        starterHint: 'I would choose to learn because it would enable me to...',
        targetLengthWords: 30,
      },
    ],
    idiom: {
      id: 'idiom_int_1',
      idiom: 'Hit the nail on the head',
      meaning: 'To describe exactly what is causing a situation or problem with total accuracy.',
      exampleSentence: 'When David pointed out the communication gap between departments, he hit the nail on the head.',
      originOrContext: 'Frequently used in business meetings, collaborative discussions, and analytical debriefs.',
      speakingChallenge: 'Speak a sentence describing a time a colleague or friend accurately identified a tricky issue.',
    },
  },
  advanced: {
    level: 'advanced',
    title: 'Executive Rhetoric & Fluency Mastery (10 min)',
    durationMinutes: 10,
    shadowing: [
      {
        id: 'sh_adv_1',
        sentence: 'The fundamental dichotomy between rapid innovation and comprehensive risk governance demands strategic equilibrium.',
        focusArea: 'Polysyllabic Articulation & Executive Weight',
        tips: 'Maintain crisp vowel clarity across "dichotomy", "governance", and "equilibrium".',
      },
      {
        id: 'sh_adv_2',
        sentence: 'Far from being merely an operational concession, cross-functional synergy represents our primary competitive moat.',
        focusArea: 'Inversion & Rhetorical Contrast',
        tips: 'Deliver "far from being" with measured gravitas and emphasize "primary competitive moat".',
      },
      {
        id: 'sh_adv_3',
        sentence: 'We must proactively scrutinize implicit assumptions before allocating capital to speculative ventures.',
        focusArea: 'Native Collocation Flow',
        tips: 'Execute "proactively scrutinize" and "speculative ventures" with seamless liaison.',
      },
    ],
    rapidFire: [
      {
        id: 'rf_adv_1',
        question: 'Should organizations prioritize short-term quarterly shareholder returns or decades-long sustainability investments?',
        timeLimitSeconds: 30,
        starterHint: 'This dilemma highlights a critical tension between...',
        targetLengthWords: 45,
      },
      {
        id: 'rf_adv_2',
        question: 'How can public institutions safeguard individual digital privacy without stifling breakthrough biomedical analytics?',
        timeLimitSeconds: 30,
        starterHint: 'A balanced regulatory paradigm requires establishing...',
        targetLengthWords: 45,
      },
      {
        id: 'rf_adv_3',
        question: 'Analyze the leadership virtue of intellectual humility when steering high-stakes corporate transformations.',
        timeLimitSeconds: 30,
        starterHint: 'Intellectual humility in executive leadership fosters...',
        targetLengthWords: 45,
      },
    ],
    idiom: {
      id: 'idiom_adv_1',
      idiom: 'Move the needle',
      meaning: 'To generate a noticeable, measurable, and consequential impact on a significant outcome.',
      exampleSentence: 'Minor UI tweaks are helpful, but only a paradigm shift in our pricing strategy will truly move the needle.',
      originOrContext: 'Standard executive and board-level terminology for evaluating strategic initiatives.',
      speakingChallenge: 'Deliver a short 20-second persuasive statement explaining what initiative would genuinely move the needle in your current projects.',
    },
  },
};
