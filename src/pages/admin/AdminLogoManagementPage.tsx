import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../../components/brand/Logo';
import { Button, Input } from '../../components/common/UI';
import {
  Sparkles,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  Eye,
  Check,
  FileCheck
} from 'lucide-react';
import { uploadAndPersistLogo, applyOnlineLogoUrl, deleteAndRemoveLogo } from '../../services/logoService';

export const AdminLogoManagementPage: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();
  const [onlineUrlInput, setOnlineUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeLogo = settings.logoUrl || '';

  // Process file upload
  const handleProcessFile = async (file: File) => {
    // Validation
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFeedback({
        type: 'error',
        message: 'অকার্যকর ইমেজ ফরম্যাট! অনুগ্রহ করে PNG, SVG, JPG বা WebP ফাইল নির্বাচন করুন।',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: 'ফাইলের আকার ১০ মেগাবাইটের বেশি হতে পারবে না।',
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      // Upload to Storage and Persist in Database
      const result = await uploadAndPersistLogo(file);

      // Immediately update StoreContext state so the website header updates in real-time
      updateSettings({ logoUrl: result.logoUrl });

      setFeedback({
        type: 'success',
        message: `লোগো সফলভাবে আপলোড হয়েছে এবং ডাটাবেজে স্থায়ীভাবে সেভ হয়েছে! (${result.source === 'firebase-storage' ? 'Firebase Storage' : 'Cloud Server Storage'})`,
      });
      showToast('নতুন লোগো সফলভাবে কার্যকর হয়েছে');
    } catch (err: any) {
      console.error('Logo upload error:', err);
      setFeedback({
        type: 'error',
        message: err?.message || 'লোগো আপলোড ও ডাটাবেজে সংরক্ষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Apply online URL
  const handleApplyOnlineUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onlineUrlInput.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      const result = await applyOnlineLogoUrl(onlineUrlInput.trim());
      updateSettings({ logoUrl: result.logoUrl });
      setOnlineUrlInput('');
      setFeedback({
        type: 'success',
        message: 'অনলাইন লোগো URL সফলভাবে সেভ হয়েছে এবং ওয়েবসাইটে সচল রয়েছে।',
      });
      showToast('লোগো URL আপডেট সম্পন্ন হয়েছে');
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'URL সেভ ব্যর্থ হয়েছে।',
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete & Remove logo completely
  const handleRemoveLogo = async () => {
    if (!window.confirm('আপনি কি নিশ্চিত যে কাস্টম লোগো মুছে ডিফল্ট জিহান স্টোর লোগো সচল করতে চান? এটি স্টোরেজ এবং ডাটাবেজ—উভয় জায়গা থেকেই মুছে যাবে।')) {
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      await deleteAndRemoveLogo(activeLogo);
      updateSettings({ logoUrl: '' });
      setFeedback({
        type: 'success',
        message: 'কাস্টম লোগো স্টোরেজ ও ডাটাবেজ থেকে সম্পূর্ণ মুছে ফেলা হয়েছে এবং ডিফল্ট লোগো সচল করা হয়েছে।',
      });
      showToast('কাস্টম লোগো মুছে ডিফল্ট লোগো সচল করা হয়েছে');
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'লোগো মুছতে সমস্যা হয়েছে।',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>লোগো ম্যানেজমেন্ট (Logo Management)</span>
              <span className="text-[10px] sm:text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200">
                Storage & Database Synced
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              জিহান স্টোরের অফিশিয়াল লোগো আপলোড, রিপ্লেস এবং পার্মানেন্টলি ডিলিট করুন।
            </p>
          </div>
        </div>
      </div>

      {/* Live Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{feedback.message}</div>
        </div>
      )}

      {/* Main Grid: Upload & Current Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Replace Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* File Upload Zone */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-900" />
                <span>{activeLogo ? 'লোগো প্রতিস্থাপন / নতুন আপলোড (Replace Logo)' : 'নতুন লোগো আপলোড করুন (Upload Logo)'}</span>
              </h3>
              <span className="text-[11px] text-slate-400">PNG, SVG, JPG, WebP</span>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={loading}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-100 shadow-xs">
                  {loading ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-900" />
                  ) : (
                    <Upload className="w-6 h-6 text-blue-900" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    {loading ? 'লোগো স্টোরেজে আপলোড ও ডাটাবেজে সেভ হচ্ছে...' : 'লোগো ফাইল টেনে আনুন অথবা ক্লিক করে নির্বাচন করুন'}
                  </p>
                  <p className="text-xs text-slate-500">
                    কম্পিউটার বা মোবাইল থেকে স্বচ্ছ ব্যাকগ্রাউন্ডের (Transparent PNG/SVG) লোগো সবচেয়ে সুন্দর দেখায়
                  </p>
                </div>

                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  disabled={loading}
                  className="gap-2 font-bold cursor-pointer shadow-xs pointer-events-none mt-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{activeLogo ? 'নতুন লোগো বেছে নিন (Replace)' : 'ফাইল ব্রাউজ করুন (Browse)'}</span>
                </Button>
              </div>
            </div>

            {/* Online URL Fallback */}
            <div className="pt-2">
              <div className="relative py-2 flex items-center justify-center mb-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-slate-400 text-[11px] uppercase font-mono absolute">
                  অথবা সরাসরি ইমেজ লিঙ্ক (Online Image URL)
                </span>
              </div>

              <form onSubmit={handleApplyOnlineUrl} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={onlineUrlInput}
                  onChange={e => setOnlineUrlInput(e.target.value)}
                  className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={loading || !onlineUrlInput.trim()}
                  className="gap-1.5 font-bold cursor-pointer shrink-0"
                >
                  <Check className="w-4 h-4" />
                  <span>সেভ করুন</span>
                </Button>
              </form>
            </div>
          </div>

          {/* Guidelines & Persistence Rules Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>লোগো ম্যানেজমেন্ট ও পার্সিস্টেন্স গ্যারান্টি:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-[11px] leading-relaxed text-slate-600">
              <li><strong>স্থায়ী সংরক্ষণ:</strong> আপলোডকৃত লোগো ক্লাউড স্টোরেজে সেভ হয়ে ডাটাবেজে সংরক্ষিত থাকে। পেজ রিফ্রেশ বা রিলোড করলেও আগের লোগো ফিরে আসবে না।</li>
              <li><strong>রিপ্লেস সুরক্ষা:</strong> নতুন লোগো দিয়ে রিপ্লেস করলে আগের ফাইল স্টোরেজ থেকে রিমুভ হয়ে নতুন ফাইল স্থায়ীভাবে প্রতিস্থাপিত হয়।</li>
              <li><strong>সম্পূর্ণ ডিলিট:</strong> "মুছে ফেলুন" প্রেস করলে স্টোরেজ ও ডাটাবেজ—উভয় জায়গা থেকেই লোগো মুছে যায় এবং ওয়েবসাইট সুন্দরভাবে ডিফল্ট ব্র্যান্ড লোগোতে ফিরে আসে।</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Live Status & Multi-Context Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Logo Status Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-900" />
                <h3 className="font-bold text-sm text-slate-900">বর্তমান সক্রিয় লোগো (Active Status)</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeLogo ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {activeLogo ? 'Custom Logo' : 'Default Official Logo'}
              </span>
            </div>

            {/* Current Active Preview Box */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px] text-center">
              {activeLogo ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200/80 max-w-[240px]">
                    <img
                      src={activeLogo}
                      alt="Active Jihan Store Logo"
                      className="max-h-16 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>কাস্টম লোগো সক্রিয় রয়েছে</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <Logo variant="horizontal" showTagline={true} />
                  <p className="text-[11px] text-slate-400 mt-2">
                    কোনো কাস্টম লোগো আপলোড করা নেই; স্ট্যান্ডার্ড জিহান স্টোর শিল্ড লোগো দেখানো হচ্ছে।
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar (Delete / Clean) */}
            {activeLogo && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveLogo}
                  disabled={loading}
                  className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>কাস্টম লোগো মুছে ফেলুন (Delete/Remove)</span>
                </Button>
              </div>
            )}
          </div>

          {/* Real-time Multi-Theme Previews */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>ওয়েবসাইটে লাইভ প্রদর্শনী (Live Theme Contexts)</span>
            </h4>

            {/* Context 1: White Header (Day Mode) */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 block uppercase font-mono">
                ১. প্রধান মেনু ও হেডার (White Navbar)
              </span>
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                <Logo customLogoUrl={activeLogo} variant="horizontal" showTagline={false} />
                <div className="flex gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100" />
                  <span className="w-6 h-6 rounded-full bg-blue-900" />
                </div>
              </div>
            </div>

            {/* Context 2: Dark Blue Ribbon / Footer */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 block uppercase font-mono">
                ২. ফুটার ও ডার্ক ব্যানার (Dark Footer)
              </span>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between shadow-2xs">
                <Logo customLogoUrl={activeLogo} variant="light" showTagline={false} />
                <span className="text-[10px] font-mono text-amber-400">JIHAN STORE</span>
              </div>
            </div>

            {/* Context 3: Mobile Header View */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 block uppercase font-mono">
                ৩. মোবাইল হেডার কম্প্যাক্ট ভিউ (Mobile Screen)
              </span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between max-w-[280px]">
                <Logo customLogoUrl={activeLogo} variant="compact" showTagline={false} />
                <span className="text-[10px] bg-blue-900 text-white px-2 py-0.5 rounded font-mono font-bold">Menu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
