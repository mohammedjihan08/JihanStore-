import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, ShoppingCart, Star, AlertCircle } from 'lucide-react';

interface CompactProductCardProps {
  product: Product;
}

export const CompactProductCard: React.FC<CompactProductCardProps> = ({ product }) => {
  const {
    setCurrentRoute,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast
  } = useStore();

  const [imgError, setImgError] = useState(false);
  const inWish = isInWishlist(product.id);
  const isOutOfStock = product.isOutOfStock || (product.stock !== undefined && product.stock <= 0);

  // Normalize image URL to ensure compatibility with Vite / Express static mounts
  const getCleanImageUrl = (): string => {
    if (imgError || !product.images || product.images.length === 0 || !product.images[0]) {
      // Fallback SVG placeholder with luxury Jihan Store branding
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f8fafc"><rect width="400" height="400" fill="%23f1f5f9"/><circle cx="200" cy="180" r="60" fill="%23e2e8f0"/><path d="M140 280 Q200 230 260 280" stroke="%23cbd5e1" stroke-width="12" fill="none" stroke-linecap="round"/><text x="200" y="325" font-family="sans-serif" font-size="16" font-weight="bold" fill="%2394a3b8" text-anchor="middle">Jihan Store Official</text></svg>`;
    }
    const raw = product.images[0];
    if (raw.startsWith('/src/assets/images/')) {
      return raw.replace('/src/assets/images/', '/assets/images/');
    }
    return raw;
  };

  const handleOpenDetail = () => {
    setSelectedProductId(product.id);
    setCurrentRoute('product-detail');
  };

  // 🛒 অর্ডার নাও (Instant Buy Now -> Checkout)
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      showToast('দুঃখিত, এই পণ্যটির স্টক বর্তমানে শেষ।');
      return;
    }
    const added = addToCart(product, 1);
    if (added) {
      setCurrentRoute('checkout');
    }
  };

  // + কার্ট (Add to cart and keep browsing)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      showToast('দুঃখিত, এই পণ্যটির স্টক বর্তমানে শেষ।');
      return;
    }
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 overflow-hidden hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left h-full">
      {/* Product Image Wrapper */}
      <div
        onClick={handleOpenDetail}
        className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center select-none"
      >
        <img
          src={getCleanImageUrl()}
          alt={product.banglaName || product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-md shadow-xs font-mono tracking-tight z-10">
            -{product.discountPercentage}%
          </span>
        )}

        {/* Out of Stock Ribbon */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 bg-rose-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-md shadow-xs z-10 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>স্টক শেষ</span>
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer z-10 ${
            inWish
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white border border-slate-200/60'
          }`}
          title={inWish ? 'উইশলিস্ট থেকে মুছুন' : 'উইশলিস্টে রাখুন'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWish ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate max-w-[65%] font-medium">{product.category}</span>
            <div className="flex items-center gap-0.5 text-amber-600 font-bold font-mono shrink-0">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={handleOpenDetail}
            className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug cursor-pointer min-h-[34px]"
            title={product.banglaName || product.name}
          >
            {product.banglaName || product.name}
          </h3>
        </div>

        {/* Pricing Area */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-blue-950 font-mono leading-none">
              ৳{Number(product.price).toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through font-mono">
                ৳{Number(product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: 🛒 অর্ডার নাও (Order Now) & Cart */}
        <div className="pt-1 grid grid-cols-5 gap-1.5">
          {/* Main "🛒 অর্ডার নাও" Button (Span 4 cols) */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`col-span-4 h-8 sm:h-9 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-[0.98]'
            }`}
            title="এখনই অর্ডার করুন"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span className="tracking-tight whitespace-nowrap font-extrabold text-[11px] sm:text-xs">
              {isOutOfStock ? 'স্টক শেষ' : '🛒 অর্ডার নাও'}
            </span>
          </button>

          {/* Secondary "+ কার্ট" Icon Button (Span 1 col) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`col-span-1 h-8 sm:h-9 rounded-lg flex items-center justify-center transition-all shadow-xs border cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                : 'bg-blue-900 hover:bg-blue-800 text-amber-300 border-blue-900 active:scale-95'
            }`}
            title="কার্টে যোগ করুন (+ Cart)"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
