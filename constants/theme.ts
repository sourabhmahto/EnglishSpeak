export interface ThemeColors {
  background: string;
  card: string;
  cardSecondary: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryGlow: string;
  accent: string;
  accentLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  info: string;
  infoLight: string;
  orbIdle: string;
  orbListening: string;
  orbThinking: string;
  orbAiSpeaking: string;
  orbUserSpeaking: string;
  surfaceOverlay: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
}

export const DarkTheme: ThemeColors = {
  background: '#0B0F19',
  card: '#151D2F',
  cardSecondary: '#1E293B',
  border: '#2A374D',
  borderSubtle: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#6366F1', // Indigo primary
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  primaryGlow: 'rgba(99, 102, 241, 0.25)',
  accent: '#06B6D4', // Cyan accent
  accentLight: '#22D3EE',
  success: '#10B981', // Emerald green
  successLight: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B', // Amber
  warningLight: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444', // Rose red
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  info: '#3B82F6',
  infoLight: 'rgba(59, 130, 246, 0.15)',
  orbIdle: '#6366F1',
  orbListening: '#10B981',
  orbThinking: '#F59E0B',
  orbAiSpeaking: '#8B5CF6',
  orbUserSpeaking: '#06B6D4',
  surfaceOverlay: 'rgba(11, 15, 25, 0.85)',
  tabBar: '#0E1424',
  tabBarActive: '#818CF8',
  tabBarInactive: '#64748B',
};

export const LightTheme: ThemeColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardSecondary: '#F1F5F9',
  border: '#E2E8F0',
  borderSubtle: '#EDF2F7',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#4338CA',
  primaryGlow: 'rgba(79, 70, 229, 0.15)',
  accent: '#0891B2',
  accentLight: '#06B6D4',
  success: '#059669',
  successLight: 'rgba(5, 150, 105, 0.12)',
  warning: '#D97706',
  warningLight: 'rgba(217, 119, 6, 0.12)',
  danger: '#DC2626',
  dangerLight: 'rgba(220, 38, 38, 0.12)',
  info: '#2563EB',
  infoLight: 'rgba(37, 99, 235, 0.12)',
  orbIdle: '#4F46E5',
  orbListening: '#059669',
  orbThinking: '#D97706',
  orbAiSpeaking: '#7C3AED',
  orbUserSpeaking: '#0891B2',
  surfaceOverlay: 'rgba(248, 250, 252, 0.9)',
  tabBar: '#FFFFFF',
  tabBarActive: '#4F46E5',
  tabBarInactive: '#94A3B8',
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
  mono: { fontFamily: 'monospace', fontSize: 14 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};
