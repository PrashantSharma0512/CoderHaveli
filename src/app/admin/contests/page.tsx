import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import AdminContestsClient from './AdminContestsClient';

export const metadata: Metadata = constructMetadata({
  title: 'Admin Contest Management',
  noIndex: true,
});

export default function AdminContestsListPage() {
  return (
    <main>
      <AdminContestsClient />
    </main>
  );
}
