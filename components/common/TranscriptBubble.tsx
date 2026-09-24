import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { TranscriptItem } from '../../types/session';
import { BorderRadius, Spacing } from '../../constants/theme';
import { formatDuration } from '../../utils/formatting';

export interface TranscriptBubbleProps {
  item: TranscriptItem;
  onReplay?: (text: string) => void;
}

export const TranscriptBubble: React.FC<TranscriptBubbleProps> = ({ item, onReplay }) => {
  const { colors } = useTheme();
  const [showRewrites, setShowRewrites] = useState(false);

  const isUser = item.sender === 'user';
  const hasRewrites = !isUser && item.rewrites && item.rewrites.length > 0;
  const hasFillers = item.detectedFillers && item.detectedFillers.length > 0;

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.sarahContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: colors.primary }]
            : [styles.sarahBubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }],
        ]}
      >
        {/* Header tag */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.senderName,
              { color: isUser ? '#E0E7FF' : colors.primaryLight },
            ]}
          >
            {isUser ? 'You' : 'Sarah'}
          </Text>

          {!isUser && onReplay && (
            <TouchableOpacity
              onPress={() => onReplay(item.text)}
              style={styles.replayButton}
              accessibilityLabel="Replay audio"
            >
              <Ionicons name="volume-high-outline" size={16} color={colors.primaryLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Message content */}
        <Text
          style={[
            styles.messageText,
            { color: isUser ? '#FFFFFF' : colors.text },
          ]}
        >
          {item.text}
        </Text>

        {/* Detected Fillers indicator */}
        {hasFillers && (
          <View style={styles.fillersRow}>
            <Ionicons name="alert-circle-outline" size={12} color={colors.warning} />
            <Text style={[styles.fillersText, { color: colors.warning }]}>
              Fillers detected: {item.detectedFillers?.join(', ')}
            </Text>
          </View>
        )}

        {/* Grammar and Native C1 Suggestion Toggle */}
        {hasRewrites && (
          <View style={styles.rewritesContainer}>
            <TouchableOpacity
              onPress={() => setShowRewrites(!showRewrites)}
              style={[styles.rewriteToggle, { backgroundColor: colors.cardSecondary }]}
            >
              <Ionicons
                name={showRewrites ? 'chevron-up' : 'sparkles-outline'}
                size={14}
                color={colors.accentLight}
              />
              <Text style={[styles.rewriteToggleText, { color: colors.accentLight }]}>
                {showRewrites ? 'Hide Corrections' : 'View Better Phrasing'}
              </Text>
            </TouchableOpacity>

            {showRewrites && item.rewrites && (
              <View style={[styles.rewritesBox, { borderColor: colors.border, backgroundColor: colors.cardSecondary }]}>
                {item.rewrites.map((rw, idx) => (
                  <View key={idx} style={styles.rewriteItem}>
                    <View style={styles.correctionRow}>
                      <Text style={[styles.correctionLabel, { color: colors.danger }]}>Original:</Text>
                      <Text style={[styles.correctionText, { color: colors.textSecondary }]}>"{rw.original}"</Text>
                    </View>
                    <View style={styles.correctionRow}>
                      <Text style={[styles.correctionLabel, { color: colors.success }]}>Grammar Fix:</Text>
                      <Text style={[styles.correctionText, { color: colors.text }]}>{rw.grammarFixed}</Text>
                    </View>
                    <View style={styles.correctionRow}>
                      <Text style={[styles.correctionLabel, { color: colors.accentLight }]}>C1 Polish:</Text>
                      <Text style={[styles.correctionText, { color: colors.text }]}>{rw.nativeC1Alternative}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: Spacing.md,
    width: '100%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  sarahContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  sarahBubble: {
    borderBottomLeftRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  replayButton: {
    padding: 2,
    marginLeft: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  fillersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  fillersText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rewritesContainer: {
    marginTop: 8,
  },
  rewriteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    gap: 6,
    alignSelf: 'flex-start',
  },
  rewriteToggleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  rewritesBox: {
    marginTop: 6,
    padding: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  rewriteItem: {
    gap: 4,
  },
  correctionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 4,
  },
  correctionLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  correctionText: {
    fontSize: 12,
    flex: 1,
  },
});
