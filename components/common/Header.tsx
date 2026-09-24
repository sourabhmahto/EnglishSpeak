import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { LEVELS } from '../../constants/levels';
import { APP_CONFIG } from '../../constants/config';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface HeaderProps {
  title?: string;
  showProfileSelector?: boolean;
  showLevelPill?: boolean;
  showSettings?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = APP_CONFIG.APP_NAME,
  showProfileSelector = true,
  showLevelPill = true,
  showSettings = true,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const currentProfile = useAppStore((s) => s.currentProfile);
  const selectedLevel = useAppStore((s) => s.selectedLevel);
  const levelInfo = LEVELS[selectedLevel];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 12),
          backgroundColor: colors.background,
          borderBottomColor: colors.borderSubtle,
        },
      ]}
    >
      <View style={styles.contentRow}>
        {/* Left: App Title / Branding & Profile Switcher */}
        <View style={styles.leftGroup}>
          {showProfileSelector && (
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={[styles.profileButton, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
              accessibilityRole="button"
              accessibilityLabel={`Current profile: ${currentProfile?.name || 'User'}`}
            >
              <Ionicons name="person-circle-outline" size={20} color={colors.primaryLight} />
              <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
                {currentProfile?.name || 'User'}
              </Text>
            </TouchableOpacity>
          )}

          {!showProfileSelector && (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          )}
        </View>

        {/* Right: Level Pill & Settings */}
        <View style={styles.rightGroup}>
          {showLevelPill && (
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              style={[styles.levelPill, { backgroundColor: colors.primaryGlow, borderColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel={`Current level: ${levelInfo.name}`}
            >
              <Text style={[styles.levelText, { color: colors.primaryLight }]}>
                {levelInfo.code}
              </Text>
            </TouchableOpacity>
          )}

          {showSettings && (
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              style={[styles.iconButton, { backgroundColor: colors.cardSecondary }]}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
            >
              <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: APP_CONFIG.MIN_TOUCH_TARGET_SIZE,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 6,
    minHeight: 36,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: 100,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  levelPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '800',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
