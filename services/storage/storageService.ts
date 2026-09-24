import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserSettings } from '../../types/user';
import { SpeakingSession } from '../../types/session';
import { APP_CONFIG } from '../../constants/config';

const STORAGE_KEYS = {
  CURRENT_PROFILE_ID: '@fluentai:current_profile_id',
  PROFILES: '@fluentai:profiles',
  SETTINGS_PREFIX: '@fluentai:settings:',
  SESSIONS_PREFIX: '@fluentai:sessions:',
  WORKOUTS_PREFIX: '@fluentai:workouts:',
  SCHEMA_VERSION: '@fluentai:schema_version',
};

const CURRENT_SCHEMA_VERSION = 1;

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clearProfileData(profileId: string): Promise<void>;
  migrate(): Promise<void>;
}

class LocalStorageService implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to read key "${key}":`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const raw = JSON.stringify(value);
      await AsyncStorage.setItem(key, raw);
    } catch (error) {
      console.error(`[StorageService] Failed to write key "${key}":`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`[StorageService] Failed to remove key "${key}":`, error);
    }
  }

  // Profile Management
  async getProfiles(): Promise<UserProfile[]> {
    const profiles = await this.get<UserProfile[]>(STORAGE_KEYS.PROFILES);
    if (profiles && profiles.length > 0) return profiles;

    // Initialize default profiles if not existing
    const now = new Date().toISOString();
    const defaults: UserProfile[] = APP_CONFIG.DEFAULT_PROFILES.map((p) => ({
      id: p.id as any,
      name: p.name,
      avatar: p.avatar,
      createdAt: now,
      updatedAt: now,
    }));

    await this.set(STORAGE_KEYS.PROFILES, defaults);
    return defaults;
  }

  async saveProfiles(profiles: UserProfile[]): Promise<void> {
    await this.set(STORAGE_KEYS.PROFILES, profiles);
  }

  async getCurrentProfileId(): Promise<string> {
    const id = await this.get<string>(STORAGE_KEYS.CURRENT_PROFILE_ID);
    return id || APP_CONFIG.DEFAULT_PROFILES[0].id;
  }

  async setCurrentProfileId(profileId: string): Promise<void> {
    await this.set(STORAGE_KEYS.CURRENT_PROFILE_ID, profileId);
  }

  // User Settings
  async getSettings(profileId: string): Promise<UserSettings> {
    const key = `${STORAGE_KEYS.SETTINGS_PREFIX}${profileId}`;
    const saved = await this.get<UserSettings>(key);
    if (saved) return saved;

    const defaultSettings: UserSettings = {
      theme: 'dark',
      selectedLevel: 'intermediate',
      selectedPersona: 'casual',
      speakingRate: 1.0,
      autoPlayAiVoice: true,
      hapticFeedback: true,
      dailyGoalMinutes: APP_CONFIG.DEFAULT_DAILY_GOAL_MINUTES,
    };

    await this.set(key, defaultSettings);
    return defaultSettings;
  }

  async saveSettings(profileId: string, settings: UserSettings): Promise<void> {
    const key = `${STORAGE_KEYS.SETTINGS_PREFIX}${profileId}`;
    await this.set(key, settings);
  }

  // Sessions & History
  async getSessions(profileId: string): Promise<SpeakingSession[]> {
    const key = `${STORAGE_KEYS.SESSIONS_PREFIX}${profileId}`;
    const sessions = await this.get<SpeakingSession[]>(key);
    return sessions || [];
  }

  async saveSession(profileId: string, session: SpeakingSession): Promise<SpeakingSession[]> {
    const sessions = await this.getSessions(profileId);
    // Insert at beginning (newest first)
    const updated = [session, ...sessions];
    const key = `${STORAGE_KEYS.SESSIONS_PREFIX}${profileId}`;
    await this.set(key, updated);
    return updated;
  }

  // Clear data for specific profile
  async clearProfileData(profileId: string): Promise<void> {
    const settingsKey = `${STORAGE_KEYS.SETTINGS_PREFIX}${profileId}`;
    const sessionsKey = `${STORAGE_KEYS.SESSIONS_PREFIX}${profileId}`;
    const workoutsKey = `${STORAGE_KEYS.WORKOUTS_PREFIX}${profileId}`;

    await Promise.all([
      this.remove(settingsKey),
      this.remove(sessionsKey),
      this.remove(workoutsKey),
    ]);
  }

  // Clear all local data
  async clearAllData(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const fluentAiKeys = keys.filter((k) => k.startsWith('@fluentai:'));
    if (fluentAiKeys.length > 0) {
      await AsyncStorage.multiRemove(fluentAiKeys);
    }
  }

  // Migration support for future schema versions
  async migrate(): Promise<void> {
    try {
      const currentVersion = (await this.get<number>(STORAGE_KEYS.SCHEMA_VERSION)) || 0;
      if (currentVersion < CURRENT_SCHEMA_VERSION) {
        // Run migration steps if required in future releases
        await this.set(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
      }
    } catch (error) {
      console.warn('[StorageService] Migration error:', error);
    }
  }
}

export const storageService = new LocalStorageService();
