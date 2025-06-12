import React from "react";
import { FiExternalLink } from "react-icons/fi";

const TutorialCard = ({ title, description, image, url, duration , category }) => {
  
  return (
    <div className="relative border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 group cursor-pointer w-full max-w-[320px] min-h-[420px] flex flex-col">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={image.url}
          alt={title}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category Badge */}
        {category && (
          <span className="absolute top-3 left-3 bg-amber-500 dark:bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {category?.name}
          </span>
        )}
      </div>

      {/* Course Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex justify-between items-center mb-4 text-sm">
          {duration && (
            <span className="flex items-center text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {duration}
            </span>
          )}

        </div>

        {/* Action Button */}
        <button
          onClick={() => window.open(url, "_blank")}
          className="w-full flex items-center justify-center px-4 py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Learn More
          <FiExternalLink className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );
};

export default TutorialCard;