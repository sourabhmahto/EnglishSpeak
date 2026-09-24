import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { Header } from '../../components/common/Header';
import { LevelSelector } from '../../components/common/LevelSelector';
import { PrepTimerView } from '../../components/simulator/PrepTimerView';
import { SpeakingTimerView } from '../../components/simulator/SpeakingTimerView';
import { SimulatorResultModal } from '../../components/simulator/SimulatorResultModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SIMULATOR_TOPICS, SimulatorTopic } from '../../constants/topics';
import { APP_CONFIG } from '../../constants/config';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { scoringService } from '../../services/scoring/scoringService';
import { geminiService } from '../../services/gemini/geminiService';
import { SpeakingSession } from '../../types/session';
import { getWordCount } from '../../utils/formatting';
import { calculateWpm } from '../../utils/scoring';
import { BorderRadius, Spacing } from '../../constants/theme';

type SimulatorState = 'TOPIC_SELECTION' | 'PREPARING' | 'SPEAKING' | 'ANALYZING' | 'COMPLETED';

export default function SimulatorScreen() {
  const { colors } = useTheme();
  const selectedLevel = useAppStore((s) => s.selectedLevel);
  const currentProfileId = useAppStore((s) => s.currentProfileId);
  const saveSession = useAppStore((s) => s.saveSession);

  // Filter topics for selected level
  const topics = SIMULATOR_TOPICS.filter((t) => t.level === selectedLevel);
  const [selectedTopic, setSelectedTopic] = useState<SimulatorTopic>(topics[0] || SIMULATOR_TOPICS[0]);

  const [simulatorState, setSimulatorState] = useState<SimulatorState>('TOPIC_SELECTION');
  const [prepSeconds, setPrepSeconds] = useState<number>(APP_CONFIG.SIMULATOR_PREP_SECONDS);
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(APP_CONFIG.SIMULATOR_SPEAK_SECONDS);

  // Speech timing & pauses
  const [spokenText, setSpokenText] = useState('');
  const [pauseCount, setPauseCount] = useState(0);
  const [pauseSeconds, setPauseSeconds] = useState(0);
  const [isPauseDetected, setIsPauseDetected] = useState(false);
  const lastSpeechTimestampRef = useRef<number>(Date.now());
  const speechStartTimeRef = useRef<number>(Date.now());

  const [completedSession, setCompletedSession] = useState<SpeakingSession | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const {
    isListening,
    startListening,
    stopListening,
    transcript: liveTranscript,
  } = useSpeechRecognition({
    onPartialResult: () => {
      lastSpeechTimestampRef.current = Date.now();
      setIsPauseDetected(false);
    },
    onFinalResult: (text) => {
      setSpokenText(text);
      lastSpeechTimestampRef.current = Date.now();
    },
  });

  // Keep topic synced when level changes if needed
  useEffect(() => {
    const matching = SIMULATOR_TOPICS.filter((t) => t.level === selectedLevel);
    if (matching.length > 0) {
      setSelectedTopic(matching[0]);
    }
  }, [selectedLevel]);

  // Prep countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (simulatorState === 'PREPARING') {
      timer = setInterval(() => {
        setPrepSeconds((prev) => {
          if (prev <= 1) {
            handleStartSpeaking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [simulatorState]);

  // Speaking countdown & pause detector
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (simulatorState === 'SPEAKING') {
      timer = setInterval(() => {
        // Track pause if no speech event in past 3 seconds
        const silenceDuration = (Date.now() - lastSpeechTimestampRef.current) / 1000;
        if (silenceDuration > 3) {
          setIsPauseDetected(true);
          setPauseSeconds((prev) => prev + 1);
        } else {
          setIsPauseDetected(false);
        }

        setSpeakingSeconds((prev) => {
          if (prev <= 1) {
            handleFinishSpeaking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [simulatorState]);

  const handleStartPrep = () => {
    setPrepSeconds(APP_CONFIG.SIMULATOR_PREP_SECONDS);
    setSpeakingSeconds(APP_CONFIG.SIMULATOR_SPEAK_SECONDS);
    setSpokenText('');
    setPauseCount(0);
    setPauseSeconds(0);
    setSimulatorState('PREPARING');
  };

  const handleStartSpeaking = async () => {
    setSimulatorState('SPEAKING');
    speechStartTimeRef.current = Date.now();
    lastSpeechTimestampRef.current = Date.now();
    await startListening();
  };

  const handleFinishSpeaking = async () => {
    setSimulatorState('ANALYZING');
    const finalSpeech = await stopListening();
    const duration = Math.max(APP_CONFIG.SIMULATOR_SPEAK_SECONDS - speakingSeconds, 5);
    const fullTranscript = finalSpeech || liveTranscript || spokenText;

    // Calculate score metrics
    const metrics = scoringService.evaluateSession({
      transcript: fullTranscript,
      durationSeconds: duration,
      pauseSeconds,
      pauseCount,
      level: selectedLevel,
    });

    // Request Gemini structured feedback analysis
    let aiFeedback = null;
    try {
      aiFeedback = await geminiService.generateSessionFeedback({
        level: selectedLevel,
        type: 'Impromptu Speaking Simulator',
        topicOrScenario: selectedTopic.title,
        fullTranscript: [{ sender: 'user', text: fullTranscript }],
        measuredMetrics: {
          wpm: metrics.wpm,
          fillerCount: metrics.fillerCount,
          fillerRate: metrics.fillerRate,
          durationSeconds: metrics.durationSeconds,
        },
      });
    } catch (e) {
      console.warn('[Simulator] Feedback error:', e);
    }

    const sessionRecord: SpeakingSession = {
      id: `sim_${Date.now()}`,
      profileId: currentProfileId,
      date: new Date().toISOString(),
      type: 'simulator',
      level: selectedLevel,
      topicTitle: selectedTopic.title,
      durationSeconds: metrics.durationSeconds,
      wordCount: metrics.wordCount,
      wpm: metrics.wpm,
      fillerCount: metrics.fillerCount,
      fillerRate: metrics.fillerRate,
      pauseSeconds: metrics.pauseSeconds,
      grammarScore: aiFeedback?.confidenceScore || metrics.grammarScore,
      confidenceScore: metrics.confidenceScore,
      estimatedIeltsScore: aiFeedback?.ieltsScore || metrics.estimatedIeltsScore,
      transcript: [{ id: `usr_${Date.now()}`, sender: 'user', text: fullTranscript, timestamp: new Date().toISOString() }],
      rewrites: aiFeedback?.sentenceRewrites || [],
      strengths: aiFeedback?.strengthsSummary || ['Maintained clear communicative pace.'],
      improvements: aiFeedback?.improvementSuggestions || ['Incorporate more descriptive transition connectors.'],
    };

    await saveSession(sessionRecord);
    setCompletedSession(sessionRecord);
    setSimulatorState('COMPLETED');
    setShowResultModal(true);
  };

  const currentWords = getWordCount(spokenText || liveTranscript);
  const elapsed = APP_CONFIG.SIMULATOR_SPEAK_SECONDS - speakingSeconds;
  const liveWpm = calculateWpm(currentWords, Math.max(elapsed, 1));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Fluency Simulator" />

      {simulatorState === 'TOPIC_SELECTION' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.topInfo}>
            <Text style={[styles.heading, { color: colors.text }]}>60-Second Impromptu Challenge</Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              Pick a topic, get 15 seconds to organize your thoughts, and speak for 60 seconds. We'll measure your WPM, fillers, and estimated IELTS practice score.
            </Text>
          </View>

          <LevelSelector compact />

          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CHOOSE A TOPIC:</Text>

          <View style={styles.topicList}>
            {topics.map((t) => {
              const isSelected = selectedTopic.id === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setSelectedTopic(t)}
                  activeOpacity={0.8}
                  style={[
                    styles.topicCard,
                    {
                      backgroundColor: isSelected ? colors.card : colors.cardSecondary,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Topic: ${t.title}`}
                >
                  <View style={styles.topicHeader}>
                    <Text style={[styles.topicName, { color: colors.text }]}>{t.title}</Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={18} color={colors.primaryLight} />}
                  </View>
                  <Text style={[styles.topicPrompt, { color: colors.textSecondary }]} numberOfLines={2}>
                    {t.prompt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            title="Start 15s Preparation"
            variant="primary"
            size="large"
            onPress={handleStartPrep}
            style={styles.startBtn}
            rightIcon={<Ionicons name="timer-outline" size={20} color="#FFFFFF" />}
          />
        </ScrollView>
      )}

      {simulatorState === 'PREPARING' && (
        <PrepTimerView
          topic={selectedTopic}
          secondsRemaining={prepSeconds}
          onSkipPrep={handleStartSpeaking}
        />
      )}

      {simulatorState === 'SPEAKING' && (
        <SpeakingTimerView
          topic={selectedTopic}
          secondsRemaining={speakingSeconds}
          spokenText={spokenText || liveTranscript}
          wordCount={currentWords}
          liveWpm={liveWpm}
          isPausedDetected={isPauseDetected}
          onFinishSpeaking={handleFinishSpeaking}
        />
      )}

      {simulatorState === 'ANALYZING' && (
        <View style={styles.analyzingContainer}>
          <Text style={[styles.analyzingTitle, { color: colors.text }]}>Analyzing Your Speaking...</Text>
          <Text style={[styles.analyzingSubtitle, { color: colors.textSecondary }]}>
            Evaluating WPM, hesitation pauses, fillers, and grammar structure.
          </Text>
        </View>
      )}

      {/* Result Modal */}
      <SimulatorResultModal
        visible={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setSimulatorState('TOPIC_SELECTION');
        }}
        session={completedSession}
        onTryAgain={() => {
          setShowResultModal(false);
          handleStartPrep();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  topInfo: {
    gap: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
  },
  sub: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  topicList: {
    gap: Spacing.sm,
  },
  topicCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicName: {
    fontSize: 16,
    fontWeight: '700',
  },
  topicPrompt: {
    fontSize: 13,
    lineHeight: 18,
  },
  startBtn: {
    marginTop: Spacing.md,
    width: '100%',
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  analyzingTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  analyzingSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
