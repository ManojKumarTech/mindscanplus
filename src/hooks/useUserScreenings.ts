import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../backend/firebase';
import { ScreeningResult } from '../services/screeningService';

/**
 * Real-time hook returning a user's screening results collection
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
    });

    return unsub;
  }, [userId]);

  return results;
}
