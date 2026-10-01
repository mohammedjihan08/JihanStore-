import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../../components/brand/Logo';
import { Button, Input } from '../../components/common/UI';
import { Sparkles, Upload, Trash2, RefreshCw, CheckCircle2, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export const AdminLogoManagementPage: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();
  const [logoInput, setLogoInput] = useState(settings.logoUrl || '');
  const [previewUrl, setPreviewUrl] = useState(settings.logoUrl || '');

  const handleApplyLogo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ logoUrl: logoInput.trim() });
    setPreviewUrl(logoInput.trim());
    showToast('লোগো সফলভাবে আপডেট হয়েছে');
  };

  const handleRemoveLogo = () => {
    updateSettings({ logoUrl: '' });
    setLogoInput('');
    setPreviewUrl('');
    showToast('কাস্টম লোগো মুছে ডিফল্ট জিহান স্টোর লোগো সচল করা হয়েছে');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoInput(result);
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span>লোগো ম্যানেজমেন্ট (Logo Management)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          জিহান স্টোরের অফিশিয়াল লোগো আপলোড, প্রিভিউ ও পরিচালনা করুন। লোগোর স্বাভাবিক অনুপাত বজায় রাখা হয়।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Logo Upload Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Upload className="w-4 h-4 text-blue-900" />
            <span>লোগো আপলোড বা URL প্রদান করুন</span>
          </h3>

          <form onSubmit={handleApplyLogo} className="space-y-4 text-xs">
            {/* Direct File Picker */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 block">
                কম্পিউটার/মোবাইল থেকে ইমেজ আপলোড করুন:
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block">
                ফরম্যাট: PNG, SVG, JPG, WebP (স্বচ্ছ ব্যাকগ্রাউন্ড বাঞ্ছনীয়)
              </span>
            </div>

            <div className="relative py-2 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-slate-400 text-[11px] uppercase font-mono absolute">
                অথবা URL
              </span>
            </div>

            <Input
              label="অনলাইন লোগো ইমেজ URL"
              placeholder="https://.../jihan-store-logo.png"
              value={logoInput}
              onChange={e => {
                setLogoInput(e.target.value);
                setPreviewUrl(e.target.value);
              }}
            />

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" variant="primary" size="md" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>লোগো সক্রিয় করুন</span>
              </Button>

              {settings.logoUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleRemoveLogo}
                  className="text-rose-700 border-rose-300 hover:bg-rose-50 gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>মুছে ফেলুন</span>
                </Button>
              )}
            </div>
          </form>

          <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
            <span>
              লোগো স্ট্রেচ, ডিসটর্ট বা রিসাইজ না করে এর সঠিক অরিজিনাল আসপেক্ট রেশিও এবং স্বচ্ছতা বজায় রাখা হয়।
            </span>
          </div>
        </div>

        {/* Live Logo Preview Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            লাইভ প্রিভিউ (Live Header & Dark Theme Preview)
          </h3>

          {/* Light Background Preview (as in Customer Topbar) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              লাইট হেডার ব্যাকগ্রাউন্ডে প্রিভিউ
            </span>
            <div className="p-6 bg-white border border-slate-200 rounded-xl flex items-center justify-center min-h-[90px]">
              <Logo
                customLogoUrl={previewUrl}
                variant="horizontal"
                showTagline={false}
              />
            </div>
          </div>

          {/* Dark Background Preview (as in Footer) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              ডার্ক ব্যাকগ্রাউন্ডে প্রিভিউ (Footer)
            </span>
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center min-h-[90px]">
              <Logo
                customLogoUrl={previewUrl}
                variant="light"
                showTagline={true}
              />
            </div>
          </div>

          {/* Compact / Favicon Preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              কমপ্যাক্ট মোবাইল আইকন প্রিভিউ
            </span>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
              <Logo
                customLogoUrl={previewUrl}
                variant="icon-only"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
