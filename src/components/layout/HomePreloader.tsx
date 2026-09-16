"use client";

import React, { useState, useEffect, useRef } from "react";

export const HomePreloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDoorsOpen, setIsDoorsOpen] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("/k-logo.png");

  const isFinishingRef = useRef(false);
  const enterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenDoors = () => {
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;

    // Trigger door opening slide animation
    setIsDoorsOpen(true);

    // After the door animation completes (~750ms), unmount preloader & restore scroll
    finishTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 800);
  };

  useEffect(() => {
    // Lock body scroll while preloader is active
    document.body.style.overflow = "hidden";

    // 1. Fetch public settings to check if preloader is enabled or custom logo URL exists
    let isMounted = true;
    fetch(`/api/settings?_t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data?.settings?.preloaderEnabled === false) {
          setIsVisible(false);
          document.body.style.overflow = "";
          return;
        }
        if (data?.settings?.preloaderLogoUrl) {
          setLogoUrl(data.settings.preloaderLogoUrl);
        }
      })
      .catch(() => {
        // Silently fall back to default enabled with /k-logo.png
      });

    // 2. Animate logo in (fade + scale entrance)
    enterTimerRef.current = setTimeout(() => {
      setIsLogoVisible(true);
    }, 50);

    // 3. Hold duration (~1.3s), then trigger double-door slide out
    holdTimerRef.current = setTimeout(() => {
      handleOpenDoors();
    }, 1350);

    return () => {
      isMounted = false;
      document.body.style.overflow = "";
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] select-none overflow-hidden ${
        isDoorsOpen ? "pointer-events-none bg-transparent" : "pointer-events-auto bg-black"
      }`}
      aria-label="Loading KHAVYN"
      role="status"
    >
      {/* ─── LEFT DOOR PANEL (slides out to left: translateX(-100%)) ─── */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full bg-black overflow-hidden will-change-transform"
        style={{
          clipPath: "inset(0 0 0 0)",
          transform: isDoorsOpen ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 750ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <div
          className="absolute top-1/2 flex items-center justify-center pointer-events-none select-none"
          style={{
            left: "100%",
            transform: `translate(-50%, -50%) scale(${isLogoVisible ? 1 : 0.92})`,
            opacity: isLogoVisible ? 1 : 0,
            transition:
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <img
            src={logoUrl}
            alt="KHAVYN"
            className="w-[50vw] max-w-[240px] h-auto md:w-auto md:h-[40vh] md:max-h-[460px] md:max-w-[48vw] object-contain select-none pointer-events-none drop-shadow-[0_14px_35px_rgba(198,166,100,0.3)]"
            draggable={false}
            loading="eager"
          />
        </div>
      </div>

      {/* ─── RIGHT DOOR PANEL (slides out to right: translateX(100%)) ─── */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full bg-black overflow-hidden will-change-transform"
        style={{
          clipPath: "inset(0 0 0 0)",
          transform: isDoorsOpen ? "translateX(100%)" : "translateX(0)",
          transition: "transform 750ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <div
          className="absolute top-1/2 flex items-center justify-center pointer-events-none select-none"
          style={{
            left: "0%",
            transform: `translate(-50%, -50%) scale(${isLogoVisible ? 1 : 0.92})`,
            opacity: isLogoVisible ? 1 : 0,
            transition:
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <img
            src={logoUrl}
            alt="KHAVYN"
            className="w-[50vw] max-w-[240px] h-auto md:w-auto md:h-[40vh] md:max-h-[460px] md:max-w-[48vw] object-contain select-none pointer-events-none drop-shadow-[0_14px_35px_rgba(198,166,100,0.3)]"
            draggable={false}
            loading="eager"
          />
        </div>
      </div>

      {/* Subtle Skip CTA */}
      <button
        onClick={handleOpenDoors}
        type="button"
        className={`absolute bottom-6 right-6 px-3.5 py-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium text-[#C6A664] bg-black/60 backdrop-blur-md border border-[#C6A664]/40 rounded-full hover:bg-[#C6A664] hover:text-black transition-all duration-300 z-20 cursor-pointer shadow-lg ${
          isDoorsOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        Skip
      </button>
    </div>
  );
};
