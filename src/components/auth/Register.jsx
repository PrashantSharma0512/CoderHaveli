import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import axiosInstance from '../helper/axiosInstance';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSpinner, FaArrowRight, FaPenAlt } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    role: 'user' 
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/register', form);
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
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
              <FaPenAlt className="text-2xl text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600 font-medium">Join Coder Haveli today</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('success') ? 
                'bg-amber-50 text-amber-800 border border-amber-200' : 
                'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
              </div>
            )}

            <div className="grid gap-5">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
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
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
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
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 1234567890"
                  value={form.phone}
                  onChange={handleChange}
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
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition duration-200 bg-white"
                />
                <p className="mt-2 text-xs text-gray-500">
                  At least 8 characters with numbers and symbols
                </p>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the <a href="#" className="text-amber-600 hover:text-amber-500 font-medium">Terms and Conditions</a>
                </label>
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
                  Creating Account...
                </>
              ) : (
                <>
                  Register Now <FaArrowRight className="ml-3" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-amber-600 hover:text-amber-500 inline-flex items-center">
                Sign In <FaArrowRight className="ml-1 text-sm" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;