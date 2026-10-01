import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input } from '../../components/common/UI';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentRoute,
    settings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const deliveryCharge = cartSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryChargeInsideCity;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">আপনার কার্ট খালি</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          আপনার শপিং ব্যাগে কোনো পণ্য যোগ করা হয়নি। আমাদের সেরা কালেকশনগুলো ব্রাউজ করুন।
        </p>
        <Button
          variant="gold"
          size="md"
          onClick={() => setCurrentRoute('products')}
          className="mt-2"
        >
          শপিং শুরু করুন
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            শপিং কার্ট (Shopping Bag)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            মোট <span className="font-mono font-bold text-blue-900">{cart.length}</span> টি পণ্য যুক্ত আছে
          </p>
        </div>
        <button
          onClick={() => setCurrentRoute('products')}
          className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>আরও কেনাকাটা করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List - 8 cols */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {cart.map(item => {
            const isAtMaxStock = item.quantity >= item.product.stock;

            return (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {item.product.banglaName || item.product.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{item.product.name}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      {item.selectedColor && (
                        <span>রং: <strong className="text-slate-700">{item.selectedColor}</strong></span>
                      )}
                      {item.selectedSize && (
                        <span>সাইজ: <strong className="text-slate-700">{item.selectedSize}</strong></span>
                      )}
                    </div>
                    <div className="text-xs font-mono font-bold text-blue-950">
                      ৳{item.unitPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Removal */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Stepper (Never exceeds item.product.stock) */}
                  <div className="flex flex-col items-start sm:items-center">
                    <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-mono text-xs font-bold text-slate-900 min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={isAtMaxStock}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 text-xs font-bold cursor-pointer"
                        title={isAtMaxStock ? 'সর্বোচ্চ স্টক লিমিট' : 'পরিমাণ বাড়ান'}
                      >
                        +
                      </button>
                    </div>
                    {isAtMaxStock && (
                      <span className="text-[10px] text-amber-700 font-medium mt-0.5">
                        সর্বোচ্চ {item.product.stock} টি উপলব্ধ
                      </span>
                    )}
                  </div>

                  {/* Subtotal for this item */}
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-blue-950 block">
                      ৳{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 transition-colors inline-flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupon - 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>কুপন কোড (Promo / Coupon)</span>
            </h4>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-800">{appliedCoupon.code}</span>
                  <p className="text-emerald-700 text-[11px]">ছাড় যুক্ত হয়েছে!</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:underline font-semibold"
                >
                  বাতিল
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="যেমন: JIHAN10"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                  <Button type="submit" size="sm" variant="outline">
                    প্রয়োগ
                  </Button>
                </div>
                {couponError && (
                  <p className="text-xs text-rose-600 font-medium">{couponError}</p>
                )}
              </form>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              অর্ডার সারাংশ (Order Summary)
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>পণ্যের মোট মূল্য (Subtotal):</span>
                <span className="font-mono font-semibold text-slate-900">
                  ৳{cartSubtotal.toLocaleString()}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>কুপন ছাড় (Discount):</span>
                  <span className="font-mono font-bold">-৳{cartDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>আনুমানিক ডেলিভারি চার্জ:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {deliveryCharge === 0 ? 'ফ্রি ডেলিভারি' : `৳${deliveryCharge}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900">সর্বমোট (Grand Total):</span>
              <span className="font-mono text-2xl font-extrabold text-blue-950">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>

            <Button
              variant="gold"
              size="lg"
              fullWidth
              onClick={() => setCurrentRoute('checkout')}
              className="gap-2"
            >
              <span>চেকআউট করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>নিরাপদ চেকআউট • ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
