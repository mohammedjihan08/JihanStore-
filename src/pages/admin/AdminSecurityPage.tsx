import React from 'react';
import { ShieldCheck, Lock, Key, AlertTriangle, CheckCircle2, Server } from 'lucide-react';

export const AdminSecurityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>সিকিউরিটি ও এক্সেস কন্ট্রোল (Security & RBAC)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          জিহান স্টোরের নিরাপত্তা স্থাপত্য, রোল-বেসড এক্সেস এবং ডাটাবেজ সুরক্ষা নীতিমালা
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Security Principle */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">ওয়ালেট ব্যালেন্স অপরিবর্তনীয়তা</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            গ্রাহক ক্লায়েন্ট-সাইড থেকে সরাসরি নিজের ওয়ালেট ব্যালেন্স পরিবর্তন করতে পারবে না। শুধুমাত্র সার্ভার-সাইড ভ্যালিডেশন এবং অনুমোদিত অ্যাডমিন প্রক্রিয়াকরণের মাধ্যমেই ব্যালেন্স বৃদ্ধি বা হ্রাস পায়।
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Server-Authoritative Enforcement Active</span>
          </div>
        </div>

        {/* Customer Data Isolation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">কাস্টমার ডাটা আইসোলেশন</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            প্রতিটি গ্রাহক কেবল নিজস্ব প্রোফাইল, অর্ডার হিস্টরি এবং ওয়ালেট ট্রানজেকশন দেখতে পারেন। কোনো গ্রাহক অন্য গ্রাহকের অর্ডারের তথ্য অ্যাক্সেস করতে পারেন না।
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strict User Document Scoping</span>
          </div>
        </div>

        {/* Admin RBAC Enforcement */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">এডমিন রোল ভ্যালিডেশন (RBAC)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            এডমিন প্যানেলে প্রবেশ শুধুমাত্র ফায়ারবেস অথেন্টিকেশন এবং অ্যাডমিন কাস্টম ক্লেইমস (admin: true) ভেরিফিকেশনের মাধ্যমেই অনুমোদিত।
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Custom Claims & Token Verification</span>
          </div>
        </div>

        {/* Password Security */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">জিরো প্লেইনটেক্সট পাসওয়ার্ড নীতি</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            কখনোই ডাটাবেজে পাসওয়ার্ড সংরক্ষণ করা হয় না। পাসওয়ার্ড সম্পূর্ণভাবে নিরাপদ ক্রিপ্টোগ্রাফিক হ্যাশিং (Firebase Auth Native) দ্বারা সুরক্ষিত।
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Password Persistence Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
