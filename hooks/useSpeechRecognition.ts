import { useState, useEffect, useCallback, useRef } from 'react';
import { speechService, SpeechRecognitionState } from '../services/speech/speechService';
import { Platform } from 'react-native';

interface UseSpeechRecognitionOptions {
  onPartialResult?: (text: string) => void;
  onFinalResult?: (text: string) => void;
  onError?: (error: string) => void;
  locale?: string;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const [state, setState] = useState<SpeechRecognitionState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    // Check permissions and subscribe to events
    let isMounted = true;

    const checkPerms = async () => {
      const allowed = await speechService.requestPermission();
      if (isMounted) setHasPermission(allowed);
    };
    checkPerms();

    const unsubscribe = speechService.subscribe({
      onStateChange: (newState) => {
        if (!isMounted) return;
        setState(newState);
        setIsListening(newState === 'listening' || newState === 'recognizing');
      },
      onPartialResult: (text) => {
        if (!isMounted) return;
        setTranscript(text);
        optionsRef.current.onPartialResult?.(text);
      },
      onFinalResult: (text) => {
        if (!isMounted) return;
        setTranscript(text);
        optionsRef.current.onFinalResult?.(text);
      },
      onError: (err) => {
        if (!isMounted) return;
        setError(err);
        optionsRef.current.onError?.(err);
      },
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const startListening = useCallback(async (locale: string = 'en-US') => {
    setError(null);
    setTranscript('');
    try {
      await speechService.startListening(locale);
    } catch (err: any) {
      const msg = err?.message || 'Failed to start speech recognition';
      setError(msg);
      optionsRef.current.onError?.(msg);
    }
  }, []);

  const stopListening = useCallback(async (): Promise<string> => {
    try {
      const finalResult = await speechService.stopListening();
      return finalResult;
    } catch (err: any) {
      console.warn('[useSpeechRecognition] stop error:', err);
      return transcript;
    }
  }, [transcript]);

  const cancelListening = useCallback(async () => {
    await speechService.cancelListening();
    setTranscript('');
  }, []);

  const simulateSpeech = useCallback((text: string) => {
    speechService.simulateSpokenText(text);
  }, []);

  return {
    state,
    transcript,
    isListening,
    error,
    hasPermission,
    startListening,
    stopListening,
    cancelListening,
    simulateSpeech,
  };
}
