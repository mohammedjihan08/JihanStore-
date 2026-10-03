import React, { useState, useRef } from 'react';
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
  AlertTriangle,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  X,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { uploadProductImage } from '../../services/productService';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, updateProduct, addProduct, deleteProduct, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.banglaName && p.banglaName.toLowerCase().includes(term)) ||
      (p.sku && p.sku.toLowerCase().includes(term))
    );
  });

  const getCleanProductImage = (imgUrl?: string): string => {
    if (!imgUrl) {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="%23f1f5f9"><rect width="200" height="200" fill="%23f1f5f9"/><circle cx="100" cy="85" r="30" fill="%23cbd5e1"/><path d="M70 145 Q100 120 130 145" stroke="%2394a3b8" stroke-width="6" fill="none"/></svg>`;
    }
    if (imgUrl.startsWith('/src/assets/images/')) {
      return imgUrl.replace('/src/assets/images/', '/assets/images/');
    }
    return imgUrl;
  };

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
      images: ['/assets/images/product_premium_wireless_headphone_1790798420285.jpg'],
      colors: ['Classic Navy', 'Black'],
      sizes: ['Standard'],
      variants: [],
      specifications: { 'Warranty': '1 Year Official' },
      isActive: true,
      isOutOfStock: false,
      isHidden: false,
      rating: 4.8,
      reviewsCount: 1,
      tags: ['New'],
      createdAt: new Date().toISOString()
    });
    setEditingProduct(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({ ...prod });
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('শুধুমাত্র PNG, JPG, JPEG, WebP বা SVG ফরম্যাটের ইমেজ ফাইল গ্রহণযোগ্য।');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('ফাইলের আকার ১০ মেগাবাইটের বেশি হতে পারবে না।');
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    try {
      const uploadedUrl = await uploadProductImage(file);
      setFormData(prev => ({
        ...prev,
        images: [uploadedUrl, ...(prev.images || []).filter(img => img !== uploadedUrl)]
      }));
      showToast('ইমেজ সফলভাবে আপলোড হয়েছে');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err?.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.sku) {
      showToast('অনুগ্রহ করে পণ্যের নাম, মূল্য এবং SKU পূরণ করুন');
      return;
    }

    const discount =
      formData.originalPrice && formData.originalPrice > formData.price
        ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
        : 0;

    const fullProduct: Product = {
      ...(formData as Product),
      images: formData.images && formData.images.length > 0 ? formData.images : ['/assets/images/product_premium_wireless_headphone_1790798420285.jpg'],
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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-900" />
            <span>পণ্য ব্যবস্থাপনা (Product Management)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            মোট <span className="font-mono font-bold text-blue-900">{products.length}</span> টি পণ্য ডাটাবেজে সংরক্ষিত আছে
          </p>
        </div>

        <Button variant="gold" size="md" onClick={handleOpenCreate} className="gap-2 font-bold cursor-pointer shadow-xs">
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যুক্ত করুন</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
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
          className="w-full sm:w-56 text-xs rounded-lg border border-slate-300 py-2 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-blue-800"
        >
          <option value="all">সকল ক্যাটাগরি (All Categories)</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>
              {c.banglaName}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">পণ্য (Product)</th>
                <th className="py-3 px-3">ক্যাটাগরি</th>
                <th className="py-3 px-3 font-mono">মূল্য (Price)</th>
                <th className="py-3 px-3 font-mono">স্টক (Stock)</th>
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
                        src={getCleanProductImage(p.images?.[0])}
                        alt=""
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23f1f5f9"><rect width="100" height="100" fill="%23f1f5f9"/><circle cx="50" cy="40" r="16" fill="%23cbd5e1"/><path d="M35 70 Q50 55 65 70" stroke="%2394a3b8" stroke-width="3" fill="none"/></svg>`;
                        }}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{p.banglaName || p.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">SKU: {p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600">{p.category}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-950">
                    ৳{Number(p.price).toLocaleString()}
                    {p.discountPercentage > 0 && (
                      <span className="block text-[10px] text-amber-600 font-medium font-mono">-{p.discountPercentage}%</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {p.stock > 0 ? (
                      <span className="text-emerald-700 font-semibold">{p.stock} টি</span>
                    ) : (
                      <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded text-[11px]">স্টক শেষ</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {p.isActive ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">সক্রিয়</span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">নিষ্ক্রিয়</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`আপনি কি "${p.banglaName || p.name}" মুছে ফেলতে চান?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
      </div>

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'পণ্য সম্পাদন করুন (Edit Product)' : 'নতুন পণ্য যুক্ত করুন (Add Product)'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-left">
          {/* Product Names */}
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

          {/* SKU, Category & Stock */}
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

          {/* Pricing */}
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

          {/* Description */}
          <Textarea
            label="পণ্যের বিস্তারিত বিবরণ (Description)*"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          {/* PRODUCT IMAGE UPLOAD SECTION */}
          <div className="space-y-2 border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-900" />
                <span>পণ্যের ছবি (Product Image)*</span>
              </label>

              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    imageInputMode === 'upload' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ফাইল আপলোড
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                    imageInputMode === 'url' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  অনলাইন URL
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {uploadError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {imageInputMode === 'upload' ? (
              <div className="space-y-3">
                {/* Upload Drop Zone / Picker */}
                <div
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    uploadingImage
                      ? 'border-blue-300 bg-blue-50/50'
                      : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={uploadingImage}
                  />

                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-900" />
                        <span className="text-xs font-bold text-blue-900">
                          ইমেজ আপলোড হচ্ছে ও ক্লাউডে সেভ হচ্ছে...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          ছবি নির্বাচন করতে এখানে ক্লিক করুন (Click to upload)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          PNG, JPG, WebP বা SVG (সর্বোচ্চ ১০MB)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Thumbnail Previews */}
                {formData.images && formData.images.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden shrink-0 group">
                        <img
                          src={getCleanProductImage(img)}
                          alt="preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                          title="ছবি মুছুন"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Input
                label="ইমেজ URL লিঙ্ক"
                placeholder="https://.../product.jpg"
                value={formData.images?.[0] || ''}
                onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                required
              />
            )}
          </div>

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

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={uploadingImage}
              className="cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              disabled={uploadingImage}
              className="font-bold cursor-pointer shadow-xs gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'আপডেট করুন' : 'পণ্য সংরক্ষণ করুন'}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
