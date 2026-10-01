import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { Button, Input, Modal } from '../../components/common/UI';
import { Tag, Plus, Edit, Trash2, Calendar, CheckCircle2 } from 'lucide-react';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, showToast } = useStore();
  const [couponList, setCouponList] = useState<Coupon[]>(coupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState<Partial<Coupon>>({});

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      id: `coup-${Date.now()}`,
      code: '',
      discountType: 'percentage',
      discountAmount: 10,
      minOrder: 1500,
      maxDiscount: 500,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-12-31',
      usageLimit: 500,
      usedCount: 0,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountAmount) return;

    const codeUpper = formData.code.toUpperCase().trim();

    if (editingCoupon) {
      setCouponList(prev =>
        prev.map(c => (c.id === editingCoupon.id ? ({ ...formData, code: codeUpper } as Coupon) : c))
      );
      showToast('কুপন আপডেট সম্পন্ন');
    } else {
      setCouponList(prev => [...prev, { ...formData, code: codeUpper } as Coupon]);
      showToast('নতুন কুপন কোড তৈরি হয়েছে');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setCouponList(prev => prev.filter(c => c.id !== id));
    showToast('কুপন মুছে ফেলা হয়েছে');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            কুপন ও ডিসকাউন্ট ভাউচার (Coupons)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রমোশনাল ডিসকাউন্ট কোড, ব্যবহারের সীমা ও মেয়াদ নির্ধারণ করুন
          </p>
        </div>

        <Button variant="gold" size="md" onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>নতুন কুপন তৈরি করুন</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4 font-mono">কুপন কোড</th>
              <th className="py-3 px-3">ছাড়ের ধরন</th>
              <th className="py-3 px-3 font-mono">ছাড় পরিমাণ</th>
              <th className="py-3 px-3 font-mono">নূন্যতম অর্ডার</th>
              <th className="py-3 px-3 font-mono">মেয়াদকাল</th>
              <th className="py-3 px-3 font-mono">ব্যবহারের সীমা</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {couponList.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-black text-blue-900 text-sm">
                  {c.code}
                </td>
                <td className="py-3.5 px-3 capitalize">
                  {c.discountType === 'percentage' ? 'শতাংশ (%)' : 'নির্দিষ্ট টাকা (Fixed)'}
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                  {c.discountType === 'percentage' ? `${c.discountAmount}%` : `৳${c.discountAmount}`}
                  {c.discountType === 'percentage' && (
                    <span className="block text-[10px] text-slate-400">সর্বোচ্চ ৳{c.maxDiscount}</span>
                  )}
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-700 font-semibold">
                  ৳{c.minOrder.toLocaleString()}
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                  {c.startDate} হতে {c.expiryDate}
                </td>
                <td className="py-3.5 px-3 font-mono">
                  <span className="font-bold text-blue-900">{c.usedCount}</span> / {c.usageLimit}
                </td>
                <td className="py-3.5 px-3">
                  {c.isActive ? (
                    <span className="bg-emerald-50 text-emerald-700 font-semibold text-[11px] px-2 py-0.5 rounded">
                      সক্রিয়
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 font-semibold text-[11px] px-2 py-0.5 rounded">
                      নিষ্ক্রিয়
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCoupon ? 'কুপন সম্পাদন' : 'নতুন কুপন কোড'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-left text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="কুপন কোড (Coupon Code)*"
              placeholder="যেমন: EID2026"
              value={formData.code || ''}
              onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="font-mono uppercase font-bold"
              required
            />
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ডিসকাউন্ট টাইপ*</label>
              <select
                value={formData.discountType || 'percentage'}
                onChange={e => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                <option value="percentage">শতাংশ (%) - Percentage Discount</option>
                <option value="fixed">নির্দিষ্ট টাকা (BDT ৳) - Fixed Amount</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="ডিসকাউন্ট পরিমাণ (% বা ৳)*"
              type="number"
              value={formData.discountAmount || ''}
              onChange={e => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="নূন্যতম অর্ডার মূল্য (Min Order)*"
              type="number"
              value={formData.minOrder || ''}
              onChange={e => setFormData({ ...formData, minOrder: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="সর্বোচ্চ ছাড় লিমিট (Max Discount)*"
              type="number"
              value={formData.maxDiscount || ''}
              onChange={e => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="শুরুর তারিখ*"
              type="date"
              value={formData.startDate || ''}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="মেয়াদ উত্তীর্ণের তারিখ*"
              type="date"
              value={formData.expiryDate || ''}
              onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
              required
            />
            <Input
              label="ব্যবহারের সীমা (Usage Limit)*"
              type="number"
              value={formData.usageLimit || ''}
              onChange={e => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded text-blue-900"
            />
            <span className="font-semibold text-slate-800">কুপন সক্রিয় রাখুন (Active)</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
