'use client';

import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';

const AdminContestForm = dynamic(
  () => import('@/legacy_pages/admin/contests/AdminContestForm'),
  { ssr: false }
);

export default function AdminContestCreatePage() {
  return (
    <AdminLayout>
      <AdminContestForm />
    </AdminLayout>
  );
}
