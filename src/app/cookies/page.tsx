import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import { Cookie } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Cookie Policy',
  description:
    'Learn how CoderHaveli uses essential cookies and local storage for authentication, theme preferences, and code autosave.',
  canonical: '/cookies',
});

const cookieSections = [
  {
    title: '1. Essential Authentication Cookies',
    body: 'CoderHaveli uses secure HTTP-only cookies to store your refresh token so you stay signed in safely across sessions without exposing credentials to client-side scripts.',
  },
  {
    title: '2. Local Storage & Preferences',
    body: 'We use browser localStorage to remember your Light/Dark theme preference, your editor panel width, Privacy Policy acceptance version, and instant local code autosave drafts.',
  },
  {
    title: '3. No Invasive Advertising Trackers',
    body: 'We do not sell your browsing behavior or use third-party ad-network tracking cookies.',
  },
  {
    title: '4. Managing Cookies',
    body: 'You can clear cookies or localStorage anytime from your browser settings. Note that clearing essential cookies will sign you out of your CoderHaveli session.',
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-16">
      <div className="bg-amber-400 dark:bg-[#0B0F19] border-b-2 border-amber-600 dark:border-amber-500 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(120,53,15,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,53,15,0.45) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FFFBEB] dark:bg-[#131926] text-amber-800 dark:text-amber-300 border border-amber-700/20 dark:border-amber-500/30 mb-3">
            <Cookie className="w-3.5 h-3.5" />
            Cookies &amp; Storage
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-950 dark:text-white">
            Cookie Policy
          </h1>
          <p className="text-sm text-amber-950/80 dark:text-gray-300 mt-2">
            How CoderHaveli uses cookies and browser storage to power your coding workspace.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-4">
        {cookieSections.map((sec) => (
          <div
            key={sec.title}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-2">
              {sec.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{sec.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

