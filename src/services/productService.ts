import { db, storage } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product } from '../types';

/**
 * Upload a product image with fast, reliable dual-storage and timeout safety:
 * 1. Tries Firebase Storage (with a quick 3.5s timeout)
 * 2. Falls back to high-speed server storage (/api/products/upload-image)
 * 3. Has a hard 10s maximum timeout so the UI NEVER hangs in an infinite spinner!
 */
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const cleanFileName = `prod_${timestamp}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  // Helper with timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('ইমেজ আপলোড টাইমআউট হয়েছে (১০ সেকেন্ড)। অনুগ্রহ করে আবার চেষ্টা করুন।')), 10000);
  });

  const uploadTask = async (): Promise<string> => {
    // Attempt 1: Try Firebase Storage with 3s timeout
    try {
      const storagePromise = (async () => {
        const storageRef = ref(storage, `products/${cleanFileName}`);
        const snap = await uploadBytes(storageRef, file);
        return await getDownloadURL(snap.ref);
      })();

      const storageTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firebase Storage timeout')), 3500)
      );

      const downloadUrl = await Promise.race([storagePromise, storageTimeout]);
      if (downloadUrl && typeof downloadUrl === 'string') {
        return downloadUrl;
      }
    } catch {
      // Gracefully continue to server upload fallback
    }

    // Attempt 2: High-speed server upload via /api/products/upload-image
    const base64Data = await readFileAsDataURL(file);
    const res = await fetch('/api/products/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl: base64Data,
        fileName: cleanFileName,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success || !data.url) {
      throw new Error(data.message || 'সার্ভারে ইমেজ আপলোড ব্যর্থ হয়েছে।');
    }

    return data.url;
  };

  return await Promise.race([uploadTask(), timeoutPromise]);
}

/**
 * Save product into Firestore
 */
export async function persistProductToFirestore(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, 'products', product.id), product, { merge: true });
  } catch (err) {
    console.warn('Could not persist product to Firestore:', err);
  }
}

/**
 * Delete product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    console.warn('Could not delete product from Firestore:', err);
  }
}

/**
 * Fetch products from Firestore
 */
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    const list: Product[] = [];
    snap.forEach(d => {
      list.push(d.data() as Product);
    });
    return list;
  } catch (err) {
    console.warn('Could not fetch products from Firestore:', err);
    return [];
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}
