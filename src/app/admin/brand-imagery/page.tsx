"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { DragDropUpload } from "@/components/admin/DragDropUpload";

interface CollectionCard {
  slug: string;
  title: string;
  sub: string;
  image: string;
}

const DEFAULT_COLLECTIONS: CollectionCard[] = [
  {
    slug: "formal-shirts",
    title: "Formal Shirts",
    sub: "Contemporary Tailored Slim Fit",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "polo-t-shirts",
    title: "Polo T-Shirts",
    sub: "Pique Combed Knit",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "oversized-t-shirts",
    title: "Oversized T-Shirts",
    sub: "Streetwear Architectural Silhouette",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "round-neck-t-shirts",
    title: "Round Neck T-Shirts",
    sub: "Everyday Luxury Essentials",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
  },
];

export default function AdminBrandImageryPage() {
  const [collectionImages, setCollectionImages] = useState<CollectionCard[]>(DEFAULT_COLLECTIONS);
  const [aboutHeroImage, setAboutHeroImage] = useState<string>(
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85"
  );
  const [craftedInIndiaImage, setCraftedInIndiaImage] = useState<string>(
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&auto=format&fit=crop&q=80"
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!ignore && res.ok) {
          const data = await res.json();
          if (data?.settings) {
            if (Array.isArray(data.settings.collectionImages) && data.settings.collectionImages.length > 0) {
              setCollectionImages(data.settings.collectionImages);
            }
            if (data.settings.aboutHeroImage) {
              setAboutHeroImage(data.settings.aboutHeroImage);
            }
            if (data.settings.craftedInIndiaImage) {
              setCraftedInIndiaImage(data.settings.craftedInIndiaImage);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load store imagery settings", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadSettings();
    return () => {
      ignore = true;
    };
  }, []);

  const handleUpdateCollection = (index: number, field: keyof CollectionCard, value: string) => {
    setCollectionImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveToast(null);

    try {
      const payload = {
        collectionImages,
        aboutHeroImage,
        craftedInIndiaImage,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveToast("Brand imagery and settings saved successfully!");
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
      {/* Top Bar */}
      <header className="bg-[#141414] border-b border-white/10 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#C6A664] transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Brand Imagery Atelier</span>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-[#C6A664]/20 text-[#C6A664] px-2 py-0.5 rounded">
                Cloudinary
              </span>
            </h1>
            <p className="text-xs text-white/50 font-light hidden sm:block">
              Manage signature collection visuals, About page hero banner, and craftsmanship photography.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={isSaving || isLoading}
            className="bg-[#C6A664] text-black hover:bg-white disabled:opacity-50 px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Imagery</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-12">
        {/* Toast Notices */}
        {saveToast && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-lg flex items-center justify-between text-xs animate-in fade-in duration-300">
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
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between text-xs animate-in fade-in duration-300">
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
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Loader2 className="w-8 h-8 text-[#C6A664] animate-spin" />
            <p className="text-sm text-white/60">Loading brand imagery configuration...</p>
          </div>
        ) : (
          <>
            {/* SECTION A — Signature Collections Images */}
            <section className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C6A664]" />
                    <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                      Section A — Signature Collections Images
                    </h2>
                  </div>
                  <p className="text-xs text-white/50 font-light">
                    4 core cards showcased in the homepage &quot;Explore Our Signature Collections&quot; grid.
                  </p>
                </div>
                <Link
                  href="/#collections"
                  target="_blank"
                  className="text-[11px] text-[#C6A664] hover:underline flex items-center gap-1 self-start sm:self-auto font-medium"
                >
                  <span>Preview on Homepage</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collectionImages.map((card, idx) => (
                  <div
                    key={card.slug || idx}
                    className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white tracking-wide">
                        Card #{idx + 1}: {card.title || card.slug}
                      </span>
                      <span className="text-[10px] font-mono text-[#C6A664] bg-[#C6A664]/10 px-2 py-0.5 rounded">
                        /{card.slug}
                      </span>
                    </div>

                    <DragDropUpload
                      label={`${card.title || "Collection"} Image`}
                      value={card.image}
                      onChange={(url) => handleUpdateCollection(idx, "image", url)}
                      resourceType="image"
                      folder="khavyn/collections"
                      helperText="High-res portrait shot recommended (800x1000px)"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-white/60 font-semibold block">
                          Title
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) =>
                            handleUpdateCollection(idx, "title", e.target.value)
                          }
                          className="w-full bg-[#141414] border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A664]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-white/60 font-semibold block">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={card.sub}
                          onChange={(e) =>
                            handleUpdateCollection(idx, "sub", e.target.value)
                          }
                          className="w-full bg-[#141414] border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A664]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION B — About Page Hero Image */}
            <section className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#C6A664]" />
                    <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                      Section B — About Page Hero Image
                    </h2>
                  </div>
                  <p className="text-xs text-white/50 font-light">
                    The large cinematic background banner displayed on the About page under &quot;OUR HERITAGE&quot;.
                  </p>
                </div>
                <Link
                  href="/about"
                  target="_blank"
                  className="text-[11px] text-[#C6A664] hover:underline flex items-center gap-1 self-start sm:self-auto font-medium"
                >
                  <span>Preview About Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="max-w-xl">
                <DragDropUpload
                  label="About Page Banner Image"
                  value={aboutHeroImage}
                  onChange={(url) => setAboutHeroImage(url)}
                  resourceType="image"
                  folder="khavyn/about"
                  helperText="Recommended wide banner format (1920x1080px or 2560x1440px)"
                />
              </div>
            </section>

            {/* SECTION C — Crafted in India Section Image */}
            <section className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C6A664]" />
                    <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wide">
                      Section C — Crafted in India Section Image
                    </h2>
                  </div>
                  <p className="text-xs text-white/50 font-light">
                    The garment rack / atelier photo displayed beside &quot;CRAFTED IN INDIA / Made with Pride in Bangalore&quot;.
                  </p>
                </div>
                <Link
                  href="/about#crafted"
                  target="_blank"
                  className="text-[11px] text-[#C6A664] hover:underline flex items-center gap-1 self-start sm:self-auto font-medium"
                >
                  <span>Preview Section</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="max-w-xl">
                <DragDropUpload
                  label="Crafted in India Image"
                  value={craftedInIndiaImage}
                  onChange={(url) => setCraftedInIndiaImage(url)}
                  resourceType="image"
                  folder="khavyn/about"
                  helperText="Recommended landscape / workshop photo (900x600px)"
                />
              </div>
            </section>

            {/* Save All Footer CTA */}
            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-[#C6A664] text-black hover:bg-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-xl hover:scale-105"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save All Brand Imagery</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
