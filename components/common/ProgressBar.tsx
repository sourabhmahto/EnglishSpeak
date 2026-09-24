import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadius } from '../../constants/theme';

export interface ProgressBarProps {
  progress: number; // 0 to 1 or 0 to 100
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  trackColor,
  height = 8,
  style,
}) => {
  const { colors } = useTheme();

  // Normalize progress to 0-100
  const normalized = progress > 1 ? Math.min(Math.max(progress, 0), 100) : Math.min(Math.max(progress * 100, 0), 100);

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor || colors.cardSecondary,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${normalized}%`,
            backgroundColor: color || colors.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});
