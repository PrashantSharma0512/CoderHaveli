'use client';

import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';

const AdminContestParticipants = dynamic(
  () => import('@/legacy_pages/admin/contests/AdminContestParticipants'),
  { ssr: false }
);

export default function AdminContestParticipantsPage() {
  return (
    <AdminLayout>
      <AdminContestParticipants />
    </AdminLayout>
  );
}
