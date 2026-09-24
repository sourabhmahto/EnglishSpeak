import { EnglishLevel } from '../constants/levels';
import { PersonaId } from '../constants/personas';

export interface SentenceRewrite {
  original: string;
  grammarFixed: string;
  nativeC1Alternative: string;
}

export type WpmAssessment = 'too_slow' | 'optimal' | 'too_fast';

export interface GeminiSpeakingResponse {
  spokenReply: string;
  wpmAssessment: WpmAssessment;
  detectedFillers: string[];
  sentenceRewrites: SentenceRewrite[];
  ieltsScore: number;
  confidenceScore: number;
  hint?: {
    starter: string;
    suggestedKeywords: string[];
    exampleSentence?: string;
  };
  strengthsSummary?: string[];
  improvementSuggestions?: string[];
}

export type ValidatedGeminiSpeakingResponse = GeminiSpeakingResponse;

export interface ConversationTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metrics?: {
    wordCount?: number;
    wpm?: number;
    fillers?: string[];
  };
}

export interface PromptContext {
  level: EnglishLevel;
  persona: PersonaId;
  conversationHistory: ConversationTurn[];
  userTranscript: string;
  scenarioTitle?: string;
  scenarioObjective?: string;
  learningObjective?: string;
  previousCorrections?: SentenceRewrite[];
  measuredWpm?: number;
  measuredFillerCount?: number;
}
