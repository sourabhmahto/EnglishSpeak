import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Card } from './Card';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

export interface ScoreCardProps {
  score: number; // e.g. 6.5
  confidenceScore?: number;
  label?: string;
  subLabel?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  confidenceScore,
  label = 'Estimated IELTS Practice Score',
  subLabel = 'Band 0.0 - 9.0 (Practice Estimation)',
}) => {
  const { colors } = useTheme();

  const getScoreGrade = (s: number) => {
    if (s >= 8.0) return { title: 'Expert User (C2)', color: colors.success };
    if (s >= 7.0) return { title: 'Very Good User (C1)', color: colors.accentLight };
    if (s >= 6.0) return { title: 'Competent User (B2)', color: colors.primaryLight };
    if (s >= 5.0) return { title: 'Modest User (B1)', color: colors.warning };
    return { title: 'Developing User (A2)', color: colors.danger };
  };

  const grade = getScoreGrade(score);

  return (
    <Card variant="elevated" padding="large" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="ribbon-outline" size={18} color={colors.primaryLight} />
          <Text style={[styles.title, { color: colors.textSecondary }]}>{label}</Text>
        </View>
        <Text style={[styles.badgeText, { color: grade.color }]}>{grade.title}</Text>
      </View>

      <View style={styles.scoreRow}>
        <Text style={[styles.scoreNumber, { color: colors.text }]}>{score.toFixed(1)}</Text>
        <Text style={[styles.maxScore, { color: colors.textMuted }]}>/ 9.0</Text>
      </View>

      <Text style={[styles.subLabel, { color: colors.textMuted }]}>{subLabel}</Text>

      {typeof confidenceScore === 'number' && (
        <View style={[styles.confidenceRow, { borderColor: colors.borderSubtle }]}>
          <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
            Speaking Confidence Index
          </Text>
          <Text style={[styles.confidenceValue, { color: colors.accentLight }]}>
            {confidenceScore}%
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  maxScore: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 6,
  },
  subLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  confidenceLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});
