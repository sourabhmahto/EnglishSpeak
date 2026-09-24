import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { Header } from '../../components/common/Header';
import { LevelSelector } from '../../components/common/LevelSelector';
import { ScenarioCard } from '../../components/common/ScenarioCard';
import { ScenarioDetailModal } from '../../components/roleplay/ScenarioDetailModal';
import { ROLEPLAY_SCENARIOS, RoleplayScenario } from '../../constants/scenarios';
import { Spacing } from '../../constants/theme';

export default function RoleplayScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const selectedLevel = useAppStore((s) => s.selectedLevel);

  const [activeScenario, setActiveScenario] = useState<RoleplayScenario | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter scenarios for current level
  const filteredScenarios = ROLEPLAY_SCENARIOS.filter((s) => s.level === selectedLevel);

  const handleOpenScenario = (scenario: RoleplayScenario) => {
    setActiveScenario(scenario);
    setShowDetailModal(true);
  };

  const handleStartRoleplay = () => {
    setShowDetailModal(false);
    if (activeScenario) {
      router.push(`/roleplay/${activeScenario.id}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Roleplay Practice" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <Text style={[styles.heading, { color: colors.text }]}>Real-World Roleplay Scenarios</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            Immerse yourself in authentic conversations tailored to your level — from casual dining to high-stakes salary negotiations.
          </Text>
        </View>

        <LevelSelector compact />

        <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
          AVAILABLE SCENARIOS ({filteredScenarios.length})
        </Text>

        <View style={styles.scenarioList}>
          {filteredScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onPress={() => handleOpenScenario(scenario)}
            />
          ))}
        </View>
      </ScrollView>

      <ScenarioDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        scenario={activeScenario}
        onStartRoleplay={handleStartRoleplay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  topHeader: {
    gap: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
  },
  sub: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  scenarioList: {
    gap: Spacing.xs,
  },
});
