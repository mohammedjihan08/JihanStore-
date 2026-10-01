import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useStore } from '../../context/StoreContext';
import {
  getAuthErrorMessage,
  ADMIN_EMAIL,
  FIREBASE_PROJECT_ID,
  getCustomerProfile,
  loginWithGoogle
} from '../../services/authService';
import { Button, Input } from '../../components/common/UI';
import { Logo } from '../../components/brand/Logo';
import { Lock, ShieldCheck, ArrowRight, ArrowLeft, Loader2, AlertTriangle, Info, ExternalLink } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { setIsAdminAuthenticated, setIsAdminMode, showToast, setCurrentUser } = useStore();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOpNotAllowed, setIsOpNotAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const verifyAndLoginAdmin = async (user: any) => {
    const profile = await getCustomerProfile(user.uid);
    const isAuthorizedAdmin = user.email === ADMIN_EMAIL || profile?.role === 'admin';

    if (!isAuthorizedAdmin) {
      await signOut(auth);
      setError('এই অ্যাকাউন্টে অ্যাডমিন প্যানেলে প্রবেশের অনুমতি নেই। শুধুমাত্র অনুমোদিত অ্যাডমিন প্রবেশ করতে পারবেন।');
      return false;
    }

    if (profile) {
      setCurrentUser(profile);
    }
    setIsAdminAuthenticated(true);
    showToast('এডমিন প্যানেলে স্বাগতম!');
    return true;
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsOpNotAllowed(false);

    if (!email.trim() || !password) {
      setError('এডমিন ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await verifyAndLoginAdmin(credential.user);
    } catch (err: any) {
      console.error('Admin login error:', err);
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

  const handleGoogleAdminLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const profile = await loginWithGoogle();
      if (auth.currentUser) {
        await verifyAndLoginAdmin(auth.currentUser);
      }
    } catch (err: any) {
      console.error('Admin google login error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(getAuthErrorMessage(err?.code || ''));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo variant="light" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-amber-400 text-xs font-mono font-bold">
            <Lock className="w-3 h-3" />
            <span>ADMIN SECURE PORTAL</span>
          </div>
          <h1 className="text-xl font-black text-white">
            জিহান স্টোর এডমিন লগইন
          </h1>
          <p className="text-xs text-slate-400">
            শুধুমাত্র অনুমোদিত অ্যাডমিন ও স্টাফদের জন্য সংরক্ষিত
          </p>
        </div>

        {/* Operation Not Allowed Guidance Box */}
        {isOpNotAllowed && (
          <div className="p-4 bg-amber-950/60 border border-amber-800 text-amber-200 text-xs rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Info className="w-4 h-4 text-amber-400" />
              <span>ইমেইল/পাসওয়ার্ড চালু করার নির্দেশনা:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-300">
              ডিফল্টভাবে Firebase প্রকল্পে Google লগইন সক্রিয় থাকে। ইমেইল/পাসওয়ার্ড দিয়ে এডমিন লগইন করতে নিচের লিংকে ক্লিক করে <strong>Email/Password</strong> পদ্ধতিটি <strong>Enable</strong> করুন:
            </p>
            <a
              href={`https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/providers`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-amber-950 bg-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-300 transition-colors text-xs"
            >
              <span>Firebase Console খুলুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[11px] text-amber-400 pt-1">
              অথবা নিচে সরাসরি <strong>Google দিয়ে এডমিন সাইন ইন</strong> করতে পারেন।
            </p>
          </div>
        )}

        {error && !isOpNotAllowed && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Google Sign In for Admin */}
        <button
          type="button"
          onClick={handleGoogleAdminLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors border border-slate-700 shadow-2xs cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>যাচাই করা হচ্ছে...</span>
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
              <span>Google দিয়ে এডমিন লগইন</span>
            </>
          )}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-slate-500 text-[11px] font-mono uppercase absolute">
            অথবা ইমেইল দিয়ে
          </span>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
          <Input
            label="এডমিন ইমেইল (Admin Email)"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading || googleLoading}
            className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800"
            required
          />

          <Input
            label="এডমিন পাসওয়ার্ড (Password)"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading || googleLoading}
            className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800"
            required
          />

          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            disabled={loading || googleLoading}
            className="gap-2 font-bold shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>এডমিন প্যানেলে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => setIsAdminMode(false)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>গ্রাহক ওয়েবসাইটে ফিরে যান</span>
          </button>
        </div>
      </div>
    </div>
  );
};
