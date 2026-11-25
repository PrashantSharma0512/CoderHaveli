import type { Metadata } from 'next';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';
import { BookOpen, Code2, Trophy, Flame, ArrowRight, Sparkles, Terminal } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'DSA & Coding Resources',
  description:
    'Explore curated DSA roadmaps, Code Tapasya daily practice, tutorials, and weekly contest preparation resources on CoderHaveli.',
  canonical: '/resources',
});

const resourceTracks = [
  {
    title: 'Data Structures & Algorithms Roadmap',
    desc: 'Master Arrays, Binary Search, Trees, Graphs, and Dynamic Programming with 2,800+ curated problems.',
    href: '/practice',
    cta: 'Start Practicing',
    icon: Code2,
    badge: 'Core DSA',
  },
  {
    title: 'Code Tapasya & AajKaSawal',
    desc: 'Build daily consistency with one curated challenge every day, earn Haveli Coins, and unlock Personal AajKaSawal.',
    href: '/practice',
    cta: 'View Today’s POTD',
    icon: Flame,
    badge: 'Daily Habit',
  },
  {
    title: 'Weekly Live Coding Contests',
    desc: 'Compete every Sunday in timed 3-problem algorithmic contests and earn podium Haveli Coin rewards.',
    href: '/contests',
    cta: 'Explore Contests',
    icon: Trophy,
    badge: 'Competitive',
  },
  {
    title: 'Structured Tutorials & Guides',
    desc: 'Step-by-step video and text tutorials covering full-stack development, system design, and core CS.',
    href: '/tutorial',
    cta: 'Browse Tutorials',
    icon: BookOpen,
    badge: 'Tutorials',
  },
  {
    title: 'Tapasya Ranks Leaderboard',
    desc: 'Track your global standing across Easy, Medium, and Hard problems and climb to the top of CoderHaveli.',
    href: '/leaderboard',
    cta: 'View Rankings',
    icon: Sparkles,
    badge: 'Rankings',
  },
  {
    title: 'Multi-Language Online Compiler',
    desc: 'Write, test with custom test cases, and auto-save solutions in JavaScript, Python, Java, and C++.',
    href: '/practice',
    cta: 'Open Arena',
    icon: Terminal,
    badge: 'IDE',
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-16">
      {/* Header */}
      <div className="bg-amber-400 dark:bg-[#0B0F19] border-b-2 border-amber-600 dark:border-amber-500 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(120,53,15,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,53,15,0.45) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FFFBEB] dark:bg-[#131926] text-amber-800 dark:text-amber-300 border border-amber-700/20 dark:border-amber-500/30 mb-3">
            Learning Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-950 dark:text-white">
            CoderHaveli Resources
          </h1>
          <p className="text-sm sm:text-base text-amber-950/80 dark:text-gray-300 mt-2 max-w-2xl">
            Everything you need to master Data Structures &amp; Algorithms, stay consistent with Code Tapasya, and crack top tech interviews.
          </p>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourceTracks.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between hover:border-amber-400 dark:hover:border-amber-500/60 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {item.badge}
                  </span>
                </div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                  {item.desc}
                </p>
              </div>
              <Link
                href={item.href}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <span>{item.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}

