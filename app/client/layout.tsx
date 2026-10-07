'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar, Bookmark, LogOut, User, ShieldAlert } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Client } from '@/lib/types';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/client/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    fetch('/api/auth/client/me')
      .then(res => res.json())
      .then(data => {
        if (!data.client) {
          router.push('/client/login');
        } else {
          setClient(data.client);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/client/login');
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        {children}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center animate-spin mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-400">Verifying Client Portal Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Sub Header for Client */}
      {client && (
        <div className="bg-slate-900/60 border-b border-slate-800 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">{client.name}</span>
                <span className="text-[11px] font-mono text-emerald-400">
                  Access Code: {client.accessCode}
                </span>
              </div>
            </div>

            <nav className="flex items-center space-x-2">
              <Link
                href="/client"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pathname === '/client' || pathname === '/client/calendar'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                Book Resource
              </Link>

              <Link
                href="/client/bookings"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pathname === '/client/bookings'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 inline mr-1.5" />
                My Bookings
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
