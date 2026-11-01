import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import VideoClient from './VideoClient';

export const metadata: Metadata = constructMetadata({
  title: 'Video Learning Session',
  canonical: '/video',
  noIndex: true,
});

export default function VideoRoute() {
  return (
    <main>
      <VideoClient />
    </main>
  );
}
