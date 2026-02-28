import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../backend/firebase';

export interface SelfCareEntry {
  id?: string;
  gratitudeItems: string[];
  wins: { id: number; text: string; date: string }[];
  journalEntry: string;
  timestamp?: any;
}

/**
 * persist a full self-care snapshot for the current user
 */
export async function saveSelfCareEntry(
  userId: string,
  entry: Omit<SelfCareEntry, 'id' | 'timestamp'>
): Promise<string> {
  const docRef = await addDoc(
    collection(db, 'users', userId, 'selfCare'),
    {
      ...entry,
      timestamp: serverTimestamp(),
    }
  );
  return docRef.id;
}

/**
 * load recent self-care entries for display/history
 */
export async function fetchSelfCareEntries(userId: string): Promise<SelfCareEntry[]> {
  const q = query(collection(db, 'users', userId, 'selfCare'), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as SelfCareEntry));
}

export async function addGratitudeItem(userId: string, item: string): Promise<void> {
  await addDoc(collection(db, 'users', userId, 'gratitude'), {
    text: item,
    createdAt: serverTimestamp(),
  });
}

export async function addWin(userId: string, win: { id: number; text: string; date: string }): Promise<void> {
  await addDoc(collection(db, 'users', userId, 'wins'), {
    ...win,
    createdAt: serverTimestamp(),
  });
}
