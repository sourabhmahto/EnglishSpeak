import { DailyActivityPoint, DailyStreakInfo } from '../types/analytics';
import { SpeakingSession } from '../types/session';

/**
 * Returns YYYY-MM-DD for a given Date or timestamp
 */
export function toDateKey(date: Date | string | number): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates current streak, best streak, and whether today's practice is completed.
 * Only meaningful practice counts (e.g. sessions > 10 seconds or completed workouts).
 */
export function calculateStreak(sessions: SpeakingSession[]): DailyStreakInfo {
  if (!sessions || sessions.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastPracticeDate: null,
      isActiveToday: false,
    };
  }

  // Filter valid sessions with meaningful duration (> 10s)
  const validSessions = sessions.filter((s) => s.durationSeconds >= 10);
  if (validSessions.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastPracticeDate: null,
      isActiveToday: false,
    };
  }

  // Get unique practice dates sorted descending
  const dateSet = new Set<string>();
  validSessions.forEach((s) => {
    dateSet.add(toDateKey(s.date));
  });

  const sortedDates = Array.from(dateSet).sort((a, b) => (a < b ? 1 : -1));
  const todayKey = toDateKey(new Date());

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  const isActiveToday = sortedDates.includes(todayKey);
  const mostRecentDate = sortedDates[0];

  // If last practice was before yesterday, current streak is broken (0 if not active today)
  if (!isActiveToday && mostRecentDate !== yesterdayKey) {
    return {
      currentStreak: 0,
      bestStreak: calculateBestHistoricalStreak(sortedDates),
      lastPracticeDate: mostRecentDate,
      isActiveToday: false,
    };
  }

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = isActiveToday ? new Date() : yesterday;

  while (true) {
    const key = toDateKey(checkDate);
    if (dateSet.has(key)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const bestStreak = Math.max(currentStreak, calculateBestHistoricalStreak(sortedDates));

  return {
    currentStreak,
    bestStreak,
    lastPracticeDate: mostRecentDate,
    isActiveToday,
  };
}

function calculateBestHistoricalStreak(sortedDateKeysDesc: string[]): number {
  if (sortedDateKeysDesc.length === 0) return 0;
  if (sortedDateKeysDesc.length === 1) return 1;

  let best = 1;
  let current = 1;

  for (let i = 0; i < sortedDateKeysDesc.length - 1; i++) {
    const d1 = new Date(sortedDateKeysDesc[i]);
    const d2 = new Date(sortedDateKeysDesc[i + 1]);
    const diffTime = Math.abs(d1.getTime() - d2.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }

  return best;
}

/**
 * Builds a 7-day activity map for the current week (Mon-Sun or past 7 days)
 */
export function buildWeeklyActivity(sessions: SpeakingSession[], dailyGoalMinutes: number = 10): DailyActivityPoint[] {
  const result: DailyActivityPoint[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Last 7 days from 6 days ago up to today
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - i);
    const dateKey = toDateKey(targetDate);
    const dayName = dayNames[targetDate.getDay()];

    const matchingSessions = sessions.filter((s) => toDateKey(s.date) === dateKey);
    const totalSeconds = matchingSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
    const minutes = Math.round((totalSeconds / 60) * 10) / 10;

    result.push({
      dayName,
      dateString: dateKey,
      minutesPracticed: minutes,
      sessionCount: matchingSessions.length,
      completedGoal: minutes >= dailyGoalMinutes,
    });
  }

  return result;
}

/**
 * Formats a date string for display (e.g., "Today, 10:30 AM", "Yesterday", "Sep 24, 2026")
 */
export function formatSessionDate(dateString: string): string {
  const d = new Date(dateString);
  const now = new Date();

  const isToday = toDateKey(d) === toDateKey(now);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = toDateKey(d) === toDateKey(yesterday);

  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;

  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
}
