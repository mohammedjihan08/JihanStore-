import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Button } from '../../components/common/UI';
import { CompactProductCard } from '../../components/common/CompactProductCard';
import {
  ArrowRight,
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    banners,
    ads,
    setCurrentRoute,
    setSelectedProductId,
    setSelectedCategory,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const activeBanner = banners.find(b => b.isActive) || banners[0];
  const homeTopAd = ads.find(a => a.isActive && a.position === 'Home Top');
  const homeMiddleAd = ads.find(a => a.isActive && a.position === 'Home Middle');

  const featuredProducts = products.filter(p => p.isActive && !p.isHidden).slice(0, 6);

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentRoute('product-detail');
  };

  return (
    <div className="space-y-10 md:space-y-14">
      {/* Optional Home Top Ad */}
      {homeTopAd && (
        <aside className="w-full bg-linear-to-r from-blue-900 to-blue-950 text-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-amber-500/30">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Ad
            </span>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">{homeTopAd.title}</p>
              <p className="text-[11px] text-slate-300 hidden sm:block">{homeTopAd.description}</p>
            </div>
          </div>
          <a
            href={homeTopAd.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors shrink-0 inline-flex items-center gap-1.5"
          >
            <span>{homeTopAd.buttonText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </aside>
      )}

      {/* Hero Showcase Section */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-950 text-white min-h-[380px] sm:min-h-[440px] flex items-center shadow-lg border border-slate-800">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0">
          <img
            src={activeBanner.imageUrl}
            alt="Jihan Store Hero"
            className="w-full h-full object-cover object-center opacity-40 scale-102 transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-950/95 via-blue-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>বিশ্বাসের সাথে অনলাইন শপিং</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-200">ক্যাশ অন ডেলিভারি</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {activeBanner.banglaTitle || activeBanner.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
            {activeBanner.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="gold"
              size="md"
              onClick={() => setCurrentRoute('products')}
              className="gap-2"
            >
              <span>{activeBanner.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentRoute('categories')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              ক্যাটাগরি সমূহ
            </Button>
          </div>
        </div>
      </section>

      {/* Category Pills/Grid Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              জনপ্রিয় ক্যাটাগরি (Shop by Category)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">আপনার পছন্দের পণ্য সহজে খুঁজে নিন</p>
          </div>
          <button
            onClick={() => setCurrentRoute('categories')}
            className="text-xs font-semibold text-blue-900 hover:text-amber-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.name);
                setCurrentRoute('products');
              }}
              className="group p-4 bg-white rounded-xl border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
                  {cat.itemCount} টি পণ্য
                </span>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-900 mt-1">
                  {cat.banglaName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-2 truncate">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              বাছাইকৃত সেরা কালেকশন (Featured Products)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">আসল গুণমান ও সেরা মূল্যের প্রতিশ্রুতি</p>
          </div>
          <button
            onClick={() => setCurrentRoute('products')}
            className="text-xs font-semibold text-blue-900 hover:text-amber-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>সকল পণ্য ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
          {featuredProducts.map(product => (
            <CompactProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Ad Placement: Home Middle */}
      {homeMiddleAd && (
        <section className="bg-linear-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-2xl overflow-hidden shadow-md border border-amber-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-6 sm:p-10 space-y-3">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                স্পেশাল প্রমোশন (Special Campaign)
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {homeMiddleAd.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {homeMiddleAd.description}
              </p>
              <div className="pt-2">
                <a
                  href={homeMiddleAd.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-lg hover:bg-amber-400 transition-colors text-xs sm:text-sm"
                >
                  <span>{homeMiddleAd.buttonText}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="h-48 md:h-full relative overflow-hidden bg-slate-800">
              <img
                src={homeMiddleAd.imageUrl}
                alt={homeMiddleAd.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>
      )}

      {/* Trust & Guarantee Banner */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-800" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">বিশ্বাসের সাথে শপিং</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করার সুবিধা। কোনো গোপন চার্জ নেই।
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">দ্রুততম ডেলিভারি</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              ঢাকায় ১-২ দিন এবং ঢাকার বাইরে ২-৪ দিনের মধ্যে সুরক্ষিত হোম ডেলিভারি।
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 text-blue-800" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">কাস্টমার ওয়ালেট সুবিধা</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              সহজে ওয়ালেটে টাকা জমা রাখুন, দ্রুত চেকআউট করুন এবং নিশ্চিত রিফান্ড পান।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
