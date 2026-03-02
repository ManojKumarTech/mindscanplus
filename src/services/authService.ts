import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { auth } from '../backend/firebase';
import { ensureUserProfile } from './userService';

interface UserProfile {
    email: string | null;
    name: string;
}

/**
 * Register new user via email/password
 * @param email - User's email
 * @param password - User's password
 * @param name - User's display name from signup form
 * @returns Object containing Firebase user and profile
 */
export async function registerWithEmail(email: string, password: string, name: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred.user) {
        const profile = await ensureUserProfile(cred.user, name);
        return { user: cred.user, profile };
    }
    return { user: null, profile: null };
}

/**
 * Login existing user via email/password
 * @param email - User's email
 * @param password - User's password
 * @returns Object containing Firebase user and profile
 */
export async function loginWithEmail(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (cred.user) {
        const profile = await ensureUserProfile(cred.user);
        return { user: cred.user, profile };
    }
    return { user: null, profile: null };
}

/**
 * Sign in using Google popup and ensure profile
 * @returns Object containing Firebase user and profile
 */
export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (cred.user) {
        const profile = await ensureUserProfile(cred.user);
        return { user: cred.user, profile };
    }
    return { user: null, profile: null };
}

/**
 * Log out the current user
 */
export async function logout() {
    return signOut(auth);
}
