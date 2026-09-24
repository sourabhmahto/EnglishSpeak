import { EnglishLevel } from '../constants/levels';

export type WorkoutPhase = 'intro' | 'shadowing' | 'rapidFire' | 'idiom' | 'summary';

export interface ExerciseScore {
  exerciseId: string;
  type: 'shadowing' | 'rapidFire' | 'idiom';
  targetText?: string;
  spokenText: string;
  accuracyScore: number; // 0 - 100
  durationSeconds: number;
  wpm: number;
  fillerCount: number;
  feedback: string;
}

export interface WorkoutSessionSummary {
  date: string;
  level: EnglishLevel;
  totalDurationSeconds: number;
  shadowingAccuracy: number;
  rapidFireFluency: number;
  idiomCompleted: boolean;
  overallScore: number;
  exercises: ExerciseScore[];
}
