import { User } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

/**
 * Ensure a Firestore user document exists and return profile data
 */
export async function ensureUserProfile(user: User) {
  const db = getFirestore();
  const userDoc = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userDoc);
  if (!snapshot.exists()) {
    await setDoc(userDoc, {
      email: user.email,
      name: user.displayName,
      createdAt: new Date(),
    });
    return { email: user.email, name: user.displayName };
  }

  const data = snapshot.data();
  return { email: data.email || user.email, name: data.name || user.displayName };
}

export async function fetchUserProfile(uid: string) {
  const db = getFirestore();
  const userDoc = doc(db, 'users', uid);
  const snapshot = await getDoc(userDoc);
  return snapshot.exists() ? (snapshot.data() as any) : null;
}

export async function updateUserName(uid: string, name: string) {
  const db = getFirestore();
  const userDoc = doc(db, 'users', uid);
  await setDoc(userDoc, { name }, { merge: true });
}
