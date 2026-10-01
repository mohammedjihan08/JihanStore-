import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, OperationType, handleFirestoreError } from '../lib/firebase';
import { UserProfile } from '../types';

export const ADMIN_EMAIL = 'mohammedjihan08@gmail.com';
export const FIREBASE_PROJECT_ID = 'brave-aloe-hv9wh';

// Translate Firebase Auth error codes to clear Bengali messages
export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/operation-not-allowed':
      return 'Firebase Console-এ Email/Password প্রোভাইডার চালু (Enable) করা প্রয়োজন। Firebase Console > Authentication > Sign-in method-এ গিয়ে Email/Password সক্রিয় করুন, অথবা নিচে Google দিয়ে ১-ক্লিকে সাইন ইন করুন।';
    case 'auth/invalid-email':
      return 'সঠিক ও কার্যকর ইমেইল এড্রেস লিখুন।';
    case 'auth/user-not-found':
      return 'এই ইমেইল দিয়ে কোনো একাউন্ট পাওয়া যায়নি। নতুন একাউন্ট তৈরি করুন।';
    case 'auth/wrong-password':
      return 'ভুল পাসওয়ার্ড। দয়া করে সঠিক পাসওয়ার্ড প্রদান করুন।';
    case 'auth/invalid-credential':
      return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেক করুন।';
    case 'auth/email-already-in-use':
      return 'এই ইমেইল দিয়ে ইতিমধ্যে একটি একাউন্ট রয়েছে। দয়া করে লগইন করুন।';
    case 'auth/weak-password':
      return 'পাসওয়ার্ড অত্যন্ত দুর্বল। অন্তত ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।';
    case 'auth/too-many-requests':
      return 'অনেকবার ভুল চেষ্টা করা হয়েছে। নিরাপত্তার স্বার্থে কিছুক্ষণ পর চেষ্টা করুন।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগ বিঘ্নিত হয়েছে। নেটওয়ার্ক চেক করে আবার চেষ্টা করুন।';
    default:
      return 'অথেন্টিকেশনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
  }
}

// 1. Customer Sign In
export async function loginCustomer(email: string, pass: string): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const user = credential.user;

  // Retrieve user document from Firestore
  const userDocRef = doc(db, 'users', user.uid);
  let profile: UserProfile;

  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      profile = snap.data() as UserProfile;
    } else {
      // Fallback profile if record wasn't created yet
      profile = {
        id: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || email,
        phone: '',
        address: '',
        city: 'Dhaka',
        role: user.email === ADMIN_EMAIL ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(userDocRef, profile);
      } catch (err) {
        console.warn('Could not persist default profile to Firestore:', err);
      }
    }
  } catch (error) {
    console.warn('Could not read user profile from Firestore, using auth fallback:', error);
    profile = {
      id: user.uid,
      name: user.displayName || email.split('@')[0],
      email: user.email || email,
      phone: '',
      address: '',
      city: 'Dhaka',
      role: user.email === ADMIN_EMAIL ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    };
  }

  return profile;
}

// 2. Customer Sign Up
export async function registerCustomer(params: {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
}): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, params.email.trim(), params.password);
  const user = credential.user;

  // Update Auth Profile Display Name
  await updateProfile(user, { displayName: params.name });

  const role = user.email === ADMIN_EMAIL ? 'admin' : 'customer';

  // Securely store profile in Firestore (NEVER passwords)
  const newProfile: UserProfile = {
    id: user.uid,
    name: params.name.trim(),
    email: params.email.trim(),
    phone: params.phone.trim(),
    address: params.address?.trim() || '',
    city: 'Dhaka',
    role,
    createdAt: new Date().toISOString()
  };

  const userDocRef = doc(db, 'users', user.uid);
  try {
    await setDoc(userDocRef, {
      uid: user.uid,
      name: newProfile.name,
      email: newProfile.email,
      phone: newProfile.phone,
      address: newProfile.address,
      city: newProfile.city,
      role: newProfile.role,
      createdAt: newProfile.createdAt
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    throw error;
  }

  return newProfile;
}

// 3. Password Reset
export async function resetCustomerPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

// 4. Sign Out
export async function logoutCustomer(): Promise<void> {
  await signOut(auth);
}

// 5. Fetch Profile by UID
export async function getCustomerProfile(uid: string): Promise<UserProfile | null> {
  const userDocRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch user profile from Firestore:', error);
    return null;
  }
}

// 6. Check if email is Admin
export function isUserAdmin(user: FirebaseUser | null, profile?: UserProfile | null): boolean {
  if (!user) return false;
  if (user.email === ADMIN_EMAIL) return true;
  if (profile?.role === 'admin') return true;
  return false;
}

// 7. Google 1-Click Sign In (Pre-configured by Firebase)
export async function loginWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  const userDocRef = doc(db, 'users', user.uid);
  let profile: UserProfile;

  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      profile = snap.data() as UserProfile;
    } else {
      profile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: '',
        city: 'Dhaka',
        role: user.email === ADMIN_EMAIL ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(userDocRef, profile);
      } catch (err) {
        console.warn('Could not persist Google user profile:', err);
      }
    }
  } catch (error) {
    profile = {
      id: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Customer',
      email: user.email || '',
      phone: user.phoneNumber || '',
      address: '',
      city: 'Dhaka',
      role: user.email === ADMIN_EMAIL ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    };
  }

  return profile;
}

