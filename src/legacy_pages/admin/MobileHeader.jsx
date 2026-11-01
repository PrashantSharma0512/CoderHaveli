// components/MobileHeader.js
import React from 'react';

const MobileHeader = ({ user, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-950 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div>
        <h2 className="text-lg font-bold">CoderHaveli <span className="text-amber-500 dark:text-amber-400">Admin</span></h2>
        <p className="text-xs text-amber-600 dark:text-amber-400">Welcome, {user?.name || 'Admin'}!</p>
      </div>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 focus:outline-none"
      >
        {mobileMenuOpen ? (
          <span className="text-2xl">×</span>
        ) : (
          <span className="text-2xl">☰</span>
        )}
      </button>
    </div>
  );
};

export default MobileHeader;