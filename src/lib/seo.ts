import type { Metadata } from 'next';

export const SITE_NAME = 'CoderHaveli';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://coderhaveli.com';
export const DEFAULT_DESCRIPTION =
  'CoderHaveli (coderhaveli.com) is India\'s premier online coding platform. Master Data Structures & Algorithms (DSA), solve Code Tapasya daily challenges, compete in live competitive programming contests, and prepare for top tech interviews.';

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
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — India's Leading Coding Contests, DSA Practice & Code Tapasya`;

  const canonicalUrl = canonical
    ? `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : SITE_URL;

  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      'CoderHaveli',
      'coderhaveli.com',
      'Coder Haveli',
      'CoderHaveli Official',
      'CoderHaveli DSA',
      'CoderHaveli Coding Platform',
      'Code Tapasya',
      'Aaj Ka Sawal CoderHaveli',
      'coding contests India',
      'competitive programming platform',
      'DSA practice problems',
      'data structures and algorithms',
      'leetcode alternative India',
      'technical interview preparation',
      'live code compiler',
      'online IDE JavaScript Python C++ Java',
      ...keywords,
    ],
    authors: [{ name: 'CoderHaveli Team', url: SITE_URL }],
    creator: 'CoderHaveli',
    publisher: 'CoderHaveli',
    metadataBase: new URL(SITE_URL),
    manifest: '/site.webmanifest',
    icons: {
      icon: '/lo.jpeg',
      shortcut: '/lo.jpeg',
      apple: '/lo.jpeg',
    },
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
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      site: '@coderhaveli',
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
    other: {
      // Bing / Microsoft Edge crawler directives
      bingbot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      'msapplication-TileColor': '#030712',
      'apple-mobile-web-app-title': 'CoderHaveli',
      'application-name': 'CoderHaveli',
    },
  };
}

/**
 * Structured Data (Schema.org) for Organization with explicit brand disambiguation.
 * Crucial for Google Knowledge Graph, Gemini, and Bing to distinguish CoderHaveli
 * from generic "code haveli".
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: 'CoderHaveli',
    legalName: 'CoderHaveli',
    alternateName: [
      'CoderHaveli.com',
      'Coder Haveli',
      'CoderHaveli Official',
      'CoderHaveli Coding Arena',
    ],
    url: SITE_URL,
    logo: `${SITE_URL}/lo.jpeg`,
    image: `${SITE_URL}/lo.jpeg`,
    description: DEFAULT_DESCRIPTION,
    disambiguatingDescription:
      'CoderHaveli (coderhaveli.com) is India\'s premier online coding platform dedicated to Data Structures and Algorithms (DSA), real-time competitive programming contests, live multi-language compilation, and Code Tapasya daily streak tracking. Founded by Prashant Sharma, it is an independent interactive programming arena and is distinct from generic "code haveli" or unrelated software repositories.',
    founder: {
      '@type': 'Person',
      name: 'Prashant Sharma',
      jobTitle: 'Founder & Full-Stack Developer',
      url: 'https://linkedin.com/in/prashant-sharma-0216ba251/',
    },
    knowsAbout: [
      'Data Structures and Algorithms',
      'Competitive Programming',
      'Online Coding Contests',
      'Code Tapasya',
      'Coding Interview Preparation',
      'Full Stack Web Development',
    ],
    sameAs: [
      'https://github.com/PrashantSharma0512',
      'https://linkedin.com/in/prashant-sharma-0216ba251/',
      'https://x.com/PraShant051202',
    ],
  };
}

/**
 * Structured Data for WebSite with Sitelinks Searchbox
 */
export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'CoderHaveli',
    alternateName: ['CoderHaveli.com', 'Coder Haveli'],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/practice?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Structured Data for WebApplication (Interactive Coding Workspace)
 */
export function generateWebApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/#webapp`,
    name: 'CoderHaveli Coding Arena & Compiler',
    url: `${SITE_URL}/practice`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description:
      'Interactive online programming workspace supporting JavaScript, Python, C++, and Java with real-time test case execution and daily Code Tapasya streak tracking.',
    provider: {
      '@id': `${SITE_URL}/#organization`,
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
