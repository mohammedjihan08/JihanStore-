import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Button, Input, Textarea, Modal } from '../../components/common/UI';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Check,
  AlertTriangle
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, updateProduct, addProduct, deleteProduct } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Product>>({});

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.banglaName.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term)
    );
  });

  const handleOpenCreate = () => {
    setFormData({
      id: `prod-${Date.now()}`,
      name: '',
      banglaName: '',
      sku: `JS-SKU-${Math.floor(100 + Math.random() * 900)}`,
      category: categories[0]?.name || 'Smart Gadgets & Audio',
      price: 1500,
      originalPrice: 2000,
      discountPercentage: 25,
      description: '',
      stock: 20,
      images: ['/src/assets/images/product_premium_wireless_headphone_1790798420285.jpg'],
      colors: ['Classic Navy', 'Black'],
      sizes: ['Standard'],
      variants: [],
      specifications: { 'Warranty': '1 Year' },
      isActive: true,
      isOutOfStock: false,
      isHidden: false,
      rating: 4.8,
      reviewsCount: 1,
      tags: ['New'],
      createdAt: new Date().toISOString()
    });
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({ ...prod });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.sku) return;

    const discount =
      formData.originalPrice && formData.originalPrice > formData.price
        ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
        : 0;

    const fullProduct: Product = {
      ...(formData as Product),
      discountPercentage: discount,
      isOutOfStock: (formData.stock || 0) <= 0
    };

    if (editingProduct) {
      updateProduct(fullProduct);
    } else {
      addProduct(fullProduct);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            পণ্য ব্যবস্থাপনা (Product Management)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            মোট <span className="font-mono font-bold text-blue-900">{products.length}</span> টি পণ্য নিবন্ধিত আছে
          </p>
        </div>

        <Button variant="gold" size="md" onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যুক্ত করুন</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="নাম বা SKU দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white w-full sm:w-auto"
        >
          <option value="all">সব ক্যাটাগরি (All Categories)</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>
              {c.banglaName}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">পণ্য (Product)</th>
              <th className="py-3 px-3">ক্যাটাগরি</th>
              <th className="py-3 px-3 font-mono">মূল্য</th>
              <th className="py-3 px-3 font-mono">স্টক</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block line-clamp-1">{p.banglaName || p.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">SKU: {p.sku}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 font-medium text-slate-600">{p.category}</td>
                <td className="py-3 px-3 font-mono font-bold text-blue-950">
                  ৳{p.price.toLocaleString()}
                  {p.discountPercentage > 0 && (
                    <span className="block text-[10px] text-amber-600 font-medium">-{p.discountPercentage}%</span>
                  )}
                </td>
                <td className="py-3 px-3 font-mono">
                  {p.stock > 0 ? (
                    <span className="text-emerald-700 font-semibold">{p.stock} টি</span>
                  ) : (
                    <span className="text-rose-600 font-semibold">আউট অব স্টক</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    {p.isActive ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">সক্রিয়</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">নিষ্ক্রিয়</span>
                    )}
                    {p.isHidden && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">লুকানো</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-md transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Product"
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

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'পণ্য সম্পাদন করুন' : 'নতুন পণ্য যুক্ত করুন'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="পণ্যের নাম (English Product Name)*"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="বাংলা নাম (Bangla Product Name)*"
              value={formData.banglaName || ''}
              onChange={e => setFormData({ ...formData, banglaName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="SKU কোড*"
              value={formData.sku || ''}
              onChange={e => setFormData({ ...formData, sku: e.target.value })}
              required
            />
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ক্যাটাগরি*</label>
              <select
                value={formData.category || ''}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.banglaName}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="স্টক পরিমাণ (Stock)*"
              type="number"
              value={formData.stock !== undefined ? formData.stock : 10}
              onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="বিক্রয় মূল্য (Price in BDT ৳)*"
              type="number"
              value={formData.price || ''}
              onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="পূর্বের বা মূল মূল্য (Original Price in BDT ৳)"
              type="number"
              value={formData.originalPrice || ''}
              onChange={e => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <Textarea
            label="পণ্যের বিস্তারিত বিবরণ (Description)*"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <Input
            label="ইমেজ URL (Image Path)*"
            value={formData.images?.[0] || ''}
            onChange={e => setFormData({ ...formData, images: [e.target.value] })}
            required
          />

          {/* Flags: Active, Hidden */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded text-blue-900"
              />
              <span className="font-semibold text-slate-800">সক্রিয় পণ্য (Active)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isHidden ?? false}
                onChange={e => setFormData({ ...formData, isHidden: e.target.checked })}
                className="rounded text-blue-900"
              />
              <span className="font-semibold text-slate-800">গ্রাহকদের থেকে লুকান (Hidden)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
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
