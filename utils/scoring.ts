import { EnglishLevel } from '../constants/levels';

/**
 * Calculates Words Per Minute (WPM) based on total word count and active speaking duration.
 */
export function calculateWpm(wordCount: number, durationSeconds: number): number {
  if (durationSeconds <= 0 || wordCount <= 0) return 0;
  const minutes = durationSeconds / 60;
  const wpm = Math.round(wordCount / minutes);
  return Math.min(Math.max(wpm, 0), 300); // capped at realistic bounds
}

/**
 * Evaluates WPM against optimal conversational pace for level
 */
export function assessWpm(wpm: number, level: EnglishLevel): 'too_slow' | 'optimal' | 'too_fast' {
  const ranges = {
    beginner: { min: 80, max: 130 },
    intermediate: { min: 110, max: 160 },
    advanced: { min: 130, max: 185 },
  };

  const { min, max } = ranges[level] || ranges.intermediate;
  if (wpm < min) return 'too_slow';
  if (wpm > max) return 'too_fast';
  return 'optimal';
}

/**
 * Computes word-level similarity percentage between target sentence and spoken transcript (for Shadowing).
 */
export function calculateTextSimilarity(target: string, spoken: string): number {
  if (!target || !spoken) return 0;

  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim()
      .split(/\s+/);

  const targetWords = clean(target);
  const spokenWords = clean(spoken);

  if (targetWords.length === 0) return 0;

  let matchedWords = 0;
  const spokenCopy = [...spokenWords];

  for (const word of targetWords) {
    const foundIndex = spokenCopy.indexOf(word);
    if (foundIndex !== -1) {
      matchedWords++;
      spokenCopy.splice(foundIndex, 1);
    }
  }

  // Length penalty if user said significantly more or fewer words
  const lengthRatio = Math.min(spokenWords.length / targetWords.length, targetWords.length / spokenWords.length);
  const wordOverlap = matchedWords / targetWords.length;

  const rawScore = (wordOverlap * 0.7 + lengthRatio * 0.3) * 100;
  return Math.round(Math.min(Math.max(rawScore, 0), 100));
}

/**
 * Generates an estimated IELTS Speaking Band Score (0.0 to 9.0 in 0.5 increments)
 * based on measured metrics and AI-evaluated grammar/fluency.
 */
export function calculateEstimatedIelts(params: {
  wpm: number;
  fillerRate: number;
  grammarScore: number;
  confidenceScore: number;
  level: EnglishLevel;
}): number {
  const { wpm, fillerRate, grammarScore, confidenceScore, level } = params;

  // Fluency sub-score (0-9)
  let fluencySub = 6.0;
  if (wpm >= 120 && wpm <= 170 && fillerRate < 4) fluencySub = 7.5;
  else if (wpm >= 100 && fillerRate < 6) fluencySub = 6.5;
  else if (wpm >= 80 && fillerRate < 8) fluencySub = 5.5;
  else fluencySub = 4.5;

  // Grammar sub-score (0-9)
  const grammarSub = (grammarScore / 100) * 9.0;

  // Pronunciation & Confidence sub-score (0-9)
  const confSub = (confidenceScore / 100) * 9.0;

  // Weighted average
  const weightedBand = fluencySub * 0.35 + grammarSub * 0.35 + confSub * 0.3;

  // Level calibration
  const levelBounds = {
    beginner: { min: 3.5, max: 5.5 },
    intermediate: { min: 5.0, max: 7.5 },
    advanced: { min: 6.5, max: 9.0 },
  };
  const bounds = levelBounds[level] || levelBounds.intermediate;
  const clamped = Math.min(Math.max(weightedBand, bounds.min), bounds.max);

  // Round to nearest 0.5
  return Math.round(clamped * 2) / 2;
}
