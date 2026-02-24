import { TrendingUp, Calendar, CheckCircle, Award, Heart } from 'lucide-react';

export default function Dashboard() {
  const moodData = [
    { day: 'Mon', value: 3.2 },
    { day: 'Tue', value: 3.5 },
    { day: 'Wed', value: 3.8 },
    { day: 'Thu', value: 3.6 },
    { day: 'Fri', value: 4.1 },
    { day: 'Sat', value: 4.3 },
    { day: 'Sun', value: 4.0 },
  ];

  const maxMood = 5;
  const currentStreak = 12;
  const screeningHistory = [
    {
      date: 'Today',
      stage: 'Moderate Stress',
      score: 3.4,
      trend: 'up',
    },
    {
      date: '7 days ago',
      stage: 'Moderate Stress',
      score: 2.8,
      trend: 'down',
    },
    {
      date: '14 days ago',
      stage: 'High Stress',
      score: 2.1,
      trend: 'down',
    },
    {
      date: '21 days ago',
      stage: 'High Stress',
      score: 1.9,
      trend: 'up',
    },
  ];

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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Weekly Average Mood</h3>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">4.07</p>
            <p className="text-sm text-gray-600">↑ 12% from last week</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Current Streak</h3>
              <TrendingUp className="w-5 h-5 text-mint-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{currentStreak}</p>
            <p className="text-sm text-gray-600">Check-in days in a row</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Mood Trend</h3>
              <Calendar className="w-5 h-5 text-sky-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">Improving</p>
            <p className="text-sm text-gray-600">You're doing better this week</p>
          </div>
        </div>

        <section className="bg-white rounded-2xl p-8 shadow-soft mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mood Trend (Last 7 Days)</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {moodData.map((data, idx) => {
              const height = (data.value / maxMood) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-mint-500 to-sky-500 transition-all duration-300 hover:shadow-soft"
                      style={{ height: `${height}px` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{data.day}</p>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Your mood is trending upward. Keep up the self-care activities—they're working!
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <section className="bg-white rounded-2xl p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Screening History</h2>
            <div className="space-y-4">
              {screeningHistory.map((item, idx) => (
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
              ))}
            </div>
            <button className="mt-6 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all">
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
            <p className="text-gray-800">
              You're showing consistent progress in your mental wellbeing journey. Your mood has improved by 12% this week, and you've maintained a
              12-day check-in streak—that's amazing dedication to your health.
            </p>
            <p className="text-gray-800">
              The activities you're completing are having a real impact. Keep using the reset techniques, journaling regularly, and leaning on your
              gratitude practice. These habits are building resilience.
            </p>
            <p className="text-gray-800 font-semibold">
              Remember: Progress isn't always linear, and that's completely okay. What matters is that you're showing up for yourself. Keep going.
            </p>
          </div>
          <button className="px-6 py-3 rounded-lg bg-white text-mint-600 font-semibold hover:bg-gray-50 transition-colors">
            Explore More Resources
          </button>
        </section>
      </div>
    </div>
  );
}