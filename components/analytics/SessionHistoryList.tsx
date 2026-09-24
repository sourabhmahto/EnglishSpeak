import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SpeakingSession } from '../../types/session';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../common/Badge';
import { formatDuration } from '../../utils/formatting';
import { formatSessionDate } from '../../utils/dates';
import { BorderRadius, Spacing } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

export interface SessionHistoryListProps {
  sessions: SpeakingSession[];
  onSelectSession?: (session: SpeakingSession) => void;
}

export const SessionHistoryList: React.FC<SessionHistoryListProps> = ({
  sessions,
  onSelectSession,
}) => {
  const { colors } = useTheme();
  const router = useRouter();

  if (!sessions || sessions.length === 0) {
    return null;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return 'chatbubble-ellipses-outline';
      case 'simulator':
        return 'speedometer-outline';
      case 'roleplay':
        return 'theater-masks-outline';
      case 'workout':
        return 'barbell-outline';
      default:
        return 'mic-outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'call':
        return '1-on-1 Call';
      case 'simulator':
        return '60s Challenge';
      case 'roleplay':
        return 'Roleplay';
      case 'workout':
        return '10m Workout';
      default:
        return 'Speaking Practice';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        RECENT PRACTICE SESSIONS ({sessions.length})
      </Text>

      <View style={styles.list}>
        {sessions.map((session) => (
          <TouchableOpacity
            key={session.id}
            onPress={() => {
              if (onSelectSession) {
                onSelectSession(session);
              } else {
                router.push(`/session/${session.id}`);
              }
            }}
            activeOpacity={0.75}
            style={[styles.itemCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
            accessibilityRole="button"
            accessibilityLabel={`${getTypeLabel(session.type)} on ${formatSessionDate(session.date)}`}
          >
            <View style={styles.topRow}>
              <View style={styles.typeRow}>
                <Ionicons
                  name={getTypeIcon(session.type) as any}
                  size={16}
                  color={colors.primaryLight}
                />
                <Text style={[styles.typeText, { color: colors.text }]}>
                  {getTypeLabel(session.type)}
                </Text>
              </View>

              <Badge
                label={`Band ${session.estimatedIeltsScore.toFixed(1)}`}
                variant="primary"
                size="small"
              />
            </View>

            <View style={styles.metaRow}>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {formatSessionDate(session.date)}
              </Text>
              <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {formatDuration(session.durationSeconds)}
              </Text>
              <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {session.wpm} WPM
              </Text>
              <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
              <Text style={[styles.metaText, { color: session.fillerCount > 3 ? colors.warning : colors.success }]}>
                {session.fillerCount} fillers
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
  },
  list: {
    gap: Spacing.sm,
  },
  itemCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    minHeight: APP_CONFIG.MIN_TOUCH_TARGET_SIZE,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
