import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { resetCustomerPassword, getAuthErrorMessage } from '../../services/authService';
import { Button, Input } from '../../components/common/UI';
import { Logo } from '../../components/brand/Logo';
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { setCurrentRoute } = useStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('দয়া করে সঠিক ইমেইল এড্রেস লিখুন।');
      return;
    }

    setLoading(true);
    try {
      await resetCustomerPassword(email.trim());
      setSubmitted(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      const msg = getAuthErrorMessage(err?.code || '');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo variant="compact" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 pt-2">
            পাসওয়ার্ড পুনরুদ্ধার
          </h1>
          <p className="text-xs text-slate-500">
            আপনার নিবন্ধিত ইমেইল ঠিকানা প্রদান করলে অফিসিয়াল Firebase পাসওয়ার্ড রিসেট লিংক পাঠানো হবে
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900">ইমেইল পাঠানো সম্পন্ন হয়েছে!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900">{email}</strong> ঠিকানায় পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে। দয়া করে আপনার ইনবক্স অথবা স্প্যাম (Spam) ফোল্ডার চেক করুন।
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentRoute('login')}
              fullWidth
            >
              লগইন পেজে ফিরে যান
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="নিবন্ধিত ইমেইল এড্রেস (Registered Email)*"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>লিংক পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>পাসওয়ার্ড রিসেট লিংক পাঠান</span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setCurrentRoute('login')}
              className="w-full text-center text-xs text-slate-500 hover:text-blue-900 flex items-center justify-center gap-1 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>লগইন স্ক্রিনে ফিরে যান</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
