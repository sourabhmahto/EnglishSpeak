import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScoreTrendPoint } from '../../types/analytics';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../common/Card';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface TrendChartProps {
  title: string;
  data: ScoreTrendPoint[];
  unit?: string;
  color?: string;
  minMax?: { min: number; max: number };
}

export const TrendChart: React.FC<TrendChartProps> = ({
  title,
  data,
  unit = '',
  color,
  minMax,
}) => {
  const { colors } = useTheme();
  const activeColor = color || colors.primaryLight;

  if (!data || data.length === 0) {
    return null;
  }

  const values = data.map((d) => d.value);
  const minVal = minMax ? minMax.min : Math.min(...values, 0);
  const maxVal = minMax ? minMax.max : Math.max(...values, 10);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  return (
    <Card variant="secondary" padding="medium" style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.latestVal, { color: activeColor }]}>
          Latest: {data[data.length - 1].value} {unit}
        </Text>
      </View>

      <View style={styles.chartArea}>
        {data.map((item, index) => {
          const heightPercent = Math.max(Math.min(((item.value - minVal) / range) * 100, 100), 10);
          return (
            <View key={index} style={styles.barColumn}>
              <Text style={[styles.barValText, { color: colors.textMuted }]}>{item.value}</Text>
              <View style={[styles.barTrack, { backgroundColor: colors.card }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor: activeColor,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.date}
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
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  latestVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  barValText: {
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 80,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: BorderRadius.full,
  },
  dateLabel: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 6,
  },
});
