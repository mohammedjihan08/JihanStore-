import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/common/UI';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    setSelectedProductId,
    setCurrentRoute
  } = useStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">আপনার পছন্দের তালিকা খালি</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          আপনার পছন্দ অনুযায়ী সেরা পণ্যগুলো উইশলিস্টে সংরক্ষণ করে সহজে এক ক্লিকে অর্ডার করতে পারবেন।
        </p>
        <Button
          variant="gold"
          size="md"
          onClick={() => setCurrentRoute('products')}
          className="gap-2"
        >
          <span>পণ্য ব্রাউজ করুন</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            আমার পছন্দের তালিকা (My Wishlist)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            মোট <span className="font-mono font-bold text-blue-900">{wishlistProducts.length}</span> টি সংরক্ষিত পণ্য
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentRoute('products')}
        >
          আরও পণ্য যোগ করুন
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
        {wishlistProducts.map(product => (
          <div
            key={product.id}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div
                onClick={() => {
                  setSelectedProductId(product.id);
                  setCurrentRoute('product-detail');
                }}
                className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 text-rose-600 flex items-center justify-center hover:bg-white transition-colors shadow-2xs cursor-pointer"
                  title="উইশলিস্ট থেকে মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2 sm:p-2.5 space-y-1">
                <span className="text-[10px] text-slate-400 block truncate">{product.category}</span>
                <h3
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setCurrentRoute('product-detail');
                  }}
                  className="font-semibold text-xs text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug cursor-pointer min-h-[30px]"
                >
                  {product.banglaName || product.name}
                </h3>
                <div className="font-mono text-xs sm:text-sm font-extrabold text-blue-950">
                  ৳{product.price.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 pt-0">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                disabled={product.stock <= 0}
                onClick={() => addToCart(product, 1)}
                className="gap-1 py-1 text-xs"
              >
                <ShoppingBag className="w-3 h-3 text-amber-400" />
                <span>কার্টে নিন</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
