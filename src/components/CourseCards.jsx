import React from "react";
import { FiShoppingCart, FiStar, FiClock } from "react-icons/fi";

export default function Card({ imageUrl, title, price, category, duration, rating = 4.0 }) {
  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative bg-gray-100 dark:bg-gray-700">
        <img
          className="w-full h-48 object-contain p-6"
          src={imageUrl}
          alt={title}
          loading="lazy"
        />
        {/* Category Badge */}
        {category && (
          <span className="absolute top-3 left-3 bg-amber-500 dark:bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {category}
          </span>
        )}
        {/* Duration Badge */}
        {duration && (
          <span className="absolute top-3 right-3 flex items-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
            <FiClock className="mr-1" size={12} />
            {duration}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{category}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 
                  'text-amber-400 fill-amber-400' : 
                  'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200 ml-2">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{price.toLocaleString()}
            </span>
            {price.original && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                ₹{price.original.toLocaleString()}
              </span>
            )}
          </div>
          <button className="flex items-center justify-center text-white bg-amber-500 hover:bg-amber-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 font-medium rounded-lg px-4 py-2 text-sm transition-colors duration-200">
            <FiShoppingCart className="mr-2" size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}