import { storage, db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface LogoOperationResult {
  success: boolean;
  logoUrl: string;
  source: 'firebase-storage' | 'server-storage' | 'direct-url';
  message: string;
}

/**
 * Upload a logo file:
 * 1. Attempts direct upload to Firebase Storage
 * 2. If Firebase Storage fails or is unavailable, uploads to server storage via /api/logo/upload
 * 3. Persists the resulting URL in Firestore (doc: settings/general) and localStorage
 */
export async function uploadAndPersistLogo(file: File): Promise<LogoOperationResult> {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop() || 'png';
  const cleanFileName = `store_logo_${timestamp}.${fileExt}`;

  let finalUrl = '';
  let source: 'firebase-storage' | 'server-storage' = 'server-storage';

  // Step 1: Try Firebase Storage
  try {
    const storageRef = ref(storage, `logos/${cleanFileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    if (downloadUrl && downloadUrl.startsWith('http')) {
      finalUrl = `${downloadUrl}&v=${timestamp}`;
      source = 'firebase-storage';
    }
  } catch (firebaseErr) {
    console.warn('Firebase Storage direct upload not available, using server storage:', firebaseErr);
  }

  // Step 2: If Firebase Storage was not used, upload via server API
  if (!finalUrl) {
    const base64Data = await readFileAsDataURL(file);
    const response = await fetch('/api/logo/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl: base64Data,
        fileName: cleanFileName,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'সার্ভারে লোগো আপলোড ব্যর্থ হয়েছে।');
    }
    finalUrl = data.logoUrl;
    source = 'server-storage';
  }

  // Step 3: Persist to Firestore Database & LocalStorage
  await persistLogoUrlToDatabase(finalUrl);

  return {
    success: true,
    logoUrl: finalUrl,
    source,
    message: 'লোগো সফলভাবে আপলোড ও ডাটাবেজে স্থায়ীভাবে সেভ হয়েছে!',
  };
}

/**
 * Apply an online image URL as the logo
 */
export async function applyOnlineLogoUrl(url: string): Promise<LogoOperationResult> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error('দয়া করে সঠিক লোগো URL প্রদান করুন।');
  }

  // Notify server of the new URL
  try {
    await fetch('/api/logo/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onlineUrl: cleanUrl }),
    });
  } catch {}

  // Persist to Firestore
  await persistLogoUrlToDatabase(cleanUrl);

  return {
    success: true,
    logoUrl: cleanUrl,
    source: 'direct-url',
    message: 'লোগো URL সফলভাবে ডাটাবেজে স্থায়ীভাবে সেভ হয়েছে!',
  };
}

/**
 * Delete and completely remove custom logo:
 * 1. Attempts removal from Firebase Storage (if stored there)
 * 2. Deletes from server storage (/api/logo)
 * 3. Sets logoUrl: "" in Firestore (settings/general) and localStorage
 */
export async function deleteAndRemoveLogo(currentUrl?: string): Promise<boolean> {
  // 1. Try Firebase Storage delete if applicable
  if (currentUrl && currentUrl.includes('firebasestorage.googleapis.com')) {
    try {
      const match = currentUrl.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        const decodedPath = decodeURIComponent(match[1]);
        const storageRef = ref(storage, decodedPath);
        await deleteObject(storageRef);
      }
    } catch (err) {
      console.warn('Firebase Storage file delete notice:', err);
    }
  }

  // 2. Delete from server disk storage
  try {
    await fetch('/api/logo', { method: 'DELETE' });
  } catch (err) {
    console.warn('Server logo delete notice:', err);
  }

  // 3. Clear from Firestore Database
  await persistLogoUrlToDatabase('');

  return true;
}

/**
 * Get active logo from Database or Server
 */
export async function fetchActiveLogoUrl(): Promise<string> {
  // 1. Try Firestore
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.logoUrl === 'string') {
        return data.logoUrl;
      }
    }
  } catch (err) {
    console.warn('Could not read logo from Firestore:', err);
  }

  // 2. Try Server fallback
  try {
    const res = await fetch('/api/logo');
    if (res.ok) {
      const data = await res.json();
      if (data && data.logoUrl) {
        return data.logoUrl;
      }
    }
  } catch {}

  return '';
}

/**
 * Persist logoUrl to Firestore and localStorage
 */
async function persistLogoUrlToDatabase(logoUrl: string): Promise<void> {
  // LocalStorage update
  try {
    const saved = localStorage.getItem('jihan_store_settings');
    const existing = saved ? JSON.parse(saved) : {};
    existing.logoUrl = logoUrl;
    localStorage.setItem('jihan_store_settings', JSON.stringify(existing));
  } catch {}

  // Firestore update
  try {
    await setDoc(doc(db, 'settings', 'general'), { logoUrl }, { merge: true });
  } catch (err) {
    console.warn('Firestore settings logoUrl write warning:', err);
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
