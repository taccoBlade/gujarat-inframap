import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  Firestore 
} from 'firebase/firestore';
import { UserPassportProfile } from '../types/atlas';

// Firebase configuration from environment or empty placeholders
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== '' && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== ''
);

let app: FirebaseApp | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('[Firebase] Initialization error, falling back to local mode:', err);
  }
}

export { app, auth, db, googleProvider };

/**
 * Standard Indian Phone Number Validator (+91 followed by 10 digits starting with 6-9)
 */
export function isValidIndianPhoneNumber(phoneNumber: string): boolean {
  const formatted = phoneNumber.trim().replace(/\s+/g, '');
  return /^\+91[6-9]\d{9}$/.test(formatted);
}

/**
 * Perform Google One-Tap / Popup sign-in
 */
export async function loginWithGoogle(): Promise<{ success: boolean; user?: UserPassportProfile; error?: string }> {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const cleanName = (fbUser.displayName || 'Gujarat Explorer').slice(0, 100);
      const profile: UserPassportProfile = {
        uid: fbUser.uid,
        name: cleanName,
        email: fbUser.email || undefined,
        photoURL: fbUser.photoURL || undefined,
        handle: `@${cleanName.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30)}`,
        authProvider: 'google',
        homeDistrict: 'ahmedabad',
        collectedStampIds: ['ahmedabad'],
        bookmarkedStoryIds: [],
        visitedPlaceIds: [],
        badges: ['solanki_explorer'],
        joinedDate: new Date().toISOString().split('T')[0],
        isLoggedIn: true
      };

      // Attempt cloud sync if firestore available
      await syncProfileToFirestore(profile);
      return { success: true, user: profile };
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Sign-in window was closed before completion.' };
      }
      if (code === 'auth/unauthorized-domain') {
        return { success: false, error: 'Origin domain is not authorized in Google OAuth console.' };
      }
      // In production, never disguise real failure with demo accounts
      if (import.meta.env.PROD) {
        return { success: false, error: 'Google sign-in could not be completed securely. Please try again.' };
      }
      console.warn('[Firebase Auth] Live popup failed in development, providing dev fallback:', err);
    }
  }

  // Strictly gate demo fallback to non-production environments
  if (import.meta.env.PROD) {
    return { 
      success: false, 
      error: 'Google Sign-In is not configured for this production environment. Please configure Firebase API credentials.' 
    };
  }

  // Development/Local Testing Demo Identity
  const demoProfile: UserPassportProfile = {
    uid: 'google_demo_' + Date.now().toString(36),
    name: 'Saumya Patel',
    email: 'saumya.patel@gujaratatlas.in',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    handle: '@saumya_patel',
    authProvider: 'google',
    homeDistrict: 'ahmedabad',
    collectedStampIds: ['ahmedabad', 'patan', 'gandhinagar'],
    bookmarkedStoryIds: ['story-signature-farm', 'story-dumas-beach'],
    visitedPlaceIds: ['ahmedabad', 'patan'],
    badges: ['solanki_explorer'],
    joinedDate: new Date().toISOString().split('T')[0],
    isLoggedIn: true
  };

  return { success: true, user: demoProfile };
}

/**
 * Setup RecaptchaVerifier for Phone Auth
 */
let activeRecaptchaVerifier: RecaptchaVerifier | null = null;

export function setupRecaptcha(containerId: string): RecaptchaVerifier | null {
  if (!isFirebaseConfigured || !auth) return null;
  try {
    if (activeRecaptchaVerifier) {
      activeRecaptchaVerifier.clear();
      activeRecaptchaVerifier = null;
    }
    activeRecaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved - allow phone auth to proceed
      },
      'expired-callback': () => {
        console.warn('[reCAPTCHA] Challenge expired, reset required.');
      }
    });
    return activeRecaptchaVerifier;
  } catch (e) {
    console.warn('reCAPTCHA setup warning:', e);
    return null;
  }
}

export function clearRecaptcha(): void {
  if (activeRecaptchaVerifier) {
    try {
      activeRecaptchaVerifier.clear();
    } catch (_) {}
    activeRecaptchaVerifier = null;
  }
}

/**
 * Send Phone OTP Verification
 */
export async function sendPhoneOtp(
  phoneNumber: string, 
  verifier?: RecaptchaVerifier
): Promise<{ success: boolean; confirmationResult?: ConfirmationResult; mockCode?: string; error?: string }> {
  const formatted = phoneNumber.trim().replace(/\s+/g, '');
  if (!isValidIndianPhoneNumber(formatted)) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number (+91).' };
  }

  if (isFirebaseConfigured && auth) {
    const v = verifier || activeRecaptchaVerifier;
    if (v) {
      try {
        const confirmationResult = await signInWithPhoneNumber(auth, formatted, v);
        return { success: true, confirmationResult };
      } catch (err: any) {
        console.warn('[Firebase Phone Auth] Error during phone auth dispatch:', err?.code);
        if (err?.code === 'auth/too-many-requests') {
          return { success: false, error: 'Too many requests. Please wait a few minutes before trying again.' };
        }
        if (err?.code === 'auth/invalid-phone-number') {
          return { success: false, error: 'The mobile number provided is invalid.' };
        }
        if (err?.code === 'auth/captcha-check-failed') {
          return { success: false, error: 'reCAPTCHA verification failed. Please try again.' };
        }
        if (import.meta.env.PROD) {
          return { success: false, error: 'Unable to dispatch verification SMS. Please verify your connection or try again later.' };
        }
      }
    }
  }

  // In production, never return mock OTP bypasses
  if (import.meta.env.PROD) {
    return { 
      success: false, 
      error: 'Phone authentication is not configured in this environment. Please configure Firebase Phone Auth.' 
    };
  }

  // Development & controlled test fallback OTP
  return { 
    success: true, 
    mockCode: '789012' // Predictable OTP strictly in non-production local development
  };
}

/**
 * Confirm Phone OTP Verification
 */
export async function verifyPhoneOtp(
  code: string,
  confirmationResult?: ConfirmationResult,
  phoneNumber?: string
): Promise<{ success: boolean; user?: UserPassportProfile; error?: string }> {
  const cleanCode = code.trim();
  if (!/^\d{6}$/.test(cleanCode)) {
    return { success: false, error: 'Please enter a valid 6-digit verification code.' };
  }

  if (confirmationResult) {
    try {
      const res = await confirmationResult.confirm(cleanCode);
      const fbUser = res.user;
      const profile: UserPassportProfile = {
        uid: fbUser.uid,
        name: 'Patel Pravasi',
        phoneNumber: fbUser.phoneNumber || phoneNumber || '+91 98765 43210',
        handle: `@pravasi_${cleanCode.slice(-3)}`,
        authProvider: 'phone',
        homeDistrict: 'surat',
        collectedStampIds: ['surat'],
        bookmarkedStoryIds: [],
        visitedPlaceIds: ['surat'],
        badges: ['coastal_nomad'],
        joinedDate: new Date().toISOString().split('T')[0],
        isLoggedIn: true
      };
      await syncProfileToFirestore(profile);
      return { success: true, user: profile };
    } catch (err: any) {
      if (err?.code === 'auth/invalid-verification-code') {
        return { success: false, error: 'Invalid verification code. Please check and try again.' };
      }
      if (err?.code === 'auth/code-expired') {
        return { success: false, error: 'This verification code has expired. Please request a new one.' };
      }
      return { success: false, error: 'Verification failed. Please try again.' };
    }
  }

  // In production, confirmationResult is mandatory; no mock bypass allowed
  if (import.meta.env.PROD) {
    return { success: false, error: 'Missing active verification session. Please request a new OTP code.' };
  }

  // Development mode fallback
  const demoProfile: UserPassportProfile = {
    uid: 'phone_' + Date.now().toString(36),
    name: 'Pravasi Gujarat',
    phoneNumber: phoneNumber || '+91 98765 43210',
    handle: '@gujarat_pravasi',
    authProvider: 'phone',
    homeDistrict: 'surat',
    collectedStampIds: ['surat', 'navsari'],
    bookmarkedStoryIds: ['story-dumas-beach'],
    visitedPlaceIds: ['surat'],
    badges: ['coastal_nomad'],
    joinedDate: new Date().toISOString().split('T')[0],
    isLoggedIn: true
  };
  return { success: true, user: demoProfile };
}

/**
 * Sync User Profile to Firestore with Strict Ownership Validation & Sanitization
 */
export async function syncProfileToFirestore(profile: UserPassportProfile): Promise<boolean> {
  if (!isFirebaseConfigured || !db || !profile.uid) return false;

  // Authorization Check: Prevent User A from writing to User B's profile
  if (auth?.currentUser && auth.currentUser.uid !== profile.uid) {
    console.error('[Security] Unauthorized attempt to sync profile: UID mismatch with authenticated session.');
    return false;
  }

  try {
    const userDocRef = doc(db, 'users', profile.uid);

    // Whitelist and sanitize profile payload
    const sanitizedData = {
      uid: profile.uid,
      name: String(profile.name || '').slice(0, 100),
      handle: String(profile.handle || '').slice(0, 50),
      email: profile.email ? String(profile.email).slice(0, 120) : null,
      phoneNumber: profile.phoneNumber ? String(profile.phoneNumber).slice(0, 20) : null,
      photoURL: profile.photoURL ? String(profile.photoURL).slice(0, 300) : null,
      authProvider: profile.authProvider || 'google',
      homeDistrict: String(profile.homeDistrict || 'ahmedabad').slice(0, 50),
      collectedStampIds: Array.isArray(profile.collectedStampIds) 
        ? profile.collectedStampIds.slice(0, 34).map(String) 
        : ['ahmedabad'],
      bookmarkedStoryIds: Array.isArray(profile.bookmarkedStoryIds) 
        ? profile.bookmarkedStoryIds.slice(0, 100).map(String) 
        : [],
      visitedPlaceIds: Array.isArray(profile.visitedPlaceIds) 
        ? profile.visitedPlaceIds.slice(0, 100).map(String) 
        : [],
      badges: Array.isArray(profile.badges) 
        ? profile.badges.slice(0, 20).map(String) 
        : ['solanki_explorer'],
      joinedDate: profile.joinedDate || new Date().toISOString().split('T')[0],
      isLoggedIn: true,
      lastCheckedInDistrict: profile.lastCheckedInDistrict ? String(profile.lastCheckedInDistrict) : null,
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, sanitizedData, { merge: true });
    return true;
  } catch (e) {
    console.error('[Firestore] Sync error:', e);
    return false;
  }
}

/**
 * Fetch User Profile from Firestore with Identity Isolation
 */
export async function fetchProfileFromFirestore(uid: string): Promise<UserPassportProfile | null> {
  if (!isFirebaseConfigured || !db) return null;

  // Authorization Check: Prevent client-side inspection of other user profiles
  if (auth?.currentUser && auth.currentUser.uid !== uid) {
    console.error('[Security] Unauthorized attempt to read another user profile.');
    return null;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserPassportProfile;
    }
  } catch (e) {
    console.error('[Firestore] Fetch error:', e);
  }
  return null;
}

/**
 * Sign Out & Revoke Local Authentication State
 */
export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut warning:', e);
    }
  }
}

/**
 * Initialize Firebase Auth State Listener
 */
export function initAuthListener(onUserChanged: (user: FirebaseUser | null) => void): (() => void) | null {
  if (!isFirebaseConfigured || !auth) return null;
  return onAuthStateChanged(auth, onUserChanged);
}
