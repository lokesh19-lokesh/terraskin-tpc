import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../data/products';
import video from "../images/video/terraskin.mp4";

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  if (isLoading) {
    return (
      <div className="relative h-[80vh] md:h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[80vh] md:h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <video
            className="w-full h-full object-cover"
            src={video}
            autoPlay
            muted
            loop
            playsInline
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40" />

          {/* Text content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-3xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-6 animate-fade-in-up">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 animate-fade-in-up animation-delay-200">
                {slide.subtitle}
              </p>
              <Link
                to="/shop"
                className="inline-block bg-[#8d4745] text-white px-8 py-3 rounded-full hover:bg-[#7a3f3d] transition-all duration-300 font-semibold text-lg animate-fade-in-up animation-delay-400 transform hover:scale-105"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>
      ))}


      {/* Navigation arrows */}
      {/* <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full transition-all duration-300"
      >
        <ChevronLeft className="h-6 w-6" />
      </button> */}
      {/* <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6" />
      </button> */}

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
