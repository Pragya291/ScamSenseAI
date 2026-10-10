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

// Read Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForFrontendEnvironment99",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "scamsense-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "scamsense-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "scamsense-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes("MockKey")
);

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth & Cloud Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Ensure persistence is set to browser local persistence
try {
  setPersistence(auth, browserLocalPersistence);
} catch (e) {
  console.warn("Persistence setting initialization:", e);
}

/**
 * Creates or updates the user profile document in Cloud Firestore under collection `users/{uid}`.
 * Preserves existing `createdAt` timestamp while updating `lastLoginAt` and user details.
 */
export const syncUserProfileWithFirestore = async (authUser) => {
  if (!authUser || authUser.isMock || !isFirebaseConfigured) return;

  try {
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
      // Create new profile for first-time sign in
      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp()
      });
    } else {
      // Update last login and profile info for returning users
      await updateDoc(userRef, profileData);
    }
  } catch (error) {
    console.warn("Cloud Firestore profile sync notice (permission/network):", error);
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

