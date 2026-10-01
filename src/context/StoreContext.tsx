import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
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
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

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
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: orderData.notes
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
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
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
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
