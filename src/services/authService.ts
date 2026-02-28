import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { auth } from '../backend/firebase';
import { ensureUserProfile } from './userService.ts';

/**
 * Register new user via email/password
 */
export async function registerWithEmail(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred.user) {
        await ensureUserProfile(cred.user);
    }
    return cred.user;
}

/**
 * Login existing user via email/password
 */
export async function loginWithEmail(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (cred.user) {
        await ensureUserProfile(cred.user);
    }
    return cred.user;
}

/**
 * Sign in using Google popup and ensure profile
 */
export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (cred.user) {
        await ensureUserProfile(cred.user);
    }
    return cred.user;
}

/**
 * Log out the current user
 */
export async function logout() {
    return signOut(auth);
}
