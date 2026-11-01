import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { serverFetch } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/practice`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contests`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contests/pass`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tutorial`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Try fetching public contests to include in sitemap
  try {
    const { data: contestData } = await serverFetch<any>('/api/contests?limit=50', {
      next: { revalidate: 3600 },
    });
    if (contestData?.contests && Array.isArray(contestData.contests)) {
      for (const contest of contestData.contests) {
        if (contest._id) {
          routes.push({
            url: `${SITE_URL}/contests/${contest._id}`,
            lastModified: contest.updatedAt ? new Date(contest.updatedAt) : new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
          });
        }
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  return routes;
}
