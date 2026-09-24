import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { AnalyticsSummary, ScoreTrendPoint, FillerBreakdown } from '../types/analytics';
import { calculateStreak, buildWeeklyActivity, formatSessionDate } from '../utils/dates';

export function useAnalytics(): { analytics: AnalyticsSummary; hasData: boolean } {
  const sessions = useAppStore((s) => s.sessions);
  const dailyGoalMinutes = useAppStore((s) => s.settings.dailyGoalMinutes);

  const analytics = useMemo<AnalyticsSummary>(() => {
    if (!sessions || sessions.length === 0) {
      return {
        totalSpeakingSeconds: 0,
        totalSessions: 0,
        averageWpm: 0,
        averageFillerRate: 0,
        averageConfidence: 0,
        averageGrammarScore: 0,
        latestEstimatedIelts: null,
        ieltsTrend: [],
        wpmTrend: [],
        fillerTrend: [],
        confidenceTrend: [],
        grammarTrend: [],
        speakingTimeTrend: [],
        fillerBreakdown: { um: 0, like: 0, actually: 0, youKnow: 0, other: 0, total: 0 },
        weeklyActivity: buildWeeklyActivity([], dailyGoalMinutes),
        streak: { currentStreak: 0, bestStreak: 0, lastPracticeDate: null, isActiveToday: false },
      };
    }

    const totalSpeakingSeconds = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
    const totalSessions = sessions.length;

    const totalWpm = sessions.reduce((acc, s) => acc + (s.wpm || 0), 0);
    const averageWpm = Math.round(totalWpm / totalSessions);

    const totalFillerRate = sessions.reduce((acc, s) => acc + (s.fillerRate || 0), 0);
    const averageFillerRate = Number((totalFillerRate / totalSessions).toFixed(1));

    const totalConfidence = sessions.reduce((acc, s) => acc + (s.confidenceScore || 0), 0);
    const averageConfidence = Math.round(totalConfidence / totalSessions);

    const totalGrammar = sessions.reduce((acc, s) => acc + (s.grammarScore || 0), 0);
    const averageGrammarScore = Math.round(totalGrammar / totalSessions);

    // Latest session IELTS
    const latestEstimatedIelts = sessions[0]?.estimatedIeltsScore ?? null;

    // Build trend series (chronological order, max 10 points)
    const chronologicalSessions = [...sessions].reverse().slice(-10);

    const ieltsTrend: ScoreTrendPoint[] = chronologicalSessions.map((s) => ({
      date: formatSessionDate(s.date).split(',')[0],
      value: s.estimatedIeltsScore,
      sessionId: s.id,
    }));

    const wpmTrend: ScoreTrendPoint[] = chronologicalSessions.map((s) => ({
      date: formatSessionDate(s.date).split(',')[0],
      value: s.wpm,
      sessionId: s.id,
    }));

    const fillerTrend: ScoreTrendPoint[] = chronologicalSessions.map((s) => ({
      date: formatSessionDate(s.date).split(',')[0],
      value: s.fillerRate,
      sessionId: s.id,
    }));

    const confidenceTrend: ScoreTrendPoint[] = chronologicalSessions.map((s) => ({
      date: formatSessionDate(s.date).split(',')[0],
      value: s.confidenceScore,
      sessionId: s.id,
    }));

    const grammarTrend: ScoreTrendPoint[] = chronologicalSessions.map((s) => ({
      date: formatSessionDate(s.date).split(',')[0],
      value: s.grammarScore,
      sessionId: s.id,
    }));

    const speakingTimeTrend: ScoreTrendPoint[] = chronologicalSessions.map((s) => ({
      date: formatSessionDate(s.date).split(',')[0],
      value: Math.round((s.durationSeconds / 60) * 10) / 10,
      sessionId: s.id,
    }));

    // Aggregate filler breakdown
    const fillerBreakdown: FillerBreakdown = {
      um: 0,
      like: 0,
      actually: 0,
      youKnow: 0,
      other: 0,
      total: 0,
    };

    sessions.forEach((s) => {
      s.transcript?.forEach((t) => {
        if (t.sender === 'sarah' && t.detectedFillers) {
          t.detectedFillers.forEach((f) => {
            const clean = f.toLowerCase();
            if (clean === 'um' || clean === 'uh') fillerBreakdown.um++;
            else if (clean === 'like') fillerBreakdown.like++;
            else if (clean === 'actually') fillerBreakdown.actually++;
            else if (clean === 'you know' || clean === 'i mean') fillerBreakdown.youKnow++;
            else fillerBreakdown.other++;
            fillerBreakdown.total++;
          });
        }
      });
    });

    const weeklyActivity = buildWeeklyActivity(sessions, dailyGoalMinutes);
    const streak = calculateStreak(sessions);

    return {
      totalSpeakingSeconds,
      totalSessions,
      averageWpm,
      averageFillerRate,
      averageConfidence,
      averageGrammarScore,
      latestEstimatedIelts,
      ieltsTrend,
      wpmTrend,
      fillerTrend,
      confidenceTrend,
      grammarTrend,
      speakingTimeTrend,
      fillerBreakdown,
      weeklyActivity,
      streak,
    };
  }, [sessions, dailyGoalMinutes]);

  const hasData = sessions.length > 0;

  return {
    analytics,
    hasData,
  };
}
