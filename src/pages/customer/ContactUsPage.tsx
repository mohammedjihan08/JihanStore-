import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Textarea } from '../../components/common/UI';
import { Phone, Mail, MapPin, Send, MessageCircle, Star } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { settings, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Active items
  const activePhones = (settings.phoneNumbers || []).filter(p => p.isActive);
  const activeEmails = (settings.emailAddresses || []).filter(e => e.isActive);
  const activeAddresses = (settings.businessAddresses || []).filter(a => a.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('আপনার বার্তা পাঠানো হয়েছে। শীঘ্রই যোগাযোগ করা হবে।');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          যোগাযোগ করুন (Contact Us)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনার যেকোনো প্রশ্ন, পণ্যের অনুসন্ধান বা কাস্টমার সাপোর্টের জন্য আমাদের সাথে যোগাযোগ করুন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info - 5 cols */}
        <div className="md:col-span-5 space-y-6">
          {/* Phones */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>হেল্পলাইন ও সরাসরি কল</span>
            </h3>

            <div className="space-y-2.5">
              {activePhones.length > 0 ? (
                activePhones.map(p => (
                  <div key={p.id} className="flex items-start justify-between text-xs">
                    <div>
                      <a
                        href={`tel:${p.number}`}
                        className="font-mono font-bold text-blue-950 text-sm hover:text-amber-600 transition-colors block"
                      >
                        {p.number}
                      </a>
                      <span className="text-[11px] text-slate-500">{p.label}</span>
                    </div>
                    {p.isDefault && (
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono">
                        MAIN
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <a href={`tel:${settings.phone}`} className="font-mono font-bold text-sm text-blue-950">
                  {settings.phone}
                </a>
              )}
            </div>

            {settings.whatsapp && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-700">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-semibold">WhatsApp সাপোর্ট</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{settings.whatsapp}</span>
              </div>
            )}
          </div>

          {/* Emails */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Mail className="w-4 h-4 text-blue-900" />
              <span>ইমেইল যোগাযোগ</span>
            </h3>

            <div className="space-y-2.5">
              {activeEmails.length > 0 ? (
                activeEmails.map(em => (
                  <div key={em.id} className="flex items-start justify-between text-xs">
                    <div>
                      <a
                        href={`mailto:${em.email}`}
                        className="font-mono font-bold text-slate-900 hover:text-blue-900 transition-colors block"
                      >
                        {em.email}
                      </a>
                      <span className="text-[11px] text-slate-500">{em.label}</span>
                    </div>
                    {em.isDefault && (
                      <span className="text-[9px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-mono">
                        DEFAULT
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <a href={`mailto:${settings.email}`} className="font-mono font-bold text-sm text-slate-900">
                  {settings.email}
                </a>
              )}
            </div>
          </div>

          {/* Business Addresses */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>অফিস ও আউটলেটের ঠিকানা</span>
            </h3>

            <div className="space-y-3">
              {activeAddresses.length > 0 ? (
                activeAddresses.map(a => (
                  <div key={a.id} className="text-xs space-y-0.5 border-b border-slate-100 last:border-b-0 pb-2 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{a.title}</span>
                      {a.isDefault && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-mono">
                          HEAD OFFICE
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{a.address}</p>
                    {a.city && <span className="text-[11px] text-slate-400 font-medium block">{a.city}</span>}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-600">{settings.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Message Form - 7 cols */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-base text-slate-900 mb-1">আমাদের সরাসরি বার্তা পাঠান</h3>
          <p className="text-xs text-slate-500 mb-5">
            নিচের ফর্মটি পূরণ করে পাঠান, আমাদের কাস্টমার রিলেশন টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="আপনার নাম (Name)*"
                placeholder="পূর্ণ নাম"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <Input
                label="ইমেইল (Email)*"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="বিষয় (Subject)*"
              placeholder="যেমন: অর্ডার ডেলিভারি বা পণ্যের তথ্য"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />

            <Textarea
              label="আপনার বার্তা (Your Message)*"
              placeholder="বিস্তারিত লিখুন..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              required
            />

            <Button type="submit" variant="primary" size="md" className="gap-2 font-bold cursor-pointer">
              <Send className="w-4 h-4" />
              <span>বার্তা পাঠান (Send Message)</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
