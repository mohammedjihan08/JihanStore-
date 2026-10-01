import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Button } from '../../components/common/UI';
import { CompactProductCard } from '../../components/common/CompactProductCard';
import { ShoppingBag, Heart, Star, Filter, SlidersHorizontal } from 'lucide-react';

export const AllProductsPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    setSelectedProductId,
    setCurrentRoute,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (product.isHidden) return false;
    if (selectedCategory && selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    if (inStockOnly && product.stock <= 0) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentRoute('product-detail');
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            সকল প্রোডাক্টস (All Products)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            মোট <span className="font-mono font-bold text-blue-900">{sortedProducts.length}</span> টি পণ্য পাওয়া গেছে
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <select
            value={selectedCategory || 'all'}
            onChange={e => setSelectedCategory(e.target.value === 'all' ? null : e.target.value)}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-800"
          >
            <option value="all">সব ক্যাটাগরি (All Categories)</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.banglaName} ({c.name})
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-800"
          >
            <option value="featured">ফিচার্ড (Featured)</option>
            <option value="price-low">মূল্য: কম থেকে বেশি (Price: Low to High)</option>
            <option value="price-high">মূল্য: বেশি থেকে কম (Price: High to Low)</option>
            <option value="rating">সেরা রেটিং (Top Rated)</option>
          </select>

          {/* In Stock toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`text-xs px-3 py-2 rounded-lg font-medium border transition-colors ${
              inStockOnly
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            স্টকে আছে
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">কোনো পণ্য খুঁজে পাওয়া যায়নি। ফিল্টার পরিবর্তন করে চেষ্টা করুন।</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => {
              setSelectedCategory(null);
              setInStockOnly(false);
            }}
          >
            সব ফিল্টার ক্লিয়ার করুন
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
          {sortedProducts.map(product => (
            <CompactProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
