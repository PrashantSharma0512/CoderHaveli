import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import { serverFetch } from '@/lib/api';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'CoderHaveli — India\'s Premier Coding Contests, DSA Practice & Code Tapasya',
  description:
    'CoderHaveli (coderhaveli.com) is India\'s leading online coding platform. Master Data Structures & Algorithms (DSA), solve Code Tapasya daily challenges, compete in live contests, and crack top tech interviews.',
  canonical: '/',
  keywords: [
    'CoderHaveli',
    'coderhaveli.com',
    'Coder Haveli',
    'CoderHaveli Official',
    'Code Tapasya',
    'Aaj Ka Sawal CoderHaveli',
    'DSA practice problems',
    'competitive programming India',
    'online coding contests',
  ],
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
