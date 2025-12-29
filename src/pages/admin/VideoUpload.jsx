// components/admin/VideoUpload.js
import React from 'react';

const VideoUpload = ({ data, handleInputChange }) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
          placeholder="Enter video title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
          placeholder="Enter video description"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
          <select
            value={data.course}
            onChange={(e) => handleInputChange('course', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
          >
            <option value="">Select a course</option>
            <option value="web-dev">Web Development</option>
            <option value="data-science">Data Science</option>
            <option value="mobile-dev">Mobile Development</option>
            <option value="machine-learning">Machine Learning</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
          <input
            type="text"
            value={data.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
            placeholder="e.g., 15:30"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL</label>
        <input
          type="url"
          value={data.videoUrl}
          onChange={(e) => handleInputChange('videoUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
          placeholder="Enter video URL"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Video File</label>
        <input
          type="file"
          accept="video/*"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supported: MP4, MOV, AVI, MKV (Max 500MB)</p>
      </div>
    </div>
  );
};

export default VideoUpload;