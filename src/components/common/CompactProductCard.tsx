import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Star } from 'lucide-react';

interface CompactProductCardProps {
  product: Product;
}

export const CompactProductCard: React.FC<CompactProductCardProps> = ({ product }) => {
  const {
    setCurrentRoute,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const inWish = isInWishlist(product.id);

  const handleClick = () => {
    setSelectedProductId(product.id);
    setCurrentRoute('product-detail');
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left">
      {/* Product Image */}
      <div
        onClick={handleClick}
        className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-xs font-mono">
            -{product.discountPercentage}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
            inWish
              ? 'bg-amber-50 text-amber-600'
              : 'bg-white/90 text-slate-500 hover:text-rose-600'
          }`}
          title={inWish ? 'উইশলিস্ট থেকে মুছুন' : 'উইশলিস্টে রাখুন'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-amber-600' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="truncate max-w-[70%]">{product.category}</span>
            <div className="flex items-center gap-0.5 text-amber-600 font-semibold font-mono shrink-0">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3
            onClick={handleClick}
            className="font-semibold text-xs text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug cursor-pointer min-h-[30px]"
            title={product.banglaName || product.name}
          >
            {product.banglaName || product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-extrabold text-blue-950 font-mono leading-none">
              ৳{product.price.toLocaleString()}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[10px] text-slate-400 line-through font-mono leading-tight">
                ৳{product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="h-7 px-2 rounded-lg bg-blue-900 hover:bg-blue-800 active:scale-95 text-amber-300 flex items-center justify-center gap-1 text-[11px] font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
            title="অর্ডার করুন"
          >
            <ShoppingBag className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">অর্ডার</span>
          </button>
        </div>
      </div>
    </div>
  );
};
