"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Megaphone,
  Loader2,
  Eye,
  Smartphone,
  Monitor,
  Clock,
  Repeat,
  ExternalLink,
  X,
  ArrowRight,
} from "lucide-react";
import { DragDropUpload } from "@/components/admin/DragDropUpload";

type PopupFrequency = "every_visit" | "once_per_session" | "once_per_day";

export default function AdminPromotionalPopupPage() {
  const [popupEnabled, setPopupEnabled] = useState<boolean>(false);
  const [popupImage, setPopupImage] = useState<string>("");
  const [popupHeadline, setPopupHeadline] = useState<string>("Season Sale");
  const [popupSubtext, setPopupSubtext] = useState<string>(
    "Up to 40% off, this week only. Handcrafted European luxury tailored in India."
  );
  const [popupCtaText, setPopupCtaText] = useState<string>("Shop Now");
  const [popupCtaLink, setPopupCtaLink] = useState<string>("/shop");
  const [popupDelaySeconds, setPopupDelaySeconds] = useState<number>(3);
  const [popupFrequency, setPopupFrequency] = useState<PopupFrequency>("once_per_session");
  const [popupShowOnMobile, setPopupShowOnMobile] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    let ignore = false;
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!ignore && res.ok) {
          const data = await res.json();
          if (data?.settings) {
            if (typeof data.settings.popupEnabled === "boolean") {
              setPopupEnabled(data.settings.popupEnabled);
            }
            if (typeof data.settings.popupImage === "string") {
              setPopupImage(data.settings.popupImage);
            }
            if (data.settings.popupHeadline) {
              setPopupHeadline(data.settings.popupHeadline);
            }
            if (data.settings.popupSubtext) {
              setPopupSubtext(data.settings.popupSubtext);
            }
            if (data.settings.popupCtaText) {
              setPopupCtaText(data.settings.popupCtaText);
            }
            if (data.settings.popupCtaLink) {
              setPopupCtaLink(data.settings.popupCtaLink);
            }
            if (typeof data.settings.popupDelaySeconds === "number") {
              setPopupDelaySeconds(data.settings.popupDelaySeconds);
            }
            if (data.settings.popupFrequency) {
              setPopupFrequency(data.settings.popupFrequency as PopupFrequency);
            }
            if (typeof data.settings.popupShowOnMobile === "boolean") {
              setPopupShowOnMobile(data.settings.popupShowOnMobile);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load promotional popup settings", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadSettings();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveToast(null);

    try {
      const payload = {
        popupEnabled,
        popupImage,
        popupHeadline,
        popupSubtext,
        popupCtaText,
        popupCtaLink,
        popupDelaySeconds: Number(popupDelaySeconds) || 0,
        popupFrequency,
        popupShowOnMobile,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveToast("Promotional popup settings saved successfully!");
        setTimeout(() => setSaveToast(null), 4000);
      } else {
        throw new Error(data.error || "Failed to save settings.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-[#141414] border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#C6A664] transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <div className="min-w-0 flex-1 sm:flex-initial">
            <h1 className="font-serif text-base sm:text-xl font-bold text-white flex items-center flex-wrap gap-2 min-w-0">
              <span className="truncate">Promotional Popup Atelier</span>
              <span
                className={`text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded shrink-0 ${
                  popupEnabled
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/10 text-white/50 border border-white/10"
                }`}
              >
                {popupEnabled ? "Active & Live" : "Disabled"}
              </span>
            </h1>
            <p className="text-xs text-white/50 font-light hidden sm:block">
              Configure seasonal promotions, banner imagery, frequency throttling, and CTA triggers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-0 bg-[#C6A664] text-black hover:bg-white disabled:opacity-50 px-5 py-2.5 sm:py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Popup Settings</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Toast Notices */}
        {saveToast && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-lg flex items-center justify-between text-xs animate-in fade-in duration-300 shadow-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveToast}</span>
            </div>
            <button
              onClick={() => setSaveToast(null)}
              className="text-emerald-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between text-xs animate-in fade-in duration-300 shadow-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <Loader2 className="w-8 h-8 text-[#C6A664] animate-spin" />
            <p className="text-sm text-white/60">Loading promotional popup configuration...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ─── LEFT COLUMN: CONFIGURATION CONTROLS (7 cols) ─── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Activation & Delivery Timing */}
              <section className="bg-[#141414] border border-white/10 rounded-xl p-5 sm:p-6 space-y-6 shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Megaphone className="w-4 h-4 text-[#C6A664]" />
                  <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                    Activation & Delivery Controls
                  </h2>
                </div>

                <div className="space-y-5">
                  {/* Enable / Disable Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>Promotional Popup Enabled</span>
                      </label>
                      <p className="text-xs text-white/50">
                        When enabled, the promotional modal will display to visitors according to frequency rules.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={popupEnabled}
                      onClick={() => setPopupEnabled(!popupEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        popupEnabled ? "bg-[#C6A664]" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                          popupEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Show on Mobile Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-white flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#C6A664]" />
                        <span>Display on Mobile Devices</span>
                      </label>
                      <p className="text-xs text-white/50">
                        Allow modal to render on mobile screens (&lt; 768px viewport width).
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={popupShowOnMobile}
                      onClick={() => setPopupShowOnMobile(!popupShowOnMobile)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        popupShowOnMobile ? "bg-[#C6A664]" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                          popupShowOnMobile ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Display Delay (Seconds) */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#C6A664]" />
                      <span>Display Delay (Seconds after page load)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        step="1"
                        value={popupDelaySeconds}
                        onChange={(e) => setPopupDelaySeconds(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-28 bg-black/50 border border-white/20 rounded px-3 py-2 text-sm text-white font-mono focus:border-[#C6A664] focus:outline-none"
                      />
                      <span className="text-xs text-white/50">
                        Recommended: 2 to 5 seconds to allow the page to settle before engaging.
                      </span>
                    </div>
                  </div>

                  {/* Frequency Throttling */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-2">
                      <Repeat className="w-3.5 h-3.5 text-[#C6A664]" />
                      <span>Display Frequency Throttling</span>
                    </label>
                    <select
                      value={popupFrequency}
                      onChange={(e) => setPopupFrequency(e.target.value as PopupFrequency)}
                      className="w-full bg-black/50 border border-white/20 rounded px-3.5 py-2.5 text-sm text-white focus:border-[#C6A664] focus:outline-none cursor-pointer"
                    >
                      <option value="once_per_session" className="bg-[#141414] text-white">
                        Once Per Session (Suppresses until browser tab/session closes)
                      </option>
                      <option value="once_per_day" className="bg-[#141414] text-white">
                        Once Per Day (Suppresses for 24 hours via localStorage)
                      </option>
                      <option value="every_visit" className="bg-[#141414] text-white">
                        Every Visit (Shows each time the site loads)
                      </option>
                    </select>
                    <p className="text-[11px] text-white/40">
                      {popupFrequency === "once_per_session" &&
                        "Optimal balance: visitors encounter the announcement once during their browsing session without feeling overwhelmed."}
                      {popupFrequency === "once_per_day" &&
                        "Best for high-frequency shoppers: suppresses repetitive modal impressions for a full 24-hour cycle."}
                      {popupFrequency === "every_visit" &&
                        "Aggressive campaign: triggers on every full page refresh (useful for urgent 24-hour flash sales)."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Card 2: Promotional Banner Imagery */}
              <section className="bg-[#141414] border border-white/10 rounded-xl p-5 sm:p-6 space-y-6 shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Sparkles className="w-4 h-4 text-[#C6A664]" />
                  <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                    Promotional Banner Imagery
                  </h2>
                </div>

                <div className="space-y-4">
                  <DragDropUpload
                    label="Modal Banner Artwork / Photography"
                    value={popupImage}
                    onChange={setPopupImage}
                    resourceType="image"
                    folder="khavyn/popups"
                    helperText="Upload luxury campaign imagery (recommended: 1000x600px landscape or 800x800px square). Stored securely via Cloudinary."
                  />
                </div>
              </section>

              {/* Card 3: Copywriting & CTA */}
              <section className="bg-[#141414] border border-white/10 rounded-xl p-5 sm:p-6 space-y-6 shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <ExternalLink className="w-4 h-4 text-[#C6A664]" />
                  <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                    Copywriting & Call To Action
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/80">
                      Modal Headline
                    </label>
                    <input
                      type="text"
                      value={popupHeadline}
                      onChange={(e) => setPopupHeadline(e.target.value)}
                      placeholder="e.g. Season Sale"
                      className="w-full bg-black/50 border border-white/20 rounded px-3.5 py-2.5 text-sm text-white focus:border-[#C6A664] focus:outline-none font-serif"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/80">
                      Subtext / Offer Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={popupSubtext}
                      onChange={(e) => setPopupSubtext(e.target.value)}
                      placeholder="e.g. Up to 40% off, this week only. Handcrafted European luxury tailored in India."
                      className="w-full bg-black/50 border border-white/20 rounded px-3.5 py-2.5 text-sm text-white focus:border-[#C6A664] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-white/80">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={popupCtaText}
                        onChange={(e) => setPopupCtaText(e.target.value)}
                        placeholder="e.g. Shop Now"
                        className="w-full bg-black/50 border border-white/20 rounded px-3.5 py-2.5 text-sm text-white focus:border-[#C6A664] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-white/80">
                        CTA Destination URL
                      </label>
                      <input
                        type="text"
                        value={popupCtaLink}
                        onChange={(e) => setPopupCtaLink(e.target.value)}
                        placeholder="e.g. /shop or /shop?collection=formal-shirts"
                        className="w-full bg-black/50 border border-white/20 rounded px-3.5 py-2.5 text-sm text-white focus:border-[#C6A664] focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ─── RIGHT COLUMN: LIVE INTERACTIVE PREVIEW (5 cols) ─── */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-[#141414] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#C6A664]" />
                    <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                      Live Customer Preview
                    </h3>
                  </div>

                  {/* Desktop / Mobile Switcher */}
                  <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                        previewMode === "desktop"
                          ? "bg-[#C6A664] text-black font-bold"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                        previewMode === "mobile"
                          ? "bg-[#C6A664] text-black font-bold"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Backdrop & Modal Container */}
                <div className="relative w-full rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/10 min-h-[460px] flex items-center justify-center p-4 sm:p-6 select-none">
                  {/* Subtle luxury textured background pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A664_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Simulated Modal Frame */}
                  <div
                    className={`relative z-10 w-full transition-all duration-300 bg-[#1A1A1A] border border-[#C6A664]/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ${
                      previewMode === "mobile" ? "max-w-[320px]" : "max-w-[420px]"
                    }`}
                  >
                    {/* Close Button Mock */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/70 hover:text-white border border-white/10 cursor-default">
                        <X className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Banner Image */}
                    {popupImage ? (
                      <div className="w-full h-44 sm:h-48 overflow-hidden relative bg-black">
                        <img
                          src={popupImage}
                          alt="Promotion Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30" />
                      </div>
                    ) : (
                      <div className="w-full h-36 bg-gradient-to-br from-black via-[#1f190e] to-black flex flex-col items-center justify-center border-b border-[#C6A664]/20 p-4 text-center">
                        <img
                          src="/k-logo.png"
                          alt="KHAVYN"
                          className="w-16 h-auto drop-shadow-md mb-2 opacity-90"
                        />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#C6A664]/70">
                          Optional Banner Image
                        </span>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6 text-center flex flex-col items-center justify-center space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 text-[#C6A664] text-[10px] font-mono uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        <span>Private Privilege</span>
                      </div>

                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                        {popupHeadline || "Season Sale"}
                      </h4>

                      <p className="text-xs text-white/70 leading-relaxed max-w-[320px]">
                        {popupSubtext || "Up to 40% off, this week only."}
                      </p>

                      <div className="w-full pt-3">
                        <div className="w-full inline-flex items-center justify-center gap-2 bg-[#C6A664] text-black font-semibold text-xs uppercase tracking-[0.18em] py-3 px-6 rounded-xl shadow-lg transition-all">
                          <span>{popupCtaText || "Shop Now"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <p className="text-[10px] text-white/30 pt-1">
                        Links to: <span className="font-mono text-white/50">{popupCtaLink || "/shop"}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status summary footer */}
                <div className="text-[11px] text-white/40 space-y-1 pt-1 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span>Target Delay:</span>
                    <span className="text-white font-mono">{popupDelaySeconds}s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Frequency Rule:</span>
                    <span className="text-[#C6A664] font-mono capitalize">
                      {popupFrequency.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mobile Visibility:</span>
                    <span className={popupShowOnMobile ? "text-emerald-400 font-mono" : "text-white/40 font-mono"}>
                      {popupShowOnMobile ? "Enabled" : "Disabled on Mobile"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
