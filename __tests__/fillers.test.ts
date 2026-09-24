import { detectFillers, countFillers, calculateFillerRate } from '../utils/fillers';

describe('Filler Detection Engine', () => {
  test('detects vocal and discourse fillers in speech', () => {
    const input = 'I um went to the office and like worked there.';
    const result = detectFillers(input);

    expect(result.totalCount).toBeGreaterThanOrEqual(2);
    const words = result.instances.map((i) => i.word);
    expect(words).toContain('um');
    expect(words).toContain('like');
  });

  test('avoids false positive for "I like coffee"', () => {
    const input = 'I like coffee very much.';
    const result = detectFillers(input);

    const words = result.instances.map((i) => i.word);
    expect(words).not.toContain('like');
    expect(result.totalCount).toBe(0);
  });

  test('avoids false positive for modal "would like"', () => {
    const input = 'I would like to order a cappuccino please.';
    const result = detectFillers(input);

    const words = result.instances.map((i) => i.word);
    expect(words).not.toContain('like');
  });

  test('detects multi-word filler "you know"', () => {
    const input = 'The project was, you know, quite challenging to execute.';
    const result = detectFillers(input);

    const words = result.instances.map((i) => i.word);
    expect(words).toContain('you know');
  });

  test('calculates correct filler rate percentage', () => {
    // 10 words total, 2 fillers ('um', 'uh')
    const input = 'um yesterday uh I visited the museum with my family.';
    const rate = calculateFillerRate(input);

    expect(rate).toBeGreaterThan(15);
    expect(rate).toBeLessThan(25);
  });

  test('handles empty input gracefully', () => {
    const result = detectFillers('');
    expect(result.totalCount).toBe(0);
    expect(result.fillerRate).toBe(0);
    expect(result.instances).toEqual([]);
  });
});
