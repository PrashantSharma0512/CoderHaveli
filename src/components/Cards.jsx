import React from "react";

const CourseCard = ({ title, description, image}) => {
  return (
    <div className="border border-gray-600 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:border-2 hover:border-white cursor-pointer min-w-[300px] max-w-[300px] h-[400px] "
         onMouseEnter={(e) => e.currentTarget.classList.add('shadow-xl')}
         onMouseLeave={(e) => e.currentTarget.classList.remove('shadow-xl')}>
      <img
        src={image.url}
        alt={title}
        className="w-full h-[200px] object-contain p-[1rem]"
      />
      <div className="p-[1rem]">
        <h2 className="text-[1.5rem] font-bold text-white mb-[0.5rem]">{title}</h2>
        <p className="text-[12px] text-white mb-[1rem]">{description}</p>
        <button
          onClick={() => window.open(url, "_blank")}
          className="px-[2.5vw] py-[1.5vh] bg-blue-600 text-white rounded-[6px] cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
