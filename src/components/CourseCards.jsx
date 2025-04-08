// import React from 'react'

// export default function Card({ imageUrl, title, price,category }) {
//     return (
//       <div className="w-full bg-white/30 border border-gray-500 rounded-lg backdrop-blur-md dark:bg-gray-800/40 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:border-2 hover:border-white">
//         <a href="/">
//           <img className="p-8 rounded-t-lg w-[350px] h-[300px]" src={imageUrl} />
//         </a>
//         <div className="px-5 pb-5">
//           <a href="/">
//             <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
//               {title}
//             </h5>
//             <h6 className="text-sm font-normal text-gray-500 dark:text-gray-300">
//               {category}
//             </h6>
//           </a>
//           <div className="flex items-center mt-2.5 mb-5">
//             <svg
//               className="w-4 h-4 text-yellow-300 mr-1"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 22 20"
//             >
//               <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//             </svg>
//             <svg
//               className="w-4 h-4 text-yellow-300 mr-1"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 22 20"
//             >
//               <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//             </svg>
//             <svg
//               className="w-4 h-4 text-yellow-300 mr-1"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 22 20"
//             >
//               <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//             </svg>
//             <svg
//               className="w-4 h-4 text-yellow-300 mr-1"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 22 20"
//             >
//               <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//             </svg>
//             <svg
//               className="w-4 h-4 text-gray-200 dark:text-gray-600"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 22 20"
//             >
//               <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//             </svg>
//             <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
//               4.0
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-3xl font-bold text-gray-900 dark:text-white">&#x20b9;{price}</span>
//             <a
//               href="/"
//               className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//             >
//               Add to cart
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }

import React from 'react';

export default function Card({ imageUrl, title, price, category }) {
  return (
    <div className="w-full max-w-sm bg-white/30 border border-gray-500 rounded-lg backdrop-blur-md dark:bg-gray-800/40 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:border-2 hover:border-white">
      <a href="/" className="block">
        <img 
          className="w-full h-auto p-4 md:p-6 rounded-t-lg object-contain aspect-square" 
          src={imageUrl} 
          alt={title}
          loading="lazy"
        />
      </a>
      <div className="px-4 pb-4 md:px-5 md:pb-5">
        <a href="/" className="block">
          <h5 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
            {title}
          </h5>
          <h6 className="text-xs md:text-sm font-normal text-gray-500 dark:text-gray-300 mt-1">
            {category}
          </h6>
        </a>
        <div className="flex items-center mt-2 mb-3 md:mt-2.5 md:mb-5">
          {/* Stars rating */}
          {[...Array(4)].map((_, i) => (
            <svg
              key={`full-${i}`}
              className="w-3 h-3 md:w-4 md:h-4 text-yellow-300 mr-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          ))}
          <svg
            className="w-3 h-3 md:w-4 md:h-4 text-gray-200 dark:text-gray-600 mr-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2">
            4.0
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            &#x20b9;{price}
          </span>
          <a
            href="/"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs md:text-sm px-3 py-2 md:px-5 md:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add to cart
          </a>
        </div>
      </div>
    </div>
  );
}