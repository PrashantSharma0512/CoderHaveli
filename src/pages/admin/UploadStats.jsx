// components/admin/UploadStats.js
import React from 'react';

const UploadStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="text-xl md:text-3xl mr-3 md:mr-4">📚</div>
          <div>
            <h3 className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">Courses Created</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">8</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="text-xl md:text-3xl mr-3 md:mr-4">🎥</div>
          <div>
            <h3 className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">Videos Uploaded</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">45</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStats;