import React, { useState, useEffect } from "react";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

const Carousel = ({ IMAGES = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide(); // Swipe left
    }

    if (touchStart - touchEnd < -50) {
      prevSlide(); // Swipe right
    }
  };

  // Autoplay effect
  useEffect(() => {
    let autoplayInterval;
    if (isAutoplay && IMAGES.length > 1) {
      autoplayInterval = setInterval(nextSlide, 3000);
    }
    return () => clearInterval(autoplayInterval);
  }, [isAutoplay, currentIndex, IMAGES.length]);

  if (IMAGES.length === 0) return null;

  return (
    <div className="relative w-full max-w-[90vw] mx-auto overflow-hidden rounded-2xl">
      {/* Carousel container with touch events */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {IMAGES.map((imageSrc, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-[300px] sm:h-[450px] bg-cover bg-center"
            style={{ backgroundImage: `url(${imageSrc})` }}
            aria-hidden={index !== currentIndex}
          />
        ))}
      </div>

      {/* Navigation Arrows - hidden on mobile if only one image */}
      {IMAGES.length > 1 && (
        <>
          <button
            className="hidden sm:block absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black bg-opacity-30 p-2 rounded-full cursor-pointer hover:bg-opacity-50 transition-all"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <SlArrowLeft size={24} />
          </button>
          <button
            className="hidden sm:block absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black bg-opacity-30 p-2 rounded-full cursor-pointer hover:bg-opacity-50 transition-all"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <SlArrowRight size={24} />
          </button>
        </>
      )}

      {/* Indicator dots */}
      {IMAGES.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white bg-opacity-50"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Autoplay Toggle - optional */}
      {/* <button
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm"
        onClick={() => setIsAutoplay(!isAutoplay)}
        aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
      >
        {isAutoplay ? "Pause" : "Play"}
      </button> */}
    </div>
  );
};

export default Carousel;