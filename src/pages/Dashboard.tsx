import { ArrowRight, BookOpen, Calendar, Heart, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChartBar } from '../components/ui/ChartBar';
import { StatsCard } from '../components/ui/StatsCard';
import { useAchievements } from '../hooks/useAchievements';
import { useCommunityStories } from '../hooks/useCommunityStories';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useSelfCareStats } from '../hooks/useSelfCareStats';

export default function Dashboard() {
  const { metrics, loading, error } = useDashboardMetrics();
  const screeningCountThisWeek = useMemo(
    () => metrics?.last7Days?.reduce((sum, d) => sum + d.results.length, 0) ?? 0,
    [metrics]
  );
  const { stats: activityStats, loading: activityLoading } = useSelfCareStats(screeningCountThisWeek);
  const { stories: communityStories, loading: storiesLoading } = useCommunityStories(3);
  const { achievements: dbAchievements, loading: achievementsLoading } = useAchievements();
  const [showAllHistory, setShowAllHistory] = useState(false);

  // convert last7Days into chart-compatible stressData
  // Use raw score directly: high bar = high stress (matches screening page scale 1–5)
  const moodData = useMemo(() => {
    if (!metrics) return [];
    return metrics.last7Days.map(day => {
      const score = day.results.length > 0 ? day.averageScore : 0;
      // Color matches screening page: <=2 green, <=3.5 amber, >3.5 red
      const colorClass =
        score === 0
          ? 'bg-gray-200'
          : score <= 2
          ? 'bg-emerald-400'
          : score <= 3.5
          ? 'bg-amber-400'
          : 'bg-rose-500';
      return {
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: score,
        colorClass,
        hasData: day.results.length > 0,
      };
    });
  }, [metrics]);

  // Calculate stress level distribution for pie chart
  const stressDistribution = useMemo(() => {
    if (!metrics) return { low: 0, moderate: 0, high: 0 };
    const low = metrics.last7Days.reduce((sum, d) => sum + d.counts.Low, 0);
    const moderate = metrics.last7Days.reduce((sum, d) => sum + d.counts.Moderate, 0);
    const high = metrics.last7Days.reduce((sum, d) => sum + d.counts.High, 0);
    return { low, moderate, high };
  }, [metrics]);

  const totalScreenings = stressDistribution.low + stressDistribution.moderate + stressDistribution.high;

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
    // Find first and last days WITH actual data
    const withData = metrics.last7Days.filter(d => d.results.length > 0);
    if (withData.length < 2) return '—';
    const first = withData[0].averageScore;
    const last = withData[withData.length - 1].averageScore;
    // Lower score = less stress = Improving; higher score = more stress = Declining
    return last <= first ? 'Improving' : 'Declining';
  }, [metrics]);

  const screeningHistory = useMemo(() => {
    if (!metrics) return [];
    const ordered = [...metrics.last7Days].filter(d => d.results.length > 0).reverse();
    return ordered.map((day, idx) => {
      const prev = ordered[idx + 1];
      // score 1-5: low = calm/well, high = stressed
      // trend: score going DOWN = improving (good = green), score going UP = worsening (bad = red)
      const trend = day.averageScore && prev?.averageScore
        ? day.averageScore <= prev.averageScore
          ? 'down'   // score fell = improving
          : 'up'     // score rose = worsening
        : 'neutral';
      // Stage labels match useScreeningFlow: <=2 Low, <=3.5 Moderate, >3.5 High
      const stage =
        day.averageScore <= 2
          ? 'Low Stress'
          : day.averageScore <= 3.5
          ? 'Moderate Stress'
          : 'High Stress';
      return {
        date: day.date,
        stage,
        score: day.averageScore,
        trend,
      };
    });
  }, [metrics]);

  // Limit screening history to 4 items initially
  const displayedHistory = useMemo(() => {
    if (showAllHistory) return screeningHistory;
    return screeningHistory.slice(0, 4);
  }, [screeningHistory, showAllHistory]);

  // Get recommendation based on stress trend
  const recommendation = useMemo(() => {
    if (!metrics || metrics.totalResults === 0) {
      return {
        title: 'Start Your Journey',
        description: 'Take your first screening to get personalized recommendations.',
        link: '/screening',
        icon: Sparkles,
      };
    }
    // High stress = LOW score (<=2 is Low Stress zone in screening scale)
    // averageScore <= 2 means high stress on the screening scale
    if (moodTrend === 'Declining' || (metrics.currentMonth.averageScore > 0 && metrics.currentMonth.averageScore > 3.5)) {
      return {
        title: 'Try Emotional Care',
        description: 'Explore techniques to help manage stress and improve wellbeing.',
        link: '/emotional-care',
        icon: Heart,
      };
    }
    return {
      title: 'Continue Your Progress',
      description: 'Keep up the great work! Track your progress and celebrate wins.',
      link: '/self-care',
      icon: TrendingUp,
    };
  }, [metrics, moodTrend]);

  // Calculate achievements - use DB values if available, otherwise fallback to local calculation
  const achieved7Day = dbAchievements?.streak7Day ?? currentStreak >= 7;
  const achievedJournal = dbAchievements?.journalWarrior ?? activityStats.journalEntryCount >= 5;
  const achievedGratitude = dbAchievements?.gratitudeChampion ?? activityStats.gratitudeCount >= 20;
  const achievedWins = dbAchievements?.activityMaster ?? activityStats.winsCount >= 10;
  
  const achievements = [
    { icon: '📚', title: '7-Day Screener', description: 'Took screening 7 days in a row', unlocked: achieved7Day },
    { icon: '💪', title: 'Activity Master', description: 'Logged 10 small wins', unlocked: achievedWins },
    { icon: '✍️', title: 'Journal Warrior', description: 'Wrote 5 journal entries', unlocked: achievedJournal },
    { icon: '🌟', title: 'Gratitude Champion', description: 'Added 20 gratitude items', unlocked: achievedGratitude },
  ];
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Quick actions
  const quickActions = [
    { label: 'Take Screening', icon: BookOpen, link: '/screening', color: 'from-mint-500 to-sky-500' },
    { label: 'Journal', icon: Sparkles, link: '/self-care', color: 'from-orange-400 to-pink-400' },
    { label: 'Community', icon: Users, link: '/community', color: 'from-sky-500 to-blue-500' },
    { label: 'Resources', icon: Heart, link: '/resources', color: 'from-rose-400 to-pink-400' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.link}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium hover:shadow-softLg transition-all transform hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Wellness Dashboard</h1>
          <p className="text-gray-600">Track your progress and celebrate how far you've come.</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 mb-6 text-gray-400">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span className="text-sm">Loading your dashboard…</span>
          </div>
        )}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">⚠️ Could not load data: {error}</p>
          </div>
        )}
        {/* First-time user CTA */}
        {!loading && metrics && metrics.totalResults === 0 && (
          <div className="mb-8 p-8 bg-gradient-to-r from-mint-50 to-sky-50 border-2 border-dashed border-mint-300 rounded-2xl text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Wellness Journey</h3>
            <p className="text-gray-600 mb-6">Take your first screening to see your mood trends, streaks, and personalized insights here.</p>
            <Link
              to="/screening"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all hover:scale-105"
            >
              Take First Screening
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Avg Stress Score"
            icon={<Heart className="w-5 h-5 text-pink-500" />}
            value={weeklyAvg > 0 ? `${weeklyAvg}/5` : '—'}
            subtitle={!loading && weeklyAvg > 0 ? (weeklyAvg <= 2 ? '🟢 Low stress — you\'re doing great!' : weeklyAvg <= 3.5 ? '🟡 Moderate — take some care time' : '🔴 High stress — consider support') : 'Take a screening to see'}
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
            subtitle={!loading && (moodTrend === 'Improving' ? '📉 Stress is decreasing — great work!' : moodTrend === 'Declining' ? '📈 Stress is increasing — try some care' : 'No trend data yet')}
            loading={loading}
          />
        </div>

        {/* Stress Level Chart */}
        <section className="bg-white rounded-2xl p-8 shadow-soft mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Stress Level (Last 7 Days)</h2>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-emerald-400"></span>Low</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-amber-400"></span>Moderate</span>
              <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-rose-500"></span>High</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Taller bar = higher stress score (1–5 scale, same as screening)</p>
          <div className="flex items-end justify-between gap-2 h-40">
            {moodData.length === 0 ? (
              <p className="mx-auto text-gray-500">No stress data available yet.</p>
            ) : (
              moodData.map((data, idx) => {
                const height = (data.value / maxMood) * 100;
                return <ChartBar key={idx} height={height} label={data.day} colorClass={data.colorClass} score={data.hasData ? data.value : undefined} />;
              })
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {moodTrend === 'Improving'
              ? '📉 Stress is trending downward — keep up the great self-care!'
              : moodTrend === 'Declining'
              ? '📈 Stress is rising — consider trying Emotional Care activities or a new screening.'
              : 'Take a screening to start tracking your stress trend here.'}
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Screening History */}
          <section className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Screening History</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {screeningHistory.length === 0 ? (
                <p className="text-center text-gray-500">No screening history available.</p>
              ) : (
                displayedHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className={`font-semibold ${
                        item.stage === 'Low Stress' ? 'text-emerald-700' :
                        item.stage === 'Moderate Stress' ? 'text-amber-700' : 'text-rose-700'
                      }`}>{item.stage}</p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.score}/5</p>
                      {item.trend !== 'neutral' && (
                        <p className={`text-xs font-medium ${
                          // down = score decreased = stress dropped = GOOD (green)
                          // up = score increased = stress rose = BAD (red)
                          item.trend === 'down' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {item.trend === 'down' ? '↓ Improving' : '↑ Worsening'}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {screeningHistory.length > 4 && (
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="mt-4 w-full py-2 text-center text-mint-600 font-medium hover:text-mint-700 transition-colors"
              >
                {showAllHistory ? 'Show Less' : `View All (${screeningHistory.length})`}
              </button>
            )}
            <Link
              to="/screening"
              className="mt-4 w-full block px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all text-center"
            >
              Take New Screening
            </Link>
          </section>

          {/* Stress Level Distribution */}
          <section className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Stress Level Distribution</h2>
            {totalScreenings === 0 ? (
              <p className="text-center text-gray-500">No screenings to display.</p>
            ) : (
              <>
                {/* Simple pie chart visualization */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-40 h-40">
                      {/* Low Stress - Green */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeDasharray={`${(stressDistribution.low / totalScreenings) * 251.2} 251.2`}
                        strokeDashoffset="0"
                      />
                      {/* Moderate Stress - Yellow */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="20"
                        strokeDasharray={`${(stressDistribution.moderate / totalScreenings) * 251.2} 251.2`}
                        strokeDashoffset={`-${(stressDistribution.low / totalScreenings) * 251.2}`}
                      />
                      {/* High Stress - Red */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeDasharray={`${(stressDistribution.high / totalScreenings) * 251.2} 251.2`}
                        strokeDashoffset={`-${((stressDistribution.low + stressDistribution.moderate) / totalScreenings) * 251.2}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{totalScreenings}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-600">Low ({stressDistribution.low})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-gray-600">Moderate ({stressDistribution.moderate})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">High ({stressDistribution.high})</span>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Activity Stats */}
        <section className="bg-white rounded-2xl p-8 shadow-soft mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">This Week's Activity</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { activity: 'Screenings Completed', count: activityStats.screeningCount, icon: '✓', color: 'text-mint-600' },
              { activity: 'Journal Entries', count: activityStats.journalEntryCount, icon: '✍️', color: 'text-orange-500' },
              { activity: 'Gratitude Items', count: activityStats.gratitudeCount, icon: '⭐', color: 'text-yellow-500' },
              { activity: 'Small Wins', count: activityStats.winsCount, icon: '🎯', color: 'text-pink-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-700 font-medium">{item.activity}</span>
                </div>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {activityLoading ? '—' : item.count}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Community Stories Preview */}
        <section className="bg-gradient-to-r from-mint-50 to-sky-50 rounded-2xl p-8 border border-mint-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Community Stories</h2>
            <Link to="/community" className="flex items-center gap-1 text-mint-600 font-medium hover:text-mint-700">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {storiesLoading ? (
            <p className="text-center text-gray-500">Loading stories...</p>
          ) : communityStories.length === 0 ? (
            <p className="text-center text-gray-500">No stories yet. Be the first to share!</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {communityStories.map((story) => (
                <div key={story.id} className="bg-white rounded-xl p-5 shadow-soft hover:shadow-softLg transition-all">
                  <p className="text-gray-700 mb-4 line-clamp-3">"{story.excerpt}"</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Anonymous</span>
                    <span>❤️ {story.reactions}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link
              to="/community"
              className="inline-block px-6 py-3 rounded-lg bg-white text-mint-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              Share Your Story
            </Link>
          </div>
        </section>

        {/* Personalized Recommendation */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-soft">
              {(() => {
                const Icon = recommendation.icon;
                return <Icon className="w-6 h-6 text-indigo-600" />;
              })()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{recommendation.title}</h3>
              <p className="text-gray-700 mb-4">{recommendation.description}</p>
              <Link
                to={recommendation.link}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Achievements - Now connected to DB */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Achievements</h2>
          {achievementsLoading ? (
            <p className="text-center text-gray-500">Loading achievements...</p>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-6 shadow-soft text-center hover:shadow-softLg transition-all duration-300 cursor-default group border-2 ${
                    achievement.unlocked ? 'border-mint-300' : 'border-gray-100'
                  }`}
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{achievement.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.unlocked && (
                    <p className="text-xs font-semibold text-mint-600 mt-2">Unlocked ✓</p>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <p className="text-gray-900">
              <strong>Great progress!</strong> You've earned {unlockedCount} out of {achievements.length} achievements. 
              {dbAchievements ? ' Your achievements are saved to your profile.' : ' Keep going—you\'re building momentum!'}
            </p>
          </div>
        </section>

        {/* Wellness Summary */}
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
          <Link
            to="/resources"
            className="inline-block px-6 py-3 rounded-lg bg-white text-mint-600 font-semibold hover:bg-gray-50 transition-colors"
          >
            Explore More Resources
          </Link>
        </section>
      </div>
    </div>
  );
}
