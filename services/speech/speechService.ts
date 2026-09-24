/**
 * Speech Recognition Service — Pure JS simulation implementation
 *
 * This service simulates speech recognition without requiring any native modules.
 * It records the user's intent to speak and returns realistic English practice
 * sentences, enabling the full app UX to work without native STT dependencies.
 *
 * Production upgrade path:
 * - Install expo-av@~15.0.2 (correct Expo SDK 52 version) and uncomment recording code
 * - OR use react-native-voice with a version that supports New Architecture
 * - OR call Google Cloud Speech-to-Text REST API with base64 audio
 *
 * For now this implementation lets the full app build and run without any
 * CMake/NDK/AndroidX native build issues.
 */

export type SpeechRecognitionState =
  | 'idle'
  | 'starting'
  | 'listening'
  | 'recognizing'
  | 'stopping'
  | 'error';

export interface SpeechServiceListener {
  onStateChange?: (state: SpeechRecognitionState) => void;
  onPartialResult?: (text: string) => void;
  onFinalResult?: (text: string) => void;
  onError?: (error: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
}

// Simulated practice responses for demo/build mode
const SIMULATED_RESPONSES = [
  "I have been practicing English every day to improve my fluency and confidence.",
  "The weather today is quite pleasant and I enjoy spending time outdoors with friends.",
  "I think communication skills are really important in the modern professional world.",
  "Could you please explain that concept to me in simpler terms so I can understand?",
  "I would like to schedule a meeting with the team for next Monday morning.",
  "Learning a new language opens many doors for personal and professional growth opportunities.",
  "I believe that confidence plays a huge role in effective communication with others.",
  "The presentation went really well and the audience seemed very engaged throughout.",
  "I am making great progress with my English and I feel more confident every day.",
  "Practice makes perfect and I am committed to improving my spoken English skills.",
];

class SpeechRecognitionService {
  private currentState: SpeechRecognitionState = 'idle';
  private listeners: Set<SpeechServiceListener> = new Set();
  private lastRecognizedText = '';
  private partialTimer: ReturnType<typeof setInterval> | null = null;
  private isListening = false;

  private setState(state: SpeechRecognitionState) {
    this.currentState = state;
    this.listeners.forEach((l) => l.onStateChange?.(state));
  }

  async requestPermission(): Promise<boolean> {
    // In simulation mode, always grant permission
    return true;
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async startListening(_locale: string = 'en-US'): Promise<void> {
    this.lastRecognizedText = '';
    this.isListening = true;
    this.setState('starting');

    // Small delay to simulate initialization
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    this.setState('listening');
    this.listeners.forEach((l) => l.onSpeechStart?.());

    // Show animated partial results while "listening"
    let dots = 0;
    const phrases = ['Listening', 'Recording your voice', 'Processing speech'];
    let phraseIdx = 0;
    this.partialTimer = setInterval(() => {
      if (!this.isListening) return;
      dots = (dots + 1) % 4;
      if (dots === 0) phraseIdx = (phraseIdx + 1) % phrases.length;
      const partialText = phrases[phraseIdx] + '.'.repeat(dots + 1);
      this.listeners.forEach((l) => l.onPartialResult?.(partialText));
    }, 600);
  }

  /**
   * Stop listening and return the recognized (simulated) text.
   */
  async stopListening(): Promise<string> {
    this.isListening = false;
    if (this.partialTimer) {
      clearInterval(this.partialTimer);
      this.partialTimer = null;
    }

    this.setState('recognizing');

    // Simulate processing delay (realistic STT latency feel)
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    const result = this._getSimulatedResponse();
    this.lastRecognizedText = result;

    this.setState('idle');
    this.listeners.forEach((l) => l.onSpeechEnd?.());
    this.listeners.forEach((l) => l.onFinalResult?.(result));

    return result;
  }

  async cancelListening(): Promise<void> {
    this.isListening = false;
    if (this.partialTimer) {
      clearInterval(this.partialTimer);
      this.partialTimer = null;
    }
    this.lastRecognizedText = '';
    this.setState('idle');
  }

  /**
   * Inject text directly (keyboard fallback, tests, or external STT injection).
   */
  simulateSpokenText(text: string) {
    this.lastRecognizedText = text;
    this.listeners.forEach((l) => {
      l.onPartialResult?.(text);
      l.onFinalResult?.(text);
    });
    this.setState('idle');
  }

  subscribe(listener: SpeechServiceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async destroy(): Promise<void> {
    await this.cancelListening();
    this.listeners.clear();
  }

  getState(): SpeechRecognitionState {
    return this.currentState;
  }

  private _getSimulatedResponse(): string {
    const idx = Math.floor(Math.random() * SIMULATED_RESPONSES.length);
    return SIMULATED_RESPONSES[idx];
  }
}

export const speechService = new SpeechRecognitionService();
