import React, { useEffect, useState } from 'react'
import Carousel from '../components/Carousel'
import Card from '../components/Cards'
// import CourseCard from '../components/CourseCard'
import CourseCard from '../components/CourseCards'
import TestimonialSection from '../components/Testomonial';
import FAQSection from '../components/FAQ';
import axios from 'axios';

// const cards = [
//     { image: "https://i.pinimg.com/originals/e1/64/72/e16472bbf6ad6e9f11ff24a4203859fc.jpg", title: 'React Domination', description: 'A popular JavaScript library for building interactive user interfaces. It allows developers to create reusable UI components and manage the application state efficiently.' },
//     { image: "https://i.ytimg.com/vi/jS4aFq5-91M/maxresdefault.jpg", title: 'JavaScript Domination', description: 'A versatile programming language that enables dynamic and interactive functionality on websites. It is widely used for both front-end and back-end development.' },
//     { image: "https://i.ytimg.com/vi/7S73WERRqO4/maxresdefault.jpg", title: 'Docker Domination', description: 'A platform for containerizing applications, ensuring they run consistently across different environments. It simplifies application deployment by bundling code, dependencies, and configurations into lightweight containers.' },
//     { image: "https://codeforgeek.com/wp-content/uploads/2024/06/Next.-js-Introduction-2-768x432.png", title: 'Next Js Domination', description: 'A powerful React framework for server-rendered and static web applications. It offers features like server-side rendering (SSR), static site generation (SSG), API routes, and optimized performance out of the box.' },
//     { image: "https://codeforgeek.com/wp-content/uploads/2024/06/Next.-js-Introduction-2-768x432.png", title: 'Next Js Domination', description: 'A powerful React framework for server-rendered and static web applications. It offers features like server-side rendering (SSR), static site generation (SSG), API routes, and optimized performance out of the box.' },

// ];
const courses = [
    { src: "https://ionicframework.com/docs/icons/logo-react-icon.png", title: 'React Domination', price: '$599', },
    { src: "https://th.bing.com/th/id/OIP.fjcsTxbLDrOcsERTcXlp0AAAAA?w=400&h=400&rs=1&pid=ImgDetMain", title: 'JavaScript Domination', price: '$599' },
    { src: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/nextjs-icon.png", title: 'Docker Domination', price: '$599' },
    { src: "https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/187_Js-1024.png", title: 'Next Js Domination', price: '$599' },
    { src: "https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/187_Js-1024.png", title: 'Next Js Domination', price: '$599' },
]

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
    const [cards , setCards] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesResponse, carouselResponse, cardResponse] = await Promise.all([
                    axios.get('http://localhost:3000/api/get-courses'),
                    axios.get('http://localhost:3000/api/get-carousel'),
                    axios.get('http://localhost:3000/api/get-card-data')
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
        <div className='bg-gray-950'>
            <div className='w-full py-8'>
                <Carousel IMAGES={carouselImages} />
            </div>
            <br />

            <section className='flex flex-col gap-10 p-10 max-md:p-2'>
                <center className='text-3xl font-semibold text-white uppercase'>Tutorials</center>
                <center className='text-3xl font-semibold text-white uppercase'>Unlock Your <span className='text-red-500'>Potential:</span> The Ultimate Learning Journey Awaits!</center>
                <div className='flex flex-wrap justify-between gap-2 px-14 py-2 max-md:justify-center'>
                    {cards.slice(0, visibleCount).map((card, index) => (
                        <div key={index} className='w-[300px] text-center'>
                            <Card {...card} />
                        </div>
                    ))}
                </div>
                {visibleCount < cards.length && (
                    <center >
                        <button onClick={showMore} className='text-zinc-800 bg-white px-5 py-2 rounded font-semibold hover:bg-zinc-300 transition cursor-pointer'>
                            View More
                        </button>
                    </center>
                )}
            </section>
            <br /><br /><br />
            <section className='flex flex-col gap-8 p-10 max-md:p-2'>
                <center className='text-3xl font-semibold text-white uppercase'>Course</center>
                <center className='text-4xl text-white'>Step Into <span className='text-red-500'>Success: </span> Your Complete Guide to Mastery!</center>
                <div className='flex flex-wrap justify-between gap-2 px-14 py-2 max-md:justify-center'>
                    {/* {courses.slice(0, visibleCourseCount).map((course, index) => (
                        <div key={index} className='w-[300px] text-center'>
                            <CourseCard {...course} />
                        </div>
                    ))} */}

                    {coursesData?.slice(0, visibleCount).map((course) => (
                        <div key={course._id} className="w-[300px] text-center">
                            <CourseCard
                                title={course.title}
                                description={course.description}
                                imageUrl={course.image.url}
                                price={course.price}
                                duration={course.duration}
                            />
                        </div>
                    ))}
                </div>
                {visibleCourseCount < coursesData.length && (
                    <center >
                        <button onClick={showMoreCourse} className='text-zinc-800 bg-white px-5 py-2 rounded font-semibold hover:bg-zinc-300 transition cursor-pointer'>
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



export default Home