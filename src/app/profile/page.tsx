import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = constructMetadata({
  title: 'My Profile & Submissions',
  canonical: '/profile',
  noIndex: true,
});

export default function ProfileRoute() {
  return (
    <main>
      <ProfileClient />
    </main>
  );
}
