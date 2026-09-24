import { useState, useCallback, useEffect } from 'react';
import { ttsService, TtsOptions } from '../services/tts/ttsService';
import { useAppStore } from '../store/appStore';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const selectedLevel = useAppStore((s) => s.selectedLevel);
  const settingsRate = useAppStore((s) => s.settings.speakingRate);

  const speak = useCallback(
    async (text: string, options: TtsOptions = {}) => {
      setIsSpeaking(true);
      await ttsService.speak(
        text,
        {
          ...options,
          rate: options.rate ?? settingsRate,
          onStart: () => {
            setIsSpeaking(true);
            options.onStart?.();
          },
          onDone: () => {
            setIsSpeaking(false);
            options.onDone?.();
          },
          onStopped: () => {
            setIsSpeaking(false);
            options.onStopped?.();
          },
          onError: (err) => {
            setIsSpeaking(false);
            options.onError?.(err);
          },
        },
        selectedLevel
      );
    },
    [selectedLevel, settingsRate]
  );

  const stop = useCallback(async () => {
    await ttsService.stop();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
  };
}
