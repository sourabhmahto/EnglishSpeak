import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../hooks/useTheme';

export default function RootLayout() {
  const initializeStore = useAppStore((s) => s.initialize);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="session/[id]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="roleplay/[scenario]" options={{ presentation: 'card', headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
