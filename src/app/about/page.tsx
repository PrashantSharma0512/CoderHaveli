import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'About CoderHaveli — Empowering the Next Generation of Developers',
  description:
    'Discover the mission behind CoderHaveli. We build practical coding courses, real-time algorithmic contests, and interactive DSA challenges.',
  canonical: '/about',
  keywords: ['About CoderHaveli', 'Prashant Sharma', 'CoderHaveli mission', 'learn coding online'],
});

export default function AboutPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Prashant Sharma',
    jobTitle: 'Founder & Full-Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'CoderHaveli',
    },
    sameAs: [
      'https://github.com/PrashantSharma0512',
      'https://linkedin.com/in/prashant-sharma-0216ba251/',
      'https://x.com/PraShant051202',
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 py-16 px-6 md:px-16 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
          Welcome to <span className="text-amber-600 dark:text-amber-400">CoderHaveli</span> 🚀
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          At <span className="font-bold text-amber-600 dark:text-amber-400">CoderHaveli</span>, we craft an immersive learning experience for aspiring developers. Our mission is to bridge the gap between academic theory and real-world tech engineering.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        {[
          {
            title: '🚀 Our Mission',
            text: 'To revolutionize learning with practical, hands-on coding courses tailored for modern tech careers.',
            icon: '💡',
          },
          {
            title: '🎓 What We Offer',
            text: 'Interactive lessons, live competitive coding contests, and real-world projects to accelerate your growth.',
            icon: '📚',
          },
          {
            title: '🔥 Why Us?',
            text: 'Cutting-edge curriculum, affordable pricing, and an active developer community to support your journey.',
            icon: '🌟',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-gray-900 p-6 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Meet the Developer Section */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Meet the <span className="text-amber-600 dark:text-amber-400">Developer</span> 💻
        </h2>

        <div className="flex flex-col items-center bg-slate-50 dark:bg-gray-900 p-8 rounded-3xl shadow-xs max-w-md mx-auto border border-gray-200 dark:border-gray-800">
          <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
            <Image
              src="/dev_ghibli.png"
              alt="Prashant Sharma - Founder of CoderHaveli"
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Prashant Sharma</h3>
          <p className="text-amber-600 dark:text-amber-400 font-medium text-sm">Founder & Full-Stack Developer</p>
          <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Passionate about building state-of-the-art web applications, real-time contest platforms, and empowering developers to excel in computer science.
          </p>

          {/* Social Links */}
          <div className="flex gap-5 mt-6">
            <a
              href="https://github.com/PrashantSharma0512"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="GitHub Profile"
            >
              <FiGithub size={22} />
            </a>
            <a
              href="https://linkedin.com/in/prashant-sharma-0216ba251/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <FiLinkedin size={22} />
            </a>
            <a
              href="https://x.com/PraShant051202"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              aria-label="Twitter Profile"
            >
              <FiTwitter size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Ready to start your coding journey?
        </h2>
        <Link
          href="/practice"
          className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-md hover:opacity-95 transition-all"
        >
          Explore Practice Problems
        </Link>
      </div>
    </div>
  );
}
