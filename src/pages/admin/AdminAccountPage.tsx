import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input } from '../../components/common/UI';
import { UserCheck, Shield, KeyRound, Save } from 'lucide-react';

export const AdminAccountPage: React.FC = () => {
  const { showToast } = useStore();
  const [adminName, setAdminName] = useState('Mohammed Jihan');
  const [adminEmail, setAdminEmail] = useState('mohammedjihan08@gmail.com');
  const [adminPhone, setAdminPhone] = useState('+880 1812-345678');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('এডমিন প্রোফাইল আপডেট সফল হয়েছে');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    showToast('এডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-900" />
          <span>এডমিন একাউন্ট (Super Admin Account)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          সুপার এডমিন প্রোফাইল তথ্য ও সিকিউরিটি ক্রেডেনশিয়াল ব্যবস্থাপনা
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>সুপার এডমিন পরিচিতি</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <Input
              label="এডমিনের পূর্ণ নাম*"
              value={adminName}
              onChange={e => setAdminName(e.target.value)}
              required
            />
            <Input
              label="এডমিন ইমেইল*"
              type="email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              required
            />
            <Input
              label="এডমিন মোবাইল নম্বর*"
              value={adminPhone}
              onChange={e => setAdminPhone(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="sm" className="gap-2">
              <Save className="w-3.5 h-3.5" />
              <span>প্রোফাইল আপডেট</span>
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>পাসওয়ার্ড পরিবর্তন</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <Input
              label="বর্তমান পাসওয়ার্ড*"
              type="password"
              placeholder="••••••••"
              value={currentPass}
              onChange={e => setCurrentPass(e.target.value)}
              required
            />
            <Input
              label="নতুন পাসওয়ার্ড*"
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর বিশিষ্ট"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              required
            />

            <Button type="submit" variant="gold" size="sm">
              পাসওয়ার্ড আপডেট করুন
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
