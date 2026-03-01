import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../backend/firebase';

export interface GratitudeItem {
  id: string;
  text: string;
  date?: string;
  createdAt?: unknown;
}

export interface WinEntry {
  id: string;
  text: string;
  date: string;
  createdAt?: unknown;
}
export interface SelfCareEntry {
  id?: string;
  gratitudeItems: string[];
  wins: { id: number; text: string; date: string }[];
  journalEntry: string;
  timestamp?: any;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  days: number;
  totalDays: number;
  color: string;
  weekStart?: string; // ISO week-start string (e.g. 2026-03-02)
  lastUpdatedAt?: Timestamp;
}

export interface PlanProgress {
  id: string; // date string YYYY-MM-DD
  items: Record<string, boolean>;
  createdAt?: Timestamp;
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

export async function addGratitudeItem(userId: string, item: string, dateStr?: string): Promise<string> {
  const ref = await addDoc(collection(db, 'users', userId, 'gratitude'), {
    text: item,
    date: dateStr || new Date().toISOString().slice(0, 10),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function addWin(userId: string, win: { id: number; text: string; date: string }, dateStr?: string): Promise<string> {
  const ref = await addDoc(collection(db, 'users', userId, 'wins'), {
    ...win,
    date: dateStr || new Date().toISOString().slice(0, 10),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Fetch all gratitude items for a user (newest first)
 */
export async function fetchGratitudeItems(userId: string): Promise<GratitudeItem[]> {
  const q = query(
    collection(db, 'users', userId, 'gratitude'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    id: doc.id,
    text: (doc.data() as { text: string; date?: string }).text,
    date: (doc.data() as any).date,
    createdAt: doc.data().createdAt,
  }));
}

/**
 * Fetch all wins for a user (newest first)
 */
export async function fetchWins(userId: string): Promise<WinEntry[]> {
  const q = query(
    collection(db, 'users', userId, 'wins'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(docSnap => {
    const d = docSnap.data() as { text: string; date?: string; id?: number };
    return {
      id: docSnap.id,
      text: d.text,
      date: d.date || 'Today',
      createdAt: docSnap.data().createdAt,
    };
  });
}

/**
 * Remove a gratitude item by doc id
 */
export async function deleteGratitudeItem(userId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'gratitude', itemId));
}

/**
 * Remove a win by doc id
 */
export async function deleteWinById(userId: string, winId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'wins', winId));
}

// -----------------------------------------------------------------------------
// Realtime listeners (onSnapshot helpers) and daily/weekly helpers
// -----------------------------------------------------------------------------

function makeCollectionQuery(path: string, userId: string, orderField: string): Query {
  return query(collection(db, 'users', userId, path), orderBy(orderField, 'desc'));
}

function makeDailyQuery(path: string, userId: string, dateField: string, dateStr: string): Query {
  return query(
    collection(db, 'users', userId, path),
    // @ts-ignore - types lack where
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    where(dateField, '==', dateStr)
  );
}

export function watchGratitudeItems(
  userId: string,
  dateStr: string,
  onUpdate: (items: GratitudeItem[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const q = makeDailyQuery('gratitude', userId, 'date', dateStr);
  return onSnapshot(
    q,
    (snap: QuerySnapshot<DocumentData>) => {
      const data: GratitudeItem[] = snap.docs
        .map(docSnap => ({
          id: docSnap.id,
          text: (docSnap.data() as any).text,
          createdAt: docSnap.data().createdAt,
        }))
        .sort((a, b) => {
          const aTime = (a.createdAt?.toDate?.() ?? new Date(0)).getTime();
          const bTime = (b.createdAt?.toDate?.() ?? new Date(0)).getTime();
          return bTime - aTime; // newest first
        });
      onUpdate(data);
    },
    err => {
      console.error('gratitude snapshot error', err);
      if (onError) onError(err);
    }
  );
}

export function watchWins(
  userId: string,
  dateStr: string,
  onUpdate: (wins: WinEntry[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const q = makeDailyQuery('wins', userId, 'date', dateStr);
  return onSnapshot(
    q,
    (snap: QuerySnapshot<DocumentData>) => {
      const data: WinEntry[] = snap.docs
        .map(docSnap => {
          const d = docSnap.data() as { text: string; date: string };
          return {
            id: docSnap.id,
            text: d.text,
            date: d.date || 'Today',
            createdAt: docSnap.data().createdAt,
          };
        })
        .sort((a, b) => {
          const aTime = (a.createdAt?.toDate?.() ?? new Date(0)).getTime();
          const bTime = (b.createdAt?.toDate?.() ?? new Date(0)).getTime();
          return bTime - aTime; // newest first
        });
      onUpdate(data);
    },
    err => {
      console.error('wins snapshot error', err);
      if (onError) onError(err);
    }
  );
}

export function watchJournalEntries(
  userId: string,
  onUpdate: (entries: SelfCareEntry[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const q = makeCollectionQuery('selfCare', userId, 'timestamp');
  return onSnapshot(
    q,
    snap => {
      const data: SelfCareEntry[] = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as any),
      } as SelfCareEntry)).sort((a, b) => {
        const aTime = (a.timestamp?.toDate?.() ?? new Date(0)).getTime();
        const bTime = (b.timestamp?.toDate?.() ?? new Date(0)).getTime();
        return bTime - aTime; // newest first
      });
      onUpdate(data);
    },
    err => {
      console.error('journal snapshot error', err);
      if (onError) onError(err);
    }
  );
}

export function watchChallenges(
  userId: string,
  onUpdate: (challenges: ChallengeItem[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const q = makeCollectionQuery('challenges', userId, 'lastUpdatedAt');
  return onSnapshot(
    q,
    snap => {
      const data: ChallengeItem[] = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as any),
      } as ChallengeItem));
      onUpdate(data);
    },
    err => {
      console.error('challenges snapshot error', err);
      if (onError) onError(err);
    }
  );
}

export async function updateChallengeProgress(
  userId: string,
  challengeId: string,
  days: number,
  weekStart?: string
): Promise<void> {
  const ref = doc(db, 'users', userId, 'challenges', challengeId);
  const update: any = { days, lastUpdatedAt: serverTimestamp() };
  if (weekStart !== undefined) update.weekStart = weekStart;
  await updateDoc(ref, update);
}

export async function deleteChallenge(
  userId: string,
  challengeId: string
): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'challenges', challengeId));
}

export async function createChallenge(
  userId: string,
  challenge: Omit<ChallengeItem, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'users', userId, 'challenges'), {
    ...challenge,
    weekStart: new Date().toISOString().slice(0, 10),
    lastUpdatedAt: serverTimestamp(),
  });
  return ref.id;
}

// plan progress helpers
export function watchPlanProgress(
  userId: string,
  dateStr: string,
  onUpdate: (progress: PlanProgress | null) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const ref = doc(db, 'users', userId, 'planProgress', dateStr);
  return onSnapshot(
    ref,
    snap => {
      if (snap.exists()) {
        onUpdate({ id: snap.id, ...(snap.data() as any) } as PlanProgress);
      } else {
        onUpdate(null);
      }
    },
    err => {
      console.error('plan snapshot error', err);
      if (onError) onError(err);
    }
  );
}

export async function togglePlanItem(
  userId: string,
  dateStr: string,
  key: string,
  value: boolean
): Promise<void> {
  const ref = doc(db, 'users', userId, 'planProgress', dateStr);
  try {
    await updateDoc(ref, {
      [`items.${key}`]: value,
      updatedAt: serverTimestamp(),
    });
  } catch (err: any) {
    if (err.code === 'not-found') {
      // create document with the date string as id
      await setDoc(ref, {
        items: { [key]: value },
        createdAt: serverTimestamp(),
      });
    } else {
      throw err;
    }
  }
}

export async function saveJournalEntry(
  userId: string,
  entry: Omit<SelfCareEntry, 'id' | 'timestamp'>
): Promise<string> {
  return saveSelfCareEntry(userId, entry); // alias to help readability
}

export async function upsertJournalEntry(
  userId: string,
  entry: Omit<SelfCareEntry, 'id' | 'timestamp'>,
  existingId?: string
): Promise<string> {
  if (existingId) {
    const ref = doc(db, 'users', userId, 'selfCare', existingId);
    await updateDoc(ref, { ...entry, timestamp: serverTimestamp() });
    return existingId;
  } else {
    return saveSelfCareEntry(userId, entry);
  }
}
