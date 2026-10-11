import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

// Helper to clean quotes, whitespace, trailing punctuation from env vars
const cleanEnv = (val, fallback = '') => {
  if (!val) return fallback;
  let str = String(val).trim();
  // Strip wrapping quotes (single or double) accidentally pasted into Vercel
  str = str.replace(/^["'`]+|["'`]+$/g, '').trim();
  // Strip trailing periods or slashes
  str = str.replace(/[./\\]+$/, '').trim();
  return str || fallback;
};

// Read Firebase configuration from Vite environment variables with production defaults
const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY, "AIzaSyBOVeDV9qpO-ablYz524ECn1hIXyIMhqIk"),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "scamsenseai-8bf14.firebaseapp.com"),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, "scamsenseai-8bf14"),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "scamsenseai-8bf14.firebasestorage.app"),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "195996572515"),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID, "1:195996572515:web:1b5465b2afaad30818915")
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("MockKey")
);

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth & Cloud Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Ensure persistence is set to browser local persistence
try {
  setPersistence(auth, browserLocalPersistence);
} catch (e) {
  console.warn("Persistence setting initialization:", e);
}

/**
 * Creates or updates the user profile document in Cloud Firestore under collection `users/{uid}`.
 * Protected with a timeout so network issues never block authentication.
 */
export const syncUserProfileWithFirestore = async (authUser) => {
  if (!authUser || authUser.isMock || !isFirebaseConfigured) return;

  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore sync timed out')), 2500)
    );

    const syncPromise = (async () => {
      const userRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userRef);

      const providerId = authUser.providerData && authUser.providerData.length > 0 
        ? authUser.providerData[0].providerId 
        : (authUser.providerId || 'google.com');

      const profileData = {
        uid: authUser.uid,
        displayName: authUser.displayName || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        photoURL: authUser.photoURL || '',
        provider: providerId,
        lastLoginAt: serverTimestamp()
      };

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          ...profileData,
          createdAt: serverTimestamp()
        });
      } else {
        await updateDoc(userRef, profileData);
      }
    })();

    await Promise.race([syncPromise, timeoutPromise]);
  } catch (error) {
    console.warn("Cloud Firestore profile sync notice (skipped non-blocking):", error);
  }
};

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
};

