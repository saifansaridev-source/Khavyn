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

        <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-10">
          <img 
            src="/k-logo.png" 
            alt="KHAVYN" 
            className="w-48 sm:w-56 h-auto object-contain mx-auto" 
          />

          <button
            onClick={handleClose}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#C6A664] text-white hover:text-black font-semibold text-xs uppercase tracking-[0.18em] py-3.5 px-6 rounded-xl transition-all duration-300 shadow-xl group"
          >
            <span>Continue to Atelier</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
