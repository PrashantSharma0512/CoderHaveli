'use client';

import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';

const AdminContestList = dynamic(
  () => import('@/legacy_pages/admin/contests/AdminContestList'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    ),
  }
);

export default function AdminContestsClient() {
  return (
    <AdminLayout>
      <AdminContestList />
    </AdminLayout>
  );
}
