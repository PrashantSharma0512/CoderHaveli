'use client';

import dynamic from 'next/dynamic';
import AuthLayout from '@/layouts/Authlayout';

const VideoPlayer = dynamic(() => import('@/legacy_pages/VideoPlayer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full" />
    </div>
  ),
});

export default function VideoClient() {
  return (
    <AuthLayout>
      <VideoPlayer />
    </AuthLayout>
  );
}
