/**
 * Example: How to integrate SelfCareSummary into Dashboard
 * 
 * The new components are designed to be lightweight and dashboard-ready
 */

// ============================================================================
// EXAMPLE 1: Using SelfCareSummary Component in Dashboard
// ============================================================================

import SelfCareSummary from '../components/selfcare/SelfCareSummary';
import { useSelfCareSummary } from '../hooks/useSelfCareSummary';

export function DashboardExample1() {
  const {
    gratitudeCount,
    winsCount,
    hasJournalEntry,
    challengesProgress,
    planCompletionCount,
    loading,
  } = useSelfCareSummary();

  if (loading) {
    return <div>Loading self-care summary...</div>;
  }

  // Self-Care Plan has 4 categories × average 3 items = 12 items
  const totalPlanItems = 12;

  return (
    <SelfCareSummary
      gratitudeCount={gratitudeCount}
      winsCount={winsCount}
      challengesProgress={challengesProgress}
      hasJournalEntry={hasJournalEntry}
      planCompletionCount={planCompletionCount}
      planTotalItems={totalPlanItems}
    />
  );
}

// ============================================================================
// EXAMPLE 2: Simplified Widget Version
// ============================================================================

import { CheckCircle2, Heart } from 'lucide-react';
import { useSelfCareSummary } from '../hooks/useSelfCareSummary';

export function SelfCareQuickWidget() {
  const { gratitudeCount, winsCount, hasJournalEntry, loading } = useSelfCareSummary();

  if (loading) return null;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Self-Care</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">Gratitudes</span>
          </div>
          <span className="font-semibold text-gray-900">{gratitudeCount}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-mint-600" />
            <span className="text-gray-600">Wins</span>
          </div>
          <span className="font-semibold text-gray-900">{winsCount}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Journal</span>
          <span className={`inline-block w-2 h-2 rounded-full ${hasJournalEntry ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Full Integration in Dashboard
// ============================================================================

import { useSelfCareSummary } from '../hooks/useSelfCareSummary';
import StatsCard from '../components/ui/StatsCard';

export function DashboardFullExample() {
  const {
    gratitudeCount,
    winsCount,
    hasJournalEntry,
    challengesProgress,
    planCompletionCount,
    loading,
  } = useSelfCareSummary();

  if (loading) return <div>Loading...</div>;

  const completedChallenges = challengesProgress.filter(c => c.days > 0).length;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <StatsCard 
        title="Gratitudes" 
        value={gratitudeCount} 
        color="yellow" 
      />
      <StatsCard 
        title="Wins" 
        value={winsCount} 
        color="mint" 
      />
      <StatsCard 
        title="Challenges" 
        value={`${completedChallenges}/${challengesProgress.length}`}
        color="orange" 
      />
    </div>
  );
}

// ============================================================================
// NOTES
// ============================================================================
/*
 * Key Benefits of the New Approach:
 * 
 * 1. **Performance**: useSelfCareSummary is lightweight and only fetches counts
 * 2. **Real-time**: Uses Firestore snapshots so data updates instantly
 * 3. **Dashboard Ready**: No complex editing logic, just display metrics
 * 4. **Reusable**: Can be used in multiple places (dashboard, widgets, cards)
 * 5. **Type Safe**: Full TypeScript support
 * 
 * Comparison:
 * - useSelfCareData: Full featured, editing, all data - use for /self-care page
 * - useSelfCareSummary: Summary only, read-only - use for dashboard/widgets
 */
