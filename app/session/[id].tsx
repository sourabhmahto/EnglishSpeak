import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { ScoreCard } from '../../components/common/ScoreCard';
import { MetricCard } from '../../components/common/MetricCard';
import { TranscriptBubble } from '../../components/common/TranscriptBubble';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDuration } from '../../utils/formatting';
import { formatSessionDate } from '../../utils/dates';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { BorderRadius, Spacing } from '../../constants/theme';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { speak } = useTextToSpeech();

  const sessions = useAppStore((s) => s.sessions);
  const session = sessions.find((s) => s.id === id) || sessions[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'rewrites'>('overview');

  if (!session) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Session Not Found</Text>
        </View>
        <Text style={[styles.emptyNotice, { color: colors.textSecondary }]}>This session may have been cleared.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { borderBottomColor: colors.borderSubtle }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.cardSecondary }]}
          accessibilityRole="button"
          accessibilityLabel="Back to analytics"
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleCol}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Session Debrief</Text>
          <Text style={[styles.dateSub, { color: colors.textSecondary }]}>
            {formatSessionDate(session.date)}
          </Text>
        </View>

        <Badge label={session.type.toUpperCase()} variant="primary" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estimated IELTS Band */}
        <ScoreCard
          score={session.estimatedIeltsScore}
          confidenceScore={session.confidenceScore}
        />

        {/* Tab Switcher */}
        <View style={[styles.tabBar, { backgroundColor: colors.cardSecondary }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('overview')}
            style={[styles.tab, activeTab === 'overview' && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.tabText, { color: activeTab === 'overview' ? '#FFFFFF' : colors.textSecondary }]}>
              Metrics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('transcript')}
            style={[styles.tab, activeTab === 'transcript' && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.tabText, { color: activeTab === 'transcript' ? '#FFFFFF' : colors.textSecondary }]}>
              Transcript ({session.transcript?.length || 0})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('rewrites')}
            style={[styles.tab, activeTab === 'rewrites' && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.tabText, { color: activeTab === 'rewrites' ? '#FFFFFF' : colors.textSecondary }]}>
              Rewrites ({session.rewrites?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' && (
          <View style={styles.tabSection}>
            <View style={styles.metricsRow}>
              <MetricCard
                label="Duration"
                value={formatDuration(session.durationSeconds)}
                iconName="time-outline"
                isMeasured={true}
              />
              <MetricCard
                label="Speaking Pace"
                value={session.wpm}
                unit="WPM"
                iconName="speedometer-outline"
                isMeasured={true}
              />
            </View>

            <View style={styles.metricsRow}>
              <MetricCard
                label="Filler Count"
                value={session.fillerCount}
                unit={`(${session.fillerRate}%)`}
                iconName="alert-circle-outline"
                iconColor={session.fillerCount > 3 ? colors.warning : colors.success}
                isMeasured={true}
              />
              <MetricCard
                label="Grammar Score"
                value={`${session.grammarScore}%`}
                iconName="checkmark-circle-outline"
                isMeasured={false}
              />
            </View>

            {session.strengths && session.strengths.length > 0 && (
              <View style={[styles.feedbackBox, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
                <Text style={[styles.feedbackTitle, { color: colors.success }]}>WHAT WENT WELL:</Text>
                {session.strengths.map((s, i) => (
                  <Text key={i} style={[styles.feedbackItem, { color: colors.text }]}>• {s}</Text>
                ))}
              </View>
            )}

            {session.improvements && session.improvements.length > 0 && (
              <View style={[styles.feedbackBox, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
                <Text style={[styles.feedbackTitle, { color: colors.accentLight }]}>IMPROVEMENT TARGETS:</Text>
                {session.improvements.map((imp, i) => (
                  <Text key={i} style={[styles.feedbackItem, { color: colors.text }]}>• {imp}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'transcript' && (
          <View style={styles.tabSection}>
            {session.transcript && session.transcript.length > 0 ? (
              session.transcript.map((item) => (
                <TranscriptBubble
                  key={item.id}
                  item={item}
                  onReplay={(txt) => speak(txt)}
                />
              ))
            ) : (
              <Text style={[styles.emptyNotice, { color: colors.textSecondary }]}>No transcript recorded for this session.</Text>
            )}
          </View>
        )}

        {activeTab === 'rewrites' && (
          <View style={styles.tabSection}>
            {session.rewrites && session.rewrites.length > 0 ? (
              session.rewrites.map((rw, i) => (
                <View key={i} style={[styles.rewriteCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
                  <View style={styles.rwRow}>
                    <Text style={[styles.rwLabel, { color: colors.danger }]}>Original:</Text>
                    <Text style={[styles.rwValue, { color: colors.textSecondary }]}>"{rw.original}"</Text>
                  </View>
                  <View style={styles.rwRow}>
                    <Text style={[styles.rwLabel, { color: colors.success }]}>Grammar Fix:</Text>
                    <Text style={[styles.rwValue, { color: colors.text }]}>{rw.grammarFixed}</Text>
                  </View>
                  <View style={styles.rwRow}>
                    <Text style={[styles.rwLabel, { color: colors.accentLight }]}>C1 Upgrade:</Text>
                    <Text style={[styles.rwValue, { color: colors.text }]}>{rw.nativeC1Alternative}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyNotice, { color: colors.textSecondary }]}>
                No grammar issues were detected during this session.
              </Text>
            )}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  dateSub: {
    fontSize: 12,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 3,
    marginVertical: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabSection: {
    gap: Spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  feedbackBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  feedbackTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  feedbackItem: {
    fontSize: 13,
    lineHeight: 18,
  },
  rewriteCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  rwRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  rwLabel: {
    fontSize: 11,
    fontWeight: '700',
    width: 80,
  },
  rwValue: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  emptyNotice: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
