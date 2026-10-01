import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { Button, StatusIndicator, Modal } from '../../components/common/UI';
import { ShoppingBag, Search, Eye, Filter, Calendar, MapPin, Phone } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerPhone.toLowerCase().includes(term)
    );
  });

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    selectedOrder.status = newStatus;
    showToast(`Order status updated to ${newStatus}`);
    setSelectedOrder({ ...selectedOrder });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            অর্ডার ব্যবস্থাপনা (Order Management)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            সকল কাস্টমার অর্ডার প্রসেসিং ও ডেলিভারি স্ট্যাটাস নিয়ন্ত্রণ করুন
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="অর্ডার নম্বর বা গ্রাহকের নাম দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          {['all', ...statuses].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'সব অর্ডার' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4 font-mono">অর্ডার নম্বর</th>
              <th className="py-3 px-3">গ্রাহক</th>
              <th className="py-3 px-3 font-mono">আইটেম সংখ্যা</th>
              <th className="py-3 px-3 font-mono">সর্বমোট</th>
              <th className="py-3 px-3">পেমেন্ট মেথড</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-950">
                  {order.orderNumber}
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-bold text-slate-900 block">{order.customerName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</span>
                </td>
                <td className="py-3.5 px-3 font-mono">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} টি
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                  ৳{order.grandTotal.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 text-slate-600">{order.paymentMethod}</td>
                <td className="py-3.5 px-3">
                  <StatusIndicator status={order.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                    className="gap-1 text-xs py-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ম্যানেজ</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Status & Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`অর্ডার বিস্তারিত: ${selectedOrder.orderNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-left text-xs">
            {/* Status Changer */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-600 block">বর্তমান স্ট্যাটাস পরিবর্তন করুন:</span>
                <span className="font-mono text-[11px] text-slate-400">
                  অর্ডারের সর্বশেষ অবস্থা নির্বাচন করলে গ্রাহক স্বয়ংক্রিয়ভাবে আপডেট পাবেন
                </span>
              </div>
              <select
                value={selectedOrder.status}
                onChange={e => handleUpdateStatus(e.target.value as OrderStatus)}
                className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-800"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 border rounded-xl border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block mb-1">গ্রাহকের তথ্য</span>
                <p className="font-medium text-slate-900">{selectedOrder.customerName}</p>
                <p className="text-slate-500 font-mono">{selectedOrder.customerPhone}</p>
                <p className="text-slate-500">{selectedOrder.customerEmail}</p>
              </div>
              <div>
                <span className="font-bold text-slate-800 block mb-1">ডেলিভারি ঠিকানা</span>
                <p className="text-slate-700">{selectedOrder.deliveryAddress}</p>
                <p className="font-semibold text-blue-900 mt-1">{selectedOrder.city}</p>
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <span className="font-bold text-slate-800 block">অর্ডারকৃত পণ্যসমূহ:</span>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-semibold text-slate-900">{it.banglaName || it.productName}</span>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {it.quantity} × ৳{it.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      ৳{(it.quantity * it.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price calculation */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-1 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-৳{selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>৳{selectedOrder.deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-sm text-blue-950">
                <span>Grand Total:</span>
                <span>৳{selectedOrder.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="primary" onClick={() => setSelectedOrder(null)}>
                সম্পন্ন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
