import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import AddToCartClient from './AddToCartClient';

export const metadata: Metadata = constructMetadata({
  title: 'Shopping Cart',
  canonical: '/addtocart',
  noIndex: true,
});

export default function AddToCartRoute() {
  return (
    <main>
      <AddToCartClient />
    </main>
  );
}
