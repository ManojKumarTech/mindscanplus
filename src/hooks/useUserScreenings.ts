import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../backend/firebase';
import { ScreeningResult } from '../services/screeningService';
import { updateAchievement } from '../services/userService';

/**
 * Real-time hook returning a user's screening results collection
 * Also checks for 7-Day Screener achievement
 */
export function useUserScreenings(userId?: string) {
  const [results, setResults] = useState<ScreeningResult[]>([]);

  useEffect(() => {
    if (!userId) return;
    
    const q = query(collection(db, 'users', userId, 'screeningResults'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snapshot => {
      const arr: ScreeningResult[] = snapshot.docs.map(doc => ({
        id: doc.id,
        userId,
        ...doc.data(),
      } as ScreeningResult));
      setResults(arr);
      
      // Check for 7-Day Screener achievement (7 consecutive days)
      check7DayStreak(userId, arr);
    });

    return unsub;
  }, [userId]);
  
  return results;
}

// Check if user has completed screenings for 7 consecutive days
async function check7DayStreak(userId: string, results: ScreeningResult[]) {
  if (results.length < 7) return;
  
  // Sort by date descending
  const sortedResults = [...results].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Check for 7 consecutive days
  let consecutiveDays = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedResults.length - 1; i++) {
    const currentDate = sortedResults[i].createdAt?.toDate?.() || new Date(sortedResults[i].createdAt);
    const nextDate = sortedResults[i + 1].createdAt?.toDate?.() || new Date(sortedResults[i + 1].createdAt);
    
    currentDate.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      consecutiveDays++;
    } else {
      break;
    }
    
    if (consecutiveDays >= 7) break;
  }
  
  // Award achievement if 7 consecutive days
  if (consecutiveDays >= 7) {
    try {
      await updateAchievement(userId, 'streak7Day', true);
    } catch (err) {
      console.error('Error updating 7-day streak achievement:', err);
    }
  }
}
