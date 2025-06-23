import React, { useState } from 'react';
import Search from '../Search';
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiAccountCircleLine, RiMenu3Fill } from "react-icons/ri";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router';
import ThemeToggle from '../theme/themeToggler';
import ServerStarter from '../helper/ServerStarter';
import Logout from '../auth/Logout';
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { isAuthenticated, userId, role } = useSelector((state) => state?.login);

  // Mock user data - replace with your actual user data
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg" // null if no avatar
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
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      {user && (
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 flex items-center"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <FaUser className="mr-2" /> View Profile
                      </Link>
                      <Logout className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 flex items-center">
                        <FaSignOutAlt className="mr-2" /> Logout
                      </Logout>
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
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">

                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 flex items-center"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <FaUser className="mr-2" /> login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 flex items-center"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <FaUser className="mr-2" /> Register
                      </Link>
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
          <DrawerHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-amber-600 dark:text-indigo-400">CoderHaveli</span>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
          </DrawerHeader>

          <DrawerBody className="p-4">
            <div className="mb-4">
              <Search />
            </div>

            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.slug}
                    onClick={onClose}
                    className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-800 text-lg font-medium transition-colors duration-200"
                    activeClassName="bg-amber-100 dark:bg-gray-800 text-amber-600 dark:text-indigo-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            {
              isAuthenticated ?
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* User Profile Section */}
                  {user && (
                    <div className="flex items-center px-4 py-3 mb-4 rounded-lg bg-amber-50 dark:bg-gray-800">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="User profile"
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <RiAccountCircleLine size={40} className="mr-3 text-amber-600 dark:text-indigo-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/profile"
                      onClick={onClose}
                      className="flex items-center justify-center py-2 px-4 rounded-lg bg-amber-100 dark:bg-gray-800 text-amber-600 dark:text-indigo-400 hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <Logout
                      className="flex items-center justify-center py-2 px-4 rounded-lg bg-amber-100 dark:bg-gray-800 text-amber-600 dark:text-indigo-400 hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </Logout>
                  </div>
                </div>
                :
                <Link to={'/login'}>Login</Link>
            }

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;