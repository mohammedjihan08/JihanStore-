import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, StatusIndicator } from '../../components/common/UI';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Truck,
  CheckCircle,
  Package,
  Receipt
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { orders, selectedOrderId, setCurrentRoute } = useStore();

  const order = orders.find(o => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">অর্ডারটি খুঁজে পাওয়া যায়নি।</p>
        <Button onClick={() => setCurrentRoute('orders')} className="mt-4">
          অর্ডার তালিকায় ফিরে যান
        </Button>
      </div>
    );
  }

  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => setCurrentRoute('orders')}
          className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল অর্ডারে ফিরে যান</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          অর্ডার তারিখ: {new Date(order.createdAt).toLocaleString('bn-BD')}
        </span>
      </div>

      {/* Order Status Timeline Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs text-slate-400 font-mono">অর্ডার নম্বর</span>
            <h1 className="text-2xl font-black text-blue-950 font-mono">{order.orderNumber}</h1>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-slate-400 block mb-1">বর্তমান স্ট্যাটাস</span>
            <StatusIndicator status={order.status} />
          </div>
        </div>

        {/* Timeline (if not cancelled) */}
        {order.status !== 'Cancelled' ? (
          <div className="py-2">
            <div className="grid grid-cols-5 gap-2 relative">
              {steps.map((st, idx) => {
                const isPassed = idx <= (currentStepIndex === -1 ? 0 : currentStepIndex);
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={st} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                        isPassed
                          ? 'bg-blue-900 text-amber-300 ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-2 font-medium ${
                        isCurrent
                          ? 'font-bold text-blue-950'
                          : isPassed
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-center">
            এই অর্ডারটি বাতিল করা হয়েছে (Order Cancelled)
          </div>
        )}
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Items List - 7 cols */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package className="w-4 h-4 text-blue-900" />
            <span>অর্ডারের পণ্যসমূহ ({order.items.length})</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">
                      {item.banglaName || item.productName}
                    </h4>
                    <p className="text-slate-500 truncate max-w-xs">{item.productName}</p>
                    {item.color && (
                      <span className="text-[11px] text-slate-500 font-mono">রং: {item.color}</span>
                    )}
                    <div className="font-mono text-slate-700 font-semibold mt-0.5">
                      {item.quantity} × ৳{item.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="font-mono font-bold text-sm text-blue-950">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Bill Summary - 5 cols */}
        <div className="md:col-span-5 space-y-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-900" />
              <span>ডেলিভারি ঠিকানা</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">{order.customerName}</p>
              <p className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span className="font-mono">{order.customerPhone}</span>
              </p>
              <p className="flex items-start gap-1">
                <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                <span>{order.deliveryAddress} ({order.city})</span>
              </p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-blue-900" />
              <span>মূল্য বিবরণ</span>
            </h4>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>পণ্যের মূল্য (Subtotal):</span>
                <span className="font-mono font-semibold">৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>ডিসকাউন্ট:</span>
                  <span className="font-mono font-bold">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-mono font-semibold">
                  {order.deliveryCharge === 0 ? 'ফ্রি' : `৳${order.deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm text-slate-900">
                <span>সর্বমোট:</span>
                <span className="font-mono text-xl font-extrabold text-blue-950">
                  ৳{order.grandTotal.toLocaleString()}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                পেমেন্ট মেথড: <strong className="text-slate-800">{order.paymentMethod}</strong>
              </div>
              {order.paymentDetails && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  {order.paymentDetails.accountNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">গৃহীতার অ্যাকাউন্ট:</span>
                      <span className="font-mono font-bold">{order.paymentDetails.accountNumber} ({order.paymentDetails.accountType || order.paymentDetails.provider})</span>
                    </div>
                  )}
                  {order.paymentDetails.senderNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">প্রেরকের নম্বর:</span>
                      <span className="font-mono font-semibold">{order.paymentDetails.senderNumber}</span>
                    </div>
                  )}
                  {order.paymentDetails.trxId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transaction ID (TrxID):</span>
                      <span className="font-mono font-bold text-blue-900">{order.paymentDetails.trxId}</span>
                    </div>
                  )}
                  {order.paymentDetails.bankName && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">ব্যাংক ও শাখা:</span>
                      <span className="font-semibold">{order.paymentDetails.bankName} ({order.paymentDetails.branch})</span>
                    </div>
                  )}
                  {order.paymentDetails.depositSlipInfo && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">রেফারেন্স / স্লিপ:</span>
                      <span className="font-mono font-semibold">{order.paymentDetails.depositSlipInfo}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
