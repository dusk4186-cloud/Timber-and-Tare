// ============================================================
// BrewHub Firebase Authentication Service
// Supports real Firebase auth + graceful local session fallback
// ============================================================

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth'
import type { UserProfile, DeliveryDetails } from '../types'

// Re-export for convenience
export type { UserProfile }

// Config check
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isRealFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  firebaseConfig.projectId
)

let app: FirebaseApp | null = null
let auth: Auth | null = null

if (isRealFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[BrewHub] Firebase initialization warning, using local session fallback:', err)
  }
}

// Fallback session state in localStorage
const STORAGE_USER_KEY = 'brewhub_auth_user'
const STORAGE_REGISTERED_USERS_KEY = 'brewhub_registered_users'

type AuthListener = (user: UserProfile | null) => void
const authListeners = new Set<AuthListener>()

function notifyListeners(user: UserProfile | null) {
  authListeners.forEach(listener => listener(user))
}

function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY)
    if (raw) return JSON.parse(raw) as UserProfile
  } catch {
    // Ignore JSON errors
  }
  return null
}

function setStoredUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_USER_KEY)
    }
  } catch {
    // LocalStorage quota or access error
  }
}

// Password validation helper
export function validatePasswordRules(pass: string): {
  isValid: boolean
  min9: boolean
  hasCaps: boolean
  hasNumber: boolean
  hasSpecial: boolean
} {
  const min9 = pass.length >= 9
  const hasCaps = /[A-Z]/.test(pass)
  const hasNumber = /[0-9]/.test(pass)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?~`]/.test(pass)

  return {
    isValid: min9 && hasCaps && hasNumber && hasSpecial,
    min9,
    hasCaps,
    hasNumber,
    hasSpecial,
  }
}

// Listeners
if (auth) {
  onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      const stored = getStoredUser()
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Barista Friend'),
        photoURL: fbUser.photoURL,
        isAnonymous: fbUser.isAnonymous,
        deliveryAddress: stored?.deliveryAddress,
      }
      setStoredUser(profile)
      notifyListeners(profile)
    } else {
      setStoredUser(null)
      notifyListeners(null)
    }
  })
}

export function subscribeToAuth(callback: AuthListener): () => void {
  authListeners.add(callback)
  callback(getCurrentUser())
  return () => {
    authListeners.delete(callback)
  }
}

export function getCurrentUser(): UserProfile | null {
  if (auth && auth.currentUser) {
    const fbUser = auth.currentUser
    const stored = getStoredUser()
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Barista Friend'),
      photoURL: fbUser.photoURL,
      isAnonymous: fbUser.isAnonymous,
      deliveryAddress: stored?.deliveryAddress,
    }
  }
  return getStoredUser()
}

// Update current user delivery address
export function updateUserDeliveryAddress(address: DeliveryDetails): UserProfile | null {
  const current = getCurrentUser()
  if (!current) return null
  const updated: UserProfile = {
    ...current,
    deliveryAddress: address,
  }
  setStoredUser(updated)
  notifyListeners(updated)
  return updated
}

// Email Sign-In
export async function signInWithEmail(email: string, pass: string): Promise<UserProfile> {
  // Check Admin Credentials from git-ignored environment configuration
  const adminUser = (import.meta.env.VITE_ADMIN_USER || 'brewhub').trim().toLowerCase()
  const adminPass = import.meta.env.VITE_ADMIN_PASS
  const adminDisplayName = import.meta.env.VITE_ADMIN_DISPLAY_NAME || 'Brew'
  const adminRole = (import.meta.env.VITE_ADMIN_ROLE as 'admin') || 'admin'

  const normalizedInput = email.trim().toLowerCase()
  const isAdminMatch =
    normalizedInput === adminUser ||
    normalizedInput === `${adminUser}@brewhub.cafe` ||
    normalizedInput === `${adminUser}@gmail.com`

  if (adminPass && isAdminMatch && pass === adminPass) {
    await new Promise(r => setTimeout(r, 300))
    const profile: UserProfile = {
      uid: 'admin-brewhub-root',
      email: `${adminUser}@brewhub.cafe`,
      displayName: adminDisplayName,
      role: adminRole,
      photoURL: null,
      isAnonymous: false,
      deliveryAddress: {
        fullName: 'Brew (BrewHub Administrator)',
        phone: '+91 80 4242 8888',
        addressLine1: 'BrewHub Flagship Roastery, 42 Arabica Lane',
        addressLine2: 'Indiranagar',
        city: 'Bengaluru',
        pinCode: '560001',
        deliveryWindow: 'immediate',
        specialInstructions: 'Head Barista & Admin Desk',
      },
    }
    setStoredUser(profile)
    notifyListeners(profile)
    return profile
  }
  if (auth) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass)
      const stored = getStoredUser()
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || email.split('@')[0],
        photoURL: res.user.photoURL,
        isAnonymous: false,
        deliveryAddress: stored?.deliveryAddress,
      }
      setStoredUser(profile)
      notifyListeners(profile)
      return profile
    } catch (err: unknown) {
      throw new Error((err as { message?: string }).message || 'Failed to sign in')
    }
  }

  // Graceful Local Mock
  await new Promise(r => setTimeout(r, 450))
  if (!email || !pass) {
    throw new Error('Please enter both email and password.')
  }
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address.')
  }
  if (pass.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }

  // Check if we have registered user info with saved address
  let savedAddress: DeliveryDetails | undefined
  try {
    const listRaw = localStorage.getItem(STORAGE_REGISTERED_USERS_KEY)
    if (listRaw) {
      const list = JSON.parse(listRaw)
      const found = list.find((u: { email: string; address?: DeliveryDetails }) => u.email.toLowerCase() === email.toLowerCase())
      if (found?.address) {
        savedAddress = found.address
      }
    }
  } catch {
    // Ignore
  }

  const profile: UserProfile = {
    uid: `local-${Date.now()}`,
    email,
    displayName: email.split('@')[0].replace(/[._-]/g, ' '),
    photoURL: null,
    isAnonymous: false,
    deliveryAddress: savedAddress,
  }
  setStoredUser(profile)
  notifyListeners(profile)
  return profile
}

// Email Sign-Up with strict 9+ character password rules & optional address
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName?: string,
  deliveryAddress?: DeliveryDetails
): Promise<UserProfile> {
  const rules = validatePasswordRules(pass)
  if (!rules.isValid) {
    throw new Error('Password must be at least 9 characters long, contain 1 uppercase letter, 1 number, and 1 special symbol.')
  }

  if (auth) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass)
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: displayName || email.split('@')[0],
        photoURL: res.user.photoURL,
        isAnonymous: false,
        deliveryAddress,
      }
      setStoredUser(profile)
      notifyListeners(profile)
      return profile
    } catch (err: unknown) {
      throw new Error((err as { message?: string }).message || 'Failed to create account')
    }
  }

  // Graceful Local Mock
  await new Promise(r => setTimeout(r, 550))
  if (!email || !pass) {
    throw new Error('Please provide email and password.')
  }
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address.')
  }

  const name = displayName?.trim() || email.split('@')[0].replace(/[._-]/g, ' ')
  const profile: UserProfile = {
    uid: `local-${Date.now()}`,
    email,
    displayName: name,
    photoURL: null,
    isAnonymous: false,
    deliveryAddress,
  }

  // Store in registered users list with address
  try {
    const listRaw = localStorage.getItem(STORAGE_REGISTERED_USERS_KEY)
    const list = listRaw ? JSON.parse(listRaw) : []
    list.push({ email, name, address: deliveryAddress, createdAt: new Date().toISOString() })
    localStorage.setItem(STORAGE_REGISTERED_USERS_KEY, JSON.stringify(list))
  } catch {
    // Ignore storage issues
  }

  setStoredUser(profile)
  notifyListeners(profile)
  return profile
}

// Google Sign-In
export async function signInWithGoogle(): Promise<UserProfile> {
  if (auth) {
    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)
      const stored = getStoredUser()
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || 'BrewHub Guest',
        photoURL: res.user.photoURL,
        isAnonymous: false,
        deliveryAddress: stored?.deliveryAddress,
      }
      setStoredUser(profile)
      notifyListeners(profile)
      return profile
    } catch (err: unknown) {
      throw new Error((err as { message?: string }).message || 'Google Sign-In canceled or unavailable')
    }
  }

  // Graceful Local Mock for Google Sign-In
  await new Promise(r => setTimeout(r, 600))
  const profile: UserProfile = {
    uid: `google-${Date.now()}`,
    email: 'alex.coffee@gmail.com',
    displayName: 'Alex Rivers',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isAnonymous: false,
    deliveryAddress: {
      fullName: 'Alex Rivers',
      phone: '+91 98765 43210',
      addressLine1: '4th Floor, Tech Hub Tower, 100 Feet Road',
      addressLine2: 'Opposite City Center',
      city: 'Bengaluru',
      pinCode: '560001',
      deliveryWindow: 'immediate',
      specialInstructions: 'Ring doorbell, leave at front desk if unavailable',
    },
  }
  setStoredUser(profile)
  notifyListeners(profile)
  return profile
}

// Continue as Guest
export function continueAsGuest(): UserProfile {
  const profile: UserProfile = {
    uid: `guest-${Date.now()}`,
    email: null,
    displayName: 'Guest Coffee Lover',
    photoURL: null,
    isAnonymous: true,
  }
  setStoredUser(profile)
  notifyListeners(profile)
  return profile
}

// Sign Out
export async function signOutUser(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth)
    } catch {
      // Continue to clear local store
    }
  }
  setStoredUser(null)
  notifyListeners(null)
}
