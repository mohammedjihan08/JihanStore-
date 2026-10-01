import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PromoBanner } from '../../types';
import { Button, Input, Modal } from '../../components/common/UI';
import { Image as ImageIcon, Plus, Edit, Trash2 } from 'lucide-react';

export const AdminBannersPage: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);

  const [title, setTitle] = useState('');
  const [banglaTitle, setBanglaTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('products');
  const [buttonText, setButtonText] = useState('শপিং করুন');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setTitle('');
    setBanglaTitle('');
    setSubtitle('');
    setImageUrl('/src/assets/images/hero_jihan_lifestyle_1790798408664.jpg');
    setLinkUrl('products');
    setButtonText('কালেকশন দেখুন');
    setDisplayOrder(banners.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: PromoBanner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setBanglaTitle(b.banglaTitle || '');
    setSubtitle(b.subtitle);
    setImageUrl(b.imageUrl);
    setLinkUrl(b.linkUrl);
    setButtonText(b.buttonText);
    setDisplayOrder(b.displayOrder);
    setIsActive(b.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    const bannerObj: PromoBanner = {
      id: editingBanner ? editingBanner.id : `ban-${Date.now()}`,
      title,
      banglaTitle,
      subtitle,
      imageUrl,
      linkUrl,
      buttonText,
      displayOrder,
      isActive
    };

    if (editingBanner) {
      updateBanner(bannerObj);
    } else {
      addBanner(bannerObj);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            হোম ব্যানার ব্যবস্থাপনা (Promo Banners)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">হোম পেজের প্রধান স্লাইডার ও ব্যানার পরিচালনা</p>
        </div>

        <Button variant="gold" size="md" onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>নতুন ব্যানার</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map(banner => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-blue-900 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  অর্ডার: #{banner.displayOrder}
                </div>
                <div className="absolute top-3 right-3">
                  {banner.isActive ? (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      সক্রিয়
                    </span>
                  ) : (
                    <span className="bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      নিষ্ক্রিয়
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-slate-900">
                  {banner.banglaTitle || banner.title}
                </h3>
                <p className="text-xs text-slate-500">{banner.subtitle}</p>
                <div className="text-[11px] font-mono text-blue-900 font-semibold pt-1">
                  বাটন: {banner.buttonText} → {banner.linkUrl}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <Button size="sm" variant="outline" onClick={() => handleOpenEdit(banner)}>
                সম্পাদন
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteBanner(banner.id)}
                className="text-rose-600 hover:bg-rose-50 border-rose-300"
              >
                মুছুন
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'ব্যানার সম্পাদন' : 'নতুন ব্যানার যোগ'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-left text-xs">
          <Input
            label="ব্যানার টাইটেল (English Title)*"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Input
            label="বাংলা টাইটেল (Bangla Title)"
            value={banglaTitle}
            onChange={e => setBanglaTitle(e.target.value)}
          />
          <Input
            label="সাবটাইটেল / বর্ণনা*"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            required
          />
          <Input
            label="ইমেজ URL*"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="বাটন টেক্সট*"
              value={buttonText}
              onChange={e => setButtonText(e.target.value)}
              required
            />
            <Input
              label="ডিসপ্লে ক্রম (Order)*"
              type="number"
              value={displayOrder}
              onChange={e => setDisplayOrder(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="rounded text-blue-900"
            />
            <span className="font-semibold text-slate-800">ব্যানারটি লাইভ রাখুন (Active)</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
