import type { Metadata } from 'next';
import ProblemListClient from '@/components/practice/ProblemListClient';
import { serverFetch } from '@/lib/api';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Data Structures & Algorithms Practice Problems',
  description:
    'Explore curated DSA coding problems with multi-language code editors, test cases, and in-depth video solutions.',
  canonical: '/practice',
  keywords: ['DSA practice', 'coding problems', 'algorithms', 'data structures', 'interview preparation'],
});

export const revalidate = 60; // ISR 60s

export default async function PracticePage() {
  const [problemRes, topicRes] = await Promise.all([
    serverFetch<any>('/api/problem?paginated=true&page=1&limit=20', {
      next: { revalidate: 60 },
    }),
    serverFetch<any>('/api/problem/topics', {
      next: { revalidate: 60 },
    }),
  ]);

  const problemData = problemRes?.data;
  const initialQuestions = Array.isArray(problemData)
    ? problemData
    : Array.isArray(problemData?.problems)
    ? problemData.problems
    : [];

  const initialTotal = problemData?.total ?? initialQuestions.length;
  const initialTopics = Array.isArray(topicRes?.data?.topics)
    ? topicRes.data.topics
    : Array.isArray(problemData?.topics)
    ? problemData.topics
    : [];
  const initialCounts = topicRes?.data?.counts ?? null;

  return (
    <main>
      <h1 className="sr-only">Data Structures & Algorithms Practice Problems</h1>
      <ProblemListClient
        initialQuestions={initialQuestions}
        initialTotal={initialTotal}
        initialTopics={initialTopics}
        initialCounts={initialCounts}
      />
    </main>
  );
}
