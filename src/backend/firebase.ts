import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// runtime-safeguard: ensure a valid API key is present to avoid cryptic Firebase errors
const apiKey = (import.meta.env.VITE_API_KEY as string) || '';
if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    // helpful console message for local development
    console.error(
        'Missing or invalid VITE_API_KEY. Set your Firebase API key in .env as VITE_API_KEY and restart the dev server.'
    );
    throw new Error('Missing VITE_API_KEY in environment. See README or Firebase console.');
}

const firebaseConfig = {
        apiKey,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID,
        measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// initialize and export the authentication module so other parts of the app can use it
export const auth = getAuth(app);

// also export firestore for data persistence
export const db = getFirestore(app);
