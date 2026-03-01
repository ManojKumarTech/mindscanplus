import type { ChallengeItem } from '../../services/selfCareService';

interface Props {
  challenges: ChallengeItem[];
  loading: boolean;
  onIncrement: (challenge: ChallengeItem) => void;
  editStatus: Record<string, boolean>;
  updatingIds: string[];
}

export default function WeeklyChallenges({
  challenges,
  loading,
  onIncrement,
  editStatus,
  updatingIds,
}: Props) {
  return (
    <section aria-label="Weekly challenges">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Challenges</h2>
      {loading ? (
        <p className="text-sm text-gray-500 mb-4">Loading your challenges…</p>
      ) : null}
      <div className="grid md:grid-cols-3 gap-6">
        {challenges.map(challenge => {
          const todayEdited = editStatus[challenge.id];
          const updating = updatingIds.includes(challenge.id);
          const disabled = challenge.days >= challenge.totalDays || todayEdited || updating;
          return (
            <div
              key={challenge.id}
              className={`rounded-2xl p-6 bg-gradient-to-br ${challenge.color} border border-gray-200 hover:shadow-softLg transition-all`}
            >
              <h3 className="font-bold text-gray-900 mb-2">{challenge.title}</h3>
              <p className="text-gray-700 text-sm mb-4">{challenge.description}</p>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-gray-600">Progress</p>
                  <p className="text-xs font-semibold text-gray-600">
                    {challenge.days}/{challenge.totalDays}
                  </p>
                </div>
                <div className="w-full h-2 rounded-full bg-white/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-mint-500 to-sky-500 transition-all"
                    style={{ width: `${(challenge.days / challenge.totalDays) * 100}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => onIncrement(challenge)}
                disabled={disabled}
                className="w-full px-4 py-2 rounded-lg bg-white/80 font-medium text-gray-900 hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating…' : 'Update Progress'}
              </button>
              {todayEdited && (
                <p className="text-xs text-yellow-600 mt-2">You can update again tomorrow.</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
