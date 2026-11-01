import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ProblemPracticeClient from '@/components/practice/ProblemPracticeClient';

interface ProblemPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const problemId = slug?.[0];
  return constructMetadata({
    title: 'Solve Problem — Interactive Coding Workspace',
    description: 'Solve algorithmic challenges in real-time with multi-language code compilation and comprehensive test cases.',
    canonical: problemId ? `/problem/${problemId}` : '/practice',
    keywords: ['coding workspace', 'online compiler', 'DSA challenge'],
  });
}

export default function ProblemPracticePage() {
  return (
    <main>
      <ProblemPracticeClient />
    </main>
  );
}
