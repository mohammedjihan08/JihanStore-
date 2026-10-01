import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Textarea } from '../../components/common/UI';
import { BANGLADESH_DIVISIONS } from '../../data/bangladeshLocations';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Wallet,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Check,
  Building2,
  Info,
  MapPin,
  Sparkles,
  Gift
} from 'lucide-react';
import { MobileBankingAccount, BankAccountEntry } from '../../types';

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
    calculateDeliveryCharge
  } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  // Location selector state
  const [selectedDivision, setSelectedDivision] = useState<string>('Chittagong');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chittagong');
  const [selectedArea, setSelectedArea] = useState<string>('Sandwip (সন্দ্বীপ)');

  // Active payment accounts filtered strictly by isActive === true
  const activeBkash = (settings.bkashAccounts || []).filter(a => a.isActive);
  const activeNagad = (settings.nagadAccounts || []).filter(a => a.isActive);
  const activeRocket = (settings.rocketAccounts || []).filter(a => a.isActive);
  const activeUpay = (settings.upayAccounts || []).filter(a => a.isActive);
  const activeBanks = (settings.bankAccounts || []).filter(a => a.isActive);

  type PaymentOption =
    | 'Cash on Delivery'
    | 'Customer Wallet'
    | 'bKash'
    | 'Nagad'
    | 'Rocket'
    | 'Upay'
    | 'Bank Transfer';

  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('Cash on Delivery');

  // Selected accounts for mobile banking & bank
  const [selectedBkashId, setSelectedBkashId] = useState<string>(() => {
    const def = activeBkash.find(a => a.isDefault);
    return def ? def.id : (activeBkash[0]?.id || '');
  });
  const [selectedNagadId, setSelectedNagadId] = useState<string>(() => {
    const def = activeNagad.find(a => a.isDefault);
    return def ? def.id : (activeNagad[0]?.id || '');
  });
  const [selectedRocketId, setSelectedRocketId] = useState<string>(() => {
    const def = activeRocket.find(a => a.isDefault);
    return def ? def.id : (activeRocket[0]?.id || '');
  });
  const [selectedUpayId, setSelectedUpayId] = useState<string>(() => {
    const def = activeUpay.find(a => a.isDefault);
    return def ? def.id : (activeUpay[0]?.id || '');
  });
  const [selectedBankId, setSelectedBankId] = useState<string>(() => {
    const def = activeBanks.find(a => a.isDefault);
    return def ? def.id : (activeBanks[0]?.id || '');
  });

  // Transaction details from customer
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [depositSlipInfo, setDepositSlipInfo] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [orderNotes, setOrderNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Location lookups
  const currentDivObj = BANGLADESH_DIVISIONS.find(d => d.name === selectedDivision);
  const availableDistricts = currentDivObj ? currentDivObj.districts : [];
  const currentDistObj = availableDistricts.find(d => d.name === selectedDistrict);
  const availableUpazilas = currentDistObj?.upazilas || [];

  // Live Location-based Delivery Calculation
  const deliveryCalc = useMemo(() => {
    return calculateDeliveryCharge(
      selectedDistrict,
      selectedArea || address,
      cartSubtotal,
      selectedDivision
    );
  }, [calculateDeliveryCharge, selectedDistrict, selectedArea, address, cartSubtotal, selectedDivision, settings.deliveryRules]);

  const deliveryCharge = deliveryCalc.charge;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryCharge);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">আপনার শপিং কার্ট খালি</h2>
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
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('দয়া করে নাম, সচল মোবাইল নম্বর এবং পূর্ণাঙ্গ ডেলিভারি ঠিকানা দিন।');
      return;
    }

    if (paymentMethod === 'Customer Wallet' && customerWallet.currentBalance < grandTotal) {
      setErrorMsg(`ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান ব্যালেন্স: ৳${customerWallet.currentBalance})। ক্যাশ অন ডেলিভারি বা অন্য কোনো পেমেন্ট মেথড নির্বাচন করুন।`);
      return;
    }

    // Validation for mobile banking TrxID
    if (['bKash', 'Nagad', 'Rocket', 'Upay'].includes(paymentMethod)) {
      if (!trxId.trim()) {
        setErrorMsg(`দয়া করে ${paymentMethod} পেমেন্টের Transaction ID (TrxID) প্রদান করুন।`);
        return;
      }
    }

    // Validation for Bank transfer
    if (paymentMethod === 'Bank Transfer') {
      if (!depositSlipInfo.trim()) {
        setErrorMsg('দয়া করে ব্যাংক ডিপোজিট স্লিপ নম্বর বা অনলাইন ফান্ড ট্রান্সফার রেফারেন্স প্রদান করুন।');
        return;
      }
    }

    // Resolve selected account details
    let paymentDetails: any = undefined;
    if (paymentMethod === 'bKash') {
      const acc = activeBkash.find(a => a.id === selectedBkashId) || activeBkash[0];
      paymentDetails = {
        provider: 'bKash',
        accountNumber: acc?.accountNumber,
        accountType: acc?.accountType,
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim()
      };
    } else if (paymentMethod === 'Nagad') {
      const acc = activeNagad.find(a => a.id === selectedNagadId) || activeNagad[0];
      paymentDetails = {
        provider: 'Nagad',
        accountNumber: acc?.accountNumber,
        accountType: acc?.accountType,
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim()
      };
    } else if (paymentMethod === 'Rocket') {
      const acc = activeRocket.find(a => a.id === selectedRocketId) || activeRocket[0];
      paymentDetails = {
        provider: 'Rocket',
        accountNumber: acc?.accountNumber,
        accountType: acc?.accountType,
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim()
      };
    } else if (paymentMethod === 'Upay') {
      const acc = activeUpay.find(a => a.id === selectedUpayId) || activeUpay[0];
      paymentDetails = {
        provider: 'Upay',
        accountNumber: acc?.accountNumber,
        accountType: acc?.accountType,
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim()
      };
    } else if (paymentMethod === 'Bank Transfer') {
      const acc = activeBanks.find(a => a.id === selectedBankId) || activeBanks[0];
      paymentDetails = {
        provider: 'Bank Transfer',
        bankName: acc?.bankName,
        accountName: acc?.accountName,
        accountNumber: acc?.accountNumber,
        branch: acc?.branch,
        depositSlipInfo: depositSlipInfo.trim()
      };
    }

    const locationFormatted = `${selectedDistrict}${selectedArea ? ', ' + selectedArea : ''}`;

    // Place order
    const newOrder = createOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      deliveryAddress: address,
      city: locationFormatted,
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
      paymentDetails,
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
          আপনার ডেলিভারি ঠিকানা দিন — জেলা ও এলাকা অনুযায়ী স্বয়ংক্রিয়ভাবে ডেলিভারি চার্জ নির্ধারিত হবে
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
              <span>ডেলিভারি তথ্য ও এলাকা নির্বাচন (Delivery Location)</span>
            </h3>

            <div className="space-y-4">
              <Input
                label="আপনার পূর্ণ নাম (Full Name)*"
                placeholder="যেমন: তানভীর রহমান"
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
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Dynamic Bangladesh Location Selector */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-900" />
                    <span>ডেলিভারি বিভাগ ও জেলা নির্বাচন করুন*</span>
                  </span>
                  <span className="text-[11px] text-slate-400">এলাকা অনুযায়ী চার্জ নির্ধারিত হবে</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">বিভাগ (Division):</label>
                    <select
                      value={selectedDivision}
                      onChange={e => {
                        const div = e.target.value;
                        const divObj = BANGLADESH_DIVISIONS.find(d => d.name === div);
                        const firstDist = divObj ? divObj.districts[0]?.name || 'Chittagong' : 'Chittagong';
                        setSelectedDivision(div);
                        setSelectedDistrict(firstDist);
                        setSelectedArea('');
                      }}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium focus:ring-1 focus:ring-blue-900"
                    >
                      {BANGLADESH_DIVISIONS.map(d => (
                        <option key={d.name} value={d.name}>
                          {d.banglaName} ({d.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">জেলা (District):</label>
                    <select
                      value={selectedDistrict}
                      onChange={e => {
                        const dist = e.target.value;
                        setSelectedDistrict(dist);
                        setSelectedArea('');
                      }}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium focus:ring-1 focus:ring-blue-900"
                    >
                      {availableDistricts.map(d => (
                        <option key={d.name} value={d.name}>
                          {d.banglaName} ({d.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub-area / Upazila selection (e.g. Sandwip, etc.) */}
                {availableUpazilas.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      উপজেলা / নির্দিষ্ট এলাকা (Upazila / Area):
                    </label>
                    {/* Quick pills for specially configured areas in this district */}
                    {(() => {
                      const districtSpecificRules = (settings.deliveryRules || []).filter(
                        r =>
                          r.isActive &&
                          r.area &&
                          r.area !== 'All' &&
                          (r.district.toLowerCase() === selectedDistrict.toLowerCase() || r.district === 'All')
                      );

                      if (districtSpecificRules.length === 0) return null;

                      return (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {districtSpecificRules.map(rule => {
                            const isSelected =
                              selectedArea.toLowerCase().includes((rule.area || '').toLowerCase()) ||
                              selectedArea === rule.name;
                            return (
                              <button
                                key={rule.id}
                                type="button"
                                onClick={() => setSelectedArea(rule.area || rule.name)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? rule.isFreeDelivery
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                      : 'bg-blue-900 text-white border-blue-900 shadow-xs'
                                    : rule.isFreeDelivery
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                      : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                                }`}
                              >
                                {rule.isFreeDelivery ? (
                                  <Gift className="w-3.5 h-3.5" />
                                ) : (
                                  <Truck className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {rule.name} (
                                  {rule.isFreeDelivery ? 'FREE ৳০' : `৳${rule.deliveryCharge}`})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}

                    <select
                      value={selectedArea}
                      onChange={e => setSelectedArea(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium focus:ring-1 focus:ring-blue-900"
                    >
                      <option value="">সম্পূর্ণ জেলা / সদর (All Upazilas)</option>
                      {availableUpazilas.map(up => (
                        <option key={up} value={up}>
                          {up}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Live Delivery Calculation Notification Card */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    deliveryCalc.isFree
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-blue-50 border-blue-200 text-blue-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {deliveryCalc.isFree ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Truck className="w-5 h-5 text-blue-900 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold block">
                        {deliveryCalc.ruleName}
                      </span>
                      <span className="text-[11px] opacity-80">
                        আনুমানিক ডেলিভারি সময়: {deliveryCalc.estimatedDays || '২-৪ কার্যদিবস'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {deliveryCalc.isFree ? (
                      <span className="font-mono font-black text-sm bg-emerald-600 text-white px-2.5 py-1 rounded-md shadow-2xs">
                        FREE (৳০)
                      </span>
                    ) : (
                      <span className="font-mono font-black text-base text-blue-950">
                        ৳{deliveryCalc.charge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Textarea
                label="সম্পূর্ণ ডেলিভারি ঠিকানা (Full Street Address / House / Road)*"
                placeholder="বাসা নং, রোড নং, এলাকা, গ্রাম বা বাজার..."
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

            <div className="space-y-2.5">
              {/* 1. Cash on Delivery (Always Available) */}
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

              {/* 2. Customer Wallet */}
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
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      কাস্টমার ওয়ালেট (Jihan Store Wallet)
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      ব্যালেন্স: ৳{customerWallet.currentBalance.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    ওয়ালেটের ব্যালেন্স থেকে ১-ক্লিকে সরাসরি পে করুন।
                  </span>
                </div>
              </label>

              {/* 3. bKash (Only if active accounts exist) */}
              {activeBkash.length > 0 && (
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    paymentMethod === 'bKash'
                      ? 'border-pink-500 bg-pink-50/30 ring-1 ring-pink-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('bKash')}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bKash'}
                      onChange={() => setPaymentMethod('bKash')}
                      className="mt-0.5 text-pink-600 focus:ring-pink-500"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-bold font-mono">
                          bK
                        </span>
                        <span>বিকাশ পেমেন্ট (bKash)</span>
                      </span>
                      <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded">
                        {activeBkash.length} টি অ্যাকাউন্ট
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'bKash' && (
                    <div className="mt-3.5 pt-3 border-t border-pink-200 space-y-3 pl-7 text-xs">
                      {activeBkash.length > 1 && (
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">বিকাশ অ্যাকাউন্ট নির্বাচন করুন:</label>
                          <select
                            value={selectedBkashId}
                            onChange={e => setSelectedBkashId(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                          >
                            {activeBkash.map(acc => (
                              <option key={acc.id} value={acc.id}>
                                {acc.accountNumber} ({acc.accountType}) {acc.label ? `- ${acc.label}` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {(() => {
                        const acc = activeBkash.find(a => a.id === selectedBkashId) || activeBkash[0];
                        if (!acc) return null;
                        return (
                          <div className="p-3 bg-white border border-pink-200 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">বিকাশ নম্বর:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-base text-pink-700">{acc.accountNumber}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(acc.accountNumber, `bkash-${acc.id}`)}
                                  className="inline-flex items-center gap-1 text-[11px] text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded border border-pink-200 transition-colors"
                                >
                                  {copiedKey === `bkash-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedKey === `bkash-${acc.id}` ? 'কপি হয়েছে' : 'কপি'}</span>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>অ্যাকাউন্টের ধরন:</span>
                              <span className="font-bold text-slate-800">{acc.accountType}</span>
                            </div>
                            {acc.instructions && (
                              <p className="text-[11px] text-slate-600 bg-pink-50/50 p-2 rounded border border-pink-100">
                                <strong>নির্দেশনা:</strong> {acc.instructions}
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <Input
                          label="যে বিকাশ নম্বর থেকে পাঠিয়েছেন*"
                          placeholder="01XXXXXXXXX"
                          value={senderNumber}
                          onChange={e => setSenderNumber(e.target.value)}
                          required
                        />
                        <Input
                          label="বিকাশ Transaction ID (TrxID)*"
                          placeholder="যেমন: BKP9081237A"
                          value={trxId}
                          onChange={e => setTrxId(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Nagad (Only if active accounts exist) */}
              {activeNagad.length > 0 && (
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    paymentMethod === 'Nagad'
                      ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('Nagad')}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Nagad'}
                      onChange={() => setPaymentMethod('Nagad')}
                      className="mt-0.5 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold font-mono">
                          NG
                        </span>
                        <span>নগদ পেমেন্ট (Nagad)</span>
                      </span>
                      <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">
                        {activeNagad.length} টি অ্যাকাউন্ট
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'Nagad' && (
                    <div className="mt-3.5 pt-3 border-t border-orange-200 space-y-3 pl-7 text-xs">
                      {activeNagad.length > 1 && (
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">নগদ অ্যাকাউন্ট নির্বাচন করুন:</label>
                          <select
                            value={selectedNagadId}
                            onChange={e => setSelectedNagadId(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                          >
                            {activeNagad.map(acc => (
                              <option key={acc.id} value={acc.id}>
                                {acc.accountNumber} ({acc.accountType}) {acc.label ? `- ${acc.label}` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {(() => {
                        const acc = activeNagad.find(a => a.id === selectedNagadId) || activeNagad[0];
                        if (!acc) return null;
                        return (
                          <div className="p-3 bg-white border border-orange-200 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">নগদ নম্বর:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-base text-orange-700">{acc.accountNumber}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(acc.accountNumber, `nagad-${acc.id}`)}
                                  className="inline-flex items-center gap-1 text-[11px] text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded border border-orange-200 transition-colors"
                                >
                                  {copiedKey === `nagad-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedKey === `nagad-${acc.id}` ? 'কপি হয়েছে' : 'কপি'}</span>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>অ্যাকাউন্টের ধরন:</span>
                              <span className="font-bold text-slate-800">{acc.accountType}</span>
                            </div>
                            {acc.instructions && (
                              <p className="text-[11px] text-slate-600 bg-orange-50/50 p-2 rounded border border-orange-100">
                                <strong>নির্দেশনা:</strong> {acc.instructions}
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <Input
                          label="যে নগদ নম্বর থেকে পাঠিয়েছেন*"
                          placeholder="01XXXXXXXXX"
                          value={senderNumber}
                          onChange={e => setSenderNumber(e.target.value)}
                          required
                        />
                        <Input
                          label="নগদ Transaction ID (TrxID)*"
                          placeholder="যেমন: NG7812903"
                          value={trxId}
                          onChange={e => setTrxId(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Rocket (Only if active accounts exist) */}
              {activeRocket.length > 0 && (
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    paymentMethod === 'Rocket'
                      ? 'border-purple-500 bg-purple-50/30 ring-1 ring-purple-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('Rocket')}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Rocket'}
                      onChange={() => setPaymentMethod('Rocket')}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold font-mono">
                          RK
                        </span>
                        <span>রকেট পেমেন্ট (Rocket)</span>
                      </span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                        {activeRocket.length} টি অ্যাকাউন্ট
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'Rocket' && (
                    <div className="mt-3.5 pt-3 border-t border-purple-200 space-y-3 pl-7 text-xs">
                      {(() => {
                        const acc = activeRocket.find(a => a.id === selectedRocketId) || activeRocket[0];
                        if (!acc) return null;
                        return (
                          <div className="p-3 bg-white border border-purple-200 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">রকেট নম্বর:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-base text-purple-700">{acc.accountNumber}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(acc.accountNumber, `rocket-${acc.id}`)}
                                  className="inline-flex items-center gap-1 text-[11px] text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200"
                                >
                                  {copiedKey === `rocket-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedKey === `rocket-${acc.id}` ? 'কপি হয়েছে' : 'কপি'}</span>
                                </button>
                              </div>
                            </div>
                            {acc.instructions && (
                              <p className="text-[11px] text-slate-600 bg-purple-50/50 p-2 rounded">
                                {acc.instructions}
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <Input
                          label="যে রকেট নম্বর থেকে পাঠিয়েছেন*"
                          placeholder="01XXXXXXXXX-X"
                          value={senderNumber}
                          onChange={e => setSenderNumber(e.target.value)}
                          required
                        />
                        <Input
                          label="Transaction ID (TrxID)*"
                          placeholder="যেমন: RK102948"
                          value={trxId}
                          onChange={e => setTrxId(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. Upay (Only if active accounts exist) */}
              {activeUpay.length > 0 && (
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    paymentMethod === 'Upay'
                      ? 'border-teal-500 bg-teal-50/30 ring-1 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('Upay')}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Upay'}
                      onChange={() => setPaymentMethod('Upay')}
                      className="mt-0.5 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold font-mono">
                          UP
                        </span>
                        <span>উপায় পেমেন্ট (Upay)</span>
                      </span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                        {activeUpay.length} টি অ্যাকাউন্ট
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'Upay' && (
                    <div className="mt-3.5 pt-3 border-t border-teal-200 space-y-3 pl-7 text-xs">
                      {(() => {
                        const acc = activeUpay.find(a => a.id === selectedUpayId) || activeUpay[0];
                        if (!acc) return null;
                        return (
                          <div className="p-3 bg-white border border-teal-200 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">উপায় নম্বর:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-base text-teal-700">{acc.accountNumber}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(acc.accountNumber, `upay-${acc.id}`)}
                                  className="inline-flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200"
                                >
                                  {copiedKey === `upay-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedKey === `upay-${acc.id}` ? 'কপি হয়েছে' : 'কপি'}</span>
                                </button>
                              </div>
                            </div>
                            {acc.instructions && (
                              <p className="text-[11px] text-slate-600 bg-teal-50/50 p-2 rounded">
                                {acc.instructions}
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <Input
                          label="যে উপায় নম্বর থেকে পাঠিয়েছেন*"
                          placeholder="01XXXXXXXXX"
                          value={senderNumber}
                          onChange={e => setSenderNumber(e.target.value)}
                          required
                        />
                        <Input
                          label="Transaction ID (TrxID)*"
                          placeholder="যেমন: UP81923"
                          value={trxId}
                          onChange={e => setTrxId(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 7. Bank Transfer (Only if active bank accounts exist) */}
              {activeBanks.length > 0 && (
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    paymentMethod === 'Bank Transfer'
                      ? 'border-blue-900 bg-blue-50/30 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={() => setPaymentMethod('Bank Transfer')}
                      className="mt-0.5 text-blue-900 focus:ring-blue-800"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-900" />
                        <span>সরাসরি ব্যাংক ট্রান্সফার (Bank Transfer)</span>
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                        {activeBanks.length} টি ব্যাংক অ্যাকাউন্ট
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'Bank Transfer' && (
                    <div className="mt-3.5 pt-3 border-t border-blue-200 space-y-3 pl-7 text-xs">
                      {activeBanks.length > 1 && (
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">ব্যাংক অ্যাকাউন্ট নির্বাচন করুন:</label>
                          <select
                            value={selectedBankId}
                            onChange={e => setSelectedBankId(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                          >
                            {activeBanks.map(acc => (
                              <option key={acc.id} value={acc.id}>
                                {acc.bankName} - {acc.accountNumber} ({acc.branch})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {(() => {
                        const acc = activeBanks.find(a => a.id === selectedBankId) || activeBanks[0];
                        if (!acc) return null;
                        return (
                          <div className="p-3.5 bg-white border border-blue-200 rounded-xl space-y-2">
                            <h4 className="font-bold text-sm text-blue-950">{acc.bankName}</h4>
                            <div className="space-y-1 text-slate-600">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Account Name:</span>
                                <span className="font-bold text-slate-900">{acc.accountName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Account No:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-blue-950">{acc.accountNumber}</span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(acc.accountNumber, `bank-${acc.id}`)}
                                    className="inline-flex items-center gap-1 text-[11px] text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                                  >
                                    {copiedKey === `bank-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    <span>কপি</span>
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Branch Name:</span>
                                <span className="text-slate-800">{acc.branch}</span>
                              </div>
                              {acc.routingNumber && (
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Routing Number:</span>
                                  <span className="font-mono text-slate-800">{acc.routingNumber}</span>
                                </div>
                              )}
                            </div>
                            {acc.instructions && (
                              <p className="text-[11px] text-slate-600 bg-blue-50/50 p-2 rounded border border-blue-100 mt-1">
                                {acc.instructions}
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      <Input
                        label="ডিপোজিট স্লিপ নম্বর / ফান্ড ট্রান্সফার রেফারেন্স*"
                        placeholder="যেমন: অনলাইন ট্রান্সফার রেফারেন্স বা স্লিপ নম্বর"
                        value={depositSlipInfo}
                        onChange={e => setDepositSlipInfo(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary & Confirmation - 5 cols */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            আপনার অর্ডার ({cart.length} টি আইটেম)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <span className="font-bold text-slate-900 truncate block">
                      {item.product.banglaName || item.product.name}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {item.quantity} x ৳{item.unitPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 shrink-0">
                  ৳{(item.unitPrice * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>সাবটোটাল</span>
              <span className="font-mono font-bold text-slate-900">৳{cartSubtotal.toLocaleString()}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>কুপন ডিসকাউন্ট</span>
                <span className="font-mono font-bold">-৳{cartDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-600">
              <div>
                <span>ডেলিভারি চার্জ</span>
                <span className="text-[10px] text-slate-400 block">
                  {selectedDistrict}{selectedArea ? ' · ' + selectedArea : ''}
                </span>
              </div>
              <div className="text-right">
                {deliveryCalc.isFree ? (
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ফ্রি (৳০)
                  </span>
                ) : (
                  <span className="font-mono font-bold text-slate-900">৳{deliveryCharge}</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-base font-extrabold text-blue-950 pt-2 border-t border-slate-200">
              <span>সর্বমোট প্রদেয়</span>
              <span className="font-mono text-xl text-blue-900">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              className="gap-2 font-bold shadow-md cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>নিরাপদ ও নির্ভরযোগ্য শপিং</span>
            </div>
            <p>
              অর্ডার সাবমিট করার পর আমাদের সাপোর্ট টিম থেকে কল দিয়ে অর্ডারটি কনফার্ম করা হবে।
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
