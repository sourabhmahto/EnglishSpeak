import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyStreakInfo, DailyActivityPoint } from '../../types/analytics';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../common/Card';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface StreakCalendarProps {
  streak: DailyStreakInfo;
  weeklyActivity: DailyActivityPoint[];
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  streak,
  weeklyActivity,
}) => {
  const { colors } = useTheme();

  return (
    <Card variant="secondary" padding="medium" style={styles.card}>
      {/* Top Streak Indicator */}
      <View style={styles.header}>
        <View style={styles.streakCountRow}>
          <View style={[styles.flameCircle, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="flame" size={24} color={colors.warning} />
          </View>
          <View>
            <Text style={[styles.streakNumber, { color: colors.text }]}>
              {streak.currentStreak} Day{streak.currentStreak === 1 ? '' : 's'}
            </Text>
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
              Current Speaking Streak
            </Text>
          </View>
        </View>

        <View style={styles.bestStreakBox}>
          <Text style={[styles.bestLabel, { color: colors.textMuted }]}>Best</Text>
          <Text style={[styles.bestNumber, { color: colors.accentLight }]}>{streak.bestStreak}d</Text>
        </View>
      </View>

      {/* 7-Day Activity Pills */}
      <View style={styles.weekRow}>
        {weeklyActivity.map((day, idx) => {
          const hasPracticed = day.minutesPracticed > 0;
          return (
            <View key={idx} style={styles.dayCol}>
              <View
                style={[
                  styles.dayCircle,
                  {
                    backgroundColor: day.completedGoal
                      ? colors.success
                      : hasPracticed
                      ? colors.primaryLight
                      : colors.card,
                    borderColor: colors.border,
                    borderWidth: hasPracticed ? 0 : 1,
                  },
                ]}
              >
                {hasPracticed ? (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                ) : (
                  <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
                )}
              </View>
              <Text style={[styles.dayText, { color: colors.textSecondary }]}>{day.dayName}</Text>
              <Text style={[styles.minText, { color: colors.textMuted }]}>
                {hasPracticed ? `${day.minutesPracticed}m` : '-'}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  flameCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  bestStreakBox: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  bestLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bestNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
  },
  minText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
