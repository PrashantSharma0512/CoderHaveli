'use client';

import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';

const AdminWeeklyScheduler = dynamic(
  () => import('@/legacy_pages/admin/contests/AdminWeeklyScheduler'),
  { ssr: false }
);

export default function AdminSchedulerPage() {
  return (
    <AdminLayout>
      <AdminWeeklyScheduler />
    </AdminLayout>
  );
}
