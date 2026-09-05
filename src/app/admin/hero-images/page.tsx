"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function AdminHeroImagesPage() {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHeroImages = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          if (Array.isArray(data.settings.heroImages) && data.settings.heroImages.length > 0) {
            setHeroImages(data.settings.heroImages);
          } else if (data.settings.heroImage) {
            setHeroImages([data.settings.heroImage]);
          } else {
            setHeroImages([
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85",
              "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&auto=format&fit=crop&q=85",
              "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1920&auto=format&fit=crop&q=85",
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1920&auto=format&fit=crop&q=85",
            ]);
          }
        }
      } else {
        setErrorMessage("Failed to load settings from server. Please check your connection.");
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
      setErrorMessage("Network error while loading hero images.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load on mount without synchronous setState in effect body
  useEffect(() => {
    let ignore = false;
    async function initSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!ignore && res.ok) {
          const data = await res.json();
          if (data?.settings) {
            if (Array.isArray(data.settings.heroImages) && data.settings.heroImages.length > 0) {
              setHeroImages(data.settings.heroImages);
            } else if (data.settings.heroImage) {
              setHeroImages([data.settings.heroImage]);
            } else {
              setHeroImages([
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1920&auto=format&fit=crop&q=85",
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1920&auto=format&fit=crop&q=85",
              ]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    initSettings();
    return () => {
      ignore = true;
    };
  }, []);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setHeroImages((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === heroImages.length - 1) return;
    setHeroImages((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleRemove = (index: number) => {
    if (heroImages.length <= 1) return;
    setHeroImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSlide = () => {
    setHeroImages((prev) => [...prev, ""]);
  };

  const handleUrlChange = (index: number, url: string) => {
    setHeroImages((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      // 1. GET current full settings first to preserve all fields
      const getRes = await fetch("/api/admin/settings");
      let currentSettings = {};
      if (getRes.ok) {
        const getData = await getRes.json();
        if (getData?.settings) {
          currentSettings = getData.settings;
        }
      }

      // Filter out empty URLs or keep them as user entered
      const cleanedImages = heroImages.filter((img) => img.trim().length > 0);
      const imagesToSave = cleanedImages.length > 0 ? cleanedImages : heroImages;

      // 2. PUT updated heroImages back
      const putRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentSettings,
          heroImages: imagesToSave,
        }),
      });

      if (putRes.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage("Failed to save changes to server.");
      }
    } catch (err) {
      console.error("Failed to save hero images", err);
      setErrorMessage("Network error while saving hero images.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white p-4 sm:p-8 font-sans selection:bg-[#C6A664] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation & Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/admin/dashboard"
            className="text-xs text-[#C6A664] hover:underline flex items-center gap-1.5 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Executive Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded"
            >
              <span>View Homepage</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={loadHeroImages}
              disabled={isLoading || isSaving}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded border border-white/10 transition-colors disabled:opacity-50"
              title="Refresh settings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#C6A664]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#C6A664] tracking-wide">
                Hero Banner Images
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-white/60">
              Manage the rotating hero carousel images shown on the homepage. Order determines slide sequence.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving || isLoading}
              className="bg-[#C6A664] hover:bg-white text-black font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Success Notice Toast Banner */}
        {saveSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-lg flex items-center justify-between gap-3 text-xs shadow-xl animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">Hero images updated successfully! Changes are live on the homepage.</span>
            </div>
            <span className="text-[10px] text-emerald-400/70 font-mono">Dismissing in 3s</span>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="bg-red-950/80 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2 text-xs shadow-xl">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Minimum 4 Images Warning */}
        {heroImages.length < 4 && (
          <div className="bg-amber-950/40 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-lg flex items-center gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Minimum 4 images recommended for a smooth carousel effect (Currently:{" "}
              <strong className="font-numeric font-bold text-amber-200">{heroImages.length}</strong>)
            </span>
          </div>
        )}

        {/* Slides List */}
        {isLoading ? (
          <div className="bg-[#1F1F1F] border border-white/10 rounded-xl p-12 text-center text-white/50 text-xs space-y-3">
            <RefreshCw className="w-6 h-6 text-[#C6A664] animate-spin mx-auto" />
            <p>Loading hero carousel settings...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {heroImages.map((imgUrl, index) => (
              <div
                key={index}
                className="bg-[#1F1F1F] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl hover:border-white/20 transition-all duration-200"
              >
                {/* Slide Card Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold bg-[#C6A664]/10 text-[#C6A664] border border-[#C6A664]/30 px-2.5 py-0.5 rounded">
                      Slide #{index + 1}
                    </span>
                    <span className="text-[11px] text-white/50 hidden sm:inline">
                      {index === 0 ? "First slide shown on page load" : `Slide ${index + 1} of ${heroImages.length}`}
                    </span>
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Move slide up"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move slide up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Move slide down"
                      disabled={index === heroImages.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move slide down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button
                      type="button"
                      title={heroImages.length <= 1 ? "At least 1 slide is required" : "Remove slide"}
                      disabled={heroImages.length <= 1}
                      onClick={() => handleRemove(index)}
                      className="p-1.5 rounded text-red-400/80 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      aria-label="Remove slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Input & Preview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-8 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">
                      Image URL (Cloudinary / Unsplash / CDN)
                    </label>
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                      className="w-full bg-[#141414] border border-white/20 rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A664] transition-colors"
                    />
                    <p className="text-[11px] text-white/40">
                      Recommended specs: 1920×1080px or higher, landscape orientation, compressed WebP/JPEG format.
                    </p>
                  </div>

                  {/* Live Image Preview */}
                  <div className="md:col-span-4">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-white/70 block mb-2">
                      Live Preview
                    </label>
                    {imgUrl.trim() ? (
                      <div className="relative h-28 sm:h-32 w-full rounded-lg overflow-hidden border border-white/15 bg-black/60 shadow-inner group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Slide ${index + 1} preview`}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-lg" />
                      </div>
                    ) : (
                      <div className="h-28 sm:h-32 w-full rounded-lg border border-dashed border-white/15 flex items-center justify-center text-[11px] text-white/40 bg-black/20 text-center p-3">
                        Enter a valid image URL to preview slide
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Slide Button */}
            <button
              type="button"
              onClick={handleAddSlide}
              className="w-full py-4 px-4 rounded-xl border border-dashed border-[#C6A664]/40 hover:border-[#C6A664] bg-[#C6A664]/5 hover:bg-[#C6A664]/10 text-[#C6A664] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/50">
            Total configured slides: <span className="font-numeric font-bold text-white">{heroImages.length}</span>
          </div>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving || isLoading}
            className="w-full sm:w-auto bg-[#C6A664] hover:bg-white text-black font-bold px-8 py-3 rounded-lg text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
