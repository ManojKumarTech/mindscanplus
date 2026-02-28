import { Calendar, Heart, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { ChartBar } from '../components/ui/ChartBar';
import { StatsCard } from '../components/ui/StatsCard';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

export default function Dashboard() {
  const { metrics, loading, error } = useDashboardMetrics();

  // convert last7Days into chart-compatible moodData
  const moodData = useMemo(() => {
    if (!metrics) return [];
    return metrics.last7Days.map(day => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: day.averageScore,
    }));
  }, [metrics]);

  const maxMood = 5;

  const weeklyAvg = useMemo(() => {
    if (!metrics) return 0;
    const scores = metrics.last7Days.map(d => d.averageScore);
    if (scores.length === 0) return 0;
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  }, [metrics]);

  const currentStreak = useMemo(() => {
    if (!metrics) return 0;
    const sorted = [...metrics.last7Days].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    let streak = 0;
    for (const day of sorted) {
      if (day.results.length > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [metrics]);

  const moodTrend = useMemo(() => {
    if (!metrics || metrics.last7Days.length < 2) return '—';
    const first = metrics.last7Days[0].averageScore;
    const last = metrics.last7Days[metrics.last7Days.length - 1].averageScore;
    return last >= first ? 'Improving' : 'Declining';
  }, [metrics]);

  const screeningHistory = useMemo(() => {
    if (!metrics) return [];
    const ordered = [...metrics.last7Days].reverse();
    return ordered.map((day, idx) => {
      const prev = ordered[idx + 1];
      const trend = day.averageScore
        ? day.averageScore >= (prev?.averageScore || 0)
          ? 'up'
          : 'down'
        : 'up';
      return {
        date: day.date,
        stage:
          day.averageScore <= 2
            ? 'High Stress'
            : day.averageScore <= 3
            ? 'Moderate Stress'
            : 'Low Stress',
        score: day.averageScore,
        trend,
      };
    });
  }, [metrics]);

  const achievements = [
    { icon: '📚', title: '7-Day Screener', description: 'Took screening 7 days in a row' },
    { icon: '💪', title: 'Activity Master', description: 'Completed 10 reset activities' },
    { icon: '✍️', title: 'Journal Warrior', description: 'Wrote 5 journal entries' },
    { icon: '🌟', title: 'Gratitude Champion', description: 'Added 20 gratitude items' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Wellness Dashboard</h1>
          <p className="text-gray-600">Track your progress and celebrate how far you've come.</p>
        </div>

        {loading && (
          <p className="text-center text-gray-500 mb-4">Loading dashboard data…</p>
        )}
        {error && (
          <p className="text-center text-red-500 mb-4">Error: {error}</p>
        )}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Weekly Average Mood"
            icon={<Heart className="w-5 h-5 text-pink-500" />}
            value={weeklyAvg}
            subtitle={!loading && 'based on last 7 days'}
            loading={loading}
          />

          <StatsCard
            title="Current Streak"
            icon={<TrendingUp className="w-5 h-5 text-mint-600" />}
            value={currentStreak}
            subtitle="Check-in days in a row"
            loading={loading}
          />

          <StatsCard
            title="Mood Trend"
            icon={<Calendar className="w-5 h-5 text-sky-600" />}
            value={moodTrend}
            subtitle={!loading && (moodTrend === 'Improving' ? "You're doing better this week" : "Your mood is declining")}
            loading={loading}
          />
        </div>

        <section className="bg-white rounded-2xl p-8 shadow-soft mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mood Trend (Last 7 Days)</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {moodData.length === 0 ? (
              <p className="mx-auto text-gray-500">No mood data available yet.</p>
            ) : (
              moodData.map((data, idx) => {
                const height = (data.value / maxMood) * 100;
                return <ChartBar key={idx} height={height} label={data.day} />;
              })
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Your mood is trending upward. Keep up the self-care activities—they're working!
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <section className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Screening History</h2>
            <div className="space-y-4">
              {screeningHistory.length === 0 ? (
                <p className="text-center text-gray-500">No screening history available.</p>
              ) : (
                screeningHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{item.stage}</p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.score}</p>
                      <p className={`text-xs font-medium ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.trend === 'up' ? '↑' : '↓'} Trend
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => (window.location.href = '/screening')}
              className="mt-6 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all"
            >
              Take New Screening
            </button>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">This Week's Activity</h2>
            <div className="space-y-4">
              {[
                { activity: 'Screening Completed', count: 3, icon: '✓' },
                { activity: 'Activities Done', count: 8, icon: '🎯' },
                { activity: 'Journal Entries', count: 5, icon: '✍️' },
                { activity: 'Gratitude Items', count: 12, icon: '⭐' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-700 font-medium">{item.activity}</span>
                  </div>
                  <p className="text-2xl font-bold text-mint-600">{item.count}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Achievements</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-soft text-center hover:shadow-softLg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{achievement.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <p className="text-gray-900">
              <strong>Great progress!</strong> You've earned 4 out of 12 possible achievements. Keep going—you're building momentum!
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-mint-100 to-sky-100 rounded-2xl p-8 border border-mint-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wellness Summary</h2>
          <div className="space-y-3 mb-6">
            {metrics ? (
              <>
                <p className="text-gray-800">
                  You're showing consistent progress in your mental wellbeing journey. Your mood this month averages{' '}
                  <strong>{metrics.currentMonth.averageScore}</strong>, and you've taken{' '}
                  <strong>{metrics.totalResults}</strong> screenings overall.
                </p>
                <p className="text-gray-800">
                  The activities you're completing are having a real impact. Keep using the reset techniques, journaling regularly, and leaning on your
                  gratitude practice. These habits are building resilience.
                </p>
                <p className="text-gray-800 font-semibold">
                  Remember: Progress isn't always linear, and that's completely okay. What matters is that you're showing up for yourself. Keep going.
                </p>
              </>
            ) : (
              <p className="text-gray-800">Loading your personalized summary...</p>
            )}
          </div>
          <button
            onClick={() => (window.location.href = '/resources')}
            className="px-6 py-3 rounded-lg bg-white text-mint-600 font-semibold hover:bg-gray-50 transition-colors"
          >
            Explore More Resources
          </button>
        </section>
      </div>
    </div>
  );
}