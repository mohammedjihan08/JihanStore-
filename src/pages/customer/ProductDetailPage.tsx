import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/common/UI';
import { CompactProductCard } from '../../components/common/CompactProductCard';
import {
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronLeft,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setCurrentRoute,
    addToCart,
    toggleWishlist,
    isInWishlist,
    settings,
    ads,
    requireAuthForRoute
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">পণ্যটি খুঁজে পাওয়া যায়নি।</p>
        <Button onClick={() => setCurrentRoute('products')} className="mt-4">
          সকল পণ্য দেখুন
        </Button>
      </div>
    );
  }

  const inWish = isInWishlist(product.id);
  const productAd = ads.find(a => a.isActive && a.position === 'Product Page');

  const handleQuantityChange = (delta: number) => {
    const nextQty = quantity + delta;
    if (nextQty >= 1 && nextQty <= product.stock) {
      setQuantity(nextQty);
    }
  };

  const handleBuyNow = () => {
    const success = addToCart(product, quantity, selectedColor, selectedSize);
    if (success) {
      const isAuth = requireAuthForRoute('checkout', 'অর্ডার করতে অনুগ্রহ করে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।');
      if (isAuth) {
        setCurrentRoute('checkout');
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 md:pb-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => setCurrentRoute('products')}
          className="hover:text-blue-900 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>সকল পণ্য</span>
        </button>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Contiguous Purchase Module (Gallery Left, Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={(selectedImage || product.images[0] || '').replace('/src/assets/images/', '/assets/images/')}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f8fafc"><rect width="400" height="400" fill="%23f1f5f9"/><circle cx="200" cy="180" r="60" fill="%23e2e8f0"/><path d="M140 280 Q200 230 260 280" stroke="%23cbd5e1" stroke-width="12" fill="none" stroke-linecap="round"/><text x="200" y="325" font-family="sans-serif" font-size="16" font-weight="bold" fill="%2394a3b8" text-anchor="middle">Jihan Store Official</text></svg>`;
              }}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded shadow-sm font-mono">
                -{product.discountPercentage}% ছাড়
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                inWish
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-white/90 text-slate-600 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWish ? 'fill-amber-600' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-blue-900 ring-1 ring-blue-900' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module - 5 cols */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono uppercase font-semibold text-amber-600">SKU: {product.sku}</span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} রিভিউ)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {product.banglaName || product.name}
            </h1>
            <p className="text-xs text-slate-500">{product.name}</p>

            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-blue-950 font-mono">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through font-mono">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Availability Status */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">স্টক অবস্থা:</span>
            {product.stock > 0 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" /> স্টকে আছে ({product.stock} টি উপলব্ধ)
              </span>
            ) : (
              <span className="text-rose-600 font-semibold">স্টক শেষ (Out of Stock)</span>
            )}
          </div>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">
                রং নির্বাচন করুন (Select Color):
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition-all ${
                      selectedColor === col
                        ? 'border-blue-900 bg-blue-50/50 text-blue-950 font-bold ring-1 ring-blue-900'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">
                সাইজ নির্বাচন করুন (Select Size):
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition-all ${
                      selectedSize === sz
                        ? 'border-blue-900 bg-blue-50/50 text-blue-950 font-bold ring-1 ring-blue-900'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper (Never allow customer to exceed stock) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">পরিমাণ (Quantity):</label>
              <span className="text-slate-500 font-mono text-[11px]">সর্বোচ্চ {product.stock} টি</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-mono text-sm font-bold text-slate-900 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              size="lg"
              disabled={product.stock <= 0}
              onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
              className="gap-2 border-blue-900 text-blue-900 hover:bg-blue-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>কার্টে যোগ করুন</span>
            </Button>

            <Button
              variant="gold"
              size="lg"
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
              className="gap-2 font-bold cursor-pointer"
            >
              <span>🛒 অর্ডার নাও</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Delivery & Payment Guarantee Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <Truck className="w-4 h-4 text-blue-900" />
              <span>ডেলিভারি চার্জ: ঢাকার ভিতরে ৳{settings.deliveryChargeInsideCity}, বাইরে ৳{settings.deliveryChargeOutsideCity}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ করুন)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>২৪ ঘণ্টার মধ্যে সহজ রিটার্ন সুবিধা</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specifications */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">পণ্যের বিবরণ (Product Description)</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              স্পেসিফিকেশন (Technical Specifications)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">{key}:</span>
                  <span className="text-slate-900 font-medium text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Page Contextual Advertisement */}
      {productAd && (
        <aside className="bg-linear-to-r from-blue-950 to-slate-900 text-white p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={productAd.imageUrl}
              alt=""
              className="w-16 h-16 rounded-xl object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400">Featured Offer</span>
              <h4 className="text-sm font-bold text-white">{productAd.title}</h4>
              <p className="text-xs text-slate-300 max-w-lg mt-0.5">{productAd.description}</p>
            </div>
          </div>
          <a
            href={productAd.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold bg-amber-500 text-slate-950 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors shrink-0 inline-flex items-center gap-1.5"
          >
            <span>{productAd.buttonText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </aside>
      )}

      {/* Related Products Compact Grid */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            সম্পর্কিত আরও পণ্য (Related Products)
          </h3>
          <button
            onClick={() => setCurrentRoute('products')}
            className="text-xs font-semibold text-blue-900 hover:text-amber-600 transition-colors"
          >
            সব দেখুন
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
          {products
            .filter(p => p.id !== product.id && !p.isHidden)
            .slice(0, 6)
            .map(item => (
              <CompactProductCard key={item.id} product={item} />
            ))}
        </div>
      </section>

      {/* Sticky Bottom Buy Bar on Mobile (Within 15% Cap) */}
      <div className="md:hidden fixed bottom-[64px] left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-xs text-slate-500 block">মূল্য:</span>
          <span className="text-base font-extrabold text-blue-950 font-mono">
            ৳{product.price.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
          >
            কার্টে নিন
          </Button>
          <Button
            size="sm"
            variant="gold"
            onClick={handleBuyNow}
          >
            এখনই কিনুন
          </Button>
        </div>
      </div>
    </div>
  );
};
