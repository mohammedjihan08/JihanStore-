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

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{settings.email}</span>
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
