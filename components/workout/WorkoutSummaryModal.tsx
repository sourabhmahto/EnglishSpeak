import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Modal } from '../common/Modal';
import { ScoreCard } from '../common/ScoreCard';
import { MetricCard } from '../common/MetricCard';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { formatDuration } from '../../utils/formatting';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface WorkoutSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  summary: {
    durationSeconds: number;
    shadowingScore: number;
    rapidFireWpm: number;
    idiomCompleted: boolean;
    estimatedIelts: number;
  } | null;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  visible,
  onClose,
  summary,
}) => {
  const { colors } = useTheme();

  if (!summary) return null;

  return (
    <Modal visible={visible} onClose={onClose} title="🎉 Workout Completed!">
      <View style={styles.container}>
        <ScoreCard
          score={summary.estimatedIelts}
          label="Estimated IELTS Practice Score"
          subLabel="Daily 10-Minute Fluency Circuit"
        />

        <View style={styles.metricsRow}>
          <MetricCard
            label="Workout Time"
            value={formatDuration(summary.durationSeconds)}
            iconName="time-outline"
            isMeasured={true}
          />
          <MetricCard
            label="Shadowing Match"
            value={`${summary.shadowingScore}%`}
            iconName="repeat-outline"
            isMeasured={true}
          />
        </View>

        <View style={styles.metricsRow}>
          <MetricCard
            label="Rapid-Fire Pace"
            value={summary.rapidFireWpm}
            unit="WPM"
            iconName="speedometer-outline"
            isMeasured={true}
          />
          <MetricCard
            label="Idiom Challenge"
            value={summary.idiomCompleted ? 'Done' : 'Partial'}
            iconName="bulb-outline"
            iconColor={colors.success}
            isMeasured={true}
          />
        </View>

        <Card variant="secondary" padding="medium" style={styles.streakCard}>
          <Ionicons name="flame" size={24} color={colors.warning} />
          <View style={styles.streakTextGroup}>
            <Text style={[styles.streakTitle, { color: colors.text }]}>Daily Streak Counted!</Text>
            <Text style={[styles.streakSubtitle, { color: colors.textSecondary }]}>
              You completed your daily speaking workout goal.
            </Text>
          </View>
        </Card>

        <Button
          title="Done & Return to Dashboard"
          variant="primary"
          onPress={onClose}
          style={styles.doneBtn}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.xs,
  },
  streakTextGroup: {
    flex: 1,
    gap: 2,
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  streakSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  doneBtn: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
