import type { Metadata } from 'next';

export const SITE_NAME = 'CoderHaveli';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://coderhaveli.foodyninja.in';
export const DEFAULT_DESCRIPTION =
  'Master Data Structures & Algorithms, compete in real-time coding contests, climb leaderboards, and elevate your programming career with CoderHaveli.';

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/lo.jpeg',
  canonical = '',
  noIndex = false,
  keywords = [],
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  keywords?: string[];
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Live Coding Contests, DSA & Learning Platform`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return {
    title: fullTitle,
    description,
    keywords: [
      'coding contests',
      'competitive programming',
      'DSA',
      'data structures and algorithms',
      'leetcode alternative',
      'learn programming',
      'web development',
      'CoderHaveli',
      ...keywords,
    ],
    authors: [{ name: 'CoderHaveli Team', url: SITE_URL }],
    creator: 'CoderHaveli',
    publisher: 'CoderHaveli',
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image.startsWith('http') ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.startsWith('http') ? image : `${SITE_URL}${image}`],
      creator: '@coderhaveli',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CoderHaveli',
    url: SITE_URL,
    logo: `${SITE_URL}/lo.jpeg`,
    sameAs: [
      'https://github.com/PrashantSharma0512',
      'https://linkedin.com',
      'https://twitter.com',
    ],
    description: DEFAULT_DESCRIPTION,
  };
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CoderHaveli',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/practice?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateContestJsonLd(contest: any) {
  if (!contest) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: contest.title || 'Coding Contest',
    description: contest.description || 'Live algorithmic coding contest on CoderHaveli',
    startDate: contest.startTime,
    endDate: contest.endTime,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: `${SITE_URL}/contests/${contest._id}`,
    },
    organizer: {
      '@type': 'Organization',
      name: 'CoderHaveli',
      url: SITE_URL,
    },
  };
}
