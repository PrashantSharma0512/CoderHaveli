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
        <section className='flex flex-col items-center gap-8 py-10 bg-transparent text-white '>
            <h2 className='text-3xl font-semibold'>What Our Users Say</h2>
            <div className='bg-gray-700 p-6 rounded-lg shadow-lg w-[90%] md:w-[50%] text-center bg-gradient-to-r from-zinc-500 to-zinc-900'>
                <FaQuoteLeft className='text-blue-400 text-3xl mx-auto mb-4' />
                <p className='text-lg italic'>"{testimonials[currentIndex].feedback}"</p>
                <h4 className='mt-4 font-bold'>{testimonials[currentIndex].name}</h4>
                <p className='text-sm text-gray-400'>{testimonials[currentIndex].role}</p>
            </div>
            <button onClick={nextTestimonial} className='text-zinc-800 bg-white px-3 py-3 rounded font-semibold hover:bg-zinc-300 transition cursor-pointer'>
                Next Testimonial
            </button>
        </section>
    );
}
