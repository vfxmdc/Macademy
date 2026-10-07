'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, GraduationCap, ArrowRight, AlertTriangle, Phone } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import { useApp } from '@/app/context/AppContext';

export default function StudentLoginPage() {
  const router = useRouter();
  const { t } = useApp();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid student access code.');
        setLoading(false);
        return;
      }

      router.push('/student');
    } catch (err: any) {
      setErrorMsg('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const quickCodes = [
    { code: 'ABCD-9281', name: 'John Miller' },
    { code: 'POFH-8572', name: 'Fatima Zahra' },
    { code: 'XA98-1042', name: 'Mohammed Anis' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF6F0] dark:bg-[#1a140e] text-[#3D2E1E] dark:text-[#FAF6F0] flex flex-col font-[family-name:var(--font-cairo)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#5C4732] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#5C4732]/20">
              <GraduationCap className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-black text-[#3D2E1E] dark:text-white">بوابة الطلاب — M Academy</h1>
            <p className="text-xs text-[#765C43] dark:text-[#d4c5b3]">
              أدخل رمز الدخول الخاص بك للوصول إلى دروسك، روابط Google Drive، واجراء الامتحانات.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#5C4732] dark:text-[#D4A359] mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span>رمز الدخول (Access Code)</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: ABCD-9281"
                value={accessCode}
                onChange={e => setAccessCode(e.target.value.toUpperCase())}
                className="w-full bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-xl px-4 py-3 text-sm text-[#8B5E3C] dark:text-[#D4A359] font-mono font-extrabold tracking-wider uppercase focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#5C4732] hover:from-[#744C2E] hover:to-[#4A3826] text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'جاري التحقق...' : 'دخول بوابة الطالب'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </form>

          {/* Quick Demo Launcher */}
          <div className="pt-4 border-t border-[#E8E0D5] dark:border-[#5C4732]/30 space-y-2">
            <span className="text-[11px] font-bold text-[#765C43] dark:text-[#d4c5b3] block">جرب أحد الرموز التالية:</span>
            <div className="flex flex-wrap gap-2">
              {quickCodes.map(qc => (
                <button
                  key={qc.code}
                  onClick={() => setAccessCode(qc.code)}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF6F0] dark:bg-[#1a140e] text-[#8B5E3C] dark:text-[#D4A359] font-mono text-xs font-bold border border-[#E8E0D5] dark:border-[#5C4732]/40 hover:border-[#8B5E3C]"
                >
                  {qc.code} ({qc.name})
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
