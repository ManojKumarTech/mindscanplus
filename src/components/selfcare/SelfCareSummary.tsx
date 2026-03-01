import { CheckCircle2, Heart, Zap } from 'lucide-react';
import type { ChallengeItem } from '../../services/selfCareService';

interface Props {
  gratitudeCount: number;
  winsCount: number;
  challengesProgress: ChallengeItem[];
  hasJournalEntry: boolean;
  planCompletionCount: number;
  planTotalItems: number;
}

export default function SelfCareSummary({
  gratitudeCount,
  winsCount,
  challengesProgress,
  hasJournalEntry,
  planCompletionCount,
  planTotalItems,
}: Props) {
  const completedChallenges = challengesProgress.filter(c => c.days > 0).length;
  const planProgress = planTotalItems > 0 ? Math.round((planCompletionCount / planTotalItems) * 100) : 0;

  return (
    <div className="grid md:grid-cols-5 gap-4">
      {/* Gratitude Count */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">Gratitudes</span>
          <Heart className="w-4 h-4 text-yellow-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{gratitudeCount}</p>
        <p className="text-xs text-gray-500">today</p>
      </div>

      {/* Wins Count */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">Wins</span>
          <CheckCircle2 className="w-4 h-4 text-mint-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{winsCount}</p>
        <p className="text-xs text-gray-500">this week</p>
      </div>

      {/* Journal Status */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">Journal</span>
          <span className={`w-2 h-2 rounded-full ${hasJournalEntry ? 'bg-green-500' : 'bg-gray-300'}`}></span>
        </div>
        <p className="text-lg font-bold text-gray-900">{hasJournalEntry ? 'Done' : 'Pending'}</p>
        <p className="text-xs text-gray-500">today</p>
      </div>

      {/* Challenges Progress */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">Challenges</span>
          <Zap className="w-4 h-4 text-orange-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900">{completedChallenges}/{challengesProgress.length}</p>
        <p className="text-xs text-gray-500">active</p>
      </div>

      {/* Plan Progress */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">Plan</span>
          <span className="text-xs font-bold text-mint-600">{planProgress}%</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{planCompletionCount}/{planTotalItems}</p>
        <p className="text-xs text-gray-500">completed</p>
      </div>
    </div>
  );
}
