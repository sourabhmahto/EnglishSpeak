# FluentAI — Cross-Platform Spoken English Fluency Mobile Application

**FluentAI** is a production-grade, local-first React Native + Expo mobile application designed for practicing and accelerating spoken English fluency. It features 1-on-1 AI conversation with Sarah, a 60-second impromptu fluency simulator, categorized real-world roleplay scenarios, daily 10-minute micro-workouts, client-side filler word tracking, and estimated IELTS practice band analytics.

---

## 📱 Application Architecture & Highlights

- **5 Primary Bottom Tabs**:
  1. **Call**: 1-on-1 natural voice conversation with Sarah across 3 customizable personas (*Casual Partner*, *Talent Recruiter*, *Speaking Examiner*) and CEFR-aligned difficulty (*Beginner A1-A2*, *Intermediate B1-B2*, *Advanced C1-C2*).
  2. **Simulator**: 60-second impromptu speaking challenge with a 15-second preparation timer, silence/pause tracking, WPM calculation, and debrief feedback.
  3. **Roleplay**: Categorized real-world scenarios (Cafe, Hotel Check-In, Job Interview, Tech Standup, Salary Negotiation, Crisis Management, AI Policy Debate) with dedicated mission objectives and C1 rewrites.
  4. **Workout**: Daily 10-minute micro-circuits combining **Shadowing & Articulation**, **Rapid-Fire Q&A**, and **Idiom of the Day**.
  5. **Analytics**: Real-time progress dashboard tracking speaking time, WPM pace trends, filler word breakdowns (`um`, `like`, `actually`, `you know`), and daily streaks without fake historical data.

- **Design System & UX**:
  - Dark-mode-first aesthetic with dynamic theme support (Dark, Light, System).
  - 5-State Animated Dynamic Voice Orb (`IDLE`, `LISTENING`, `USER_SPEAKING`, `THINKING`, `AI_SPEAKING`).
  - Mobile touch targets adhering to the minimum 44x44 pt touch guidelines.
  - Safe-area insets handling for iPhone notch, Dynamic Island, and Android navigation bars.

- **Local-First & Multi-Profile Model**:
  - No authentication or passwords required.
  - Local profile switcher supporting two distinct profiles (`User 1`, `User 2`) with completely isolated settings, history, and analytics.
  - Modular storage abstraction (`services/storage/storageService.ts`) for easy future cloud synchronization.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | React Native 0.76+, Expo SDK 52 |
| **Routing** | `expo-router` |
| **Language** | TypeScript (Strict Mode) |
| **State Management** | `zustand` |
| **Schema Validation** | `zod` |
| **Speech Recognition** | `@react-native-voice/voice` (with fallback simulation) |
| **Text-to-Speech** | `expo-speech` |
| **Local Storage** | `@react-native-async-storage/async-storage` |
| **AI Engine** | Google Gemini API (Configurable models e.g., `gemini-1.5-flash`) |

---

## 📋 1. Prerequisites

- **Node.js**: `v18.0.0` or newer (Tested on Node LTS `v24.19.0`)
- **npm**: `v9.0.0` or newer (Tested on `npm 11+`)
- **Git**
- **Mobile Device or Simulator**:
  - iOS Simulator (macOS + Xcode) or physical iPhone (with Expo Development Build)
  - Android Emulator (Android Studio) or physical Android device

---

## 🚀 2. Installation

1. Clone or open the repository:
   ```bash
   cd "d:/English Speaking"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🔑 3. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your configuration keys:

```env
# Google Gemini API Key (obtain from https://aistudio.google.com/)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Configurable Gemini Model Name
EXPO_PUBLIC_GEMINI_MODEL=gemini-1.5-flash

# Default Voice Locale (default: en-US)
EXPO_PUBLIC_VOICE_LOCALE=en-US
```

> **Security Note:** In client-side prototypes, keys are bundled with the app. For production deployment, route AI generation through a secured serverless backend proxy without changing the mobile UI (see *Future Backend Migration*).

---

## 🎙️ 4. Native Speech Recognition & Permissions

The application is pre-configured with native permission descriptions in `app.json`:

- **iOS (`infoPlist`)**:
  - `NSSpeechRecognitionUsageDescription`: Explains real-time fluency analysis.
  - `NSMicrophoneUsageDescription`: Explains microphone voice capture.
- **Android (`permissions`)**:
  - `RECORD_AUDIO`
  - `MODIFY_AUDIO_SETTINGS`
  - `INTERNET`

Because `@react-native-voice/voice` uses native device speech recognition APIs, run the application using **Expo Development Builds** or **Prebuild** for native voice integration.

---

## 📱 5. Running the Application

### Option A: Standard Development Server (with built-in Speech Simulation Fallback)

```bash
npm start
```
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for Web preview

### Option B: Native iOS Development Build

1. Generate native project files:
   ```bash
   npx expo prebuild --platform ios
   ```
2. Run on iOS simulator or device:
   ```bash
   npx expo run:ios
   ```

### Option C: Native Android Development Build

1. Generate native project files:
   ```bash
   npx expo prebuild --platform android
   ```
2. Run on Android emulator or device:
   ```bash
   npx expo run:android
   ```

---

## ☁️ 6. Building with EAS (Expo Application Services)

Configure builds in `eas.json`:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Build Android APK/AAB:
   ```bash
   eas build --platform android --profile preview
   ```
3. Build iOS IPA (requires Apple Developer Program):
   ```bash
   eas build --platform ios --profile preview
   ```

---

## 🧪 7. Running Unit & Integration Tests

The test suite covers client-side contextual filler detection, false positive filtering (e.g. *"I like coffee"* vs *"I, like, went"*), WPM formulas, and Zod response validation:

```bash
npm test
```

To run strict TypeScript verification:

```bash
npm run typecheck
```

---

## 💾 8. Local Storage Structure

All user data is stored locally in device `AsyncStorage` with profile keys:

```text
@fluentai:current_profile_id   --> 'user_1' | 'user_2'
@fluentai:profiles             --> Array<UserProfile>
@fluentai:settings:user_1      --> UserSettings (Theme, Level, Persona, TTS rate)
@fluentai:settings:user_2      --> UserSettings
@fluentai:sessions:user_1      --> Array<SpeakingSession>
@fluentai:sessions:user_2      --> Array<SpeakingSession>
```

Users can clear all profile history anytime via **Settings -> Clear My Local Data** with a confirmation prompt.

---

## 🔄 9. Future Backend Migration Architecture

The application is structured to decouple UI from API execution:
1. `services/storage/storageService.ts`: Can be swapped with a REST/GraphQL adapter for Supabase, Firebase, or PostgreSQL.
2. `services/gemini/geminiService.ts`: Isolated REST client that can redirect AI prompts to a private backend server or Edge Function without changing any screen components.
