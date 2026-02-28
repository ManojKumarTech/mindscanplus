import {
    addDoc,
    collection,
    DocumentData,
    getDocs,
    limit,
    orderBy,
    query,
    QueryDocumentSnapshot,
    serverTimestamp,
    startAfter,
} from 'firebase/firestore';
import { db } from '../backend/firebase';

export interface CommunityStory {
  id?: string;
  excerpt: string;
  author?: string | null;
  reactions: number;
  comments: number;
  createdAt?: any;
}

/**
 * Submit a new community story.  Basic moderation (author stored but
 * front‑end handles anonymity) and timestamps added here.
 */
export async function postStory(
  excerpt: string,
  author?: string | null
): Promise<string> {
  const docRef = await addDoc(collection(db, 'communityStories'), {
    excerpt,
    author: author || null,
    reactions: 0,
    comments: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Fetch a page of recent stories.  Returns documents and a cursor that
 * can be passed to fetchMoreStories if you want pagination.
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
  const stories: CommunityStory[] = snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      excerpt: data.excerpt,
      author: data.author,
      reactions: data.reactions,
      comments: data.comments,
      createdAt: data.createdAt,
    } as CommunityStory;
  });

  const last = snap.docs[snap.docs.length - 1] || null;
  return { stories, nextCursor: last };
}
