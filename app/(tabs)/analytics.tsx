import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Header } from '../../components/common/Header';
import { StatSummaryGrid } from '../../components/analytics/StatSummaryGrid';
import { TrendChart } from '../../components/analytics/TrendChart';
import { FillerBreakdownCard } from '../../components/analytics/FillerBreakdownCard';
import { StreakCalendar } from '../../components/analytics/StreakCalendar';
import { SessionHistoryList } from '../../components/analytics/SessionHistoryList';
import { EmptyState } from '../../components/common/EmptyState';
import { ScoreCard } from '../../components/common/ScoreCard';
import { useAppStore } from '../../store/appStore';
import { Spacing } from '../../constants/theme';

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { analytics, hasData } = useAnalytics();
  const sessions = useAppStore((s) => s.sessions);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Fluency Analytics" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <Text style={[styles.heading, { color: colors.text }]}>Your Speaking Progress</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            Measurable metrics tracking your pace, hesitation reduction, grammar refinement, and estimated IELTS band trajectory.
          </Text>
        </View>

        {!hasData ? (
          <EmptyState
            iconName="analytics-outline"
            title="Start Speaking to Build Progress"
            description="Complete a 1-on-1 Call with Sarah, an Impromptu Simulator challenge, or a Daily Workout to start tracking your fluency analytics."
            actionTitle="Start a Practice Call"
            onAction={() => router.push('/(tabs)/call')}
          />
        ) : (
          <View style={styles.dataArea}>
            {/* Latest Estimated IELTS Band Score */}
            {analytics.latestEstimatedIelts !== null && (
              <ScoreCard
                score={analytics.latestEstimatedIelts}
                confidenceScore={analytics.averageConfidence}
                label="Latest Estimated IELTS Practice Score"
              />
            )}

            {/* Daily Streak & 7-Day Activity */}
            <StreakCalendar
              streak={analytics.streak}
              weeklyActivity={analytics.weeklyActivity}
            />

            {/* 6 Key Stats Grid */}
            <StatSummaryGrid analytics={analytics} />

            {/* Specific Filler Words Breakdown */}
            <FillerBreakdownCard breakdown={analytics.fillerBreakdown} />

            {/* Trend Charts */}
            {analytics.ieltsTrend.length > 1 && (
              <TrendChart
                title="Estimated IELTS Score Trajectory"
                data={analytics.ieltsTrend}
                unit="Band"
                color={colors.primaryLight}
                minMax={{ min: 4.0, max: 9.0 }}
              />
            )}

            {analytics.wpmTrend.length > 1 && (
              <TrendChart
                title="Speaking Pace (WPM) Over Time"
                data={analytics.wpmTrend}
                unit="WPM"
                color={colors.accentLight}
                minMax={{ min: 60, max: 200 }}
              />
            )}

            {analytics.fillerTrend.length > 1 && (
              <TrendChart
                title="Filler Word Rate (%) Over Time"
                data={analytics.fillerTrend}
                unit="%"
                color={colors.warning}
                minMax={{ min: 0, max: 15 }}
              />
            )}

            {/* Session History List */}
            <SessionHistoryList sessions={sessions} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  topHeader: {
    gap: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
  },
  sub: {
    fontSize: 13,
    lineHeight: 18,
  },
  dataArea: {
    gap: Spacing.md,
  },
});
