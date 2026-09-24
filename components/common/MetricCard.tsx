import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Card } from './Card';
import { Spacing } from '../../constants/theme';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  isMeasured?: boolean; // measured vs estimated
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  iconName,
  iconColor,
  isMeasured = true,
  subtitle,
}) => {
  const { colors } = useTheme();
  const themeIconColor = iconColor || colors.primaryLight;

  return (
    <Card variant="secondary" padding="medium" style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          <Ionicons name={iconName} size={18} color={themeIconColor} />
        </View>
        <Text style={[styles.typeBadge, { color: isMeasured ? colors.success : colors.accentLight }]}>
          {isMeasured ? 'Measured' : 'AI Estimate'}
        </Text>
      </View>

      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {unit && <Text style={[styles.unit, { color: colors.textMuted }]}>{unit}</Text>}
      </View>

      {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    margin: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 10,
    marginTop: 4,
  },
});
