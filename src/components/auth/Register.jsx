import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../helper/axiosInstance';
import {
  FaUser, FaEnvelope, FaPhone, FaLock,
  FaSpinner, FaArrowRight, FaPenAlt,
  FaKey, FaCheckCircle, FaClock
} from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = registration, 2 = OTP verification
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  // Handle cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/register', form);
      setMessage({ text: res.data.message, type: 'success' });
      setStep(2);
      setCooldown(60); // 60-second cooldown
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Registration failed',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/verify-registration-otp', {
        email: form.email,
        otp
      });
      setMessage({ text: res.data.message, type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Invalid OTP',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/resend-registration-otp', { email: form.email });
      setMessage({ text: res.data.message, type: 'success' });
      setCooldown(60);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to resend OTP',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all hover:shadow-xl">
          {/* Header with golden accent */}
          <div className="bg-white p-8 text-center border-b border-amber-200 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <div className="bg-amber-100 p-3 rounded-full inline-flex items-center justify-center mb-4 border border-amber-200">
              {step === 1 ? <FaPenAlt className="text-2xl text-amber-600" /> : <FaKey className="text-2xl text-amber-600" />}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {step === 1 ? 'Create Account' : 'Verify OTP'}
            </h1>
            <p className="text-gray-600 font-medium">
              {step === 1 ? 'Join Coder Haveli today' : `Enter OTP sent to ${form.email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ?
                  'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-red-50 text-red-800 border border-red-200'}`}>
                  {message.text}
                </div>
              )}

              <div className="grid gap-5">
                {/* Name Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition duration-200 bg-white"
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition duration-200 bg-white"
                  />
                </div>

                {/* Phone Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 1234567890"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition duration-200 bg-white"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength="8"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition duration-200 bg-white"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    At least 8 characters with numbers and symbols
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-6 rounded-lg shadow-sm text-lg font-semibold text-white 
                  bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 transition-all duration-300 
                  ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md'}`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Register Now <FaArrowRight className="ml-3" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="p-8 space-y-5">
              <div className="mb-6 text-center">
                <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaKey className="text-3xl text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Enter OTP</h2>
                <p className="text-gray-600">
                  We've sent a 6-digit code to <span className="font-semibold">{form.email}</span>
                </p>
              </div>

              {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ?
                  'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-red-50 text-red-800 border border-red-200'}`}>
                  {message.text}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="text-gray-400" />
                </div>
                <input
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength="6"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition duration-200 bg-white"
                />
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-6 rounded-lg shadow-sm text-lg font-semibold text-white 
                    bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 transition-all duration-300 
                    ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md'}`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                <button
                  onClick={resendOtp}
                  disabled={cooldown > 0 || isLoading}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium 
                    bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200
                    ${cooldown > 0 || isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {cooldown > 0 ? (
                    <>
                      <FaClock /> Resend in {cooldown}s
                    </>
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            {step === 1 ? (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-amber-600 hover:text-amber-500 inline-flex items-center">
                  Sign In <FaArrowRight className="ml-1 text-sm" />
                </a>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Didn't receive the OTP? Check your spam folder or{' '}
                <button
                  onClick={resendOtp}
                  disabled={cooldown > 0}
                  className={`font-medium ${cooldown > 0 ? 'text-gray-500' : 'text-amber-600 hover:text-amber-500'}`}
                >
                  resend OTP
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;