import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input } from '../../components/common/UI';
import { Settings, Bell, Lock, Globe, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orderEmailAlerts, setOrderEmailAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      showToast('নতুন পাসওয়ার্ড মিলছে না');
      return;
    }
    showToast('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-900" />
          <span>একাউন্ট সেটিংস (Account Settings)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">নিরাপত্তা ও নোটিফিকেশন অগ্রাধিকার নির্ধারণ করুন</p>
      </div>

      {/* Password Change */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-900" />
          <span>পাসওয়ার্ড পরিবর্তন করুন</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
          <Input
            label="বর্তমান পাসওয়ার্ড (Current Password)"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="নতুন পাসওয়ার্ড (New Password)"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm New Password)"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="sm" className="mt-2">
            পাসওয়ার্ড আপডেট করুন
          </Button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-900" />
          <span>নোটিফিকেশন পছন্দসমূহ</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">অর্ডার সংক্রান্ত এসএমএস / ইমেইল</span>
              <span className="text-slate-500 text-[11px]">ডেলিভারি আপডেট ও স্ট্যাটাস পরিবর্তন নোটিফিকেশন</span>
            </div>
            <input
              type="checkbox"
              checked={orderEmailAlerts}
              onChange={e => setOrderEmailAlerts(e.target.checked)}
              className="rounded text-blue-900 focus:ring-blue-800"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">ডিসকাউন্ট ও প্রমোশন নোটিফিকেশন</span>
              <span className="text-slate-500 text-[11px]">ঈদ ও বিশেষ ক্যাম্পেইনের অফার এলার্ট</span>
            </div>
            <input
              type="checkbox"
              checked={promoAlerts}
              onChange={e => setPromoAlerts(e.target.checked)}
              className="rounded text-blue-900 focus:ring-blue-800"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
