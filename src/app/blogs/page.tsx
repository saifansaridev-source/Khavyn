import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogListClient } from "@/components/blog/BlogListClient";
import { getAllBlogs, getBlogCategories } from "@/lib/data/blogsData";
import { connectToDatabase } from "@/lib/db/connect";
import { StoreSettings } from "@/models/StoreSettings";
import { Sparkles, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "The KHAVYN Journal | Fabric Guides, Styling & Modern Menswear",
  description:
    "Explore the KHAVYN Journal. 15 comprehensive editorial guides on 210-240 GSM combed cotton, oversized T-shirt fits, polo styling, Oxford shirts, and quiet luxury in India.",
  keywords: [
    "KHAVYN blog",
    "KHAVYN journal",
    "premium cotton t-shirts India",
    "t-shirt GSM guide",
    "oversized t-shirts India",
    "combed cotton vs regular cotton",
    "smart casual menswear India",
    "quiet luxury India",
    "men capsule wardrobe",
  ],
  alternates: {
    canonical: "https://www.khavyn.com/blogs",
  },
  openGraph: {
    title: "The KHAVYN Journal | Fabric Guides, Styling & Modern Menswear",
    description:
      "Explore the KHAVYN Journal. 15 comprehensive editorial guides on 210-240 GSM combed cotton, oversized T-shirt fits, polo styling, Oxford shirts, and quiet luxury in India.",
    url: "https://www.khavyn.com/blogs",
    siteName: "KHAVYN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "The KHAVYN Journal Editorial Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The KHAVYN Journal | Fabric Guides, Styling & Modern Menswear",
    description:
      "Explore 15 in-depth guides on combed cotton, fabric GSM, architectural fits, and quiet luxury by KHAVYN.",
  },
};

export default async function BlogsPage() {
  let blogImages: Record<string, string> = {};
  try {
    const db = await connectToDatabase();
    if (db) {
      const settings = await StoreSettings.findOne().lean();
      if (settings?.blogImages && typeof settings.blogImages === "object") {
        blogImages = settings.blogImages as Record<string, string>;
      }
    }
  } catch (e) {
    console.error("Failed to load blog images in BlogsPage:", e);
  }

  const rawPosts = getAllBlogs();
  const posts = rawPosts.map((post) => ({
    ...post,
    image: blogImages[post.slug] || post.image,
  }));
  const categories = getBlogCategories();

  // Schema.org structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The KHAVYN Journal",
    description:
      "Editorial guides on fabric specifications, GSM, silhouette engineering, and understated luxury menswear in India.",
    url: "https://www.khavyn.com/blogs",
    publisher: {
      "@type": "Organization",
      name: "KHAVYN",
      logo: {
        "@type": "ImageObject",
        url: "https://www.khavyn.com/favicon.ico",
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      url: `https://www.khavyn.com/blogs/${post.slug}`,
      image: post.image,
      datePublished: "2026-09-01T00:00:00+05:30",
      author: {
        "@type": "Organization",
        name: "KHAVYN",
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <section className="relative py-16 sm:py-24 bg-[#141414] text-white border-b border-[#C6A664]/30 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C6A664]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#C6A664]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#C6A664]">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white/60">The Journal</span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C6A664]/15 border border-[#C6A664]/40 text-[#C6A664] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Crafting Everyday Luxury • Editorial</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-medium tracking-tight leading-tight">
              The KHAVYN Journal
            </h1>

            {/* Subline */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/75 font-light leading-relaxed">
              Explore 15 comprehensive guides on long-staple combed cotton, fabric GSM,
              architectural fits, quiet luxury, and timeless smart-casual styling.
            </p>

            {/* Direct Collections Quicklinks */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs tracking-wider">
              <span className="text-white/40 uppercase">Explore Collections:</span>
              <Link
                href="/collections/round-neck-t-shirts"
                className="text-[#C6A664] hover:text-white underline underline-offset-4 decoration-[#C6A664]/40 hover:decoration-white transition-colors"
              >
                Round Neck (210 GSM)
              </Link>
              <span className="text-white/30">•</span>
              <Link
                href="/collections/oversized-t-shirts"
                className="text-[#C6A664] hover:text-white underline underline-offset-4 decoration-[#C6A664]/40 hover:decoration-white transition-colors"
              >
                Oversized (240 GSM)
              </Link>
              <span className="text-white/30">•</span>
              <Link
                href="/collections/polo-t-shirts"
                className="text-[#C6A664] hover:text-white underline underline-offset-4 decoration-[#C6A664]/40 hover:decoration-white transition-colors"
              >
                Polo Shirts
              </Link>
              <span className="text-white/30">•</span>
              <Link
                href="/collections/formal-shirts"
                className="text-[#C6A664] hover:text-white underline underline-offset-4 decoration-[#C6A664]/40 hover:decoration-white transition-colors"
              >
                Oxford Formal Shirts
              </Link>
            </div>
          </div>
        </section>

        {/* Client Interactive Filter & Posts Grid */}
        <section className="py-12 sm:py-16">
          <BlogListClient posts={posts} categories={categories} />
        </section>

        {/* Newsletter & Editorial Footer Banner */}
        <section className="bg-[#1A1A1A] text-white border-t border-[#C6A664]/30 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-[#FAF7F2]">
              Elevate Your Everyday Wardrobe
            </h2>
            <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
              Every KHAVYN garment is crafted with long-staple combed cotton, reinforced seams,
              and European tailored proportions.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#C6A664] text-black font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#D8C9B0] transition-all duration-300 shadow-[0_0_20px_rgba(198,166,100,0.4)]"
              >
                <span>Shop The Full Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
