import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'elevated' | 'outline' | 'accent';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  ...rest
}) => {
  const { colors } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return Spacing.sm;
      case 'large':
        return Spacing.xl;
      case 'medium':
      default:
        return Spacing.lg;
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.cardSecondary,
          borderColor: colors.borderSubtle,
          borderWidth: 1,
        };
      case 'elevated':
        return {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.border,
          borderWidth: 1.5,
        };
      case 'accent':
        return {
          backgroundColor: colors.primaryGlow,
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
        };
    }
  };

  return (
    <View
      style={[
        styles.base,
        { padding: getPadding() },
        getVariantStyle(),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
});
