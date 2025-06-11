import React from 'react';
import Search from '../Search';
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiAccountCircleLine, RiMenu3Fill } from "react-icons/ri";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router';
import ThemeToggle from '../theme/themeToggler';
import ServerStarter from '../helper/ServerStarter';
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navItems = [
    { name: 'Home', slug: '/' },
    { name: 'Tutorial', slug: '/tutorial' },
    { name: 'Practice', slug: '/practice' },
    { name: 'Contest', slug: '/contest' },
  ];

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
            <div className="relative">
              <Search />
            </div>
            <button
              className="text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
              aria-label="Notifications"
            >
              <IoMdNotificationsOutline size={26} />
            </button>
            <button
              className="text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
              aria-label="Account"
            >
              <RiAccountCircleLine size={30} />
            </button>

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

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-4">
              <button
                className="flex items-center justify-center w-full py-2 px-4 rounded-lg bg-amber-100 dark:bg-gray-800 text-amber-600 dark:text-indigo-400 hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Notifications"
              >
                <IoMdNotificationsOutline size={22} className="mr-2" />
                Notifications
              </button>
              <button
                className="flex items-center justify-center w-full py-2 px-4 rounded-lg bg-amber-100 dark:bg-gray-800 text-amber-600 dark:text-indigo-400 hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Account"
              >
                <RiAccountCircleLine size={22} className="mr-2" />
                Account
              </button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header; 