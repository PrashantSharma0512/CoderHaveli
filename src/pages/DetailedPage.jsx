import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { FiClock, FiUser, FiStar, FiBookmark, FiPlay, FiCheck, FiChevronDown } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import VideoPlayer from '../components/Video/VIdeoPlayer';

// Temporary course data
const tempCourseData = {
    _id: "64a1b2c3d4e5f6a7b8c9d0e1",
    title: "Complete React Developer Course 2024",
    shortDescription: "Build modern web applications with React hooks, context API, and Redux",
    description: "Master React.js from the ground up with this comprehensive course designed for developers who want to build modern, scalable web applications. You'll learn everything from React fundamentals to advanced concepts like state management with Redux and performance optimization.\n\nBy the end of this course, you'll be able to build professional-grade React applications, understand React's ecosystem, and be prepared for React developer interviews.",
    image: {
        url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        alt: "Complete React Course"
    },
    price: 2499,
    originalPrice: 4999,
    discountPercentage: 50,
    duration: 32,
    totalVideos: 45,
    totalArticles: 18,
    totalResources: 24,
    category: {
        name: "Web Development",
        slug: "web-development"
    },
    instructor: {
        name: "Rahul Sharma",
        title: "Senior Frontend Developer at TechCorp",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        bio: "Rahul has over 8 years of experience building web applications with React. He has worked with startups and Fortune 500 companies to build scalable frontend architectures. His passion is teaching complex concepts in simple, approachable ways.",
        rating: 4.7
    },
    learningOutcomes: [
        "React fundamentals (components, props, state)",
        "Hooks (useState, useEffect, useContext, etc.)",
        "React Router for navigation",
        "State management with Redux Toolkit",
        "API integration with Axios",
        "Authentication in React apps"
    ],
    requirements: [
        "Basic knowledge of HTML, CSS, and JavaScript",
        "Node.js installed on your computer",
        "A code editor (VS Code recommended)"
    ],
    tutorials: [
        {
            _id: "64a1b2c3d4e5f6a7b8c9d0e2",
            title: "Introduction to React",
            duration: 12,
            videoUrl: "https://youtu.be/3-X6L-mCQYw?si=9XD2QL3C0fk0PaSZ",
            description: "Learn what React is and why it's so popular for building user interfaces",
            freePreview: true
        },
        {
            _id: "64a1b2c3d4e5f6a7b8c9d0e3",
            title: "Setting up your development environment",
            duration: 18,
            videoUrl: "https://youtu.be/3-X6L-mCQYw?si=9XD2QL3C0fk0PaSZ",
            description: "Configure VS Code and install necessary tools for React development",
            freePreview: false
        },
        {
            _id: "64a1b2c3d4e5f6a7b8c9d0e4",
            title: "JSX Fundamentals",
            duration: 25,
            videoUrl: "https://youtu.be/3-X6L-mCQYw?si=9XD2QL3C0fk0PaSZ",
            description: "Learn how JSX works and how it translates to JavaScript",
            freePreview: false
        }
    ],
    stats: {
        rating: 4.8,
        totalReviews: 1245,
        enrollments: 12589
    },
    certificateIncluded: true,
    lifetimeAccess: true,
    moneyBackGuarantee: true
};

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showDemoVideo, setShowDemoVideo] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setCourse(tempCourseData);
            // Initialize expanded state for all modules
            setExpandedModules({
                0: true // First module expanded by default
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [courseId]);

    const toggleModule = (index) => {
        setExpandedModules(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    const firstLesson = course.tutorials?.[0];
    console.log(firstLesson,"prashant");

    const hasDemoVideo = firstLesson?.videoUrl;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Course Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Course Thumbnail/Video */}
                    <div className="md:w-2/5 relative">
                        <img
                            src={course.image.url}
                            alt={course.image.alt}
                            className="w-full h-full object-cover"
                        />
                        {hasDemoVideo && (
                            <button
                                onClick={() => setShowDemoVideo(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group"
                            >
                                <div className="bg-white p-4 rounded-full group-hover:scale-110 transition-transform">
                                    <FiPlay className="text-indigo-600 text-2xl" />
                                </div>
                                <span className="absolute bottom-6 text-white font-medium">Preview this course</span>
                            </button>
                        )}
                    </div>

                    {/* Course Info */}
                    <div className="md:w-3/5 p-6 md:p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                    {course.category.name}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{course.shortDescription}</p>
                            </div>
                            <button className="text-gray-400 hover:text-indigo-600">
                                <FiBookmark className="text-2xl" />
                            </button>
                        </div>

                        <div className="mt-4 flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="flex text-yellow-400 mr-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className={i < Math.floor(course.stats.rating) ? "fill-current" : ""}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 dark:text-gray-300 text-sm ml-1">
                                    {course.stats.rating} ({course.stats.totalReviews.toLocaleString()} reviews)
                                </span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                <FiUser className="mr-1" /> {course.instructor.name}
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                <FiClock className="mr-1" /> {course.duration} hours
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-end mb-2">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{course.price.toLocaleString()}</span>
                                {course.originalPrice && (
                                    <span className="text-lg text-gray-500 line-through ml-2">₹{course.originalPrice.toLocaleString()}</span>
                                )}
                                {course.discountPercentage && (
                                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium ml-2 px-2 py-0.5 rounded">
                                        {course.discountPercentage}% OFF
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {course.moneyBackGuarantee ? "30-Day Money-Back Guarantee" : ""}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center">
                                Enroll Now
                            </button>
                            <button className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Video Modal */}
            {showDemoVideo && hasDemoVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl relative p-4">
                        <VideoPlayer
                            url={firstLesson.videoUrl}
                            light={course.image.url}
                            playing={true}
                            onClose={() => setShowDemoVideo(false)}
                        />
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{firstLesson.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">Preview this course - Lesson 1</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Content */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('curriculum')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'curriculum' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
                            >
                                Curriculum
                            </button>
                            <button
                                onClick={() => setActiveTab('instructor')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'instructor' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
                            >
                                Instructor
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About This Course</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{course.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What You'll Learn</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {course.learningOutcomes.map((outcome, index) => (
                                            <li key={index} className="flex items-start">
                                                <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">{outcome}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Requirements</h3>
                                    <ul className="space-y-2">
                                        {course.requirements.map((requirement, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-gray-500 dark:text-gray-400 mr-2">•</span>
                                                <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'curriculum' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {course.tutorials.length} Lessons • {course.duration} hours
                                    </h3>
                                    <button
                                        className="text-indigo-600 dark:text-indigo-400 text-sm font-medium"
                                        onClick={() => {
                                            const allExpanded = Object.values(expandedModules).every(Boolean);
                                            const newState = {};
                                            course.tutorials.forEach((_, i) => {
                                                newState[i] = !allExpanded;
                                            });
                                            setExpandedModules(newState);
                                        }}
                                    >
                                        {Object.values(expandedModules).every(Boolean) ? 'Collapse All' : 'Expand All'}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {course.tutorials.map((lesson, index) => (
                                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                            <button
                                                className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                                onClick={() => toggleModule(index)}
                                            >
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 dark:text-gray-400 mr-3 font-medium">Lesson {index + 1}</span>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                                                        <FiClock className="inline mr-1" /> {lesson.duration} min
                                                    </span>
                                                    <FiChevronDown className={`text-gray-500 transition-transform ${expandedModules[index] ? 'transform rotate-180' : ''}`} />
                                                </div>
                                            </button>

                                            {expandedModules[index] && (
                                                <div className="p-4 bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                                                    <p className="text-gray-700 dark:text-gray-300 mb-3">{lesson.description}</p>
                                                    {index === 0 && (
                                                        <button
                                                            onClick={() => setShowDemoVideo(true)}
                                                            className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium"
                                                        >
                                                            <FiPlay className="mr-2" /> Preview this lesson
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'instructor' && (
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    <img
                                        src={course.instructor.avatar}
                                        alt={course.instructor.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{course.instructor.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{course.instructor.title}</p>
                                    <div className="flex items-center mt-3">
                                        <div className="flex text-yellow-400 mr-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className={i < Math.floor(course.instructor.rating) ? "fill-current" : ""}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">{course.instructor.rating} Instructor Rating</span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 mt-4 whitespace-pre-line">{course.instructor.bio}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-8">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Includes</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="text-indigo-600 dark:text-indigo-400 mt-1 mr-3 flex-shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">{course.totalVideos} on-demand videos</span>
                                </li>
                                <li className="flex items-start">
                                    <FiBookmark className="text-indigo-600 dark:text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">{course.totalArticles} articles</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="text-indigo-600 dark:text-indigo-400 mt-1 mr-3 flex-shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">{course.totalResources} downloadable resources</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="text-indigo-600 dark:text-indigo-400 mt-1 mr-3 flex-shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-gray-300">Full lifetime access</span>
                                </li>
                                {course.certificateIncluded && (
                                    <li className="flex items-start">
                                        <svg className="text-indigo-600 dark:text-indigo-400 mt-1 mr-3 flex-shrink-0 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">Certificate of completion</span>
                                    </li>
                                )}
                            </ul>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Share this course</h3>
                                <div className="flex space-x-4">
                                    <button className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                        </svg>
                                    </button>
                                    <button className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </button>
                                    <button className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;