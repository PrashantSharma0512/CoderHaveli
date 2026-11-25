'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiLinkedin } from "react-icons/ci";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub, FaCode } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MailCheck, UserPlus, X } from "lucide-react";
import toast from '@/components/common/CoderHaveliToast';
import axiosInstance from "@/components/helper/axiosInstance";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSubscribing(true);
      const res = await axiosInstance.post("/api/newsletter/subscribe-by-email", {
        email: trimmed
      });

      if (res.data?.registered) {
        toast.success(res.data.message || "Subscribed to newsletter!");
        setEmail("");
      } else {
        // Not registered -> show popup & offer redirect to /register
        setPendingEmail(trimmed);
        setRegisterModalOpen(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };

  const handleGoToRegister = () => {
    setRegisterModalOpen(false);
    router.push(`/register?email=${encodeURIComponent(pendingEmail)}&newsletter=1`);
  };

  return (
    <>
      <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FaCode className="text-amber-600 dark:text-amber-400 text-2xl" />
                <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  CoderHaveli
                </h1>
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
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/prashant-sharma-0216ba251/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <CiLinkedin size={20} />
                </a>
                <a
                  href="https://x.com/PraShant051202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
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
                  <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/contests" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                    Contests
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                    Tapasya Ranks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Stay Updated</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Subscribe to our newsletter for the latest contests and updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your registered email"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-400 dark:to-yellow-500 dark:hover:from-amber-500 dark:hover:to-yellow-600 text-white dark:text-gray-950 font-bold py-2 px-4 rounded-lg shadow-md shadow-amber-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
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
              <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 text-sm transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Register First Popup for Unregistered Newsletter Emails */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Register First to Subscribe
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              The email <strong className="text-gray-900 dark:text-white">{pendingEmail}</strong> is not registered on CoderHaveli yet. Please create an account first to subscribe to our newsletter and weekly contest alerts!
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGoToRegister}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer"
              >
                <MailCheck className="w-4 h-4" />
                <span>Go to Register →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
