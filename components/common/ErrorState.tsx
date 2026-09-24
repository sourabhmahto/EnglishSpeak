import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  bannerMode?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong while connecting to the AI. Please try again.',
  onRetry,
  bannerMode = false,
}) => {
  const { colors } = useTheme();

  if (bannerMode) {
    return (
      <View style={[styles.banner, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]}>
        <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
        <Text style={[styles.bannerText, { color: colors.danger }]}>{message}</Text>
        {onRetry && (
          <Button
            title="Retry"
            size="small"
            variant="danger"
            onPress={onRetry}
            style={styles.retryBtnSmall}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.dangerLight }]}>
        <Ionicons name="cloud-offline-outline" size={36} color={colors.danger} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Connection Notice</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{message}</Text>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="primary"
          style={styles.retryBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginVertical: Spacing.lg,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
    marginBottom: Spacing.lg,
  },
  retryBtn: {
    minWidth: 140,
  },
  retryBtnSmall: {
    minHeight: 32,
    paddingHorizontal: 8,
  },
});
