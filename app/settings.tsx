import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LevelSelector } from '../components/common/LevelSelector';
import { PersonaSelector } from '../components/common/PersonaSelector';
import { APP_CONFIG } from '../constants/config';
import { BorderRadius, Spacing } from '../constants/theme';

export default function SettingsScreen() {
  const { colors, themeMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const settings = useAppStore((s) => s.settings);
  const currentProfile = useAppStore((s) => s.currentProfile);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const clearCurrentProfileData = useAppStore((s) => s.clearCurrentProfileData);

  const speedOptions = [0.8, 0.9, 1.0, 1.05, 1.2];
  const goalOptions = [5, 10, 15, 20, 30];

  const handleClearData = () => {
    Alert.alert(
      'Clear Local Profile Data?',
      `This will permanently remove all speaking transcripts, session history, and analytics for "${currentProfile?.name || 'this profile'}". This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await clearCurrentProfileData();
            Alert.alert('Data Cleared', 'Your local profile history has been successfully reset.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { borderBottomColor: colors.borderSubtle }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Settings & Preferences</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeBtn, { backgroundColor: colors.cardSecondary }]}
          accessibilityRole="button"
          accessibilityLabel="Close settings"
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Profile Section */}
        <Card variant="secondary" padding="medium" style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <Ionicons name="person-circle" size={36} color={colors.primaryLight} />
            <View>
              <Text style={[styles.profileTitle, { color: colors.text }]}>{currentProfile?.name || 'User'}</Text>
              <Text style={[styles.profileSub, { color: colors.textSecondary }]}>Active Local Profile</Text>
            </View>
          </View>
          <Button
            title="Switch"
            size="small"
            variant="outline"
            onPress={() => router.push('/profile')}
          />
        </Card>

        {/* Global Level Configuration */}
        <LevelSelector />

        {/* Persona Selector */}
        <PersonaSelector />

        {/* Theme Preference */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
          <Card variant="secondary" padding="medium">
            <View style={styles.optionRow}>
              {(['dark', 'light', 'system'] as const).map((mode) => {
                const isSelected = settings.theme === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => updateSettings({ theme: mode })}
                    style={[
                      styles.modeButton,
                      isSelected && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modeText,
                        { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {mode.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>

        {/* AI Speaking Speed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI VOICE SPEED (TTS)</Text>
          <Card variant="secondary" padding="medium">
            <View style={styles.optionRow}>
              {speedOptions.map((rate) => {
                const isSelected = settings.speakingRate === rate;
                return (
                  <TouchableOpacity
                    key={rate}
                    onPress={() => updateSettings({ speakingRate: rate })}
                    style={[
                      styles.speedBtn,
                      isSelected && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.speedText,
                        { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {rate}x
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Daily Goal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DAILY PRACTICE GOAL</Text>
          <Card variant="secondary" padding="medium">
            <View style={styles.optionRow}>
              {goalOptions.map((mins) => {
                const isSelected = settings.dailyGoalMinutes === mins;
                return (
                  <TouchableOpacity
                    key={mins}
                    onPress={() => updateSettings({ dailyGoalMinutes: mins })}
                    style={[
                      styles.speedBtn,
                      isSelected && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.speedText,
                        { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {mins}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Switches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AUDIO & PLAYBACK</Text>
          <Card variant="secondary" padding="medium" style={styles.switchCard}>
            <View style={styles.switchRow}>
              <View style={styles.switchTextGroup}>
                <Text style={[styles.switchLabel, { color: colors.text }]}>Auto-play Sarah's Voice</Text>
                <Text style={[styles.switchSub, { color: colors.textSecondary }]}>
                  Automatically speak AI responses via Text-to-Speech
                </Text>
              </View>
              <Switch
                value={settings.autoPlayAiVoice}
                onValueChange={(val) => updateSettings({ autoPlayAiVoice: val })}
                trackColor={{ false: colors.cardSecondary, true: colors.primary }}
              />
            </View>
          </Card>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DATA & PRIVACY</Text>
          <Card variant="secondary" padding="medium" style={styles.dangerCard}>
            <Text style={[styles.dangerLabel, { color: colors.danger }]}>Clear My Local Data</Text>
            <Text style={[styles.dangerSub, { color: colors.textSecondary }]}>
              Erase all speaking transcripts, session history, and scores stored for this profile.
            </Text>
            <Button
              title="Clear Local Profile Data"
              variant="danger"
              onPress={handleClearData}
              style={styles.clearBtn}
            />
          </Card>
        </View>

        {/* About App */}
        <View style={styles.aboutBox}>
          <Text style={[styles.appName, { color: colors.text }]}>{APP_CONFIG.APP_NAME}</Text>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>
            Version {APP_CONFIG.APP_VERSION} • Cross-Platform Spoken English Fluency Engine
          </Text>
          <Text style={[styles.privacyTag, { color: colors.textMuted }]}>
            Local-First Architecture • No User Tracking
          </Text>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 50,
    gap: Spacing.md,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileSub: {
    fontSize: 12,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  speedBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    fontSize: 13,
    fontWeight: '600',
  },
  switchCard: {
    gap: Spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextGroup: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchSub: {
    fontSize: 12,
    marginTop: 2,
  },
  dangerCard: {
    gap: 8,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
  },
  dangerLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  dangerSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  clearBtn: {
    marginTop: 4,
    width: '100%',
  },
  aboutBox: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: 4,
  },
  appName: {
    fontSize: 16,
    fontWeight: '800',
  },
  appVersion: {
    fontSize: 12,
    textAlign: 'center',
  },
  privacyTag: {
    fontSize: 11,
  },
});
