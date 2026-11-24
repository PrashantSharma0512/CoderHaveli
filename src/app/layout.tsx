import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from '@/components/providers';
import ClientLayout from '@/components/layout/ClientLayout';
import {
  constructMetadata,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  generateWebApplicationJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = generateOrganizationJsonLd();
  const webSiteJsonLd = generateWebSiteJsonLd();
  const webAppJsonLd = generateWebApplicationJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="search" type="application/opensearchdescription+xml" title="CoderHaveli" href="/opensearch.xml" />
        {/* Anti-FOUC theme initializer to set dark class before render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased font-sans"
      >
        {/* External SDKs loaded asynchronously after hydration */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* Structured Data (Schema.org) for SEO & Brand Disambiguation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />

        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
