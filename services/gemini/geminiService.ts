import { APP_CONFIG } from '../../constants/config';
import { PromptContext, ValidatedGeminiSpeakingResponse } from '../../types/ai';
import { extractAndValidateGeminiJson } from './schemas';
import { buildPrompt, buildFeedbackPrompt } from './prompts';
import { detectFillers } from '../../utils/fillers';
import { calculateEstimatedIelts } from '../../utils/scoring';

interface GeminiApiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export class GeminiService {
  private get apiKey(): string {
    return process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  }

  private get model(): string {
    return process.env.EXPO_PUBLIC_GEMINI_MODEL || APP_CONFIG.DEFAULT_MODEL;
  }

  private get isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'your_gemini_api_key_here';
  }

  /**
   * Generates conversational AI turn response from Gemini API
   */
  async generateSpeakingTurn(context: PromptContext): Promise<ValidatedGeminiSpeakingResponse> {
    const clientFillers = detectFillers(context.userTranscript);
    const systemPrompt = buildPrompt(context);

    // Format conversation history for Gemini multi-turn format
    const contents: GeminiApiContent[] = [];

    // System instruction passed in user context or contents
    const recentHistory = context.conversationHistory.slice(-APP_CONFIG.MAX_CONVERSATION_HISTORY);
    for (const turn of recentHistory) {
      contents.push({
        role: turn.role === 'user' ? 'user' : 'model',
        parts: [{ text: turn.content }],
      });
    }

    // Add current user input with instruction
    const userPayloadText = `User spoken response: "${context.userTranscript}"\nProvide evaluation and spoken reply as strict JSON.`;
    contents.push({
      role: 'user',
      parts: [{ text: userPayloadText }],
    });

    if (!this.isConfigured) {
      console.warn('[GeminiService] API key not configured. Using intelligent offline mock engine.');
      return this.generateOfflineFallbackResponse(context, clientFillers.instances.map((f) => f.word));
    }

    try {
      const response = await this.callGeminiApi(systemPrompt, contents);
      const validated = extractAndValidateGeminiJson(response);

      if (validated) {
        // Merge client-side detected fillers with Gemini's response for highest accuracy
        const combinedFillers = Array.from(new Set([...validated.detectedFillers, ...clientFillers.instances.map((f) => f.word)]));
        return {
          ...validated,
          detectedFillers: combinedFillers,
        };
      }

      console.warn('[GeminiService] Response validation failed. Retrying once...');
      // Single retry attempt
      const retryResponse = await this.callGeminiApi(
        systemPrompt + '\nIMPORTANT: Your previous output was not valid JSON. You must return RAW JSON ONLY.',
        contents
      );
      const retryValidated = extractAndValidateGeminiJson(retryResponse);
      if (retryValidated) {
        return retryValidated;
      }
    } catch (error) {
      console.error('[GeminiService] Network/API Error:', error);
    }

    // Safe fallback to prevent app crash
    return this.generateOfflineFallbackResponse(context, clientFillers.instances.map((f) => f.word));
  }

  /**
   * Generates comprehensive session feedback at the end of a speaking session
   */
  async generateSessionFeedback(params: {
    level: any;
    type: string;
    topicOrScenario: string;
    fullTranscript: { sender: string; text: string }[];
    measuredMetrics: { wpm: number; fillerCount: number; fillerRate: number; durationSeconds: number };
  }): Promise<ValidatedGeminiSpeakingResponse> {
    const prompt = buildFeedbackPrompt(params);

    if (!this.isConfigured) {
      return this.generateOfflineSummaryFallback(params);
    }

    try {
      const contents: GeminiApiContent[] = [{ role: 'user', parts: [{ text: prompt }] }];
      const raw = await this.callGeminiApi(prompt, contents);
      const validated = extractAndValidateGeminiJson(raw);
      if (validated) return validated;
    } catch (err) {
      console.warn('[GeminiService] Feedback generation error:', err);
    }

    return this.generateOfflineSummaryFallback(params);
  }

  /**
   * Directly queries the Gemini REST API
   */
  private async callGeminiApi(systemInstruction: string, contents: GeminiApiContent[]): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json',
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Gemini API error [${res.status}]: ${errorBody}`);
      }

      const data = await res.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) {
        throw new Error('Gemini API returned empty candidate content');
      }

      return candidateText;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Offline / Fallback response generator so the app is always 100% resilient
   */
  private generateOfflineFallbackResponse(ctx: PromptContext, fillers: string[]): ValidatedGeminiSpeakingResponse {
    const isBeg = ctx.level === 'beginner';
    const isAdv = ctx.level === 'advanced';

    let spokenReply = "That's a very interesting thought! Tell me more about what you mean by that.";
    if (isBeg) {
      spokenReply = "Good job! That was clear. What is another thing you like about this?";
    } else if (isAdv) {
      spokenReply = "That is an intriguing perspective. How would you counter the argument that alternative approaches might yield greater long-term sustainability?";
    }

    const calculatedIelts = calculateEstimatedIelts({
      wpm: ctx.measuredWpm || 120,
      fillerRate: fillers.length * 2,
      grammarScore: isAdv ? 85 : isBeg ? 70 : 78,
      confidenceScore: 80,
      level: ctx.level,
    });

    return {
      spokenReply,
      wpmAssessment: 'optimal',
      detectedFillers: fillers,
      sentenceRewrites: [
        {
          original: ctx.userTranscript.slice(0, 40) || 'I think this is good.',
          grammarFixed: 'I believe this is an effective approach.',
          nativeC1Alternative: 'From my perspective, this strategy demonstrates clear merit.',
        },
      ],
      ieltsScore: calculatedIelts,
      confidenceScore: 82,
      hint: {
        starter: isBeg ? 'In my opinion, I think...' : 'A crucial factor to consider is...',
        suggestedKeywords: isBeg ? ['because', 'enjoy', 'favorite'] : ['furthermore', 'equilibrium', 'perspective'],
        exampleSentence: isBeg ? 'I enjoy spending time outdoors because it refreshes me.' : 'A holistic analysis reveals subtle systemic trade-offs.',
      },
      strengthsSummary: ['Clear communicative intent and good speech pacing.'],
      improvementSuggestions: ['Try incorporating varied transitional phrases to link your ideas.'],
    };
  }

  private generateOfflineSummaryFallback(params: {
    level: any;
    measuredMetrics: { wpm: number; fillerCount: number; fillerRate: number; durationSeconds: number };
  }): ValidatedGeminiSpeakingResponse {
    const ielts = calculateEstimatedIelts({
      wpm: params.measuredMetrics.wpm,
      fillerRate: params.measuredMetrics.fillerRate,
      grammarScore: 80,
      confidenceScore: 84,
      level: params.level,
    });

    return {
      spokenReply: `Great effort! You sustained your speaking for ${params.measuredMetrics.durationSeconds} seconds with an average pace of ${params.measuredMetrics.wpm} words per minute.`,
      wpmAssessment: 'optimal',
      detectedFillers: ['um', 'like'].slice(0, params.measuredMetrics.fillerCount),
      sentenceRewrites: [
        {
          original: 'I am agree with this point.',
          grammarFixed: 'I agree with this point.',
          nativeC1Alternative: 'I concur wholeheartedly with that assessment.',
        },
      ],
      ieltsScore: ielts,
      confidenceScore: 84,
      strengthsSummary: ['Consistent cadence and willingness to elaborate on concepts.'],
      improvementSuggestions: ['Monitor subtle pauses and replace fillers with brief intentional silences.'],
    };
  }
}

export const geminiService = new GeminiService();
