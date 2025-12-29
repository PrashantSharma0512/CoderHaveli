// components/MobileHeader.js
import React from 'react';

const MobileHeader = ({ user, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-800 text-white border-b border-gray-700">
      <div>
        <h2 className="text-lg font-bold">CoderHaveli <span className="text-amber-400">Admin</span></h2>
        <p className="text-xs text-amber-500">Welcome, {user?.name || 'Admin'}!</p>
      </div>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 text-gray-300 hover:text-white focus:outline-none"
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