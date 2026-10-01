import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import { Button, Input, Modal } from '../../components/common/UI';
import { Layers, Plus, Edit, Trash2 } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, showToast } = useStore();
  const [categoryList, setCategoryList] = useState<ProductCategory[]>(categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [slug, setSlug] = useState('');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setBanglaName('');
    setSlug('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setBanglaName(cat.banglaName);
    setSlug(cat.slug);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !banglaName) return;

    if (editingCategory) {
      setCategoryList(prev =>
        prev.map(c =>
          c.id === editingCategory.id ? { ...c, name, banglaName, slug: slug || name.toLowerCase().replace(/\s+/g, '-') } : c
        )
      );
      showToast('ক্যাটাগরি আপডেট সম্পন্ন');
    } else {
      const newCat: ProductCategory = {
        id: `cat-${Date.now()}`,
        name,
        banglaName,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        itemCount: 0
      };
      setCategoryList(prev => [...prev, newCat]);
      showToast('নতুন ক্যাটাগরি তৈরি হয়েছে');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategoryList(prev => prev.filter(c => c.id !== id));
    showToast('ক্যাটাগরি মুছে ফেলা হয়েছে');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            ক্যাটাগরি ব্যবস্থাপনা (Categories)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">পণ্যের বিভাগ ও উপবিভাগ পরিচালনা করুন</p>
        </div>

        <Button variant="gold" size="md" onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">ক্যাটাগরি নাম (English)</th>
              <th className="py-3 px-4">বাংলা নাম</th>
              <th className="py-3 px-4 font-mono">Slug</th>
              <th className="py-3 px-4 font-mono">পণ্য সংখ্যা</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categoryList.map(cat => (
              <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{cat.name}</td>
                <td className="py-3.5 px-4 font-medium text-slate-700">{cat.banglaName}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{cat.slug}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                  {products.filter(p => p.category === cat.name).length || cat.itemCount} টি
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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
        title={editingCategory ? 'ক্যাটাগরি সম্পাদন' : 'নতুন ক্যাটাগরি তৈরি'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-left">
          <Input
            label="ক্যাটাগরি নাম (English Name)*"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            label="বাংলা নাম (Bangla Name)*"
            value={banglaName}
            onChange={e => setBanglaName(e.target.value)}
            required
          />
          <Input
            label="URL Slug (Optional)"
            placeholder="যেমন: smart-gadgets"
            value={slug}
            onChange={e => setSlug(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              বাতিল
            </Button>
            <Button type="submit" variant="primary" size="sm">
              সংরক্ষণ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
