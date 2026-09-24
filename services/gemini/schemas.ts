import { z } from 'zod';

export const SentenceRewriteSchema = z.object({
  original: z.string(),
  grammarFixed: z.string(),
  nativeC1Alternative: z.string(),
});

export const GeminiSpeakingResponseSchema = z.object({
  spokenReply: z.string().min(1, 'Spoken reply cannot be empty'),
  wpmAssessment: z.enum(['too_slow', 'optimal', 'too_fast']).default('optimal'),
  detectedFillers: z.array(z.string()).default([]),
  sentenceRewrites: z.array(SentenceRewriteSchema).default([]),
  ieltsScore: z.number().min(1.0).max(9.0).default(6.5),
  confidenceScore: z.number().min(0).max(100).default(80),
  hint: z
    .object({
      starter: z.string(),
      suggestedKeywords: z.array(z.string()),
      exampleSentence: z.string().optional(),
    })
    .optional(),
  strengthsSummary: z.array(z.string()).optional(),
  improvementSuggestions: z.array(z.string()).optional(),
});

export type ValidatedGeminiSpeakingResponse = z.infer<typeof GeminiSpeakingResponseSchema>;

/**
 * Safe JSON extractor that pulls out a JSON block from potential markdown fences or surrounding chatter
 */
export function extractAndValidateGeminiJson(rawText: string): ValidatedGeminiSpeakingResponse | null {
  if (!rawText || typeof rawText !== 'string') return null;

  try {
    let clean = rawText.trim();
    // Strip markdown code block wrappers ```json ... ``` or ``` ... ```
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    // Try finding first { and last }
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(clean);
    const result = GeminiSpeakingResponseSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    } else {
      console.warn('[GeminiSchema] Schema validation warnings:', result.error.errors);
      // Attempt partial recovery if spokenReply exists
      if (parsed && typeof parsed.spokenReply === 'string' && parsed.spokenReply.trim().length > 0) {
        return {
          spokenReply: parsed.spokenReply,
          wpmAssessment: parsed.wpmAssessment || 'optimal',
          detectedFillers: Array.isArray(parsed.detectedFillers) ? parsed.detectedFillers : [],
          sentenceRewrites: Array.isArray(parsed.sentenceRewrites) ? parsed.sentenceRewrites : [],
          ieltsScore: typeof parsed.ieltsScore === 'number' ? parsed.ieltsScore : 6.0,
          confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 75,
        };
      }
      return null;
    }
  } catch (error) {
    console.warn('[GeminiSchema] JSON parse error:', error);
    return null;
  }
}
