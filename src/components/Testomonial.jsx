
import { useState } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
    { name: "Prashant Sharma", role: "Full-Stack Developer", feedback: "CoderHaveli is the perfect platform to level up your coding skills. The courses are well-structured, and the community is super supportive!" },
    { name: "Neha Sharma", role: "Frontend Engineer", feedback: "I love the way CoderHaveli explains complex topics in a simple way. It has helped me a lot in my frontend development journey." },
    { name: "Rahul Gupta", role: "Backend Developer", feedback: "Amazing content with real-world projects! CoderHaveli truly prepares you for industry-level coding challenges." },
    { name: "Priya Mehta", role: "UI/UX Designer", feedback: "Even as a designer, learning code was made easy with CoderHaveli. Highly recommended for beginners!" }
];

export default function TestimonialSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    return (
        <section className='flex flex-col items-center gap-8 py-16 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300'>
            <h2 className='text-3xl font-semibold'>What Our Users Say</h2>
            <div className='bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg w-[90%] md:w-[60%] text-center border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:shadow-xl'>
                <FaQuoteLeft className='text-amber-500 dark:text-indigo-400 text-3xl mx-auto mb-4' />
                <p className='text-lg italic'>"{testimonials[currentIndex].feedback}"</p>
                <h4 className='mt-6 font-bold text-amber-600 dark:text-indigo-400'>{testimonials[currentIndex].name}</h4>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{testimonials[currentIndex].role}</p>
            </div>
            <button 
                onClick={nextTestimonial} 
                className='text-white bg-amber-600 hover:bg-amber-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg'
            >
                Next Testimonial
            </button>
        </section>
    );
}