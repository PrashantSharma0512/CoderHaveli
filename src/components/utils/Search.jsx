'use client';

import React from 'react';

const Search = () => {
  return (
    <div className="relative">
      <form className="relative flex items-center h-10 w-[200px] px-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus-within:border-amber-500 transition-all">
        <button type="button" className="text-gray-400 dark:text-gray-500 border-none bg-transparent">
          <svg width={17} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
            <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          className="peer text-sm bg-transparent w-full h-full px-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          placeholder="Type your text"
          required
          type="text"
        />
        <button
          className="reset hidden peer-not-placeholder-shown:block text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 border-none bg-transparent cursor-pointer"
          type="reset"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Search;
