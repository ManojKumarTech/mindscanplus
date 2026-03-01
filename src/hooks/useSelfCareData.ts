import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type {
  GratitudeItem,
  SelfCareEntry,
  WinEntry,
} from '../services/selfCareService';
import {
  addGratitudeItem,
  addWin,
  deleteGratitudeItem,
  deleteWinById,
  togglePlanItem as serviceTogglePlanItem,
  upsertJournalEntry,
  watchGratitudeItems,
  watchJournalEntries,
  watchPlanProgress,
  watchWins
} from '../services/selfCareService';
import { updateAchievement } from '../services/userService';

function sameCalendarDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Function to check and update achievements
async function checkAndUpdateAchievements(
  userId: string,
  gratitudeCount: number,
  winsCount: number,
  journalCount: number
) {
  try {
    // Check Gratitude Champion: 20 gratitude items
    if (gratitudeCount >= 20) {
      await updateAchievement(userId, 'gratitudeChampion', true);
    }
    // Check Activity Master: 10 wins
    if (winsCount >= 10) {
      await updateAchievement(userId, 'activityMaster', true);
    }
    // Check Journal Warrior: 5 journal entries
    if (journalCount >= 5) {
      await updateAchievement(userId, 'journalWarrior', true);
    }
  } catch (err) {
    console.error('Error updating achievements:', err);
  }
}

export function useSelfCareData() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [gratitudeItems, setGratitudeItems] = useState<GratitudeItem[]>([]);
  const [wins, setWins] = useState<WinEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<SelfCareEntry[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingJournal, setSavingJournal] = useState(false);

  // derived
  const lastJournalEntry = journalEntries[0];
  const journalText = lastJournalEntry?.journalEntry ?? '';
  const lastJournalTimestamp: Date | null = lastJournalEntry?.timestamp?.toDate
    ? lastJournalEntry.timestamp.toDate()
    : lastJournalEntry?.timestamp
    ? new Date(lastJournalEntry.timestamp)
    : null;

  // current day strings (server-approximate)
  const nowDate = Timestamp.now().toDate();
  const todayStr = nowDate.toISOString().slice(0, 10);

  // Always allow journal editing - upsert logic handles same-day updates and new days
  const canEditJournal = true;

  // plan progress for today
  const [planProgress, setPlanProgress] = useState<Record<string, boolean>>({});
  // no per-day action tracking; allow unlimited adjustments

  // subscriptions
  useEffect(() => {
    if (!user) {
      setGratitudeItems([]);
      setWins([]);
      setJournalEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribers: Array<() => void> = [];

    let initialized = {
      gratitude: false,
      wins: false,
      journal: false,
    };
    const markInit = (key: keyof typeof initialized) => {
      initialized[key] = true;
      if (Object.values(initialized).every(v => v)) {
        setLoading(false);
      }
    };

    // Store current counts for achievement checking
    let currentGratitudeCount = 0;
    let currentWinsCount = 0;
    let currentJournalCount = 0;

    unsubscribers.push(
      watchGratitudeItems(user.uid, todayStr, data => {
        currentGratitudeCount = data.length;
        setGratitudeItems(data);
        markInit('gratitude');
        // Check achievements when gratitude changes
        checkAndUpdateAchievements(user.uid, currentGratitudeCount, currentWinsCount, currentJournalCount);
      }, _err => showToast('Could not sync gratitude.', 'error'))
    );
    unsubscribers.push(
      watchWins(user.uid, todayStr, data => {
        currentWinsCount = data.length;
        setWins(data);
        markInit('wins');
        // Check achievements when wins change
        checkAndUpdateAchievements(user.uid, currentGratitudeCount, currentWinsCount, currentJournalCount);
      }, _err => showToast('Could not sync wins.', 'error'))
    );
    unsubscribers.push(
      watchJournalEntries(user.uid, data => {
        currentJournalCount = data.length;
        setJournalEntries(data);
        markInit('journal');
        // Check achievements when journal changes
        checkAndUpdateAchievements(user.uid, currentGratitudeCount, currentWinsCount, currentJournalCount);
      }, _err => showToast('Could not sync journal.', 'error'))
    );
    // plan progress watcher for today
    unsubscribers.push(
      watchPlanProgress(user.uid, todayStr, prog => {
        setPlanProgress(prog?.items || {});
      }, _err => showToast('Could not sync plan progress.', 'error'))
    );

    return () => {
      unsubscribers.forEach(u => u());
    };

  }, [user, showToast, todayStr]);


  // actions
  const addNewGratitude = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      if (user) {
        try {
          await addGratitudeItem(user.uid, text, todayStr);
          showToast('Gratitude item added.');
        } catch (err) {
          console.error(err);
          showToast('Failed to add gratitude.', 'error');
        }
      }
    },
    [user, showToast, todayStr]
  );

  const removeGratitude = useCallback(
    async (item: GratitudeItem) => {
      if (user) {
        try {
          await deleteGratitudeItem(user.uid, item.id);
          showToast('Removed.');
        } catch (err) {
          console.error(err);
          showToast('Could not remove item.', 'error');
        }
      }
    },
    [user, showToast]
  );

  const addNewWin = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      if (user) {
        try {
          await addWin(user.uid, { id: Date.now(), text, date: 'Today' }, todayStr);
          showToast('Win added. Keep it up!');
        } catch (err) {
          console.error(err);
          showToast('Failed to add win.', 'error');
        }
      }
    },
    [user, showToast, todayStr]
  );

  const removeWin = useCallback(
    async (win: WinEntry) => {
      if (user && !win.id.toString().startsWith('local-')) {
        try {
          await deleteWinById(user.uid, win.id.toString());
          showToast('Removed.');
        } catch (err) {
          console.error(err);
          showToast('Could not remove win.', 'error');
        }
      }
    },
    [user, showToast]
  );

  const saveJournal = useCallback(
    async (text: string) => {
      if (!user) return;
      if (!canEditJournal) return;
      setSavingJournal(true);
      try {
        // Only update existing entry if it's from today
        const existingId =
          lastJournalEntry && lastJournalTimestamp && sameCalendarDay(lastJournalTimestamp, nowDate)
            ? lastJournalEntry.id
            : undefined;
        await upsertJournalEntry(user.uid, {
          gratitudeItems: gratitudeItems.map(i => i.text),
          wins: wins.map((w, i) => ({ id: i + 1, text: w.text, date: w.date })),
          journalEntry: text,
        }, existingId as string | undefined);
        showToast('Journal entry saved.');
      } catch (err) {
        console.error(err);
        showToast('Failed to save entry.', 'error');
      } finally {
        setSavingJournal(false);
      }
    },
    [user, gratitudeItems, wins, canEditJournal, showToast, lastJournalEntry, lastJournalTimestamp, nowDate]
  );

  return {
    data: {
      gratitudeItems,
      wins,
      journalText,
      lastJournalTimestamp,
      canEditJournal,
      planProgress,
    },
    loading,
    savingJournal,
    actions: {
      addNewGratitude,
      removeGratitude,
      addNewWin,
      removeWin,
      saveJournal,
      togglePlanItem: useCallback(async (key: string, value: boolean) => {
        if (!user) return;
        try {
          await serviceTogglePlanItem(user.uid, todayStr, key, value);
          // optimistic update
          setPlanProgress(prev => ({ ...prev, [key]: value }));
        } catch (err) {
          console.error(err);
          showToast('Could not update plan.', 'error');
        }
      }, [user, todayStr, showToast]),
    },
  };
}
