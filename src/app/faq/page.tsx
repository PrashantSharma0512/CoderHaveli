import type { Metadata } from 'next';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';
import { HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Frequently Asked Questions (FAQ)',
  description:
    'Find answers about CoderHaveli, Code Tapasya daily streaks, Haveli Coins, Personal AajKaSawal, Weekly Contests, and Tapasya Ranks.',
  canonical: '/faq',
});

const faqs = [
  {
    q: 'What is CoderHaveli?',
    a: 'CoderHaveli (coderhaveli.com) is an interactive coding platform for Data Structures & Algorithms (DSA), daily Code Tapasya challenges, weekly live contests, and structured tutorials.',
  },
  {
    q: 'How does Code Tapasya & AajKaSawal work?',
    a: 'Every day at 00:00 IST, a new Problem of the Day (AajKaSawal) is featured. Solving it increments your Code Tapasya streak, lights up that day on your calendar, and rewards you with Haveli Coins.',
  },
  {
    q: 'How do I earn and use Haveli Coins?',
    a: 'You earn Haveli Coins by solving daily AajKaSawal challenges (+1 Coin), hitting 7-day streak milestones, solving Weekly Contest problems (+1 Coin), and finishing in the Top 3 of contests. You can spend Haveli Coins to unlock Personal AajKaSawal.',
  },
  {
    q: 'What is Personal AajKaSawal?',
    a: 'Personal AajKaSawal lets you choose your own DSA topic (like Binary Search, Dynamic Programming, or Graphs) so your daily POTD challenge is tailored to the topic you want to master.',
  },
  {
    q: 'How is Tapasya Ranks (Leaderboard) calculated?',
    a: 'Tapasya Ranks ranks coders by Total Problems Solved, Difficulty Score (Easy: 10 pts, Medium: 25 pts, Hard: 50 pts), and Haveli Coins. You can view your live global rank on your Profile and the Tapasya Ranks page.',
  },
  {
    q: 'Is my code saved automatically while practicing?',
    a: 'Yes! Your code is instantly saved locally as you type and auto-saved to your CoderHaveli account every 1.5 seconds. You can also load any past submission back into the editor from the Submissions tab.',
  },
  {
    q: 'Why do I need to register to subscribe to the newsletter?',
    a: 'Newsletter preferences are tied directly to your CoderHaveli account (news_subscribe) so you can manage your subscription securely anytime.',
  },
];

export default function FAQPage() {
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
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-950 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-amber-950/80 dark:text-gray-300 mt-2">
            Quick answers about CoderHaveli features, streaks, coins, and contests.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-4">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-2">
              {item.q}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}

        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div>
            <h3 className="text-base font-black text-gray-900 dark:text-white">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Reach out to our team directly and we&apos;ll be happy to help.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shrink-0 self-start sm:self-auto"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

