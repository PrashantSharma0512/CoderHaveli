import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import MyCourseClient from './MyCourseClient';

export const metadata: Metadata = constructMetadata({
  title: 'My Enrolled Courses & Progress',
  canonical: '/mycourse',
  noIndex: true,
});

export default function MyCoursePage() {
  return (
    <main>
      <MyCourseClient />
    </main>
  );
}
