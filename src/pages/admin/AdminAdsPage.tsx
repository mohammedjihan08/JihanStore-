import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Advertisement, AdPosition } from '../../types';
import { Button, Input, Textarea, Modal } from '../../components/common/UI';
import { Megaphone, Plus, Edit, Trash2, ExternalLink, Calendar, Check } from 'lucide-react';

export const AdminAdsPage: React.FC = () => {
  const { ads, addAd, updateAd, deleteAd, showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Advertisement>>({});
  const [urlError, setUrlError] = useState('');

  const positions: AdPosition[] = [
    'Home Top',
    'Home Middle',
    'Product Page',
    'Category Page'
  ];

  const handleOpenCreate = () => {
    setEditingAd(null);
    setFormData({
      id: `ad-${Date.now()}`,
      title: '',
      description: '',
      imageUrl: '/src/assets/images/product_premium_wireless_headphone_1790798420285.jpg',
      buttonText: 'অফার উপভোগ করুন',
      destinationUrl: 'https://jihanstore.com',
      position: 'Home Middle',
      displayOrder: ads.length + 1,
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      clicks: 0
    });
    setUrlError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({ ...ad });
    setUrlError('');
    setIsModalOpen(true);
  };

  // URL Validator
  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.destinationUrl) return;

    if (!validateUrl(formData.destinationUrl)) {
      setUrlError('দয়া করে সঠিক পূর্ণাঙ্গ URL লিখুন (যেমন: https://example.com/offer)');
      return;
    }

    if (editingAd) {
      updateAd(formData as Advertisement);
    } else {
      addAd(formData as Advertisement);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            বিজ্ঞাপন ও প্রমোশন ম্যানেজমেন্ট (Ads Management)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ওয়েবসাইটের বিভিন্ন পজিশনে ব্যানার বিজ্ঞাপন পরিচালনা ও ট্র্যাকিং করুন
          </p>
        </div>

        <Button variant="gold" size="md" onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>নতুন বিজ্ঞাপন যোগ করুন</span>
        </Button>
      </div>

      {/* Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ads.map(ad => (
          <div
            key={ad.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Ad Image & Position Tag */}
              <div className="relative h-40 bg-slate-900 overflow-hidden">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-blue-900 text-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-md shadow-xs">
                  {ad.position}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {ad.isActive ? (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      সক্রিয়
                    </span>
                  ) : (
                    <span className="bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      নিষ্ক্রিয়
                    </span>
                  )}
                </div>
              </div>

              {/* Ad Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>ক্রম: #{ad.displayOrder}</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" /> {ad.startDate} হতে {ad.endDate}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{ad.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ad.description}</p>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs flex items-center justify-between text-slate-600">
                  <span className="truncate max-w-[200px] font-mono">{ad.destinationUrl}</span>
                  <span className="font-bold text-blue-900">{ad.buttonText}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-mono text-slate-500">
                মোট ক্লিক: <strong>{ad.clicks}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(ad)}
                  className="gap-1 py-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>সম্পাদন</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteAd(ad.id)}
                  className="gap-1 py-1 text-rose-700 border-rose-300 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছুন</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAd ? 'বিজ্ঞাপন সম্পাদনা' : 'নতুন বিজ্ঞাপন তৈরি'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-left text-xs">
          <Input
            label="বিজ্ঞাপনের শিরোনাম (Ad Title)*"
            value={formData.title || ''}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="বিবরণ (Description)*"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ডিসপ্লে পজিশন (Position)*</label>
              <select
                value={formData.position || 'Home Middle'}
                onChange={e => setFormData({ ...formData, position: e.target.value as AdPosition })}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                {positions.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="বাটন টেক্সট (Button Text)*"
              value={formData.buttonText || ''}
              onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
              required
            />
          </div>

          <Input
            label="বিজ্ঞাপন ইমেজ URL*"
            value={formData.imageUrl || ''}
            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
            required
          />

          <Input
            label="গন্তব্য URL (Destination URL - External Link Validation)*"
            placeholder="https://example.com/promo"
            value={formData.destinationUrl || ''}
            onChange={e => {
              setFormData({ ...formData, destinationUrl: e.target.value });
              setUrlError('');
            }}
            error={urlError}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="শুরুর তারিখ*"
              type="date"
              value={formData.startDate || ''}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="শেষের তারিখ*"
              type="date"
              value={formData.endDate || ''}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
            <Input
              label="ডিসপ্লে ক্রম (Order)*"
              type="number"
              value={formData.displayOrder || 1}
              onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
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
            <span className="font-semibold text-slate-800">বিজ্ঞাপনটি লাইভ রাখুন (Active)</span>
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
