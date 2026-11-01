import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/practice',
          '/contests',
          '/tutorial',
          '/about',
          '/login',
          '/register',
        ],
        disallow: [
          '/admin/',
          '/checkout',
          '/addtocart',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
