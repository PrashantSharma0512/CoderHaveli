import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import { serverFetch } from '@/lib/api';
import PrivacyPageClient from '@/components/privacy/PrivacyPageClient';

export const metadata: Metadata = constructMetadata({
  title: 'Privacy Policy',
  description:
    'Read the official CoderHaveli Privacy Policy covering data collection, code submissions, Haveli Coins, and account security.',
  canonical: '/privacy',
});

export const revalidate = 60;

export default async function PrivacyPage() {
  const res = await serverFetch<any>('/api/privacy-policy', {
    next: { revalidate: 60 },
  });
  const policy = res?.data?.policy || null;

  return (
    <main>
      <PrivacyPageClient initialPolicy={policy} />
    </main>
  );
}
