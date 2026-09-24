import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme, ThemeColors } from '../constants/theme';
import { useAppStore } from '../store/appStore';

export function useTheme(): { colors: ThemeColors; isDark: boolean; themeMode: 'system' | 'dark' | 'light' } {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppStore((s) => s.settings.theme);

  const isDark = themeMode === 'system' ? systemColorScheme !== 'light' : themeMode === 'dark';
  const colors = isDark ? DarkTheme : LightTheme;

  return {
    colors,
    isDark,
    themeMode,
  };
}
