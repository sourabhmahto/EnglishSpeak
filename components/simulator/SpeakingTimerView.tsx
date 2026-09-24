import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { SimulatorTopic } from '../../constants/topics';
import { Timer } from '../common/Timer';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { VoiceOrb } from '../common/VoiceOrb';
import { APP_CONFIG } from '../../constants/config';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface SpeakingTimerViewProps {
  topic: SimulatorTopic;
  secondsRemaining: number;
  spokenText: string;
  wordCount: number;
  liveWpm: number;
  isPausedDetected: boolean;
  onFinishSpeaking: () => void;
}

export const SpeakingTimerView: React.FC<SpeakingTimerViewProps> = ({
  topic,
  secondsRemaining,
  spokenText,
  wordCount,
  liveWpm,
  isPausedDetected,
  onFinishSpeaking,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Top Header Summary */}
      <View style={styles.header}>
        <Text style={[styles.topicTitle, { color: colors.text }]}>{topic.title}</Text>
        <Timer
          remainingSeconds={secondsRemaining}
          totalSeconds={APP_CONFIG.SIMULATOR_SPEAK_SECONDS}
          label="Speaking Time"
          isUrgent={secondsRemaining <= 10}
        />
      </View>

      {/* Voice Orb and Status Indicator */}
      <View style={styles.orbArea}>
        <VoiceOrb state="USER_SPEAKING" size={90} />
        {isPausedDetected && (
          <View style={[styles.pauseWarning, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
            <Ionicons name="pause-circle-outline" size={14} color={colors.warning} />
            <Text style={[styles.pauseText, { color: colors.warning }]}>Pause detected - keep going!</Text>
          </View>
        )}
      </View>

      {/* Live Metric Row */}
      <View style={styles.metricsRow}>
        <View style={[styles.miniMetric, { backgroundColor: colors.cardSecondary }]}>
          <Text style={[styles.miniMetricLabel, { color: colors.textSecondary }]}>Words Spoken</Text>
          <Text style={[styles.miniMetricValue, { color: colors.text }]}>{wordCount}</Text>
        </View>
        <View style={[styles.miniMetric, { backgroundColor: colors.cardSecondary }]}>
          <Text style={[styles.miniMetricLabel, { color: colors.textSecondary }]}>Live Pace</Text>
          <Text style={[styles.miniMetricValue, { color: colors.accentLight }]}>{liveWpm} WPM</Text>
        </View>
      </View>

      {/* Live Transcript Display */}
      <Card variant="secondary" padding="medium" style={styles.transcriptCard}>
        <Text style={[styles.transcriptHeading, { color: colors.textMuted }]}>LIVE SPEECH TRANSCRIPT:</Text>
        <ScrollView style={styles.scrollArea}>
          <Text style={[styles.transcriptText, { color: colors.text }]}>
            {spokenText || 'Listening to your speech... Speak clearly into your microphone.'}
          </Text>
        </ScrollView>
      </Card>

      {/* Action Button */}
      <Button
        title="Finish Challenge Early"
        variant="danger"
        onPress={onFinishSpeaking}
        style={styles.finishBtn}
        leftIcon={<Ionicons name="stop" size={18} color="#FFFFFF" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    gap: 4,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  orbArea: {
    alignItems: 'center',
    marginVertical: 4,
  },
  pauseWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginTop: 4,
    gap: 6,
  },
  pauseText: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: 4,
  },
  miniMetric: {
    flex: 1,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  miniMetricLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  miniMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  transcriptCard: {
    flex: 1,
    maxHeight: 180,
    marginVertical: Spacing.sm,
  },
  transcriptHeading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  scrollArea: {
    flex: 1,
  },
  transcriptText: {
    fontSize: 14,
    lineHeight: 20,
  },
  finishBtn: {
    width: '100%',
  },
});
