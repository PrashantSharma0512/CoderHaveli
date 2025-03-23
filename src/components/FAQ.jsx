import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';



export default function FAQSection({faqs ,heading}) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className='flex flex-col items-center gap-6 py-10 bg-transparent text-white'>
            {heading && <h2 className='text-3xl font-semibold'>Frequently Asked Questions</h2>}
            <div className='w-[90%] md:w-[60%]'>
                {faqs.map((faq, index) => (
                    <div key={index} className='mb-4 border-b border-gray-700'>
                        <button 
                            className='w-full flex justify-between items-center p-4 text-left focus:outline-none' 
                            onClick={() => toggleFAQ(index)}
                        >
                            <span className='text-lg'>{faq.question}</span>
                            {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {openIndex === index && (
                            <p className='px-4 pb-4 text-gray-400'>{faq.answer}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
