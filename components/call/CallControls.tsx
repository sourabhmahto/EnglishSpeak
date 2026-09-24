import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../common/Button';
import { VoiceOrbState } from '../../types/session';
import { APP_CONFIG } from '../../constants/config';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface CallControlsProps {
  isActive: boolean;
  isListening: boolean;
  isAiThinking: boolean;
  voiceOrbState: VoiceOrbState;
  onToggleMic: () => void;
  onEndCall: () => void;
  onGetHint: () => void;
  onReplayAi: () => void;
  onReset: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isActive,
  isListening,
  isAiThinking,
  voiceOrbState,
  onToggleMic,
  onEndCall,
  onGetHint,
  onReplayAi,
  onReset,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Secondary Tool Actions */}
      <View style={styles.secondaryRow}>
        <TouchableOpacity
          onPress={onGetHint}
          style={[styles.smallBtn, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Give me a speaking hint"
        >
          <Ionicons name="bulb-outline" size={18} color={colors.accentLight} />
          <Text style={[styles.smallBtnText, { color: colors.accentLight }]}>Hint</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onReplayAi}
          style={[styles.smallBtn, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Replay last AI response"
        >
          <Ionicons name="volume-medium-outline" size={18} color={colors.primaryLight} />
          <Text style={[styles.smallBtnText, { color: colors.primaryLight }]}>Replay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onReset}
          style={[styles.smallBtn, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Reset conversation"
        >
          <Ionicons name="refresh-outline" size={18} color={colors.textSecondary} />
          <Text style={[styles.smallBtnText, { color: colors.textSecondary }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Primary Action Row */}
      <View style={styles.primaryRow}>
        {/* End Call Button */}
        {isActive && (
          <TouchableOpacity
            onPress={onEndCall}
            style={[styles.endBtn, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]}
            accessibilityRole="button"
            accessibilityLabel="Finish and evaluate session"
          >
            <Ionicons name="stop" size={20} color={colors.danger} />
            <Text style={[styles.endBtnText, { color: colors.danger }]}>Finish</Text>
          </TouchableOpacity>
        )}

        {/* Main Mic Button */}
        <TouchableOpacity
          onPress={onToggleMic}
          disabled={isAiThinking}
          activeOpacity={0.85}
          style={[
            styles.micBtn,
            {
              backgroundColor: isListening ? colors.danger : colors.primary,
              shadowColor: isListening ? colors.danger : colors.primary,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={isListening ? 'Stop speaking and send' : 'Start speaking'}
        >
          <Ionicons
            name={isListening ? 'stop' : 'mic'}
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  smallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    minHeight: APP_CONFIG.MIN_TOUCH_TARGET_SIZE,
    gap: 6,
  },
  smallBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  micBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    minHeight: APP_CONFIG.MIN_TOUCH_TARGET_SIZE,
    gap: 6,
    position: 'absolute',
    left: 20,
  },
  endBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
