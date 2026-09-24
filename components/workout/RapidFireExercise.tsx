import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { RapidFireQuestionItem } from '../../constants/workouts';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Timer } from '../common/Timer';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { getWordCount } from '../../utils/formatting';
import { countFillers } from '../../utils/fillers';
import { calculateWpm } from '../../utils/scoring';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface RapidFireExerciseProps {
  item: RapidFireQuestionItem;
  questionNumber: number;
  totalQuestions: number;
  onNext: (metrics: { spokenText: string; wpm: number; fillerCount: number; duration: number }) => void;
}

export const RapidFireExercise: React.FC<RapidFireExerciseProps> = ({
  item,
  questionNumber,
  totalQuestions,
  onNext,
}) => {
  const { colors } = useTheme();
  const [secondsRemaining, setSecondsRemaining] = useState(item.timeLimitSeconds);
  const [spokenText, setSpokenText] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const {
    isListening,
    startListening,
    stopListening,
    transcript: liveTranscript,
  } = useSpeechRecognition({
    onFinalResult: (text) => {
      setSpokenText(text);
    },
  });

  // Countdown timer when listening
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isListening && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening, secondsRemaining]);

  const handleStart = async () => {
    setSpokenText('');
    setIsAnswered(false);
    setSecondsRemaining(item.timeLimitSeconds);
    setStartTime(Date.now());
    await startListening();
  };

  const handleStop = async () => {
    const text = await stopListening();
    if (text) setSpokenText(text);
    setIsAnswered(true);
  };

  const handleContinue = () => {
    const duration = startTime ? Math.max(Math.round((Date.now() - startTime) / 1000), 1) : 10;
    const finalWords = spokenText || liveTranscript;
    const wc = getWordCount(finalWords);
    const wpm = calculateWpm(wc, duration);
    const fillerCount = countFillers(finalWords);

    onNext({
      spokenText: finalWords,
      wpm,
      fillerCount,
      duration,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Progress */}
      <View style={styles.topRow}>
        <Badge label={`Rapid-Fire Q&A ${questionNumber}/${totalQuestions}`} variant="warning" />
        <Text style={[styles.targetLabel, { color: colors.textSecondary }]}>
          Aim: ~{item.targetLengthWords} words
        </Text>
      </View>

      {/* Question Card */}
      <Card variant="elevated" padding="large" style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.warning }]}>QUICK RESPONSE CHALLENGE:</Text>
        <Text style={[styles.question, { color: colors.text }]}>{item.question}</Text>

        <View style={[styles.hintBox, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
          <Ionicons name="bulb-outline" size={16} color={colors.warning} />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Starter: "{item.starterHint}"
          </Text>
        </View>

        {isListening && (
          <Timer
            remainingSeconds={secondsRemaining}
            totalSeconds={item.timeLimitSeconds}
            label="Answering Window"
            isUrgent={secondsRemaining <= 5}
          />
        )}
      </Card>

      {/* Live / Answer Card */}
      <Card variant="secondary" padding="medium" style={styles.answerCard}>
        <Text style={[styles.answerLabel, { color: colors.textMuted }]}>YOUR SPOKEN ANSWER:</Text>
        <Text style={[styles.answerText, { color: colors.text }]}>
          {spokenText || liveTranscript || (isListening ? 'Speak your answer right away...' : 'Press Start Answering to begin')}
        </Text>
      </Card>

      {/* Controls */}
      <View style={styles.controls}>
        {!isListening && !isAnswered && (
          <Button
            title="Start Answering"
            variant="primary"
            onPress={handleStart}
            leftIcon={<Ionicons name="mic" size={20} color="#FFFFFF" />}
            style={styles.actionBtn}
          />
        )}

        {isListening && (
          <Button
            title="Finish Answer"
            variant="danger"
            onPress={handleStop}
            leftIcon={<Ionicons name="stop" size={20} color="#FFFFFF" />}
            style={styles.actionBtn}
          />
        )}

        {isAnswered && (
          <Button
            title={questionNumber === totalQuestions ? 'Continue to Idiom of the Day' : 'Next Rapid-Fire Question'}
            variant="primary"
            onPress={handleContinue}
            rightIcon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
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
  targetLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  question: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  hintText: {
    fontSize: 13,
    fontStyle: 'italic',
    flex: 1,
  },
  answerCard: {
    marginVertical: Spacing.sm,
    minHeight: 90,
  },
  answerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  controls: {
    marginTop: Spacing.md,
  },
  actionBtn: {
    width: '100%',
  },
});
