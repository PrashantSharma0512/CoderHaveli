// components/Sidebar.js (with Lucide icons)
import React from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard,
  FileQuestion,
  Lightbulb,
  Users,
  FileText,
  BarChart3,
  Upload,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Trophy
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, mobileMenuOpen, user }) => {
    const navigate = useNavigate();
    const menuItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        color: 'text-blue-400'
      },
      {
        id: 'contests',
        label: 'Contests',
        icon: <Trophy className="w-5 h-5" />,
        color: 'text-amber-400',
        link: '/admin/contests'
      },
      {
        id: 'questions',
        label: 'Questions',
        icon: <FileQuestion className="w-5 h-5" />,
        color: 'text-green-400'
      },

      {
        id: 'approaches',
        label: 'Approaches',
        icon: <Lightbulb className="w-5 h-5" />, // Lightbulb icon for Approaches
        color: 'text-amber-400'
      },
      {
        id: 'students',
        label: 'Students',
        icon: <Users className="w-5 h-5" />,
        color: 'text-purple-400'
      },
      {
        id: 'submissions',
        label: 'Submissions',
        icon: <FileText className="w-5 h-5" />,
        color: 'text-red-400'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: <BarChart3 className="w-5 h-5" />,
        color: 'text-cyan-400'
      },
      {
        id: 'upload',
        label: 'Upload',
        icon: <Upload className="w-5 h-5" />,
        color: 'text-emerald-400'
      },
      {
        id: 'AnalyticsTraffic',
        label: 'Analytics Traffic',
        icon: <TrendingUp className="w-5 h-5" />,
        active: activeTab === 'AnalyticsTraffic'
      }
    ];

    return (
      <div className={`
      ${mobileMenuOpen ? 'block' : 'hidden'}
      md:block w-full md:w-64 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100
      md:min-h-screen border-r border-gray-200 dark:border-gray-800
    `}>
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-amber-500 dark:text-amber-400">🚀</span>
                <span className="text-gray-900 dark:text-white">CoderHaveli</span>
                <span className="text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black px-2 py-0.5 rounded shadow-xs">Admin</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name || 'Admin'}!</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="mb-4">
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-bold tracking-wider mb-2">
              Navigation
            </h3>
            <div className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left
                  transition-all duration-200 group cursor-pointer
                  ${activeTab === item.id
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-l-4 border-amber-500 shadow-xs font-semibold'
                      : 'hover:bg-amber-50/50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-300 border-l-4 border-transparent font-medium'
                    }
                `}
                  onClick={() => {
                    if (item.link) {
                      navigate(item.link);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <span className={`mr-3 ${activeTab === item.id ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 group-hover:text-amber-500'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id
                      ? 'text-amber-600 dark:text-amber-400 rotate-90'
                      : 'text-gray-400 group-hover:text-amber-500'
                    }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats Section
        <div className="mt-8 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
          <h4 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-2">
            Quick Stats
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Active Approaches</span>
              <span className="text-amber-400 font-bold">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Total Questions</span>
              <span className="text-green-400 font-bold">15</span>
            </div>
          </div>
        </div> */}

          {/* Help Section
        <div className="mt-6 p-3">
          <p className="text-xs text-gray-400">
            💡 <span className="text-amber-400">Tip:</span> Manage approaches for each question with multiple code implementations.
          </p>
        </div> */}
        </nav>
      </div>
    );
  };

export default Sidebar;