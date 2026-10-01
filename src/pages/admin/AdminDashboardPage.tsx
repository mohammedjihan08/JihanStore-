import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, StatusIndicator } from '../../components/common/UI';
import {
  Package,
  ShoppingBag,
  Users,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    orders,
    allCustomerWallets,
    allWalletTransactions,
    setAdminSection
  } = useStore();

  // 11 Explicit Metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = allCustomerWallets.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);
  const totalWalletBalance = allCustomerWallets.reduce((sum, w) => sum + w.currentBalance, 0);
  const pendingDeposits = allWalletTransactions
    .filter(t => t.type === 'Deposit' && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingWithdrawals = allWalletTransactions
    .filter(t => t.type === 'Withdrawal' && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const kpis = [
    {
      label: 'মোট পণ্য (Total Products)',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      section: 'products' as const
    },
    {
      label: 'মোট অর্ডার (Total Orders)',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      section: 'orders' as const
    },
    {
      label: 'মোট গ্রাহক (Total Customers)',
      value: totalCustomers,
      icon: Users,
      color: 'text-slate-700',
      bg: 'bg-slate-100',
      section: 'customers' as const
    },
    {
      label: 'মোট বিক্রয় (Total Sales)',
      value: `৳${totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      section: 'orders' as const
    },
    {
      label: 'পেন্ডিং অর্ডার (Pending Orders)',
      value: pendingOrders,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      section: 'orders' as const
    },
    {
      label: 'প্রসেসিং অর্ডার (Processing)',
      value: processingOrders,
      icon: RefreshCw,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      section: 'orders' as const
    },
    {
      label: 'ডেলিভার্ড অর্ডার (Delivered)',
      value: deliveredOrders,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      section: 'orders' as const
    },
    {
      label: 'বাতিল অর্ডার (Cancelled)',
      value: cancelledOrders,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      section: 'orders' as const
    },
    {
      label: 'মোট ওয়ালেট ব্যালেন্স (Total Wallet)',
      value: `৳${totalWalletBalance.toLocaleString()}`,
      icon: Wallet,
      color: 'text-blue-900',
      bg: 'bg-blue-100',
      section: 'wallets' as const
    },
    {
      label: 'পেন্ডিং ডিপোজিট (Pending Deposits)',
      value: `৳${pendingDeposits.toLocaleString()}`,
      icon: ArrowDownLeft,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      section: 'deposits' as const
    },
    {
      label: 'পেন্ডিং উইথড্র (Pending Withdrawals)',
      value: `৳${pendingWithdrawals.toLocaleString()}`,
      icon: ArrowUpRight,
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      section: 'withdrawals' as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            স্টোর ড্যাশবোর্ড ও ওভারভিউ (Dashboard)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            জিহান স্টোরের মূল পারফরম্যান্স সূচক ও অর্ডার পর্যবেক্ষণ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="gold"
            onClick={() => setAdminSection('products')}
          >
            নতুন পণ্য যোগ করুন
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAdminSection('deposits')}
          >
            ডিপোজিট যাচাই
          </Button>
        </div>
      </div>

      {/* 11 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => setAdminSection(kpi.section)}
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-900 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                  {kpi.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                  {kpi.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Wallet Action Quick Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders - 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-900" />
              <span>সাম্প্রতিক অর্ডারসমূহ (Recent Orders)</span>
            </h3>
            <button
              onClick={() => setAdminSection('orders')}
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>সকল দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                    <StatusIndicator status={o.status} />
                  </div>
                  <p className="text-slate-500 mt-0.5">{o.customerName} ({o.customerPhone})</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-950 block">
                    ৳{o.grandTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(o.createdAt).toLocaleDateString('bn-BD')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Deposit Approvals - 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-amber-600" />
              <span>অপেক্ষমান ডিপোজিট রিকোয়েস্ট</span>
            </h3>
            <button
              onClick={() => setAdminSection('deposits')}
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>যাচাই করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {allWalletTransactions
              .filter(t => t.type === 'Deposit' && t.status === 'Pending')
              .slice(0, 3)
              .map(tx => (
                <div
                  key={tx.id}
                  className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tx.customerName}</span>
                    <span className="font-mono font-extrabold text-amber-800">
                      +৳{tx.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono flex items-center justify-between">
                    <span>{tx.paymentMethod}</span>
                    <span>TrxID: {tx.trxId}</span>
                  </div>
                </div>
              ))}

            {allWalletTransactions.filter(t => t.type === 'Deposit' && t.status === 'Pending')
              .length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                বর্তমানে কোনো অপেক্ষমান ডিপোজিট রিকোয়েস্ট নেই।
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
