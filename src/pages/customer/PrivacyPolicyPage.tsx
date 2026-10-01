import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-900" />
          <span>প্রাইভেসি পলিসি (Privacy Policy)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          গ্রাহকের ব্যক্তিগত ও আর্থিক তথ্যের নিরাপত্তা নিশ্চিতকরণ
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="text-base font-bold text-slate-900">১. তথ্যের গোপনীয়তা ও সুরক্ষা</h3>
        <p>{settings.privacyPolicyText}</p>

        <h3 className="text-base font-bold text-slate-900 pt-2">২. সংরক্ষিত তথ্যাদি</h3>
        <p>
          অর্ডার ডেলিভারি এবং কাস্টমার ওয়ালেট পরিচালনার স্বার্থে আমরা গ্রাহকের নাম, ফোন নম্বর, ডেলিভারি ঠিকানা এবং ইমেইল সংরক্ষণ করি। আমরা কখনো গ্রাহকের পাসওয়ার্ড উন্মুক্তভাবে সংরক্ষণ করি না।
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">৩. কাস্টমার ওয়ালেট লেনদেন নিরাপত্তা</h3>
        <p>
          গ্রাহকের ওয়ালেট লেনদেন এবং ব্যালেন্স পরিবর্তন সম্পূর্ণ নিরাপদ অ্যাডমিন অডিট প্রক্রিয়ার মাধ্যমে সম্পন্ন হয়। কোনো গ্রাহক অন্য কারো ওয়ালেট বা অর্ডারের তথ্য দেখার সুযোগ পান না।
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">৪. যোগাযোগ</h3>
        <p>
          প্রাইভেসি সংক্রান্ত যেকোনো জিজ্ঞাসায় ইমেইল করুন: <span className="font-mono font-bold text-blue-950">{settings.email}</span>
        </p>
      </div>
    </div>
  );
};
