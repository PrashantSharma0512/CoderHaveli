import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata: Metadata = constructMetadata({
  title: 'Admin Portal & Content Manager',
  noIndex: true,
});

export default function AdminPage() {
  return (
    <main>
      <AdminDashboardClient />
    </main>
  );
}
