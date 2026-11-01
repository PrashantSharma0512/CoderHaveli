'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '../Header/Header';
import Footer from '../footer/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const hideFooter = /^\/problem\/[a-f0-9]{24}$/.test(pathname) || pathname.includes('/arena') || pathname.startsWith('/video');
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forget';

  if (isAuthPage) {
    return (
      <React.Suspense fallback={<div className="min-h-screen" />}>
        <main className="min-h-screen">{children}</main>
      </React.Suspense>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-150">
      <Header />
      <main className="flex-1">
        <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>}>
          {children}
        </React.Suspense>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
