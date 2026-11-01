'use client';

import dynamic from 'next/dynamic';
import AuthLayout from '@/layouts/Authlayout';

const ContestArena = dynamic(() => import('@/legacy_pages/contests/ContestArena'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full" />
    </div>
  ),
});

export default function ContestArenaClient() {
  return (
    <AuthLayout>
      <ContestArena />
    </AuthLayout>
  );
}
