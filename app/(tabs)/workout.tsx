import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { Header } from '../../components/common/Header';
import { LevelSelector } from '../../components/common/LevelSelector';
import { ShadowingExercise } from '../../components/workout/ShadowingExercise';
import { RapidFireExercise } from '../../components/workout/RapidFireExercise';
import { IdiomExercise } from '../../components/workout/IdiomExercise';
import { WorkoutSummaryModal } from '../../components/workout/WorkoutSummaryModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { DAILY_WORKOUTS } from '../../constants/workouts';
import { SpeakingSession } from '../../types/session';
import { calculateEstimatedIelts } from '../../utils/scoring';
import { BorderRadius, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type WorkoutStep = 'INTRO' | 'SHADOWING' | 'RAPID_FIRE' | 'IDIOM' | 'COMPLETED';

export default function WorkoutScreen() {
  const { colors } = useTheme();
  const selectedLevel = useAppStore((s) => s.selectedLevel);
  const currentProfileId = useAppStore((s) => s.currentProfileId);
  const saveSession = useAppStore((s) => s.saveSession);

  const workoutData = DAILY_WORKOUTS[selectedLevel];

  const [step, setStep] = useState<WorkoutStep>('INTRO');
  const [shadowingIndex, setShadowingIndex] = useState(0);
  const [rapidFireIndex, setRapidFireIndex] = useState(0);

  // Scores accumulation
  const [shadowingScores, setShadowingScores] = useState<number[]>([]);
  const [rapidFireWpms, setRapidFireWpms] = useState<number[]>([]);
  const [allTranscripts, setAllTranscripts] = useState<string[]>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<number>(Date.now());

  const [summaryData, setSummaryData] = useState<{
    durationSeconds: number;
    shadowingScore: number;
    rapidFireWpm: number;
    idiomCompleted: boolean;
    estimatedIelts: number;
  } | null>(null);

  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Calculate overall workout progress
  const getOverallProgress = () => {
    switch (step) {
      case 'INTRO':
        return 0;
      case 'SHADOWING':
        return 0.1 + (shadowingIndex / workoutData.shadowing.length) * 0.3;
      case 'RAPID_FIRE':
        return 0.4 + (rapidFireIndex / workoutData.rapidFire.length) * 0.3;
      case 'IDIOM':
        return 0.85;
      case 'COMPLETED':
        return 1.0;
    }
  };

  const handleStartWorkout = () => {
    setWorkoutStartTime(Date.now());
    setShadowingIndex(0);
    setRapidFireIndex(0);
    setShadowingScores([]);
    setRapidFireWpms([]);
    setAllTranscripts([]);
    setStep('SHADOWING');
  };

  const handleNextShadowing = (score: number, spokenText: string) => {
    setShadowingScores((prev) => [...prev, score]);
    if (spokenText) setAllTranscripts((prev) => [...prev, spokenText]);

    if (shadowingIndex < workoutData.shadowing.length - 1) {
      setShadowingIndex((prev) => prev + 1);
    } else {
      setStep('RAPID_FIRE');
    }
  };

  const handleNextRapidFire = (metrics: { spokenText: string; wpm: number; fillerCount: number; duration: number }) => {
    setRapidFireWpms((prev) => [...prev, metrics.wpm]);
    if (metrics.spokenText) setAllTranscripts((prev) => [...prev, metrics.spokenText]);

    if (rapidFireIndex < workoutData.rapidFire.length - 1) {
      setRapidFireIndex((prev) => prev + 1);
    } else {
      setStep('IDIOM');
    }
  };

  const handleFinishIdiom = async (spokenSentence: string) => {
    if (spokenSentence) setAllTranscripts((prev) => [...prev, spokenSentence]);

    const durationSeconds = Math.max(Math.round((Date.now() - workoutStartTime) / 1000), 60);

    const avgShadowing = shadowingScores.length > 0
      ? Math.round(shadowingScores.reduce((a, b) => a + b, 0) / shadowingScores.length)
      : 80;

    const avgWpm = rapidFireWpms.length > 0
      ? Math.round(rapidFireWpms.reduce((a, b) => a + b, 0) / rapidFireWpms.length)
      : 125;

    const estimatedIelts = calculateEstimatedIelts({
      wpm: avgWpm,
      fillerRate: 3.0,
      grammarScore: avgShadowing,
      confidenceScore: 85,
      level: selectedLevel,
    });

    const summary = {
      durationSeconds,
      shadowingScore: avgShadowing,
      rapidFireWpm: avgWpm,
      idiomCompleted: true,
      estimatedIelts,
    };

    const sessionRecord: SpeakingSession = {
      id: `workout_${Date.now()}`,
      profileId: currentProfileId,
      date: new Date().toISOString(),
      type: 'workout',
      level: selectedLevel,
      topicTitle: workoutData.title,
      durationSeconds,
      wordCount: allTranscripts.join(' ').split(/\s+/).length,
      wpm: avgWpm,
      fillerCount: 2,
      fillerRate: 2.5,
      pauseSeconds: 5,
      grammarScore: avgShadowing,
      confidenceScore: 85,
      estimatedIeltsScore: estimatedIelts,
      transcript: allTranscripts.map((t, idx) => ({
        id: `w_item_${idx}`,
        sender: 'user',
        text: t,
        timestamp: new Date().toISOString(),
      })),
      strengths: ['Completed daily 10-minute micro-workout circuit with high engagement.'],
      improvements: ['Focus on connected speech linking during shadowing repetitions.'],
    };

    await saveSession(sessionRecord);

    setSummaryData(summary);
    setStep('COMPLETED');
    setShowSummaryModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Daily Workout" />

      {/* Progress Bar for Active Workout */}
      {step !== 'INTRO' && (
        <View style={[styles.progressHeader, { backgroundColor: colors.cardSecondary }]}>
          <ProgressBar progress={getOverallProgress()} color={colors.primaryLight} height={4} />
        </View>
      )}

      {step === 'INTRO' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.topInfo}>
            <Text style={[styles.heading, { color: colors.text }]}>{workoutData.title}</Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              A structured 10-minute micro-circuit designed to build muscle memory, rapid response reflex, and idiomatic precision.
            </Text>
          </View>

          <LevelSelector compact />

          {/* Circuit Steps Preview */}
          <Card variant="elevated" padding="large" style={styles.circuitCard}>
            <Text style={[styles.cardTitle, { color: colors.primaryLight }]}>TODAY'S 3-PART CIRCUIT:</Text>

            <View style={styles.circuitStep}>
              <View style={[styles.stepNumberCircle, { backgroundColor: colors.accentLight }]}>
                <Text style={styles.stepNumText}>1</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepName, { color: colors.text }]}>Shadowing & Articulation (3 min)</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                  Listen to native rhythm and repeat aloud to train speech cadence.
                </Text>
              </View>
            </View>

            <View style={styles.circuitStep}>
              <View style={[styles.stepNumberCircle, { backgroundColor: colors.warning }]}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepName, { color: colors.text }]}>Rapid-Fire Q&A (3 min)</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                  Answer prompt questions under time pressure to eradicate hesitations.
                </Text>
              </View>
            </View>

            <View style={styles.circuitStep}>
              <View style={[styles.stepNumberCircle, { backgroundColor: colors.success }]}>
                <Text style={styles.stepNumText}>3</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepName, { color: colors.text }]}>Idiom of the Day (2 min)</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                  Master "{workoutData.idiom.idiom}" and deliver your own sentence.
                </Text>
              </View>
            </View>
          </Card>

          <Button
            title="Begin 10-Min Workout"
            variant="primary"
            size="large"
            onPress={handleStartWorkout}
            style={styles.startBtn}
            rightIcon={<Ionicons name="play" size={20} color="#FFFFFF" />}
          />
        </ScrollView>
      )}

      {step === 'SHADOWING' && (
        <ShadowingExercise
          item={workoutData.shadowing[shadowingIndex]}
          exerciseNumber={shadowingIndex + 1}
          totalExercises={workoutData.shadowing.length}
          onNext={handleNextShadowing}
        />
      )}

      {step === 'RAPID_FIRE' && (
        <RapidFireExercise
          item={workoutData.rapidFire[rapidFireIndex]}
          questionNumber={rapidFireIndex + 1}
          totalQuestions={workoutData.rapidFire.length}
          onNext={handleNextRapidFire}
        />
      )}

      {step === 'IDIOM' && (
        <IdiomExercise
          item={workoutData.idiom}
          onFinish={handleFinishIdiom}
        />
      )}

      {/* Summary Modal */}
      <WorkoutSummaryModal
        visible={showSummaryModal}
        onClose={() => {
          setShowSummaryModal(false);
          setStep('INTRO');
        }}
        summary={summaryData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressHeader: {
    width: '100%',
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
  circuitCard: {
    gap: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  circuitStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  stepNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  stepInfo: {
    flex: 1,
    gap: 2,
  },
  stepName: {
    fontSize: 15,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  startBtn: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
