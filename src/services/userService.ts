import { User } from 'firebase/auth';
import { doc, getDoc, getFirestore, onSnapshot, setDoc, Unsubscribe, updateDoc } from 'firebase/firestore';

/**
 * Extract name from email (before the @ symbol)
 */
function getNameFromEmail(email: string | null): string {
  if (!email) return 'User';
  const parts = email.split('@');
  return parts[0] || 'User';
}

/**
 * Ensure a Firestore user document exists and return profile data
 * @param user - Firebase user object
 * @param customName - Optional custom name (e.g., from signup form)
 */
export async function ensureUserProfile(user: User, customName?: string) {
  const db = getFirestore();
  const userDoc = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userDoc);
  
  // Use customName if provided, otherwise use displayName (Google), otherwise extract from email
  const derivedName = customName || user.displayName || getNameFromEmail(user.email);
  
  if (!snapshot.exists()) {
    await setDoc(userDoc, {
      email: user.email,
      name: derivedName,
      createdAt: new Date(),
    });
    return { email: user.email, name: derivedName };
  }

  const data = snapshot.data();
  // If no name in DB, update with derived name
  if (!data.name) {
    await updateDoc(userDoc, { name: derivedName });
    return { email: data.email || user.email, name: derivedName };
  }
  
  return { email: data.email || user.email, name: data.name };
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

// Achievement types
export interface UserAchievements {
  uid: string;
  streak7Day: boolean;
  activityMaster: boolean;
  journalWarrior: boolean;
  gratitudeChampion: boolean;
  totalAchievements: number;
  lastUpdated?: any;
}

// Initialize achievements for a user
export async function initializeAchievements(uid: string): Promise<void> {
  const db = getFirestore();
  const achievementsDoc = doc(db, 'users', uid, 'profile', 'achievements');
  const snapshot = await getDoc(achievementsDoc);
  if (!snapshot.exists()) {
    await setDoc(achievementsDoc, {
      streak7Day: false,
      activityMaster: false,
      journalWarrior: false,
      gratitudeChampion: false,
      totalAchievements: 0,
      createdAt: new Date(),
    });
  }
}

// Fetch user achievements
export async function fetchUserAchievements(uid: string): Promise<UserAchievements | null> {
  const db = getFirestore();
  const achievementsDoc = doc(db, 'users', uid, 'profile', 'achievements');
  const snapshot = await getDoc(achievementsDoc);
  if (snapshot.exists()) {
    return {
      uid,
      ...snapshot.data(),
    } as UserAchievements;
  }
  return null;
}

// Update a specific achievement
export async function updateAchievement(uid: string, achievementKey: string, value: boolean): Promise<void> {
  const db = getFirestore();
  const achievementsDoc = doc(db, 'users', uid, 'profile', 'achievements');
  
  // Get current achievements to calculate total
  const snapshot = await getDoc(achievementsDoc);
  let currentCount = 0;
  if (snapshot.exists()) {
    const data = snapshot.data();
    currentCount = data.totalAchievements || 0;
    // If setting to true and wasn't already true, increment
    if (value && !data[achievementKey]) {
      currentCount++;
    } else if (!value && data[achievementKey]) {
      currentCount--;
    }
  }
  
  await updateDoc(achievementsDoc, {
    [achievementKey]: value,
    totalAchievements: Math.max(0, currentCount),
    lastUpdated: new Date(),
  });
}

// Watch achievements in real-time
export function watchAchievements(
  uid: string,
  onUpdate: (achievements: UserAchievements | null) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const db = getFirestore();
  const achievementsDoc = doc(db, 'users', uid, 'profile', 'achievements');
  
  return onSnapshot(
    achievementsDoc,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate({
          uid,
          ...snapshot.data(),
        } as UserAchievements);
      } else {
        // Initialize if not exists
        initializeAchievements(uid).then(() => {
          onUpdate({
            uid,
            streak7Day: false,
            activityMaster: false,
            journalWarrior: false,
            gratitudeChampion: false,
            totalAchievements: 0,
          });
        });
      }
    },
    (err) => {
      console.error('Error watching achievements:', err);
      if (onError) onError(err);
    }
  );
}
