import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { registerCustomer, loginWithGoogle, getAuthErrorMessage, FIREBASE_PROJECT_ID } from '../../services/authService';
import { Button, Input, Textarea } from '../../components/common/UI';
import { Logo } from '../../components/brand/Logo';
import { ArrowRight, Eye, EyeOff, Loader2, Info, ExternalLink } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const {
    setCurrentRoute,
    setCurrentUser,
    showToast,
    postLoginRedirectRoute,
    setPostLoginRedirectRoute
  } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isOpNotAllowed, setIsOpNotAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handlePostAuthSuccess = (profile: any) => {
    setCurrentUser(profile);
    showToast('আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');

    if (postLoginRedirectRoute) {
      const target = postLoginRedirectRoute;
      setPostLoginRedirectRoute(null);
      setCurrentRoute(target);
    } else {
      setCurrentRoute('account');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsOpNotAllowed(false);

    // Validation
    if (!name.trim()) {
      setError('আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('সঠিক ইমেইল এড্রেস লিখুন।');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 018XXXXXXXX)।');
      return;
    }
    if (password.length < 6) {
      setError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (password !== confirmPassword) {
      setError('পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।');
      return;
    }

    setLoading(true);
    try {
      const profile = await registerCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        address: address.trim()
      });
      handlePostAuthSuccess(profile);
    } catch (err: any) {
      console.error('Registration error:', err);
      const code = err?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setIsOpNotAllowed(true);
      }
      const msg = getAuthErrorMessage(code);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const profile = await loginWithGoogle();
      handlePostAuthSuccess(profile);
    } catch (err: any) {
      console.error('Google sign up error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(getAuthErrorMessage(err?.code || ''));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo variant="compact" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 pt-2">
            নতুন একাউন্ট নিবন্ধন করুন
          </h1>
          <p className="text-xs text-slate-500">
            জিহান স্টোরে যুক্ত হয়ে সহজ শপিং ও কাস্টমার ওয়ালেট উপভোগ করুন
          </p>
        </div>

        {postLoginRedirectRoute === 'checkout' && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              অর্ডার সম্পন্ন করতে অ্যাকাউন্ট তৈরি করুন। আপনার কার্টের পণ্য অক্ষুণ্ণ থাকবে।
            </p>
          </div>
        )}

        {/* Operation Not Allowed Guidance Box */}
        {isOpNotAllowed && (
          <div className="p-4 bg-amber-50 border border-amber-300 text-amber-950 text-xs rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Info className="w-4 h-4 text-amber-700" />
              <span>ইমেইল/পাসওয়ার্ড চালু করার নির্দেশনা:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-900">
              ডিফল্টভাবে Firebase প্রকল্পে Google লগইন সক্রিয় থাকে। ইমেইল/পাসওয়ার্ড দিয়ে নিবন্ধন করতে নিচের লিংকে ক্লিক করে <strong>Email/Password</strong> পদ্ধতিটি <strong>Enable</strong> করুন:
            </p>
            <a
              href={`https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/providers`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-amber-300 hover:bg-blue-50 transition-colors text-xs"
            >
              <span>Firebase Console খুলুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[11px] text-amber-800 pt-1">
              অথবা কোনো কনসোল সেটআপ ছাড়াই নিচে সরাসরি <strong>Google দিয়ে সাইন আপ</strong> করতে পারেন।
            </p>
          </div>
        )}

        {error && !isOpNotAllowed && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* 1-Click Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
              <span>Google সাইন আপ হচ্ছে...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google দিয়ে ১-ক্লিকে একাউন্ট খুলুন</span>
            </>
          )}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-slate-400 text-[11px] font-medium uppercase font-mono absolute">
            অথবা ফর্ম পূরণ করুন
          </span>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            label="আপনার পূর্ণ নাম (Full Name)*"
            placeholder="যেমন: তানভীর রহমান"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading || googleLoading}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="ইমেইল (Email Address)*"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading || googleLoading}
              required
            />
            <Input
              label="মোবাইল নম্বর (Phone Number)*"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={loading || googleLoading}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">পাসওয়ার্ড (Password)*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading || googleLoading}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:opacity-60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Input
              label="পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)*"
              type={showPassword ? 'text' : 'password'}
              placeholder="একই পাসওয়ার্ড লিখুন"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading || googleLoading}
              required
            />
          </div>

          <Textarea
            label="ডেলিভারি ঠিকানা (Full Address - Optional)"
            placeholder="বাসা, রোড ও এলাকা..."
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={loading || googleLoading}
            rows={2}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={loading || googleLoading}
            className="gap-2 font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>নিবন্ধন হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>একাউন্ট তৈরি করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>ইতিমধ্যে একাউন্ট আছে? </span>
          <button
            onClick={() => setCurrentRoute('login')}
            className="text-blue-900 font-bold hover:underline"
          >
            লগইন করুন
          </button>
        </div>
      </div>
    </div>
  );
};
