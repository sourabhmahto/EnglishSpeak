import React, { useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { TranscriptItem } from '../../types/session';
import { TranscriptBubble } from '../common/TranscriptBubble';
import { useTheme } from '../../hooks/useTheme';
import { Spacing } from '../../constants/theme';

export interface TranscriptViewProps {
  transcript: TranscriptItem[];
  liveText?: string;
  onReplay?: (text: string) => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcript,
  liveText,
  onReplay,
}) => {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (transcript.length > 0 || liveText) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [transcript.length, liveText]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={transcript}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TranscriptBubble item={item} onReplay={onReplay} />}
        contentContainerStyle={styles.content}
        ListFooterComponent={
          liveText ? (
            <View style={[styles.liveContainer, { backgroundColor: colors.cardSecondary, borderColor: colors.primary }]}>
              <Text style={[styles.liveLabel, { color: colors.primaryLight }]}>Transcribing in real time...</Text>
              <Text style={[styles.liveText, { color: colors.text }]}>{liveText}</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: Spacing.sm,
  },
  liveContainer: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  liveLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  liveText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
