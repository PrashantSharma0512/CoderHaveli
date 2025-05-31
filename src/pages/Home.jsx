
import React, { useEffect, useState } from 'react';
import Carousel from '../components/Carousel';
import Card from '../components/Cards';
import CourseCard from '../components/CourseCards';
import TestimonialSection from '../components/Testomonial';
import FAQSection from '../components/FAQ';
import axios from 'axios';


const faqs = [
    { question: "What is CoderHaveli?", answer: "CoderHaveli is an online platform that helps developers enhance their coding skills through structured courses, tutorials, and projects." },
    { question: "Is CoderHaveli free to use?", answer: "CoderHaveli offers both free and premium courses. Many of our tutorials and coding challenges are free for all users." },
    { question: "What technologies are covered?", answer: "We cover a wide range of technologies including JavaScript, React, Node.js, Python, Java, and much more." },
    { question: "How can I get support?", answer: "You can reach out to our support team via the contact page, or join our community forum for peer assistance." }
];

function Home() {
    const [visibleCount, setVisibleCount] = useState(4);
    const showMore = () => setVisibleCount(prevCount => prevCount + 4);
    const [visibleCourseCount, setVisibleCourseCount] = useState(4);
    const showMoreCourse = () => setVisibleCourseCount(prevCount => prevCount + 4);
    const [coursesData, setCoursesData] = useState([]);
    const [carouselImages, setCarouselImages] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesResponse, carouselResponse, cardResponse] = await Promise.all([
                    axios.get('/api/get-courses', {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }),
                    axios.get('/api/get-carousel'),
                    axios.get('/api/get-card-data')
                ]);

                setCarouselImages(carouselResponse.data.map(item => item.url));
                setCoursesData(coursesResponse.data);
                setCards(cardResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen'>
            {/* <ThemeToggle /> */}

            <div className='w-full py-8'>
                <Carousel IMAGES={carouselImages} />
            </div>

            <section className='flex flex-col gap-10 p-10 max-md:p-2'>
                <center className='text-3xl font-semibold text-gray-800 dark:text-gray-100 uppercase'>Tutorials</center>
                <center className='text-3xl font-semibold text-gray-800 dark:text-gray-100 uppercase'>
                    Unlock Your <span className='text-amber-600 dark:text-indigo-400'>Potential:</span> The Ultimate Learning Journey Awaits!
                </center>
                <div className='flex flex-wrap justify-center gap-6 px-14 py-2'>
                    {cards.slice(0, visibleCount).map((card, index) => (
                        <div key={index} className='w-full sm:w-[45%] md:w-[300px] text-center'>
                            <Card {...card} />
                        </div>
                    ))}
                </div>
                {visibleCount < cards.length && (
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
                <center className='text-4xl text-gray-800 dark:text-gray-100'>
                    Step Into <span className='text-amber-600 dark:text-indigo-400'>Success:</span> Your Complete Guide to Mastery!
                </center>
                <div className='flex flex-wrap justify-center gap-6 px-14 py-2'>
                    {coursesData?.slice(0, visibleCourseCount).map((course) => (
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
                    ))}
                </div>
                {visibleCourseCount < coursesData.length && (
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