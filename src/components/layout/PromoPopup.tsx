"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, ArrowRight, Sparkles, Copy, Check } from "lucide-react";

interface UnifiedPromoPopupConfig {
  popupEnabled: boolean;
  popupImage: string;
  popupHeadline: string;
  popupSubtext: string;
  popupCouponCode: string;
  popupCtaText: string;
  popupCtaLink: string;
  popupDelaySeconds: number;
  popupFrequency: "every_visit" | "once_per_session" | "once_per_day";
  popupShowOnMobile: boolean;
}

const DEFAULT_CONFIG: UnifiedPromoPopupConfig = {
  popupEnabled: false,
  popupImage: "",
  popupHeadline: "Season Sale",
  popupSubtext: "Up to 40% off, this week only. Handcrafted European luxury tailored in India.",
  popupCouponCode: "",
  popupCtaText: "Shop Now",
  popupCtaLink: "/shop",
  popupDelaySeconds: 3,
  popupFrequency: "once_per_session",
  popupShowOnMobile: true,
};

const BASE_SESSION_KEY = "khavyn_promo_seen";
const BASE_DAILY_KEY = "khavyn_promo_last_seen";

export const PromoPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<UnifiedPromoPopupConfig>(DEFAULT_CONFIG);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadConfigAndSchedule = async () => {
      let activeConfig = DEFAULT_CONFIG;
      try {
        // Cache-busting fetch ensures changes saved in admin are received instantly
        const res = await fetch(`/api/settings?_t=${Date.now()}`, {
          cache: "no-store",
          headers: { Pragma: "no-cache" },
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.settings) {
            const s = data.settings;
            const offer = s.offerPopup || {};

            // Unified check: active if either popupEnabled OR offerPopup.enabled is true
            const isEnabled =
              typeof s.popupEnabled === "boolean"
                ? s.popupEnabled
                : Boolean(offer.enabled);

            activeConfig = {
              popupEnabled: isEnabled,
              popupImage: s.popupImage || "",
              popupHeadline: s.popupHeadline || offer.title || DEFAULT_CONFIG.popupHeadline,
              popupSubtext: s.popupSubtext || offer.subtitle || DEFAULT_CONFIG.popupSubtext,
              popupCouponCode: offer.couponCode || "",
              popupCtaText: s.popupCtaText || offer.ctaText || DEFAULT_CONFIG.popupCtaText,
              popupCtaLink: s.popupCtaLink || offer.ctaLink || DEFAULT_CONFIG.popupCtaLink,
              popupDelaySeconds:
                typeof s.popupDelaySeconds === "number"
                  ? s.popupDelaySeconds
                  : DEFAULT_CONFIG.popupDelaySeconds,
              popupFrequency: s.popupFrequency || offer.frequency || DEFAULT_CONFIG.popupFrequency,
              popupShowOnMobile:
                typeof s.popupShowOnMobile === "boolean"
                  ? s.popupShowOnMobile
                  : DEFAULT_CONFIG.popupShowOnMobile,
            };

            if (!ignore) {
              setConfig(activeConfig);
            }
          }
        }
      } catch {
        // Silently use defaults on network failure
      }

      if (ignore) return;

      // Rule 1: If popup is disabled in settings, do not display
      if (!activeConfig.popupEnabled) return;

      // Rule 2: Check mobile viewport restriction
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (!activeConfig.popupShowOnMobile && isMobile) return;

      // Rule 3: Frequency check
      const sessionKey = `${BASE_SESSION_KEY}_${activeConfig.popupHeadline.replace(/\s+/g, "_")}`;
      if (activeConfig.popupFrequency === "once_per_session") {
        try {
          if (sessionStorage.getItem(sessionKey) === "true") return;
        } catch {}
      } else if (activeConfig.popupFrequency === "once_per_day") {
        try {
          const lastSeenStr = localStorage.getItem(BASE_DAILY_KEY);
          if (lastSeenStr) {
            const lastSeen = parseInt(lastSeenStr, 10);
            if (!isNaN(lastSeen) && Date.now() - lastSeen < 24 * 60 * 60 * 1000) {
              return;
            }
          }
        } catch {}
      }

      // Rule 4: Display after configured delay
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
      const sessionKey = `${BASE_SESSION_KEY}_${config.popupHeadline.replace(/\s+/g, "_")}`;
      if (config.popupFrequency === "once_per_session") {
        sessionStorage.setItem(sessionKey, "true");
        // Also suppress legacy offerPopup key if present
        sessionStorage.setItem("khavyn_offer_popup_seen", "true");
      } else if (config.popupFrequency === "once_per_day") {
        localStorage.setItem(BASE_DAILY_KEY, Date.now().toString());
      }
    } catch {}
  };

  const handleCopyCode = () => {
    if (navigator?.clipboard && config.popupCouponCode) {
      navigator.clipboard.writeText(config.popupCouponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
  }, [isOpen, config.popupHeadline]);

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

          {/* Optional Coupon Code Pill with 1-Click Copy */}
          {config.popupCouponCode && (
            <div className="pt-1 flex items-center justify-center">
              <button
                type="button"
                onClick={handleCopyCode}
                title="Click to copy coupon code"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-[#C6A664]/40 hover:border-[#C6A664] rounded-lg text-xs font-mono font-bold text-[#C6A664] transition-colors cursor-pointer shadow"
              >
                <span>CODE: {config.popupCouponCode}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#C6A664]/70" />
                )}
                <span className="text-[10px] text-white/50">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          )}

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
