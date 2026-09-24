import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { ShadowingExerciseItem } from '../../constants/workouts';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CircularProgress } from '../common/CircularProgress';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { calculateTextSimilarity } from '../../utils/scoring';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface ShadowingExerciseProps {
  item: ShadowingExerciseItem;
  exerciseNumber: number;
  totalExercises: number;
  onNext: (score: number, spokenText: string) => void;
}

export const ShadowingExercise: React.FC<ShadowingExerciseProps> = ({
  item,
  exerciseNumber,
  totalExercises,
  onNext,
}) => {
  const { colors } = useTheme();
  const { speak, isSpeaking: isAiSpeaking } = useTextToSpeech();
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [hasListened, setHasListened] = useState(false);

  const {
    isListening,
    startListening,
    stopListening,
    transcript: liveTranscript,
  } = useSpeechRecognition({
    onFinalResult: (text) => {
      setSpokenTranscript(text);
      const score = calculateTextSimilarity(item.sentence, text);
      setSimilarityScore(score);
    },
  });

  const handlePlayTarget = async () => {
    setHasListened(true);
    await speak(item.sentence);
  };

  const handleToggleMic = async () => {
    if (isListening) {
      const text = await stopListening();
      if (text) {
        setSpokenTranscript(text);
        const score = calculateTextSimilarity(item.sentence, text);
        setSimilarityScore(score);
      }
    } else {
      setSimilarityScore(null);
      setSpokenTranscript('');
      await startListening();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <Badge label={`Shadowing ${exerciseNumber}/${totalExercises}`} variant="accent" />
        <Text style={[styles.focusLabel, { color: colors.textSecondary }]}>{item.focusArea}</Text>
      </View>

      {/* Target Sentence Card */}
      <Card variant="elevated" padding="large" style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primaryLight }]}>TARGET SENTENCE:</Text>
          <TouchableOpacity
            onPress={handlePlayTarget}
            disabled={isAiSpeaking}
            style={[styles.audioBtn, { backgroundColor: colors.primaryGlow }]}
            accessibilityRole="button"
            accessibilityLabel="Listen to target audio"
          >
            <Ionicons
              name={isAiSpeaking ? 'volume-high' : 'volume-medium-outline'}
              size={20}
              color={colors.primaryLight}
            />
            <Text style={[styles.audioBtnText, { color: colors.primaryLight }]}>
              {isAiSpeaking ? 'Playing...' : 'Listen'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sentence, { color: colors.text }]}>"{item.sentence}"</Text>

        <View style={[styles.tipsBox, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={16} color={colors.accentLight} />
          <Text style={[styles.tipsText, { color: colors.textSecondary }]}>{item.tips}</Text>
        </View>
      </Card>

      {/* Spoken Response Result */}
      {similarityScore !== null ? (
        <Card variant="secondary" padding="medium" style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <CircularProgress
              size={70}
              strokeWidth={7}
              progress={similarityScore}
              centerText={`${similarityScore}%`}
            />
            <View style={styles.scoreTextGroup}>
              <Text style={[styles.scoreStatus, { color: similarityScore >= 75 ? colors.success : colors.warning }]}>
                {similarityScore >= 75 ? 'Excellent Alignment!' : 'Keep practicing cadence'}
              </Text>
              <Text style={[styles.yourSpokenText, { color: colors.textSecondary }]}>
                You said: "{spokenTranscript || '...'}"
              </Text>
            </View>
          </View>
        </Card>
      ) : liveTranscript ? (
        <Card variant="secondary" padding="medium" style={styles.liveCard}>
          <Text style={[styles.liveLabel, { color: colors.accentLight }]}>Hearing you:</Text>
          <Text style={[styles.liveText, { color: colors.text }]}>{liveTranscript}</Text>
        </Card>
      ) : null}

      {/* Controls */}
      <View style={styles.controls}>
        <Button
          title={isListening ? 'Stop Repeating' : 'Repeat Sentence Aloud'}
          variant={isListening ? 'danger' : 'primary'}
          onPress={handleToggleMic}
          leftIcon={<Ionicons name={isListening ? 'stop' : 'mic'} size={20} color="#FFFFFF" />}
          style={styles.micBtn}
        />

        {similarityScore !== null && (
          <Button
            title={exerciseNumber === totalExercises ? 'Continue to Rapid-Fire' : 'Next Shadowing Sentence'}
            variant="secondary"
            onPress={() => onNext(similarityScore, spokenTranscript)}
            rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.text} />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  focusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  audioBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sentence: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  tipsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  tipsText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  scoreCard: {
    marginVertical: Spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  scoreTextGroup: {
    flex: 1,
    gap: 2,
  },
  scoreStatus: {
    fontSize: 14,
    fontWeight: '700',
  },
  yourSpokenText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  liveCard: {
    marginVertical: Spacing.sm,
  },
  liveLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  liveText: {
    fontSize: 13,
  },
  controls: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  micBtn: {
    width: '100%',
  },
});
