import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, StatusIndicator } from '../../components/common/UI';
import { OrderStatus } from '../../types';
import { ShoppingBag, ChevronRight, Package, Calendar } from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const {
    orders,
    currentUser,
    setSelectedOrderId,
    setCurrentRoute
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Customer only accesses their own orders
  const myOrders = orders.filter(
    o => o.customerId === currentUser?.id || o.customerEmail === currentUser?.email
  );

  const filteredOrders = myOrders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentRoute('order-detail');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            আমার অর্ডারসমূহ (My Orders)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            আপনার সকল পূর্ববর্তী ও বর্তমান অর্ডারের হালনাগাদ তথ্য
          </p>
        </div>

        {/* Status Filter Tabs (Interactive Filter Controls) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {['all', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'সব অর্ডার' : st}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">কোনো অর্ডার পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনি এখনও কোনো অর্ডার প্রদান করেননি অথবা নির্বাচিত ফিল্টারে কোনো অর্ডার নেই।
          </p>
          <Button
            variant="gold"
            size="sm"
            onClick={() => setCurrentRoute('products')}
            className="mt-2"
          >
            পণ্য দেখতে যান
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              onClick={() => handleViewOrder(order.id)}
              className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-900 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-extrabold text-blue-950">
                    {order.orderNumber}
                  </span>
                  <StatusIndicator status={order.status} />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(order.createdAt).toLocaleDateString('bn-BD')}</span>
                  <span>·</span>
                  <span className="text-slate-700 font-semibold">{order.paymentMethod}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      +{order.items.length - 3}
                    </span>
                  )}
                  <span className="text-xs text-slate-600 pl-2">
                    {order.items.length} টি পণ্য
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="text-xs text-slate-500">সর্বমোট মূল্য</span>
                <span className="font-mono text-lg font-black text-blue-950">
                  ৳{order.grandTotal.toLocaleString()}
                </span>
                <div className="hidden sm:flex items-center gap-1 text-xs text-blue-900 font-semibold mt-2 group-hover:underline">
                  <span>বিস্তারিত দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
