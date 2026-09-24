import { create } from 'zustand';
import { UserProfile, UserSettings, ProfileId } from '../types/user';
import { EnglishLevel } from '../constants/levels';
import { PersonaId } from '../constants/personas';
import { SpeakingSession, VoiceOrbState } from '../types/session';
import { storageService } from '../services/storage/storageService';
import { APP_CONFIG } from '../constants/config';

interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  errorMessage: string | null;

  // Profiles
  currentProfileId: string;
  profiles: UserProfile[];
  currentProfile: UserProfile | null;

  // Active Settings & Level
  settings: UserSettings;
  selectedLevel: EnglishLevel;
  selectedPersona: PersonaId;

  // Data for current profile
  sessions: SpeakingSession[];

  // Real-time Voice & Session State
  voiceOrbState: VoiceOrbState;

  // Actions
  initialize: () => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  updateProfileName: (profileId: string, name: string) => Promise<void>;
  setLevel: (level: EnglishLevel) => Promise<void>;
  setPersona: (persona: PersonaId) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  saveSession: (session: SpeakingSession) => Promise<void>;
  clearCurrentProfileData: () => Promise<void>;
  setVoiceOrbState: (state: VoiceOrbState) => void;
  setErrorMessage: (msg: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isInitialized: false,
  isLoading: true,
  errorMessage: null,

  currentProfileId: APP_CONFIG.DEFAULT_PROFILES[0].id,
  profiles: [],
  currentProfile: null,

  settings: {
    theme: 'dark',
    selectedLevel: 'intermediate',
    selectedPersona: 'casual',
    speakingRate: 1.0,
    autoPlayAiVoice: true,
    hapticFeedback: true,
    dailyGoalMinutes: APP_CONFIG.DEFAULT_DAILY_GOAL_MINUTES,
  },
  selectedLevel: 'intermediate',
  selectedPersona: 'casual',

  sessions: [],
  voiceOrbState: 'IDLE',

  initialize: async () => {
    try {
      set({ isLoading: true });
      await storageService.migrate();

      const profiles = await storageService.getProfiles();
      const currentProfileId = await storageService.getCurrentProfileId();
      const currentProfile = profiles.find((p) => p.id === currentProfileId) || profiles[0];

      const settings = await storageService.getSettings(currentProfile.id);
      const sessions = await storageService.getSessions(currentProfile.id);

      set({
        isInitialized: true,
        isLoading: false,
        profiles,
        currentProfileId: currentProfile.id,
        currentProfile,
        settings,
        selectedLevel: settings.selectedLevel,
        selectedPersona: settings.selectedPersona,
        sessions,
      });
    } catch (error) {
      console.error('[AppStore] Initialization failed:', error);
      set({
        isInitialized: true,
        isLoading: false,
        errorMessage: 'Failed to load local profile storage.',
      });
    }
  },

  switchProfile: async (profileId: string) => {
    try {
      set({ isLoading: true });
      await storageService.setCurrentProfileId(profileId);

      const profiles = get().profiles;
      const targetProfile = profiles.find((p) => p.id === profileId) || profiles[0];
      const settings = await storageService.getSettings(targetProfile.id);
      const sessions = await storageService.getSessions(targetProfile.id);

      set({
        currentProfileId: targetProfile.id,
        currentProfile: targetProfile,
        settings,
        selectedLevel: settings.selectedLevel,
        selectedPersona: settings.selectedPersona,
        sessions,
        isLoading: false,
      });
    } catch (error) {
      console.error('[AppStore] Profile switch failed:', error);
      set({ isLoading: false });
    }
  },

  updateProfileName: async (profileId: string, name: string) => {
    const profiles = get().profiles.map((p) => (p.id === profileId ? { ...p, name, updatedAt: new Date().toISOString() } : p));
    await storageService.saveProfiles(profiles);

    const currentProfile = profiles.find((p) => p.id === get().currentProfileId) || null;
    set({ profiles, currentProfile });
  },

  setLevel: async (level: EnglishLevel) => {
    const { currentProfileId, settings } = get();
    const updated = { ...settings, selectedLevel: level };
    set({ selectedLevel: level, settings: updated });
    await storageService.saveSettings(currentProfileId, updated);
  },

  setPersona: async (persona: PersonaId) => {
    const { currentProfileId, settings } = get();
    const updated = { ...settings, selectedPersona: persona };
    set({ selectedPersona: persona, settings: updated });
    await storageService.saveSettings(currentProfileId, updated);
  },

  updateSettings: async (partial: Partial<UserSettings>) => {
    const { currentProfileId, settings } = get();
    const updated = { ...settings, ...partial };
    set({
      settings: updated,
      selectedLevel: updated.selectedLevel,
      selectedPersona: updated.selectedPersona,
    });
    await storageService.saveSettings(currentProfileId, updated);
  },

  saveSession: async (session: SpeakingSession) => {
    const { currentProfileId } = get();
    const updatedSessions = await storageService.saveSession(currentProfileId, session);
    set({ sessions: updatedSessions });
  },

  clearCurrentProfileData: async () => {
    const { currentProfileId } = get();
    await storageService.clearProfileData(currentProfileId);
    const defaultSettings = await storageService.getSettings(currentProfileId);
    set({
      sessions: [],
      settings: defaultSettings,
      selectedLevel: defaultSettings.selectedLevel,
      selectedPersona: defaultSettings.selectedPersona,
    });
  },

  setVoiceOrbState: (state: VoiceOrbState) => {
    set({ voiceOrbState: state });
  },

  setErrorMessage: (msg: string | null) => {
    set({ errorMessage: msg });
  },
}));
