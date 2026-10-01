import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    cartItemCount,
    wishlist,
    isLoggedIn
  } = useStore();

  const items = [
    {
      label: 'Home',
      bangla: 'হোম',
      route: 'home' as const,
      icon: Home
    },
    {
      label: 'Categories',
      bangla: 'ক্যাটাগরি',
      route: 'categories' as const,
      icon: Grid
    },
    {
      label: 'Cart',
      bangla: 'কার্ট',
      route: 'cart' as const,
      icon: ShoppingBag,
      badge: cartItemCount
    },
    {
      label: 'Wishlist',
      bangla: 'পছন্দ',
      route: 'wishlist' as const,
      icon: Heart,
      badge: wishlist.length
    },
    {
      label: 'Account',
      bangla: 'একাউন্ট',
      route: (isLoggedIn ? 'account' : 'login') as any,
      icon: User
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5"
      style={{ maxHeight: '64px' }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 items-center justify-around h-full">
        {items.map(item => {
          const isActive =
            currentRoute === item.route ||
            (item.route === 'account' &&
              ['account', 'orders', 'wallet', 'edit-profile', 'notifications', 'settings'].includes(
                currentRoute
              ));
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => setCurrentRoute(item.route)}
              className={`flex flex-col items-center justify-center py-1 relative min-h-[44px] transition-colors ${
                isActive ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px] text-blue-900' : 'stroke-[1.8px]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-amber-500 text-slate-950 font-extrabold text-[9px] rounded-full flex items-center justify-center font-mono leading-none shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.bangla}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-amber-500 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
