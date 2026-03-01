import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchSelfCareEntries,
  fetchGratitudeItems,
  fetchWins,
} from '../services/selfCareService';
export interface SelfCareStats {
  screeningCount: number;
  journalEntryCount: number;
  gratitudeCount: number;
  winsCount: number;
}

/**
 * Returns activity counts for the current week (last 7 days) for dashboard.
 * screeningCount must be passed from parent (from useUserScreenings).
 */
export function useSelfCareStats(screeningCountThisWeek: number) {
  const { user } = useAuth();
  const [stats, setStats] = useState<SelfCareStats>({
    screeningCount: 0,
    journalEntryCount: 0,
    gratitudeCount: 0,
    winsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats({
        screeningCount: 0,
        journalEntryCount: 0,
        gratitudeCount: 0,
        winsCount: 0,
      });
      setLoading(false);
      return;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const load = async () => {
      try {
        const [entries, gratitude, wins] = await Promise.all([
          fetchSelfCareEntries(user.uid),
          fetchGratitudeItems(user.uid),
          fetchWins(user.uid),
        ]);

        const journalThisWeek = entries.filter(e => {
          const t = e.timestamp?.toDate?.() ?? new Date(e.timestamp);
          return t >= sevenDaysAgo;
        }).length;

        setStats({
          screeningCount: screeningCountThisWeek,
          journalEntryCount: journalThisWeek,
          gratitudeCount: gratitude.length,
          winsCount: wins.length,
        });
      } catch (err) {
        console.error('Failed to load self-care stats', err);
        setStats(prev => ({ ...prev, screeningCount: screeningCountThisWeek }));
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    load();
  }, [user?.uid, screeningCountThisWeek]);

  return { stats, loading };
}
