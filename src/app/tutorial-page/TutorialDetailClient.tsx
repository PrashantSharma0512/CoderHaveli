'use client';

import dynamic from 'next/dynamic';

const DetailedPage = dynamic(() => import('@/legacy_pages/DetailedPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full" />
    </div>
  ),
});

export default function TutorialDetailClient() {
  return <DetailedPage />;
}
