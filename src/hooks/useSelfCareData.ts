import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type {
    ChallengeItem,
    GratitudeItem,
    SelfCareEntry,
    WinEntry,
} from '../services/selfCareService';
import {
    addGratitudeItem,
    addWin,
    createChallenge,
    deleteGratitudeItem,
    deleteWinById,
    togglePlanItem as serviceTogglePlanItem,
    updateChallengeProgress,
    upsertJournalEntry,
    watchChallenges,
    watchGratitudeItems,
    watchJournalEntries,
    watchPlanProgress,
    watchWins
} from '../services/selfCareService';

function sameCalendarDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function useSelfCareData() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [gratitudeItems, setGratitudeItems] = useState<GratitudeItem[]>([]);
  const [wins, setWins] = useState<WinEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<SelfCareEntry[]>([]);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingJournal, setSavingJournal] = useState(false);
  const [updatingChallengeIds, setUpdatingChallengeIds] = useState<string[]>([]);

  // Track if we've seeded defaults for this user
  const hasSeededRef = useRef<string | null>(null);

  // derived
  const lastJournalEntry = journalEntries[0];
  const journalText = lastJournalEntry?.journalEntry ?? '';
  const lastJournalTimestamp: Date | null = lastJournalEntry?.timestamp?.toDate
    ? lastJournalEntry.timestamp.toDate()
    : lastJournalEntry?.timestamp
    ? new Date(lastJournalEntry.timestamp)
    : null;

  // current day/week strings (server-approximate)
  const nowDate = Timestamp.now().toDate();
  const todayStr = nowDate.toISOString().slice(0, 10);
  const weekStartStr = (() => {
    const d = new Date(nowDate);
    const day = d.getDay(); // 0=Sun, we want Monday start
    const diff = (day + 6) % 7; // days since Monday
    d.setDate(d.getDate() - diff);
    return d.toISOString().slice(0, 10);
  })();

  // Always allow journal editing - upsert logic handles same-day updates and new days
  const canEditJournal = true;

  const challengeEditStatus: Record<string, boolean> = {};
  challenges.forEach(c => {
    const updated = c.lastUpdatedAt ? c.lastUpdatedAt.toDate() : null;
    challengeEditStatus[c.id] = !!updated && sameCalendarDay(updated, nowDate);
  });

  // plan progress for today
  const [planProgress, setPlanProgress] = useState<Record<string, boolean>>({});

  // subscriptions
  useEffect(() => {
    if (!user) {
      setGratitudeItems([]);
      setWins([]);
      setJournalEntries([]);
      setChallenges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribers: Array<() => void> = [];

    const defaults: Omit<ChallengeItem, 'id'>[] = [
      {
        title: 'Weekly Challenge: Kindness Week',
        description: 'Do one kind act every day this week',
        days: 0,
        totalDays: 7,
        color: 'from-yellow-100 to-orange-100',
      },
      {
        title: 'Weekly Challenge: Nature Time',
        description: 'Spend 15 minutes in nature daily',
        days: 0,
        totalDays: 7,
        color: 'from-green-100 to-mint-100',
      },
      {
        title: 'Weekly Challenge: Gratitude Practice',
        description: "Write down 3 things you're grateful for each day",
        days: 0,
        totalDays: 7,
        color: 'from-sky-100 to-blue-100',
      },
    ];

    let initialized = {
      gratitude: false,
      wins: false,
      journal: false,
      challenges: false,
    };
    const markInit = (key: keyof typeof initialized) => {
      initialized[key] = true;
      if (Object.values(initialized).every(v => v)) {
        setLoading(false);
      }
    };

    unsubscribers.push(
      watchGratitudeItems(user.uid, todayStr, data => {
        setGratitudeItems(data);
        markInit('gratitude');
      }, _err => showToast('Could not sync gratitude.', 'error'))
    );
    unsubscribers.push(
      watchWins(user.uid, todayStr, data => {
        setWins(data);
        markInit('wins');
      }, _err => showToast('Could not sync wins.', 'error'))
    );
    unsubscribers.push(
      watchJournalEntries(user.uid, data => {
        setJournalEntries(data);
        markInit('journal');
      }, _err => showToast('Could not sync journal.', 'error'))
    );
    unsubscribers.push(
      watchChallenges(user.uid, async data => {
        // auto reset any challenge whose weekStart is outdated
        const processed = data.map(c => {
          if (c.weekStart !== weekStartStr) {
            // schedule update but don't await to avoid blocking render
            updateChallengeProgress(user.uid, c.id, 0, weekStartStr).catch(e => console.error('reset challenge', e));
            return { ...c, days: 0, weekStart: weekStartStr };
          }
          return c;
        });
        setChallenges(processed);
        markInit('challenges');
        // if first load and empty, seed defaults (only once per user)
        if (data.length === 0 && hasSeededRef.current !== user.uid) {
          hasSeededRef.current = user.uid;
          try {
            await Promise.all(
              defaults.map(d => createChallenge(user.uid, d))
            );
          } catch (err) {
            console.error('failed seeding challenges', err);
          }
        }
      }, _err => showToast('Could not sync challenges.', 'error'))
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
  }, [user, showToast, todayStr, weekStartStr]);

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

  const incrementChallenge = useCallback(
    async (challenge: ChallengeItem) => {
      if (!user) return;
      // determine if week has rolled over
      let nextDays = challenge.days + 1;
      let weekStartParam: string | undefined;
      if (challenge.weekStart !== weekStartStr) {
        nextDays = 1;
        weekStartParam = weekStartStr;
      }
      if (challenge.days >= challenge.totalDays && challenge.weekStart === weekStartStr) return;
      setUpdatingChallengeIds(prev => [...prev, challenge.id]);
      try {
        await updateChallengeProgress(user.uid, challenge.id, nextDays, weekStartParam);
        showToast('Progress updated.');
      } catch (err) {
        console.error(err);
        showToast('Could not update challenge.', 'error');
      } finally {
        setUpdatingChallengeIds(prev => prev.filter(id => id !== challenge.id));
      }
    },
    [user, challengeEditStatus, showToast, weekStartStr]
  );

  return {
    data: {
      gratitudeItems,
      wins,
      journalText,
      lastJournalTimestamp,
      challenges,
      canEditJournal,
      challengeEditStatus,
      planProgress,
    },
    loading,
    savingJournal,
    updatingChallengeIds,
    actions: {
      addNewGratitude,
      removeGratitude,
      addNewWin,
      removeWin,
      saveJournal,
      incrementChallenge,
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
