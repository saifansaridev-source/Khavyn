"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroCarouselProps {
  images: string[];
  interval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  images,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Filter out any empty, whitespace-only, or invalid strings
  const validImages = (images || []).filter(
    (img) => typeof img === "string" && img.trim().length > 0
  );

  const total = validImages.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const safeIndex = total > 0 ? currentIndex % total : 0;

  // Auto-advance slides every `interval` ms, pausing on hover
  useEffect(() => {
    if (isHovered || total <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, interval);
    return () => clearInterval(timer);
  }, [isHovered, total, interval, handleNext]);

  // Graceful fallbacks:
  // 1. Fewer than 1 valid image: render nothing
  if (total === 0) {
    return null;
  }

  // 2. Exactly 1 valid image: render static image without carousel controls
  if (total === 1) {
    return (
      <div className="absolute inset-0 z-0">
        <Image
          src={validImages[0]}
          alt="KHAVYN European Luxury Menswear Lifestyle"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
    );
  }

  // 3. Minimum 2+ images: crossfading carousel with arrows and dot indicators
  return (
    <div
      className="absolute inset-0 z-0 group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Crossfading Image Slides */}
      {validImages.map((imgUrl, index) => {
        const isActive = index === safeIndex;
        return (
          <div
            key={`${imgUrl}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={imgUrl}
              alt={`KHAVYN European Luxury Menswear Slide ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        );
      })}

      {/* Navigation Arrow - Left */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Hero Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 pointer-events-auto focus:opacity-100 focus:outline-none shadow-lg"
      >
        <ChevronLeft className="w-6 h-6 -ml-0.5" />
      </button>

      {/* Navigation Arrow - Right */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Hero Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 pointer-events-auto focus:opacity-100 focus:outline-none shadow-lg"
      >
        <ChevronRight className="w-6 h-6 -mr-0.5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 pointer-events-auto shadow-md">
        {validImages.map((_, index) => {
          const isActive = index === safeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              aria-label={`Jump to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full focus:outline-none ${
                isActive
                  ? "w-7 h-2 bg-[#C6A664] shadow-[0_0_8px_rgba(198,166,100,0.7)]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/90"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
