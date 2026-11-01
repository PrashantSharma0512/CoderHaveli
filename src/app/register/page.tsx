import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import PublicRoute from '@/layouts/PublicLayout';
import Register from '@/components/auth/Register';

export const metadata: Metadata = constructMetadata({
  title: 'Create an Account — Join CoderHaveli',
  description:
    'Sign up for CoderHaveli to solve Data Structures and Algorithms problems, compete in weekly coding contests, and unlock your engineering potential.',
  canonical: '/register',
});

export default function RegisterPage() {
  return (
    <main>
      <PublicRoute>
        <Register />
      </PublicRoute>
    </main>
  );
}
