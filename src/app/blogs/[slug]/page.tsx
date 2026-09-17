import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ShareButtons } from "@/components/blog/ShareButtons";
import {
  BLOG_POSTS,
  getBlogBySlug,
  getRelatedBlogs,
} from "@/lib/data/blogsData";
import {
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Tag,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import { StoreSettings } from "@/models/StoreSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | KHAVYN India",
    };
  }

  const allKeywords = [
    ...post.primaryKeywords,
    ...(post.secondaryKeywords || []),
  ];

  let customImage: string | undefined;
  try {
    const db = await connectToDatabase();
    if (db) {
      const settings = await StoreSettings.findOne().lean();
      if (settings?.blogImages && typeof settings.blogImages === "object") {
        customImage = (settings.blogImages as Record<string, string>)[slug];
      }
    }
  } catch (e) {
    // fallback gracefully
  }

  const activeImage = customImage || post.image;

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: allKeywords,
    alternates: {
      canonical: `https://www.khavyn.com/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: `https://www.khavyn.com/blogs/${post.slug}`,
      siteName: "KHAVYN",
      type: "article",
      publishedTime: "2026-09-01T00:00:00+05:30",
      modifiedTime: "2026-09-17T00:00:00+05:30",
      authors: ["KHAVYN Editorial Board"],
      images: [
        {
          url: activeImage,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.metaDescription,
      images: [activeImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogs(post.slug, 3);
  const articleUrl = `https://www.khavyn.com/blogs/${post.slug}`;

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
    // fallback gracefully
  }

  const activeHeroImage = blogImages[post.slug] || post.image;

  // Structured Data (Schema.org BlogPosting)
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: [activeHeroImage],
    datePublished: "2026-09-01T00:00:00+05:30",
    dateModified: "2026-09-17T00:00:00+05:30",
    author: {
      "@type": "Organization",
      name: "KHAVYN",
      url: "https://www.khavyn.com",
    },
    publisher: {
      "@type": "Organization",
      name: "KHAVYN",
      logo: {
        "@type": "ImageObject",
        url: "https://www.khavyn.com/favicon.ico",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: post.primaryKeywords.join(", "),
  };

  // Structured Data (Breadcrumbs)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.khavyn.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "The Journal",
        item: "https://www.khavyn.com/blogs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  // Structured Data (FAQ Schema if applicable)
  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Editorial Article Header */}
        <header className="bg-[#141414] text-white pt-12 pb-16 sm:pb-20 border-b border-[#C6A664]/30 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#C6A664]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#C6A664]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            {/* Breadcrumb navigation */}
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-white/50">
              <Link href="/" className="hover:text-[#C6A664] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blogs" className="hover:text-[#C6A664] transition-colors">
                The Journal
              </Link>
              <span>/</span>
              <span className="text-[#C6A664] font-medium">{post.category}</span>
            </div>

            {/* Category badge & Reading time */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#C6A664]/20 border border-[#C6A664]/50 text-[#C6A664] text-xs uppercase tracking-widest px-3.5 py-1 rounded-full font-semibold">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/60">
                <Clock className="w-3.5 h-3.5 text-[#C6A664]" />
                {post.readTime}
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5 text-xs text-white/60">
                <Calendar className="w-3.5 h-3.5 text-[#C6A664]" />
                {post.publishedDate}
              </span>
            </div>

            {/* Article H1 Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-medium text-white tracking-tight leading-[1.2]">
              {post.title}
            </h1>

            {/* Meta description / Lead */}
            <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed border-l-2 border-[#C6A664] pl-4 sm:pl-6 py-1">
              {post.metaDescription}
            </p>

            {/* Author bar & Share */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C6A664] text-black text-xs font-serif font-bold flex items-center justify-center shadow-[0_0_10px_rgba(198,166,100,0.4)]">
                  K
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-white">
                    KHAVYN Editorial Board
                  </div>
                  <div className="text-[11px] text-white/50">
                    Crafting Everyday Luxury • Textile Analysis
                  </div>
                </div>
              </div>

              <ShareButtons title={post.title} url={articleUrl} />
            </div>
          </div>
        </header>

        {/* Article Body Section */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Featured Hero Media */}
          <div className="relative w-full h-80 sm:h-[460px] md:h-[520px] rounded-2xl overflow-hidden shadow-2xl border border-[#D8C9B0]/40 mb-12 bg-[#1A1A1A]">
            <Image
              src={activeHeroImage}
              alt={post.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 sm:p-6 text-white text-xs sm:text-sm italic font-serif flex items-center justify-between">
              <span>{post.imageAlt}</span>
              <span className="text-[10px] uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded text-[#C6A664] not-italic font-sans">
                KHAVYN Visual Archive
              </span>
            </div>
          </div>

          {/* Quick Outline / Table of Contents */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D8C9B0]/60 shadow-sm mb-12">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C6A664] font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Article Highlights & Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {post.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[#1A1A1A]/80 hover:text-[#C6A664] transition-colors"
                >
                  <span className="text-[#C6A664] font-mono text-[11px] font-semibold shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span className="font-medium leading-snug">{section.heading}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Article Content Sections */}
          <div className="space-y-10 sm:space-y-12">
            {post.sections.map((section, index) => (
              <section key={index} className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A] tracking-tight leading-snug flex items-baseline gap-3">
                  <span className="text-[#C6A664] font-sans text-sm font-semibold tracking-wider">
                    § 0{index + 1}
                  </span>
                  <span>{section.heading}</span>
                </h2>

                <div className="text-base sm:text-lg text-[#1A1A1A]/80 leading-relaxed font-light space-y-4">
                  {/* For the very first paragraph, render a subtle luxury drop cap styling */}
                  {index === 0 ? (
                    <p className="first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-serif first-letter:text-[#C6A664] first-letter:leading-none">
                      {section.content}
                    </p>
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Suggested Internal Links (if any) */}
          {post.suggestedInternalLinks && post.suggestedInternalLinks.length > 0 && (
            <div className="my-12 bg-white rounded-2xl p-6 sm:p-8 border border-[#C6A664]/30 shadow-md space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#1A1A1A] flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#C6A664]" />
                <span>Related KHAVYN Guides & Collections</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {post.suggestedInternalLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D8C9B0]/40 hover:border-[#C6A664] text-xs font-semibold text-[#1A1A1A] hover:text-[#C6A664] transition-all group"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C6A664] transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Accordion/Cards (if any) */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="my-14 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C6A664]/15 flex items-center justify-center text-[#C6A664]">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-[#1A1A1A]">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/60">
                    Quick expert answers on fabric, care, and sizing
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {post.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-6 border border-[#D8C9B0]/60 shadow-sm space-y-2 hover:border-[#C6A664]/60 transition-colors"
                  >
                    <h4 className="font-serif text-lg font-semibold text-[#1A1A1A] flex items-start gap-2.5">
                      <span className="text-[#C6A664] font-sans text-xs font-bold mt-1">Q.</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-sm text-[#1A1A1A]/75 leading-relaxed pl-5 font-light">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Primary Keywords Cloud / Metadata footer */}
          <div className="mt-12 pt-8 border-t border-[#D8C9B0]/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/50 flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-[#C6A664]" />
                Topics:
              </span>
              {post.primaryKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs bg-white border border-[#D8C9B0]/60 text-[#1A1A1A]/70 px-3 py-1 rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>

            <ShareButtons title={post.title} url={articleUrl} />
          </div>

          {/* Dedicated Collection CTA Card */}
          {post.collectionCta && (
            <div className="mt-14 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] text-white p-8 sm:p-10 border border-[#C6A664]/40 shadow-2xl relative">
              <div className="max-w-2xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#C6A664] uppercase tracking-widest font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The KHAVYN Standard</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white leading-snug">
                  {post.collectionCta.title}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed font-light">
                  {post.collectionCta.description}
                </p>
                <div className="pt-2">
                  <Link
                    href={post.collectionCta.href}
                    className="inline-flex items-center gap-2 bg-[#C6A664] text-black font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full hover:bg-[#D8C9B0] transition-colors shadow-lg"
                  >
                    <span>{post.collectionCta.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Decorative Watermark */}
              <div className="absolute right-4 bottom-2 text-white/5 font-serif text-9xl select-none pointer-events-none hidden md:block">
                KHAVYN
              </div>
            </div>
          )}

          {/* Navigation link back to Journal */}
          <div className="mt-12 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1A1A1A]/70 hover:text-[#C6A664] transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Journal Articles</span>
            </Link>
          </div>
        </article>

        {/* Related Articles Section */}
        <section className="bg-white border-t border-[#D8C9B0]/40 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C6A664] font-semibold">
                  More From The Journal
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A] mt-1">
                  Continue Reading
                </h3>
              </div>
              <Link
                href="/blogs"
                className="text-xs uppercase tracking-widest text-[#C6A664] hover:text-[#1A1A1A] font-semibold flex items-center gap-1 transition-colors"
              >
                <span>View All 15 Articles</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relPost) => (
                <article
                  key={relPost.slug}
                  className="group flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#D8C9B0]/40 hover:border-[#C6A664]/60 transition-all duration-300 hover:shadow-xl"
                >
                  <Link
                    href={`/blogs/${relPost.slug}`}
                    className="relative h-48 w-full block overflow-hidden bg-[#1A1A1A]"
                  >
                    <Image
                      src={blogImages[relPost.slug] || relPost.image}
                      alt={relPost.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 bg-[#1A1A1A]/80 text-[#C6A664] text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {relPost.category}
                    </span>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-[#1A1A1A]/50 mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#C6A664]" />
                        <span>{relPost.readTime}</span>
                      </div>
                      <Link href={`/blogs/${relPost.slug}`}>
                        <h4 className="font-serif text-lg font-medium text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors line-clamp-2 leading-snug">
                          {relPost.title}
                        </h4>
                      </Link>
                    </div>

                    <Link
                      href={`/blogs/${relPost.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C6A664] hover:text-[#1A1A1A] uppercase tracking-wider transition-colors pt-2 border-t border-[#D8C9B0]/30"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
