import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = constructMetadata({
  title: 'Secure Checkout',
  canonical: '/checkout',
  noIndex: true,
});

export default function CheckoutRoute() {
  return (
    <main>
      <CheckoutClient />
    </main>
  );
}
