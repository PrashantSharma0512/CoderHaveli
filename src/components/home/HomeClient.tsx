'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Trophy } from 'lucide-react';
import Carousel from '@/components/utils/Carousel';
import InteractiveHero from '@/components/home/InteractiveHero';
import TutorialCard from '@/components/cards/TutorialCard';
import CourseCard from '@/components/cards/CourseCards';
import TestimonialSection from '@/components/cards/Testomonial';
import FAQSection from '@/components/utils/FAQ';
import axiosInstance from '@/components/helper/axiosInstance';
import { useSelector } from 'react-redux';
import AajKaSawalCard from '@/components/practice/AajKaSawalCard';

const faqs = [
  {
    question: 'What is CoderHaveli?',
    answer:
      'CoderHaveli is an online platform that helps developers enhance their coding skills through structured courses, tutorials, and real-time algorithmic coding contests.',
  },
  {
    question: 'Is CoderHaveli free to use?',
    answer:
      'CoderHaveli offers both free and premium content. Many of our tutorials, practice problems, and community coding challenges are 100% free for all users.',
  },
  {
    question: 'What technologies and topics are covered?',
    answer:
      'We cover Data Structures & Algorithms (DSA), competitive programming, JavaScript, React, Node.js, Python, Java, C++, and full-stack web development.',
  },
  {
    question: 'How can I participate in live coding contests?',
    answer:
      'You can register for scheduled contests or weekly sprints directly on the Contests page. Unlimited access is also available through the Contest Pass.',
  },
  {
    question: 'How can I get support?',
    answer:
      'You can reach out to our team via the contact form or community channels for technical guidance and peer assistance.',
  },
];

interface HomeClientProps {
  initialCourses?: any[];
  initialTutorials?: any[];
  initialCarousel?: string[];
}

export default function HomeClient({
  initialCourses = [],
  initialTutorials = [],
  initialCarousel = [],
}: HomeClientProps) {
  const [coursesData, setCoursesData] = useState<any[]>(initialCourses);
  const [cards, setCards] = useState<any[]>(initialTutorials);
  const [carouselImages, setCarouselImages] = useState<string[]>(initialCarousel);
  const [visibleCount, setVisibleCount] = useState(4);
  const [visibleCourseCount, setVisibleCourseCount] = useState(4);
  const [cart, setCart] = useState<any[]>([]);
  const userId = useSelector((state: any) => state?.login?.userId);

  // If initial server data was empty (e.g. backend offline during static build), fetch on mount
  useEffect(() => {
    if (coursesData.length === 0 || cards.length === 0 || carouselImages.length === 0) {
      const fetchData = async () => {
        try {
          const [coursesResponse, carouselResponse, cardResponse] = await Promise.all([
            axiosInstance.get(`/api/get-courses?userId=${userId || ''}`),
            axiosInstance.get('/api/get-carousel'),
            axiosInstance.get(`/api/get-tutorial?userId=${userId || ''}`),
          ]);
          if (carouselResponse?.data) {
            setCarouselImages(carouselResponse.data.map((item: any) => item.url));
          }
          if (coursesResponse?.data) {
            setCoursesData(coursesResponse.data);
          }
          if (cardResponse?.data) {
            setCards(cardResponse.data);
          }
        } catch (err) {
          console.error('Client data sync failed:', err);
        }
      };
      fetchData();
    }
  }, [userId, coursesData.length, cards.length, carouselImages.length]);

  // Sync user cart if logged in
  useEffect(() => {
    if (!userId) {
      setCart([]);
      return;
    }
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get(`/api/cart?id=${userId}`);
        if (res.data.success) {
          setCart(res.data.cart || []);
        }
      } catch (err) {
        setCart([]);
      }
    };
    fetchCart();
  }, [userId]);

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100 min-h-screen">
      {/* 3D Interactive Hero */}
      <InteractiveHero />

      {/* Aaj Ka Sawal & Code Tapasya Daily Tracker */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Daily Coding Challenge
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Problem of the Day • <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Code Tapasya</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
              Build an unstoppable coding habit. Solve today&apos;s challenge and maintain your streak.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-sm border border-purple-300/80 dark:border-purple-700/60 transition-all shrink-0"
            >
              <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Tapasya Ranks</span>
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-sm border border-amber-300/80 dark:border-amber-800/60 transition-all group shrink-0"
            >
              <span>Explore Practice Page & Calendar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <AajKaSawalCard userId={userId} />
      </section>

      {/* Tutorials Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 rounded-full mb-4">
            Learn Without Limits
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-yellow-500">
              Master New Skills
            </span>{' '}
            <br className="hidden sm:inline" />
            Through Our Tutorials
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Short, powerful lessons designed to give you immediate results. Perfect for fast-track skill acquisition.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {cards.slice(0, visibleCount).map((card, index) => (
            <div key={card._id || index} className="group">
              <TutorialCard {...card} />
            </div>
          ))}
        </div>

        {visibleCount < cards.length && (
          <div className="text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="relative inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:shadow-md cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              Explore More Tutorials
            </button>
          </div>
        )}
      </section>

      {/* Courses Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-7xl mx-auto my-12">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 rounded-full mb-4">
            Deep Dive Learning
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Comprehensive <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-yellow-500">
              Career-Changing
            </span>{' '}
            Courses
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Structured programs that take you from beginner to job-ready. Learn at your own pace with expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {coursesData?.slice(0, visibleCourseCount).map((course) => (
            <div key={course._id} className="group hover:-translate-y-1 transition-transform duration-200">
              <CourseCard
                title={course.title}
                description={course.description}
                imageUrl={course.image?.url || course.imageUrl}
                price={course.price}
                duration={course.duration}
                category={course.category?.name || course.category}
                _id={course._id}
                cart={cart}
                setCart={setCart}
              />
            </div>
          ))}
        </div>

        {visibleCourseCount < coursesData.length && (
          <div className="text-center">
            <button
              onClick={() => setVisibleCourseCount((prev) => prev + 3)}
              className="relative inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:shadow-md cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              Discover All Courses
            </button>
          </div>
        )}
      </section>

      <FAQSection faqs={faqs} heading={true} />
      <TestimonialSection />
    </div>
  );
}
