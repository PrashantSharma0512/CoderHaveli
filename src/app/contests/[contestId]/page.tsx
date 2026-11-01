import type { Metadata } from 'next';
import ContestDetailClient from '@/components/contests/ContestDetailClient';
import { serverFetch } from '@/lib/api';
import { constructMetadata, generateContestJsonLd } from '@/lib/seo';

interface ContestDetailPageProps {
  params: Promise<{ contestId: string }>;
}

export async function generateMetadata({ params }: ContestDetailPageProps): Promise<Metadata> {
  const { contestId } = await params;
  const { data } = await serverFetch<any>(`/api/contests/${contestId}`, {
    next: { revalidate: 30 },
  });

  const contest = data?.contest;
  if (!contest) {
    return constructMetadata({
      title: 'Coding Contest Details',
      canonical: `/contests/${contestId}`,
    });
  }

  return constructMetadata({
    title: `${contest.title} — Live Coding Battle`,
    description:
      contest.description ||
      `Compete in ${contest.title} on CoderHaveli. Solve DSA challenges, climb the live leaderboard, and win prizes.`,
    canonical: `/contests/${contestId}`,
    keywords: [contest.title, 'competitive programming contest', contest.difficulty || 'coding contest'],
  });
}

export default async function ContestDetailPage({ params }: ContestDetailPageProps) {
  const { contestId } = await params;
  const { data } = await serverFetch<any>(`/api/contests/${contestId}`, {
    next: { revalidate: 30 },
  });

  const contest = data?.contest || null;
  const jsonLd = contest ? generateContestJsonLd(contest) : null;

  return (
    <main>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ContestDetailClient contestId={contestId} initialContest={contest} />
    </main>
  );
}
