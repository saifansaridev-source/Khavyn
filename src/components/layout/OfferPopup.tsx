"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, Copy, Check, Gift, ArrowRight } from "lucide-react";

interface OfferPopupConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  couponCode: string;
  discountText: string;
  ctaText: string;
  ctaLink: string;
  frequency: "once_per_session" | "every_visit";
}

const DEFAULT_CONFIG: OfferPopupConfig = {
  enabled: true,
  title: "EXCLUSIVE PRIVATE PRIVILEGE",
  subtitle: "Unlock 10% off your inaugural KHAVYN order + complimentary express shipping nationwide.",
  couponCode: "KHAVYN10",
  discountText: "Complimentary shipping above ₹2,499",
  ctaText: "EXPLORE THE ATELIER",
  ctaLink: "/shop",
  frequency: "once_per_session",
};

export const OfferPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<OfferPopupConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    // 1. Fetch live admin config
    const loadConfigAndEvaluate = async () => {
      let activeConfig = DEFAULT_CONFIG;
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.settings?.offerPopup) {
            activeConfig = data.settings.offerPopup;
            setConfig(activeConfig);
          }
        }
      } catch (err) {
        // use fallback
      }

      if (!activeConfig.enabled) return;

      // 2. Check frequency
      const storageKey = "khavyn_offer_popup_seen";
      const hasSeen =
        activeConfig.frequency === "every_visit"
          ? false
          : sessionStorage.getItem(storageKey);

      if (!hasSeen) {
        // Show after a subtle 3.5s delay
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3500);

        return () => clearTimeout(timer);
      }
    };

    loadConfigAndEvaluate();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("khavyn_offer_popup_seen", "true");
  };

  const handleCopyCode = () => {
    if (navigator?.clipboard && config.couponCode) {
      navigator.clipboard.writeText(config.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F2] text-[#1A1A1A] border-2 border-[#C6A664] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C6A664] via-[#F0E9DD] to-[#C6A664]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-black/5 rounded-full transition-colors"
          aria-label="Close promotion modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center space-y-5">
          {/* Badge & Icon */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] text-[#C6A664] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Invitation</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
              {config.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 max-w-md mx-auto leading-relaxed">
              {config.subtitle}
            </p>
          </div>

          {/* Coupon Code Pill */}
          {config.couponCode && (
            <div className="bg-[#F5F3EF] border border-[#D8C9B0] rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 max-w-sm mx-auto shadow-inner">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/60 block">
                  Use Privilege Code
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#1A1A1A] tracking-wider">
                  {config.couponCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 bg-[#C6A664] hover:bg-[#1A1A1A] text-black hover:text-[#C6A664] px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Complimentary Shipping Tag */}
          <div className="inline-flex items-center gap-2 text-xs text-[#1A1A1A]/80 font-medium">
            <Gift className="w-4 h-4 text-[#C6A664]" />
            <span>{config.discountText}</span>
          </div>

          {/* CTA & Dismiss Buttons */}
          <div className="pt-2 space-y-2.5">
            <Link
              href={config.ctaLink || "/shop"}
              onClick={handleClose}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#C6A664] text-white hover:text-black font-semibold text-xs uppercase tracking-[0.18em] py-3.5 px-6 rounded-xl transition-all duration-300 shadow-xl group"
            >
              <span>{config.ctaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              onClick={handleClose}
              className="text-[11px] uppercase tracking-widest text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors font-medium py-1"
            >
              Continue Browsing Atelier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
