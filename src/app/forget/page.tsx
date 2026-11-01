import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import PublicRoute from '@/layouts/PublicLayout';
import ForgetPassword from '@/components/auth/ForgetPassword';

export const metadata: Metadata = constructMetadata({
  title: 'Forgot Password — Reset Your Account',
  description: 'Reset your CoderHaveli account credentials securely.',
  canonical: '/forget',
  noIndex: true, // Don't index password reset pages
});

export default function ForgetPasswordPage() {
  return (
    <main>
      <PublicRoute>
        <ForgetPassword />
      </PublicRoute>
    </main>
  );
}
