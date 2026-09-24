import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { formatDuration } from '../../utils/formatting';
import { ProgressBar } from './ProgressBar';

export interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  label?: string;
  isUrgent?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  totalSeconds,
  label = 'Time Remaining',
  isUrgent = false,
}) => {
  const { colors } = useTheme();

  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const timerColor = isUrgent || remainingSeconds <= 10 ? colors.danger : colors.primaryLight;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <View style={styles.labelGroup}>
          <Ionicons name="timer-outline" size={16} color={timerColor} />
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        </View>
        <Text style={[styles.timeDisplay, { color: timerColor }]}>
          {formatDuration(remainingSeconds)}
        </Text>
      </View>
      <ProgressBar progress={progress} color={timerColor} height={6} style={styles.bar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 6,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timeDisplay: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  bar: {
    marginTop: 2,
  },
});
