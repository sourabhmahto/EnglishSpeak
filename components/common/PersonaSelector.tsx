import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/appStore';
import { PERSONA_LIST, PersonaId } from '../../constants/personas';
import { BorderRadius, Spacing } from '../../constants/theme';

export const PersonaSelector: React.FC = () => {
  const { colors } = useTheme();
  const selectedPersona = useAppStore((s) => s.selectedPersona);
  const setPersona = useAppStore((s) => s.setPersona);

  const getPersonaIcon = (id: PersonaId) => {
    switch (id) {
      case 'recruiter':
        return 'briefcase-outline';
      case 'examiner':
        return 'school-outline';
      case 'casual':
      default:
        return 'chatbubbles-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SELECT CONVERSATION PERSONA</Text>
      <View style={styles.row}>
        {PERSONA_LIST.map((p) => {
          const isSelected = selectedPersona === p.id;
          const iconName = getPersonaIcon(p.id);

          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => setPersona(p.id)}
              activeOpacity={0.8}
              style={[
                styles.item,
                {
                  backgroundColor: isSelected ? colors.card : colors.cardSecondary,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select ${p.name}`}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isSelected ? colors.primaryGlow : colors.card },
                ]}
              >
                <Ionicons
                  name={iconName as any}
                  size={20}
                  color={isSelected ? colors.primaryLight : colors.textMuted}
                />
              </View>

              <Text style={[styles.name, { color: colors.text }]}>{p.name.split(' ')[0]}</Text>
              <Text style={[styles.tagline, { color: colors.textSecondary }]}>{p.tagline}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  item: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
});
