import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiCreditCard,
  FiLock,
  FiStar,
  FiUser,
  FiCheck,
  FiShield,
  FiVideo,
  FiClock,
  FiBook,
  FiAward,
} from "react-icons/fi";
import axios from "axios";
import axiosInstance from '../components/helper/axiosInstance';
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const userId = useSelector((state) => state.login?.userId || null);
  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");
  const type = params.get("type");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.post('/api/get-course-details', {
          id, type
        });
        // Access the data from the response structure
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchCourse();
  }, [id, type]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!course) return;

    try {
      setLoading(true);
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setLoading(false);
        toast.error("Razorpay SDK failed to load.");
      }

      const orderRes = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL || process.env.REACT_APP_BASE_URL}/api/payment/order`,
        {
          amount: course.price,
          currency: "INR",
        }
      );

      if (!orderRes.data.success || !orderRes.data.order) {
        setLoading(false);
        toast.error("Order creation failed on server.");
      }
      const { id: razorpay_order_id, amount, currency } = orderRes.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "CoderHaveli",
        description: course.title,
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            setLoading(true);
            const payload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId,
              courseId: course._id,
              amount: course.price,
            };

            const verifyRes = await axiosInstance.post(
              `${import.meta.env.VITE_BASE_URL || process.env.REACT_APP_BASE_URL}/api/payment/verify`,
              payload
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful");
            } else {
              toast.error("Payment verification failed on server.");
            }
          } catch (err) {
            console.error("verification error:", err);
            toast.error("Server verification error");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Prashant Sharma",
          email: "prashant@example.com",
          contact: "9999999999",
        },
        notes: {
          courseId: course._id,
        },
        theme: {
          color: "#f59e0b",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (resp) {
        toast.error(`Payment failed: ${resp.error?.description || "Unknown error"}`);
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("payment error:", err);
      toast.error("Something went wrong while starting payment");
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Navigation */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to Course
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <FiShield className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-amber-700 dark:text-indigo-300 bg-amber-100 dark:bg-indigo-900/50 rounded-full mb-3">
                        {course.category?.name}
                      </span>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>

                      {/* Instructor Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-indigo-500 dark:to-indigo-600 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{course.instructor?.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{course.instructor?.bio}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-amber-600 dark:text-indigo-400">₹{course.price?.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">One-time payment</div>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FiVideo className="w-4 h-4" />
                      <span>50+ lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>30+ hours</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiStar className="w-4 h-4 text-amber-400" />
                      <span>4.8 rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiAward className="w-4 h-4 text-amber-500" />
                      <span>Certificate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiBook className="w-5 h-5 mr-2 text-amber-500 dark:text-indigo-400" />
                What You'll Learn
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Full-stack web development fundamentals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">HTML, CSS, and JavaScript mastery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Node.js and MongoDB backend development</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Real-world project building</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Industry best practices</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Career-ready portfolio projects</span>
                </div>
              </div>
            </div>

            {/* Course Features */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Choose This Course</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-amber-50 dark:bg-indigo-900/30 rounded-lg">
                  <FiVideo className="w-6 h-6 text-amber-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Video Lessons</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">HD Quality</div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-indigo-900/30 rounded-lg">
                  <FiBook className="w-6 h-6 text-amber-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Resources</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Downloadable</div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-indigo-900/30 rounded-lg">
                  <FiClock className="w-6 h-6 text-amber-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Lifetime Access</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Always Updated</div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-indigo-900/30 rounded-lg">
                  <FiUser className="w-6 h-6 text-amber-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Instructor Support</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Direct Help</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FiCreditCard className="w-6 h-6 mr-2 text-amber-500 dark:text-indigo-400" />
                  Complete Enrollment
                </h3>

                {/* Order Summary */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Course Price</span>
                      <span className="font-medium">₹{course.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-amber-600 dark:text-indigo-400">₹{course.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiLock className="w-5 h-5" />
                      <span>Pay ₹{course.price?.toLocaleString()}</span>
                    </>
                  )}
                </button>

                {/* Security Notice */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <FiShield className="w-4 h-4" />
                    <span>Secure & Encrypted Payment</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You will be redirected to Razorpay's secure payment page
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">✓</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Secure</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600 dark:text-indigo-400">🔄</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Instant</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">⭐</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Trusted</div>
                    </div>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="mt-4 p-4 bg-amber-50 dark:bg-indigo-900/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <FiAward className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-gray-300">30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;