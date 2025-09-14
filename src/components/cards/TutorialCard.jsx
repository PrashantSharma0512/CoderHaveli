import React, { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router";

const TutorialCard = ({ title, description, image, url, duration, category, _id }) => {

  return (
    <Link to={`/tutorial-page?id=${_id}&type=tutorial`}>
      <div className="relative border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 group cursor-pointer w-full max-w-[320px] min-h-[280px] sm:min-h-[350px] md:min-h-[420px] flex flex-col">
        {/* Course Image */}
        <div className="relative h-24 sm:h-32 md:h-40 lg:h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={image.url}
            alt={title}
            className="w-full h-full object-contain p-2 sm:p-3 md:p-4 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Category Badge */}
          {category && (
            <span className="absolute top-1 sm:top-2 md:top-3 left-1 sm:left-2 md:left-3 bg-amber-500 dark:bg-indigo-600 text-white text-xs font-semibold px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full max-w-[85%] truncate">
              {category?.name}
            </span>
          )}
        </div>

        {/* Course Content */}
        <div className="p-2 sm:p-3 md:p-4 lg:p-5 flex flex-col flex-grow">
          <div className="flex-grow">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 line-clamp-2 leading-tight">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-2 sm:line-clamp-3">
              {description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm">
            {duration && (
              <span className="flex items-center text-gray-500 dark:text-gray-400">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">{duration}</span>
              </span>
            )}
          </div>

          {/* Action Button */}
          <Link
            to={`/tutorial-page?id=${_id}&type=tutorial`}
            className="w-full flex items-center justify-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 text-xs sm:text-sm"
          >
            Learn More
            <FiExternalLink className="ml-1 sm:ml-2" size={12} />
          </Link>
        </div>
      </div>

    </Link>

  );
};

export default TutorialCard;