"use client";

import React, { useState, useEffect, useRef } from "react";

export const HomePreloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFinish = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 600);
  };

  useEffect(() => {
    // Lock body scroll while preloader is active
    document.body.style.overflow = "hidden";

    // Play videos programmatically to ensure autoplay policies are satisfied
    const playVideos = async () => {
      try {
        if (window.innerWidth >= 768 && desktopVideoRef.current) {
          desktopVideoRef.current.currentTime = 0;
          await desktopVideoRef.current.play();
        } else if (window.innerWidth < 768 && mobileVideoRef.current) {
          mobileVideoRef.current.currentTime = 0;
          await mobileVideoRef.current.play();
        }
      } catch {
        // Autoplay may be deferred or blocked; safety timer will handle dismissal
      }
    };

    playVideos();

    // Safety fallback timeout: automatically dismiss after 2.4s if video stalls
    timerRef.current = setTimeout(() => {
      handleFinish();
    }, 2400);

    return () => {
      document.body.style.overflow = "";
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-600 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
      aria-label="Loading KHAVYN"
      role="status"
    >
      {/* Desktop & Tablet Video (Screen width >= 768px) */}
      <video
        ref={desktopVideoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onEnded={handleFinish}
        className="hidden md:block w-full h-full object-cover bg-black"
      >
        <source src="/logo_preloader_desktop_1.5s.mp4" type="video/mp4" />
      </video>

      {/* Mobile Video (Screen width < 768px) */}
      <video
        ref={mobileVideoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onEnded={handleFinish}
        className="block md:hidden w-full h-full object-cover bg-black"
      >
        <source src="/logo_preloader_mobile_1.5s.mp4" type="video/mp4" />
      </video>

      {/* Subtle Skip CTA */}
      <button
        onClick={handleFinish}
        type="button"
        className="absolute bottom-6 right-6 px-3.5 py-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium text-[#C6A664] bg-black/60 backdrop-blur-md border border-[#C6A664]/40 rounded-full hover:bg-[#C6A664] hover:text-black transition-all duration-300 z-10 cursor-pointer shadow-lg"
      >
        Skip
      </button>
    </div>
  );
};
