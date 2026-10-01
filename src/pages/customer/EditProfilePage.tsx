import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Textarea } from '../../components/common/UI';
import { ArrowLeft, Save } from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, setCurrentRoute, showToast } = useStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || 'Dhaka');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      name,
      phone,
      address,
      city,
      postalCode
    });

    showToast('প্রোফাইল আপডেট সফল হয়েছে');
    setCurrentRoute('account');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            প্রোফাইল সম্পাদন (Edit Profile)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">আপনার নাম ও ডেলিভারি ঠিকানা হালনাগাদ রাখুন</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentRoute('account')}
          className="gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ফিরে যান</span>
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="আপনার পূর্ণ নাম (Full Name)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <Input
            label="ইমেইল এড্রেস (Email - অপরিবর্তনযোগ্য)"
            value={currentUser?.email || ''}
            disabled
            className="bg-slate-50 text-slate-500 cursor-not-allowed"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="মোবাইল নম্বর (Phone)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <Input
              label="শহর / জেলা (City / District)"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </div>

          <Input
            label="পোস্টাল কোড (Postal Code)"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
          />

          <Textarea
            label="বিস্তারিত ডেলিভারি ঠিকানা (Detailed Address)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            rows={3}
            required
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentRoute('account')}
            >
              বাতিল
            </Button>
            <Button type="submit" variant="primary" className="gap-2">
              <Save className="w-4 h-4" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
