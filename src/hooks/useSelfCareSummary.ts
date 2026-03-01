import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { ChallengeItem } from '../services/selfCareService';
import {
    watchChallenges,
    watchGratitudeItems,
    watchJournalEntries,
    watchPlanProgress,
    watchWins,
} from '../services/selfCareService';

/**
 * Lightweight hook for dashboard summaries
 * Only fetches counts and basic data, not full editing capabilities
 */
export function useSelfCareSummary() {
  const { user } = useAuth();

  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [winsCount, setWinsCount] = useState(0);
  const [hasJournalEntry, setHasJournalEntry] = useState(false);
  const [challengesProgress, setChallengesProgress] = useState<ChallengeItem[]>([]);
  const [planCompletionCount, setPlanCompletionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const nowDate = new Date();
  const todayStr = nowDate.toISOString().slice(0, 10);

  useEffect(() => {
    if (!user) {
      setGratitudeCount(0);
      setWinsCount(0);
      setHasJournalEntry(false);
      setChallengesProgress([]);
      setPlanCompletionCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribers: Array<() => void> = [];

    let initialized = {
      gratitude: false,
      wins: false,
      journal: false,
      challenges: false,
      planProgress: false,
    };
    const markInit = (key: keyof typeof initialized) => {
      initialized[key] = true;
      if (Object.values(initialized).every(v => v)) {
        setLoading(false);
      }
    };

    // Watch gratitude for today
    unsubscribers.push(
      watchGratitudeItems(user.uid, todayStr, data => {
        setGratitudeCount(data.length);
        markInit('gratitude');
      }, () => {
        markInit('gratitude');
      })
    );

    // Watch wins for today
    unsubscribers.push(
      watchWins(user.uid, todayStr, data => {
        setWinsCount(data.length);
        markInit('wins');
      }, () => {
        markInit('wins');
      })
    );

    // Watch journal entries
    unsubscribers.push(
      watchJournalEntries(user.uid, data => {
        const todayEntry = data.find(entry => {
          const entryDate = entry.timestamp?.toDate?.() ?? new Date(0);
          const isSameDay = entryDate.toISOString().slice(0, 10) === todayStr;
          return isSameDay;
        });
        setHasJournalEntry(!!todayEntry);
        markInit('journal');
      }, () => {
        markInit('journal');
      })
    );

    // Watch challenges
    unsubscribers.push(
      watchChallenges(user.uid, data => {
        setChallengesProgress(data);
        markInit('challenges');
      }, () => {
        markInit('challenges');
      })
    );

    // Watch plan progress
    unsubscribers.push(
      watchPlanProgress(user.uid, todayStr, prog => {
        const count = prog ? Object.values(prog.items || {}).filter(Boolean).length : 0;
        setPlanCompletionCount(count);
        markInit('planProgress');
      }, () => {
        markInit('planProgress');
      })
    );

    return () => {
      unsubscribers.forEach(u => u());
    };
  }, [user, todayStr]);

  return {
    gratitudeCount,
    winsCount,
    hasJournalEntry,
    challengesProgress,
    planCompletionCount,
    loading,
  };
}
