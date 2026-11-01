import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import TutorialDetailClient from './TutorialDetailClient';

export const metadata: Metadata = constructMetadata({
  title: 'Tutorial & Course Curriculum',
  description: 'In-depth developer tutorials, conceptual breakdowns, and comprehensive programming courses.',
  canonical: '/tutorial-page',
});

export default function TutorialPageRoute() {
  return (
    <main>
      <TutorialDetailClient />
    </main>
  );
}
