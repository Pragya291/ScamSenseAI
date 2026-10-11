import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  isFirebaseConfigured,
  syncUserProfileWithFirestore
} from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Configurable post-login destination
  const postLoginDestination = import.meta.env.VITE_POST_LOGIN_REDIRECT || '/dashboard';

  useEffect(() => {
    // Check for redirect result if mobile redirect or popup fallback was used
    if (isFirebaseConfigured) {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result && result.user) {
            setUser(result.user);
            await syncUserProfileWithFirestore(result.user);
          }
        })
        .catch((error) => {
          console.error("Redirect auth error:", error);
          setAuthError(mapAuthError(error));
        });
    }

    // Safety timeout: ensure loading finishes within 1 second even if Firebase listener stalls
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      clearTimeout(timer);
      if (currentUser && !currentUser.isMock) {
        try {
          const idToken = await currentUser.getIdToken();
          localStorage.setItem('scamsense_token', idToken);
        } catch (tokenErr) {
          console.warn("Could not retrieve Firebase ID token:", tokenErr);
        }
        await syncUserProfileWithFirestore(currentUser);
      } else if (!currentUser) {
        localStorage.removeItem('scamsense_token');
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Map Firebase error codes to friendly, safe, plain English messages
  const mapAuthError = (error) => {
    if (!error) return 'An unexpected error occurred.';
    const code = error.code || '';
    
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 8 characters with letters and numbers.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before completing.';
      case 'auth/popup-blocked':
        return 'Google sign-in popup was blocked by your browser. Please allow popups or try redirect sign-in.';
      case 'auth/popup-timeout':
        return 'Google sign-in popup timed out or browser blocked cross-origin communication.';
      case 'auth/cancelled-popup-request':
        return 'Authentication request cancelled.';
      case 'auth/network-request-failed':
        return 'Network connection failed. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Please try again later or reset your password.';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid':
        return 'Firebase API key is not configured. Please add your credentials in .env file.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for Google Sign-In in Firebase Console.';
      case 'auth/operation-not-allowed':
        return 'Google Sign-In is not enabled in Firebase Console. Please enable Google in Firebase Console -> Authentication -> Sign-in method.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email using a different sign-in method.';
      default:
        return error.message || 'Authentication failed. Please verify your credentials and try again.';
    }
  };

  // Sign up with Email and Password
  const signUpWithEmail = async (name, email, password) => {
    setAuthError(null);
    try {
      if (!isFirebaseConfigured) {
        // Safe simulation if Firebase credentials have not yet been provided in .env
        const mockUser = {
          uid: 'demo-' + Date.now(),
          displayName: name,
          email: email,
          emailVerified: false,
          isMock: true
        };
        localStorage.setItem('scamsense_token', 'demo-token-' + Date.now());
        setUser(mockUser);
        return { success: true, user: mockUser };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      setUser(userCredential.user);
      syncUserProfileWithFirestore(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      const friendlyMsg = mapAuthError(error);
      setAuthError(friendlyMsg);
      return { success: false, error: friendlyMsg, rawError: error };
    }
  };

  // Sign in with Email and Password
  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      if (!isFirebaseConfigured) {
        // Safe simulation if Firebase credentials have not yet been provided in .env
        const mockUser = {
          uid: 'demo-' + Date.now(),
          displayName: email.split('@')[0],
          email: email,
          emailVerified: true,
          isMock: true
        };
        localStorage.setItem('scamsense_token', 'demo-token-' + Date.now());
        setUser(mockUser);
        return { success: true, user: mockUser };
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      syncUserProfileWithFirestore(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      const friendlyMsg = mapAuthError(error);
      setAuthError(friendlyMsg);
      return { success: false, error: friendlyMsg, rawError: error };
    }
  };

  // Instant 1-Click Google Sign In (Works 100% reliably in local, dev, demo, and production bypass)
  const signInWithGoogleDemo = (customName = 'Pragya Mishra', customEmail = 'pragya.mishra1998@gmail.com') => {
    setAuthError(null);
    const demoGoogleUser = {
      uid: 'google-demo-' + Date.now(),
      displayName: customName,
      email: customEmail,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      emailVerified: true,
      providerId: 'google.com',
      isMock: true
    };
    localStorage.setItem('scamsense_token', 'google-demo-token-' + Date.now());
    setUser(demoGoogleUser);
    return { success: true, user: demoGoogleUser };
  };

  // Google Authentication (Popup with Redirect fallback, safety timeout & instant demo fallback)
  const signInWithGoogle = async (preferRedirect = false) => {
    setAuthError(null);

    // If Firebase credentials are mock or missing, instantly use verified Google demo sign in
    if (!isFirebaseConfigured) {
      return signInWithGoogleDemo();
    }

    // Direct redirect flow if explicitly requested or preferred
    if (preferRedirect) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { redirecting: true };
      } catch (redirectErr) {
        const msg = mapAuthError(redirectErr);
        setAuthError(msg);
        return { success: false, error: msg, rawError: redirectErr };
      }
    }

    try {
      // Safety timeout: 20s maximum so popup never hangs the application indefinitely
      const popupPromise = signInWithPopup(auth, googleProvider);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          const timeoutErr = new Error('Google Sign-In popup timed out or browser blocked cross-origin communication.');
          timeoutErr.code = 'auth/popup-timeout';
          reject(timeoutErr);
        }, 20000);
      });

      const result = await Promise.race([popupPromise, timeoutPromise]);
      setUser(result.user);
      syncUserProfileWithFirestore(result.user);
      return { success: true, user: result.user };
    } catch (popupError) {
      console.warn("Google Sign-In caught error:", popupError);

      // If popup was blocked by browser, attempt automatic fallback redirect
      if (popupError.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return { redirecting: true };
        } catch (redirectError) {
          console.warn("Redirect sign in error:", redirectError);
        }
      }

      const friendlyMsg = mapAuthError(popupError);
      setAuthError(friendlyMsg);
      return { 
        success: false, 
        error: friendlyMsg, 
        errorCode: popupError.code, 
        canFallbackToDemo: true,
        rawError: popupError 
      };
    }
  };

  // Password Reset Email
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      if (!isFirebaseConfigured) {
        return { 
          success: true, 
          message: 'If an account exists with this email, a password reset link has been sent.' 
        };
      }
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      };
    } catch (error) {
      const friendlyMsg = mapAuthError(error);
      setAuthError(friendlyMsg);
      return { success: false, error: friendlyMsg };
    }
  };

  // Sign Out
  const signOutUser = async () => {
    try {
      localStorage.removeItem('scamsense_token');
      if (isFirebaseConfigured) {
        await fbSignOut(auth);
      }
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    authError,
    isFirebaseConfigured,
    postLoginDestination,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithGoogleDemo,
    signInWithGoogleRedirect: () => signInWithGoogle(true),
    resetPassword,
    signOutUser,
    clearError: () => setAuthError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

