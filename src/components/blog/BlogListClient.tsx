"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/data/blogsData";
import { Search, Clock, ArrowRight, BookOpen, Sparkles, SlidersHorizontal } from "lucide-react";

interface BlogListClientProps {
  posts: BlogPost[];
  categories: string[];
}

export const BlogListClient: React.FC<BlogListClientProps> = ({ posts, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === "All Articles" || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.metaDescription.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.primaryKeywords.some((k) => k.toLowerCase().includes(q)) ||
        post.sections.some(
          (s) =>
            s.heading.toLowerCase().includes(q) ||
            s.content.toLowerCase().includes(q)
        );
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Use the first post (or quiet luxury) as featured when no active search
  const featuredPost = useMemo(() => {
    if (selectedCategory === "All Articles" && !searchQuery) {
      return posts[0];
    }
    return null;
  }, [posts, selectedCategory, searchQuery]);

  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  return (
    <div className="w-full">
      {/* Search & Category Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#1A1A1A] text-white rounded-2xl p-6 sm:p-8 border border-[#C6A664]/30 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C6A664]" />
              <input
                type="text"
                placeholder="Search fabric, GSM, fit, style guide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111111] border border-white/15 focus:border-[#C6A664] rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A664] font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                Showing {filteredPosts.length} of {posts.length} Articles
              </span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const count =
                cat === "All Articles"
                  ? posts.length
                  : posts.filter((p) => p.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-[#C6A664] text-black shadow-[0_0_15px_rgba(198,166,100,0.35)]"
                      : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-black/20 text-black font-semibold" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Editorial Post */}
      {featuredPost && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#222222] to-[#141414] border border-[#C6A664]/40 shadow-2xl group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[340px] overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.imageAlt}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-[#C6A664]/50 text-[#C6A664] text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C6A664]" />
                  <span>Featured Editorial</span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between text-white space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs tracking-wider text-[#C6A664]">
                    <span className="uppercase font-semibold">{featuredPost.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-white/60">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blogs/${featuredPost.slug}`}>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-medium leading-snug hover:text-[#C6A664] transition-colors">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {featuredPost.metaDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/40 tracking-wider">
                    {featuredPost.publishedDate}
                  </span>
                  <Link
                    href={`/blogs/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest bg-[#C6A664] text-black px-5 py-3 rounded-full hover:bg-[#D8C9B0] transition-colors shadow-lg group-hover:shadow-[0_0_20px_rgba(198,166,100,0.4)]"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {gridPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-black/5 shadow-sm p-8">
            <BookOpen className="w-12 h-12 text-[#C6A664] mx-auto mb-4 stroke-1" />
            <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-2">
              No matching articles found
            </h3>
            <p className="text-sm text-[#1A1A1A]/60 mb-6">
              Try searching for different keywords such as &ldquo;cotton&rdquo;, &ldquo;GSM&rdquo;, or &ldquo;oversized&rdquo;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Articles");
                setSearchQuery("");
              }}
              className="text-xs uppercase tracking-widest bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full hover:bg-[#C6A664] hover:text-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#D8C9B0]/40 shadow-md hover:shadow-2xl hover:border-[#C6A664]/60 transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link
                  href={`/blogs/${post.slug}`}
                  className="relative h-56 w-full overflow-hidden block bg-[#1A1A1A]"
                >
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A1A1A]/85 backdrop-blur-sm text-[#C6A664] border border-[#C6A664]/30 text-[11px] font-medium tracking-wider uppercase px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/50">
                      <Clock className="w-3.5 h-3.5 text-[#C6A664]" />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.publishedDate}</span>
                    </div>

                    <Link href={`/blogs/${post.slug}`} className="block">
                      <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A1A1A] leading-snug group-hover:text-[#C6A664] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed line-clamp-3">
                      {post.metaDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D8C9B0]/30 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {post.primaryKeywords.slice(0, 2).map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] bg-[#FAF7F2] border border-[#D8C9B0]/40 text-[#1A1A1A]/60 px-2 py-0.5 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C6A664] hover:text-[#1A1A1A] uppercase tracking-wider transition-colors shrink-0"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
