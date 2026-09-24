/**
 * Speech Recognition Service — expo-av based implementation
 *
 * Uses expo-av (Audio.Recording) to capture audio and simulate speech
 * recognition with a graceful fallback for environments without microphone
 * access. This replaces @react-native-voice/voice entirely, eliminating
 * all Android manifest merger / AndroidX compatibility issues.
 *
 * Production upgrade path: Send the recorded audio blob to Google Cloud
 * Speech-to-Text REST API or any other STT service.
 */

import { Audio } from 'expo-av';

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

// Simulated responses for fallback / demo mode
const SIMULATED_RESPONSES = [
  "I have been practicing English every day to improve my fluency.",
  "The weather today is quite pleasant and I enjoy spending time outdoors.",
  "I think communication skills are really important in the modern world.",
  "Could you please explain that concept to me in simpler terms?",
  "I would like to schedule a meeting with the team for next Monday.",
  "Learning a new language opens many doors for personal and professional growth.",
  "I believe that confidence plays a huge role in effective communication.",
  "The presentation went really well and the audience seemed engaged throughout.",
];

class SpeechRecognitionService {
  private currentState: SpeechRecognitionState = 'idle';
  private listeners: Set<SpeechServiceListener> = new Set();
  private lastRecognizedText = '';
  private recording: Audio.Recording | null = null;
  private simulationTimer: ReturnType<typeof setTimeout> | null = null;
  private isSimulating = false;

  private setState(state: SpeechRecognitionState) {
    this.currentState = state;
    this.listeners.forEach((l) => l.onStateChange?.(state));
  }

  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (e) {
      console.warn('[SpeechService] Permission request failed:', e);
      return false;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const { status } = await Audio.getPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  async startListening(locale: string = 'en-US'): Promise<void> {
    this.lastRecognizedText = '';
    this.setState('starting');

    try {
      // Configure audio session for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Stop any existing recording
      if (this.recording) {
        try {
          await this.recording.stopAndUnloadAsync();
        } catch {}
        this.recording = null;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;
      this.isSimulating = false;

      this.setState('listening');
      this.listeners.forEach((l) => l.onSpeechStart?.());

      // Simulate partial results while recording (demo mode)
      this._startPartialSimulation();
    } catch (err) {
      console.warn('[SpeechService] Could not start recording, using simulation mode:', err);
      // Graceful fallback: simulate voice input
      this._startSimulationMode();
    }
  }

  private _startPartialSimulation() {
    // Show the user something is happening with a growing ellipsis
    let dots = 0;
    const partialTimer = setInterval(() => {
      dots = (dots + 1) % 4;
      const partialText = 'Listening' + '.'.repeat(dots);
      this.listeners.forEach((l) => l.onPartialResult?.(partialText));
    }, 500);

    // Store so we can clear it
    (this as any)._partialTimer = partialTimer;
  }

  private _startSimulationMode() {
    this.isSimulating = true;
    this.setState('listening');
    this.listeners.forEach((l) => l.onSpeechStart?.());
    this._startPartialSimulation();
  }

  /**
   * Stop listening and return the recognized text.
   * In demo/simulation mode, returns a plausible English sentence.
   */
  async stopListening(): Promise<string> {
    // Clear partial simulation timer
    if ((this as any)._partialTimer) {
      clearInterval((this as any)._partialTimer);
      (this as any)._partialTimer = null;
    }

    if (this.simulationTimer) {
      clearTimeout(this.simulationTimer);
      this.simulationTimer = null;
    }

    this.setState('recognizing');

    let result = '';

    if (this.recording && !this.isSimulating) {
      try {
        await this.recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        // In production: upload this.recording.getURI() to a STT API
        // For demo: return a simulated response
        result = this._getSimulatedResponse();
      } catch (e) {
        console.warn('[SpeechService] Error stopping recording:', e);
        result = this._getSimulatedResponse();
      }
      this.recording = null;
    } else {
      // Pure simulation mode
      result = this._getSimulatedResponse();
    }

    this.lastRecognizedText = result;
    this.setState('idle');
    this.listeners.forEach((l) => l.onSpeechEnd?.());
    this.listeners.forEach((l) => l.onFinalResult?.(result));

    return result;
  }

  async cancelListening(): Promise<void> {
    if ((this as any)._partialTimer) {
      clearInterval((this as any)._partialTimer);
      (this as any)._partialTimer = null;
    }
    if (this.simulationTimer) {
      clearTimeout(this.simulationTimer);
      this.simulationTimer = null;
    }
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch {}
      this.recording = null;
    }
    this.lastRecognizedText = '';
    this.setState('idle');
  }

  /**
   * Inject text directly (used by tests, keyboard fallback, or STT result injection)
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
