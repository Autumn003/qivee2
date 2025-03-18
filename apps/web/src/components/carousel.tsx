"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useCallback } from "react";

interface CarouselProps {
  slides: {
    url: string;
    title: string;
    description?: string;
    cta?: {
      text: string;
      link: string;
    };
  }[];
  autoSlideInterval?: number;
  className?: string;
}

export function Carousel({
  slides,
  autoSlideInterval = 5000,
  className,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = useCallback(() => {
    setCurrentIndex((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  }, [slides.length]);

  const next = useCallback(() => {
    setCurrentIndex((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  }, [slides.length]);

  useEffect(() => {
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [next, autoSlideInterval, currentIndex]);

  return (
    <div
      className={cn(`relative w-full h-full group overflow-hidden`, className)}
    >
      {/* Image Wrapper */}
      <div className="relative w-full h-full z-10">
        <img
          src={slides[currentIndex]?.url}
          alt={slides[currentIndex]?.title}
          className="w-full h-full object-cover absolute inset-0"
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center bg-black/40">
          <div className="p-8 text-white max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-3">
              {slides[currentIndex]?.title}
            </h2>
            {slides[currentIndex]?.description && (
              <p className="text-lg opacity-90 mb-5">
                {slides[currentIndex].description}
              </p>
            )}
            {slides[currentIndex]?.cta && (
              <a
                href={slides[currentIndex].cta.link}
                className="inline-block bg-white/70 hover:bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                {slides[currentIndex].cta.text}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 left-4 bg-white/70 hover:bg-white text-black w-12 h-12 rounded-full transition-all shadow-lg z-10"
      >
        <i className="ri-arrow-left-s-line text-xl"></i>
      </button>
      <button
        onClick={next}
        className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 right-4 bg-white/70 hover:bg-white text-black w-12 h-12 rounded-full transition-all shadow-lg z-10"
      >
        <i className="ri-arrow-right-s-line text-xl"></i>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all bg-white/30",
              index === currentIndex && "bg-white scale-110"
            )}
          />
        ))}
      </div>
    </div>
  );
}
