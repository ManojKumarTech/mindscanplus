import GratitudeList from '../components/selfcare/GratitudeList';
import JournalSection from '../components/selfcare/JournalSection';
import SelfCarePlan from '../components/selfcare/SelfCarePlan';
import WinsTracker from '../components/selfcare/WinsTracker';
import { useSelfCareData } from '../hooks/useSelfCareData';

// page component
export default function SelfCare() {

  // custom hook handles subscriptions, state and actions
  const {
    data,
    loading,
    savingJournal,
    actions,
  } = useSelfCareData();

  const selfCarePlan = [
    {
      category: 'Physical',
      items: ['Exercise 3x per week', 'Sleep 7-8 hours', 'Eat nutritious meals'],
      color: 'from-orange-400 to-pink-400',
      bgColor: 'bg-orange-50',
    },
    {
      category: 'Mental',
      items: ['Meditation 10 minutes daily', 'Read for pleasure', 'Take breaks from screens'],
      color: 'from-sky-400 to-blue-400',
      bgColor: 'bg-sky-50',
    },
    {
      category: 'Social',
      items: ['Call a friend weekly', 'Spend time with loved ones', 'Join a community'],
      color: 'from-mint-400 to-teal-400',
      bgColor: 'bg-mint-50',
    },
    {
      category: 'Emotional',
      items: ['Journal thoughts', 'Practice self-compassion', 'Celebrate small wins'],
      color: 'from-rose-400 to-pink-400',
      bgColor: 'bg-rose-50',
    },
  ];



  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Self-Care & Growth</h1>
          <p className="text-gray-600">
            Build sustainable habits and celebrate your progress. You deserve this care.
          </p>
          {loading && (
            <p className="text-sm text-gray-500 mt-2">Synchronizing your data…</p>
          )}
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <GratitudeList
            items={data.gratitudeItems}
            loading={loading}
            onAdd={actions.addNewGratitude}
            onRemove={actions.removeGratitude}
          />

          <WinsTracker
            wins={data.wins}
            loading={loading}
            onAdd={actions.addNewWin}
            onRemove={actions.removeWin}
          />
        </div>

        <JournalSection
          initialText={data.journalText}
          lastUpdatedAt={data.lastJournalTimestamp}
          canEdit={data.canEditJournal}
          saving={savingJournal}
          onSave={actions.saveJournal}
        />

        <SelfCarePlan
          plans={selfCarePlan}
          progress={data.planProgress}
          onToggle={actions.togglePlanItem}
        />
      </div>
    </div>
  );
}
