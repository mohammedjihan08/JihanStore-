import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/common/UI';
import {
  User,
  ShoppingBag,
  Wallet,
  Bell,
  Settings,
  Edit3,
  MapPin,
  Phone,
  Mail,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const MyAccountPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    setCurrentRoute,
    customerWallet,
    orders,
    notifications,
    showToast,
    handleLogout
  } = useStore();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">একাউন্টে লগইন নেই</h2>
        <p className="text-xs text-slate-500">আপনার একাউন্ট তথ্য ও অর্ডার দেখতে লগইন করুন।</p>
        <Button variant="gold" onClick={() => setCurrentRoute('login')}>
          লগইন করুন
        </Button>
      </div>
    );
  }

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-900 text-amber-300 font-extrabold text-2xl flex items-center justify-center border-2 border-amber-400 shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.email}</span>
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{currentUser.phone}</span>
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentRoute('edit-profile')}
          className="gap-1.5 self-end sm:self-center"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>প্রোফাইল এডিট</span>
        </Button>
      </div>

      {/* Quick Metrics Bar (Wallet & Orders) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Wallet Balance Card */}
        <div
          onClick={() => setCurrentRoute('wallet')}
          className="bg-linear-to-br from-blue-900 to-blue-950 text-white p-5 rounded-2xl shadow-sm border border-blue-800 cursor-pointer hover:shadow-md transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span className="flex items-center gap-1">
              <Wallet className="w-4 h-4" /> ওয়ালেট ব্যালেন্স
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-white">
            ৳{customerWallet.currentBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-300">
            {customerWallet.pendingDeposit > 0
              ? `৳${customerWallet.pendingDeposit} জমা প্রক্রিয়াধীন`
              : 'ক্লিক করে টাকা জমা বা উত্তোলন করুন'}
          </p>
        </div>

        {/* Total Orders Card */}
        <div
          onClick={() => setCurrentRoute('orders')}
          className="bg-white p-5 rounded-2xl border border-slate-200 cursor-pointer hover:border-blue-900 transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1 text-slate-700">
              <ShoppingBag className="w-4 h-4 text-blue-900" /> মোট অর্ডারসমূহ
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {orders.length} <span className="text-xs font-normal text-slate-500">টি সম্পন্ন</span>
          </div>
          <p className="text-[11px] text-slate-500">পূর্বের সমস্ত অর্ডারের স্ট্যাটাস ট্র্যাক করুন</p>
        </div>

        {/* Notifications Card */}
        <div
          onClick={() => setCurrentRoute('notifications')}
          className="bg-white p-5 rounded-2xl border border-slate-200 cursor-pointer hover:border-blue-900 transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1 text-slate-700">
              <Bell className="w-4 h-4 text-amber-600" /> নোটিফিকেশন
            </span>
            {unreadNotifs > 0 && (
              <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadNotifs} নতুন
              </span>
            )}
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {notifications.length} <span className="text-xs font-normal text-slate-500">টি বার্তা</span>
          </div>
          <p className="text-[11px] text-slate-500">অর্ডার আপডেট ও ওয়ালেট এলার্ট</p>
        </div>
      </div>

      {/* Account Navigation Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        <button
          onClick={() => setCurrentRoute('orders')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span>আমার অর্ডারসমূহ (My Orders)</span>
              <p className="text-xs font-normal text-slate-500">ডেলিভারি ট্র্যাক ও পূর্বের রশিদ দেখুন</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setCurrentRoute('wallet')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span>কাস্টমার ওয়ালেট (Wallet Management)</span>
              <p className="text-xs font-normal text-slate-500">ব্যালেন্স, ডিপোজিট, উইথড্র ও লেনদেন হিস্টরি</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setCurrentRoute('edit-profile')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span>ডেলিভারি ঠিকানা ও প্রোফাইল</span>
              <p className="text-xs font-normal text-slate-500">{currentUser.address}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setCurrentRoute('settings')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left text-sm font-semibold text-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <span>একাউন্ট সেটিংস (Account Settings)</span>
              <p className="text-xs font-normal text-slate-500">পাসওয়ার্ড পরিবর্তন ও নোটিফিকেশন অগ্রাধিকার</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Logout Action */}
      <div className="pt-2 text-center sm:text-right">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>একাউন্ট থেকে লগআউট করুন</span>
        </button>
      </div>
    </div>
  );
};
