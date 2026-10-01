import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Textarea } from '../../components/common/UI';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Wallet,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    settings,
    currentUser,
    isLoggedIn,
    createOrder,
    customerWallet,
    setCurrentRoute,
    setSelectedOrderId,
    requireAuthForRoute
  } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || 'Dhaka');
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Customer Wallet' | 'Online Gateway'>('Cash on Delivery');
  const [orderNotes, setOrderNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync if currentUser loads
  React.useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name || '');
      if (!phone) setPhone(currentUser.phone || '');
      if (!email) setEmail(currentUser.email || '');
      if (!address) setAddress(currentUser.address || '');
      if (currentUser.city) setCity(currentUser.city);
    }
  }, [currentUser]);

  // Auth guard on initial render of checkout page
  React.useEffect(() => {
    if (!currentUser) {
      requireAuthForRoute('checkout', 'অর্ডার করতে অনুগ্রহ করে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।');
    }
  }, [currentUser]);

  const deliveryCharge =
    cartSubtotal >= settings.freeDeliveryThreshold
      ? 0
      : deliveryArea === 'inside'
      ? settings.deliveryChargeInsideCity
      : settings.deliveryChargeOutsideCity;

  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryCharge);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">আপনার কার্ট খালি</h2>
        <p className="text-xs text-slate-500">অর্ডার করার পূর্বে পণ্য কার্টে যোগ করুন।</p>
        <Button variant="gold" onClick={() => setCurrentRoute('products')}>
          পণ্য ব্রাউজ করুন
        </Button>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('দয়া করে নাম, সচল মোবাইল নম্বর এবং পূর্ণাঙ্গ ডেলিভারি ঠিকানা দিন।');
      return;
    }

    if (paymentMethod === 'Customer Wallet' && customerWallet.currentBalance < grandTotal) {
      setErrorMsg(`ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান ব্যালেন্স: ৳${customerWallet.currentBalance})। ক্যাশ অন ডেলিভারি নির্বাচন করুন।`);
      return;
    }

    // Place order
    const newOrder = createOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      deliveryAddress: address,
      city: deliveryArea === 'inside' ? 'ঢাকা সিটি' : city || 'ঢাকার বাইরে',
      items: cart.map(i => ({
        productId: i.productId,
        productName: i.product.name,
        banglaName: i.product.banglaName,
        image: i.product.images[0],
        color: i.selectedColor,
        size: i.selectedSize,
        price: i.unitPrice,
        quantity: i.quantity
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryCharge,
      grandTotal,
      paymentMethod,
      notes: orderNotes
    });

    setSelectedOrderId(newOrder.id);
    setCurrentRoute('order-detail');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          অর্ডার চেকআউট (Order Checkout)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনার ডেলিভারি তথ্য দিয়ে দ্রুত অর্ডার নিশ্চিত করুন
        </p>
      </div>

      {/* Guest Notice if not logged in */}
      {!isLoggedIn && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div>
            <span className="font-bold">লগইন ছাড়াই চেকআউট করতে পারেন!</span>
            <p className="text-amber-800 text-[11px] mt-0.5">
              অথবা আপনার একাউন্টে লগইন করে পূর্বের সংরক্ষিত ঠিকানা ব্যবহার করুন।
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentRoute('login')}
            className="border-amber-400 bg-white text-amber-900 shrink-0"
          >
            লগইন করুন
          </Button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer Information & Shipping Form - 7 cols */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-900" />
              <span>ডেলিভারি তথ্য (Delivery Information)</span>
            </h3>

            <div className="space-y-4">
              <Input
                label="আপনার পূর্ণ নাম (Full Name)*"
                placeholder="যেমন: মোহাম্মদ জাহিদ"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="মোবাইল নম্বর (Phone Number)*"
                  placeholder="01XXXXXXXXX"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
                <Input
                  label="ইমেইল (Email Address - Optional)"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Delivery Area */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  ডেলিভারি এলাকা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryArea('inside')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      deliveryArea === 'inside'
                        ? 'border-blue-900 bg-blue-50/50 font-bold text-blue-950 ring-1 ring-blue-900'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>ঢাকার ভিতরে</span>
                      <span className="font-mono text-blue-900">৳{settings.deliveryChargeInsideCity}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">১-২ কার্যদিবস</span>
                  </div>

                  <div
                    onClick={() => setDeliveryArea('outside')}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      deliveryArea === 'outside'
                        ? 'border-blue-900 bg-blue-50/50 font-bold text-blue-950 ring-1 ring-blue-900'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>ঢাকার বাইরে</span>
                      <span className="font-mono text-blue-900">৳{settings.deliveryChargeOutsideCity}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal">২-৪ কার্যদিবস</span>
                  </div>
                </div>
              </div>

              <Textarea
                label="সম্পূর্ণ ঠিকানা (Full Delivery Address)*"
                placeholder="বাসা নং, রোড নং, এলাকা, থানা ও জেলা..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                required
              />

              <Input
                label="ডেলিভারি সংক্রান্ত নির্দেশনা (Order Notes - Optional)"
                placeholder="যেমন: বিকেল ৫টার পর ডেলিভারি করবেন..."
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-900" />
              <span>পেমেন্ট পদ্ধতি (Payment Method)</span>
            </h3>

            <div className="space-y-2">
              {/* Cash on Delivery (Default) */}
              <label
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-blue-900 bg-blue-50/40 ring-1 ring-blue-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-0.5 text-blue-900 focus:ring-blue-800"
                />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">
                    ক্যাশ অন ডেলিভারি (Cash on Delivery)
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    পণ্যটি হাতে পাওয়ার পর দেখে সম্পূর্ণ মূল্য ডেলিভারিম্যানকে পরিশোধ করুন।
                  </span>
                </div>
              </label>

              {/* Customer Wallet */}
              <label
                onClick={() => setPaymentMethod('Customer Wallet')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Customer Wallet'
                    ? 'border-blue-900 bg-blue-50/40 ring-1 ring-blue-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Customer Wallet'}
                  onChange={() => setPaymentMethod('Customer Wallet')}
                  className="mt-0.5 text-blue-900 focus:ring-blue-800"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      কাস্টমার ওয়ালেট (Jihan Store Wallet)
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      ব্যালেন্স: ৳{customerWallet.currentBalance.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    ওয়ালেটের ব্যালেন্স থেকে এক ক্লিকে সরাসরি পে করুন।
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Confirmation - 5 cols */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            আপনার অর্ডার ({cart.length} টি আইটেম)
          </h3>

          {/* Cart preview */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
            {cart.map(item => (
              <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-semibold text-slate-900 line-clamp-1">
                      {item.product.banglaName || item.product.name}
                    </h5>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold text-blue-950">
                  ৳{(item.unitPrice * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Charges */}
          <div className="space-y-2 pt-3 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>সাবটোটাল (Subtotal):</span>
              <span className="font-mono font-semibold text-slate-900">
                ৳{cartSubtotal.toLocaleString()}
              </span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>ডিসকাউন্ট (Discount):</span>
                <span className="font-mono font-bold">-৳{cartDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-mono font-semibold text-slate-900">
                {deliveryCharge === 0 ? 'ফ্রি' : `৳${deliveryCharge}`}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm text-slate-900">
              <span>সর্বমোট পরিশোধযোগ্য:</span>
              <span className="font-mono text-xl font-extrabold text-blue-950">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            className="gap-2 shadow-md"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>অর্ডার কনফার্ম করুন (Place Order)</span>
          </Button>

          <div className="p-3 bg-slate-50 rounded-xl text-center space-y-1">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-900" />
              <span>১০০% নিরাপদ এবং তথ্য গোপনীয়তার নিশ্চয়তা</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
