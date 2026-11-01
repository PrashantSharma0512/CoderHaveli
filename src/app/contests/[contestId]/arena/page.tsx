import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ContestArenaClient from './ContestArenaClient';

export const metadata: Metadata = constructMetadata({
  title: 'Live Contest Arena',
  description: 'Live competitive programming contest arena with real-time timers and submission evaluations.',
  noIndex: true,
});

export default function ArenaPage() {
  return (
    <main>
      <ContestArenaClient />
    </main>
  );
}
