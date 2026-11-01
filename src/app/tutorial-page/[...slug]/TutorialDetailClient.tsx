'use client';

import dynamic from 'next/dynamic';
import AuthLayout from '@/layouts/Authlayout';

const DetailedPage = dynamic(() => import('@/legacy_pages/DetailedPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full" />
    </div>
  ),
});

export default function TutorialDetailClient() {
  return (
    <AuthLayout>
      <DetailedPage />
    </AuthLayout>
  );
}
