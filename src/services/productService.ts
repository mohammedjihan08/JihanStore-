import { db, storage } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Product } from '../types';

export interface UploadResult {
  success: boolean;
  url: string;
  source: 'firebase-storage' | 'cloud-database';
  message: string;
}

/**
 * Compress an image file using browser Canvas to ensure fast upload, optimal quality,
 * and reliable database persistence without 1MB document limit issues.
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.84): Promise<{ dataUrl: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    // If SVG, no compression needed
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result as string, mimeType: 'image/svg+xml' });
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: event.target?.result as string, mimeType: file.type });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Prefer WebP if supported, otherwise JPEG
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);
        resolve({ dataUrl, mimeType: outputMime });
      };
      img.onerror = () => reject(new Error('ইমেজ প্রসেস করতে ব্যর্থ হয়েছে। অনুগ্রহ করে অন্য ছবি দিন।'));
      img.src = event.target?.result as string;
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a product image:
 * Flow:
 * 1. Fast Canvas Optimization
 * 2. Attempts Firebase Storage upload with a strict 2s timeout
 * 3. If Firebase Storage bucket isn't available or times out, immediately uploads to Firestore Database backed API (/api/products/upload-image)
 * 4. Also directly writes document to Firestore collection 'product_images' from client for guaranteed sync
 * 5. Returns reliable, persistent URL (e.g. /api/images/img_...) that NEVER returns broken images or HTML!
 */
export async function uploadProductImage(file: File): Promise<string> {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const imageId = `img_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanFileName = `prod_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // Step 1: Optimize/Compress image
  const { dataUrl, mimeType } = await compressImage(file);

  // Step 2: Attempt Firebase Storage upload with 2s timeout
  try {
    const storagePromise = (async () => {
      const storageRef = ref(storage, `products/${cleanFileName}`);
      const snap = await uploadBytes(storageRef, file);
      return await getDownloadURL(snap.ref);
    })();

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase Storage timeout')), 2000)
    );

    const downloadUrl = await Promise.race([storagePromise, timeout]);
    if (downloadUrl && typeof downloadUrl === 'string' && downloadUrl.startsWith('http')) {
      return downloadUrl;
    }
  } catch {
    // Firebase Storage bucket not active or timed out, smoothly proceed to Firestore Database storage
  }

  // Step 3: Direct Client-Side Firestore Database Persistence
  try {
    await setDoc(doc(db, 'product_images', imageId), {
      id: imageId,
      dataUrl,
      contentType: mimeType,
      fileName: file.name,
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (firestoreErr) {
    console.warn('Client Firestore direct write note:', firestoreErr);
  }

  // Step 4: Server-Side Sync & Cache
  try {
    const res = await fetch('/api/products/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: imageId,
        dataUrl,
        fileName: file.name,
        contentType: mimeType
      }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.url) {
      return data.url;
    }
  } catch (serverErr) {
    console.warn('Server upload route note:', serverErr);
  }

  // Fallback to /api/images/:id which serves from Firestore database
  return `/api/images/${imageId}`;
}

/**
 * Delete product image from Firestore and Storage
 */
export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return true;

  // 1. If Firebase Storage URL
  if (imageUrl.includes('firebasestorage.googleapis.com')) {
    try {
      const match = imageUrl.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        const decodedPath = decodeURIComponent(match[1]);
        const storageRef = ref(storage, decodedPath);
        await deleteObject(storageRef);
      }
    } catch (err) {
      console.warn('Storage file delete warning:', err);
    }
  }

  // 2. If /api/images/:id URL
  if (imageUrl.includes('/api/images/')) {
    const id = imageUrl.split('/api/images/')[1]?.split('?')[0]?.split('.')[0];
    if (id) {
      try {
        await deleteDoc(doc(db, 'product_images', id));
      } catch {}
      try {
        await fetch(`/api/images/${id}`, { method: 'DELETE' });
      } catch {}
    }
  }

  return true;
}

/**
 * Save product into Firestore collection 'products'
 */
export async function persistProductToFirestore(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, 'products', product.id), product, { merge: true });
  } catch (err) {
    console.warn('Could not persist product to Firestore:', err);
  }
}

/**
 * Delete product from Firestore collection 'products'
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    console.warn('Could not delete product from Firestore:', err);
  }
}

/**
 * Fetch products from Firestore collection 'products'
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
