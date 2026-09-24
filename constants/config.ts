/**
 * FluentAI Core Configuration
 * Changing APP_NAME here updates the branding across the entire application.
 */
export const APP_CONFIG = {
  APP_NAME: 'FluentAI',
  APP_TAGLINE: 'Master Spoken English Fluency with AI',
  APP_VERSION: '1.0.0',
  DEFAULT_MODEL: 'gemini-1.5-flash',
  DEFAULT_VOICE_LOCALE: 'en-US',
  DEFAULT_DAILY_GOAL_MINUTES: 10,
  SIMULATOR_PREP_SECONDS: 15,
  SIMULATOR_SPEAK_SECONDS: 60,
  MAX_CONVERSATION_HISTORY: 20,
  MIN_TOUCH_TARGET_SIZE: 44,
  MAX_DAILY_WORKOUT_MINUTES: 10,
  DEFAULT_PROFILES: [
    { id: 'user_1', name: 'User 1', avatar: 'sparkles' },
    { id: 'user_2', name: 'User 2', avatar: 'zap' },
  ],
} as const;
