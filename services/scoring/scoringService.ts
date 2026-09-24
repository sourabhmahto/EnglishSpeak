import { EnglishLevel } from '../../constants/levels';
import { SessionMetrics } from '../../types/session';
import { detectFillers } from '../../utils/fillers';
import { calculateWpm, calculateEstimatedIelts } from '../../utils/scoring';
import { getWordCount } from '../../utils/formatting';

export interface RawSpeakingInput {
  transcript: string;
  durationSeconds: number;
  pauseSeconds?: number;
  pauseCount?: number;
  level: EnglishLevel;
  aiGrammarScore?: number;
  aiConfidenceScore?: number;
}

export class ScoringService {
  /**
   * Computes unified session metrics distinguishing measured vs estimated parameters
   */
  evaluateSession(input: RawSpeakingInput): SessionMetrics {
    const wordCount = getWordCount(input.transcript);
    const durationSeconds = Math.max(input.durationSeconds, 1);
    const wpm = calculateWpm(wordCount, durationSeconds);

    const fillerResult = detectFillers(input.transcript);
    const fillerCount = fillerResult.totalCount;
    const fillerRate = fillerResult.fillerRate;

    const pauseSeconds = input.pauseSeconds || 0;
    const pauseCount = input.pauseCount || 0;

    // AI-estimated metrics with heuristic fallbacks if offline
    let grammarScore = input.aiGrammarScore;
    if (typeof grammarScore !== 'number') {
      // Heuristic based on level and filler rate
      const baseScore = input.level === 'advanced' ? 82 : input.level === 'intermediate' ? 76 : 70;
      const penalty = Math.min(fillerRate * 1.5, 20);
      grammarScore = Math.round(Math.max(baseScore - penalty, 50));
    }

    let confidenceScore = input.aiConfidenceScore;
    if (typeof confidenceScore !== 'number') {
      // Heuristic based on pace and pause ratio
      const pauseRatio = durationSeconds > 0 ? pauseSeconds / durationSeconds : 0;
      const baseConf = 85 - pauseRatio * 40 - (fillerRate > 5 ? 10 : 0);
      confidenceScore = Math.round(Math.min(Math.max(baseConf, 45), 98));
    }

    const estimatedIeltsScore = calculateEstimatedIelts({
      wpm,
      fillerRate,
      grammarScore,
      confidenceScore,
      level: input.level,
    });

    return {
      durationSeconds,
      wordCount,
      wpm,
      fillerCount,
      fillerRate,
      pauseSeconds,
      pauseCount,
      grammarScore,
      confidenceScore,
      estimatedIeltsScore,
    };
  }
}

export const scoringService = new ScoringService();
