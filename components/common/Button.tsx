import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'accent' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  textStyle,
  ...rest
}) => {
  const { colors } = useTheme();

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: colors.cardSecondary, borderColor: colors.border, borderWidth: 1 },
          text: { color: colors.text },
        };
      case 'outline':
        return {
          container: { backgroundColor: 'transparent', borderColor: colors.primary, borderWidth: 1.5 },
          text: { color: colors.primaryLight },
        };
      case 'danger':
        return {
          container: { backgroundColor: colors.danger },
          text: { color: '#FFFFFF' },
        };
      case 'success':
        return {
          container: { backgroundColor: colors.success },
          text: { color: '#FFFFFF' },
        };
      case 'accent':
        return {
          container: { backgroundColor: colors.accent },
          text: { color: '#FFFFFF' },
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent' },
          text: { color: colors.textSecondary },
        };
      case 'primary':
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: '#FFFFFF' },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: { minHeight: APP_CONFIG.MIN_TOUCH_TARGET_SIZE, paddingVertical: Spacing.xs + 2, paddingHorizontal: Spacing.md },
          text: { fontSize: 13, fontWeight: '600' },
        };
      case 'large':
        return {
          container: { minHeight: 54, paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.xl },
          text: { fontSize: 16, fontWeight: '700' },
        };
      case 'medium':
      default:
        return {
          container: { minHeight: APP_CONFIG.MIN_TOUCH_TARGET_SIZE + 4, paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.lg },
          text: { fontSize: 14, fontWeight: '600' },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        styles.base,
        vStyles.container,
        sStyles.container,
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={vStyles.text.color || colors.text} size="small" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[styles.text, vStyles.text, sStyles.text, textStyle]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
});
