import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  getCustomerProfile,
  logoutCustomer,
  isUserAdmin,
  ADMIN_EMAIL
} from '../services/authService';
import {
  CustomerRoute,
  AdminSection,
  Product,
  CartItem,
  Order,
  UserProfile,
  WalletTransaction,
  CustomerWallet,
  Advertisement,
  PromoBanner,
  Coupon,
  WebsiteSettings,
  StoreNotification,
  ProductCategory
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialBanners,
  initialAds,
  initialCoupons,
  initialSettings,
  sampleOrders,
  sampleWalletTransactions,
  sampleCustomerWallets
} from '../data/mockInitialData';

interface StoreContextType {
  // Navigation
  currentRoute: CustomerRoute;
  setCurrentRoute: (route: CustomerRoute) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  // Protected navigation & return target
  postLoginRedirectRoute: CustomerRoute | null;
  setPostLoginRedirectRoute: (route: CustomerRoute | null) => void;
  requireAuthForRoute: (targetRoute: CustomerRoute, noticeMessage?: string) => boolean;

  // Real Auth state
  firebaseUser: FirebaseUser | null;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  authLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  handleLogout: () => Promise<void>;

  // Admin routing & session
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  adminSection: AdminSection;
  setAdminSection: (section: AdminSection) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => boolean;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartItemCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;

  // Customer Wallet
  customerWallet: CustomerWallet;
  walletTransactions: WalletTransaction[];
  requestDeposit: (amount: number, method: string, accountNumber: string, trxId: string) => void;
  requestWithdrawal: (amount: number, method: string, accountNumber: string) => boolean;

  // Catalog
  products: Product[];
  categories: ProductCategory[];
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Ads & Banners
  ads: Advertisement[];
  banners: PromoBanner[];
  updateAd: (ad: Advertisement) => void;
  addAd: (ad: Advertisement) => void;
  deleteAd: (id: string) => void;
  updateBanner: (banner: PromoBanner) => void;
  addBanner: (banner: PromoBanner) => void;
  deleteBanner: (id: string) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Settings
  settings: WebsiteSettings;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;
  calculateDeliveryCharge: (
    district?: string,
    area?: string,
    orderSubtotal?: number,
    division?: string
  ) => { charge: number; isFree: boolean; ruleName: string; estimatedDays?: string };

  // Notifications
  notifications: StoreNotification[];
  markNotificationAsRead: (id: string) => void;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Admin Wallet Operations
  allCustomerWallets: CustomerWallet[];
  allWalletTransactions: WalletTransaction[];
  approveDeposit: (trxId: string) => void;
  rejectDeposit: (trxId: string, note?: string) => void;
  approveWithdrawal: (txId: string) => void;
  rejectWithdrawal: (txId: string, note?: string) => void;
  adjustCustomerWalletBalance: (customerId: string, amount: number, isCredit: boolean, reason: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRouteState] = useState<CustomerRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-1');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ord-1001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [postLoginRedirectRoute, setPostLoginRedirectRoute] = useState<CustomerRoute | null>(null);

  // Admin state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Firebase Auth states
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: 'prod-1',
      product: initialProducts[0],
      selectedColor: 'Royal Navy',
      selectedSize: 'Standard',
      quantity: 1,
      unitPrice: initialProducts[0].price
    }
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-2']);

  // Catalog
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<ProductCategory[]>(initialCategories);
  const [banners, setBanners] = useState<PromoBanner[]>(initialBanners);
  const [ads, setAds] = useState<Advertisement[]>(initialAds);
  const [coupons] = useState<Coupon[]>(initialCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    try {
      const saved = localStorage.getItem('jihan_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If saved settings contains old mock telephone or old mock address, refresh with official details
        const isOldMock = !parsed.phone || parsed.phone.includes('000000') || (parsed.address && parsed.address.includes('Uttara'));
        if (isOldMock) {
          localStorage.setItem('jihan_store_settings', JSON.stringify(initialSettings));
          return initialSettings;
        }
        return {
          ...initialSettings,
          ...parsed,
          phoneNumbers: Array.isArray(parsed.phoneNumbers) && parsed.phoneNumbers.length > 0 ? parsed.phoneNumbers : initialSettings.phoneNumbers,
          emailAddresses: Array.isArray(parsed.emailAddresses) && parsed.emailAddresses.length > 0 ? parsed.emailAddresses : initialSettings.emailAddresses,
          businessAddresses: Array.isArray(parsed.businessAddresses) && parsed.businessAddresses.length > 0 ? parsed.businessAddresses : initialSettings.businessAddresses,
          bkashAccounts: Array.isArray(parsed.bkashAccounts) && parsed.bkashAccounts.length > 0 ? parsed.bkashAccounts : initialSettings.bkashAccounts,
          nagadAccounts: Array.isArray(parsed.nagadAccounts) && parsed.nagadAccounts.length > 0 ? parsed.nagadAccounts : initialSettings.nagadAccounts,
          rocketAccounts: Array.isArray(parsed.rocketAccounts) && parsed.rocketAccounts.length > 0 ? parsed.rocketAccounts : initialSettings.rocketAccounts,
          upayAccounts: Array.isArray(parsed.upayAccounts) && parsed.upayAccounts.length > 0 ? parsed.upayAccounts : initialSettings.upayAccounts,
          bankAccounts: Array.isArray(parsed.bankAccounts) && parsed.bankAccounts.length > 0 ? parsed.bankAccounts : initialSettings.bankAccounts,
          deliveryRules: Array.isArray(parsed.deliveryRules) && parsed.deliveryRules.length > 0 ? parsed.deliveryRules : initialSettings.deliveryRules,
          defaultDeliveryCharge: typeof parsed.defaultDeliveryCharge === 'number' ? parsed.defaultDeliveryCharge : initialSettings.defaultDeliveryCharge
        };
      }
    } catch (e) {
      console.warn('Could not read saved settings from localStorage:', e);
    }
    return initialSettings;
  });
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  // Sync settings with Firestore database
  useEffect(() => {
    async function loadRemoteSettings() {
      try {
        const docRef = doc(db, 'settings', 'general');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<WebsiteSettings>;
          setSettings(prev => {
            const merged: WebsiteSettings = {
              ...prev,
              ...remoteData,
              phoneNumbers: Array.isArray(remoteData.phoneNumbers) && remoteData.phoneNumbers.length > 0 ? remoteData.phoneNumbers : prev.phoneNumbers,
              emailAddresses: Array.isArray(remoteData.emailAddresses) && remoteData.emailAddresses.length > 0 ? remoteData.emailAddresses : prev.emailAddresses,
              businessAddresses: Array.isArray(remoteData.businessAddresses) && remoteData.businessAddresses.length > 0 ? remoteData.businessAddresses : prev.businessAddresses,
              bkashAccounts: Array.isArray(remoteData.bkashAccounts) ? remoteData.bkashAccounts : prev.bkashAccounts,
              nagadAccounts: Array.isArray(remoteData.nagadAccounts) ? remoteData.nagadAccounts : prev.nagadAccounts,
              rocketAccounts: Array.isArray(remoteData.rocketAccounts) ? remoteData.rocketAccounts : prev.rocketAccounts,
              upayAccounts: Array.isArray(remoteData.upayAccounts) ? remoteData.upayAccounts : prev.upayAccounts,
              bankAccounts: Array.isArray(remoteData.bankAccounts) ? remoteData.bankAccounts : prev.bankAccounts,
              deliveryRules: Array.isArray(remoteData.deliveryRules) && remoteData.deliveryRules.length > 0 ? remoteData.deliveryRules : prev.deliveryRules,
              defaultDeliveryCharge: typeof remoteData.defaultDeliveryCharge === 'number' ? remoteData.defaultDeliveryCharge : prev.defaultDeliveryCharge
            };
            try {
              localStorage.setItem('jihan_store_settings', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not fetch settings from Firestore, using local settings:', err);
      }
    }
    loadRemoteSettings();
  }, []);

  // Wallets
  const [allCustomerWallets, setAllCustomerWallets] = useState<CustomerWallet[]>(sampleCustomerWallets);
  const [allWalletTransactions, setAllWalletTransactions] = useState<WalletTransaction[]>(sampleWalletTransactions);

  // Notifications & Toast
  const [notifications, setNotifications] = useState<StoreNotification[]>([
    {
      id: 'notif-1',
      title: 'Order Dispatched #JS-ORD-9021',
      message: 'Your Jihan Royal Studio Pro Wireless Headphones have been shipped via Express Home Delivery.',
      timestamp: '2026-03-29T10:00:00Z',
      isRead: false,
      type: 'order'
    }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Persistent Firebase Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await getCustomerProfile(user.uid);
          if (profile) {
            setCurrentUser(profile);
            if (isUserAdmin(user, profile)) {
              setIsAdminAuthenticated(true);
            }
          } else {
            // New user without Firestore document yet
            const defaultProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Customer',
              email: user.email || '',
              phone: '',
              address: '',
              city: 'Dhaka',
              role: user.email === ADMIN_EMAIL ? 'admin' : 'customer',
              createdAt: new Date().toISOString()
            };
            setCurrentUser(defaultProfile);
            if (user.email === ADMIN_EMAIL) {
              setIsAdminAuthenticated(true);
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setCurrentUser(null);
        setIsAdminAuthenticated(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      setCurrentUser(null);
      setFirebaseUser(null);
      setIsAdminAuthenticated(false);
      showToast('সফলভাবে লগআউট সম্পন্ন হয়েছে।');
      setCurrentRouteState('home');
    } catch (err) {
      showToast('লগআউট ব্যর্থ হয়েছে।');
    }
  };

  const isAdmin = isUserAdmin(firebaseUser, currentUser);

  // Customer specific wallet
  const customerWallet = allCustomerWallets.find(w => w.customerId === currentUser?.id) || {
    customerId: currentUser?.id || 'guest',
    customerName: currentUser?.name || 'Guest User',
    customerEmail: currentUser?.email || '',
    customerPhone: currentUser?.phone || '',
    currentBalance: 0,
    pendingDeposit: 0,
    pendingWithdrawal: 0,
    totalSpent: 0,
    updatedAt: new Date().toISOString()
  };

  const walletTransactions = allWalletTransactions.filter(
    tx => tx.customerId === currentUser?.id
  );

  // Authentication guard for private customer sections
  const requireAuthForRoute = (targetRoute: CustomerRoute, noticeMessage?: string): boolean => {
    if (currentUser) {
      return true;
    }
    // Set target for post-login redirection without losing cart
    setPostLoginRedirectRoute(targetRoute);
    showToast(
      noticeMessage || 'অর্ডার করতে অনুগ্রহ করে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।'
    );
    setCurrentRouteState('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
  };

  const setCurrentRoute = (route: CustomerRoute) => {
    // Check if route is protected
    const protectedRoutes: CustomerRoute[] = [
      'checkout',
      'account',
      'orders',
      'order-detail',
      'wallet',
      'edit-profile',
      'settings'
    ];

    if (protectedRoutes.includes(route) && !currentUser) {
      requireAuthForRoute(
        route,
        route === 'checkout'
          ? 'অর্ডার করতে অনুগ্রহ করে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।'
          : 'এই পেজে যেতে অনুগ্রহ করে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন।'
      );
      return;
    }

    setCurrentRouteState(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string): boolean => {
    const existingIndex = cart.findIndex(
      item => item.productId === product.id && item.selectedColor === color && item.selectedSize === size
    );

    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    const requestedTotalQty = currentQtyInCart + quantity;

    if (requestedTotalQty > product.stock) {
      showToast(`Cannot add more than available stock (${product.stock})`);
      return false;
    }

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity = requestedTotalQty;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          productId: product.id,
          product,
          selectedColor: color || product.colors[0],
          selectedSize: size || product.sizes[0],
          quantity,
          unitPrice: product.price
        }
      ]);
    }
    showToast(`Added "${product.name}" to cart`);
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return true;
    }

    const item = cart.find(i => i.id === cartItemId);
    if (!item) return false;

    if (quantity > item.product.stock) {
      showToast(`Maximum available stock is ${item.product.stock}`);
      return false;
    }

    setCart(prev =>
      prev.map(i => (i.id === cartItemId ? { ...i, quantity } : i))
    );
    return true;
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartDiscount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.min((cartSubtotal * appliedCoupon.discountAmount) / 100, appliedCoupon.maxDiscount)
      : appliedCoupon.discountAmount
    : 0;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast('Removed from wishlist');
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast('Saved to wishlist');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Order creation
  const createOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `JS-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser?.id || 'guest',
      customerName: orderData.customerName || currentUser?.name || 'Customer',
      customerPhone: orderData.customerPhone || currentUser?.phone || '',
      customerEmail: orderData.customerEmail || currentUser?.email || '',
      deliveryAddress: orderData.deliveryAddress || currentUser?.address || '',
      city: orderData.city || 'Dhaka',
      items: orderData.items || [],
      subtotal: orderData.subtotal || cartSubtotal,
      discount: orderData.discount || cartDiscount,
      deliveryCharge: orderData.deliveryCharge || settings.deliveryChargeInsideCity,
      grandTotal: orderData.grandTotal || (cartSubtotal - cartDiscount + settings.deliveryChargeInsideCity),
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      paymentDetails: orderData.paymentDetails,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: orderData.notes
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Trigger Server-Side Telegram Notification for New Order (Non-blocking)
    try {
      fetch('/api/telegram/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      }).catch(err => console.warn('Telegram order notification failed:', err));
    } catch (e) {
      console.warn('Telegram notify error:', e);
    }

    return newOrder;
  };

  // Wallet functions
  const requestDeposit = (amount: number, method: string, accountNumber: string, trxId: string) => {
    if (!currentUser) return;
    const newTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      type: 'Deposit',
      amount,
      status: 'Pending',
      paymentMethod: method,
      accountNumber,
      trxId,
      description: `Deposit request via ${method}`,
      createdAt: new Date().toISOString()
    };
    setAllWalletTransactions(prev => [newTx, ...prev]);
    setAllCustomerWallets(prev =>
      prev.map(w =>
        w.customerId === currentUser.id
          ? { ...w, pendingDeposit: w.pendingDeposit + amount, updatedAt: new Date().toISOString() }
          : w
      )
    );
    showToast('Deposit request submitted for verification');

    // Trigger Telegram notification for deposit request
    try {
      fetch('/api/telegram/notify-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'নতুন ওয়ালেট ডিপোজিট রিকোয়েস্ট',
          customerName: currentUser.name,
          amount,
          method,
          trxId,
          message: `অ্যাকাউন্ট: ${accountNumber}`
        }),
      }).catch(err => console.warn('Telegram deposit alert failed:', err));
    } catch (e) {
      console.warn('Telegram notify error:', e);
    }
  };

  const requestWithdrawal = (amount: number, method: string, accountNumber: string): boolean => {
    if (!currentUser) return false;
    if (amount > customerWallet.currentBalance) {
      showToast('Insufficient wallet balance for this withdrawal');
      return false;
    }

    const newTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      type: 'Withdrawal',
      amount,
      status: 'Pending',
      paymentMethod: method,
      accountNumber,
      description: `Withdrawal request to ${method}`,
      createdAt: new Date().toISOString()
    };

    setAllWalletTransactions(prev => [newTx, ...prev]);
    setAllCustomerWallets(prev =>
      prev.map(w =>
        w.customerId === currentUser.id
          ? {
              ...w,
              currentBalance: w.currentBalance - amount,
              pendingWithdrawal: w.pendingWithdrawal + amount,
              updatedAt: new Date().toISOString()
            }
          : w
      )
    );
    showToast('Withdrawal request placed');
    return true;
  };

  // Catalog management
  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    showToast('Product updated successfully');
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast('New product created');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted');
  };

  // Ads & Banners
  const updateAd = (ad: Advertisement) => {
    setAds(prev => prev.map(a => (a.id === ad.id ? ad : a)));
    showToast('Advertisement updated');
  };

  const addAd = (ad: Advertisement) => {
    setAds(prev => [ad, ...prev]);
    showToast('Advertisement created');
  };

  const deleteAd = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
    showToast('Advertisement removed');
  };

  const updateBanner = (banner: PromoBanner) => {
    setBanners(prev => prev.map(b => (b.id === banner.id ? banner : b)));
    showToast('Banner updated');
  };

  const addBanner = (banner: PromoBanner) => {
    setBanners(prev => [banner, ...prev]);
    showToast('Banner created');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('Banner removed');
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const found = coupons.find(
      c => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order for this coupon is ৳${found.minOrder}`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Settings
  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings(prev => {
      // Find default active phone, email, address to keep legacy fields in sync
      const nextPhones = newSettings.phoneNumbers || prev.phoneNumbers;
      const nextEmails = newSettings.emailAddresses || prev.emailAddresses;
      const nextAddresses = newSettings.businessAddresses || prev.businessAddresses;

      const defPhone = nextPhones.find(p => p.isActive && p.isDefault) || nextPhones.find(p => p.isActive) || nextPhones[0];
      const defEmail = nextEmails.find(e => e.isActive && e.isDefault) || nextEmails.find(e => e.isActive) || nextEmails[0];
      const defAddr = nextAddresses.find(a => a.isActive && a.isDefault) || nextAddresses.find(a => a.isActive) || nextAddresses[0];

      const updated: WebsiteSettings = {
        ...prev,
        ...newSettings,
        phone: defPhone ? defPhone.number : prev.phone,
        email: defEmail ? defEmail.email : prev.email,
        address: defAddr ? (defAddr.title ? `${defAddr.title}: ${defAddr.address}` : defAddr.address) : prev.address
      };

      try {
        localStorage.setItem('jihan_store_settings', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not write to localStorage:', e);
      }

      // Persist to Firestore
      try {
        setDoc(doc(db, 'settings', 'general'), updated, { merge: true }).catch(err => {
          console.warn('Could not persist settings to Firestore:', err);
        });
      } catch (err) {
        console.warn('Firestore setDoc call error:', err);
      }

      return updated;
    });

    showToast('সেটিংস সফলভাবে সংরক্ষিত ও আপডেট হয়েছে');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Location-based Delivery Charge Calculator
  const calculateDeliveryCharge = (
    district?: string,
    area?: string,
    orderSubtotal?: number,
    division?: string
  ): { charge: number; isFree: boolean; ruleName: string; estimatedDays?: string } => {
    const activeRules = (settings.deliveryRules || []).filter(r => r.isActive);
    const subtotal = orderSubtotal ?? cartSubtotal;

    // 1. If global free delivery threshold is exceeded
    if (settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold) {
      return {
        charge: 0,
        isFree: true,
        ruleName: 'ফ্রি ডেলিভারি অফার (Free Shipping)',
        estimatedDays: '২-৪ কার্যদিবস'
      };
    }

    const normDistrict = (district || '').trim().toLowerCase();
    const normArea = (area || '').trim().toLowerCase();
    const normDivision = (division || '').trim().toLowerCase();

    // Priority 1: Match specific area/upazila within the district
    let matchedRule = activeRules.find(r => {
      const rArea = (r.area || '').trim().toLowerCase();
      const rDist = (r.district || '').trim().toLowerCase();
      if (!rArea || rArea === 'all') return false;

      // Rule must belong to the selected district or 'all'
      const distMatches = !normDistrict || !rDist || rDist === 'all' || normDistrict.includes(rDist) || rDist.includes(normDistrict);
      if (!distMatches) return false;

      // Area match against selectedArea or string in normArea
      return normArea.includes(rArea) || rArea.includes(normArea);
    });

    // Priority 2: Match specific district rule (e.g. "Chittagong", "Dhaka", etc. with area 'All' or empty)
    if (!matchedRule && normDistrict) {
      matchedRule = activeRules.find(r => {
        const rDist = (r.district || '').trim().toLowerCase();
        const rArea = (r.area || '').trim().toLowerCase();
        const distMatches = rDist !== 'all' && (normDistrict.includes(rDist) || rDist.includes(normDistrict));
        const areaIsBroad = !rArea || rArea === 'all';
        return distMatches && areaIsBroad;
      });
    }

    // Priority 3: Match division level rule (e.g. "Chittagong", "Dhaka" division)
    if (!matchedRule && normDivision) {
      matchedRule = activeRules.find(r => {
        const rDiv = (r.division || '').trim().toLowerCase();
        const rDist = (r.district || '').trim().toLowerCase();
        return rDiv !== 'all' && (normDivision.includes(rDiv) || rDiv.includes(normDivision)) && (!rDist || rDist === 'all');
      });
    }

    // Priority 4: Default or Nationwide fallback rule (isDefault or district='All' or division='All')
    if (!matchedRule) {
      matchedRule = activeRules.find(r => r.isDefault) ||
                    activeRules.find(r => (r.district || '').toLowerCase() === 'all' || (r.division || '').toLowerCase() === 'all');
    }

    if (matchedRule) {
      const isFree = matchedRule.isFreeDelivery || (
        typeof matchedRule.minOrderAmount === 'number' &&
        matchedRule.minOrderAmount > 0 &&
        subtotal >= matchedRule.minOrderAmount
      );
      return {
        charge: isFree ? 0 : matchedRule.deliveryCharge,
        isFree,
        ruleName: matchedRule.name,
        estimatedDays: matchedRule.estimatedDays
      };
    }

    // Fallback if no rules exist in the store
    const fallbackCharge = typeof settings.defaultDeliveryCharge === 'number' ? settings.defaultDeliveryCharge : 130;
    return {
      charge: fallbackCharge,
      isFree: fallbackCharge === 0,
      ruleName: 'সাধারণ ডেলিভারি চার্জ (Standard Delivery)',
      estimatedDays: '২-৪ কার্যদিবস'
    };
  };

  // Admin Wallet Operations
  const approveDeposit = (txId: string) => {
    const tx = allWalletTransactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'Pending') return;

    setAllWalletTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? { ...t, status: 'Completed', processedAt: new Date().toISOString() }
          : t
      )
    );

    setAllCustomerWallets(prev =>
      prev.map(w =>
        w.customerId === tx.customerId
          ? {
              ...w,
              currentBalance: w.currentBalance + tx.amount,
              pendingDeposit: Math.max(0, w.pendingDeposit - tx.amount),
              updatedAt: new Date().toISOString()
            }
          : w
      )
    );
    showToast(`Approved deposit of ৳${tx.amount}`);
  };

  const rejectDeposit = (txId: string, note?: string) => {
    const tx = allWalletTransactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'Pending') return;

    setAllWalletTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? { ...t, status: 'Rejected', adminNote: note || 'Rejected by admin' }
          : t
      )
    );

    setAllCustomerWallets(prev =>
      prev.map(w =>
        w.customerId === tx.customerId
          ? {
              ...w,
              pendingDeposit: Math.max(0, w.pendingDeposit - tx.amount),
              updatedAt: new Date().toISOString()
            }
          : w
      )
    );
    showToast('Deposit rejected');
  };

  const approveWithdrawal = (txId: string) => {
    const tx = allWalletTransactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'Pending') return;

    setAllWalletTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? { ...t, status: 'Completed', processedAt: new Date().toISOString() }
          : t
      )
    );

    setAllCustomerWallets(prev =>
      prev.map(w =>
        w.customerId === tx.customerId
          ? {
              ...w,
              pendingWithdrawal: Math.max(0, w.pendingWithdrawal - tx.amount),
              updatedAt: new Date().toISOString()
            }
          : w
      )
    );
    showToast(`Processed withdrawal of ৳${tx.amount}`);
  };

  const rejectWithdrawal = (txId: string, note?: string) => {
    const tx = allWalletTransactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'Pending') return;

    setAllWalletTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? { ...t, status: 'Rejected', adminNote: note || 'Rejected by admin' }
          : t
      )
    );

    setAllCustomerWallets(prev =>
      prev.map(w =>
        w.customerId === tx.customerId
          ? {
              ...w,
              currentBalance: w.currentBalance + tx.amount,
              pendingWithdrawal: Math.max(0, w.pendingWithdrawal - tx.amount),
              updatedAt: new Date().toISOString()
            }
          : w
      )
    );
    showToast('Withdrawal rejected and amount returned to balance');
  };

  const adjustCustomerWalletBalance = (
    customerId: string,
    amount: number,
    isCredit: boolean,
    reason: string
  ) => {
    const customer = allCustomerWallets.find(w => w.customerId === customerId);
    if (!customer) return;

    const newTx: WalletTransaction = {
      id: `wtx-${Date.now()}`,
      customerId,
      customerName: customer.customerName,
      type: isCredit ? 'Wallet Credit' : 'Wallet Debit',
      amount,
      status: 'Completed',
      paymentMethod: 'Admin Adjustment',
      description: reason || (isCredit ? 'Manual credit by admin' : 'Manual debit by admin'),
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    setAllWalletTransactions(prev => [newTx, ...prev]);

    setAllCustomerWallets(prev =>
      prev.map(w =>
        w.customerId === customerId
          ? {
              ...w,
              currentBalance: isCredit
                ? w.currentBalance + amount
                : Math.max(0, w.currentBalance - amount),
              updatedAt: new Date().toISOString()
            }
          : w
      )
    );
    showToast(`${isCredit ? 'Credited' : 'Debited'} ৳${amount} successfully`);
  };

  return (
    <StoreContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        postLoginRedirectRoute,
        setPostLoginRedirectRoute,
        requireAuthForRoute,
        firebaseUser,
        currentUser,
        setCurrentUser,
        authLoading,
        isLoggedIn: !!currentUser,
        isAdmin,
        handleLogout,
        isAdminMode,
        setIsAdminMode,
        adminSection,
        setAdminSection,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartItemCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        customerWallet,
        walletTransactions,
        requestDeposit,
        requestWithdrawal,
        products,
        categories,
        updateProduct,
        addProduct,
        deleteProduct,
        ads,
        banners,
        updateAd,
        addAd,
        deleteAd,
        updateBanner,
        addBanner,
        deleteBanner,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        settings,
        updateSettings,
        calculateDeliveryCharge,
        notifications,
        markNotificationAsRead,
        toastMessage,
        showToast,
        allCustomerWallets,
        allWalletTransactions,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        adjustCustomerWalletBalance
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
