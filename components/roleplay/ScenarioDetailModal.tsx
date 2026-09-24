import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { RoleplayScenario } from '../../constants/scenarios';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface ScenarioDetailModalProps {
  visible: boolean;
  onClose: () => void;
  scenario: RoleplayScenario | null;
  onStartRoleplay: () => void;
}

export const ScenarioDetailModal: React.FC<ScenarioDetailModalProps> = ({
  visible,
  onClose,
  scenario,
  onStartRoleplay,
}) => {
  const { colors } = useTheme();

  if (!scenario) return null;

  return (
    <Modal visible={visible} onClose={onClose} title={scenario.title}>
      <View style={styles.container}>
        {/* Category & Level */}
        <View style={styles.badgeRow}>
          <Badge label={scenario.level.toUpperCase()} variant="primary" />
          <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{scenario.category}</Text>
        </View>

        {/* Objective Card */}
        <Card variant="secondary" padding="medium">
          <Text style={[styles.sectionTitle, { color: colors.primaryLight }]}>MISSION OBJECTIVE:</Text>
          <Text style={[styles.objectiveText, { color: colors.text }]}>{scenario.objective}</Text>
        </Card>

        {/* Roles Breakdown */}
        <View style={styles.rolesRow}>
          <View style={[styles.roleCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={18} color={colors.accentLight} />
            <Text style={[styles.roleLabel, { color: colors.textSecondary }]}>YOUR ROLE</Text>
            <Text style={[styles.roleTitle, { color: colors.text }]}>{scenario.userRole}</Text>
          </View>
          <View style={[styles.roleCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
            <Ionicons name="sparkles-outline" size={18} color={colors.primaryLight} />
            <Text style={[styles.roleLabel, { color: colors.textSecondary }]}>AI PARTNER</Text>
            <Text style={[styles.roleTitle, { color: colors.primaryLight }]}>{scenario.aiRole}</Text>
          </View>
        </View>

        {/* Useful Key Phrases */}
        <View style={styles.phrasesSection}>
          <Text style={[styles.sectionTitle, { color: colors.accentLight }]}>KEY PHRASES TO USE:</Text>
          {scenario.keyPhrases.map((phrase, i) => (
            <View key={i} style={styles.phraseItem}>
              <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.accentLight} />
              <Text style={[styles.phraseText, { color: colors.text }]}>"{phrase}"</Text>
            </View>
          ))}
        </View>

        {/* Evaluation Criteria */}
        <View style={styles.evalSection}>
          <Text style={[styles.sectionTitle, { color: colors.success }]}>EVALUATION FOCUS:</Text>
          {scenario.evaluationCriteria.map((crit, i) => (
            <View key={i} style={styles.phraseItem}>
              <Ionicons name="checkmark-done" size={14} color={colors.success} />
              <Text style={[styles.phraseText, { color: colors.textSecondary }]}>{crit}</Text>
            </View>
          ))}
        </View>

        {/* Start Button */}
        <Button
          title="Begin Speaking Roleplay"
          variant="primary"
          onPress={onStartRoleplay}
          style={styles.startBtn}
          rightIcon={<Ionicons name="play" size={18} color="#FFFFFF" />}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  objectiveText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  rolesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  phrasesSection: {
    gap: 6,
  },
  evalSection: {
    gap: 6,
  },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phraseText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  startBtn: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
