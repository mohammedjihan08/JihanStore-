import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, StatusIndicator, Modal, Input } from '../../components/common/UI';
import { ArrowDownLeft, CheckCircle2, XCircle, Search } from 'lucide-react';

export const AdminDepositsPage: React.FC = () => {
  const { allWalletTransactions, approveDeposit, rejectDeposit } = useStore();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const depositTransactions = allWalletTransactions.filter(t => t.type === 'Deposit');

  const handleConfirmReject = () => {
    if (!rejectId) return;
    rejectDeposit(rejectId, rejectNote);
    setRejectId(null);
    setRejectNote('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            ডিপোজিট রিকোয়েস্ট যাচাই (Deposits)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            গ্রাহকদের bKash, Nagad বা ব্যাংক জমার TrxID যাচাই ও অনুমোদন করুন
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">গ্রাহক</th>
              <th className="py-3 px-3 font-mono">পরিমাণ</th>
              <th className="py-3 px-3">মেথড</th>
              <th className="py-3 px-3 font-mono">TrxID / অ্যাকাউন্ট</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-3 font-mono">অনুরোধ সময়</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {depositTransactions.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-900 block">{tx.customerName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {tx.customerId}</span>
                </td>
                <td className="py-3.5 px-3 font-mono text-base font-extrabold text-blue-950">
                  ৳{tx.amount.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 font-medium text-slate-700">{tx.paymentMethod}</td>
                <td className="py-3.5 px-3">
                  <span className="font-mono font-bold text-amber-700 block">{tx.trxId || 'N/A'}</span>
                  <span className="font-mono text-[11px] text-slate-500">{tx.accountNumber}</span>
                </td>
                <td className="py-3.5 px-3">
                  <StatusIndicator status={tx.status} type="transaction" />
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                  {new Date(tx.createdAt).toLocaleString('bn-BD')}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {tx.status === 'Pending' ? (
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={() => approveDeposit(tx.id)}
                        className="py-1 text-xs gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>অনুমোদন</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRejectId(tx.id)}
                        className="py-1 text-xs text-rose-700 border-rose-300 hover:bg-rose-50 gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>প্রত্যাখ্যান</span>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs italic">প্রক্রিয়াজাত</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectId && (
        <Modal
          isOpen={!!rejectId}
          onClose={() => setRejectId(null)}
          title="ডিপোজিট রিকোয়েস্ট প্রত্যাখ্যানের কারণ"
        >
          <div className="space-y-4 text-left text-xs">
            <p className="text-slate-600">
              ভুল ট্রানজেকশন আইডি বা টাকা জমা না হওয়ার কারণ উল্লেখ করুন:
            </p>
            <Input
              label="প্রত্যাখ্যানের কারণ (Rejection Note)*"
              placeholder="যেমন: TrxID পাওয়া যায়নি বা ভুল প্রেরক নম্বর"
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setRejectId(null)}>
                বাতিল
              </Button>
              <Button size="sm" variant="danger" onClick={handleConfirmReject}>
                প্রত্যাখ্যান নিশ্চিত করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
