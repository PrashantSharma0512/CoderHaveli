'use client';

import React, { useEffect, useState } from 'react';
import Carousel from '../components/utils/Carousel';
import TutorialCard from '../components/cards/TutorialCard';
import CourseCard from '../components/cards/CourseCards';
import TestimonialSection from '../components/cards/Testomonial';
import FAQSection from '../components/utils/FAQ';
import axiosInstance from '../components/helper/axiosInstance';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const faqs = [
    { question: "What is CoderHaveli?", answer: "CoderHaveli is an online platform that helps developers enhance their coding skills through structured courses, tutorials, and projects." },
    { question: "Is CoderHaveli free to use?", answer: "CoderHaveli offers both free and premium courses. Many of our tutorials and coding challenges are free for all users." },
    { question: "What technologies are covered?", answer: "We cover a wide range of technologies including JavaScript, React, Node.js, Python, Java, and much more." },
    { question: "How can I get support?", answer: "You can reach out to our support team via the contact page, or join our community forum for peer assistance." }
];

// Skeleton components
const CardSkeleton = () => (
    <div className="flex-1 min-w-0 animate-pulse">
        <div className="h-32 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 sm:mb-4"></div>
        <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4 mx-auto"></div>
        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6 mx-auto"></div>
        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
    </div>
);

const CourseCardSkeleton = () => (
    <div className="flex-1 min-w-0 animate-pulse">
        <div className="h-24 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
        <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 rounded-b-lg">
            <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 sm:mb-3 w-4/5 mx-auto"></div>
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 sm:mb-3 w-1/2"></div>
            <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
        </div>
    </div>
);

const CarouselSkeleton = () => (
    <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
);

function Home() {
    const [visibleCount, setVisibleCount] = useState(4);
    const showMore = () => setVisibleCount(prevCount => prevCount + 4);
    const [visibleCourseCount, setVisibleCourseCount] = useState(4);
    const showMoreCourse = () => setVisibleCourseCount(prevCount => prevCount + 4);
    const [coursesData, setCoursesData] = useState([]);
    const [carouselImages, setCarouselImages] = useState([]);
    const [cards, setCards] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = useSelector(state => state.login.userId)


  
    useEffect(() => {

    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [coursesResponse, carouselResponse, cardResponse] = await Promise.all([
                    axiosInstance.get(`/api/get-courses?userId=${userId}`),
                    axiosInstance.get('/api/get-carousel'),
                    axiosInstance.get(`/api/get-tutorial?userId=${userId}`)
                ]);

                setCarouselImages(carouselResponse.data.map(item => item.url));
                setCoursesData(coursesResponse.data);
                setCards(cardResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };


        const fetchCart = async () => {
            try {
                const res = await axiosInstance.get(`/api/cart?id=${userId}`);
                if (res.data.success) {
                    setCart(res.data.cart || []); // Ensure it's always an array
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
                setCart([]); // Set empty array on error
            }
        };
        fetchData();
        if (userId) {
            fetchCart();
        } else {
            setCart([]); // Clear cart if no user
        }
    }, [userId]);



    return (
        <div className='bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100 min-h-screen'>
            <div className='w-full py-8'>
                {loading ? <CarouselSkeleton /> : <Carousel IMAGES={carouselImages} />}
            </div>

            <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 rounded-full mb-4">
                        Learn Without Limits
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-yellow-500">
                            Master New Skills
                        </span> <br className="hidden sm:inline" />
                        Through Our Tutorials
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Short, powerful lessons designed to give you immediate results. Perfect for quick learning sessions.
                    </p>
                </div>

                {/* UPDATED: Tutorial cards grid - 2 columns on mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))
                    ) : (
                        cards.slice(0, visibleCount).map((card, index) => (
                            <div key={index} className="group">
                                <TutorialCard {...card} />
                            </div>
                        ))
                    )}
                </div>

                {!loading && visibleCount < cards.length && (
                    <div className="text-center">
                        <button
                            onClick={showMore}
                            className="relative inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-500 dark:to-amber-600 rounded-lg hover:shadow-md overflow-hidden group cursor-pointer"
                        >
                            <span className="relative z-10">Explore More Tutorials</span>
                        </button>
                    </div>
                )}
            </section>

            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-7xl mx-auto my-12">

                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 rounded-full mb-4">
                        Deep Dive Learning
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        Comprehensive <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-yellow-500">
                            Career-Changing
                        </span> Courses
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Structured programs that take you from beginner to job-ready. Learn at your own pace with expert guidance.
                    </p>
                </div>

                {/* UPDATED: Course cards grid - 2 columns on mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-16">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <CourseCardSkeleton key={index} />
                        ))
                    ) : (
                        coursesData?.slice(0, visibleCourseCount).map((course) => (
                            <div key={course._id} className="group hover:-translate-y-1 transition-transform duration-200">
                                <CourseCard
                                    title={course.title}
                                    description={course.description}
                                    imageUrl={course.image.url}
                                    price={course.price}
                                    duration={course.duration}
                                    category={course.category.name}
                                    _id={course._id}
                                    cart={cart}
                                    setCart={setCart}
                                />
                            </div>
                        ))
                    )}
                </div>

                {!loading && visibleCourseCount < coursesData.length && (
                    <div className="text-center">
                        <button
                            onClick={showMoreCourse}
                            className="relative inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-500 dark:to-amber-600 rounded-lg shadow-xs dark:shadow-none hover:scale-105 transition-transform duration-200 overflow-hidden group"
                        >
                            <span className="relative z-10">Discover All Courses</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <svg className="w-5 h-5 ml-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                )}
            </section>

            <FAQSection faqs={faqs} heading={true} />
            <TestimonialSection />
        </div>
    )
}

export default Home;