// components/admin/CourseUpload.js
import React from 'react';

const CourseUpload = ({ data, handleInputChange }) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
          placeholder="Enter course title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
          placeholder="Enter course description"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <input
            type="text"
            value={data.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
            placeholder="e.g., Web Development"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
          <input
            type="text"
            value={data.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
            placeholder="e.g., 8 weeks"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
        <select
          value={data.level}
          onChange={(e) => handleInputChange('level', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
      </div>
    </div>
  );
};

export default CourseUpload;