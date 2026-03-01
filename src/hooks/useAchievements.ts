import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    UserAchievements,
    initializeAchievements,
    updateAchievement,
    watchAchievements
} from '../services/userService';

interface UseAchievementsReturn {
  achievements: UserAchievements | null;
  loading: boolean;
  error: string | null;
  updateAchievementStatus: (key: string, value: boolean) => Promise<void>;
}

/**
 * Custom hook to manage user achievements from database
 */
export function useAchievements(): UseAchievementsReturn {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [achievements, setAchievements] = useState<UserAchievements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize and watch achievements
  useEffect(() => {
    if (!user) {
      setAchievements(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // First initialize the achievements document if it doesn't exist
    initializeAchievements(user.uid).catch(err => {
      console.error('Error initializing achievements:', err);
    });

    // Set up real-time listener
    const unsubscribe = watchAchievements(
      user.uid,
      (data) => {
        setAchievements(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching achievements:', err);
        setError(err.message || 'Failed to fetch achievements');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  // Update achievement status
  const updateAchievementStatus = useCallback(
    async (key: string, value: boolean) => {
      if (!user) return;
      try {
        await updateAchievement(user.uid, key, value);
        showToast(`Achievement ${value ? 'unlocked' : 'locked'}!`);
      } catch (err) {
        console.error('Error updating achievement:', err);
        showToast('Failed to update achievement', 'error');
      }
    },
    [user, showToast]
  );

  return {
    achievements,
    loading,
    error,
    updateAchievementStatus,
  };
}
