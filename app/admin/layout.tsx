'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Users, Award, FileSpreadsheet, Shield, UserCheck, LogOut } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import { useApp } from '@/app/context/AppContext';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, setAdminUser, t } = useApp();

  // Redirect to login if not authenticated (except on the login page itself)
  useEffect(() => {
    if (pathname !== '/admin/login' && !adminUser) {
      router.replace('/admin/login');
    }
  }, [adminUser, pathname, router]);

  const handleLogout = () => {
    setAdminUser(null);
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'الدورات والمنتجات', href: '/admin', icon: BookOpen },
    { name: 'إدارة الطلاب والنسب', href: '/admin/students', icon: Users },
    { name: 'إعداد الامتحانات', href: '/admin/quizzes', icon: Award },
    { name: 'نتائج الاختبارات', href: '/admin/results', icon: FileSpreadsheet },
  ];

  // Super-admin-only tab
  const superAdminItems = [
    { name: 'إدارة المسؤولين', href: '/admin/admins', icon: UserCheck },
  ];

  // Don't render the dashboard chrome on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF6F0] dark:bg-[#1a140e] text-[#3D2E1E] dark:text-[#FAF6F0] flex flex-col font-[family-name:var(--font-cairo)]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">

        {/* Admin Navigation Bar */}
        <div className="bg-white dark:bg-[#231b13] border border-[#E8E0D5] dark:border-[#5C4732]/40 rounded-3xl p-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Brand + current admin */}
            <div className="flex items-center gap-2 px-3 py-1">
              <Shield className="w-5 h-5 text-[#8B5E3C]" />
              <div>
                <span className="font-extrabold text-sm text-[#3D2E1E] dark:text-white block leading-tight">
                  لوحة تحكم المشرف
                </span>
                {adminUser && (
                  <span className="text-[10px] text-[#8B5E3C] dark:text-[#D4A359] font-semibold">
                    {adminUser.name}
                    {adminUser.isSuperAdmin && <span className="mr-1 text-[8px] bg-[#8B5E3C] text-white px-1.5 py-0.5 rounded-full uppercase">Super</span>}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Regular nav tabs */}
              {navItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${isActive
                      ? 'bg-[#5C4732] text-white shadow-md'
                      : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#5C4732] dark:text-[#d4c5b3] hover:border-[#8B5E3C] border border-[#E8E0D5] dark:border-[#5C4732]/30'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Super-admin-only tabs */}
              {adminUser?.isSuperAdmin && superAdminItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${isActive
                      ? 'bg-[#8B5E3C] text-white shadow-md border-transparent'
                      : 'bg-[#FAF6F0] dark:bg-[#1a140e] text-[#8B5E3C] dark:text-[#D4A359] border-[#8B5E3C]/30 hover:border-[#8B5E3C]'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Logout */}
              <button
                onClick={handleLogout}
                id="admin-logout-btn"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
