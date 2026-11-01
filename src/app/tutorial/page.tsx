import type { Metadata } from 'next';
import TutorialListClient from '@/components/tutorials/TutorialListClient';
import { serverFetch } from '@/lib/api';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Interactive Tutorials & Comprehensive Web Development Courses',
  description:
    'Browse our comprehensive catalog of developer tutorials, coding guides, and full-stack courses on CoderHaveli.',
  canonical: '/tutorial',
  keywords: ['coding tutorials', 'programming courses', 'web development', 'learn react', 'full stack tutorial'],
});

export const revalidate = 60; // ISR 60s

export default async function TutorialPage() {
  const [tutorialsRes, categoriesRes, coursesRes] = await Promise.all([
    serverFetch<any[]>('/api/get-tutorial', { next: { revalidate: 60 } }),
    serverFetch<any[]>('/api/get-category', { next: { revalidate: 3600 } }),
    serverFetch<any[]>('/api/get-courses', { next: { revalidate: 60 } }),
  ]);

  const initialTutorials = Array.isArray(tutorialsRes.data) ? tutorialsRes.data : [];
  const initialCategories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
  const initialCourses = Array.isArray(coursesRes.data) ? coursesRes.data : [];

  return (
    <main>
      <h1 className="sr-only">Interactive Tutorials & Comprehensive Web Development Courses</h1>
      <TutorialListClient
        initialTutorials={initialTutorials}
        initialCategories={initialCategories}
        initialCourses={initialCourses}
      />
    </main>
  );
}
