import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { serverFetch } from '@/lib/api';

const TOP_CURATED_PROBLEMS = [
  '11', '1', '3', '15', '20', '53', '121', '70', '42', '2', '4', '5', '6', '7', '8', '9', '10'
];

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
      priority: 0.95,
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

  // Fetch public contests
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

  // Fetch practice problems to index hundreds of CoderHaveli URLs
  let addedProblemUrls = false;
  try {
    const { data: problemData } = await serverFetch<any>('/api/problem?limit=100&format=object', {
      next: { revalidate: 3600 },
    });
    const problemList = Array.isArray(problemData?.problems) ? problemData.problems : (Array.isArray(problemData) ? problemData : []);
    if (problemList.length > 0) {
      for (const p of problemList) {
        const id = p._id || p.quesId;
        if (id) {
          routes.push({
            url: `${SITE_URL}/problem/${id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.75,
          });
        }
      }
      addedProblemUrls = true;
    }
  } catch (e) {
    // Graceful fallback
  }

  // Fallback to top curated problem IDs if API was offline during build
  if (!addedProblemUrls) {
    for (const qId of TOP_CURATED_PROBLEMS) {
      routes.push({
        url: `${SITE_URL}/problem/${qId}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  return routes;
}
