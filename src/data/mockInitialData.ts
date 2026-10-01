import {
  Product,
  ProductCategory,
  Advertisement,
  PromoBanner,
  Coupon,
  WebsiteSettings,
  UserProfile,
  WalletTransaction,
  Order,
  CustomerWallet
} from '../types';

export const initialCategories: ProductCategory[] = [
  {
    id: 'cat-1',
    name: 'Smart Gadgets & Audio',
    banglaName: 'স্মার্ট গ্যাজেট ও অডিও',
    slug: 'smart-gadgets',
    itemCount: 42
  },
  {
    id: 'cat-2',
    name: 'Watches & Wearables',
    banglaName: 'ঘড়ি ও স্মার্ট ওয়্যারেবল',
    slug: 'watches-wearables',
    itemCount: 28
  },
  {
    id: 'cat-3',
    name: 'Leather & Accessories',
    banglaName: 'লেদার ও প্রিমিয়াম ব্যাগ',
    slug: 'leather-accessories',
    itemCount: 35
  },
  {
    id: 'cat-4',
    name: 'Mens Fashion',
    banglaName: 'পুরুষদের ফ্যাশন',
    slug: 'mens-fashion',
    itemCount: 64
  },
  {
    id: 'cat-5',
    name: 'Home & Living',
    banglaName: 'হোম ও লিভিং স্পেশাল',
    slug: 'home-living',
    itemCount: 23
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Jihan Royal Studio Pro Wireless Headphones',
    banglaName: 'জিহান রয়্যাল স্টুডিও প্রো ওয়্যারলেস হেডফোন',
    sku: 'JS-AUD-001',
    category: 'Smart Gadgets & Audio',
    price: 3850,
    originalPrice: 4800,
    discountPercentage: 20,
    description: 'Experience studio-grade acoustic clarity with active noise cancellation, deep bass enhancement, 45-hour battery life, and exquisite royal blue and brushed gold craftsmanship.',
    stock: 24,
    images: [
      '/src/assets/images/product_premium_wireless_headphone_1790798420285.jpg',
      '/src/assets/images/hero_jihan_lifestyle_1790798408664.jpg'
    ],
    colors: ['Royal Navy', 'Brushed Gold', 'Matte Onyx'],
    sizes: ['Standard'],
    variants: [
      { id: 'v-1', name: 'Royal Navy', sku: 'JS-AUD-001-RN', price: 3850, stock: 14, color: 'Royal Navy' },
      { id: 'v-2', name: 'Brushed Gold', sku: 'JS-AUD-001-BG', price: 4100, stock: 10, color: 'Brushed Gold' }
    ],
    specifications: {
      'Bluetooth Version': '5.3 Ultra-Low Latency',
      'Battery Life': 'Up to 45 Hours Playback',
      'Noise Cancellation': 'Hybrid ANC (-38dB)',
      'Charging': 'Type-C Fast Charge (10m = 5h)',
      'Warranty': '12 Months Official Jihan Care'
    },
    isActive: true,
    isOutOfStock: false,
    isHidden: false,
    rating: 4.9,
    reviewsCount: 142,
    tags: ['Bestseller', 'Audio', 'Noise Cancelling', 'Wireless'],
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Jihan Aura Gen-3 Gold Bezel Smartwatch',
    banglaName: 'জিহান অরা জেন-৩ গোল্ড বেজেল স্মার্টওয়াচ',
    sku: 'JS-WCH-002',
    category: 'Watches & Wearables',
    price: 4950,
    originalPrice: 6500,
    discountPercentage: 24,
    description: 'Sleek luxury design featuring a diamond-cut gold bezel, ultra-vivid AMOLED 1.43-inch display, 24/7 health tracking, Bluetooth calling, and water resistance up to 5 ATM.',
    stock: 18,
    images: [
      '/src/assets/images/product_smart_watch_gold_1790798431241.jpg',
      '/src/assets/images/hero_jihan_lifestyle_1790798408664.jpg'
    ],
    colors: ['Gold & Midnight Blue', 'Gold & Classic Black'],
    sizes: ['44mm'],
    variants: [
      { id: 'v-3', name: 'Gold & Midnight Blue', sku: 'JS-WCH-002-BL', price: 4950, stock: 10, color: 'Gold & Midnight Blue' },
      { id: 'v-4', name: 'Gold & Classic Black', sku: 'JS-WCH-002-BK', price: 4950, stock: 8, color: 'Gold & Classic Black' }
    ],
    specifications: {
      'Display': '1.43" HD AMOLED Always-On',
      'Calling': 'Clear Dual Mic Bluetooth Calling',
      'Battery': '380mAh (7-10 Days Regular Use)',
      'Sensors': 'Optical SpO2, Heart Rate, Sleep Quality',
      'Water Resistance': 'IP68 & 5ATM Swim Proof'
    },
    isActive: true,
    isOutOfStock: false,
    isHidden: false,
    rating: 4.8,
    reviewsCount: 98,
    tags: ['Featured', 'Smartwatch', 'Gold Edition', 'Wearable'],
    createdAt: '2026-03-05T12:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Jihan Executive Full-Grain Leather Messenger Bag',
    banglaName: 'জিহান এক্সিকিউটিভ জেনুইন লেদার মেসেঞ্জার ব্যাগ',
    sku: 'JS-LEA-003',
    category: 'Leather & Accessories',
    price: 5400,
    originalPrice: 6800,
    discountPercentage: 21,
    description: 'Handcrafted with premium top-grain cowhide leather, brass hardware accents, dedicated padded compartment for 15.6" laptops, and weather-treated durability.',
    stock: 12,
    images: [
      '/src/assets/images/product_leather_bag_1790798440312.jpg'
    ],
    colors: ['Midnight Navy & Tan', 'Saddle Brown'],
    sizes: ['15.6 Inch Compartment'],
    variants: [
      { id: 'v-5', name: 'Midnight Navy & Tan', sku: 'JS-LEA-003-NT', price: 5400, stock: 7, color: 'Midnight Navy & Tan' },
      { id: 'v-6', name: 'Saddle Brown', sku: 'JS-LEA-003-SB', price: 5400, stock: 5, color: 'Saddle Brown' }
    ],
    specifications: {
      'Material': '100% Genuine Full-Grain Leather',
      'Lining': 'Reinforced Heavy Cotton Twill',
      'Hardware': 'Antique Solid Brass Zippers',
      'Capacity': 'Fits up to 15.6 inch Laptop & Documents',
      'Shoulder Strap': 'Adjustable Padded Leather'
    },
    isActive: true,
    isOutOfStock: false,
    isHidden: false,
    rating: 5.0,
    reviewsCount: 67,
    tags: ['Luxury', 'Leather', 'Executive', 'Handcrafted'],
    createdAt: '2026-03-10T14:30:00Z'
  },
  {
    id: 'prod-4',
    name: 'Jihan Signature Cotton Oxford Formal Shirt',
    banglaName: 'জিহান সিগনেচার কটন অক্সফোর্ড ফরমাল শার্ট',
    sku: 'JS-FAS-004',
    category: 'Mens Fashion',
    price: 1850,
    originalPrice: 2200,
    discountPercentage: 16,
    description: '100% long-staple Egyptian cotton woven into durable, breathable Oxford cloth. Structured collar and mother-of-pearl buttons for effortless professional elegance.',
    stock: 35,
    images: [
      '/src/assets/images/hero_jihan_lifestyle_1790798408664.jpg'
    ],
    colors: ['Royal Blue', 'Crisp White', 'Soft Sky Blue'],
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    variants: [
      { id: 'v-7', name: 'Royal Blue - L', sku: 'JS-FAS-004-RB-L', price: 1850, stock: 15, color: 'Royal Blue', size: 'L (40)' },
      { id: 'v-8', name: 'Crisp White - L', sku: 'JS-FAS-004-CW-L', price: 1850, stock: 20, color: 'Crisp White', size: 'L (40)' }
    ],
    specifications: {
      'Fabric': '100% Long-Staple Premium Oxford Cotton',
      'Fit': 'Slim Tailored Executive Cut',
      'Care': 'Machine Wash Warm, Easy Iron',
      'Origin': 'Proudly Tailored in Bangladesh'
    },
    isActive: true,
    isOutOfStock: false,
    isHidden: false,
    rating: 4.7,
    reviewsCount: 84,
    tags: ['Apparel', 'Formal', 'Cotton', 'Mens'],
    createdAt: '2026-03-12T09:00:00Z'
  }
];

export const initialBanners: PromoBanner[] = [
  {
    id: 'ban-1',
    title: 'Experience Premium Quality Shopping',
    banglaTitle: 'জিহান স্টোরে প্রিমিয়াম শপিং অভিজ্ঞতা',
    subtitle: 'বিশ্বাসের সাথে অনলাইন শপিং – ক্যাশ অন ডেলিভারি এবং দ্রুততম হোম ডেলিভারি সুবিধা।',
    imageUrl: '/src/assets/images/hero_jihan_lifestyle_1790798408664.jpg',
    linkUrl: 'products',
    buttonText: 'কালেকশন দেখুন (Shop Collection)',
    displayOrder: 1,
    isActive: true
  }
];

export const initialAds: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'Eid & Summer Special Arrival',
    description: 'Get extra 15% discount on all new audio gear and leather collections with cash on delivery available nationwide.',
    imageUrl: '/src/assets/images/product_premium_wireless_headphone_1790798420285.jpg',
    buttonText: 'অফার উপভোগ করুন',
    destinationUrl: 'https://jihanstore.com/promo',
    position: 'Home Middle',
    displayOrder: 1,
    isActive: true,
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    clicks: 342
  },
  {
    id: 'ad-2',
    title: 'Top Tier Wristwear Showcase',
    description: 'Gold bezel smartwatches with 1-year replacement warranty and free doorstep shipping.',
    imageUrl: '/src/assets/images/product_smart_watch_gold_1790798431241.jpg',
    buttonText: 'এখনই অর্ডার করুন',
    destinationUrl: 'https://jihanstore.com/watches',
    position: 'Product Page',
    displayOrder: 2,
    isActive: true,
    startDate: '2026-03-10',
    endDate: '2026-12-31',
    clicks: 198
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'JIHAN10',
    discountType: 'percentage',
    discountAmount: 10,
    minOrder: 2000,
    maxDiscount: 500,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 78,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'FIRSTORDER',
    discountType: 'fixed',
    discountAmount: 200,
    minOrder: 1500,
    maxDiscount: 200,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 1000,
    usedCount: 142,
    isActive: true
  }
];

export const initialSettings: WebsiteSettings = {
  storeName: 'Jihan Store',
  banglaStoreName: 'জিহান স্টোর',
  tagline: 'বিশ্বাসের সাথে অনলাইন শপিং',
  phone: '+880 1800-000000',
  email: 'mohammedjihan08@gmail.com',
  whatsapp: '+880 1800-000000',
  address: 'Plot 12, Road 4, Sector 7, Uttara, Dhaka-1230, Bangladesh',
  facebook: 'https://facebook.com/jihanstore',
  instagram: 'https://instagram.com/jihanstore',
  tiktok: 'https://tiktok.com/@jihanstore',
  youtube: 'https://youtube.com/@jihanstore',
  aboutUsText: 'Jihan Store (জিহান স্টোর) বাংলাদেশের একটি নির্ভরযোগ্য ও আধুনিক ই-কমার্স প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য হল আসল মানের পণ্য, দ্রুততম ডেলিভারি এবং বন্ধুত্বপূর্ণ গ্রাহক সেবার মাধ্যমে গ্রাহকদের জীবনে সহজ ও আনন্দময় শপিং অভিজ্ঞতা নিশ্চিত করা।',
  privacyPolicyText: 'Jihan Store গ্রাহকের তথ্যের সর্বোচ্চ সুরক্ষা নিশ্চিত করে। আপনার নাম, ঠিকানা, ফোন নম্বর এবং ওয়ালেট ব্যালেন্স সম্পূর্ণ গোপনীয় ও সুরক্ষিত থাকে।',
  termsConditionsText: 'জিহান স্টোরে প্রতিটি অর্ডার ডেলিভারির সময় যাচাই করে গ্রহণ করুন। পণ্যে কোনো ত্রুটি থাকলে ২৪ ঘণ্টার মধ্যে আমাদের কাস্টমার সার্ভিসে জানান।',
  logoUrl: '',
  currencySymbol: '৳',
  deliveryChargeInsideCity: 70,
  deliveryChargeOutsideCity: 130,
  freeDeliveryThreshold: 5000
};

export const sampleCustomer: UserProfile = {
  id: 'cust-demo-1',
  name: 'Mohammed Jihan',
  email: 'mohammedjihan08@gmail.com',
  phone: '+880 1812-345678',
  address: 'House 42, Road 11, Dhanmondi, Dhaka',
  city: 'Dhaka',
  postalCode: '1209',
  role: 'customer',
  createdAt: '2026-01-15T08:00:00Z'
};

export const sampleOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'JS-ORD-9021',
    customerId: 'cust-demo-1',
    customerName: 'Mohammed Jihan',
    customerPhone: '+880 1812-345678',
    customerEmail: 'mohammedjihan08@gmail.com',
    deliveryAddress: 'House 42, Road 11, Dhanmondi, Dhaka',
    city: 'Dhaka',
    items: [
      {
        productId: 'prod-1',
        productName: 'Jihan Royal Studio Pro Wireless Headphones',
        banglaName: 'জিহান রয়্যাল স্টুডিও প্রো ওয়্যারলেস হেডফোন',
        image: '/src/assets/images/product_premium_wireless_headphone_1790798420285.jpg',
        color: 'Royal Navy',
        price: 3850,
        quantity: 1
      }
    ],
    subtotal: 3850,
    discount: 200,
    deliveryCharge: 70,
    grandTotal: 3720,
    paymentMethod: 'Cash on Delivery',
    status: 'Processing',
    createdAt: '2026-03-28T11:20:00Z',
    notes: 'Please call before delivery'
  },
  {
    id: 'ord-1002',
    orderNumber: 'JS-ORD-8812',
    customerId: 'cust-demo-1',
    customerName: 'Mohammed Jihan',
    customerPhone: '+880 1812-345678',
    customerEmail: 'mohammedjihan08@gmail.com',
    deliveryAddress: 'House 42, Road 11, Dhanmondi, Dhaka',
    city: 'Dhaka',
    items: [
      {
        productId: 'prod-3',
        productName: 'Jihan Executive Full-Grain Leather Messenger Bag',
        banglaName: 'জিহান এক্সিকিউটিভ জেনুইন লেদার মেসেঞ্জার ব্যাগ',
        image: '/src/assets/images/product_leather_bag_1790798440312.jpg',
        color: 'Midnight Navy & Tan',
        price: 5400,
        quantity: 1
      }
    ],
    subtotal: 5400,
    discount: 0,
    deliveryCharge: 0,
    grandTotal: 5400,
    paymentMethod: 'Cash on Delivery',
    status: 'Delivered',
    createdAt: '2026-03-15T09:15:00Z',
    deliveredAt: '2026-03-17T16:40:00Z'
  }
];

export const sampleWalletTransactions: WalletTransaction[] = [
  {
    id: 'wtx-01',
    customerId: 'cust-demo-1',
    customerName: 'Mohammed Jihan',
    type: 'Deposit',
    amount: 2500,
    status: 'Completed',
    paymentMethod: 'bKash Personal',
    accountNumber: '01812-345678',
    trxId: 'BKP9081237A',
    description: 'Wallet top-up via bKash',
    createdAt: '2026-03-20T10:00:00Z',
    processedAt: '2026-03-20T10:15:00Z'
  },
  {
    id: 'wtx-02',
    customerId: 'cust-demo-1',
    customerName: 'Mohammed Jihan',
    type: 'Wallet Credit',
    amount: 500,
    status: 'Completed',
    paymentMethod: 'Admin Loyalty Reward',
    description: 'Eid Welcome Bonus Credit',
    createdAt: '2026-03-22T14:30:00Z',
    processedAt: '2026-03-22T14:30:00Z',
    adminNote: 'Authorized seasonal campaign reward'
  },
  {
    id: 'wtx-03',
    customerId: 'cust-demo-1',
    customerName: 'Mohammed Jihan',
    type: 'Withdrawal',
    amount: 1000,
    status: 'Pending',
    paymentMethod: 'Nagad Account',
    accountNumber: '01812-345678',
    description: 'Customer withdrawal request to Nagad',
    createdAt: '2026-03-29T16:00:00Z'
  }
];

export const sampleCustomerWallets: CustomerWallet[] = [
  {
    customerId: 'cust-demo-1',
    customerName: 'Mohammed Jihan',
    customerEmail: 'mohammedjihan08@gmail.com',
    customerPhone: '+880 1812-345678',
    currentBalance: 3000,
    pendingDeposit: 0,
    pendingWithdrawal: 1000,
    totalSpent: 9120,
    updatedAt: '2026-03-29T16:00:00Z'
  },
  {
    customerId: 'cust-2',
    customerName: 'Tanvir Hossain',
    customerEmail: 'tanvir.h@gmail.com',
    customerPhone: '+880 1711-223344',
    currentBalance: 1250,
    pendingDeposit: 1500,
    pendingWithdrawal: 0,
    totalSpent: 4500,
    updatedAt: '2026-03-28T12:00:00Z'
  },
  {
    customerId: 'cust-3',
    customerName: 'Sabrina Rahman',
    customerEmail: 'sabrina.r@gmail.com',
    customerPhone: '+880 1912-887766',
    currentBalance: 580,
    pendingDeposit: 0,
    pendingWithdrawal: 0,
    totalSpent: 12800,
    updatedAt: '2026-03-27T18:00:00Z'
  }
];
