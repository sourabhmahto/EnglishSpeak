import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { geminiService } from '../services/gemini/geminiService';
import { scoringService } from '../services/scoring/scoringService';
import { TranscriptItem, SpeakingSession, SessionType, VoiceOrbState } from '../types/session';
import { SentenceRewrite, ValidatedGeminiSpeakingResponse } from '../types/ai';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useTextToSpeech } from './useTextToSpeech';
import { detectFillers } from '../utils/fillers';
import { PERSONAS } from '../constants/personas';
import { getWordCount } from '../utils/formatting';

interface UseSessionOptions {
  type: SessionType;
  scenarioId?: string;
  scenarioTitle?: string;
  scenarioObjective?: string;
  initialGreeting?: string;
}

export function useSession(options: UseSessionOptions) {
  const { type, scenarioId, scenarioTitle, scenarioObjective, initialGreeting } = options;

  const currentProfileId = useAppStore((s) => s.currentProfileId);
  const selectedLevel = useAppStore((s) => s.selectedLevel);
  const selectedPersona = useAppStore((s) => s.selectedPersona);
  const autoPlayAiVoice = useAppStore((s) => s.settings.autoPlayAiVoice);
  const saveSessionToStore = useAppStore((s) => s.saveSession);

  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [currentRewrites, setCurrentRewrites] = useState<SentenceRewrite[]>([]);
  const [lastHint, setLastHint] = useState<ValidatedGeminiSpeakingResponse['hint'] | null>(null);
  const [lastAiResponse, setLastAiResponse] = useState<ValidatedGeminiSpeakingResponse | null>(null);
  const [voiceOrbState, setVoiceOrbState] = useState<VoiceOrbState>('IDLE');
  const [completedSession, setCompletedSession] = useState<SpeakingSession | null>(null);

  const { speak, stop: stopTts, isSpeaking: isAiSpeaking } = useTextToSpeech();

  const handleFinalSpeechResult = useCallback(
    async (spokenText: string) => {
      if (!spokenText || spokenText.trim().length === 0) {
        setVoiceOrbState('IDLE');
        return;
      }

      // Add user transcript entry
      const userItem: TranscriptItem = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: spokenText.trim(),
        timestamp: new Date().toISOString(),
      };

      setTranscript((prev) => [...prev, userItem]);
      setVoiceOrbState('THINKING');
      setIsAiThinking(true);

      try {
        // Prepare context for Gemini
        const historyTurns = transcript.map((t) => ({
          role: t.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: t.text,
          timestamp: t.timestamp,
        }));

        const aiResponse = await geminiService.generateSpeakingTurn({
          level: selectedLevel,
          persona: selectedPersona,
          conversationHistory: historyTurns,
          userTranscript: spokenText,
          scenarioTitle,
          scenarioObjective,
        });

        setLastAiResponse(aiResponse);
        if (aiResponse.hint) {
          setLastHint(aiResponse.hint);
        }
        if (aiResponse.sentenceRewrites && aiResponse.sentenceRewrites.length > 0) {
          setCurrentRewrites((prev) => [...prev, ...aiResponse.sentenceRewrites]);
        }

        // Add AI response to transcript
        const aiItem: TranscriptItem = {
          id: `sarah_${Date.now()}`,
          sender: 'sarah',
          text: aiResponse.spokenReply,
          timestamp: new Date().toISOString(),
          detectedFillers: aiResponse.detectedFillers,
          rewrites: aiResponse.sentenceRewrites,
        };

        setTranscript((prev) => [...prev, aiItem]);
        setIsAiThinking(false);

        // Speak aloud
        if (autoPlayAiVoice) {
          setVoiceOrbState('AI_SPEAKING');
          await speak(aiResponse.spokenReply, {
            onStart: () => setVoiceOrbState('AI_SPEAKING'),
            onDone: () => setVoiceOrbState('IDLE'),
            onStopped: () => setVoiceOrbState('IDLE'),
            onError: () => setVoiceOrbState('IDLE'),
          });
        } else {
          setVoiceOrbState('IDLE');
        }
      } catch (error) {
        console.error('[useSession] AI turn error:', error);
        setIsAiThinking(false);
        setVoiceOrbState('IDLE');
      }
    },
    [transcript, selectedLevel, selectedPersona, scenarioTitle, scenarioObjective, autoPlayAiVoice, speak]
  );

  const {
    isListening,
    transcript: liveSpeechTranscript,
    startListening,
    stopListening,
    cancelListening,
    simulateSpeech,
  } = useSpeechRecognition({
    onPartialResult: () => {
      setVoiceOrbState('USER_SPEAKING');
    },
    onFinalResult: handleFinalSpeechResult,
  });

  // Start Session
  const startSession = useCallback(async () => {
    setIsActive(true);
    const start = Date.now();
    setSessionStartTime(start);
    setTranscript([]);
    setCurrentRewrites([]);
    setCompletedSession(null);

    // Initial AI greeting
    const persona = PERSONAS[selectedPersona];
    let greeting = initialGreeting || `Hi! I'm ${persona.name.split(' ')[0]}. Let's practice speaking English together. What's on your mind today?`;

    if (selectedLevel === 'beginner' && !initialGreeting) {
      greeting = "Hello! I'm Sarah. I am excited to talk with you. How are you doing today?";
    } else if (selectedLevel === 'advanced' && !initialGreeting) {
      greeting = "Greetings. I'm looking forward to our discussion. What topic shall we explore today?";
    }

    const greetingItem: TranscriptItem = {
      id: `sarah_${start}`,
      sender: 'sarah',
      text: greeting,
      timestamp: new Date(start).toISOString(),
    };

    setTranscript([greetingItem]);

    if (autoPlayAiVoice) {
      setVoiceOrbState('AI_SPEAKING');
      await speak(greeting, {
        onStart: () => setVoiceOrbState('AI_SPEAKING'),
        onDone: () => setVoiceOrbState('IDLE'),
        onStopped: () => setVoiceOrbState('IDLE'),
        onError: () => setVoiceOrbState('IDLE'),
      });
    } else {
      setVoiceOrbState('IDLE');
    }
  }, [selectedPersona, selectedLevel, initialGreeting, autoPlayAiVoice, speak]);

  // Toggle user speaking (mic button)
  const toggleListening = useCallback(async () => {
    if (isAiSpeaking) {
      await stopTts();
    }

    if (isListening) {
      setVoiceOrbState('THINKING');
      await stopListening();
    } else {
      setVoiceOrbState('LISTENING');
      await startListening();
    }
  }, [isAiSpeaking, isListening, stopTts, stopListening, startListening]);

  // End Session & Save Metrics
  const endSession = useCallback(async (): Promise<SpeakingSession | null> => {
    if (isListening) {
      await stopListening();
    }
    await stopTts();

    const endTime = Date.now();
    const durationSeconds = sessionStartTime ? Math.max(Math.round((endTime - sessionStartTime) / 1000), 1) : 30;

    const userTurns = transcript.filter((t) => t.sender === 'user');
    const allUserText = userTurns.map((t) => t.text).join(' ');

    const metrics = scoringService.evaluateSession({
      transcript: allUserText,
      durationSeconds,
      level: selectedLevel,
      aiGrammarScore: lastAiResponse?.confidenceScore ? lastAiResponse.confidenceScore : undefined,
    });

    const sessionRecord: SpeakingSession = {
      id: `session_${Date.now()}`,
      profileId: currentProfileId,
      date: new Date().toISOString(),
      type,
      level: selectedLevel,
      persona: selectedPersona,
      scenarioId,
      topicTitle: scenarioTitle,
      durationSeconds: metrics.durationSeconds,
      wordCount: metrics.wordCount,
      wpm: metrics.wpm,
      fillerCount: metrics.fillerCount,
      fillerRate: metrics.fillerRate,
      pauseSeconds: metrics.pauseSeconds,
      grammarScore: metrics.grammarScore,
      confidenceScore: metrics.confidenceScore,
      estimatedIeltsScore: metrics.estimatedIeltsScore,
      transcript,
      rewrites: currentRewrites,
      strengths: lastAiResponse?.strengthsSummary || ['Demonstrated good conversational momentum.'],
      improvements: lastAiResponse?.improvementSuggestions || ['Continue expanding your descriptive vocabulary.'],
    };

    if (metrics.durationSeconds >= 5 || userTurns.length > 0) {
      await saveSessionToStore(sessionRecord);
    }

    setCompletedSession(sessionRecord);
    setIsActive(false);
    setVoiceOrbState('IDLE');

    return sessionRecord;
  }, [
    isListening,
    stopListening,
    stopTts,
    sessionStartTime,
    transcript,
    selectedLevel,
    selectedPersona,
    scenarioId,
    scenarioTitle,
    lastAiResponse,
    currentProfileId,
    type,
    currentRewrites,
    saveSessionToStore,
  ]);

  const replayLastAiMessage = useCallback(async () => {
    const aiMessages = transcript.filter((t) => t.sender === 'sarah');
    if (aiMessages.length === 0) return;
    const lastAiMsg = aiMessages[aiMessages.length - 1].text;
    setVoiceOrbState('AI_SPEAKING');
    await speak(lastAiMsg, {
      onStart: () => setVoiceOrbState('AI_SPEAKING'),
      onDone: () => setVoiceOrbState('IDLE'),
      onStopped: () => setVoiceOrbState('IDLE'),
      onError: () => setVoiceOrbState('IDLE'),
    });
  }, [transcript, speak]);

  const resetSession = useCallback(async () => {
    await stopTts();
    await cancelListening();
    setTranscript([]);
    setCurrentRewrites([]);
    setLastHint(null);
    setLastAiResponse(null);
    setCompletedSession(null);
    setIsActive(false);
    setVoiceOrbState('IDLE');
  }, [stopTts, cancelListening]);

  return {
    isActive,
    isListening,
    isAiThinking,
    isAiSpeaking,
    voiceOrbState,
    transcript,
    liveSpeechTranscript,
    currentRewrites,
    lastHint,
    lastAiResponse,
    completedSession,
    startSession,
    toggleListening,
    endSession,
    resetSession,
    replayLastAiMessage,
    simulateSpeech,
  };
}
