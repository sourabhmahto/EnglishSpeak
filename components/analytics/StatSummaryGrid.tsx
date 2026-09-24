import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnalyticsSummary } from '../../types/analytics';
import { MetricCard } from '../common/MetricCard';
import { formatDurationHuman } from '../../utils/formatting';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export interface StatSummaryGridProps {
  analytics: AnalyticsSummary;
}

export const StatSummaryGrid: React.FC<StatSummaryGridProps> = ({ analytics }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MetricCard
          label="Total Speaking"
          value={formatDurationHuman(analytics.totalSpeakingSeconds)}
          iconName="mic-outline"
          iconColor={colors.primaryLight}
          isMeasured={true}
        />
        <MetricCard
          label="Completed Sessions"
          value={analytics.totalSessions}
          iconName="layers-outline"
          iconColor={colors.accentLight}
          isMeasured={true}
        />
      </View>

      <View style={styles.row}>
        <MetricCard
          label="Average Pace"
          value={analytics.averageWpm}
          unit="WPM"
          iconName="speedometer-outline"
          iconColor={colors.info}
          isMeasured={true}
        />
        <MetricCard
          label="Filler Word Rate"
          value={`${analytics.averageFillerRate}%`}
          iconName="alert-circle-outline"
          iconColor={analytics.averageFillerRate > 4 ? colors.warning : colors.success}
          isMeasured={true}
        />
      </View>

      <View style={styles.row}>
        <MetricCard
          label="Grammar Index"
          value={`${analytics.averageGrammarScore}%`}
          iconName="checkmark-done-circle-outline"
          iconColor={colors.success}
          isMeasured={false}
        />
        <MetricCard
          label="Confidence Level"
          value={`${analytics.averageConfidence}%`}
          iconName="shield-checkmark-outline"
          iconColor={colors.accentLight}
          isMeasured={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
});
