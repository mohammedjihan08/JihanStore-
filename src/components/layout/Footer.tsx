import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../brand/Logo';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  MessageSquare
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentRoute, setIsAdminMode, settings } = useStore();

  const activePhones = (settings.phoneNumbers || []).filter(p => p.isActive);
  const activeEmails = (settings.emailAddresses || []).filter(e => e.isActive);
  const activeAddresses = (settings.businessAddresses || []).filter(a => a.isActive);

  const defaultPhone = activePhones.find(p => p.isDefault) || activePhones[0];
  const defaultEmail = activeEmails.find(e => e.isDefault) || activeEmails[0];
  const defaultAddress = activeAddresses.find(a => a.isDefault) || activeAddresses[0];

  const hasBkash = (settings.bkashAccounts || []).some(a => a.isActive);
  const hasNagad = (settings.nagadAccounts || []).some(a => a.isActive);
  const hasRocket = (settings.rocketAccounts || []).some(a => a.isActive);
  const hasUpay = (settings.upayAccounts || []).some(a => a.isActive);
  const hasBank = (settings.bankAccounts || []).some(a => a.isActive);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 sm:pt-12 pb-24 md:pb-12 border-t border-slate-800 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
        {/* Trust Value Props Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-700/50 flex items-center justify-center shrink-0 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">১০০% আসল পণ্য</h4>
              <p className="text-xs text-slate-400 mt-0.5">সব পণ্যে আসল গুণমানের নিশ্চয়তা</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-700/50 flex items-center justify-center shrink-0 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">দ্রুততম হোম ডেলিভারি</h4>
              <p className="text-xs text-slate-400 mt-0.5">সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-700/50 flex items-center justify-center shrink-0 text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">সহজ রিটার্ন পলিসি</h4>
              <p className="text-xs text-slate-400 mt-0.5">কোনো সমস্যা হলে দ্রুত সমাধান</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-700/50 flex items-center justify-center shrink-0 text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">২৪/৭ কাস্টমার সাপোর্ট</h4>
              <p className="text-xs text-slate-400 mt-0.5">যেকোনো তথ্যে আমাদের কল বা মেসেজ দিন</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" customLogoUrl={settings.logoUrl} showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.aboutUsText.substring(0, 160)}...
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {defaultAddress
                    ? `${defaultAddress.title ? defaultAddress.title + ': ' : ''}${defaultAddress.address}${defaultAddress.city ? ', ' + defaultAddress.city : ''}`
                    : settings.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-white font-bold">
                    {defaultPhone ? defaultPhone.number : settings.phone}
                  </span>
                  {activePhones.length > 1 && (
                    <button
                      onClick={() => setCurrentRoute('contact')}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      (+{activePhones.length - 1} আরও নম্বর)
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">
                  {defaultEmail ? defaultEmail.email : settings.email}
                </span>
              </div>
            </div>

            {/* Accepted Active Payment Badges */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-2">
                নিরাপদ পেমেন্ট পদ্ধতিসমূহ (Accepted Payment Methods)
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-bold">
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">
                  COD (ক্যাশ অন ডেলিভারি)
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-amber-400">
                  Wallet
                </span>
                {hasBkash && (
                  <span className="px-2 py-1 rounded bg-pink-950/70 border border-pink-700/60 text-pink-300">
                    bKash
                  </span>
                )}
                {hasNagad && (
                  <span className="px-2 py-1 rounded bg-orange-950/70 border border-orange-700/60 text-orange-300">
                    Nagad
                  </span>
                )}
                {hasRocket && (
                  <span className="px-2 py-1 rounded bg-purple-950/70 border border-purple-700/60 text-purple-300">
                    Rocket
                  </span>
                )}
                {hasUpay && (
                  <span className="px-2 py-1 rounded bg-teal-950/70 border border-teal-700/60 text-teal-300">
                    Upay
                  </span>
                )}
                {hasBank && (
                  <span className="px-2 py-1 rounded bg-blue-950/70 border border-blue-700/60 text-blue-300">
                    Bank Transfer
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">শপ ও কালেকশন</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentRoute('home')}
                  className="hover:text-amber-300 transition-colors"
                >
                  হোম পেজ (Home)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('categories')}
                  className="hover:text-amber-300 transition-colors"
                >
                  সব ক্যাটাগরি (Categories)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('products')}
                  className="hover:text-amber-300 transition-colors"
                >
                  সকল প্রোডাক্টস (All Products)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('cart')}
                  className="hover:text-amber-300 transition-colors"
                >
                  শপিং কার্ট (My Cart)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('wishlist')}
                  className="hover:text-amber-300 transition-colors"
                >
                  পছন্দের তালিকা (Wishlist)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support & Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">কাস্টমার এরিয়া</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentRoute('account')}
                  className="hover:text-amber-300 transition-colors"
                >
                  আমার একাউন্ট (My Account)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('orders')}
                  className="hover:text-amber-300 transition-colors"
                >
                  আমার অর্ডারসমূহ (My Orders)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('wallet')}
                  className="hover:text-amber-300 transition-colors"
                >
                  কাস্টমার ওয়ালেট (Wallet)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('notifications')}
                  className="hover:text-amber-300 transition-colors"
                >
                  নোটিফিকেশন (Notifications)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('settings')}
                  className="hover:text-amber-300 transition-colors"
                >
                  সেটিংস (Account Settings)
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">তথ্য ও নিয়মাবলী</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentRoute('about')}
                  className="hover:text-amber-300 transition-colors"
                >
                  আমাদের সম্পর্কে (About Us)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('contact')}
                  className="hover:text-amber-300 transition-colors"
                >
                  যোগাযোগ (Contact Us)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('privacy')}
                  className="hover:text-amber-300 transition-colors"
                >
                  প্রাইভেসি পলিসি (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRoute('terms')}
                  className="hover:text-amber-300 transition-colors"
                >
                  শর্তাবলী (Terms & Conditions)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Discreet Admin Access */}
        <div className="pt-8 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Jihan Store (জিহান স্টোর). সর্বস্বত্ব সংরক্ষিত।</p>
          
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">Cash on Delivery Supported</span>
            <span className="text-slate-700">·</span>
            {/* Separate Secure Admin Panel Link */}
            <button
              onClick={() => setIsAdminMode(true)}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-amber-400 transition-colors text-[11px] cursor-pointer"
              title="Secure Store Management"
            >
              <Lock className="w-3 h-3 text-amber-500/70" />
              <span>এডমিন প্যানেল (Admin Portal)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
