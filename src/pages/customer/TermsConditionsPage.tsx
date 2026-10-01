import React from 'react';
import { useStore } from '../../context/StoreContext';
import { FileText } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-900" />
          <span>ব্যবহারের শর্তাবলী (Terms & Conditions)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">জিহান স্টোরে কেনাকাটার সাধারণ শর্তসমূহ</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="text-base font-bold text-slate-900">১. অর্ডার ও ডেলিভারি নীতি</h3>
        <p>{settings.termsConditionsText}</p>
        <p>
          ক্যাশ অন ডেলিভারিতে অর্ডারকৃত পণ্য ডেলিভারি কর্মীর সামনে চেক করে রিসিভ করার পরামর্শ দেওয়া হচ্ছে।
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">২. কাস্টমার ওয়ালেট ও পেমেন্ট নীতি</h3>
        <p>
          ওয়ালেট রিচার্জ বা ডিপোজিট রিকোয়েস্ট অ্যাডমিন কর্তৃক ভেরিফিকেশন সাপেক্ষে কার্যকর হবে। কোনো ভুল ট্রানজেকশন আইডি প্রদান করা হলে রিকোয়েস্ট প্রত্যাখ্যাত হতে পারে।
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">৩. রিটার্ন ও রিফান্ড নীতি</h3>
        <p>
          ত্রুটিপূর্ণ বা ভুল পণ্য পেলে ডেলিভারির ২৪ ঘণ্টার মধ্যে আমাদের হেল্পলাইনে অবহিত করতে হবে। যাচাই সাপেক্ষে গ্রাহকের ওয়ালেটে বা মূল পেমেন্ট মেথডে রিফান্ড প্রদান করা হবে।
        </p>
      </div>
    </div>
  );
};
