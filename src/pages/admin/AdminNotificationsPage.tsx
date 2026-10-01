import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Textarea } from '../../components/common/UI';
import { Bell, Send, CheckCircle2 } from 'lucide-react';

export const AdminNotificationsPage: React.FC = () => {
  const { notifications, showToast } = useStore();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'promo' | 'system'>('promo');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    showToast('নোটিফিকেশন সফলভাবে সকল গ্রাহকদের কাছে ব্রডকাস্ট করা হয়েছে');
    setTitle('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          নোটিফিকেশন ব্রডকাস্ট (Alerts & Push)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          গ্রাহকদের উদ্দেশ্যে বিশেষ ক্যাম্পেইন, ঈদ অফার বা সিস্টেম নোটিশ পাঠান
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Broadcast Form - 7 cols */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            নতুন ব্রডকাস্ট বার্তা পাঠান
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">বার্তার ক্যাটাগরি</label>
              <select
                value={targetType}
                onChange={e => setTargetType(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                <option value="promo">প্রমোশনাল অফার (Promotional Alert)</option>
                <option value="system">সিস্টেম নোটিশ (System Update)</option>
              </select>
            </div>

            <Input
              label="নোটিফিকেশন শিরোনাম (Title)*"
              placeholder="যেমন: ঈদ স্পেশাল ১৫% ক্যাশব্যাক!"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <Textarea
              label="বিস্তারিত বার্তা (Message Body)*"
              placeholder="গ্রাহকের নোটিফিকেশন স্ক্রিনে যা প্রদর্শিত হবে..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              required
            />

            <Button type="submit" variant="primary" size="md" className="gap-2">
              <Send className="w-4 h-4" />
              <span>ব্রডকাস্ট পাঠান</span>
            </Button>
          </form>
        </div>

        {/* History List - 5 cols */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            পূর্ববর্তী পাঠানো বার্তা
          </h3>

          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">{n.title}</span>
                <p className="text-slate-600 line-clamp-2">{n.message}</p>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {new Date(n.timestamp).toLocaleDateString('bn-BD')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
