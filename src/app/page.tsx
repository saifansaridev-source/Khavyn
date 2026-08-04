"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WishlistButton } from "@/components/product/WishlistButton";
import {
  Diamond,
  Truck,
  RotateCw,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Heart,
} from "lucide-react";
import { SEED_PRODUCTS } from "@/lib/data/productsData";
import { useProductStore } from "@/store/useProductStore";

export default function HomePage() {
  const { products: storeProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const bestSellers = storeProducts.filter((p) => p.isBestSeller).slice(0, 4);


  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* 1. HERO BANNER */}
      <section className="relative w-full min-h-[85vh] bg-[#F0E9DD] flex items-center overflow-hidden border-b border-[#D8C9B0]/40">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85"
            alt="KHAVYN European Luxury Menswear Lifestyle"
            fill
            priority
            className="object-cover object-center opacity-35 mix-blend-multiply scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] text-[#C6A664] rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CRAFTING EVERYDAY LUXURY</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.1]">
              Timeless Style. <br />
              <span className="italic font-normal text-[#C6A664]">Everyday Luxury.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#1A1A1A]/80 leading-relaxed font-light">
              Architectural precision meets long-staple bio-washed combed cotton. Elevated essentials designed in Europe, tailored in India for the modern gentleman.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:shadow-xl px-8 py-4 rounded-md text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 group"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES ROW */}
      <section className="bg-white border-b border-[#D8C9B0]/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#D8C9B0]/30 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 p-3">
              <Diamond className="w-6 h-6 text-[#C6A664] stroke-[1.5] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Premium Quality
                </h4>
                <p className="text-[11px] text-[#1A1A1A]/60 font-light">
                  100% Long-Staple Combed Cotton
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-3 pt-6 md:pt-3">
              <Truck className="w-6 h-6 text-[#C6A664] stroke-[1.5] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Worldwide Shipping
                </h4>
                <p className="text-[11px] text-[#1A1A1A]/60 font-light">
                  Complimentary above ₹2,499
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-3 pt-6 md:pt-3">
              <RotateCw className="w-6 h-6 text-[#C6A664] stroke-[1.5] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Easy Exchange Policy
                </h4>
                <p className="text-[11px] text-[#1A1A1A]/60 font-light">
                  Hassle-free size & return request
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-3 pt-6 md:pt-3">
              <ShieldCheck className="w-6 h-6 text-[#C6A664] stroke-[1.5] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Secure Payments
                </h4>
                <p className="text-[11px] text-[#1A1A1A]/60 font-light">
                  Prepaid & Partial COD Supported
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COLLECTIONS GRID */}
      <section className="py-20 bg-[#F0E9DD] border-b border-[#D8C9B0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
              OUR COLLECTIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              Explore Our Signature Collections
            </h2>
            <div className="gold-flourish-line w-24 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Formal Shirts",
                sub: "Contemporary Tailored Slim Fit",
                slug: "formal-shirts",
                image:
                  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
              },
              {
                title: "Polo T-Shirts",
                sub: "230 GSM Pique Combed Knit",
                slug: "polo-t-shirts",
                image:
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
              },
              {
                title: "Oversized T-Shirts",
                sub: "230 GSM Streetwear Silhouette",
                slug: "oversized-t-shirts",
                image:
                  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
              },
              {
                title: "Round Neck T-Shirts",
                sub: "210 GSM Everyday Essentials",
                slug: "round-neck-t-shirts",
                image:
                  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
              },
            ].map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group relative h-96 rounded-lg overflow-hidden border border-[#D8C9B0]/40 shadow-sm flex flex-col justify-end p-6"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/30 to-transparent" />
                <div className="relative z-10 space-y-1 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A664] font-medium">
                    {col.sub}
                  </span>
                  <h3 className="font-serif text-xl font-semibold tracking-wide text-white">
                    {col.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#C6A664] pt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-[#C6A664] px-8 py-3.5 rounded-md text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              VIEW ALL COLLECTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY KHAVYN (Black Section) */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
              THE KHAVYN STANDARDS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Crafted for Excellence. Worn with Confidence.
            </h2>
            <div className="gold-flourish-line w-32 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-center space-y-3 hover:border-[#C6A664]/50 transition-colors">
              <Award className="w-8 h-8 text-[#C6A664] mx-auto stroke-[1.25]" />
              <h4 className="font-serif text-lg font-semibold text-white">
                Premium Fabrics
              </h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                100% yarn-dyed combed cotton & heavyweight 230 GSM knits engineered for silky hand-feel.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-center space-y-3 hover:border-[#C6A664]/50 transition-colors">
              <Sparkles className="w-8 h-8 text-[#C6A664] mx-auto stroke-[1.25]" />
              <h4 className="font-serif text-lg font-semibold text-white">
                Timeless Design
              </h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Minimalist European proportions tailored to effortlessly transcend seasonal trends.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-center space-y-3 hover:border-[#C6A664]/50 transition-colors">
              <Layers className="w-8 h-8 text-[#C6A664] mx-auto stroke-[1.25]" />
              <h4 className="font-serif text-lg font-semibold text-white">
                Expert Craftsmanship
              </h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Pre-shrunk, bio-washed, and reinforced seams for enduring silhouette structure.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-center space-y-3 hover:border-[#C6A664]/50 transition-colors">
              <Diamond className="w-8 h-8 text-[#C6A664] mx-auto stroke-[1.25]" />
              <h4 className="font-serif text-lg font-semibold text-white">
                Everyday Luxury
              </h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Luxury boutique finish without exorbitant markups, crafted for everyday wear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS GRID */}
      <section className="py-20 bg-[#FAF7F2] border-b border-[#D8C9B0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
                BEST SELLERS
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1">
                Loved by Thousands
              </h2>
            </div>
            <Link
              href="/shop?sort=bestsellers"
              className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C6A664] flex items-center gap-1 border-b border-[#1A1A1A] pb-0.5"
            >
              <span>Explore All Best Sellers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <div
                key={product.styleCode}
                className="group relative bg-[#F5F3EF] border border-[#D8C9B0]/40 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image Container with Wishlist */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                  <Image
                    src={product.images.front}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <WishlistButton
                    item={{
                      productId: product.styleCode,
                      name: product.name,
                      slug: product.slug,
                      styleCode: product.styleCode,
                      colour: product.colour,
                      price: product.price,
                      image: product.images.front,
                    }}
                    className="absolute top-3 right-3 z-10"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#1A1A1A]/80 backdrop-blur-md text-[#C6A664] text-[10px] uppercase font-semibold px-2.5 py-1 rounded">
                    {product.collectionName}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="block font-serif text-base font-medium text-[#1A1A1A] hover:text-[#C6A664] transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>

                  {/* Multi-Color Swatch Row */}
                  <div className="flex items-center gap-1.5 py-0.5">
                    {[
                      product.colourHex,
                      ...(product.collectionName === "Formal Shirts"
                        ? ["#7BA0C4", "#F4C2C2", "#0F1B2D"]
                        : product.collectionName === "Polo T-Shirts"
                        ? ["#D2B48C", "#1B263B", "#4A2E2B", "#F5F3EF"]
                        : product.collectionName === "Oversized T-Shirts"
                        ? ["#5C4033", "#36454F", "#D8A7B1", "#1A1A1A"]
                        : ["#1A1A1A", "#722F37", "#1B263B", "#556B2F"]),
                    ]
                      .slice(0, 5)
                      .map((hex, i) => (
                        <span
                          key={i}
                          className={`w-3 h-3 rounded-full border ${
                            i === 0
                              ? "ring-1 ring-[#C6A664] border-white scale-110"
                              : "border-[#1A1A1A]/20"
                          }`}
                          style={{ backgroundColor: hex }}
                          title={i === 0 ? product.colour : "Color Option"}
                        />
                      ))}
                    <span className="text-[10px] text-[#1A1A1A]/50 font-medium ml-1">
                      {product.colour}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-[#1A1A1A]/40 line-through">
                          ₹{product.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C6A664]"
                    >
                      VIEW →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BRAND STORY SECTION */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
                ABOUT KHAVYN
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Crafting Everyday Luxury
              </h2>
              <p className="text-sm text-white/70 leading-relaxed font-light">
                KHAVYN Fashion Private Limited was born out of a single obsession: creating garments that feel as remarkable as they look. We reject fast fashion, flimsy fabrics, and overt logos in favor of tailored lines, yarn-dyed combed cotton, and timeless European minimalism.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <h5 className="font-serif text-xl font-bold text-[#C6A664]">100%</h5>
                  <p className="text-[11px] text-white/60 uppercase tracking-wider">Combed Cotton</p>
                </div>
                <div className="space-y-1">
                  <h5 className="font-serif text-xl font-bold text-[#C6A664]">230 GSM</h5>
                  <p className="text-[11px] text-white/60 uppercase tracking-wider">Heavyweight Knit</p>
                </div>
                <div className="space-y-1">
                  <h5 className="font-serif text-xl font-bold text-[#C6A664]">3 Days</h5>
                  <p className="text-[11px] text-white/60 uppercase tracking-wider">Easy Exchange</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-[#C6A664]/30 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&auto=format&fit=crop&q=80"
                alt="KHAVYN Editorial Model Shot"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
