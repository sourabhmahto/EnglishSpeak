import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FillerBreakdown } from '../../types/analytics';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface FillerBreakdownCardProps {
  breakdown: FillerBreakdown;
}

export const FillerBreakdownCard: React.FC<FillerBreakdownCardProps> = ({ breakdown }) => {
  const { colors } = useTheme();
  const total = Math.max(breakdown.total, 1);

  const items = [
    { word: '"um" / "uh"', count: breakdown.um, color: colors.warning },
    { word: '"like"', count: breakdown.like, color: colors.primaryLight },
    { word: '"actually"', count: breakdown.actually, color: colors.accentLight },
    { word: '"you know" / "i mean"', count: breakdown.youKnow, color: colors.info },
  ];

  return (
    <Card variant="secondary" padding="medium" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="filter-outline" size={16} color={colors.warning} />
          <Text style={[styles.title, { color: colors.text }]}>FILLER WORDS DETECTED</Text>
        </View>
        <Text style={[styles.totalText, { color: colors.textSecondary }]}>
          Total: {breakdown.total} instances
        </Text>
      </View>

      <View style={styles.list}>
        {items.map((item, index) => {
          const percentage = Math.round((item.count / total) * 100);
          return (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLabelRow}>
                <Text style={[styles.wordLabel, { color: colors.text }]}>{item.word}</Text>
                <Text style={[styles.countLabel, { color: colors.textSecondary }]}>
                  {item.count} ({percentage}%)
                </Text>
              </View>
              <ProgressBar
                progress={percentage}
                color={item.color}
                height={6}
                style={styles.progressBar}
              />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  totalText: {
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    gap: Spacing.sm + 2,
  },
  itemRow: {
    gap: 4,
  },
  itemLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  countLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    marginTop: 2,
  },
});
