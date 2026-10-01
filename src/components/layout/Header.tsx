import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../brand/Logo';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Phone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    cartItemCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    settings,
    currentUser,
    isLoggedIn
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentRoute('search');
      setShowSearchModal(false);
    }
  };

  const navLinks = [
    { label: 'হোম (Home)', route: 'home' as const },
    { label: 'ক্যাটাগরি (Categories)', route: 'categories' as const },
    { label: 'সকল পণ্য (All Products)', route: 'products' as const },
    { label: 'আমাদের সম্পর্কে (About)', route: 'about' as const },
    { label: 'যোগাযোগ (Contact)', route: 'contact' as const }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Trust Ribbon - Slim & Discrete */}
      <div className="bg-blue-950 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold">★ জিহান স্টোর</span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-slate-200 hidden sm:inline">বিশ্বাসের সাথে অনলাইন শপিং</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> ক্যাশ অন ডেলিভারি
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            {(() => {
              const activePhones = (settings.phoneNumbers || []).filter(p => p.isActive);
              const defPhone = activePhones.find(p => p.isDefault) || activePhones[0];
              const phoneToShow = defPhone ? defPhone.number : settings.phone;
              return (
                <a
                  href={`tel:${phoneToShow}`}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span className="font-mono">{phoneToShow}</span>
                </a>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Main Top Bar - Strict 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-slate-700 hover:text-blue-900 rounded-lg focus-visible:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setCurrentRoute('home')}
            className="text-left focus-visible:outline-none group cursor-pointer"
          >
            <Logo
              customLogoUrl={settings.logoUrl}
              variant="horizontal"
              showTagline={false}
            />
          </button>
        </div>

        {/* Zone 2: 4-5 Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(link => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => setCurrentRoute(link.route)}
                className={`text-xs lg:text-sm font-semibold whitespace-nowrap transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-blue-900 border-b-2 border-amber-500 font-bold'
                    : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action Cluster */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Integrated Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center relative w-56 xl:w-64"
          >
            <input
              type="text"
              placeholder="পণ্য বা কোড খুঁজুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-100/80 border border-slate-200 rounded-full pl-8 pr-3 py-1.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-800 focus:bg-white transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Mobile Search trigger */}
          <button
            onClick={() => setCurrentRoute('search')}
            className="lg:hidden p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-full transition-colors"
            title="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setCurrentRoute('wishlist')}
            className="relative p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center font-mono shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button
            onClick={() => setCurrentRoute('cart')}
            className="relative p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-900 text-white font-bold text-[10px] rounded-full flex items-center justify-center font-mono shadow-xs">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Account Profile / Login */}
          <div className="ml-1 pl-1 border-l border-slate-200">
            {isLoggedIn ? (
              <button
                onClick={() => setCurrentRoute('account')}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-950 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
                  {currentUser?.name.charAt(0) || 'J'}
                </div>
                <span className="hidden sm:inline text-xs font-semibold max-w-[90px] truncate">
                  {currentUser?.name}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentRoute('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="পণ্য বা কোড খুঁজুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          {navLinks.map(link => (
            <button
              key={link.route}
              onClick={() => {
                setCurrentRoute(link.route);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-blue-900 hover:bg-blue-50/60 rounded-lg transition-colors text-left"
            >
              <span>{link.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentRoute('wallet');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span>কাস্টমার ওয়ালেট (Wallet)</span>
              <span className="font-mono font-bold">ব্যালেন্স</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
