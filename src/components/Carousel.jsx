import React, { useState, useEffect } from "react";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";


const Carousel = ({IMAGES = []}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
  };


  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length 
    );
  };

  // Autoplay effect
  useEffect(() => {
    let autoplayInterval;
    if (isAutoplay) {
      autoplayInterval = setInterval(nextSlide, 3000); // Slide every 3 seconds
    }
    return () => clearInterval(autoplayInterval); // Clean up on component unmount or autoplay toggle
  }, [isAutoplay, currentIndex]);

  return (
    <div className="relative w-[90vw]  mx-auto overflow-hidden rounded-2xl">
      {/* Carousel container */}
      <div
        className="flex transition-transform duration-500 ease-in-out rounded"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {IMAGES.map((imageSrc, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-[450px] bg-cover bg-center "
            style={{ backgroundImage: `url(${imageSrc})` }}
          >
            {/* <div className="absolute bottom-5 left-5 bg-black bg-opacity-50 text-white p-5 rounded-lg">
              <h2 className="text-xl font-semibold">Slide {index + 1}</h2>
              <p className="text-sm">Description for slide {index + 1}</p>
            </div> */}
          </div>
        ))}
      </div>

      {/* Left Navigation */}
      <button
        className="absolute top-1/2 left-5 transform -translate-y-1/2 text-4xl text-white  bg-opacity-50 p-3 rounded-full cursor-pointer"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <SlArrowLeft size={30} />
      </button>

      {/* Right Navigation */}
      <button
        className="absolute top-1/2 right-5 transform -translate-y-1/2 text-4xl text-white  bg-opacity-50 p-3 rounded-full cursor-pointer"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <SlArrowRight size={30} />
      </button>

      {/* Autoplay Toggle */}
      {/* <button
        className="absolute top-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={() => setIsAutoplay(!isAutoplay)}
        aria-label="Toggle autoplay"
      >
        {isAutoplay ? "Pause" : "Play"}
      </button> */}
    </div>
  );
};

export default Carousel;
