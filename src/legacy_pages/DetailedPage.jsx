'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import {
  FiClock,
  FiUser,
  FiStar,
  FiBookmark,
  FiPlay,
  FiPlayCircle,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiLock,
  FiUnlock,
  FiShare2,
  FiAward,
  FiBookOpen,
  FiSearch,
  FiFilm,
  FiLayers,
  FiArrowRight,
  FiCheckSquare
} from 'react-icons/fi';
import ReactPlayer from 'react-player';
import axiosInstance from '../components/helper/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setPlaybackSession } from '../store/slice/videoSlice';

const CourseDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlId = queryParams.get('id');
  const urlType = queryParams.get('type') || 'tutorial';

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.login.userId);
  const completedLessons = useSelector((state) => state.video?.completedLessons || []);

  useEffect(() => {
    const fetchDetailedCourse = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/get-detailed-tutorial?id=${urlId}&type=${urlType}`
        );
        const data = response.data;
        setCourse(data);

        // Pre-expand the first lesson
        setExpandedModules({ 0: true });

        // Check if user is enrolled after course data is loaded
        if (userId && data?._id) {
          checkEnrollmentStatus(data._id);
        } else {
          setIsCheckingEnrollment(false);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setIsCheckingEnrollment(false);
        toast.error('Failed to load course details');
      }
    };

    if (urlId) {
      fetchDetailedCourse();
    }
  }, [urlId, urlType, userId]);

  const checkEnrollmentStatus = async (courseId) => {
    try {
      const response = await axiosInstance.get(
        `/api/check-enrollment?userId=${userId}&courseId=${courseId}&courseType=${urlType}`
      );
      setIsEnrolled(Boolean(response.data?.enrolled));
    } catch (error) {
      console.error('Error checking enrollment:', error);
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  const lessons = useMemo(() => {
    if (!course) return [];
    if (Array.isArray(course.lessons) && course.lessons.length > 0) {
      return course.lessons;
    }
    if (Array.isArray(course.tutorials) && course.tutorials.length > 0) {
      return course.tutorials;
    }
    return [];
  }, [course]);

  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const query = searchQuery.toLowerCase();
    return lessons.filter(
      (l, idx) =>
        (l.title && l.title.toLowerCase().includes(query)) ||
        (l.description && l.description.toLowerCase().includes(query)) ||
        `lesson ${idx + 1}`.includes(query)
    );
  }, [lessons, searchQuery]);

  const totalDurationMinutes = useMemo(() => {
    return lessons.reduce((acc, curr) => {
      const dur = parseInt(curr.duration, 10);
      return acc + (isNaN(dur) ? 15 : dur);
    }, 0);
  }, [lessons]);

  const formattedTotalDuration = useMemo(() => {
    if (course?.duration) return `${course.duration} hours`;
    const hours = Math.floor(totalDurationMinutes / 60);
    const mins = totalDurationMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins} mins`;
  }, [course, totalDurationMinutes]);

  const firstLesson = lessons[0];
  const hasDemoVideo = Boolean(firstLesson?.videoUrl);

  const handleWatchChapter = (lesson, lessonIndex = 0) => {
    if (!isEnrolled && lessonIndex > 0) {
      toast.error('Enroll in this course to access this lecture.');
      return;
    }

    dispatch(
      setPlaybackSession({
        courseId: course._id,
        courseTitle: course.title,
        courseImage: course.image?.url || '',
        courseType: urlType || course.type || 'tutorial',
        lessons: lessons,
        currentLessonIndex: lessonIndex,
        currentLesson: lesson,
        videoUrl: lesson.videoUrl,
      })
    );
    navigate(`/video?courseId=${course._id}&lessonIndex=${lessonIndex}`);
  };

  const handleStartCourse = () => {
    if (lessons.length === 0) {
      toast('No lessons available in this course yet.');
      return;
    }
    let targetIndex = 0;
    if (isEnrolled && completedLessons.length > 0) {
      const firstUncompleted = lessons.findIndex((_, idx) => !completedLessons.includes(idx));
      if (firstUncompleted !== -1) {
        targetIndex = firstUncompleted;
      }
    }
    handleWatchChapter(lessons[targetIndex], targetIndex);
  };

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleExpandAll = () => {
    const allExpanded = lessons.every((_, i) => expandedModules[i]);
    const newState = {};
    lessons.forEach((_, i) => {
      newState[i] = !allExpanded;
    });
    setExpandedModules(newState);
  };

  const handleEnroll = async (id) => {
    if (!userId) {
      toast.error('Please login to enroll in this course');
      navigate('/login');
      return;
    }
    try {
      const response = await axiosInstance.post('/api/enroll-now', {
        userId,
        courseId: id,
        courseType: urlType || 'tutorial',
      });

      if (response.data.success) {
        setIsEnrolled(true);
        toast.success('Successfully enrolled! Happy learning! 🚀');
      } else {
        toast.error(response.data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Enroll error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong with enrollment');
    }
  };

  const handleCancelSubscription = async (id) => {
    try {
      const response = await axiosInstance.post('/api/cancel-subscription', {
        userId,
        courseId: id,
        courseType: urlType || 'tutorial',
      });

      if (response.data.success) {
        setIsEnrolled(false);
        toast.success('Course subscription cancelled.');
      } else {
        toast.error(response.data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: `Check out this course: ${course.title} on CoderHaveli!`,
          url: url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    toast.success('Course link copied to clipboard! 📋');
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[75vh] bg-white dark:bg-gray-950">
        <div className="text-center p-8 bg-amber-50/60 dark:bg-gray-900 rounded-2xl shadow-xl border border-amber-200/80 dark:border-gray-800">
          <div className="w-14 h-14 border-4 border-amber-500 dark:border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loading Course Experience...</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Fetching curriculum, instructor insights & lectures</p>
        </div>
      </div>
    );
  }

  const defaultIncludes = [
    `${lessons.length || 0} on-demand HD video lectures`,
    'Interactive video player with auto-resume',
    'Real-time lesson completion tracking',
    'Full lifetime access on mobile & desktop',
    'Certificate of completion upon finishing',
    'Community Q&A and instructor discussions',
  ];

  const includesList =
    course.courseIncludes && course.courseIncludes.length > 0
      ? course.courseIncludes
      : defaultIncludes;

  const completedCount = lessons.filter((_, idx) => completedLessons.includes(idx)).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero Header Section - Light: White/Amber | Dark: Charcoal/Golden */}
      <div className="relative bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 text-gray-900 dark:text-white border-b border-amber-200/80 dark:border-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-4 overflow-x-auto">
            <Link to="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Home</Link>
            <span>/</span>
            <Link to="/tutorial" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Courses & Tutorials</Link>
            <span>/</span>
            {course.category?.name && (
              <>
                <span className="text-amber-700 dark:text-amber-300 font-semibold">{course.category.name}</span>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 dark:text-white truncate max-w-xs">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Hero Left Content */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                  {course.category?.name || 'Development'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                  {urlType === 'tutorial' ? 'Interactive Tutorial' : 'Comprehensive Course'}
                </span>
                {isEnrolled && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30">
                    <FiCheckCircle className="mr-1" /> Enrolled
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                {course.title}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              {/* Meta stats bar */}
              <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center text-amber-600 dark:text-amber-400 font-semibold bg-amber-100/70 dark:bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-300 dark:border-amber-500/20">
                  <span className="mr-1.5">{course?.stats?.rating ? Number(course.stats.rating).toFixed(1) : '4.9'}</span>
                  <div className="flex text-amber-500 dark:text-amber-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(course?.stats?.rating || 5)
                            ? 'fill-current text-amber-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    ({course?.stats?.totalReviews || 120}+ reviews)
                  </span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiUser className="mr-1.5 text-amber-600 dark:text-amber-400" />
                  <span>Instructor: <strong className="text-gray-900 dark:text-white">{course.instructor?.name || 'CoderHaveli Master'}</strong></span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiClock className="mr-1.5 text-amber-600 dark:text-amber-400" />
                  <span>{formattedTotalDuration}</span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiFilm className="mr-1.5 text-amber-600 dark:text-amber-400" />
                  <span>{lessons.length} Lectures</span>
                </div>
              </div>

              {/* Enrolled progress tracker */}
              {isEnrolled && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-gray-800/60 border border-amber-200 dark:border-gray-800 max-w-xl">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-medium mb-2">
                    <span className="text-amber-800 dark:text-amber-300 flex items-center font-bold">
                      <FiCheckSquare className="mr-1.5 text-amber-600 dark:text-amber-400" /> Your Learning Progress
                    </span>
                    <span className="text-gray-900 dark:text-white font-bold">{progressPercent}% Completed</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700/60 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-yellow-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mt-2">
                    <span>{completedCount} of {lessons.length} lectures finished</span>
                    <button
                      onClick={handleStartCourse}
                      className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-bold underline underline-offset-2 flex items-center"
                    >
                      Continue Learning <FiArrowRight className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hero Right Action Card */}
            <div className="lg:col-span-4 w-full">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-amber-200/80 dark:border-gray-800 overflow-hidden text-gray-900 dark:text-gray-100">
                {/* Media Thumbnail */}
                <div className="relative aspect-video group overflow-hidden bg-black">
                  <img
                    src={course.image?.url || '/course-placeholder.jpg'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                    {hasDemoVideo ? (
                      <button
                        onClick={() => setShowDemoVideo(true)}
                        className="flex flex-col items-center justify-center group/btn focus:outline-none"
                      >
                        <div className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition duration-300">
                          <FiPlay className="text-2xl ml-1 fill-current" />
                        </div>
                        <span className="mt-2 text-xs font-bold text-white tracking-wide uppercase drop-shadow">
                          Watch Free Preview
                        </span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center text-gray-300">
                        <FiFilm className="text-3xl mb-1 opacity-75" />
                        <span className="text-xs">{lessons.length} Video Lessons</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Pricing row */}
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      {course.price ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-amber-600 dark:text-white">
                            ₹{course.price.toLocaleString()}
                          </span>
                          {course.originalPrice && (
                            <span className="text-base text-gray-400 line-through">
                              ₹{course.originalPrice.toLocaleString()}
                            </span>
                          )}
                          {course.discountPercentage && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                              {course.discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-amber-600 dark:text-amber-400">Free</span>
                          <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-300 dark:border-amber-800">
                            Full Access
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setIsBookmarked(!isBookmarked);
                          toast.success(isBookmarked ? 'Removed from saved courses' : 'Course saved to wishlist!');
                        }}
                        className={`p-2.5 rounded-xl border transition ${
                          isBookmarked
                            ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-amber-600 hover:border-amber-300 dark:hover:text-amber-400'
                        }`}
                        title="Bookmark course"
                      >
                        <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-amber-600 hover:border-amber-300 dark:hover:text-amber-400 transition"
                        title="Share course"
                      >
                        <FiShare2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Primary CTA button */}
                  <div className="space-y-3">
                    {isCheckingEnrollment ? (
                      <div className="w-full py-3.5 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <div className="w-5 h-5 border-2 border-amber-500 dark:border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : isEnrolled ? (
                      <>
                        <button
                          onClick={handleStartCourse}
                          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-500 dark:to-amber-600 dark:hover:from-amber-600 dark:hover:to-amber-700 shadow-lg shadow-amber-500/25 dark:shadow-amber-500/30 transition flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <FiPlay className="fill-current text-sm" />
                          <span>{progressPercent > 0 ? 'Resume Learning' : 'Start Course Now'}</span>
                        </button>
                        <button
                          onClick={() => handleCancelSubscription(course._id)}
                          className="w-full py-2 text-xs text-rose-500 hover:text-rose-600 hover:underline transition"
                        >
                          Leave course / Cancel enrollment
                        </button>
                      </>
                    ) : urlType === 'tutorial' || !course.price ? (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-500 dark:to-amber-600 dark:hover:from-amber-600 dark:hover:to-amber-700 shadow-lg shadow-amber-500/25 dark:shadow-amber-500/25 transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <FiUnlock className="text-base" />
                        <span>Enroll Now • Start Learning</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate(`/checkout?courseId=${course._id}`)}
                          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-500 dark:to-amber-600 shadow-lg shadow-amber-500/25 dark:shadow-amber-500/30 transition flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <span>Buy Now • Instant Access</span>
                        </button>
                        <button
                          onClick={() => toast.success('Added to cart!')}
                          className="w-full py-2.5 px-6 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-gray-800 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    )}
                  </div>

                  {course.price && (
                    <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                      🔒 30-Day Money-Back Guarantee • Lifetime Access
                    </p>
                  )}

                  {/* Course Features List */}
                  <div className="mt-6 pt-6 border-t border-amber-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-gray-400 mb-3">
                      This course includes:
                    </h4>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      {includesList.slice(0, 5).map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <FiCheck className="text-amber-600 dark:text-amber-400 mt-0.5 mr-2.5 flex-shrink-0 text-base font-bold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs & Syllabus */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 space-x-2 sm:space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: FiBookOpen },
                { id: 'curriculum', label: `Curriculum (${lessons.length})`, icon: FiLayers },
                { id: 'instructor', label: 'Instructor', icon: FiUser },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 sm:px-4 border-b-2 font-bold text-sm sm:text-base flex items-center space-x-2 transition ${
                      isActive
                        ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400'
                        : 'border-transparent text-gray-600 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-300'
                    }`}
                  >
                    <Icon className="text-base" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                {/* About Section */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-100 dark:border-gray-800">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    About This Course
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {course.about || course.description}
                  </div>
                </div>

                {/* What you'll learn */}
                {course?.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div className="bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-200/80 dark:border-amber-900/40">
                    <h3 className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-white mb-6 flex items-center">
                      <FiAward className="text-amber-600 dark:text-amber-400 mr-2.5" />
                      What You'll Learn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.whatYouWillLearn.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start p-3.5 bg-white dark:bg-gray-800/80 rounded-xl border border-amber-100 dark:border-gray-700/60 shadow-xs"
                        >
                          <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold">
                            <FiCheck className="text-xs" />
                          </div>
                          <span className="text-sm text-gray-800 dark:text-gray-300 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites / Requirements */}
                {course?.requirements && course.requirements.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-100 dark:border-gray-800">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Requirements & Prerequisites
                    </h3>
                    <ul className="space-y-3">
                      {course.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 mt-2 mr-3 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                {/* Curriculum Header Controls */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-amber-100 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100 dark:border-gray-800">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <FiFilm className="text-amber-600 dark:text-amber-400 mr-2" />
                        Course Lectures
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {lessons.length} Lectures • {formattedTotalDuration} total length
                        {isEnrolled && ` • ${completedCount} completed`}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={toggleExpandAll}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                      >
                        {lessons.every((_, i) => expandedModules[i]) ? 'Collapse All' : 'Expand All'}
                      </button>

                      {isEnrolled && (
                        <button
                          onClick={handleStartCourse}
                          className="text-xs font-bold bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-lg flex items-center shadow-xs transition"
                        >
                          <FiPlay className="mr-1 fill-current" /> Play First
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search Bar within Curriculum */}
                  <div className="mt-4 relative">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search lecture titles or concepts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-amber-50/40 dark:bg-gray-800 border border-amber-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-500 text-gray-900 dark:text-white"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-amber-600 dark:hover:text-gray-200"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Lecture Accordion List */}
                <div className="space-y-3">
                  {filteredLessons.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-amber-100 dark:border-gray-800">
                      <FiSearch className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        No lectures found matching "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    filteredLessons.map((lesson, index) => {
                      const isCompleted = completedLessons.includes(index);
                      const isUnlocked = isEnrolled || index === 0;
                      const isExpanded = Boolean(expandedModules[index]);

                      return (
                        <div
                          key={index}
                          className={`rounded-2xl transition duration-200 border ${
                            isExpanded
                              ? 'border-amber-400 dark:border-amber-700/70 shadow-sm'
                              : 'border-gray-200 dark:border-gray-800'
                          } bg-white dark:bg-gray-900 overflow-hidden`}
                        >
                          {/* Row Header */}
                          <div
                            onClick={() => toggleModule(index)}
                            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-amber-50/50 dark:hover:bg-gray-800/40 transition"
                          >
                            <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                              {/* Status Icon */}
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                                  isCompleted
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                    : isUnlocked
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                }`}
                              >
                                {isCompleted ? (
                                  <FiCheck className="text-base font-black" />
                                ) : isUnlocked ? (
                                  <FiPlayCircle className="text-base" />
                                ) : (
                                  <FiLock className="text-sm" />
                                )}
                              </div>

                              {/* Title & Metadata */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                    Lesson {index + 1}
                                  </span>
                                  {index === 0 && !isEnrolled && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/20">
                                      Free Preview
                                    </span>
                                  )}
                                  {isCompleted && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                                      Completed
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate mt-0.5">
                                  {lesson.title}
                                </h4>
                              </div>
                            </div>

                            {/* Duration & Expand Chevron */}
                            <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline-flex items-center">
                                <FiClock className="mr-1 text-amber-600 dark:text-amber-400" />
                                {lesson.duration ? `${lesson.duration} min` : '15 min'}
                              </span>

                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-transform ${
                                  isExpanded ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''
                                }`}
                              >
                                <FiChevronDown />
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content Drawer */}
                          {isExpanded && (
                            <div className="px-5 pb-5 pt-1 border-t border-amber-100 dark:border-gray-800 bg-amber-50/30 dark:bg-gray-800/30">
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                {lesson.description ||
                                  lesson.content ||
                                  'In this lecture, you will explore comprehensive key concepts, implement practical patterns, and review modern code architectures.'}
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                                  <FiFilm className="mr-1.5 text-amber-600 dark:text-amber-400" />
                                  Format: Video Lecture ({lesson.duration ? `${lesson.duration} min` : '15 min'})
                                </div>

                                {isUnlocked ? (
                                  <button
                                    onClick={() => handleWatchChapter(lesson, index)}
                                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-500 dark:to-amber-600 shadow-sm flex items-center space-x-2 transition cursor-pointer"
                                  >
                                    <FiPlay className="fill-current text-xs" />
                                    <span>{index === 0 && !isEnrolled ? 'Play Free Preview' : 'Play Lecture'}</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleEnroll(course._id)}
                                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-amber-700 bg-amber-100 border border-amber-300 hover:bg-amber-200 dark:text-amber-400 dark:bg-amber-950/70 dark:border-amber-800 dark:hover:bg-amber-900 transition flex items-center space-x-1.5 cursor-pointer"
                                  >
                                    <FiLock className="text-xs" />
                                    <span>Enroll to Unlock</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Enrollment Teaser if not enrolled */}
                {!isEnrolled && (
                  <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-900/90 dark:to-yellow-950 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="text-center sm:text-left">
                        <h4 className="text-xl font-bold">Ready to master this topic?</h4>
                        <p className="mt-1 text-sm text-amber-50 dark:text-amber-200 max-w-lg">
                          Get immediate access to all {lessons.length} video lectures, source files, and community access.
                        </p>
                      </div>
                      <button
                        onClick={() => (urlType === 'tutorial' || !course.price ? handleEnroll(course._id) : navigate(`/checkout?courseId=${course._id}`))}
                        className="px-6 py-3 rounded-xl font-bold text-amber-900 dark:text-amber-950 bg-white hover:bg-amber-50 shadow-md transition flex items-center space-x-2 flex-shrink-0 cursor-pointer"
                      >
                        <span>{urlType === 'tutorial' || !course.price ? 'Enroll for Free' : 'Unlock Full Course'}</span>
                        <FiArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Instructor */}
            {activeTab === 'instructor' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-500 dark:to-amber-600 p-0.5 shadow-md flex-shrink-0">
                    <img
                      src={course?.instructor?.image?.url || '/default-avatar.png'}
                      alt={course?.instructor?.name || 'Instructor'}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {course.instructor?.name || 'Lead Software Engineer'}
                        </h3>
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                          {course.instructor?.title || 'Senior Full-Stack Architect & Educator'}
                        </p>
                      </div>
                      <div className="flex items-center justify-center sm:justify-end text-amber-600 dark:text-amber-400 font-bold text-sm bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-300 dark:border-amber-500/20">
                        <FiStar className="mr-1 fill-current text-amber-500" />
                        <span>{course.instructor?.rating || '4.9'} Rating</span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {course.instructor?.bio ||
                        'Passionate software developer and mentor with years of experience building scalable production platforms, algorithms, and web applications. Committed to helping developers elevate their engineering skills through practical project-driven courses.'}
                    </p>

                    <div className="mt-6 pt-6 border-t border-amber-100 dark:border-gray-800 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <div className="flex items-center">
                        <FiBookOpen className="mr-1.5 text-amber-600 dark:text-amber-400" />
                        <span>Multiple Published Courses</span>
                      </div>
                      <div className="flex items-center">
                        <FiUser className="mr-1.5 text-amber-600 dark:text-amber-400" />
                        <span>5,000+ Happy Students</span>
                      </div>
                      <div className="flex items-center">
                        <FiAward className="mr-1.5 text-amber-600 dark:text-amber-400" />
                        <span>Verified Instructor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (Desktop sticky features) */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Instructor Mini Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-amber-100 dark:border-gray-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-gray-400 mb-4">Instructor</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-100 dark:bg-gray-800 flex-shrink-0">
                    <img
                      src={course?.instructor?.image?.url || '/default-avatar.png'}
                      alt={course.instructor?.name || 'Instructor'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-gray-900 dark:text-white truncate">
                      {course.instructor?.name || 'CoderHaveli Instructor'}
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {course.instructor?.title || 'Senior Software Engineer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Highlights & Guarantees */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-amber-100 dark:border-gray-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-gray-400 mb-4">Why Take This Course</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mr-3">
                      <FiFilm className="text-sm" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white">Structured Curriculum</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        Step-by-step guidance designed from foundations to advanced topics.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mr-3">
                      <FiAward className="text-sm" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white">Certificate Included</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        Receive a shareable certificate of completion to showcase on LinkedIn.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mr-3">
                      <FiClock className="text-sm" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white">Learn At Your Own Pace</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        Lifetime access with progress tracking anytime, anywhere.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Video Modal */}
      {showDemoVideo && hasDemoVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl relative overflow-hidden shadow-2xl border border-amber-200 dark:border-gray-800">
            {/* Modal Header */}
            <div className="p-4 flex items-center justify-between border-b border-amber-100 dark:border-gray-800 bg-amber-50/70 dark:bg-gray-950/70">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                  Preview
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate max-w-md">
                  {firstLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setShowDemoVideo(false)}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Player Container */}
            <div className="aspect-video bg-black relative">
              <ReactPlayer
                url={firstLesson.videoUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/60 dark:bg-gray-950/80">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Watching Preview Lesson 1 of {lessons.length}. Enroll to unlock the full course curriculum.
              </p>
              <button
                onClick={() => {
                  setShowDemoVideo(false);
                  if (!isEnrolled) {
                    if (urlType === 'tutorial' || !course.price) {
                      handleEnroll(course._id);
                    } else {
                      navigate(`/checkout?courseId=${course._id}`);
                    }
                  } else {
                    handleWatchChapter(firstLesson, 0);
                  }
                }}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white transition flex-shrink-0 cursor-pointer shadow-amber-500/20"
              >
                {isEnrolled ? 'Open in Player' : 'Enroll Now to Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;