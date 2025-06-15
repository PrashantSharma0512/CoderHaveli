import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { FaSignInAlt, FaUserPlus, FaLock, FaEnvelope, FaSpinner, FaCrown } from 'react-icons/fa';
import { checkLogin } from '../../store/slice/authSlice';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await dispatch(checkLogin(form)).unwrap();
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage(err || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all hover:shadow-xl">
          {/* Header with golden accent */}
          <div className="bg-white p-8 text-center border-b border-gold-200 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <div className="bg-amber-100 p-3 rounded-full inline-flex items-center justify-center mb-4 border border-amber-200">
              <FaCrown className="text-2xl text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Nexo Vision</h1>
            <p className="text-gray-600 font-medium">Premium Campus Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('success') ? 
                'bg-amber-50 text-amber-800 border border-amber-200' : 
                'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
              </div>
            )}

            <div className="space-y-5">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
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
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition duration-200 bg-white"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
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
                  Signing In...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-3" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="font-medium text-amber-600 hover:text-amber-500 transition-colors flex items-center justify-center"
              >
                <FaUserPlus className="mr-2" />
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;