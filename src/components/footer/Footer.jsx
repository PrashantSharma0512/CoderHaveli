import React from "react";
import { CiLinkedin } from "react-icons/ci";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Logo and Description */}
        <div>
          <h1 className="text-2xl font-bold">CoderHaveli</h1>
          <p className="text-gray-400 mt-2">
          A platform dedicated to fostering competitive coding through daily challenges and contests. Join us to sharpen your skills and compete with a global community of developers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
            </li>
            <li>
              <a href="#resources" className="text-gray-400 hover:text-white">Resources</a>
            </li>
            <li>
              <a href="#contact" className="text-gray-400 hover:text-white">Contact</a>
            </li>
            <li>
              <a href="#faq" className="text-gray-400 hover:text-white">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Follow Us</h2>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://github.com/PrashantSharma0512"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/prashant-sharma-0216ba251/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <CiLinkedin size={24} />
            </a>
            <a
              href="https://x.com/PraShant051202"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <BsTwitterX size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 mt-6">
        <p>&copy; {new Date().getFullYear()} CoderHaveli.com All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
