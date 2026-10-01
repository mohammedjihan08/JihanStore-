import React, { useState, useEffect } from 'react';
import { Button, Input } from '../../components/common/UI';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Bell,
  Smartphone,
  ExternalLink,
  Lock,
  Copy,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

interface TelegramServerConfig {
  configured: boolean;
  botTokenMasked: string;
  chatId: string;
  enabled: boolean;
  notifyOnNewOrder: boolean;
  notifyOnDeposit: boolean;
}

export const AdminTelegramPage: React.FC = () => {
  const [config, setConfig] = useState<TelegramServerConfig>({
    configured: false,
    botTokenMasked: '',
    chatId: '',
    enabled: true,
    notifyOnNewOrder: true,
    notifyOnDeposit: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit fields
  const [isEditingToken, setIsEditingToken] = useState(false);
  const [newTokenInput, setNewTokenInput] = useState('');
  const [chatIdInput, setChatIdInput] = useState('');
  const [enabledInput, setEnabledInput] = useState(true);
  const [notifyOrderInput, setNotifyOrderInput] = useState(true);
  const [notifyDepositInput, setNotifyDepositInput] = useState(true);

  const [copied, setCopied] = useState(false);

  // Fetch current server configuration
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/telegram/config');
      if (res.ok) {
        const data: TelegramServerConfig = await res.json();
        setConfig(data);
        setChatIdInput(data.chatId);
        setEnabledInput(data.enabled);
        setNotifyOrderInput(data.notifyOnNewOrder);
        setNotifyDepositInput(data.notifyOnDeposit);
      }
    } catch (err) {
      console.error('Failed to load Telegram configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const body: any = {
        chatId: chatIdInput.trim(),
        enabled: enabledInput,
        notifyOnNewOrder: notifyOrderInput,
        notifyOnDeposit: notifyDepositInput,
      };

      if (isEditingToken && newTokenInput.trim()) {
        body.botToken = newTokenInput.trim();
      }

      const res = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          message: data.message || 'টেলিগ্রাম সেটিংস সফলভাবে সংরক্ষিত হয়েছে!',
        });
        setConfig(data.config);
        setIsEditingToken(false);
        setNewTokenInput('');
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'সংরক্ষণ ব্যর্থ হয়েছে।',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'সার্ভার যোগাযোগে সমস্যা হয়েছে।',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    setTesting(true);
    setFeedback(null);

    try {
      const body: any = {
        chatId: chatIdInput.trim(),
      };
      if (isEditingToken && newTokenInput.trim()) {
        body.botToken = newTokenInput.trim();
      }

      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          message: `টেস্ট নোটিফিকেশন সফল! আপনার টেলিগ্রাম অ্যাপে মেসেজ পাঠানো হয়েছে (Message ID: ${data.result?.message_id || 'OK'})।`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'টেস্ট মেসেজ পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে Token ও Chat ID যাচাই করুন।',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'টেলিগ্রাম এপিআই-এর সাথে সংযোগ করা যায়নি।',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCopyChatId = () => {
    navigator.clipboard.writeText(chatIdInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>টেলিগ্রাম ইন্টিগ্রেশন (Telegram Integration)</span>
                <span className="text-[10px] sm:text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                  Bot API
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                নতুন অর্ডার এবং গুরুত্বপূর্ণ এডমিন নোটিফিকেশন সরাসরি টেলিগ্রামে পান
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchConfig}
            disabled={loading}
            className="gap-1.5 text-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </Button>

          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => handleSave()}
            disabled={saving}
            className="gap-1.5 font-bold cursor-pointer shadow-sm"
          >
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন (Save)'}</span>
          </Button>
        </div>
      </div>

      {/* Live Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{feedback.message}</div>
        </div>
      )}

      {/* Connection Overview Banner */}
      <div className="bg-linear-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-amber-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-emerald-300">
                {config.enabled ? 'বট সক্রিয় ও প্রস্তুত (Active & Ready)' : 'নোটিফিকেশন নিষ্ক্রিয় (Disabled)'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Jihan Store Telegram Alert Service
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              যেকোনো গ্রাহক ওয়েবসাইট থেকে নতুন অর্ডার করলে বা ওয়ালেটে ডিপোজিট রিকোয়েস্ট পাঠালে আপনার টেলিগ্রাম আইডিতে তৎক্ষণাৎ স্বয়ংক্রিয় বিস্তারিত মেসেজ চলে যাবে।
            </p>
          </div>

          <Button
            type="button"
            variant="gold"
            size="md"
            onClick={handleTestNotification}
            disabled={testing}
            className="gap-2 font-bold shrink-0 cursor-pointer shadow-md self-start sm:self-auto"
          >
            <Send className={`w-4 h-4 ${testing ? 'animate-bounce' : ''}`} />
            <span>{testing ? 'মেসেজ পাঠানো হচ্ছে...' : 'টেস্ট মেসেজ পাঠান (Send Test)'}</span>
          </Button>
        </div>

        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200">
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">BOT USERNAME</span>
              <span className="font-semibold font-mono text-white">@jihanstoreofficial009bot</span>
            </div>
          </div>

          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">SECURITY</span>
              <span className="font-semibold text-emerald-300">Secure Server Proxy</span>
            </div>
          </div>

          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">TARGET CHAT ID</span>
              <span className="font-semibold font-mono text-white">{config.chatId || 'Not set'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-sm text-slate-900">টেলিগ্রাম বট ও ক্রেডেনশিয়াল সেটিংস</h3>
          </div>
          <span className="text-[11px] text-slate-400">সার্ভার-সাইড এনক্রিপ্টেড</span>
        </div>

        {/* Telegram Bot Token (Securely Masked) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>Telegram Bot API Token</span>
              <span className="text-rose-500">*</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              বটফাদার (@BotFather) থেকে প্রাপ্ত টোকেন
            </span>
          </label>

          {!isEditingToken ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 font-mono text-xs text-slate-700 truncate">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="tracking-wider font-semibold">
                  {config.botTokenMasked || '8192••••••••••••••••••••••••••••••••s44I'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-sans font-bold">
                  সংরক্ষিত (Protected)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingToken(true)}
                className="text-xs font-bold text-blue-900 hover:underline shrink-0 cursor-pointer"
              >
                টোকেন পরিবর্তন করুন (Edit)
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="যেমন: 8192507842:AAGBawQqvEthsDcFmncon3Xr6rLHwb4s44I"
                  value={newTokenInput}
                  onChange={e => setNewTokenInput(e.target.value)}
                  className="flex-1 text-xs font-mono p-2.5 border border-blue-400 rounded-xl bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingToken(false);
                    setNewTokenInput('');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                ⚠️ নতুন টোকেন দিলে সেভ করার পর তা স্বয়ংক্রিয়ভাবে কার্যকর হবে এবং ফ্রন্টএন্ডে মাস্ক হয়ে যাবে।
              </p>
            </div>
          )}
        </div>

        {/* Telegram Chat ID / User ID */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>Telegram User ID / Chat ID</span>
              <span className="text-rose-500">*</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              যে একাউন্টে নোটিফিকেশন যাবে (@userinfobot থেকে প্রাপ্ত)
            </span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="যেমন: 6607631932"
              value={chatIdInput}
              onChange={e => setChatIdInput(e.target.value)}
              className="flex-1 text-xs font-mono font-bold p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyChatId}
              className="gap-1 text-xs cursor-pointer shrink-0"
              title="কপি করুন"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
            </Button>
          </div>
        </div>

        {/* Notification Switches */}
        <div className="space-y-4 pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            নোটিফিকেশন অপশন ও ফিল্টার
          </h4>

          {/* Master Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                টেলিগ্রাম নোটিফিকেশন মাস্টার সুইচ (Master Notification Switch)
              </span>
              <span className="text-[11px] text-slate-500">
                অন থাকলে ওয়েবসাইটে যেকোনো ইভেন্টে টেলিগ্রাম মেসেজ পাঠানো হবে
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabledInput}
                onChange={e => setEnabledInput(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
            </label>
          </div>

          {/* New Order Alert */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                নতুন অর্ডার নোটিফিকেশন (New Order Notification)
              </span>
              <span className="text-[11px] text-slate-500">
                গ্রাহক কোনো অর্ডার কনফার্ম করলে তাৎক্ষণিক গ্রাহকের নাম, ফোন, ঠিকানা ও আইটেমসহ নোটিফিকেশন
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOrderInput}
                onChange={e => setNotifyOrderInput(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Deposit Alert */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                ওয়ালেট ডিপোজিট রিকোয়েস্ট নোটিফিকেশন (Wallet Deposit Alerts)
              </span>
              <span className="text-[11px] text-slate-500">
                বিকাশ/নগদ/রকেটে টাকা জমা দিয়ে ট্রানজেকশন আইডি দিলে নোটিফিকেশন আসবে
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyDepositInput}
                onChange={e => setNotifyDepositInput(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleTestNotification}
            disabled={testing}
            className="w-full sm:w-auto gap-2 text-xs font-bold cursor-pointer"
          >
            <Send className="w-4 h-4 text-blue-900" />
            <span>{testing ? 'টেস্ট হচ্ছে...' : 'টেস্ট মেসেজ পাঠান (Test Telegram)'}</span>
          </Button>

          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={saving}
            className="w-full sm:w-auto gap-2 font-bold cursor-pointer shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস আপডেট করুন (Save Settings)'}</span>
          </Button>
        </div>
      </form>

      {/* Guide Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Info className="w-4 h-4 text-blue-900" />
          <span>টেলিগ্রাম বট ও চ্যাট আইডি সম্পর্কিত নির্দেশনা (Setup Guide)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2">
            <span className="font-bold text-slate-900 block text-xs">১. বট তৈরি ও টোকেন সংগ্রহ</span>
            <p className="text-[11px] leading-relaxed text-slate-500">
              টেলিগ্রামে <strong>@BotFather</strong> সার্চ করুন। এরপর <code>/newbot</code> লিখে বটের নাম ও ইউজারনেম দিন। BotFather আপনাকে একটি <strong>HTTP API Token</strong> প্রদান করবে।
            </p>
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-900 font-bold hover:underline text-[11px] pt-1"
            >
              <span>BotFather ওপেন করুন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2">
            <span className="font-bold text-slate-900 block text-xs">২. Chat ID / User ID সংগ্রহ</span>
            <p className="text-[11px] leading-relaxed text-slate-500">
              টেলিগ্রামে <strong>@userinfobot</strong> ওপেন করে <code>/start</code> দিন। সেখানে আপনার ১০ ডিজিটের <strong>Id</strong> নম্বর দেখতে পাবেন (যেমন: <code>6607631932</code>)।
            </p>
            <a
              href="https://t.me/userinfobot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-900 font-bold hover:underline text-[11px] pt-1"
            >
              <span>Userinfobot ওপেন করুন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-950 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-800 shrink-0" />
          <span>
            <strong>টিপস:</strong> আপনার তৈরি করা বটে টেলিগ্রাম অ্যাপ থেকে অন্তত একবার <code>/start</code> দিয়ে মেসেজ চালু রাখুন, যাতে বট আপনাকে বার্তা পাঠাতে পারে।
          </span>
        </div>
      </div>
    </div>
  );
};
