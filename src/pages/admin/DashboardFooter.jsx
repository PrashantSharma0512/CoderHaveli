// components/DashboardFooter.js
import React from 'react';

const DashboardFooter = () => {
  return (
    <div className="container mx-auto px-4 py-4 text-center text-gray-500 dark:text-gray-400 text-xs md:text-sm">
      <p>© {new Date().getFullYear()} Admin Dashboard • Secure Access • Last login: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    </div>
  );
};

export default DashboardFooter;