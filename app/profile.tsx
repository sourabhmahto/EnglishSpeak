import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { APP_CONFIG } from '../constants/config';
import { BorderRadius, Spacing } from '../constants/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profiles = useAppStore((s) => s.profiles);
  const currentProfileId = useAppStore((s) => s.currentProfileId);
  const switchProfile = useAppStore((s) => s.switchProfile);
  const updateProfileName = useAppStore((s) => s.updateProfileName);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const handleSelectProfile = async (id: string) => {
    await switchProfile(id);
    router.back();
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = async (id: string) => {
    if (editingName.trim().length > 0) {
      await updateProfileName(id, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { borderBottomColor: colors.borderSubtle }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Who is Practicing?</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeBtn, { backgroundColor: colors.cardSecondary }]}
          accessibilityRole="button"
          accessibilityLabel="Close profile selector"
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          FluentAI stores completely separate speaking history, analytics, streak counters, and difficulty settings for each local profile on this device.
        </Text>

        <View style={styles.profileList}>
          {profiles.map((profile) => {
            const isCurrent = profile.id === currentProfileId;
            const isEditing = editingId === profile.id;

            return (
              <Card
                key={profile.id}
                variant={isCurrent ? 'elevated' : 'secondary'}
                padding="large"
                style={StyleSheet.flatten([
                  styles.profileCard,
                  isCurrent ? { borderColor: colors.primary, borderWidth: 2 } : {},
                ])}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.avatarGroup}>
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: isCurrent ? colors.primary : colors.cardSecondary },
                      ]}
                    >
                      <Ionicons
                        name={profile.id === 'user_1' ? 'sparkles' : 'person'}
                        size={24}
                        color={isCurrent ? '#FFFFFF' : colors.primaryLight}
                      />
                    </View>

                    {isEditing ? (
                      <View style={styles.editRow}>
                        <TextInput
                          value={editingName}
                          onChangeText={setEditingName}
                          style={[
                            styles.input,
                            { color: colors.text, borderColor: colors.primary, backgroundColor: colors.card },
                          ]}
                          placeholder="Profile Name"
                          placeholderTextColor={colors.textMuted}
                          autoFocus
                        />
                        <TouchableOpacity
                          onPress={() => handleSaveEdit(profile.id)}
                          style={[styles.saveNameBtn, { backgroundColor: colors.primary }]}
                        >
                          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.nameGroup}>
                        <View style={styles.nameBadgeRow}>
                          <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
                          {isCurrent && <Badge label="Active" variant="success" size="small" />}
                        </View>
                        <Text style={[styles.localSub, { color: colors.textMuted }]}>
                          Local Profile ({profile.id})
                        </Text>
                      </View>
                    )}
                  </View>

                  {!isEditing && (
                    <TouchableOpacity
                      onPress={() => handleStartEdit(profile.id, profile.name)}
                      style={styles.editIconBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Edit profile name"
                    >
                      <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>

                {!isCurrent && (
                  <Button
                    title={`Switch to ${profile.name}`}
                    variant="primary"
                    onPress={() => handleSelectProfile(profile.id)}
                    style={styles.switchBtn}
                  />
                )}
              </Card>
            );
          })}
        </View>

        <Card variant="secondary" padding="medium" style={styles.privacyNotice}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.accentLight} />
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            All profile recordings, metrics, and progress are stored 100% locally on your device with no accounts or passwords required.
          </Text>
        </Card>
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
    paddingBottom: 40,
    gap: Spacing.lg,
  },
  sub: {
    fontSize: 13,
    lineHeight: 18,
  },
  profileList: {
    gap: Spacing.md,
  },
  profileCard: {
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameGroup: {
    flex: 1,
    gap: 2,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
  },
  localSub: {
    fontSize: 12,
  },
  editIconBtn: {
    padding: 8,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  saveNameBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchBtn: {
    width: '100%',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
});
