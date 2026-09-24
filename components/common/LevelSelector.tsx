import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { LEVEL_LIST, EnglishLevel } from '../../constants/levels';
import { BorderRadius, Spacing } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

export interface LevelSelectorProps {
  compact?: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ compact = false }) => {
  const { colors } = useTheme();
  const selectedLevel = useAppStore((s) => s.selectedLevel);
  const setLevel = useAppStore((s) => s.setLevel);

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
        {LEVEL_LIST.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <TouchableOpacity
              key={lvl.id}
              onPress={() => setLevel(lvl.id)}
              style={[
                styles.compactTab,
                isSelected && { backgroundColor: colors.primary },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select ${lvl.name} English Level`}
            >
              <Text
                style={[
                  styles.compactText,
                  { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                  isSelected && styles.selectedBold,
                ]}
              >
                {lvl.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.textSecondary }]}>CHOOSE YOUR SPEAKING LEVEL</Text>
      <View style={styles.grid}>
        {LEVEL_LIST.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <TouchableOpacity
              key={lvl.id}
              onPress={() => setLevel(lvl.id)}
              activeOpacity={0.8}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? colors.card : colors.cardSecondary,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.levelName, { color: colors.text }]}>{lvl.name}</Text>
                  <Text style={[styles.cefrCode, { color: isSelected ? colors.primaryLight : colors.textMuted }]}>
                    {lvl.cefr}
                  </Text>
                </View>
                {isSelected && (
                  <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
                )}
              </View>

              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {lvl.description}
              </Text>

              <View style={styles.speedPill}>
                <Text style={[styles.speedText, { color: colors.accentLight }]}>
                  Pace: {lvl.guidance.speechSpeedDescription}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    padding: 3,
    borderWidth: 1,
  },
  compactTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedBold: {
    fontWeight: '700',
  },
  container: {
    marginVertical: Spacing.md,
  },
  heading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  grid: {
    gap: Spacing.sm,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: APP_CONFIG.MIN_TOUCH_TARGET_SIZE,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelName: {
    fontSize: 16,
    fontWeight: '700',
  },
  cefrCode: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  speedPill: {
    marginTop: 8,
  },
  speedText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
