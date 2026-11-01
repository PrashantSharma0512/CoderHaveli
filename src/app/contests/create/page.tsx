import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ContestCreateClient from './ContestCreateClient';

export const metadata: Metadata = constructMetadata({
  title: 'Host a Coding Contest',
  description: 'Create and host public or private algorithmic coding competitions on CoderHaveli.',
  canonical: '/contests/create',
});

export default function CreateContestPage() {
  return (
    <main>
      <h1 className="sr-only">Host a Coding Contest on CoderHaveli</h1>
      <ContestCreateClient />
    </main>
  );
}
