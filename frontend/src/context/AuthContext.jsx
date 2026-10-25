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
import { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Configurable post-login destination
  const postLoginDestination = import.meta.env.VITE_POST_LOGIN_REDIRECT || '/dashboard';

  useEffect(() => {
    let isMounted = true;

    // Safety timeout: ensure loading finishes within 1.2 seconds maximum
    const timer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 1200);

    // Handler for expired backend JWT sessions
    const handleAuthExpired = () => {
      localStorage.removeItem('scamsense_token');
      localStorage.removeItem('scamsense_user');
      if (isMounted) {
        setUser(null);
      }
    };
    window.addEventListener('scamsense_auth_expired', handleAuthExpired);

    // Validate a stored backend JWT token
    const validateBackendSession = async () => {
      const token = localStorage.getItem('scamsense_token');
      if (!token) {
        localStorage.removeItem('scamsense_user');
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const meRes = await getMe();
        if (isMounted && meRes && meRes.data) {
          const validatedUser = {
            uid: String(meRes.data.id),
            displayName: meRes.data.full_name || meRes.data.email.split('@')[0],
            email: meRes.data.email,
            role: meRes.data.role || 'user',
            providerId: 'password'
          };
          setUser(validatedUser);
          localStorage.setItem('scamsense_user', JSON.stringify(validatedUser));
        }
      } catch (err) {
        // Token is invalid or expired
        if (isMounted) {
          localStorage.removeItem('scamsense_token');
          localStorage.removeItem('scamsense_user');
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Check for mobile redirect result from Firebase Google sign-in
    if (isFirebaseConfigured) {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result && result.user && isMounted) {
            setUser(result.user);
            try {
              const idToken = await result.user.getIdToken();
              localStorage.setItem('scamsense_token', idToken);
              localStorage.setItem('scamsense_user', JSON.stringify({
                uid: result.user.uid,
                displayName: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                emailVerified: result.user.emailVerified,
                providerId: result.user.providerData?.[0]?.providerId || 'google.com'
              }));
            } catch (tokErr) {}
            syncUserProfileWithFirestore(result.user);
          }
        })
        .catch((error) => {
          console.error("Redirect auth error:", error);
          if (isMounted) setAuthError(mapAuthError(error));
        });

      // Subscribe to Firebase auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        clearTimeout(timer);
        if (currentUser && !currentUser.isMock) {
          if (isMounted) setUser(currentUser);
          try {
            const idToken = await currentUser.getIdToken();
            localStorage.setItem('scamsense_token', idToken);
            localStorage.setItem('scamsense_user', JSON.stringify({
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              emailVerified: currentUser.emailVerified,
              providerId: currentUser.providerData?.[0]?.providerId || 'google.com'
            }));
          } catch (tokenErr) {
            console.warn("Could not retrieve Firebase ID token:", tokenErr);
          }
          syncUserProfileWithFirestore(currentUser);
          if (isMounted) setLoading(false);
        } else {
          // Firebase reports no current user; check if valid backend JWT session exists
          await validateBackendSession();
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
        clearTimeout(timer);
        window.removeEventListener('scamsense_auth_expired', handleAuthExpired);
      };
    } else {
      // Firebase not configured; validate against backend session
      validateBackendSession();

      return () => {
        isMounted = false;
        clearTimeout(timer);
        window.removeEventListener('scamsense_auth_expired', handleAuthExpired);
      };
    }
  }, []);

  // Map Firebase error codes to friendly, safe, plain English messages
  const mapAuthError = (error) => {
    if (!error) return 'An unexpected error occurred.';
    const code = error.code || '';
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
    
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
        return 'Google sign-in popup was blocked by your browser. Please allow popups or use Google Redirect sign-in.';
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
        return 'Firebase API key is invalid or not yet configured.';
      case 'auth/unauthorized-domain':
        return `Domain '${currentHost}' is not authorized for Google Sign-In in Firebase Console. Add '${currentHost}' to Firebase Console -> Authentication -> Settings -> Authorized domains.`;
      case 'auth/operation-not-allowed':
        return 'Google Sign-In is not enabled in Firebase Console. Please enable Google in Firebase Console -> Authentication -> Sign-in method.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email using a different sign-in method.';
      default:
        return error.message || 'Authentication failed. Please verify your credentials and try again.';
    }
  };

  // Sign up with Email and Password: creates independent user account in backend & Firebase
  const signUpWithEmail = async (name, email, password) => {
    setAuthError(null);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name ? name.trim() : trimmedEmail.split('@')[0];

      // 1. Create user account on backend
      let backendRegistered = false;
      try {
        await registerUser(trimmedEmail, password, trimmedName);
        backendRegistered = true;
      } catch (beErr) {
        const beMsg = beErr.response?.data?.detail;
        if (beMsg && beMsg.includes('already exists')) {
          setAuthError('An account already exists with this email. Please sign in instead.');
          return { success: false, error: 'An account already exists with this email. Please sign in instead.' };
        }
      }

      // 2. Also register in Firebase if configured
      if (isFirebaseConfigured) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
          if (trimmedName && userCredential.user) {
            await updateProfile(userCredential.user, { displayName: trimmedName });
          }
          const freshUser = {
            uid: userCredential.user.uid,
            displayName: trimmedName,
            email: trimmedEmail,
            photoURL: userCredential.user.photoURL || '',
            emailVerified: userCredential.user.emailVerified,
            providerId: 'password'
          };
          setUser(freshUser);
          try {
            const idToken = await userCredential.user.getIdToken();
            localStorage.setItem('scamsense_token', idToken);
            localStorage.setItem('scamsense_user', JSON.stringify(freshUser));
          } catch (tErr) {}
          syncUserProfileWithFirestore(userCredential.user);
          return { success: true, user: freshUser };
        } catch (fbErr) {
          // If Firebase failed but backend succeeded, log in via backend
          if (backendRegistered) {
            const loginRes = await loginUser(trimmedEmail, password);
            const token = loginRes.data.access_token;
            const userData = {
              uid: String(loginRes.data.user_id),
              displayName: loginRes.data.full_name || trimmedName,
              email: loginRes.data.email || trimmedEmail,
              role: loginRes.data.role || 'user',
              providerId: 'password'
            };
            localStorage.setItem('scamsense_token', token);
            localStorage.setItem('scamsense_user', JSON.stringify(userData));
            setUser(userData);
            return { success: true, user: userData };
          }
          const friendlyMsg = mapAuthError(fbErr);
          setAuthError(friendlyMsg);
          return { success: false, error: friendlyMsg, rawError: fbErr };
        }
      }

      // 3. Log in with newly registered backend account
      const loginRes = await loginUser(trimmedEmail, password);
      const token = loginRes.data.access_token;
      const userData = {
        uid: String(loginRes.data.user_id),
        displayName: loginRes.data.full_name || trimmedName,
        email: loginRes.data.email || trimmedEmail,
        role: loginRes.data.role || 'user',
        providerId: 'password'
      };
      localStorage.setItem('scamsense_token', token);
      localStorage.setItem('scamsense_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const friendlyMsg = error.response?.data?.detail || mapAuthError(error);
      setAuthError(friendlyMsg);
      return { success: false, error: friendlyMsg, rawError: error };
    }
  };

  // Sign in with Email and Password: authenticates credentials dynamically
  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Try Firebase Authentication if configured
    if (isFirebaseConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        const fbUser = userCredential.user;
        const idToken = await fbUser.getIdToken();
        const userData = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || trimmedEmail.split('@')[0],
          email: fbUser.email || trimmedEmail,
          photoURL: fbUser.photoURL || '',
          emailVerified: fbUser.emailVerified,
          providerId: 'password'
        };
        localStorage.setItem('scamsense_token', idToken);
        localStorage.setItem('scamsense_user', JSON.stringify(userData));
        setUser(userData);
        syncUserProfileWithFirestore(fbUser);
        return { success: true, user: userData };
      } catch (fbErr) {
        console.warn("Firebase sign-in attempt notice:", fbErr.code);
        // If credentials invalid on Firebase, try backend database credentials
      }
    }

    // 2. Try Backend Database Authentication (JWT)
    try {
      const loginRes = await loginUser(trimmedEmail, password);
      if (loginRes && loginRes.data && loginRes.data.access_token) {
        const token = loginRes.data.access_token;
        const userData = {
          uid: String(loginRes.data.user_id),
          displayName: loginRes.data.full_name || trimmedEmail.split('@')[0],
          email: loginRes.data.email || trimmedEmail,
          role: loginRes.data.role || 'user',
          providerId: 'password'
        };
        localStorage.setItem('scamsense_token', token);
        localStorage.setItem('scamsense_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (beErr) {
      const friendlyMsg = beErr.response?.data?.detail || 'Incorrect email or password. Please try again.';
      setAuthError(friendlyMsg);
      return { success: false, error: friendlyMsg };
    }

    const fallbackMsg = 'Incorrect email or password. Please try again.';
    setAuthError(fallbackMsg);
    return { success: false, error: fallbackMsg };
  };

  // Google Authentication: uses genuine authenticated Google identity
  const signInWithGoogle = async (preferRedirect = false) => {
    setAuthError(null);

    if (!isFirebaseConfigured) {
      const errorMsg = 'Google Sign-In is not enabled. Please sign in with your email and password.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }

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
      const popupPromise = signInWithPopup(auth, googleProvider);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          const timeoutErr = new Error('Google Sign-In popup timed out or browser blocked cross-origin communication.');
          timeoutErr.code = 'auth/popup-timeout';
          reject(timeoutErr);
        }, 20000);
      });

      const result = await Promise.race([popupPromise, timeoutPromise]);
      const gUser = result.user;
      setUser(gUser);
      try {
        const idToken = await gUser.getIdToken();
        localStorage.setItem('scamsense_token', idToken);
        localStorage.setItem('scamsense_user', JSON.stringify({
          uid: gUser.uid,
          displayName: gUser.displayName,
          email: gUser.email,
          photoURL: gUser.photoURL,
          emailVerified: gUser.emailVerified,
          providerId: gUser.providerData?.[0]?.providerId || 'google.com'
        }));
      } catch (tokErr) {}
      syncUserProfileWithFirestore(gUser);
      return { success: true, user: gUser };
    } catch (popupError) {
      console.warn("Google Sign-In error:", popupError);
      const friendlyMsg = mapAuthError(popupError);
      setAuthError(friendlyMsg);
      return { 
        success: false, 
        error: friendlyMsg, 
        errorCode: popupError.code, 
        canUseRedirect: popupError.code === 'auth/popup-blocked',
        rawError: popupError 
      };
    }
  };

  // Password Reset Email
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      if (isFirebaseConfigured) {
        await sendPasswordResetEmail(auth, email.trim());
      }
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

  // Sign Out: completely destroys local session, tokens, and cached user state
  const signOutUser = async () => {
    try {
      localStorage.removeItem('scamsense_token');
      localStorage.removeItem('scamsense_user');
      if (isFirebaseConfigured) {
        await fbSignOut(auth);
      }
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      localStorage.removeItem('scamsense_token');
      localStorage.removeItem('scamsense_user');
      setUser(null);
      return { success: true };
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
