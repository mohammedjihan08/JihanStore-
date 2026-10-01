import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerWallet } from '../../types';
import { Button, Input, Modal } from '../../components/common/UI';
import { Wallet, Search, PlusCircle, MinusCircle, ShieldCheck } from 'lucide-react';

export const AdminWalletsPage: React.FC = () => {
  const { allCustomerWallets, adjustCustomerWalletBalance } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<CustomerWallet | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [isCredit, setIsCredit] = useState(true);
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredWallets = allCustomerWallets.filter(w => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      w.customerName.toLowerCase().includes(term) ||
      w.customerEmail.toLowerCase().includes(term) ||
      w.customerPhone.toLowerCase().includes(term)
    );
  });

  const handleOpenAdjust = (w: CustomerWallet, credit: boolean) => {
    setSelectedWallet(w);
    setIsCredit(credit);
    setAdjustAmount('');
    setReason('');
    setIsModalOpen(true);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    const amt = parseFloat(adjustAmount);
    if (isNaN(amt) || amt <= 0) return;

    adjustCustomerWalletBalance(
      selectedWallet.customerId,
      amt,
      isCredit,
      reason || (isCredit ? 'Admin authorized credit' : 'Admin authorized debit')
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            কাস্টমার ওয়ালেট প্রশাসন (Customer Wallets)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            সকল গ্রাহকের ওয়ালেট ব্যালেন্স পর্যবেক্ষণ ও অনুমোদিত সমন্বয়
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="গ্রাহকের নাম বা ফোন দিয়ে খুঁজুন..."
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
              <th className="py-3 px-4">গ্রাহক</th>
              <th className="py-3 px-3 font-mono">বর্তমান ব্যালেন্স</th>
              <th className="py-3 px-3 font-mono">পেন্ডিং ডিপোজিট</th>
              <th className="py-3 px-3 font-mono">পেন্ডিং উইথড্র</th>
              <th className="py-3 px-4 text-right">ব্যালেন্স এডজাস্টমেন্ট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredWallets.map(wallet => (
              <tr key={wallet.customerId} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{wallet.customerName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{wallet.customerPhone}</span>
                  </div>
                </td>
                <td className="py-3.5 px-3 font-mono text-base font-extrabold text-blue-950">
                  ৳{wallet.currentBalance.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 font-mono text-amber-700 font-medium">
                  {wallet.pendingDeposit > 0 ? `৳${wallet.pendingDeposit.toLocaleString()}` : '—'}
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-500">
                  {wallet.pendingWithdrawal > 0 ? `৳${wallet.pendingWithdrawal.toLocaleString()}` : '—'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenAdjust(wallet, true)}
                      className="text-xs py-1 text-emerald-700 hover:bg-emerald-50 border-emerald-300 gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>ক্রেডিট</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenAdjust(wallet, false)}
                      className="text-xs py-1 text-rose-700 hover:bg-rose-50 border-rose-300 gap-1"
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                      <span>ডেবিট</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Modal */}
      {selectedWallet && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`ওয়ালেট ব্যালেন্স সমন্বয়: ${selectedWallet.customerName}`}
        >
          <form onSubmit={handleAdjustSubmit} className="space-y-4 text-left text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-500">বর্তমান ব্যালেন্স:</span>
              <p className="font-mono text-lg font-black text-blue-950">
                ৳{selectedWallet.currentBalance.toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">অ্যাকশন টাইপ</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsCredit(true)}
                  className={`p-2 rounded-lg border text-center font-bold ${
                    isCredit
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                      : 'border-slate-300 text-slate-600'
                  }`}
                >
                  + ক্রেডিট (Credit Balance)
                </button>
                <button
                  type="button"
                  onClick={() => setIsCredit(false)}
                  className={`p-2 rounded-lg border text-center font-bold ${
                    !isCredit
                      ? 'bg-rose-50 text-rose-800 border-rose-500'
                      : 'border-slate-300 text-slate-600'
                  }`}
                >
                  - ডেবিট (Debit Balance)
                </button>
              </div>
            </div>

            <Input
              label="পরিমাণ (Amount in BDT ৳)*"
              type="number"
              value={adjustAmount}
              onChange={e => setAdjustAmount(e.target.value)}
              required
            />

            <Input
              label="অনুমোদন ও অডিটের কারণ (Reason / Audit Note)*"
              placeholder="যেমন: ঈদ বোনাস ক্রেডিট অথবা রিফান্ড সমন্বয়"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
            />

            <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-800 shrink-0" />
              <span>এই ব্যালেন্স পরিবর্তনের সাথে সাথে অডিট লগে এন্ট্রি সংরক্ষিত হবে।</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" variant="primary" size="sm">
                নিশ্চিত করুন
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
