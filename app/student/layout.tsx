'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/student/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF6F0] dark:bg-[#1a140e] text-[#3D2E1E] dark:text-[#FAF6F0] flex flex-col font-[family-name:var(--font-cairo)] transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
