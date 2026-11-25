import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import { FileText } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Terms & Conditions',
  description:
    'Read the official CoderHaveli Terms and Conditions governing practice problems, contests, Haveli Coins, and user accounts.',
  canonical: '/terms',
});

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using CoderHaveli (coderhaveli.com), you agree to comply with these Terms & Conditions and our Privacy Policy.',
  },
  {
    title: '2. User Accounts & Fair Play',
    body: 'You are responsible for keeping your account credentials secure. In live contests and Tapasya Ranks, plagiarism, automated bots, or exploiting the judge environment is strictly prohibited and may result in disqualification.',
  },
  {
    title: '3. Haveli Coins & Personal AajKaSawal',
    body: 'Haveli Coins are a virtual reward currency earned through platform activities (AajKaSawal, streaks, and contests). They have no monetary cash value and are used exclusively for in-platform features like Personal AajKaSawal.',
  },
  {
    title: '4. Intellectual Property',
    body: 'Platform branding, tutorials, editorials, and UI components belong to CoderHaveli. Your submitted solutions remain your own work while granting CoderHaveli permission to evaluate and store them for your profile history.',
  },
  {
    title: '5. Updates to Terms',
    body: 'CoderHaveli may update these Terms from time to time. Continued use of the platform constitutes acceptance of the revised Terms.',
  },
];

export default function TermsPage() {
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
            <FileText className="w-3.5 h-3.5" />
            Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-950 dark:text-white">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-amber-950/80 dark:text-gray-300 mt-2">
            Rules and guidelines for using CoderHaveli.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-4">
        {sections.map((sec) => (
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

