'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, AlertTriangle, Home, Loader2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import Navbar from '@/app/components/Navbar';

interface AdminOption { id: string; name: string; isSuperAdmin: boolean; }

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminUser, t } = useApp();

  const [admins, setAdmins] = useState<AdminOption[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load admin list (names only, no codes)
  useEffect(() => {
    fetch('/api/admins')
      .then(r => r.json())
      .then((data: AdminOption[]) => {
        setAdmins(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .finally(() => setLoadingAdmins(false));
  }, []);

  const selectedAdmin = admins.find(a => a.id === selectedId);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedAdmin?.name, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid credentials.');
        return;
      }
      setAdminUser(data);
      router.push('/admin');
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF6F0] dark:bg-[#1a140e] text-[#3D2E1E] dark:text-[#FAF6F0] flex flex-col transition-colors font-[family-name:var(--font-cairo)]">
      <Navbar />

      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl shadow-2xl p-8 space-y-6 relative overflow-hidden">

          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8B5E3C]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header row */}
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E0D5] dark:border-[#5C4732]/30">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#1a140e] hover:bg-[#E8E0D5] dark:hover:bg-[#5C4732]/20 text-[#5C4732] dark:text-[#d4c5b3] text-xs font-bold transition-all border border-[#E8E0D5] dark:border-[#5C4732]/30"
            >
              <Home className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>الرئيسية</span>
            </Link>
            <span className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest">
              Admin Access
            </span>
          </div>

          {/* Icon + title */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5C4732] to-[#8B5E3C] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#5C4732]/30">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-[#3D2E1E] dark:text-white">
              {t('adminLoginTitle')}
            </h1>
            <p className="text-xs text-[#765C43] dark:text-[#d4c5b3]">
              {t('adminLoginDesc')}
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Admin selector */}
            <div>
              <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-2">
                {t('adminName')}
              </label>
              {loadingAdmins ? (
                <div className="flex items-center gap-2 text-sm text-[#765C43] dark:text-[#d4c5b3] p-3">
                  <Loader2 className="w-4 h-4 animate-spin" /> جارٍ التحميل…
                </div>
              ) : (
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-3 text-sm text-[#3D2E1E] dark:text-white font-semibold focus:ring-2 focus:ring-[#8B5E3C] focus:outline-none"
                >
                  {admins.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name}{a.isSuperAdmin ? ' ⭐' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Code input */}
            <div>
              <label className="block text-xs font-bold text-[#5C4732] dark:text-[#D4A359] uppercase tracking-wider mb-2">
                {t('adminCode')}
              </label>
              <div className="relative">
                <input
                  id="admin-code-input"
                  type={showCode ? 'text' : 'password'}
                  required
                  placeholder="••••"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-3 pr-12 text-center text-lg font-mono font-bold text-[#8B5E3C] dark:text-[#D4A359] tracking-widest focus:ring-2 focus:ring-[#8B5E3C] focus:outline-none"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowCode(v => !v)}
                  className="absolute inset-y-0 left-3 flex items-center text-[#8B5E3C]/60 hover:text-[#8B5E3C]"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loadingAdmins}
              id="admin-login-btn"
              className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-[#5C4732] hover:bg-[#4A3826] disabled:opacity-60 text-white shadow-xl shadow-[#5C4732]/20 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>جارٍ التحقق…</span></>
              ) : (
                <><span>{t('login')}</span><ArrowRight className="w-4 h-4 rotate-180" /></>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
