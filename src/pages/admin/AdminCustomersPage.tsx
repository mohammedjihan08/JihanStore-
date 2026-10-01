import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Search, Mail, Phone, MapPin, Wallet } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { allCustomerWallets, orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = allCustomerWallets.filter(c => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.customerName.toLowerCase().includes(term) ||
      c.customerEmail.toLowerCase().includes(term) ||
      c.customerPhone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            গ্রাহক তালিকা (Customer Directory)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            মোট <span className="font-mono font-bold text-blue-900">{allCustomerWallets.length}</span> জন নিবন্ধিত গ্রাহক
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="গ্রাহকের নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">গ্রাহক প্রোফাইল</th>
              <th className="py-3 px-3">যোগাযোগ</th>
              <th className="py-3 px-3 font-mono">ওয়ালেট ব্যালেন্স</th>
              <th className="py-3 px-3 font-mono">মোট কেনাকাটা</th>
              <th className="py-3 px-3 font-mono">মোট অর্ডার</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map(customer => {
              const custOrders = orders.filter(
                o => o.customerId === customer.customerId || o.customerEmail === customer.customerEmail
              );

              return (
                <tr key={customer.customerId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-900 text-amber-300 font-bold flex items-center justify-center font-mono">
                        {customer.customerName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{customer.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {customer.customerId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-mono text-slate-800 font-medium">{customer.customerPhone}</p>
                    <p className="text-slate-400 text-[11px]">{customer.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-950 text-sm">
                    ৳{customer.currentBalance.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">
                    ৳{customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-slate-900">
                    {custOrders.length} টি
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
