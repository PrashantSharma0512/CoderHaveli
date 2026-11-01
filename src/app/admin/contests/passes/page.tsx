'use client';

import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';

const AdminContestPasses = dynamic(
  () => import('@/legacy_pages/admin/contests/AdminContestPasses'),
  { ssr: false }
);

export default function AdminPassesPage() {
  return (
    <AdminLayout>
      <AdminContestPasses />
    </AdminLayout>
  );
}
