'use client';

import React, { useState, useEffect } from 'react';
import TutorialCard from '@/components/cards/TutorialCard';
import CourseCard from '@/components/cards/CourseCards';
import { FiSearch, FiFilter } from 'react-icons/fi';
import axiosInstance from '@/components/helper/axiosInstance';
import { useSelector } from 'react-redux';

interface TutorialListClientProps {
  initialTutorials?: any[];
  initialCategories?: any[];
  initialCourses?: any[];
}

export default function TutorialListClient({
  initialTutorials = [],
  initialCategories = [],
  initialCourses = [],
}: TutorialListClientProps) {
  const [tutorials, setTutorials] = useState<any[]>(initialTutorials);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [courseData, setCourseData] = useState<any[]>(initialCourses);
  const [loading, setLoading] = useState<boolean>(
    initialTutorials.length === 0 && initialCourses.length === 0
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'tutorials' | 'courses'>('all');
  const userId = useSelector((state: any) => state?.login?.userId);

  useEffect(() => {
    if (tutorials.length === 0 && courseData.length === 0) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [tutorialsResponse, categoriesResponse, coursesResponse] = await Promise.all([
            axiosInstance.get(`/api/get-tutorial?userId=${userId || ''}`),
            axiosInstance.get('/api/get-category'),
            axiosInstance.get(`/api/get-courses?userId=${userId || ''}`),
          ]);
          setTutorials(tutorialsResponse.data || []);
          setCategories(categoriesResponse.data || []);
          setCourseData(coursesResponse.data || []);
        } catch (error) {
          console.error('Error fetching tutorials:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userId, tutorials.length, courseData.length]);

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      (tutorial.category && selectedCategories.includes(tutorial.category.id || tutorial.category._id));
    return matchesSearch && matchesCategory;
  });

  const filteredCourses = courseData.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      (course.category && selectedCategories.includes(course.category.id || course.category._id));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
          Tutorials &amp; Courses
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Learn cutting-edge web development, algorithmic paradigms, and system design from scratch.
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tutorials, courses, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'tutorials', 'courses'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tutorials Section */}
      {(activeTab === 'all' || activeTab === 'tutorials') && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bite-Sized Tutorials</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredTutorials.map((card, index) => (
              <div key={card._id || index} className="group">
                <TutorialCard {...card} />
              </div>
            ))}
          </div>
          {filteredTutorials.length === 0 && !loading && (
            <p className="text-sm text-gray-500">No tutorials found matching criteria.</p>
          )}
        </section>
      )}

      {/* Courses Section */}
      {(activeTab === 'all' || activeTab === 'courses') && (
        <section className="space-y-4 pt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Comprehensive Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((course) => (
              <div key={course._id} className="group hover:-translate-y-1 transition-transform duration-200">
                <CourseCard
                  title={course.title}
                  description={course.description}
                  imageUrl={course.image?.url || course.imageUrl}
                  price={course.price}
                  duration={course.duration}
                  category={course.category?.name || course.category}
                  _id={course._id}
                  cart={[]}
                  setCart={() => {}}
                />
              </div>
            ))}
          </div>
          {filteredCourses.length === 0 && !loading && (
            <p className="text-sm text-gray-500">No courses found matching criteria.</p>
          )}
        </section>
      )}
    </div>
  );
}
