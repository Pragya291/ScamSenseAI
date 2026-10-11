// Re-export from canonical Firebase client module in lib/firebase
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
  onAuthStateChanged,
  isFirebaseConfigured,
  syncUserProfileWithFirestore
} from '../lib/firebase';
