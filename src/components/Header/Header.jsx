import React, { useEffect, useState } from 'react';
import Search from '../utils/Search';
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiAccountCircleLine, RiMenu3Fill } from "react-icons/ri";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router';
import ThemeToggle from '../theme/themeToggler';
import ServerStarter from '../helper/ServerStarter';
import Logout from '../auth/Logout';
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from 'react-redux';
import axiosInstance from '../helper/axiosInstance';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { isAuthenticated, userId, role } = useSelector((state) => state?.login);

  // Mock user data - replace with your actual user data
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg" // null if no avatar
  });

  const navItems = [
    { name: 'Home', slug: '/' },
    { name: 'Tutorial', slug: '/tutorial' },
    { name: 'Practice', slug: '/practice' },
    { name: 'Contest', slug: '/contest' },
  ];

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axiosInstance.get(`/api/get-profile?id=${userId}`)
      setUser(response.data.user)
    }
    fetchUser()
  }, [userId])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900 transition-colors duration-300 dark:border-b dark:border-white">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo - Centered on mobile */}
          <Link
            to="/"
            className="text-3xl font-bold text-amber-600 dark:text-indigo-400 max-md:mx-auto"
            aria-label="CoderHaveli Home"
          >
            CoderHaveli
          </Link>

          {/* theme toggler */}
          <ThemeToggle />

          {/* Server Restarter */}
          <ServerStarter />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.slug}
                    className="text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-indigo-400 text-lg font-medium transition-colors duration-200"
                    activeClassName="text-amber-600 dark:text-indigo-400 font-semibold"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Right Side Items */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              className="text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <IoMdNotificationsOutline size={26} />
            </button>

            {/* Account Button with Dropdown */}
            {
              isAuthenticated ?
                <div className="relative">
                  <button
                    onClick={toggleAccountMenu}
                    className="flex items-center text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                    aria-label="Account"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <RiAccountCircleLine size={30} />
                    )}
                  </button>

                  {/* Account Dropdown Menu */}
                  {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 origin-top-right">
                      {/* User Profile Section */}
                      {user && (
                        <div className="px-4 py-3 bg-gradient-to-r from-amber-50/50 to-amber-100/30 dark:from-gray-700 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover mr-3 border-2 border-amber-200 dark:border-gray-600"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-gray-700 flex items-center justify-center mr-3 border-2 border-amber-200 dark:border-gray-600">
                                <RiAccountCircleLine className="text-amber-500 dark:text-gray-400 text-xl" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50/50 dark:hover:bg-gray-700/80 transition-colors"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <div className="p-1.5 mr-2 rounded-md bg-amber-100/50 dark:bg-gray-700">
                            <FaUser className="text-amber-600 dark:text-indigo-400 text-xs" />
                          </div>
                          <span>Profile</span>
                          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">↗</span>
                        </Link>

                        <div className="border-t border-gray-100 dark:border-gray-700 mx-3 my-1"></div>

                        <Logout
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50/50 dark:hover:bg-gray-700/80 transition-colors"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <div className="p-1.5 mr-2 rounded-md bg-amber-100/50 dark:bg-gray-700">
                            <FaSignOutAlt className="text-amber-600 dark:text-indigo-400 text-xs" />
                          </div>
                          <span>Logout</span>
                        </Logout>
                      </div>
                    </div>
                  )}
                </div>
                :
                <div className="relative">
                  <button
                    onClick={toggleAccountMenu}
                    className="flex items-center text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                    aria-label="Account"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <RiAccountCircleLine size={30} />
                    )}
                  </button>

                  {/* Account Dropdown Menu */}
                  {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 origin-top-right">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-amber-50/30 dark:bg-gray-700/50">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Welcome to CoderHaveli</p>
                        <p className="text-sm text-amber-600 dark:text-indigo-400 mt-1">Sign in to continue</p>
                      </div>

                      <Link
                        to="/login"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50/50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <FaUser className="mr-3 text-amber-500 dark:text-indigo-400" />
                        <div>
                          <p className="font-medium">Login</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Access your account</p>
                        </div>
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-700">
                        <Link
                          to="/register"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50/50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          <svg className="mr-3 text-amber-500 dark:text-indigo-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <div>
                            <p className="font-medium">Register</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Create new account</p>
                          </div>
                        </Link>
                      </div>

                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30">
                        By continuing, you agree to our Terms
                      </div>
                    </div>
                  )}
                </div>
            }

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onOpen}
            className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
            aria-label="Open menu"
          >
            <RiMenu3Fill size={28} />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerContent className="bg-white dark:bg-gray-900">
          <DrawerHeader className="border-b border-gray-200 dark:border-gray-700 flex justify-between items-center p-4">
            <span className="text-2xl font-bold text-amber-600 dark:text-indigo-400">CoderHaveli</span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </DrawerHeader>

          <DrawerBody className="p-0 flex flex-col h-full">
            {/* Search Bar */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Search mobile={true} />
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="py-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.slug}
                      onClick={onClose}
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-amber-50/50 dark:hover:bg-gray-800 transition-colors"
                      activeClassName="bg-amber-100/50 dark:bg-gray-800 text-amber-600 dark:text-indigo-400"
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              {isAuthenticated ? (
                <>
                  {/* User Profile */}
                  <div className="flex items-center mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User profile"
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <RiAccountCircleLine className="text-amber-600 dark:text-indigo-400 text-2xl" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/profile"
                      onClick={onClose}
                      className="flex items-center justify-center py-2 px-4 rounded-lg bg-amber-50 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors text-amber-600 dark:text-indigo-400"
                    >
                      <FaUser className="mr-2" />
                      <span>Profile</span>
                    </Link>
                    <Logout
                      onClick={onClose}
                      className="flex items-center justify-center py-2 px-4 rounded-lg bg-amber-50 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors text-amber-600 dark:text-indigo-400"
                    >
                      <FaSignOutAlt className="mr-2" />
                      <span>Logout</span>
                    </Logout>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="block w-full py-2.5 px-4 rounded-lg bg-amber-600 dark:bg-indigo-600 hover:bg-amber-700 dark:hover:bg-indigo-700 text-white text-center font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="block w-full py-2.5 px-4 rounded-lg border border-amber-600 dark:border-indigo-600 text-amber-600 dark:text-indigo-400 hover:bg-amber-50/50 dark:hover:bg-gray-800 text-center font-medium transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;