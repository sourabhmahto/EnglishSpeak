import { extractAndValidateGeminiJson } from '../services/gemini/schemas';
import { buildBeginnerPrompt, buildIntermediatePrompt, buildAdvancedPrompt } from '../services/gemini/prompts';

describe('Gemini AI Schema Validation & Prompts', () => {
  test('validates valid structured JSON response', () => {
    const rawJson = JSON.stringify({
      spokenReply: 'That sounds like a great weekend activity!',
      wpmAssessment: 'optimal',
      detectedFillers: ['um'],
      sentenceRewrites: [
        {
          original: 'I go to beach.',
          grammarFixed: 'I went to the beach.',
          nativeC1Alternative: 'I headed down to the coast.',
        },
      ],
      ieltsScore: 6.5,
      confidenceScore: 85,
    });

    const validated = extractAndValidateGeminiJson(rawJson);
    expect(validated).not.toBeNull();
    expect(validated?.spokenReply).toBe('That sounds like a great weekend activity!');
    expect(validated?.ieltsScore).toBe(6.5);
    expect(validated?.sentenceRewrites.length).toBe(1);
  });

  test('extracts JSON from markdown code fences', () => {
    const wrapped = `
Here is the evaluated feedback:
\`\`\`json
{
  "spokenReply": "Excellent explanation.",
  "wpmAssessment": "optimal",
  "detectedFillers": [],
  "sentenceRewrites": [],
  "ieltsScore": 7.5,
  "confidenceScore": 90
}
\`\`\`
Hope this helps!
`;
    const validated = extractAndValidateGeminiJson(wrapped);
    expect(validated).not.toBeNull();
    expect(validated?.spokenReply).toBe('Excellent explanation.');
    expect(validated?.ieltsScore).toBe(7.5);
  });

  test('recovers safely from partial JSON if spokenReply exists', () => {
    const partial = `{"spokenReply": "Keep up the great work!", "invalidField": 123}`;
    const validated = extractAndValidateGeminiJson(partial);
    expect(validated).not.toBeNull();
    expect(validated?.spokenReply).toBe('Keep up the great work!');
  });

  test('returns null gracefully on completely invalid content without crashing', () => {
    const bad = 'This is plain text with no JSON at all.';
    const validated = extractAndValidateGeminiJson(bad);
    expect(validated).toBeNull();
  });

  test('builds level-adapted prompts with persona rules', () => {
    const dummyCtx = {
      level: 'beginner' as const,
      persona: 'casual' as const,
      conversationHistory: [],
      userTranscript: 'Hello',
    };

    const begPrompt = buildBeginnerPrompt(dummyCtx);
    expect(begPrompt).toContain('BEGINNER');
    expect(begPrompt).toContain('SIMPLE vocabulary');

    const midPrompt = buildIntermediatePrompt({ ...dummyCtx, level: 'intermediate' });
    expect(midPrompt).toContain('INTERMEDIATE');

    const advPrompt = buildAdvancedPrompt({ ...dummyCtx, level: 'advanced' });
    expect(advPrompt).toContain('ADVANCED');
    expect(advPrompt).toContain('CEFR C1-C2');
  });
});
