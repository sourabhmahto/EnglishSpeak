import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { Platform } from 'react-native';

export type SpeechRecognitionState = 'idle' | 'starting' | 'listening' | 'recognizing' | 'stopping' | 'error';

export interface SpeechServiceListener {
  onStateChange?: (state: SpeechRecognitionState) => void;
  onPartialResult?: (text: string) => void;
  onFinalResult?: (text: string) => void;
  onError?: (error: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
}

class SpeechRecognitionService {
  private isInitialized = false;
  private isNativeAvailable = false;
  private currentState: SpeechRecognitionState = 'idle';
  private listeners: Set<SpeechServiceListener> = new Set();
  private lastRecognizedText = '';
  private isSimulating = false;
  private simulationTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    try {
      if (Voice && typeof Voice.onSpeechStart !== 'undefined') {
        Voice.onSpeechStart = this.handleSpeechStart.bind(this);
        Voice.onSpeechRecognized = this.handleSpeechRecognized.bind(this);
        Voice.onSpeechEnd = this.handleSpeechEnd.bind(this);
        Voice.onSpeechError = this.handleSpeechError.bind(this);
        Voice.onSpeechResults = this.handleSpeechResults.bind(this);
        Voice.onSpeechPartialResults = this.handleSpeechPartialResults.bind(this);
        this.isNativeAvailable = true;
      } else {
        this.isNativeAvailable = false;
      }
    } catch (e) {
      console.warn('[SpeechService] Native voice not initialized (likely running in non-native environment):', e);
      this.isNativeAvailable = false;
    }

    this.isInitialized = true;
  }

  private setState(state: SpeechRecognitionState) {
    this.currentState = state;
    this.listeners.forEach((l) => l.onStateChange?.(state));
  }

  private handleSpeechStart() {
    this.setState('listening');
    this.listeners.forEach((l) => l.onSpeechStart?.());
  }

  private handleSpeechRecognized() {
    this.setState('recognizing');
  }

  private handleSpeechEnd() {
    this.setState('idle');
    this.listeners.forEach((l) => l.onSpeechEnd?.());
    if (this.lastRecognizedText) {
      this.listeners.forEach((l) => l.onFinalResult?.(this.lastRecognizedText));
    }
  }

  private handleSpeechError(e: SpeechErrorEvent) {
    console.warn('[SpeechService] Speech recognition error event:', e);
    const errorMsg = e.error?.message || 'Speech recognition encountered an issue.';
    this.setState('error');
    this.listeners.forEach((l) => l.onError?.(errorMsg));
  }

  private handleSpeechResults(e: SpeechResultsEvent) {
    const text = e.value && e.value.length > 0 ? e.value[0] : '';
    this.lastRecognizedText = text;
    this.listeners.forEach((l) => l.onFinalResult?.(text));
  }

  private handleSpeechPartialResults(e: SpeechResultsEvent) {
    const text = e.value && e.value.length > 0 ? e.value[0] : '';
    if (text) {
      this.lastRecognizedText = text;
      this.listeners.forEach((l) => l.onPartialResult?.(text));
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.isNativeAvailable || !Voice) {
      return false;
    }
    try {
      const isAvail = await Voice.isAvailable();
      return !!isAvail;
    } catch (e) {
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isNativeAvailable || !Voice) {
      return true; // allow fallback simulation mode
    }
    try {
      const avail = await this.isAvailable();
      return avail;
    } catch {
      return false;
    }
  }

  async startListening(locale: string = 'en-US'): Promise<void> {
    this.lastRecognizedText = '';
    this.setState('starting');

    if (this.isNativeAvailable && Voice) {
      try {
        await Voice.stop();
        await Voice.destroy();
        this.init();
        await Voice.start(locale);
        return;
      } catch (err) {
        console.warn('[SpeechService] Voice.start failed, switching to fallback voice input simulation:', err);
      }
    }

    // Fallback simulation mode for environments without native voice build
    this.isSimulating = true;
    this.setState('listening');
    this.listeners.forEach((l) => l.onSpeechStart?.());
  }

  /**
   * Helper for testing/fallback typing or simulation
   */
  simulateSpokenText(simulatedText: string) {
    this.lastRecognizedText = simulatedText;
    this.listeners.forEach((l) => {
      l.onPartialResult?.(simulatedText);
      l.onFinalResult?.(simulatedText);
    });
    this.setState('idle');
  }

  async stopListening(): Promise<string> {
    if (this.isNativeAvailable && Voice) {
      try {
        await Voice.stop();
      } catch (e) {
        console.warn('[SpeechService] Voice.stop error:', e);
      }
    }

    if (this.simulationTimer) {
      clearTimeout(this.simulationTimer);
      this.simulationTimer = null;
    }

    this.isSimulating = false;
    this.setState('idle');
    return this.lastRecognizedText;
  }

  async cancelListening(): Promise<void> {
    if (this.isNativeAvailable && Voice) {
      try {
        await Voice.cancel();
      } catch (e) {
        console.warn('[SpeechService] Voice.cancel error:', e);
      }
    }
    if (this.simulationTimer) {
      clearTimeout(this.simulationTimer);
    }
    this.lastRecognizedText = '';
    this.setState('idle');
  }

  subscribe(listener: SpeechServiceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async destroy(): Promise<void> {
    this.listeners.clear();
    if (this.isNativeAvailable && Voice) {
      try {
        await Voice.destroy();
      } catch (e) {
        console.warn('[SpeechService] Voice.destroy error:', e);
      }
    }
  }
}

export const speechService = new SpeechRecognitionService();
