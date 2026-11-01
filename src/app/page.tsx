import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import { serverFetch } from '@/lib/api';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'CoderHaveli — Live Coding Contests, DSA & Learning Platform',
  description:
    'Master Data Structures & Algorithms, compete in real-time coding contests, climb leaderboards, and elevate your programming career with CoderHaveli.',
  canonical: '/',
});

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  // Pre-fetch public content on server for instant HTML rendering and Googlebot indexing
  const [coursesRes, carouselRes, tutorialsRes] = await Promise.all([
    serverFetch<any[]>('/api/get-courses', { next: { revalidate: 60 } }),
    serverFetch<any[]>('/api/get-carousel', { next: { revalidate: 3600 } }),
    serverFetch<any[]>('/api/get-tutorial', { next: { revalidate: 60 } }),
  ]);

  const initialCourses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
  const initialCarousel = Array.isArray(carouselRes.data)
    ? carouselRes.data.map((item: any) => item.url).filter(Boolean)
    : [];
  const initialTutorials = Array.isArray(tutorialsRes.data) ? tutorialsRes.data : [];

  return (
    <main>
      <h1 className="sr-only">CoderHaveli — Live Coding Contests, DSA & Learning Platform</h1>
      <HomeClient
        initialCourses={initialCourses}
        initialTutorials={initialTutorials}
        initialCarousel={initialCarousel}
      />
    </main>
  );
}
