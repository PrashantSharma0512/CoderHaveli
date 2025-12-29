// components/DashboardContent.js
import React from 'react';
import DashboardStats from './DashboardStats';
import RecentSubmissionsTable from './RecentSubmissionsTable';

const DashboardContent = ({ data }) => {
  const stats = data ? {
    totalStudents: data.totalUsers,
    totalQuestions: data.totalQuestions,
    totalSubmissions: data.totalSubmissions,
    acceptedSubmissions: data.acceptedSubmissions,
    successRate: parseFloat(data.submissionSuccessPercentage) || 0,
    recentSubmissions: data.RecentSubmission || []
  } : {
    totalStudents: 0,
    totalQuestions: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    successRate: 0,
    recentSubmissions: []
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8">
        Admin <span className="text-amber-600 dark:text-indigo-400">Dashboard</span>
      </h1>

      <DashboardStats stats={stats} />
      <RecentSubmissionsTable submissions={stats.recentSubmissions} />
    </div>
  );
};

export default DashboardContent;