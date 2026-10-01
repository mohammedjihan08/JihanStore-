import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StatusIndicator } from '../../components/common/UI';
import { History, Search, Filter } from 'lucide-react';

export const AdminWalletTransactionsPage: React.FC = () => {
  const { allWalletTransactions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = allWalletTransactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.customerName.toLowerCase().includes(term) ||
      (t.trxId && t.trxId.toLowerCase().includes(term)) ||
      t.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            ওয়ালেট অডিট ও লেনদেন হিস্টরি (Audit Log)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রতিটি ওয়ালেট লেনদেন, ডিপোজিট, উইথড্র ও অ্যাডমিন এডজাস্টমেন্টের অপরিবর্তনযোগ্য রেকর্ড
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="গ্রাহক, TrxID বা বিবরণ দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white w-full sm:w-auto"
        >
          <option value="all">সকল লেনদেন টাইপ (All Types)</option>
          <option value="Deposit">Deposit (ডিপোজিট)</option>
          <option value="Withdrawal">Withdrawal (উইথড্রয়াল)</option>
          <option value="Refund">Refund (রিফান্ড)</option>
          <option value="Order Payment">Order Payment (অর্ডার পেমেন্ট)</option>
          <option value="Wallet Credit">Wallet Credit (এডমিন ক্রেডিট)</option>
          <option value="Wallet Debit">Wallet Debit (এডমিন ডেবিট)</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4 font-mono">লগ ID</th>
              <th className="py-3 px-3">গ্রাহক</th>
              <th className="py-3 px-3">লেনদেন প্রকার</th>
              <th className="py-3 px-3 font-mono">পরিমাণ</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-3">বিবরণ ও অডিট নোট</th>
              <th className="py-3 px-4 font-mono text-right">টাইমস্ট্যাম্প</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{tx.id}</td>
                <td className="py-3 px-3 font-semibold text-slate-900">{tx.customerName}</td>
                <td className="py-3 px-3">
                  <span className="font-bold text-slate-800">{tx.type}</span>
                  {tx.paymentMethod && (
                    <span className="block text-[10px] text-slate-400 font-mono">{tx.paymentMethod}</span>
                  )}
                </td>
                <td className="py-3 px-3 font-mono font-bold text-sm text-blue-950">
                  ৳{tx.amount.toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  <StatusIndicator status={tx.status} type="transaction" />
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <p>{tx.description}</p>
                  {tx.adminNote && (
                    <p className="text-[10px] text-amber-800 font-medium mt-0.5">Note: {tx.adminNote}</p>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400 text-right text-[11px]">
                  {new Date(tx.createdAt).toLocaleString('bn-BD')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
