
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FAQSection({faqs, heading}) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className='flex flex-col items-center gap-8 py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300'>
            {heading && <h2 className='text-3xl font-semibold'>Frequently Asked Questions</h2>}
            <div className='w-[90%] md:w-[60%]'>
                {faqs.map((faq, index) => (
                    <div key={index} className='mb-4 border-b border-gray-200 dark:border-gray-700 last:border-0'>
                        <button 
                            className='w-full flex justify-between items-center p-4 text-left focus:outline-none hover:bg-amber-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200' 
                            onClick={() => toggleFAQ(index)}
                        >
                            <span className='text-lg font-medium text-gray-900 dark:text-white'>{faq.question}</span>
                            {openIndex === index ? 
                                <FaChevronUp className='text-amber-500 dark:text-indigo-400' /> : 
                                <FaChevronDown className='text-gray-500 dark:text-gray-400' />
                            }
                        </button>
                        {openIndex === index && (
                            <p className='px-6 pb-4 text-gray-600 dark:text-gray-300'>{faq.answer}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}