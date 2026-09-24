import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSession } from '../../hooks/useSession';
import { useAppStore } from '../../store/appStore';
import { ROLEPLAY_SCENARIOS, RoleplayScenario } from '../../constants/scenarios';
import { VoiceOrb } from '../../components/common/VoiceOrb';
import { TranscriptView } from '../../components/call/TranscriptView';
import { CallControls } from '../../components/call/CallControls';
import { HintModal } from '../../components/call/HintModal';
import { RoleplayResultModal } from '../../components/roleplay/RoleplayResultModal';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { BorderRadius, Spacing } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DedicatedRoleplayScreen() {
  const { scenario: scenarioId } = useLocalSearchParams<{ scenario: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const selectedLevel = useAppStore((s) => s.selectedLevel);

  const scenario = ROLEPLAY_SCENARIOS.find((s) => s.id === scenarioId) || ROLEPLAY_SCENARIOS[0];

  const [showHintModal, setShowHintModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const {
    isActive,
    isListening,
    isAiThinking,
    voiceOrbState,
    transcript,
    liveSpeechTranscript,
    lastHint,
    completedSession,
    startSession,
    toggleListening,
    endSession,
    resetSession,
    replayLastAiMessage,
  } = useSession({
    type: 'roleplay',
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    scenarioObjective: scenario.objective,
    initialGreeting: scenario.initialAiGreeting,
  });

  // Automatically start roleplay on mount
  useEffect(() => {
    startSession();
    return () => {
      resetSession();
    };
  }, []);

  const handleFinish = async () => {
    const session = await endSession();
    if (session) {
      setShowResultModal(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.navBar, { borderBottomColor: colors.borderSubtle }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.cardSecondary }]}
          accessibilityRole="button"
          accessibilityLabel="Back to scenarios"
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.navTitleGroup}>
          <Text style={[styles.navTitle, { color: colors.text }]} numberOfLines={1}>
            {scenario.title}
          </Text>
          <Text style={[styles.navSub, { color: colors.primaryLight }]}>
            You: {scenario.userRole} | AI: {scenario.aiRole}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleFinish}
          style={[styles.finishHeaderBtn, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]}
        >
          <Text style={[styles.finishHeaderText, { color: colors.danger }]}>Finish</Text>
        </TouchableOpacity>
      </View>

      {/* Scenario Mission Header */}
      <View style={[styles.missionBar, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
        <Ionicons name="flag-outline" size={14} color={colors.accentLight} />
        <Text style={[styles.missionText, { color: colors.textSecondary }]} numberOfLines={1}>
          Objective: {scenario.objective}
        </Text>
      </View>

      {/* Voice Orb Area */}
      <View style={styles.orbArea}>
        <VoiceOrb
          state={voiceOrbState}
          size={90}
          onPress={toggleListening}
        />
      </View>

      {/* Live Dialogue Stream */}
      <View style={styles.transcriptArea}>
        <TranscriptView
          transcript={transcript}
          liveText={isListening ? liveSpeechTranscript : undefined}
          onReplay={replayLastAiMessage}
        />
      </View>

      {/* Bottom Controls */}
      <CallControls
        isActive={isActive}
        isListening={isListening}
        isAiThinking={isAiThinking}
        voiceOrbState={voiceOrbState}
        onToggleMic={toggleListening}
        onEndCall={handleFinish}
        onGetHint={() => setShowHintModal(true)}
        onReplayAi={replayLastAiMessage}
        onReset={resetSession}
      />

      {/* Hint Modal */}
      <HintModal
        visible={showHintModal}
        onClose={() => setShowHintModal(false)}
        hint={lastHint}
      />

      {/* Debrief Results Modal */}
      <RoleplayResultModal
        visible={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          router.back();
        }}
        session={completedSession}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleGroup: {
    flex: 1,
    gap: 2,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  navSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  finishHeaderBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  finishHeaderText: {
    fontSize: 12,
    fontWeight: '700',
  },
  missionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderBottomWidth: 1,
    gap: 6,
  },
  missionText: {
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  orbArea: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  transcriptArea: {
    flex: 1,
  },
});
