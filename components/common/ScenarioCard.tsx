import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { RoleplayScenario } from '../../constants/scenarios';
import { Card } from './Card';
import { Badge } from './Badge';
import { BorderRadius, Spacing } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

export interface ScenarioCardProps {
  scenario: RoleplayScenario;
  onPress: () => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onPress }) => {
  const { colors } = useTheme();

  const getCategoryBadge = () => {
    switch (scenario.level) {
      case 'beginner':
        return <Badge label="Beginner A1-A2" variant="success" />;
      case 'intermediate':
        return <Badge label="Intermediate B1-B2" variant="primary" />;
      case 'advanced':
      default:
        return <Badge label="Advanced C1-C2" variant="accent" />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.touchable}
      accessibilityRole="button"
      accessibilityLabel={`Scenario: ${scenario.title}`}
    >
      <Card variant="elevated" padding="medium" style={styles.card}>
        <View style={styles.topRow}>
          {getCategoryBadge()}
          <View style={styles.categoryPill}>
            <Text style={[styles.categoryText, { color: colors.textMuted }]}>{scenario.category}</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{scenario.title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {scenario.description}
        </Text>

        <View style={[styles.rolesRow, { borderColor: colors.borderSubtle }]}>
          <View style={styles.roleItem}>
            <Text style={[styles.roleLabel, { color: colors.textMuted }]}>Your Role:</Text>
            <Text style={[styles.roleValue, { color: colors.text }]}>{scenario.userRole}</Text>
          </View>
          <View style={styles.roleItem}>
            <Text style={[styles.roleLabel, { color: colors.textMuted }]}>AI Role:</Text>
            <Text style={[styles.roleValue, { color: colors.primaryLight }]}>{scenario.aiRole}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={[styles.startText, { color: colors.primaryLight }]}>Start Roleplay Practice</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primaryLight} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginVertical: 6,
    minHeight: APP_CONFIG.MIN_TOUCH_TARGET_SIZE,
  },
  card: {
    borderRadius: BorderRadius.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  rolesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 6,
  },
  roleItem: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  roleValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  startText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
