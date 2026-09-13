"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, ArrowRight, Sparkles } from "lucide-react";

interface PromoPopupConfig {
  popupEnabled: boolean;
  popupImage: string;
  popupHeadline: string;
  popupSubtext: string;
  popupCtaText: string;
  popupCtaLink: string;
  popupDelaySeconds: number;
  popupFrequency: "every_visit" | "once_per_session" | "once_per_day";
  popupShowOnMobile: boolean;
}

const DEFAULT_CONFIG: PromoPopupConfig = {
  popupEnabled: false,
  popupImage: "",
  popupHeadline: "Season Sale",
  popupSubtext: "Up to 40% off, this week only. Handcrafted European luxury tailored in India.",
  popupCtaText: "Shop Now",
  popupCtaLink: "/shop",
  popupDelaySeconds: 3,
  popupFrequency: "once_per_session",
  popupShowOnMobile: true,
};

const SESSION_KEY = "khavyn_promo_popup_seen";
const DAILY_KEY = "khavyn_promo_popup_last_seen";

export const PromoPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<PromoPopupConfig>(DEFAULT_CONFIG);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadConfigAndSchedule = async () => {
      let activeConfig = DEFAULT_CONFIG;
      try {
        // Try admin endpoint first, falling back cleanly to public settings route
        const res = await fetch("/api/admin/settings");
        const data = res.ok
          ? await res.json()
          : await (await fetch("/api/settings")).json();

        if (data?.settings) {
          activeConfig = {
            popupEnabled: !!data.settings.popupEnabled,
            popupImage: data.settings.popupImage || "",
            popupHeadline: data.settings.popupHeadline || DEFAULT_CONFIG.popupHeadline,
            popupSubtext: data.settings.popupSubtext || DEFAULT_CONFIG.popupSubtext,
            popupCtaText: data.settings.popupCtaText || DEFAULT_CONFIG.popupCtaText,
            popupCtaLink: data.settings.popupCtaLink || DEFAULT_CONFIG.popupCtaLink,
            popupDelaySeconds:
              typeof data.settings.popupDelaySeconds === "number"
                ? data.settings.popupDelaySeconds
                : DEFAULT_CONFIG.popupDelaySeconds,
            popupFrequency: data.settings.popupFrequency || DEFAULT_CONFIG.popupFrequency,
            popupShowOnMobile:
              typeof data.settings.popupShowOnMobile === "boolean"
                ? data.settings.popupShowOnMobile
                : DEFAULT_CONFIG.popupShowOnMobile,
          };
          if (!ignore) {
            setConfig(activeConfig);
          }
        }
      } catch {
        // Silently use defaults on network failure
      }

      if (ignore) return;

      // Rule 1: If popup is disabled, do nothing
      if (!activeConfig.popupEnabled) return;

      // Rule 2: Check mobile viewport restriction
      const isMobile = window.innerWidth < 768;
      if (!activeConfig.popupShowOnMobile && isMobile) return;

      // Rule 3: Check frequency throttling
      if (activeConfig.popupFrequency === "once_per_session") {
        try {
          if (sessionStorage.getItem(SESSION_KEY) === "true") return;
        } catch {
          // sessionStorage blocked/unavailable
        }
      } else if (activeConfig.popupFrequency === "once_per_day") {
        try {
          const lastSeenStr = localStorage.getItem(DAILY_KEY);
          if (lastSeenStr) {
            const lastSeen = parseInt(lastSeenStr, 10);
            if (!isNaN(lastSeen) && Date.now() - lastSeen < 24 * 60 * 60 * 1000) {
              return;
            }
          }
        } catch {
          // localStorage blocked/unavailable
        }
      }

      // Rule 4: Schedule popup presentation after configured delay
      const delayMs = Math.max(0, (activeConfig.popupDelaySeconds ?? 3) * 1000);
      timerRef.current = setTimeout(() => {
        if (!ignore) {
          setIsOpen(true);
        }
      }, delayMs);
    };

    loadConfigAndSchedule();

    return () => {
      ignore = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);

    // Record dismissal according to frequency settings
    try {
      if (config.popupFrequency === "once_per_session") {
        sessionStorage.setItem(SESSION_KEY, "true");
      } else if (config.popupFrequency === "once_per_day") {
        localStorage.setItem(DAILY_KEY, Date.now().toString());
      }
    } catch {
      // Storage unavailable in private browsing mode
    }
  };

  // Keyboard accessibility: ESC to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleDismiss();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, config.popupFrequency]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={config.popupHeadline}
      onClick={(e) => {
        // Dismiss when clicking on backdrop outside modal container
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
      className="fixed inset-0 z-[99990] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 select-none"
    >
      <div
        className="relative w-full max-w-[340px] sm:max-w-[440px] bg-[#1A1A1A] border border-[#C6A664]/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-300 animate-in zoom-in-95 duration-300 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clearly Visible Luxury Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close promotional announcement"
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-black/70 backdrop-blur-md text-[#C6A664] hover:text-white border border-[#C6A664]/30 hover:border-[#C6A664] transition-all duration-200 cursor-pointer shadow-lg group"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
        </button>

        {/* Modal Banner Image / Artwork */}
        {config.popupImage ? (
          <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-black">
            <img
              src={config.popupImage}
              alt={config.popupHeadline}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/20" />
          </div>
        ) : (
          <div className="relative w-full h-36 bg-gradient-to-br from-black via-[#1f190e] to-black flex items-center justify-center border-b border-[#C6A664]/20 p-4">
            <img
              src="/k-logo.png"
              alt="KHAVYN"
              className="w-20 h-auto drop-shadow-md opacity-95"
            />
          </div>
        )}

        {/* Modal Content & Action Call */}
        <div className="p-6 sm:p-7 text-center flex flex-col items-center justify-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 text-[#C6A664] text-[10px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Private Privilege</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
            {config.popupHeadline}
          </h3>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-[340px] font-light">
            {config.popupSubtext}
          </p>

          <div className="w-full pt-2">
            <Link
              href={config.popupCtaLink || "/shop"}
              onClick={handleDismiss}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#C6A664] hover:bg-white text-black font-semibold text-xs sm:text-sm uppercase tracking-[0.18em] py-3.5 px-6 rounded-xl transition-all duration-300 shadow-xl group cursor-pointer"
            >
              <span>{config.popupCtaText || "Shop Now"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
