import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { SimulatorTopic } from '../../constants/topics';
import { Timer } from '../common/Timer';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { APP_CONFIG } from '../../constants/config';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface PrepTimerViewProps {
  topic: SimulatorTopic;
  secondsRemaining: number;
  onSkipPrep: () => void;
}

export const PrepTimerView: React.FC<PrepTimerViewProps> = ({
  topic,
  secondsRemaining,
  onSkipPrep,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Card variant="elevated" padding="large" style={styles.card}>
        <View style={styles.badgeRow}>
          <Badge label={`Impromptu Challenge (${topic.level.toUpperCase()})`} variant="primary" />
          <Text style={[styles.categoryText, { color: colors.textMuted }]}>{topic.category}</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{topic.title}</Text>
        <Text style={[styles.prompt, { color: colors.primaryLight }]}>"{topic.prompt}"</Text>

        <View style={styles.bulletSection}>
          <Text style={[styles.bulletHeading, { color: colors.textSecondary }]}>TALKING POINTS TO COVER:</Text>
          {topic.bulletPoints.map((bp, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={14} color={colors.accentLight} />
              <Text style={[styles.bulletText, { color: colors.text }]}>{bp}</Text>
            </View>
          ))}
        </View>

        <View style={styles.vocabSection}>
          <Text style={[styles.bulletHeading, { color: colors.textSecondary }]}>SUGGESTED VOCABULARY:</Text>
          <View style={styles.vocabWrap}>
            {topic.suggestedVocabulary.map((v, i) => (
              <Badge key={i} label={v} variant="accent" size="small" />
            ))}
          </View>
        </View>
      </Card>

      <View style={styles.timerBox}>
        <Timer
          remainingSeconds={secondsRemaining}
          totalSeconds={APP_CONFIG.SIMULATOR_PREP_SECONDS}
          label="Preparation Time"
        />
        <Button
          title="Start Speaking Now"
          variant="primary"
          onPress={onSkipPrep}
          style={styles.skipBtn}
          rightIcon={<Ionicons name="mic-outline" size={18} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  prompt: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    marginVertical: 4,
  },
  bulletSection: {
    marginTop: 8,
    gap: 6,
  },
  bulletHeading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  vocabSection: {
    marginTop: 8,
    gap: 6,
  },
  vocabWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timerBox: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  skipBtn: {
    width: '100%',
  },
});
