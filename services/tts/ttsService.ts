import * as Speech from 'expo-speech';
import { EnglishLevel, LEVELS } from '../../constants/levels';

export interface TtsOptions {
  rate?: number;
  pitch?: number;
  voice?: string;
  language?: string;
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
}

class TextToSpeechService {
  private isCurrentlySpeaking = false;

  async speak(text: string, options: TtsOptions = {}, level?: EnglishLevel): Promise<void> {
    if (!text || text.trim().length === 0) return;

    // Determine speech rate: options.rate takes precedence, then level-based default (0.8 / 1.0 / 1.05)
    let rate = 1.0;
    if (typeof options.rate === 'number') {
      rate = options.rate;
    } else if (level && LEVELS[level]) {
      rate = LEVELS[level].ttsRate;
    }

    try {
      // Stop any current speech
      await this.stop();

      this.isCurrentlySpeaking = true;

      Speech.speak(text, {
        language: options.language || 'en-US',
        rate,
        pitch: options.pitch || 1.0,
        voice: options.voice,
        onStart: () => {
          this.isCurrentlySpeaking = true;
          options.onStart?.();
        },
        onDone: () => {
          this.isCurrentlySpeaking = false;
          options.onDone?.();
        },
        onStopped: () => {
          this.isCurrentlySpeaking = false;
          options.onStopped?.();
        },
        onError: (err) => {
          this.isCurrentlySpeaking = false;
          options.onError?.(err instanceof Error ? err : new Error(String(err)));
        },
      });
    } catch (error) {
      console.warn('[TtsService] Speak error:', error);
      this.isCurrentlySpeaking = false;
      options.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async stop(): Promise<void> {
    try {
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        await Speech.stop();
      }
      this.isCurrentlySpeaking = false;
    } catch (e) {
      console.warn('[TtsService] Stop error:', e);
      this.isCurrentlySpeaking = false;
    }
  }

  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return this.isCurrentlySpeaking;
    }
  }

  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.filter((v) => v.language.startsWith('en'));
    } catch (e) {
      console.warn('[TtsService] Could not fetch voices:', e);
      return [];
    }
  }
}

export const ttsService = new TextToSpeechService();
