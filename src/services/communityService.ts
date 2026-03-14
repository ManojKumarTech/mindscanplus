import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../backend/firebase';

export interface CommunityStory {
  id?: string;
  excerpt: string;
  author?: string | null;
  authorId?: string | null;
  reactions: number;
  comments: number;
  createdAt?: any;
}

/**
 * Submit a new community story. Author stored but front-end handles anonymity.
 */
export async function postStory(
  excerpt: string,
  author?: string | null,
  authorId?: string | null
): Promise<string> {
  const docRef = await addDoc(collection(db, 'communityStories'), {
    excerpt,
    author: author || null,
    authorId: authorId || null,
    reactions: 0,
    comments: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Fetch a page of recent stories. Returns documents and a cursor for pagination.
 */
export async function fetchStories(
  pageSize = 10,
  cursor?: QueryDocumentSnapshot<DocumentData>
): Promise<{ stories: CommunityStory[]; nextCursor: QueryDocumentSnapshot<DocumentData> | null }> {
  let q = query(
    collection(db, 'communityStories'),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  if (cursor) {
    q = query(q, startAfter(cursor));
  }

  const snap = await getDocs(q);
  const stories: CommunityStory[] = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      excerpt: data.excerpt,
      author: data.author,
      authorId: data.authorId,
      reactions: data.reactions ?? 0,
      comments: data.comments ?? 0,
      createdAt: data.createdAt,
    } as CommunityStory;
  });

  const last = snap.docs[snap.docs.length - 1] || null;
  return { stories, nextCursor: last };
}

/**
 * Fetch stories by a specific user
 */
export async function fetchUserStories(
  userId: string,
  pageSize = 10
): Promise<CommunityStory[]> {
  const q = query(
    collection(db, 'communityStories'),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      excerpt: data.excerpt,
      author: data.author,
      authorId: data.authorId,
      reactions: data.reactions ?? 0,
      comments: data.comments ?? 0,
      createdAt: data.createdAt,
    } as CommunityStory;
  });
}

/**
 * Update a story's text
 */
export async function updateStory(
  storyId: string,
  newExcerpt: string
): Promise<void> {
  const storyDoc = doc(db, 'communityStories', storyId);
  await updateDoc(storyDoc, {
    excerpt: newExcerpt,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a story
 */
export async function deleteStory(storyId: string): Promise<void> {
  const storyDoc = doc(db, 'communityStories', storyId);
  await deleteDoc(storyDoc);
}

/**
 * React to a story – uses Firestore atomic increment for race-condition safety.
 */
export async function reactToStory(storyId: string): Promise<void> {
  const storyDoc = doc(db, 'communityStories', storyId);
  await updateDoc(storyDoc, { reactions: increment(1) });
}

/**
 * Undo a reaction (decrement, floor at 0 handled client-side)
 */
export async function unreactToStory(storyId: string): Promise<void> {
  const storyDoc = doc(db, 'communityStories', storyId);
  await updateDoc(storyDoc, { reactions: increment(-1) });
}
