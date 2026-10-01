import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { WebsiteSettings } from '../../types';
import { Button, Input, Textarea } from '../../components/common/UI';
import { Settings, Save, Store, Phone, Globe, Shield, FileText } from 'lucide-react';

export const AdminWebsiteSettingsPage: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();
  const [form, setForm] = useState<WebsiteSettings>({ ...settings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    showToast('ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            ওয়েবসাইট সেটিংস (Website Settings)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            স্টোরের নাম, যোগাযোগের তথ্য, সোশ্যাল লিঙ্ক ও পলিসি টেক্সট সম্পাদন করুন
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-blue-900" />
            <span>ব্যবসার পরিচিতি ও স্লোগান</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="স্টোরের নাম (Store Name)*"
              value={form.storeName}
              onChange={e => setForm({ ...form, storeName: e.target.value })}
              required
            />
            <Input
              label="বাংলা নাম (Bangla Store Name)*"
              value={form.banglaStoreName}
              onChange={e => setForm({ ...form, banglaStoreName: e.target.value })}
              required
            />
          </div>

          <Input
            label="ট্যাগলাইন (Tagline)*"
            value={form.tagline}
            onChange={e => setForm({ ...form, tagline: e.target.value })}
            required
          />
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-blue-900" />
            <span>যোগাযোগের তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="ফোন নম্বর (Phone)*"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
            <Input
              label="ইমেইল (Email)*"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="WhatsApp নম্বর*"
              value={form.whatsapp}
              onChange={e => setForm({ ...form, whatsapp: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="স্টোরের পূর্ণ ঠিকানা (Address)*"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            rows={2}
            required
          />
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-blue-900" />
            <span>সোশ্যাল মিডিয়া পেজ লিঙ্কস</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Facebook Page URL"
              value={form.facebook}
              onChange={e => setForm({ ...form, facebook: e.target.value })}
            />
            <Input
              label="Instagram URL"
              value={form.instagram}
              onChange={e => setForm({ ...form, instagram: e.target.value })}
            />
            <Input
              label="TikTok Profile URL"
              value={form.tiktok}
              onChange={e => setForm({ ...form, tiktok: e.target.value })}
            />
            <Input
              label="YouTube Channel URL"
              value={form.youtube}
              onChange={e => setForm({ ...form, youtube: e.target.value })}
            />
          </div>
        </div>

        {/* Content & Policy Texts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-blue-900" />
            <span>পেজ কনটেন্ট ও পলিসি</span>
          </h3>

          <Textarea
            label="আমাদের সম্পর্কে (About Us Text)*"
            value={form.aboutUsText}
            onChange={e => setForm({ ...form, aboutUsText: e.target.value })}
            rows={3}
            required
          />

          <Textarea
            label="প্রাইভেসি পলিসি (Privacy Policy Text)*"
            value={form.privacyPolicyText}
            onChange={e => setForm({ ...form, privacyPolicyText: e.target.value })}
            rows={3}
            required
          />

          <Textarea
            label="শর্তাবলী (Terms & Conditions Text)*"
            value={form.termsConditionsText}
            onChange={e => setForm({ ...form, termsConditionsText: e.target.value })}
            rows={3}
            required
          />
        </div>

        {/* Delivery Charges */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>ডেলিভারি চার্জ কনফিগারেশন</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="ঢাকার ভিতরে চার্জ (BDT ৳)"
              type="number"
              value={form.deliveryChargeInsideCity}
              onChange={e => setForm({ ...form, deliveryChargeInsideCity: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="ঢাকার বাইরে চার্জ (BDT ৳)"
              type="number"
              value={form.deliveryChargeOutsideCity}
              onChange={e => setForm({ ...form, deliveryChargeOutsideCity: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="ফ্রি ডেলিভারি থ্রেশহোল্ড (BDT ৳)"
              type="number"
              value={form.freeDeliveryThreshold}
              onChange={e => setForm({ ...form, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" className="gap-2">
            <Save className="w-4 h-4" />
            <span>সেটিংস সংরক্ষণ করুন</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
