import React, { useState } from 'react';
import { FiBookmark, FiClock, FiStar, FiUser, FiCreditCard, FiLock, FiCheck, FiArrowLeft, FiBookOpen } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const course = {
  category: {
    name: "Web Development"
  },
  instructor: {
    name: "Anjali Sharma",
    bio: "Senior Developer with 8+ years of experience in MERN stack"
  },
  duration: "42",
  title: 'Master the MERN Stack - From Beginner to Expert',
  description: "Learn how to build modern, full-stack applications using MongoDB, Express.js, React, and Node.js. This comprehensive course will take you from fundamentals to advanced concepts with hands-on projects.",
  originalPrice: 12999,
  discountPercentage: 60,
  price: 5199,
  stats: {
    rating: 4.8,
    students: 3250,
    reviews: 420
  },
  lessons: 85,
  projects: 12,
  level: "Intermediate",
  lastUpdated: "October 2023"
};

function Checkout() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  // const checkoutCourse = useSelector(state => state.course)
  // console.log(checkoutCourse, "this data comes from redux");

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiry(value);
  };

  const handleRazorpayPayment = () => {
    // This would integrate with the actual Razorpay API
    console.log("Initiating Razorpay payment...");
    alert("Redirecting to Razorpay checkout...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center mb-8">
          <h2 className="ml-8 text-gray-600 dark:text-gray-300 flex items-center" onClick={() => window.history.back()}>
            <FiArrowLeft className="mr-2" /> Back to course
          </h2>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Course Details Section */}
            <div className="md:w-2/5 p-6 md:p-8 border-r border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {course.category.name}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={i < Math.floor(course?.stats?.rating) ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 ml-1 text-sm">
                    {course.stats.rating} ({course.stats.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiUser className="mr-1" /> {course.stats.students.toLocaleString()}+ students
                </div>
              </div>

              <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3 flex items-center">
                  <FiUser className="mr-2" /> Instructor: {course.instructor.name}
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  {course.instructor.bio}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiClock className="mr-2 text-indigo-500" /> {course.duration} hours
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiBookmark className="mr-2 text-indigo-500" /> {course.lessons} lessons
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiCheck className="mr-2 text-indigo-500" /> {course.projects} projects
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiStar className="mr-2 text-indigo-500" /> {course.level}
                </div>
              </div>

              <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What's included</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FiCheck className="mr-2 text-green-500" /> {course.duration} hours on-demand video
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FiCheck className="mr-2 text-green-500" /> 15 coding exercises
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FiCheck className="mr-2 text-green-500" /> Full lifetime access
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FiCheck className="mr-2 text-green-500" /> Certificate of completion
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FiCheck className="mr-2 text-green-500" /> Q&A support
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <div className="flex items-end mb-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {course?.price ? '₹' + course?.price?.toLocaleString() : ''}
                  </span>
                  {course.originalPrice && (
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {course.discountPercentage && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium ml-2 px-2 py-0.5 rounded">
                      {course.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                {course.price ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    30-Day Money-Back Guarantee
                  </p>
                ) : ""}
              </div>
            </div>

            {/* Payment Section */}
            <div className="md:w-3/5 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FiCreditCard className="mr-2" /> Complete Enrollment
              </h2>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 flex items-center">
                <FiLock className="text-blue-500 mr-2" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Secure payment encrypted with SSL technology
                </span>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedPayment('card')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${selectedPayment === 'card' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300'}`}
                  >
                    <div className="flex flex-col items-center">
                      <FiCreditCard className="text-xl mb-2 text-indigo-600" />
                      <span className='dark:text-white'>Credit/Debit Card</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedPayment('razorpay')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${selectedPayment === 'razorpay' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300'}`}
                  >
                    <div className="flex flex-col items-center">
                      {/* <svg className="h-6 mb-2" viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.836 7.667H30.58V27.371H24.836V7.667ZM53.179 27.371V7.667H58.951V22.451H68.611V27.371H53.179ZM77.068 27.371V7.667H96.124V12.587H82.84V15.227H95.38V19.907H82.84V22.451H96.124V27.371H77.068ZM13.3 27.371L6.7 17.519L13.156 7.667H17.884L12.7 16.235H12.82L18.148 7.667H22.876L16.276 17.519L22.876 27.371H18.064L12.676 18.683H12.556L7.276 27.371H13.3Z" fill="#2D8CFF" />
                        <rect x="0.7" y="0.7" width="98.6" height="33.6" rx="4.3" stroke="#2D8CFF" strokeWidth="1.4" />
                      </svg> */}
                      <img
                        src="https://razorpay.com/assets/razorpay-glyph.svg"
                        alt="Razorpay"
                        className="h-6 mr-2 bg-transparent p-1 rounded"
                      />
                      <span className='dark:text-white'>Razorpay</span>
                    </div>
                  </button>
                </div>
              </div>

              {selectedPayment === 'card' ? (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={saveCard}
                      onChange={() => setSaveCard(!saveCard)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Save card for future payments
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Pay ₹{course.price.toLocaleString()}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Fast Checkout with Razorpay</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      You'll be redirected to Razorpay's secure payment page to complete your purchase with multiple payment options including UPI, Net Banking, and Wallet.
                    </p>
                  </div>

                  <button
                    onClick={handleRazorpayPayment}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                  >
                    <svg className="h-6 mr-2 bg-white p-1 rounded" viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24.836 7.667H30.58V27.371H24.836V7.667ZM53.179 27.371V7.667H58.951V22.451H68.611V27.371H53.179ZM77.068 27.371V7.667H96.124V12.587H82.84V15.227H95.38V19.907H82.84V22.451H96.124V27.371H77.068ZM13.3 27.371L6.7 17.519L13.156 7.667H17.884L12.7 16.235H12.82L18.148 7.667H22.876L16.276 17.519L22.876 27.371H18.064L12.676 18.683H12.556L7.276 27.371H13.3Z" fill="white" />
                    </svg>
                    Pay ₹{course.price.toLocaleString()} with Razorpay
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You will be redirected to Razorpay to complete payment securely
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">After enrolling, you get:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <FiCheck className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Instant access to all {course.lessons} lessons and {course.projects} projects</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Downloadable resources and source code</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Priority support in student community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2023 CoderHaveli. All rights reserved. | Terms of Service | Privacy Policy</p>
        </footer>
      </div>
    </div>
  );
}

export default Checkout;