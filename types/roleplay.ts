import { EnglishLevel } from '../constants/levels';
import { SentenceRewrite } from './ai';
import { TranscriptItem } from './session';

export interface RoleplaySessionState {
  scenarioId: string;
  level: EnglishLevel;
  isActive: boolean;
  transcript: TranscriptItem[];
  turnCount: number;
  startTime: number;
  durationSeconds: number;
}

export interface RoleplayFeedback {
  scenarioId: string;
  scenarioTitle: string;
  level: EnglishLevel;
  durationSeconds: number;
  totalWords: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
  grammarScore: number;
  confidenceScore: number;
  estimatedIeltsScore: number;
  grammarFeedback: string[];
  vocabularyFeedback: string[];
  fluencyFeedback: string[];
  sentenceRewrites: SentenceRewrite[];
}
