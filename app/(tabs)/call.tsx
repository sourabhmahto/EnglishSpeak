import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useSession } from '../../hooks/useSession';
import { useAppStore } from '../../store/appStore';
import { Header } from '../../components/common/Header';
import { VoiceOrb } from '../../components/common/VoiceOrb';
import { LevelSelector } from '../../components/common/LevelSelector';
import { PersonaSelector } from '../../components/common/PersonaSelector';
import { CallControls } from '../../components/call/CallControls';
import { TranscriptView } from '../../components/call/TranscriptView';
import { HintModal } from '../../components/call/HintModal';
import { SimulatorResultModal } from '../../components/simulator/SimulatorResultModal';
import { ErrorState } from '../../components/common/ErrorState';
import { PERSONAS } from '../../constants/personas';
import { Spacing } from '../../constants/theme';

export default function CallScreen() {
  const { colors } = useTheme();
  const selectedPersona = useAppStore((s) => s.selectedPersona);
  const personaInfo = PERSONAS[selectedPersona];

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
    type: 'call',
  });

  const handleFinishCall = async () => {
    const session = await endSession();
    if (session) {
      setShowResultModal(true);
    }
  };

  const handleOrbPress = () => {
    if (!isActive) {
      startSession();
    } else {
      toggleListening();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="FluentAI Call" />

      {!isActive ? (
        // Pre-Call Setup Screen
        <ScrollView
          style={styles.setupScroll}
          contentContainerStyle={styles.setupContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topIntro}>
            <Text style={[styles.heroHeading, { color: colors.text }]}>
              Practice English 1-on-1 with Sarah
            </Text>
            <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
              Have natural conversations, receive gentle sentence enhancements, and boost speaking fluency.
            </Text>
          </View>

          {/* Persona Selection */}
          <PersonaSelector />

          {/* Level Selection */}
          <LevelSelector />

          {/* Central Voice Orb (Tap to Start) */}
          <View style={styles.preCallOrb}>
            <VoiceOrb
              state="IDLE"
              size={130}
              onPress={handleOrbPress}
            />
          </View>
        </ScrollView>
      ) : (
        // Active Call Screen
        <View style={styles.activeCallContainer}>
          {/* Active Persona & Level Indicator */}
          <View style={[styles.activeHeaderBar, { backgroundColor: colors.cardSecondary }]}>
            <Text style={[styles.activePersonaText, { color: colors.primaryLight }]}>
              {personaInfo.name}
            </Text>
            <Text style={[styles.activeToneText, { color: colors.textSecondary }]}>
              {personaInfo.tone}
            </Text>
          </View>

          {/* Interactive Voice Orb */}
          <View style={styles.activeOrbWrapper}>
            <VoiceOrb
              state={voiceOrbState}
              size={100}
              onPress={handleOrbPress}
            />
          </View>

          {/* Live Transcript Stream */}
          <View style={styles.transcriptArea}>
            <TranscriptView
              transcript={transcript}
              liveText={isListening ? liveSpeechTranscript : undefined}
              onReplay={replayLastAiMessage}
            />
          </View>

          {/* Interactive Call Controls */}
          <CallControls
            isActive={isActive}
            isListening={isListening}
            isAiThinking={isAiThinking}
            voiceOrbState={voiceOrbState}
            onToggleMic={toggleListening}
            onEndCall={handleFinishCall}
            onGetHint={() => setShowHintModal(true)}
            onReplayAi={replayLastAiMessage}
            onReset={resetSession}
          />
        </View>
      )}

      {/* Hint Modal */}
      <HintModal
        visible={showHintModal}
        onClose={() => setShowHintModal(false)}
        hint={lastHint}
      />

      {/* End of Call Evaluation Results */}
      <SimulatorResultModal
        visible={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          resetSession();
        }}
        session={completedSession}
        onTryAgain={() => {
          setShowResultModal(false);
          startSession();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setupScroll: {
    flex: 1,
  },
  setupContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  topIntro: {
    gap: 4,
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  preCallOrb: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  activeCallContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  activeHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
  },
  activePersonaText: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeToneText: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeOrbWrapper: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  transcriptArea: {
    flex: 1,
  },
});
