"use client";

import React, { useState, useRef, useEffect } from "react";
import { RotateCw, MoveHorizontal, X, Maximize2 } from "lucide-react";
import Image from "next/image";

interface SpinViewer360Props {
  images: string[];
  productName: string;
}

export const SpinViewer360: React.FC<SpinViewer360Props> = ({
  images,
  productName,
}) => {
  // If fewer than 8 images, interpolate to generate 16 frames for smooth 360 rotation
  const frames =
    images.length >= 8
      ? images
      : Array.from({ length: 16 }, (_, i) => images[i % images.length]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play rotation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % frames.length);
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, frames.length]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    const sensitivity = 10; // pixels per frame change

    if (Math.abs(diffX) >= sensitivity) {
      const step = Math.floor(diffX / sensitivity);
      setCurrentIndex((prev) => {
        let next = (prev - step) % frames.length;
        if (next < 0) next += frames.length;
        return next;
      });
      setStartX(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore if pointer capture already released
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-[#F5F3EF] border border-[#D8C9B0]/40 p-4 select-none max-h-[600px] sm:max-h-[650px] lg:max-h-[700px] mx-auto">
      {/* Top Bar Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs tracking-wider uppercase font-medium pointer-events-auto">
          <RotateCw className="w-3.5 h-3.5 text-[#C6A664] animate-spin-slow" />
          <span>360° Interactive View</span>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`p-2 rounded-full backdrop-blur-md text-xs transition-colors ${
              isAutoPlay
                ? "bg-[#C6A664] text-white"
                : "bg-white/80 text-[#1A1A1A] hover:bg-white"
            }`}
            title={isAutoPlay ? "Pause Auto Rotation" : "Auto Rotate"}
          >
            <RotateCw className={`w-4 h-4 ${isAutoPlay ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-full bg-white/80 text-[#1A1A1A] hover:bg-white backdrop-blur-md transition-colors"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Spinner Viewer Frame */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDragStart={(e) => e.preventDefault()}
        className={`relative aspect-[3/4] w-full max-h-[560px] sm:max-h-[610px] lg:max-h-[660px] mx-auto cursor-grab ${
          isDragging ? "cursor-grabbing" : ""
        } flex items-center justify-center touch-none [perspective:1000px]`}
      >
        <div
          className="relative w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `rotateY(${((currentIndex % 8) / 8) * 360}deg) scale(${
              isDragging ? 1.02 : 1
            })`,
          }}
        >
          <Image
            src={frames[currentIndex]}
            alt={`${productName} 360 Spin Frame ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center pointer-events-none transition-opacity duration-150"
            priority
          />
        </div>

        {/* Drag Hint overlay */}
        {!isDragging && !isAutoPlay && (
          <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="flex items-center gap-2 bg-[#1A1A1A]/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-[#C6A664]/30">
              <MoveHorizontal className="w-4 h-4 text-[#C6A664] animate-pulse" />
              <span>Drag or swipe to spin 360°</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Dots / Frame Indicator */}
      <div className="mt-3 flex items-center justify-center gap-1 overflow-x-auto py-1">
        {frames.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
              idx === currentIndex
                ? "w-6 bg-[#C6A664]"
                : "w-1.5 bg-[#D8C9B0]/60 hover:bg-[#D8C9B0]"
            }`}
          />
        ))}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDragStart={(e) => e.preventDefault()}
            className="relative w-full max-w-2xl aspect-[3/4] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing touch-none"
          >
            <Image
              src={frames[currentIndex]}
              alt={`${productName} Fullscreen 360`}
              fill
              className="object-cover pointer-events-none"
            />
          </div>
          <div className="mt-6 flex items-center gap-2 text-white/80 text-sm">
            <MoveHorizontal className="w-4 h-4 text-[#C6A664]" />
            <span>Click & Drag to Spin</span>
          </div>
        </div>
      )}
    </div>
  );
};
