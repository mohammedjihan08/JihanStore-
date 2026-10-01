import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminSection } from '../../types';
import { Logo } from '../../components/brand/Logo';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Image as ImageIcon,
  Megaphone,
  Tag,
  Bell,
  Settings,
  ShieldAlert,
  UserCheck,
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Send
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    adminSection,
    setAdminSection,
    setIsAdminMode,
    settings,
    orders,
    allWalletTransactions
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const pendingDepositsCount = allWalletTransactions.filter(
    t => t.type === 'Deposit' && t.status === 'Pending'
  ).length;
  const pendingWithdrawalsCount = allWalletTransactions.filter(
    t => t.type === 'Withdrawal' && t.status === 'Pending'
  ).length;

  const navItems: { section: AdminSection; label: string; icon: any; badge?: number }[] = [
    { section: 'dashboard', label: 'ড্যাশবোর্ড (Dashboard)', icon: LayoutDashboard },
    { section: 'products', label: 'পণ্যসমূহ (Products)', icon: Package },
    { section: 'categories', label: 'ক্যাটাগরি (Categories)', icon: Layers },
    {
      section: 'orders',
      label: 'অর্ডারসমূহ (Orders)',
      icon: ShoppingBag,
      badge: pendingOrdersCount
    },
    { section: 'customers', label: 'গ্রাহক তালিকা (Customers)', icon: Users },
    { section: 'wallets', label: 'কাস্টমার ওয়ালেট (Wallets)', icon: Wallet },
    {
      section: 'deposits',
      label: 'ডিপোজিট রিকোয়েস্ট',
      icon: ArrowDownLeft,
      badge: pendingDepositsCount
    },
    {
      section: 'withdrawals',
      label: 'উইথড্র রিকোয়েস্ট',
      icon: ArrowUpRight,
      badge: pendingWithdrawalsCount
    },
    { section: 'transactions', label: 'লেনদেন হিস্টরি (Audit)', icon: History },
    { section: 'banners', label: 'ব্যানার (Banners)', icon: ImageIcon },
    { section: 'ads', label: 'বিজ্ঞাপন (Ad Management)', icon: Megaphone },
    { section: 'coupons', label: 'কুপন (Coupons)', icon: Tag },
    { section: 'notifications', label: 'নোটিফিকেশন (Alerts)', icon: Bell },
    { section: 'telegram', label: 'টেলিগ্রাম নোটিফিকেশন', icon: Send },
    { section: 'settings', label: 'ওয়েবসাইট সেটিংস', icon: Settings },
    { section: 'logo', label: 'লোগো ম্যানেজমেন্ট', icon: Sparkles },
    { section: 'export', label: 'ডাটা এক্সপোর্ট (Export)', icon: FileSpreadsheet },
    { section: 'security', label: 'সিকিউরিটি ও রুলস', icon: ShieldAlert },
    { section: 'admin-account', label: 'এডমিন একাউন্ট', icon: UserCheck }
  ];

  const handleSelectSection = (s: AdminSection) => {
    setAdminSection(s);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900 font-sans w-full max-w-full overflow-x-hidden">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center font-bold text-amber-400 font-mono text-sm border border-amber-500/30">
              JS
            </div>
            <div>
              <span className="font-extrabold text-white text-sm block">JIHAN STORE</span>
              <span className="text-[10px] text-amber-400 font-mono">ADMIN CONTROL PANEL</span>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => {
            const isActive = adminSection === item.section;
            const Icon = item.icon;

            return (
              <button
                key={item.section}
                onClick={() => handleSelectSection(item.section)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-mono font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Store Switcher */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <button
            onClick={() => setIsAdminMode(false)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>গ্রাহক সাইট দেখুন (Back to Shop)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">এডমিন প্যানেল</span>
              <span>/</span>
              <span className="font-bold text-blue-900 capitalize">
                {navItems.find(i => i.section === adminSection)?.label.split(' ')[0]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Role: Super Admin</span>
            </div>

            <button
              onClick={() => setIsAdminMode(false)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-blue-900 font-semibold hover:underline"
            >
              <span>ওয়েবসাইটে ফিরুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsAdminMode(false)}
              className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
              title="Exit Admin Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-white text-sm">JIHAN STORE ADMIN</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {navItems.map(item => {
                const isActive = adminSection === item.section;
                const Icon = item.icon;

                return (
                  <button
                    key={item.section}
                    onClick={() => handleSelectSection(item.section)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                      isActive
                        ? 'bg-blue-900 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminMode(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>গ্রাহক সাইটে ফিরে যান</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
