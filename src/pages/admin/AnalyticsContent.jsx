// components/admin/AnalyticsContent.js
import React from 'react';
import AnalyticsCard from './AnalyticsCard';

const AnalyticsContent = ({ dashboardData, submissions, questions }) => {
  const languageStats = submissions.reduce((acc, sub) => {
    const lang = sub.codelanguage || 'unknown';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});
  console.log(questions,"kfdkgnldfknglkd");
  
  const difficultyStats = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});

  const submissionStatus = {
    accepted: submissions.filter(s => s.status === 'Accepted').length,
    rejected: submissions.filter(s => s.status !== 'Accepted').length
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8">
        Platform <span className="text-amber-600 dark:text-indigo-400">Analytics</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
        <AnalyticsCard
          title="Submission Status"
          data={submissionStatus}
          type="status"
        />
        <AnalyticsCard
          title="Language Distribution"
          data={languageStats}
          type="language"
        />
        <AnalyticsCard
          title="Question Difficulty"
          data={difficultyStats}
          type="difficulty"
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-3 md:mb-4">Overall Performance</h3>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-amber-600 dark:text-indigo-400 mb-1 md:mb-2">
              {dashboardData?.submissionSuccessPercentage}%
            </div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContent;