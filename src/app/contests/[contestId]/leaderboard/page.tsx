import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import LeaderboardClient from './LeaderboardClient';

interface LeaderboardPageProps {
  params: Promise<{ contestId: string }>;
}

export async function generateMetadata({ params }: LeaderboardPageProps): Promise<Metadata> {
  const { contestId } = await params;
  return constructMetadata({
    title: 'Contest Leaderboard & Standings',
    description: 'Live ranks, penalty times, and submission standings for CoderHaveli coding contests.',
    canonical: `/contests/${contestId}/leaderboard`,
  });
}

export default function LeaderboardPage() {
  return (
    <main>
      <LeaderboardClient />
    </main>
  );
}
