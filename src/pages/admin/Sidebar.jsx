// components/Sidebar.js
import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, mobileMenuOpen, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'questions', label: 'Questions', icon: '❓' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'submissions', label: 'Submissions', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'upload', label: 'Upload', icon: '📤' }
  ];

  return (
    <div className={`
      ${mobileMenuOpen ? 'block' : 'hidden'}
      md:block w-full md:w-64 bg-gray-800 dark:bg-gray-800 text-white
      md:min-h-screen
    `}>
      <div className="p-4 md:p-6 border-b border-gray-700 hidden md:block">
        <h2 className="text-xl font-bold">CoderHaveli <span className="text-amber-400">Admin</span></h2>
        <p className="text-xs text-amber-500">Welcome back, {user?.name || 'Admin'}!</p>
      </div>
      <nav className="p-2 md:p-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`
              w-full flex items-center px-3 md:px-4 py-3 md:py-3 rounded-lg mb-1 md:mb-2 
              transition-colors text-sm md:text-base
              ${activeTab === item.id
                ? 'bg-amber-600 dark:bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }
            `}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="mr-2 md:mr-3 text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;