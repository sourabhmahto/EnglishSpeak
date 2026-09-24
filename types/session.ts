import { EnglishLevel } from '../constants/levels';
import { PersonaId } from '../constants/personas';
import { SentenceRewrite } from './ai';

export type SessionType = 'call' | 'simulator' | 'roleplay' | 'workout';

export type VoiceOrbState = 'IDLE' | 'LISTENING' | 'THINKING' | 'AI_SPEAKING' | 'USER_SPEAKING';

export interface TranscriptItem {
  id: string;
  sender: 'user' | 'sarah';
  text: string;
  timestamp: string;
  audioDurationSeconds?: number;
  detectedFillers?: string[];
  rewrites?: SentenceRewrite[];
}

export interface SessionMetrics {
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number; // percentage, e.g. 3.5
  pauseSeconds: number;
  pauseCount: number;
  grammarScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  estimatedIeltsScore: number; // 0.0 - 9.0 (0.5 increments)
}

export interface SpeakingSession {
  id: string;
  profileId: string;
  date: string; // ISO timestamp
  type: SessionType;
  level: EnglishLevel;
  persona?: PersonaId;
  scenarioId?: string;
  topicTitle?: string;
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
  pauseSeconds: number;
  grammarScore: number;
  confidenceScore: number;
  estimatedIeltsScore: number;
  transcript: TranscriptItem[];
  rewrites?: SentenceRewrite[];
  strengths?: string[];
  improvements?: string[];
}
