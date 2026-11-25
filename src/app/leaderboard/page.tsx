import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import LeaderboardClient from '@/components/leaderboard/LeaderboardClient';

export const metadata: Metadata = constructMetadata({
  title: 'Tapasya Ranks — Global Coding Leaderboard',
  description:
    'Explore Tapasya Ranks on CoderHaveli. See top DSA problem solvers, Code Tapasya streaks, Haveli Coins, and your live global rank.',
  canonical: '/leaderboard',
  keywords: [
    'Tapasya Ranks',
    'CoderHaveli leaderboard',
    'coding ranking India',
    'DSA top coders',
    'Code Tapasya leaderboard',
    'Haveli Coins ranking',
  ],
});

export default function LeaderboardPage() {
  return (
    <main>
      <LeaderboardClient />
    </main>
  );
}

