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
  isFirebaseConfigured 
} from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Configurable post-login destination
  const postLoginDestination = import.meta.env.VITE_POST_LOGIN_REDIRECT || '/dashboard';

  useEffect(() => {
    // Check for redirect result if mobile redirect was used
    if (isFirebaseConfigured) {
      getRedirectResult(auth)
        .then((result) => {
          if (result && result.user) {
            setUser(result.user);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      clearTimeout(timer);
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
        return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/cancelled-popup-request':
        return 'Authentication request cancelled.';
      case 'auth/network-request-failed':
        return 'Network connection failed. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Please try again later or reset your password.';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid':
        return 'Firebase API key is not configured. Please add your credentials in .env file.';
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
        setUser(mockUser);
        return { success: true, user: mockUser };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      setUser(userCredential.user);
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
        setUser(mockUser);
        return { success: true, user: mockUser };
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      const friendlyMsg = mapAuthError(error);
      setAuthError(friendlyMsg);
      return { success: false, error: friendlyMsg, rawError: error };
    }
  };

  // Google Authentication (Popup with Redirect fallback)
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      if (!isFirebaseConfigured) {
        const mockUser = {
          uid: 'google-demo-' + Date.now(),
          displayName: 'Google Demo User',
          email: 'user@gmail.com',
          photoURL: 'https://lh3.googleusercontent.com/a/default-user',
          isMock: true
        };
        setUser(mockUser);
        return { success: true, user: mockUser };
      }

      try {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
        return { success: true, user: result.user };
      } catch (popupError) {
        // If popup is blocked or mobile unsupported, try redirect
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          await signInWithRedirect(auth, googleProvider);
          return { redirecting: true };
        }
        throw popupError;
      }
    } catch (error) {
      const friendlyMsg = mapAuthError(error);
      setAuthError(friendlyMsg);
      return { success: false, error: friendlyMsg, rawError: error };
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
