"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ExternalLink,
  Loader2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { DragDropUpload } from "@/components/admin/DragDropUpload";
import { BLOG_POSTS, BlogPost, getBlogCategories } from "@/lib/data/blogsData";

export default function BlogAdminPage() {
  const [blogImages, setBlogImages] = useState<Record<string, string>>({});
  const [originalSavedImages, setOriginalSavedImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Articles");

  // Load existing settings on mount
  useEffect(() => {
    let ignore = false;
    async function loadSettings() {
      try {
        const res = await fetch(`/api/admin/settings?_t=${Date.now()}`);
        if (!ignore && res.ok) {
          const data = await res.json();
          if (data?.settings?.blogImages && typeof data.settings.blogImages === "object") {
            setBlogImages(data.settings.blogImages);
            setOriginalSavedImages(data.settings.blogImages);
          }
        }
      } catch (err) {
        console.error("Failed to load blog imagery settings", err);
        if (!ignore) {
          setErrorMessage("Failed to load current blog settings. Please refresh.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadSettings();
    return () => {
      ignore = true;
    };
  }, []);

  const handleImageChange = (slug: string, newUrl: string) => {
    setBlogImages((prev) => ({
      ...prev,
      [slug]: newUrl,
    }));
  };

  const handleResetToDefault = (slug: string) => {
    setBlogImages((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  };

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(blogImages) !== JSON.stringify(originalSavedImages);
  }, [blogImages, originalSavedImages]);

  const customImagesCount = useMemo(() => {
    return Object.keys(blogImages).filter((k) => !!blogImages[k]).length;
  }, [blogImages]);

  const categories = useMemo(() => {
    return getBlogCategories();
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All Articles" || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        String(post.id).includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveToast(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogImages }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save blog image settings.");
      }

      setOriginalSavedImages(blogImages);
      setSaveToast("All blog images saved successfully to Cloudinary and database!");
      setTimeout(() => setSaveToast(null), 5000);
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Failed to save blog images. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#141414]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60 hover:text-[#C6A664] transition-colors py-1 px-2.5 rounded bg-white/5 border border-white/10 hover:border-[#C6A664]/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#C6A664]/15 border border-[#C6A664]/40 flex items-center justify-center text-[#C6A664]">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-white tracking-wide flex items-center gap-2">
                Blog Admin
                <span className="text-[10px] font-mono font-bold bg-[#C6A664]/20 text-[#C6A664] px-1.5 py-0.5 rounded border border-[#C6A664]/30 uppercase">
                  Cloudinary Powered
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blogs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-white/70 hover:text-[#C6A664] transition-colors px-3 py-2 rounded border border-white/15 hover:border-[#C6A664]/40"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Blog</span>
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={isSaving || !hasUnsavedChanges}
            className={`flex items-center gap-2 px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md ${
              hasUnsavedChanges
                ? "bg-[#C6A664] text-black hover:bg-[#D8C9B0] shadow-[0_0_15px_rgba(198,166,100,0.4)]"
                : "bg-white/10 text-white/40 cursor-not-allowed border border-white/5"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{hasUnsavedChanges ? "Save Changes" : "Saved"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Toast / Alert Notifications */}
        {saveToast && (
          <div className="flex items-center gap-3 bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl text-xs sm:text-sm animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{saveToast}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-3 bg-red-950/70 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-xs sm:text-sm animate-fade-in shadow-lg">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Hero Banner / Instructions */}
        <div className="bg-gradient-to-r from-[#181818] via-[#1A1A1A] to-[#121212] border border-[#C6A664]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C6A664]/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#C6A664]/15 border border-[#C6A664]/40 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-[#C6A664]">
              <Sparkles className="w-3 h-3 text-[#C6A664]" />
              Editorial Image Management
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white font-medium">
              Change Images for Every Blog Page
            </h2>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
              Drag and drop any featured image to immediately replace the editorial photo of any of the 15 blog guides.
              All uploaded images are automatically processed and stored in your <span className="text-[#C6A664] font-medium">Cloudinary storage</span> under <code className="bg-black/40 px-1.5 py-0.5 rounded text-[11px] text-[#C6A664]">khavyn/blogs</code>.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6A664]" />
              <span>Total Articles: <strong className="text-white">15 Guides</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Custom Images Configured: <strong className="text-emerald-400">{customImagesCount} of 15</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Recommended Aspect: <strong className="text-white">16:9 or 1200 x 800px</strong></span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search articles by title, keyword, ID, or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/15 focus:border-[#C6A664] rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C6A664]" />
              <span>Showing {filteredPosts.length} of {BLOG_POSTS.length} Articles</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const count =
                cat === "All Articles"
                  ? BLOG_POSTS.length
                  : BLOG_POSTS.filter((p) => p.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#C6A664] text-black font-semibold shadow-[0_0_10px_rgba(198,166,100,0.3)]"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-[#C6A664] animate-spin" />
            <p className="text-xs uppercase tracking-widest text-white/50">Loading Blog Imagery Settings...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-[#161616] rounded-2xl border border-white/10 p-6 space-y-3">
            <BookOpen className="w-10 h-10 text-[#C6A664] mx-auto stroke-1" />
            <p className="text-sm text-white/70 font-medium">No articles matched your filter or search query.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Articles");
              }}
              className="text-xs uppercase tracking-widest bg-white/10 hover:bg-[#C6A664] hover:text-black text-white px-4 py-2 rounded transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const customUrl = blogImages[post.slug];
              const activeImage = customUrl || post.image;
              const isCustom = Boolean(customUrl && customUrl !== post.image);

              return (
                <div
                  key={post.slug}
                  className={`bg-[#161616] rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
                    isCustom ? "border-[#C6A664]/50 ring-1 ring-[#C6A664]/20" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Card Header */}
                  <div className="bg-[#1C1C1C] px-5 sm:px-6 py-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#C6A664]/20 text-[#C6A664] border border-[#C6A664]/30">
                        #{post.id}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-medium text-white line-clamp-1">
                            {post.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-white/50 mt-0.5">
                          <span className="text-[#C6A664]">{post.category}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                          <span>•</span>
                          <code className="text-white/40 font-mono">/blogs/{post.slug}</code>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                      {isCustom ? (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                          <Check className="w-3 h-3 text-emerald-400" />
                          Custom Cloudinary Image
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          <ImageIcon className="w-3 h-3 text-white/40" />
                          Default Stock Image
                        </span>
                      )}

                      <Link
                        href={`/blogs/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#C6A664] hover:text-[#D8C9B0] bg-[#C6A664]/10 hover:bg-[#C6A664]/20 border border-[#C6A664]/30 px-3 py-1.5 rounded transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Live Page</span>
                      </Link>
                    </div>
                  </div>

                  {/* Card Body: Split 2-Column Layout */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Active Image Preview */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-white/70">
                        <span>Current Display Image</span>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetToDefault(post.slug)}
                            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                            title="Revert back to default stock image"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset to Default</span>
                          </button>
                        )}
                      </div>

                      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-black border border-white/15 group shadow-inner">
                        <Image
                          src={activeImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-102"
                          sizes="(max-width: 1024px) 100vw, 400px"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 text-[11px] text-white/70 truncate flex items-center justify-between">
                          <span className="truncate max-w-[280px] font-mono text-[10px]">
                            {activeImage}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-white/40 italic">
                        SEO Alt Text: &ldquo;{post.imageAlt}&rdquo;
                      </p>
                    </div>

                    {/* Right Column: Drag & Drop Uploader */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="text-xs font-semibold text-white/70">
                        Drag & Drop or Select New Image
                      </div>

                      <DragDropUpload
                        label={`Upload Cloudinary Image for Article #${post.id}`}
                        value={customUrl || ""}
                        onChange={(url) => handleImageChange(post.slug, url)}
                        resourceType="image"
                        folder="khavyn/blogs"
                        helperText="Direct Cloudinary upload. Supports JPG, PNG, WebP (under 10MB). Image is automatically optimized and linked."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Save Footer Bar when Unsaved Changes exist */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-0 z-40 bg-[#161616]/95 backdrop-blur-md border-t border-[#C6A664]/40 px-4 sm:px-8 py-3.5 shadow-2xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white font-medium">
              You have unsaved blog image changes.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setBlogImages(originalSavedImages);
              }}
              disabled={isSaving}
              className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded transition-colors"
            >
              Discard
            </button>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#C6A664] hover:bg-[#D8C9B0] text-black px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[0_0_15px_rgba(198,166,100,0.35)]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
