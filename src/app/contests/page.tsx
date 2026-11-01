import type { Metadata } from 'next';
import ContestListClient from '@/components/contests/ContestListClient';
import { serverFetch } from '@/lib/api';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Live Coding Contests & Competitive Programming Tournaments',
  description:
    'Compete in live algorithmic coding battles, climb national rankings, solve real-world DSA challenges, and win CoderHaveli badges and recognitions.',
  canonical: '/contests',
  keywords: ['coding contests', 'live contest', 'competitive programming', 'dsa tournaments', 'hackathons'],
});

export const revalidate = 30; // ISR revalidation every 30s

export default async function ContestsPage() {
  const { data } = await serverFetch<any>('/api/contests?limit=12', {
    next: { revalidate: 30 },
  });

  const initialContests = data?.contests && Array.isArray(data.contests) ? data.contests : [];
  const initialTotalPages = data?.pagination?.pages || 1;

  return (
    <main>
      <h1 className="sr-only">Live Coding Contests & Competitive Programming Tournaments</h1>
      <ContestListClient
        initialContests={initialContests}
        initialTotalPages={initialTotalPages}
      />
    </main>
  );
}
