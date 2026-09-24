import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Modal } from '../common/Modal';
import { ScoreCard } from '../common/ScoreCard';
import { MetricCard } from '../common/MetricCard';
import { Button } from '../common/Button';
import { SpeakingSession } from '../../types/session';
import { formatDuration } from '../../utils/formatting';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface RoleplayResultModalProps {
  visible: boolean;
  onClose: () => void;
  session: SpeakingSession | null;
}

export const RoleplayResultModal: React.FC<RoleplayResultModalProps> = ({
  visible,
  onClose,
  session,
}) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'feedback' | 'rewrites' | 'transcript'>('feedback');

  if (!session) return null;

  return (
    <Modal visible={visible} onClose={onClose} title="🎭 Roleplay Debrief">
      <View style={styles.container}>
        {/* Estimated IELTS Band */}
        <ScoreCard
          score={session.estimatedIeltsScore}
          confidenceScore={session.confidenceScore}
        />

        {/* 4 Metric Cards */}
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
            isMeasured={true}
          />
          <MetricCard
            label="Grammar Index"
            value={`${session.grammarScore}%`}
            iconName="checkmark-circle-outline"
            isMeasured={false}
          />
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabBar, { backgroundColor: colors.cardSecondary }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('feedback')}
            style={[styles.tab, activeTab === 'feedback' && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.tabText, { color: activeTab === 'feedback' ? '#FFFFFF' : colors.textSecondary }]}>
              Feedback
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

          <TouchableOpacity
            onPress={() => setActiveTab('transcript')}
            style={[styles.tab, activeTab === 'transcript' && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.tabText, { color: activeTab === 'transcript' ? '#FFFFFF' : colors.textSecondary }]}>
              Transcript
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'feedback' && (
          <View style={styles.tabContent}>
            {session.strengths && session.strengths.length > 0 && (
              <View style={[styles.sectionBox, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.success }]}>STRENGTHS:</Text>
                {session.strengths.map((s, i) => (
                  <Text key={i} style={[styles.bulletPoint, { color: colors.text }]}>• {s}</Text>
                ))}
              </View>
            )}

            {session.improvements && session.improvements.length > 0 && (
              <View style={[styles.sectionBox, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.accentLight }]}>IMPROVEMENT TARGETS:</Text>
                {session.improvements.map((imp, i) => (
                  <Text key={i} style={[styles.bulletPoint, { color: colors.text }]}>• {imp}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'rewrites' && (
          <View style={styles.tabContent}>
            {session.rewrites && session.rewrites.length > 0 ? (
              session.rewrites.map((rw, i) => (
                <View key={i} style={[styles.rewriteCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
                  <View style={styles.rewriteRow}>
                    <Text style={[styles.rwLabel, { color: colors.danger }]}>Original:</Text>
                    <Text style={[styles.rwText, { color: colors.textSecondary }]}>"{rw.original}"</Text>
                  </View>
                  <View style={styles.rewriteRow}>
                    <Text style={[styles.rwLabel, { color: colors.success }]}>Grammar Fix:</Text>
                    <Text style={[styles.rwText, { color: colors.text }]}>{rw.grammarFixed}</Text>
                  </View>
                  <View style={styles.rewriteRow}>
                    <Text style={[styles.rwLabel, { color: colors.accentLight }]}>C1 Alternative:</Text>
                    <Text style={[styles.rwText, { color: colors.text }]}>{rw.nativeC1Alternative}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyTabMessage, { color: colors.textMuted }]}>
                No grammar issues were detected during this conversation!
              </Text>
            )}
          </View>
        )}

        {activeTab === 'transcript' && (
          <View style={styles.tabContent}>
            {session.transcript.map((t) => (
              <View key={t.id} style={styles.transcriptLine}>
                <Text style={[styles.speakerName, { color: t.sender === 'user' ? colors.accentLight : colors.primaryLight }]}>
                  {t.sender === 'user' ? 'You:' : 'Sarah:'}
                </Text>
                <Text style={[styles.speakerText, { color: colors.text }]}>{t.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Button */}
        <Button
          title="Done with Roleplay"
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
  tabBar: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 3,
    marginVertical: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabContent: {
    gap: Spacing.sm,
  },
  sectionBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  bulletPoint: {
    fontSize: 13,
    lineHeight: 18,
  },
  rewriteCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  rewriteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  rwLabel: {
    fontSize: 11,
    fontWeight: '700',
    width: 80,
  },
  rwText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  emptyTabMessage: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  transcriptLine: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  speakerName: {
    fontSize: 12,
    fontWeight: '700',
    width: 50,
  },
  speakerText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  doneBtn: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
