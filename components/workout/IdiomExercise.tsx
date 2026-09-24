import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { IdiomOfTheDayItem } from '../../constants/workouts';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface IdiomExerciseProps {
  item: IdiomOfTheDayItem;
  onFinish: (spokenSentence: string) => void;
}

export const IdiomExercise: React.FC<IdiomExerciseProps> = ({ item, onFinish }) => {
  const { colors } = useTheme();
  const { speak, isSpeaking: isAiSpeaking } = useTextToSpeech();
  const [spokenSentence, setSpokenSentence] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    isListening,
    startListening,
    stopListening,
    transcript: liveTranscript,
  } = useSpeechRecognition({
    onFinalResult: (text) => {
      setSpokenSentence(text);
      setIsCompleted(true);
    },
  });

  const handleHearExample = async () => {
    await speak(`${item.idiom}. ${item.meaning}. For example: ${item.exampleSentence}`);
  };

  const handleToggleMic = async () => {
    if (isListening) {
      const text = await stopListening();
      if (text) {
        setSpokenSentence(text);
        setIsCompleted(true);
      }
    } else {
      setSpokenSentence('');
      setIsCompleted(false);
      await startListening();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <Badge label="Idiom of the Day" variant="success" />
        <Button
          title={isAiSpeaking ? 'Playing...' : 'Audio Example'}
          size="small"
          variant="secondary"
          onPress={handleHearExample}
          leftIcon={<Ionicons name="volume-medium" size={16} color={colors.primaryLight} />}
        />
      </View>

      {/* Idiom Card */}
      <Card variant="elevated" padding="large" style={styles.card}>
        <Text style={[styles.idiomTitle, { color: colors.text }]}>"{item.idiom}"</Text>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.success }]}>MEANING:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.meaning}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.primaryLight }]}>EXAMPLE:</Text>
          <Text style={[styles.exampleValue, { color: colors.textSecondary }]}>"{item.exampleSentence}"</Text>
        </View>

        <View style={[styles.challengeBox, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
          <Ionicons name="sparkles" size={16} color={colors.accentLight} />
          <View style={styles.challengeTextGroup}>
            <Text style={[styles.challengeHeading, { color: colors.accentLight }]}>SPEAKING CHALLENGE:</Text>
            <Text style={[styles.challengeText, { color: colors.text }]}>{item.speakingChallenge}</Text>
          </View>
        </View>
      </Card>

      {/* User Speaking Response */}
      <Card variant="secondary" padding="medium" style={styles.responseCard}>
        <Text style={[styles.responseLabel, { color: colors.textMuted }]}>YOUR CREATIVE SENTENCE:</Text>
        <Text style={[styles.responseText, { color: colors.text }]}>
          {spokenSentence || liveTranscript || (isListening ? 'Speak your custom sentence now...' : 'Tap the microphone button to record')}
        </Text>
      </Card>

      {/* Action Controls */}
      <View style={styles.controls}>
        <Button
          title={isListening ? 'Done Speaking' : 'Speak Your Sentence'}
          variant={isListening ? 'danger' : 'primary'}
          onPress={handleToggleMic}
          leftIcon={<Ionicons name={isListening ? 'stop' : 'mic'} size={20} color="#FFFFFF" />}
          style={styles.actionBtn}
        />

        {isCompleted && (
          <Button
            title="Complete Daily Workout"
            variant="success"
            onPress={() => onFinish(spokenSentence || liveTranscript)}
            rightIcon={<Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />}
            style={styles.actionBtn}
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
  card: {
    gap: Spacing.md,
  },
  idiomTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  infoRow: {
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  exampleValue: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  challengeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  challengeTextGroup: {
    flex: 1,
    gap: 2,
  },
  challengeHeading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  challengeText: {
    fontSize: 13,
    lineHeight: 18,
  },
  responseCard: {
    marginVertical: Spacing.sm,
    minHeight: 80,
  },
  responseLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
  controls: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    width: '100%',
  },
});
