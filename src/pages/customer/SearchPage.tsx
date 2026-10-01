import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingBag, Heart, Star, SlidersHorizontal } from 'lucide-react';
import { Button } from '../../components/common/UI';
import { CompactProductCard } from '../../components/common/CompactProductCard';

export const SearchPage: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    setSelectedProductId,
    setCurrentRoute,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const query = searchQuery.trim().toLowerCase();

  // Search across: product name, Bangla name, category, SKU, and tags/keywords
  const searchResults = products.filter(product => {
    if (product.isHidden) return false;

    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    if (!query) return true;

    const matchName = product.name.toLowerCase().includes(query);
    const matchBangla = product.banglaName.toLowerCase().includes(query);
    const matchCategory = product.category.toLowerCase().includes(query);
    const matchSku = product.sku.toLowerCase().includes(query);
    const matchTags = product.tags.some(t => t.toLowerCase().includes(query));
    const matchDesc = product.description.toLowerCase().includes(query);

    return matchName || matchBangla || matchCategory || matchSku || matchTags || matchDesc;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar Input */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h1 className="text-xl font-bold text-slate-900">
          পণ্য অনুসন্ধান (Search Products)
        </h1>
        <p className="text-xs text-slate-500">
          পণ্যের নাম, বাংলা নাম, ক্যাটাগরি, SKU কোড বা কি-ওয়ার্ড দিয়ে খুঁজুন
        </p>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="উদাহরণ: হেডফোন, ঘড়ি, লেদার ব্যাগ, JS-AUD-001..."
            className="w-full text-sm rounded-xl border border-slate-300 pl-11 pr-4 py-3 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all"
            autoFocus
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-semibold text-slate-500">জনপ্রিয় সার্চ:</span>
          {['হেডফোন', 'স্মার্টওয়াচ', 'লেদার ব্যাগ', 'শার্ট', 'JS-AUD-001'].map(term => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 rounded-md transition-colors font-mono cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <span>
          ফলাফল: <strong className="text-slate-900 font-mono">{searchResults.length}</strong> টি পণ্য পাওয়া গেছে
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-800 hover:underline font-medium"
          >
            সার্চ মুছুন (Clear)
          </button>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <p className="text-sm text-slate-600 font-medium">
            "{searchQuery}" এর জন্য কোনো পণ্য খুঁজে পাওয়া যায়নি।
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            বানান সঠিক কিনা যাচাই করুন অথবা অন্য সাধারণ কোনো কীওয়ার্ড দিয়ে চেষ্টা করুন।
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSearchQuery('')}
          >
            সকল পণ্য ব্রাউজ করুন
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
          {searchResults.map(product => (
            <CompactProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
