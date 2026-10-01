import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button, Input, Textarea } from '../../components/common/UI';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { settings, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('আপনার বার্তা পাঠানো হয়েছে। শীঘ্রই যোগাযোগ করা হবে।');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          যোগাযোগ করুন (Contact Us)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনার যেকোনো প্রশ্ন, পণ্যের অনুসন্ধান বা ফিডব্যাকের জন্য আমাদের সাথে যোগাযোগ করুন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info - 5 cols */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="font-bold text-base text-slate-900">অফিসের ঠিকানা ও হেল্পলাইন</h3>

          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">ঠিকানা:</span>
                <p className="mt-0.5">{settings.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">সরাসরি কল:</span>
                <p className="font-mono mt-0.5 text-blue-950 font-bold">{settings.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">WhatsApp:</span>
                <p className="font-mono mt-0.5">{settings.whatsapp}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">ইমেইল:</span>
                <p className="font-mono mt-0.5">{settings.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form - 7 cols */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-base text-slate-900 mb-4">আমাদের মেসেজ পাঠান</h3>

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
              placeholder="যেমন: অর্ডার ডেলিভারি অনুসন্ধান..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />

            <Textarea
              label="আপনার বার্তা (Your Message)*"
              placeholder="বিস্তারিত লিখুন..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              required
            />

            <Button type="submit" variant="primary" className="gap-2">
              <Send className="w-4 h-4" />
              <span>মেসেজ পাঠান</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
