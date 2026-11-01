'use client';

import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';

const AdminContestLeaderboard = dynamic(
  () => import('@/legacy_pages/admin/contests/AdminContestLeaderboard'),
  { ssr: false }
);

export default function AdminContestLeaderboardPage() {
  return (
    <AdminLayout>
      <AdminContestLeaderboard />
    </AdminLayout>
  );
}
