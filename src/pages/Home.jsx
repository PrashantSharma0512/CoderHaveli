import React, { useEffect, useState } from 'react';
import Carousel from '../components/utils/Carousel';
import TutorialCard from '../components/cards/TutorialCard';
import CourseCard from '../components/cards/CourseCards';
import TestimonialSection from '../components/cards/Testomonial';
import FAQSection from '../components/utils/FAQ';
import axiosInstance from '../components/helper/axiosInstance';
import { useSelector } from 'react-redux';

const faqs = [
    { question: "What is CoderHaveli?", answer: "CoderHaveli is an online platform that helps developers enhance their coding skills through structured courses, tutorials, and projects." },
    { question: "Is CoderHaveli free to use?", answer: "CoderHaveli offers both free and premium courses. Many of our tutorials and coding challenges are free for all users." },
    { question: "What technologies are covered?", answer: "We cover a wide range of technologies including JavaScript, React, Node.js, Python, Java, and much more." },
    { question: "How can I get support?", answer: "You can reach out to our support team via the contact page, or join our community forum for peer assistance." }
];

// Skeleton components
const CardSkeleton = () => (
    <div className="w-full sm:w-[45%] md:w-[300px] text-center animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
    </div>
);

const CourseCardSkeleton = () => (
    <div className="w-full sm:w-[45%] md:w-[300px] text-center animate-pulse">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-4/5 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-1/2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
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
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [coursesResponse, carouselResponse, cardResponse] = await Promise.all([
                    axiosInstance.get('/api/get-courses'),
                    axiosInstance.get('/api/get-carousel'),
                    axiosInstance.get('/api/get-tutorial')
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

        fetchData();
    }, []);

    return (
        <div className='bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen'>
            <div className='w-full py-8'>
                {loading ? <CarouselSkeleton /> : <Carousel IMAGES={carouselImages} />}
            </div>

            <section className='flex flex-col gap-10 p-10 max-md:p-2'>
                <center className='text-3xl font-semibold text-gray-800 dark:text-gray-100 uppercase'>Tutorials</center>
                <center className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-gray-100 uppercase px-4 leading-snug">
                    <div className="inline-block">
                        Unlock Your{' '}
                        <span className="text-amber-600 dark:text-indigo-400">Potential:</span>{' '}
                        <span className="block sm:inline">The Ultimate</span>{' '}
                        <span className="block sm:inline">Learning Journey Awaits!</span>
                    </div>
                </center>
                <div className='flex flex-wrap justify-center gap-6 px-14 py-2'>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))
                    ) : (
                        cards.slice(0, visibleCount).map((card, index) => (
                            <div key={index} className='w-full sm:w-[45%] md:w-[300px] text-center'>
                                <TutorialCard {...card} />
                            </div>
                        ))
                    )}
                </div>
                {!loading && visibleCount < cards.length && (
                    <center>
                        <button
                            onClick={showMore}
                            className='text-white bg-amber-600 hover:bg-amber-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg'
                        >
                            View More
                        </button>
                    </center>
                )}
            </section>

            <section className='flex flex-col gap-8 p-10 max-md:p-2 bg-gray-50 dark:bg-gray-800 rounded-xl mx-4 my-8 shadow-sm'>
                <center className='text-3xl font-semibold text-gray-800 dark:text-gray-100 uppercase'>Courses</center>
                <center className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-gray-100 px-4 font-semibold">
                    Step Into <br className="block sm:hidden" />
                    <span className="text-amber-600 dark:text-indigo-400">Success:</span> <br className="md:hidden" />
                    Your Complete Guide <br className="sm:hidden" />
                    to Mastery!
                </center>
                <div className='flex flex-wrap justify-center gap-6 px-14 py-2'>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <CourseCardSkeleton key={index} />
                        ))
                    ) : (
                        coursesData?.slice(0, visibleCourseCount).map((course) => (
                            <div key={course._id} className="w-full sm:w-[45%] md:w-[300px] text-center">
                                <CourseCard
                                    title={course.title}
                                    description={course.description}
                                    imageUrl={course.image.url}
                                    price={course.price}
                                    duration={course.duration}
                                    category={course.category.name}
                                />
                            </div>
                        ))
                    )}
                </div>
                {!loading && visibleCourseCount < coursesData.length && (
                    <center>
                        <button
                            onClick={showMoreCourse}
                            className='text-white bg-amber-600 hover:bg-amber-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg'
                        >
                            View More
                        </button>
                    </center>
                )}
            </section>

            <FAQSection faqs={faqs} heading={true} />
            <TestimonialSection />
        </div>
    )
}

export default Home;