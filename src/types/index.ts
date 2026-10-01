export type CustomerRoute =
  | 'home'
  | 'categories'
  | 'products'
  | 'product-detail'
  | 'search'
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'account'
  | 'edit-profile'
  | 'orders'
  | 'order-detail'
  | 'wallet'
  | 'notifications'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'settings';

export type AdminSection =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'wallets'
  | 'deposits'
  | 'withdrawals'
  | 'transactions'
  | 'banners'
  | 'ads'
  | 'coupons'
  | 'notifications'
  | 'settings'
  | 'logo'
  | 'export'
  | 'security'
  | 'admin-account';

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
  city?: string;
  postalCode?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  banglaName: string;
  slug: string;
  icon?: string;
  imageUrl?: string;
  itemCount: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  color?: string;
  size?: string;
}

export interface Product {
  id: string;
  name: string;
  banglaName: string;
  sku: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  description: string;
  stock: number;
  images: string[];
  colors: string[];
  sizes: string[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  isActive: boolean;
  isOutOfStock: boolean;
  isHidden: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  banglaName?: string;
  image: string;
  color?: string;
  size?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: 'Cash on Delivery' | 'Customer Wallet' | 'Online Gateway';
  status: OrderStatus;
  createdAt: string;
  deliveredAt?: string;
  notes?: string;
}

export type TransactionType =
  | 'Deposit'
  | 'Withdrawal'
  | 'Refund'
  | 'Order Payment'
  | 'Wallet Credit'
  | 'Wallet Debit';

export type TransactionStatus = 'Pending' | 'Completed' | 'Rejected';

export interface WalletTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  paymentMethod?: string; // e.g. bKash, Nagad, Bank, Admin Adjustment
  accountNumber?: string;
  trxId?: string;
  description: string;
  createdAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface CustomerWallet {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  currentBalance: number;
  pendingDeposit: number;
  pendingWithdrawal: number;
  totalSpent: number;
  updatedAt: string;
}

export type AdPosition =
  | 'Home Top'
  | 'Home Middle'
  | 'Product Page'
  | 'Category Page';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  destinationUrl: string;
  position: AdPosition;
  displayOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  clicks: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  banglaTitle?: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  buttonText: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
  minOrder: number;
  maxDiscount: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface WebsiteSettings {
  storeName: string;
  banglaStoreName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  aboutUsText: string;
  privacyPolicyText: string;
  termsConditionsText: string;
  logoUrl?: string;
  currencySymbol: string;
  deliveryChargeInsideCity: number;
  deliveryChargeOutsideCity: number;
  freeDeliveryThreshold: number;
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'order' | 'wallet' | 'promo' | 'system';
}
