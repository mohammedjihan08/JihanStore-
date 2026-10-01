import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../../components/brand/Logo';
import { ShieldCheck, Truck, Award, Users } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
        <div className="flex justify-center">
          <Logo variant="horizontal" showTagline={true} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          বিশ্বাসের সাথে অনলাইন শপিং
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {settings.aboutUsText}
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">শতভাগ কোয়ালিটি</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            প্রতিটি পণ্য বাছাই করা হয় নির্ভরযোগ্য সোর্স থেকে। কোয়ালিটির সাথে কোনো আপস নেই।
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">দ্রুততম ডেলিভারি</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            ঢাকার মধ্যে ১-২ দিন এবং দেশের প্রত্যন্ত অঞ্চলেও দ্রুততম কুরিয়ারে ক্যাশ অন ডেলিভারি।
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">কাস্টমার ওয়ালেট</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            দ্রুত অর্ডার ও রিফান্ডের সুবিধার্থে দেশের অন্যতম সেরা ও সুরক্ষিত ওয়ালেট ব্যবস্থা।
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">বন্ধুত্বপূর্ণ সাপোর্ট</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            ফোন, হোয়াটসঅ্যাপ বা ইমেইলে আমাদের সাপোর্ট টিম সবসময় আপনার পাশে প্রস্তুত।
          </p>
        </div>
      </div>
    </div>
  );
};
