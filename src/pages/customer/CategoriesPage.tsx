import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, setSelectedCategory, setCurrentRoute } = useStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          সকল ক্যাটাগরি (All Categories)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          জিহান স্টোরের প্রতিটি বিভাগের প্রিমিয়াম কালেকশন ব্রাউজ করুন
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.name);
              setCurrentRoute('products');
            }}
            className="group bg-white p-6 rounded-xl border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-900 transition-colors">
                  {cat.banglaName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{cat.name}</p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-amber-600 font-mono">
                  {cat.itemCount} টি প্রোডাক্ট উপলব্ধ
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-900 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
