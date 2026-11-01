import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ContestPassClient from './ContestPassClient';

export const metadata: Metadata = constructMetadata({
  title: 'Contest Pass — Unlimited Coding Battles & Tournaments',
  description:
    'Unlock unlimited access to all CoderHaveli competitive programming battles, rating tournaments, and exclusive seasonal events with a Contest Pass.',
  canonical: '/contests/pass',
});

export default function PassPage() {
  return (
    <main>
      <h1 className="sr-only">Contest Pass — Unlimited Coding Battles & Tournaments</h1>
      <ContestPassClient />
    </main>
  );
}
