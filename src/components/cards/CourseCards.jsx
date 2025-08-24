import React from "react";
import { FiShoppingCart, FiStar, FiClock } from "react-icons/fi";
import { Link } from "react-router";

export default function CourseCard({ imageUrl, title, price, category, duration, rating = 4.0, _id }) {
  console.log({ imageUrl, title, price, category, duration, _id }, "course ininnknknlknlknl");

  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative bg-gray-100 dark:bg-gray-700">
        <img
          className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-contain p-2 sm:p-4 md:p-6"
          src={imageUrl}
          alt={title}
          loading="lazy"
        />
        {/* Category Badge */}
        {category && (
          <span className="absolute top-1 sm:top-2 md:top-3 left-1 sm:left-2 md:left-3 bg-amber-500 dark:bg-indigo-600 text-white text-xs font-semibold px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full max-w-[45%] truncate">
            {category}
          </span>
        )}
        {/* Duration Badge */}
        {duration && (
          <span className="absolute top-1 sm:top-2 md:top-3 right-1 sm:right-2 md:right-3 flex items-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs font-medium px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full max-w-[45%]">
            <FiClock className="mr-0.5 sm:mr-1 flex-shrink-0" size={10} />
            <span className="text-xs truncate">{duration}</span>
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 md:p-4 lg:p-5">
        <div className="mb-2 sm:mb-3 md:mb-4">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{category}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FiStar
                _id={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating) ?
                  'text-amber-400 fill-amber-400' :
                  'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200 ml-1 sm:ml-2">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price and CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center">
            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              ₹{price.toLocaleString()}
            </span>
            {price.original && (
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through ml-1 sm:ml-2">
                ₹{price.original.toLocaleString()}
              </span>
            )}
          </div>
          <Link
            to={`/tutorial-page?id=${_id}&type=course`}
            className="w-full sm:w-auto flex items-center justify-center text-white bg-amber-500 hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 font-medium rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors duration-200">
            <FiShoppingCart className="mr-1 sm:mr-2" size={12} />
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}