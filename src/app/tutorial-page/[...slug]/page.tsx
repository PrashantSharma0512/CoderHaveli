import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import TutorialDetailClient from '../TutorialDetailClient';

export const metadata: Metadata = constructMetadata({
  title: 'Tutorial Lesson & Curriculum',
  description: 'In-depth developer tutorials, conceptual breakdowns, and practical programming exercises.',
  canonical: '/tutorial',
});

export default function DetailedPageRoute() {
  return (
    <main>
      <TutorialDetailClient />
    </main>
  );
}
