import { calculateWpm, assessWpm, calculateTextSimilarity, calculateEstimatedIelts } from '../utils/scoring';
import { scoringService } from '../services/scoring/scoringService';

describe('Scoring & Fluency Utilities', () => {
  test('calculates correct WPM', () => {
    // 120 words spoken in 60 seconds = 120 WPM
    expect(calculateWpm(120, 60)).toBe(120);

    // 60 words spoken in 30 seconds = 120 WPM
    expect(calculateWpm(60, 30)).toBe(120);

    // 0 words or 0 duration
    expect(calculateWpm(0, 60)).toBe(0);
    expect(calculateWpm(50, 0)).toBe(0);
  });

  test('assesses optimal vs slow pace by English level', () => {
    expect(assessWpm(60, 'beginner')).toBe('too_slow');
    expect(assessWpm(100, 'beginner')).toBe('optimal');
    expect(assessWpm(145, 'intermediate')).toBe('optimal');
    expect(assessWpm(210, 'intermediate')).toBe('too_fast');
    expect(assessWpm(160, 'advanced')).toBe('optimal');
  });

  test('calculates text similarity for Shadowing accuracy', () => {
    const target = 'I really enjoy going for a walk in the morning.';
    const spokenExact = 'I really enjoy going for a walk in the morning.';
    expect(calculateTextSimilarity(target, spokenExact)).toBe(100);

    const spokenPartial = 'I really enjoy walking in the morning.';
    const score = calculateTextSimilarity(target, spokenPartial);
    expect(score).toBeGreaterThan(60);
    expect(score).toBeLessThan(95);

    const completelyDifferent = 'Today is very rainy and cold.';
    expect(calculateTextSimilarity(target, completelyDifferent)).toBeLessThan(30);
  });

  test('calculates Estimated IELTS practice band within calibrated bounds', () => {
    const beginnerBand = calculateEstimatedIelts({
      wpm: 90,
      fillerRate: 4.0,
      grammarScore: 70,
      confidenceScore: 75,
      level: 'beginner',
    });
    expect(beginnerBand).toBeGreaterThanOrEqual(3.5);
    expect(beginnerBand).toBeLessThanOrEqual(5.5);

    const advancedBand = calculateEstimatedIelts({
      wpm: 155,
      fillerRate: 1.5,
      grammarScore: 92,
      confidenceScore: 90,
      level: 'advanced',
    });
    expect(advancedBand).toBeGreaterThanOrEqual(7.0);
    expect(advancedBand).toBeLessThanOrEqual(9.0);
  });

  test('scoringService distinguishes measured vs estimated metrics', () => {
    const res = scoringService.evaluateSession({
      transcript: 'I went to the store and um bought some apples.',
      durationSeconds: 30,
      pauseSeconds: 2,
      level: 'intermediate',
    });

    expect(res.durationSeconds).toBe(30);
    expect(res.wordCount).toBe(10);
    expect(res.wpm).toBe(20);
    expect(res.fillerCount).toBe(1);
    expect(res.fillerRate).toBe(10);
    expect(typeof res.grammarScore).toBe('number');
    expect(typeof res.confidenceScore).toBe('number');
    expect(typeof res.estimatedIeltsScore).toBe('number');
  });
});
