import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/UI';
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
  Info,
  ArrowRight,
  Repeat
} from 'lucide-react';

interface BotViewConfig {
  id: 'bot1' | 'bot2';
  name: string;
  botTokenMasked: string;
  chatId: string;
  isActive: boolean;
  username: string;
  configured: boolean;
}

interface DualTelegramServerConfig {
  enabled: boolean;
  notifyOnNewOrder: boolean;
  notifyOnDeposit: boolean;
  lastUsedBot: 'bot1' | 'bot2';
  nextBot: 'bot1' | 'bot2';
  totalOrdersRotated: number;
  bot1: BotViewConfig;
  bot2: BotViewConfig;
}

export const AdminTelegramPage: React.FC = () => {
  const [config, setConfig] = useState<DualTelegramServerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingBot, setTestingBot] = useState<'bot1' | 'bot2' | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit fields for Bot 1
  const [bot1Active, setBot1Active] = useState(true);
  const [bot1ChatId, setBot1ChatId] = useState('');
  const [bot1IsEditingToken, setBot1IsEditingToken] = useState(false);
  const [bot1NewToken, setBot1NewToken] = useState('');

  // Edit fields for Bot 2
  const [bot2Active, setBot2Active] = useState(true);
  const [bot2ChatId, setBot2ChatId] = useState('');
  const [bot2IsEditingToken, setBot2IsEditingToken] = useState(false);
  const [bot2NewToken, setBot2NewToken] = useState('');

  // Global settings
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyDeposit, setNotifyDeposit] = useState(true);

  const [copiedBot1, setCopiedBot1] = useState(false);
  const [copiedBot2, setCopiedBot2] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/telegram/config');
      if (res.ok) {
        const data: DualTelegramServerConfig = await res.json();
        setConfig(data);
        setMasterEnabled(data.enabled);
        setNotifyOrder(data.notifyOnNewOrder);
        setNotifyDeposit(data.notifyOnDeposit);

        setBot1Active(data.bot1.isActive);
        setBot1ChatId(data.bot1.chatId);

        setBot2Active(data.bot2.isActive);
        setBot2ChatId(data.bot2.chatId);
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
        enabled: masterEnabled,
        notifyOnNewOrder: notifyOrder,
        notifyOnDeposit: notifyDeposit,
        bot1: {
          isActive: bot1Active,
          chatId: bot1ChatId.trim(),
        },
        bot2: {
          isActive: bot2Active,
          chatId: bot2ChatId.trim(),
        },
      };

      if (bot1IsEditingToken && bot1NewToken.trim()) {
        body.bot1.botToken = bot1NewToken.trim();
      }
      if (bot2IsEditingToken && bot2NewToken.trim()) {
        body.bot2.botToken = bot2NewToken.trim();
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
          message: data.message || 'উভয় টেলিগ্রাম বটের কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!',
        });
        setBot1IsEditingToken(false);
        setBot1NewToken('');
        setBot2IsEditingToken(false);
        setBot2NewToken('');
        fetchConfig();
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestBot = async (targetBot: 'bot1' | 'bot2') => {
    setTestingBot(targetBot);
    setFeedback(null);

    try {
      const body: any = {
        targetBot,
        chatId: (targetBot === 'bot1' ? bot1ChatId : bot2ChatId).trim(),
      };

      const tokenEdit = targetBot === 'bot1' ? bot1NewToken : bot2NewToken;
      if (tokenEdit.trim()) {
        body.botToken = tokenEdit.trim();
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
          message: `টেস্ট সফল! ${data.bot || targetBot} থেকে মেসেজ পাঠানো হয়েছে (Message ID: ${data.result?.message_id || 'OK'})।`,
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || `${targetBot}-এ মেসেজ পাঠাতে ব্যর্থ হয়েছে।`,
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'টেলিগ্রাম এপিআই সংযোগে ব্যর্থ।',
      });
    } finally {
      setTestingBot(null);
    }
  };

  const copyToClipboard = (text: string, isBot1: boolean) => {
    navigator.clipboard.writeText(text);
    if (isBot1) {
      setCopiedBot1(true);
      setTimeout(() => setCopiedBot1(false), 2000);
    } else {
      setCopiedBot2(true);
      setTimeout(() => setCopiedBot2(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>টেলিগ্রাম ২-বট পালাক্রম রোটেশন (Telegram 2-Bot Rotation)</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                ১ম অর্ডার Bot 1 ➔ ২য় অর্ডার Bot 2 ➔ ৩য় অর্ডার Bot 1 (ধারাবাহিকভাবে)
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

      {/* 2-Bot Rotation Pipeline Banner */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-amber-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-emerald-300">
                পালাক্রম মোড সক্রিয় (Round-Robin Order Routing Active)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              সার্ভার-সাইড ২-বট অর্ডার ডিসপ্যাচ
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              একটি অর্ডার কখনো একই সাথে দুইটি Bot-এ পাঠানো হয় না। ১ম অর্ডার Bot 1-এ, ২য় অর্ডার Bot 2-এ, ৩য় অর্ডার Bot 1-এ ধারাবাহিকভাবে যাবে। কোনো Bot বন্ধ থাকলে অন্য সক্রিয় Bot-এ স্বয়ংক্রিয় ব্যাকআপ যাবে।
            </p>
          </div>

          {/* Active Next Indicator */}
          <div className="bg-white/10 border border-white/20 p-3.5 rounded-xl shrink-0 text-center sm:text-right space-y-1">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-mono font-bold">
              পরবর্তী অর্ডার যাবে (Next Dispatch)
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{config?.nextBot === 'bot2' ? 'Bot 2 (Rotation)' : 'Bot 1 (Primary)'}</span>
            </div>
            <div className="text-[10px] text-slate-400 block pt-0.5">
              মোট রোটেশন: <strong className="text-white font-mono">{config?.totalOrdersRotated || 0}</strong> টি
            </div>
          </div>
        </div>

        {/* Visual Rotation Flow Diagram */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
            <span className="text-[10px] text-amber-400 font-mono font-bold block">১ম অর্ডার</span>
            <span className="font-bold text-white">Bot 1</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
            <span className="text-[10px] text-emerald-400 font-mono font-bold block">২য় অর্ডার</span>
            <span className="font-bold text-white">Bot 2</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
            <span className="text-[10px] text-amber-400 font-mono font-bold block">৩য় অর্ডার</span>
            <span className="font-bold text-white">Bot 1</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
            <span className="text-[10px] text-emerald-400 font-mono font-bold block">৪র্থ অর্ডার</span>
            <span className="font-bold text-white">Bot 2</span>
          </div>
        </div>
      </div>

      {/* Two Bots Management Cards (Side by Side or Stacked) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BOT 1 CARD */}
        <div className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-5 transition-all ${bot1Active ? 'border-blue-200' : 'border-slate-200 opacity-80'}`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs font-mono">
                B1
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Bot 1 (Primary)</h3>
                <span className="text-[10px] font-mono text-slate-400">@jihanstoreofficial009bot</span>
              </div>
            </div>

            {/* Bot 1 Active Toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bot1Active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                {bot1Active ? 'Active' : 'Offline / Inactive'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bot1Active}
                  onChange={e => setBot1Active(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-900"></div>
              </label>
            </div>
          </div>

          {/* Bot 1 Token */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Bot 1 API Token</span>
              <span className="text-[10px] text-slate-400">Server Protected</span>
            </label>

            {!bot1IsEditingToken ? (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-700 truncate">
                  <Lock className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                  <span className="tracking-wider">{config?.bot1.botTokenMasked || '8192••••s44I'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBot1IsEditingToken(true)}
                  className="text-xs font-bold text-blue-900 hover:underline shrink-0 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Bot 1 Token দিন"
                  value={bot1NewToken}
                  onChange={e => setBot1NewToken(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-blue-400 rounded-lg bg-blue-50/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    setBot1IsEditingToken(false);
                    setBot1NewToken('');
                  }}
                  className="text-[11px] text-slate-500 hover:underline cursor-pointer"
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </div>

          {/* Bot 1 Chat ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Bot 1 User / Chat ID</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="যেমন: 6607631932"
                value={bot1ChatId}
                onChange={e => setBot1ChatId(e.target.value)}
                className="flex-1 text-xs font-mono font-bold p-2 border border-slate-300 rounded-lg bg-slate-50"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bot1ChatId, true)}
                className="text-xs cursor-pointer shrink-0"
              >
                {copiedBot1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {/* Bot 1 Test Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">সংযোগ পরীক্ষা করুন:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleTestBot('bot1')}
              disabled={testingBot === 'bot1' || !bot1Active}
              className="gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${testingBot === 'bot1' ? 'animate-bounce' : ''}`} />
              <span>{testingBot === 'bot1' ? 'টেস্ট হচ্ছে...' : 'Test Bot 1'}</span>
            </Button>
          </div>
        </div>

        {/* BOT 2 CARD */}
        <div className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-5 transition-all ${bot2Active ? 'border-emerald-200' : 'border-slate-200 opacity-80'}`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs font-mono">
                B2
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Bot 2 (Rotation)</h3>
                <span className="text-[10px] font-mono text-slate-400">@jihanstore009bot</span>
              </div>
            </div>

            {/* Bot 2 Active Toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bot2Active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                {bot2Active ? 'Active' : 'Offline / Inactive'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bot2Active}
                  onChange={e => setBot2Active(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Bot 2 Token */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Bot 2 API Token</span>
              <span className="text-[10px] text-slate-400">Server Protected</span>
            </label>

            {!bot2IsEditingToken ? (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-700 truncate">
                  <Lock className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span className="tracking-wider">{config?.bot2.botTokenMasked || '8627••••60k'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBot2IsEditingToken(true)}
                  className="text-xs font-bold text-blue-900 hover:underline shrink-0 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Bot 2 Token দিন"
                  value={bot2NewToken}
                  onChange={e => setBot2NewToken(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-emerald-400 rounded-lg bg-emerald-50/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    setBot2IsEditingToken(false);
                    setBot2NewToken('');
                  }}
                  className="text-[11px] text-slate-500 hover:underline cursor-pointer"
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </div>

          {/* Bot 2 Chat ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Bot 2 User / Chat ID</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="যেমন: 6607631932"
                value={bot2ChatId}
                onChange={e => setBot2ChatId(e.target.value)}
                className="flex-1 text-xs font-mono font-bold p-2 border border-slate-300 rounded-lg bg-slate-50"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bot2ChatId, false)}
                className="text-xs cursor-pointer shrink-0"
              >
                {copiedBot2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          {/* Bot 2 Test Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">সংযোগ পরীক্ষা করুন:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleTestBot('bot2')}
              disabled={testingBot === 'bot2' || !bot2Active}
              className="gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${testingBot === 'bot2' ? 'animate-bounce' : ''}`} />
              <span>{testingBot === 'bot2' ? 'টেস্ট হচ্ছে...' : 'Test Bot 2'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Global Notification Controls & Master Switches */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          গ্লোবাল নোটিফিকেশন পলিসি (Master Settings)
        </h4>

        {/* Master Switch */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              টেলিগ্রাম নোটিফিকেশন মাস্টার সুইচ (Master Switch)
            </span>
            <span className="text-[11px] text-slate-500">
              অন থাকলে ওয়েবসাইটে নতুন অর্ডার আসলে স্বয়ংক্রিয়ভাবে বট ১ ও ২ পালাক্রমে নোটিফিকেশন পাঠাবে
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={masterEnabled}
              onChange={e => setMasterEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
          </label>
        </div>

        {/* New Order Switch */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              নতুন অর্ডার রোটেশন নোটিফিকেশন (New Order Alerts)
            </span>
            <span className="text-[11px] text-slate-500">
              প্রতিটি নতুন অর্ডারে পালাক্রমে Bot 1 ➔ Bot 2 ➔ Bot 1 নোটিফিকেশন প্রেরণ
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifyOrder}
              onChange={e => setNotifyOrder(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Deposit Switch */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              ওয়ালেট ডিপোজিট রিকোয়েস্ট নোটিফিকেশন (Wallet Alerts)
            </span>
            <span className="text-[11px] text-slate-500">
              গ্রাহক বিকাশ/নগদে ডিপোজিট রিকোয়েস্ট পাঠালে সক্রিয় বটে নোটিফিকেশন
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifyDeposit}
              onChange={e => setNotifyDeposit(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Save button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={saving}
            className="w-full sm:w-auto gap-2 font-bold cursor-pointer shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ ও আপডেট করুন (Save All)'}</span>
          </Button>
        </div>
      </form>

      {/* Failover & Safety Rules Note */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>২-বট রোটেশন ও ফেইলওভার সুরক্ষার নিয়মাবলী (Failover & Duplicate Protection):</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-800 leading-relaxed">
          <li><strong>ডুপ্লিকেট প্রতিরোধ:</strong> একটি অর্ডার শুধুমাত্র নির্ধারিত একটি Bot-এ পাঠানো হবে। কখনোই একটি অর্ডার একই সাথে দুটি বটে যাবে না।</li>
          <li><strong>অফলাইন ফেইলওভার:</strong> কোনো একটি Bot যদি অফলাইন থাকে বা Inactive করা থাকে, তাহলে সেই অর্ডার স্বয়ংক্রিয়ভাবে অন্য Active Bot-এ চলে যাবে।</li>
          <li><strong>নিরাপত্তা:</strong> কোনো বট টোকেন ফ্রন্টএন্ড সোর্সে উন্মুক্ত থাকে না; সবকিছু সার্ভার-সাইডে সুরক্ষিত থাকে।</li>
        </ul>
      </div>
    </div>
  );
};
