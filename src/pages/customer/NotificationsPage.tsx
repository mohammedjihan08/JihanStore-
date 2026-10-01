import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Bell, Check, ShoppingBag, Wallet, Info } from 'lucide-react';
import { Button } from '../../components/common/UI';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, setCurrentRoute } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-blue-900" />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          নোটিফিকেশন (Store Notifications)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনার অর্ডার এবং ওয়ালেট সংক্রান্ত সকল গুরুত্বপূর্ণ আপডেট
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold">কোনো নোটিফিকেশন নেই</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4.5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                n.isRead ? 'bg-white' : 'bg-blue-50/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {new Date(n.timestamp).toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    markNotificationAsRead(n.id);
                  }}
                  className="text-slate-400 hover:text-blue-900 p-1"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
