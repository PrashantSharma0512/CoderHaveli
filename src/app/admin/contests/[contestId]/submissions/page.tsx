'use client';

import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';

const AdminContestSubmissions = dynamic(
  () => import('@/legacy_pages/admin/contests/AdminContestSubmissions'),
  { ssr: false }
);

export default function AdminContestSubmissionsPage() {
  return (
    <AdminLayout>
      <AdminContestSubmissions />
    </AdminLayout>
  );
}
