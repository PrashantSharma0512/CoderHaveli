// components/admin/AnalyticsCard.js
import React from 'react';

const AnalyticsCard = ({ title, data, type }) => {
  const renderData = () => {
    switch (type) {
      case 'status':
        return (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2 md:mr-3"></div>
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Accepted</span>
              </div>
              <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-white">
                {data.accepted}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2 md:mr-3"></div>
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Rejected</span>
              </div>
              <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-white">
                {data.rejected}
              </span>
            </div>
          </>
        );
      
      case 'language':
        return Object.entries(data).map(([lang, count]) => (
          <div key={lang} className="flex justify-between items-center">
            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {lang.substring(0, 2)}
            </span>
            <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-white">{count}</span>
          </div>
        ));
      
      case 'difficulty':
        return Object.entries(data).map(([difficulty, count]) => (
          <div key={difficulty} className="flex justify-between items-center">
            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {difficulty}
            </span>
            <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-white">{count}</span>
          </div>
        ));
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-3 md:mb-4">{title}</h3>
      <div className="space-y-2 md:space-y-3">
        {renderData()}
      </div>
    </div>
  );
};

export default AnalyticsCard;