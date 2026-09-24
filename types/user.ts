import { EnglishLevel } from '../constants/levels';
import { PersonaId } from '../constants/personas';

export type ProfileId = 'user_1' | 'user_2';

export interface UserSettings {
  theme: 'system' | 'dark' | 'light';
  selectedLevel: EnglishLevel;
  selectedPersona: PersonaId;
  speakingRate: number; // 0.8 - 1.2
  voiceIdentifier?: string;
  autoPlayAiVoice: boolean;
  hapticFeedback: boolean;
  dailyGoalMinutes: number;
}

export interface UserProfile {
  id: ProfileId;
  name: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
