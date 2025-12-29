// components/admin/UploadContent.js
import React, { useState } from 'react';
import CourseUpload from './CourseUpload';
import VideoUpload from './VideoUpload';
import UploadStats from './UploadStats';

const UploadContent = () => {
  const [activeUploadTab, setActiveUploadTab] = useState('course');
  const [uploadData, setUploadData] = useState({
    course: {
      title: '',
      description: '',
      category: '',
      duration: '',
      level: 'beginner'
    },
    video: {
      title: '',
      description: '',
      course: '',
      videoUrl: '',
      duration: ''
    }
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    alert(`${activeUploadTab.charAt(0).toUpperCase() + activeUploadTab.slice(1)} uploaded successfully!`);
  };

  const handleInputChange = (section, field, value) => {
    setUploadData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleReset = () => {
    setUploadData({
      course: {
        title: '',
        description: '',
        category: '',
        duration: '',
        level: 'beginner'
      },
      video: {
        title: '',
        description: '',
        course: '',
        videoUrl: '',
        duration: ''
      }
    });
  };

  const renderUploadForm = () => {
    switch (activeUploadTab) {
      case 'course':
        return (
          <CourseUpload 
            data={uploadData.course} 
            handleInputChange={(field, value) => handleInputChange('course', field, value)} 
          />
        );
      case 'video':
        return (
          <VideoUpload 
            data={uploadData.video} 
            handleInputChange={(field, value) => handleInputChange('video', field, value)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-8">
        Upload <span className="text-amber-600 dark:text-indigo-400">Content</span>
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {[
              { id: 'course', label: 'Course Upload', icon: '📚' },
              { id: 'video', label: 'Video Upload', icon: '🎥' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`flex-1 flex items-center justify-center px-2 md:px-6 py-3 md:py-4 border-b-2 font-medium text-sm ${activeUploadTab === tab.id
                  ? 'border-amber-500 dark:border-indigo-400 text-amber-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                onClick={() => setActiveUploadTab(tab.id)}
              >
                <span className="mr-1 md:mr-2 text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 md:p-6">
          <form onSubmit={handleUploadSubmit}>
            {renderUploadForm()}

            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 order-2 sm:order-1"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-3 md:px-4 py-2 bg-amber-500 dark:bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-amber-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 order-1 sm:order-2"
              >
                Upload {activeUploadTab.charAt(0).toUpperCase() + activeUploadTab.slice(1)}
              </button>
            </div>
          </form>
        </div>
      </div>

      <UploadStats />
    </div>
  );
};

export default UploadContent;