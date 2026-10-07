'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Key, ShieldCheck, ArrowRight, AlertTriangle, Sparkles, UserCheck, Home } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import { useApp } from '@/app/context/AppContext';

export default function ClientLoginPage() {
  const router = useRouter();
  const { t } = useApp();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const demoCodes = [
    { code: 'AB12', name: 'Dr. Salim Benali (Demo Client)' },
    { code: 'CD34', name: 'Yasmine Mansouri' },
    { code: 'EF56', name: 'Karim Ziane' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: accessCode.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid access code.');
        setLoading(false);
        return;
      }

      router.push('/client');
    } catch (err: any) {
      setErrorMsg('Login failed. Please check connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel rounded-3xl shadow-2xl p-8 space-y-6 relative overflow-hidden">
          
          {/* Top Home Link Button */}
          <div className="flex justify-between items-center pb-2 border-b border-stone-200/60 dark:border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-200 text-xs font-bold transition-all border border-stone-200 dark:border-white/10"
            >
              <Home className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('booking')}</span>
            </Link>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Client Access
            </span>
          </div>

          <div className="text-center space-y-2 relative z-10 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
              <Key className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              {t('clientPortal')}
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Enter your AB12 access code to view clinic schedules and confirm bookings.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                AB12 Access Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AB12"
                value={accessCode}
                onChange={e => setAccessCode(e.target.value.toUpperCase())}
                className="w-full bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-widest text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-stone-400 uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Access Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Quick Access Codes Box */}
          <div className="pt-4 border-t border-stone-200/60 dark:border-white/10 space-y-2 relative z-10">
            <span className="text-[11px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Demo AB12 Access Codes
            </span>
            <div className="grid grid-cols-1 gap-2">
              {demoCodes.map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setAccessCode(item.code)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-slate-800/60 hover:bg-stone-200 dark:hover:bg-slate-800 border border-stone-200 dark:border-white/10 text-xs transition-all text-left group"
                >
                  <div>
                    <span className="font-bold text-stone-800 dark:text-white group-hover:text-emerald-500 block">{item.name}</span>
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Code: {item.code}</span>
                  </div>
                  <UserCheck className="w-4 h-4 text-stone-400 group-hover:text-emerald-500" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
