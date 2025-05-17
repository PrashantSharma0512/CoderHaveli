import React from "react";
import { CiLinkedin } from "react-icons/ci";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub, FaCode } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaCode className="text-amber-600 dark:text-indigo-400 text-2xl" />
              <h1 className="text-2xl font-bold text-amber-600 dark:text-indigo-400">CoderHaveli</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              A platform dedicated to fostering competitive coding through daily challenges and contests. 
              Join us to sharpen your skills and compete with a global community of developers.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://github.com/PrashantSharma0512"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/prashant-sharma-0216ba251/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <CiLinkedin size={20} />
              </a>
              <a
                href="https://x.com/PraShant051202"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <BsTwitterX size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/resources" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Resources
                </a>
              </li>
              <li>
                <a 
                  href="/contests" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Contests
                </a>
              </li>
              <li>
                <a 
                  href="/leaderboard" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h2>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/faq" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="/privacy" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/terms" 
                  className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Stay Updated</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter for the latest contests and updates.
            </p>
            <form className="flex flex-col space-y-3">
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright and Credits */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} CoderHaveli. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="/privacy" 
              className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a 
              href="/cookies" 
              className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-indigo-400 text-sm transition-colors duration-200"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;