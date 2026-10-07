'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, Shield, LogOut, Sun, Moon, Globe, Bell, CheckCircle2, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, theme, setTheme, adminUser, setAdminUser, t, notifications } = useApp();
  const [student, setStudent] = useState<{ id: string; name: string; accessCode: string } | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetch('/api/auth/student/me')
      .then(res => res.json())
      .then(data => {
        if (data.student) {
          setStudent(data.student);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleStudentLogout = async () => {
    await fetch('/api/auth/student/logout', { method: 'POST' });
    setStudent(null);
    router.push('/student/login');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    router.push('/admin/login');
  };

  const isAdmin = pathname?.startsWith('/admin');
  const isStudent = pathname?.startsWith('/student');

  return (
    <header dir="rtl" className="sticky top-0 z-40 bg-[#FAF6F0]/95 dark:bg-[#1a140e]/95 backdrop-blur-md border-b border-[#E8E0D5] dark:border-[#5C4732]/40 shadow-xs font-[family-name:var(--font-cairo)] text-[#3D2E1E] dark:text-[#FAF6F0] transition-colors">
      
      {/* ── Top Announcement Bar ── */}
      <div className="bg-[#F5EFE6] dark:bg-[#231b13] border-b border-[#E8E0D5] dark:border-[#5C4732]/30 py-2 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 font-bold text-[#8B5E3C] dark:text-[#D4A359]">
            <span>✨</span>
            <span>أكاديمية M Décoration — بوابة الدروس والاختبارات التفاعلية للطلاب والمشرفين</span>
            <span>✨</span>
          </div>

          <div className="flex items-center gap-4 text-[#765C43] dark:text-[#d4c5b3] font-medium text-[11px]">
            <span>📍 الجزائر 🇩🇿 — التوصيل متوفر لـ 58 ولاية</span>
            <a href="tel:0793725621" className="hover:text-[#5C4732] dark:hover:text-white font-semibold flex items-center gap-1 dir-ltr">
              <span>0793 725 621</span>
              <Phone className="w-3 h-3 text-[#8B5E3C]" />
            </a>
          </div>

        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand: Academy Portal */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5C4732] to-[#8B5E3C] text-white font-extrabold flex items-center justify-center text-xl shadow-md shadow-[#5C4732]/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#3D2E1E] dark:text-white">
                M Academy
              </span>
              <span className="block text-[10px] text-[#8B5E3C] dark:text-[#D4A359] font-semibold">
                منصة التعليم والتطوير
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#5C4732] dark:text-[#d4c5b3]">
            <Link href="/" className="hover:text-[#8B5E3C] dark:hover:text-white transition-colors">الرئيسية</Link>
            <Link href="/#products" className="hover:text-[#8B5E3C] dark:hover:text-white transition-colors">كوتالوج الدورات</Link>
            <Link href="/student/login" className="hover:text-[#8B5E3C] dark:hover:text-white transition-colors">بوابة الطالب</Link>
            <Link href="/admin" className="hover:text-[#8B5E3C] dark:hover:text-white transition-colors">لوحة الإدارة</Link>
          </nav>

          {/* Controls: Language, Theme, Auth Badges */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Student & Admin Portal Quick Jump Buttons */}
            {!isStudent && (
              <Link
                href="/student/login"
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all hidden sm:flex items-center gap-1.5"
              >
                <span>دخول الطالب</span>
              </Link>
            )}

            {!isAdmin && (
              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-xl bg-[#5C4732] hover:bg-[#4A3826] text-white font-bold text-xs shadow-md transition-all hidden sm:flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>لوحة الإدارة</span>
              </Link>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-xl bg-[#F5EFE6] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 text-[#5C4732] dark:text-[#d4c5b3] text-xs font-bold transition-all flex items-center gap-1.5"
                title={t('switchLanguage')}
              >
                <Globe className="w-4 h-4 text-[#8B5E3C]" />
                <span className="uppercase tracking-wider font-extrabold">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute left-0 mt-2 w-36 bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-2xl shadow-2xl py-1.5 z-50 text-xs font-semibold">
                  <button
                    onClick={() => { setLanguage('ar'); setShowLangMenu(false); }}
                    className={`w-full text-right px-4 py-2 hover:bg-[#FAF6F0] dark:hover:bg-[#1a140e] flex items-center justify-between ${language === 'ar' ? 'text-[#8B5E3C] font-bold' : 'text-[#3D2E1E] dark:text-[#d4c5b3]'}`}
                  >
                    <span>العربية</span>
                    {language === 'ar' && <CheckCircle2 className="w-4 h-4 text-[#8B5E3C]" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                    className={`w-full text-right px-4 py-2 hover:bg-[#FAF6F0] dark:hover:bg-[#1a140e] flex items-center justify-between ${language === 'en' ? 'text-[#8B5E3C] font-bold' : 'text-[#3D2E1E] dark:text-[#d4c5b3]'}`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#8B5E3C]" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('fr'); setShowLangMenu(false); }}
                    className={`w-full text-right px-4 py-2 hover:bg-[#FAF6F0] dark:hover:bg-[#1a140e] flex items-center justify-between ${language === 'fr' ? 'text-[#8B5E3C] font-bold' : 'text-[#3D2E1E] dark:text-[#d4c5b3]'}`}
                  >
                    <span>Français</span>
                    {language === 'fr' && <CheckCircle2 className="w-4 h-4 text-[#8B5E3C]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Mode */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-[#F5EFE6] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 text-[#5C4732] dark:text-[#d4c5b3] transition-all"
              title={t('toggleTheme')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#5C4732]" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-[#F5EFE6] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/40 text-[#5C4732] dark:text-[#d4c5b3] transition-all relative"
                title={t('notifications')}
              >
                <Bell className="w-4 h-4 text-[#8B5E3C]" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-2xl shadow-2xl p-4 z-50 text-xs">
                  <div className="font-bold border-b border-[#E8E0D5] dark:border-[#5C4732]/30 pb-2 mb-2 flex items-center justify-between text-[#3D2E1E] dark:text-white">
                    <span>{t('notifications')}</span>
                    <span className="text-[10px] text-[#765C43]">{notifications.length} new</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center text-[#765C43]">No new notifications</div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {notifications.map((n, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#1a140e] border border-[#E8E0D5] dark:border-[#5C4732]/30 text-[#3D2E1E] dark:text-[#d4c5b3] font-medium">
                          {n}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Profile & Logout */}
            {adminUser && isAdmin && (
              <div className="flex items-center gap-2 bg-[#5C4732]/10 border border-[#5C4732]/30 px-3 py-1.5 rounded-xl">
                <Shield className="w-4 h-4 text-[#8B5E3C]" />
                <span className="text-xs font-bold text-[#5C4732] dark:text-[#D4A359]">
                  {adminUser.name}
                </span>
                <button
                  onClick={handleAdminLogout}
                  className="text-stone-400 hover:text-rose-500 mr-1 transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Student Profile & Logout */}
            {student && isStudent && (
              <button
                onClick={handleStudentLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{student.name}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
