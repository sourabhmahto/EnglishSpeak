import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ValidatedGeminiSpeakingResponse } from '../../types/ai';
import { BorderRadius, Spacing } from '../../constants/theme';

export interface HintModalProps {
  visible: boolean;
  onClose: () => void;
  hint: ValidatedGeminiSpeakingResponse['hint'] | null;
}

export const HintModal: React.FC<HintModalProps> = ({ visible, onClose, hint }) => {
  const { colors } = useTheme();

  if (!hint) {
    return (
      <Modal visible={visible} onClose={onClose} title="Speaking Hint">
        <View style={styles.container}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No hint available for this turn yet. Start speaking or answer Sarah's latest question!
          </Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} onClose={onClose} title="💡 Speaking Assistance">
      <View style={styles.container}>
        {/* Sentence Starter */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryLight }]}>
            HOW YOU CAN START:
          </Text>
          <View style={[styles.card, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
            <Text style={[styles.starterText, { color: colors.text }]}>
              "{hint.starter}"
            </Text>
          </View>
        </View>

        {/* Suggested Keywords */}
        {hint.suggestedKeywords && hint.suggestedKeywords.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.accentLight }]}>
              USEFUL VOCABULARY:
            </Text>
            <View style={styles.keywordWrap}>
              {hint.suggestedKeywords.map((kw: string, i: number) => (
                <Badge key={i} label={kw} variant="accent" style={styles.badge} />
              ))}
            </View>
          </View>
        )}

        {/* Example Model Phrase */}
        {hint.exampleSentence && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.success }]}>
              EXAMPLE PHRASING:
            </Text>
            <View style={[styles.card, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
              <Text style={[styles.exampleText, { color: colors.textSecondary }]}>
                "{hint.exampleSentence}"
              </Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  starterText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    marginRight: 4,
  },
  exampleText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
});
