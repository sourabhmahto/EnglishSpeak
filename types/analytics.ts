export interface ScoreTrendPoint {
  date: string; // formatted e.g. "Sep 24" or ISO
  value: number;
  label?: string;
  sessionId: string;
}

export interface FillerBreakdown {
  um: number;
  like: number;
  actually: number;
  youKnow: number;
  other: number;
  total: number;
}

export interface DailyActivityPoint {
  dayName: string; // e.g. "Mon", "Tue"
  dateString: string; // "YYYY-MM-DD"
  minutesPracticed: number;
  sessionCount: number;
  completedGoal: boolean;
}

export interface DailyStreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate: string | null; // ISO Date YYYY-MM-DD
  isActiveToday: boolean;
}

export interface AnalyticsSummary {
  totalSpeakingSeconds: number;
  totalSessions: number;
  averageWpm: number;
  averageFillerRate: number;
  averageConfidence: number;
  averageGrammarScore: number;
  latestEstimatedIelts: number | null;
  ieltsTrend: ScoreTrendPoint[];
  wpmTrend: ScoreTrendPoint[];
  fillerTrend: ScoreTrendPoint[];
  confidenceTrend: ScoreTrendPoint[];
  grammarTrend: ScoreTrendPoint[];
  speakingTimeTrend: ScoreTrendPoint[];
  fillerBreakdown: FillerBreakdown;
  weeklyActivity: DailyActivityPoint[];
  streak: DailyStreakInfo;
}
