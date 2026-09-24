import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Modal } from '../common/Modal';
import { ScoreCard } from '../common/ScoreCard';
import { MetricCard } from '../common/MetricCard';
import { Button } from '../common/Button';
import { SpeakingSession } from '../../types/session';
import { formatDuration } from '../../utils/formatting';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface SimulatorResultModalProps {
  visible: boolean;
  onClose: () => void;
  session: SpeakingSession | null;
  onTryAgain: () => void;
}

export const SimulatorResultModal: React.FC<SimulatorResultModalProps> = ({
  visible,
  onClose,
  session,
  onTryAgain,
}) => {
  const { colors } = useTheme();
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  if (!session) return null;

  return (
    <Modal visible={visible} onClose={onClose} title="📊 Speaking Challenge Results">
      <View style={styles.container}>
        {/* Estimated IELTS Band Score Card */}
        <ScoreCard
          score={session.estimatedIeltsScore}
          confidenceScore={session.confidenceScore}
        />

        {/* 4-Grid Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <MetricCard
              label="Speaking Time"
              value={formatDuration(session.durationSeconds)}
              iconName="time-outline"
              isMeasured={true}
            />
            <MetricCard
              label="Words Per Minute"
              value={session.wpm}
              unit="WPM"
              iconName="speedometer-outline"
              isMeasured={true}
            />
          </View>

          <View style={styles.metricRow}>
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
              iconName="checkmark-done-outline"
              iconColor={colors.primaryLight}
              isMeasured={false}
            />
          </View>
        </View>

        {/* Strengths & Improvements */}
        {session.strengths && session.strengths.length > 0 && (
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackTitleRow}>
              <Ionicons name="sparkles" size={16} color={colors.success} />
              <Text style={[styles.feedbackHeading, { color: colors.success }]}>WHAT YOU DID WELL:</Text>
            </View>
            {session.strengths.map((s, i) => (
              <Text key={i} style={[styles.feedbackItem, { color: colors.text }]}>• {s}</Text>
            ))}
          </View>
        )}

        {session.improvements && session.improvements.length > 0 && (
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackTitleRow}>
              <Ionicons name="trending-up" size={16} color={colors.accentLight} />
              <Text style={[styles.feedbackHeading, { color: colors.accentLight }]}>AREAS TO ELEVATE:</Text>
            </View>
            {session.improvements.map((imp, i) => (
              <Text key={i} style={[styles.feedbackItem, { color: colors.text }]}>• {imp}</Text>
            ))}
          </View>
        )}

        {/* View Transcript Accordion */}
        <TouchableOpacity
          onPress={() => setShowFullTranscript(!showFullTranscript)}
          style={[styles.transcriptToggle, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
        >
          <Text style={[styles.toggleText, { color: colors.text }]}>
            {showFullTranscript ? 'Hide Spoken Transcript' : 'View Spoken Transcript'}
          </Text>
          <Ionicons
            name={showFullTranscript ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {showFullTranscript && (
          <View style={[styles.transcriptBox, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
            <Text style={[styles.rawTranscriptText, { color: colors.text }]}>
              {session.transcript.map((t) => t.text).join(' ') || 'No words captured.'}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Try Again"
            variant="primary"
            onPress={onTryAgain}
            leftIcon={<Ionicons name="reload" size={18} color="#FFFFFF" />}
          />
          <Button
            title="Done & Save"
            variant="secondary"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  metricsGrid: {
    gap: Spacing.xs,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  feedbackCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 4,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  feedbackHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  feedbackItem: {
    fontSize: 13,
    lineHeight: 18,
  },
  transcriptToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  transcriptBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  rawTranscriptText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
