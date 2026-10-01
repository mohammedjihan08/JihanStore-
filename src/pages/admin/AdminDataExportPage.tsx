import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/common/UI';
import { FileSpreadsheet, Download, Database, ShieldCheck } from 'lucide-react';

export const AdminDataExportPage: React.FC = () => {
  const { products, orders, allCustomerWallets, allWalletTransactions, showToast } = useStore();

  const exportToJson = (data: any, filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filename} সফলভাবে এক্সপোর্ট হয়েছে`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-blue-900" />
          <span>ডাটা এক্সপোর্ট ও ব্যাকআপ (Data Export)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          স্টোরের সকল পণ্য ক্যাটালগ, কাস্টমার অর্ডার ও ওয়ালেট অডিট ডাটা ডাউনলোড করুন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Export */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">পণ্য ক্যাটালগ (Products)</h3>
            <p className="text-xs text-slate-500">
              সকল সক্রিয় ও লুকানো পণ্যের বিবরণ, SKU, স্টক এবং মূল্য ডাটা।
            </p>
            <span className="font-mono text-xs font-bold text-blue-950 block">
              {products.length} টি রেকর্ড
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportToJson(products, 'jihan_store_products')}
            className="w-full gap-2 border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON এক্সপোর্ট</span>
          </Button>
        </div>

        {/* Orders Export */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">অর্ডার হিস্টরি (Orders)</h3>
            <p className="text-xs text-slate-500">
              সকল কাস্টমার অর্ডার, ডেলিভারি ঠিকানা, ফোন নম্বর ও পেমেন্ট সামারি।
            </p>
            <span className="font-mono text-xs font-bold text-blue-950 block">
              {orders.length} টি রেকর্ড
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportToJson(orders, 'jihan_store_orders')}
            className="w-full gap-2 border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON এক্সপোর্ট</span>
          </Button>
        </div>

        {/* Wallet Audit Log Export */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">ওয়ালেট অডিট লগ (Wallets)</h3>
            <p className="text-xs text-slate-500">
              সকল ডিপোজিট, উইথড্র, এডমিন এডজাস্টমেন্ট ও TrxID হিস্টরি।
            </p>
            <span className="font-mono text-xs font-bold text-blue-950 block">
              {allWalletTransactions.length} টি অডিট এন্ট্রি
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportToJson(allWalletTransactions, 'jihan_store_wallet_audit')}
            className="w-full gap-2 border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON এক্সপোর্ট</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
