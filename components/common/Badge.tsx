import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadius, Spacing } from '../../constants/theme';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'small',
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getVariantStyles = (): { bg: string; text: string; border: string } => {
    switch (variant) {
      case 'success':
        return { bg: colors.successLight, text: colors.success, border: colors.success };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning, border: colors.warning };
      case 'danger':
        return { bg: colors.dangerLight, text: colors.danger, border: colors.danger };
      case 'info':
        return { bg: colors.infoLight, text: colors.info, border: colors.info };
      case 'accent':
        return { bg: 'rgba(6, 182, 212, 0.15)', text: colors.accentLight, border: colors.accent };
      case 'neutral':
        return { bg: colors.cardSecondary, text: colors.textSecondary, border: colors.border };
      case 'primary':
      default:
        return { bg: colors.primaryGlow, text: colors.primaryLight, border: colors.primary };
    }
  };

  const vStyles = getVariantStyles();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: vStyles.bg,
          borderColor: vStyles.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: vStyles.text,
            fontSize: isSmall ? 11 : 13,
            fontWeight: '600',
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
