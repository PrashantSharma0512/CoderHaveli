import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import PublicRoute from '@/layouts/PublicLayout';
import Login from '@/components/auth/Login';

export const metadata: Metadata = constructMetadata({
  title: 'Sign In to Your Account',
  description:
    'Log into CoderHaveli to participate in live coding contests, solve practice problems, track learning progress, and access premium courses.',
  canonical: '/login',
});

export default function LoginPage() {
  return (
    <main>
      <PublicRoute>
        <Login />
      </PublicRoute>
    </main>
  );
}
