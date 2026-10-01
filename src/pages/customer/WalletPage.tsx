import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Modal, StatusIndicator } from '../../components/common/UI';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  History,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const {
    customerWallet,
    walletTransactions,
    requestDeposit,
    requestWithdrawal,
    showToast,
    settings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Completed' | 'Rejected'>('All');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('bKash Personal');
  const [depositAccount, setDepositAccount] = useState('');
  const [depositTrxId, setDepositTrxId] = useState('');
  const [depositError, setDepositError] = useState('');

  // Withdraw Form
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bKash Personal');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  const filteredTransactions = walletTransactions.filter(tx => {
    if (activeTab === 'All') return true;
    return tx.status === activeTab;
  });

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt < 100) {
      setDepositError('সর্বনিম্ন জমার পরিমাণ ১০০ টাকা');
      return;
    }
    if (!depositAccount.trim() || !depositTrxId.trim()) {
      setDepositError('মোবাইল নম্বর এবং Transaction ID (TrxID) বাধ্যতামূলক');
      return;
    }

    requestDeposit(amt, depositMethod, depositAccount, depositTrxId.trim());
    setShowDepositModal(false);
    setDepositAmount('');
    setDepositAccount('');
    setDepositTrxId('');
    setDepositError('');
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 100) {
      setWithdrawError('সর্বনিম্ন উত্তোলনের পরিমাণ ১০০ টাকা');
      return;
    }
    if (amt > customerWallet.currentBalance) {
      setWithdrawError(`পর্যাপ্ত ব্যালেন্স নেই। আপনার বর্তমান ব্যালেন্স: ৳${customerWallet.currentBalance}`);
      return;
    }
    if (!withdrawAccount.trim()) {
      setWithdrawError('উত্তোলন গ্রহণের একাউন্ট নম্বর লিখুন');
      return;
    }

    const success = requestWithdrawal(amt, withdrawMethod, withdrawAccount);
    if (success) {
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawAccount('');
      setWithdrawError('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wallet Balance Hero Card */}
      <div className="bg-linear-to-r from-blue-950 via-blue-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-amber-500/30 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Wallet className="w-4 h-4" />
              <span>জিহান স্টোর কাস্টমার ওয়ালেট (Secure Customer Wallet)</span>
            </div>
            <span className="text-xs text-slate-300 block">বর্তমান মূল ব্যালেন্স</span>
            <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
              <span>৳</span>
              <span>{customerWallet.currentBalance.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-4 text-xs pt-1 text-slate-300">
              {customerWallet.pendingDeposit > 0 && (
                <span className="flex items-center gap-1 text-amber-300 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  ডিপোজিট প্রসেসিং: ৳{customerWallet.pendingDeposit.toLocaleString()}
                </span>
              )}
              {customerWallet.pendingWithdrawal > 0 && (
                <span className="flex items-center gap-1 text-slate-300 font-mono">
                  উইথড্র প্রসেসিং: ৳{customerWallet.pendingWithdrawal.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Button
              variant="gold"
              size="md"
              onClick={() => {
                setDepositError('');
                setShowDepositModal(true);
              }}
              className="gap-2 shadow-sm font-bold"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>টাকা জমা দিন (Deposit)</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setWithdrawError('');
                setShowWithdrawModal(true);
              }}
              className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>উত্তোলন (Withdraw)</span>
            </Button>
          </div>
        </div>

        {/* Security Assurance Footer */}
        <div className="mt-6 pt-4 border-t border-blue-800/80 flex items-center gap-2 text-[11px] text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            নিরাপত্তা নিশ্চয়তা: ওয়ালেট ব্যালেন্স সম্পূর্ণ সুরক্ষিত ও অডিট রেকর্ডভুক্ত। গ্রাহক সরাসরি ব্যালেন্স পরিবর্তন করতে পারে না।
          </span>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">
              লেনদেন হিস্টরি (Transaction History)
            </h2>
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            {(['All', 'Pending', 'Completed', 'Rejected'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'All' ? 'সব লেনদেন' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="p-10 text-center space-y-2 text-slate-500">
            <p className="text-sm">এই ক্যাটাগরিতে কোনো লেনদেন পাওয়া যায়নি।</p>
            <span className="text-xs text-slate-400">টাকা জমা বা উত্তোলনের পর তা এখানে প্রদর্শিত হবে।</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map(tx => {
              const isPositive =
                tx.type === 'Deposit' || tx.type === 'Refund' || tx.type === 'Wallet Credit';

              return (
                <div key={tx.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{tx.type}</span>
                        <StatusIndicator status={tx.status} type="transaction" />
                      </div>
                      <p className="text-slate-500">{tx.description}</p>
                      {tx.trxId && (
                        <p className="font-mono text-[11px] text-amber-700">TrxID: {tx.trxId}</p>
                      )}
                      <p className="text-slate-400 text-[10px] font-mono">
                        {new Date(tx.createdAt).toLocaleString('bn-BD')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono text-base font-extrabold block ${
                        isPositive ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isPositive ? '+' : '-'}৳{tx.amount.toLocaleString()}
                    </span>
                    {tx.adminNote && (
                      <span className="text-[10px] text-slate-400 block mt-0.5 max-w-[140px] truncate">
                        {tx.adminNote}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="ওয়ালেটে টাকা জমা দিন (Deposit Request)"
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4 text-left">
          {/* Dynamic Active Accounts Notice */}
          {(() => {
            const allActiveMethods: { key: string; name: string; number: string; type: string; instructions?: string }[] = [];
            (settings.bkashAccounts || []).filter(a => a.isActive).forEach(a => {
              allActiveMethods.push({ key: `bKash-${a.id}`, name: `bKash (${a.accountType})`, number: a.accountNumber, type: a.accountType, instructions: a.instructions });
            });
            (settings.nagadAccounts || []).filter(a => a.isActive).forEach(a => {
              allActiveMethods.push({ key: `Nagad-${a.id}`, name: `Nagad (${a.accountType})`, number: a.accountNumber, type: a.accountType, instructions: a.instructions });
            });
            (settings.rocketAccounts || []).filter(a => a.isActive).forEach(a => {
              allActiveMethods.push({ key: `Rocket-${a.id}`, name: `Rocket (${a.accountType})`, number: a.accountNumber, type: a.accountType, instructions: a.instructions });
            });
            (settings.upayAccounts || []).filter(a => a.isActive).forEach(a => {
              allActiveMethods.push({ key: `Upay-${a.id}`, name: `Upay (${a.accountType})`, number: a.accountNumber, type: a.accountType, instructions: a.instructions });
            });
            (settings.bankAccounts || []).filter(a => a.isActive).forEach(a => {
              allActiveMethods.push({ key: `Bank-${a.id}`, name: `${a.bankName} (${a.branch})`, number: a.accountNumber, type: 'Bank', instructions: a.instructions });
            });

            const current = allActiveMethods.find(m => m.key === depositMethod) || allActiveMethods[0];

            return (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">ডিপোজিট মেথড ও অ্যাকাউন্ট নির্বাচন করুন</label>
                  <select
                    value={depositMethod}
                    onChange={e => setDepositMethod(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white font-medium"
                  >
                    {allActiveMethods.length > 0 ? (
                      allActiveMethods.map(m => (
                        <option key={m.key} value={m.key}>
                          {m.name} - {m.number}
                        </option>
                      ))
                    ) : (
                      <option value="Manual Contact">কাস্টমার সার্ভিসে যোগাযোগ করুন</option>
                    )}
                  </select>
                </div>

                {current && (
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">টাকা পাঠানোর নম্বর/অ্যাকাউন্ট:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-blue-950">{current.number}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(current.number);
                            showToast('অ্যাকাউন্ট নম্বর কপি করা হয়েছে!');
                          }}
                          className="px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-900 font-bold hover:bg-blue-100 flex items-center gap-1 text-[11px]"
                        >
                          <Copy className="w-3 h-3" />
                          <span>কপি</span>
                        </button>
                      </div>
                    </div>
                    {current.instructions && (
                      <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded border border-blue-100">
                        {current.instructions}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          <Input
            label="জমার পরিমাণ (Amount in BDT ৳)*"
            type="number"
            placeholder="সর্বনিম্ন ১০০"
            value={depositAmount}
            onChange={e => setDepositAmount(e.target.value)}
            required
          />

          <Input
            label="যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Account Number)*"
            placeholder="01XXXXXXXXX"
            value={depositAccount}
            onChange={e => setDepositAccount(e.target.value)}
            required
          />

          <Input
            label="Transaction ID (TrxID)*"
            placeholder="যেমন: BKP9081237A"
            value={depositTrxId}
            onChange={e => setDepositTrxId(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDepositModal(false)}
            >
              বাতিল
            </Button>
            <Button type="submit" variant="gold" size="sm">
              ডিপোজিট রিকোয়েস্ট পাঠান
            </Button>
          </div>
        </form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="ওয়ালেট থেকে টাকা উত্তোলন (Withdraw Request)"
      >
        <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-left">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex justify-between items-center">
            <span>বর্তমান ওয়ালেট ব্যালেন্স:</span>
            <span className="font-mono font-bold text-base text-blue-950">
              ৳{customerWallet.currentBalance.toLocaleString()}
            </span>
          </div>

          {withdrawError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {withdrawError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">উত্তোলনের মেথড</label>
            <select
              value={withdrawMethod}
              onChange={e => setWithdrawMethod(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
            >
              <option value="bKash Personal">bKash (বিকাশ)</option>
              <option value="Nagad Personal">Nagad (নগদ)</option>
              <option value="Bank Account">Bank Account (ব্যাংক একাউন্ট)</option>
            </select>
          </div>

          <Input
            label="উত্তোলনের পরিমাণ (Amount in BDT ৳)*"
            type="number"
            placeholder="সর্বনিম্ন ১০০"
            value={withdrawAmount}
            onChange={e => setWithdrawAmount(e.target.value)}
            required
          />

          <Input
            label="টাকা গ্রহণের একাউন্ট / মোবাইল নম্বর*"
            placeholder="01XXXXXXXXX বা ব্যাংক একাউন্ট নম্বর"
            value={withdrawAccount}
            onChange={e => setWithdrawAccount(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowWithdrawModal(false)}
            >
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm">
              উইথড্র রিকোয়েস্ট সাবমিট করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
