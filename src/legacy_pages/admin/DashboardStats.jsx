// components/DashboardStats.js
import React from 'react';

const DashboardStats = ({ stats }) => {
  const statCards = [
    { icon: '👥', label: 'Total Students', value: stats.totalStudents },
    { icon: '❓', label: 'Total Questions', value: stats.totalQuestions },
    { icon: '📝', label: 'Total Submissions', value: stats.totalSubmissions },
    { icon: '✅', label: 'Success Rate', value: `${stats.successRate}%` }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
      {statCards.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 md:p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="text-xl md:text-3xl mr-2 md:mr-4">{stat.icon}</div>
            <div>
              <h3 className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                {stat.label}
              </h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;