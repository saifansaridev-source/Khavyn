"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SEED_PRODUCTS } from "@/lib/data/productsData";
import { notFound } from "next/navigation";
import { WishlistButton } from "@/components/product/WishlistButton";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const COLLECTION_MAP: Record<string, { title: string; desc: string; banner: string }> = {
  "formal-shirts": {
    title: "Formal Shirts Collection",
    desc: "Yarn-Dyed Oxford Combed Cotton. Contemporary Tailored Slim Fit designed for corporate authority and evening elegance.",
    banner: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1600&auto=format&fit=crop&q=80",
  },
  "polo-t-shirts": {
    title: "Polo T-Shirts Collection",
    desc: "Heavyweight 230 GSM Combed Pique Knit. Refined polo collars with embroidered KHAVYN chest monograms.",
    banner: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80",
  },
  "oversized-t-shirts": {
    title: "Oversized T-Shirts Collection",
    desc: "230 GSM Streetwear Architectural Silhouette with dropped shoulders and bio-washed touch.",
    banner: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&auto=format&fit=crop&q=80",
  },
  "round-neck-t-shirts": {
    title: "Round Neck T-Shirts Collection",
    desc: "210 GSM Combed Cotton Everyday Essentials. Fade-resistant color fastness with soft ribbed necks.",
    banner: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1600&auto=format&fit=crop&q=80",
  },
};

export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = use(params);
  const colInfo = COLLECTION_MAP[slug];

  if (!colInfo) {
    notFound();
  }

  const products = SEED_PRODUCTS.filter((p) => {
    if (slug === "formal-shirts") return p.collectionName === "Formal Shirts";
    if (slug === "polo-t-shirts") return p.collectionName === "Polo T-Shirts";
    if (slug === "oversized-t-shirts") return p.collectionName === "Oversized T-Shirts";
    if (slug === "round-neck-t-shirts") return p.collectionName === "Round Neck T-Shirts";
    return false;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#1A1A1A] flex items-center justify-center text-center px-4">
        <Image
          src={colInfo.banner}
          alt={colInfo.title}
          fill
          className="object-cover opacity-35"
        />
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A664] font-semibold">
            KHAVYN SIGNATURE COLLECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            {colInfo.title}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light">
            {colInfo.desc}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.styleCode}
              className="group bg-[#F5F3EF] border border-[#D8C9B0]/40 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                <Image
                  src={product.images.front}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {product.customBadge && (
                    <span className="bg-[#1A1A1A] text-[#C6A664] text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider shadow-sm">
                      {product.customBadge}
                    </span>
                  )}
                  {product.isNewArrival && !product.customBadge && (
                    <span className="bg-[#1A1A1A] text-[#C6A664] text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider shadow-sm">
                      New Arrival
                    </span>
                  )}
                  {product.isBestSeller && !product.customBadge && (
                    <span className="bg-[#C6A664] text-black text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider shadow-sm">
                      Best Seller
                    </span>
                  )}
                </div>

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
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href={`/product/${product.slug}`}
                  className="block font-serif text-lg font-medium text-[#1A1A1A] hover:text-[#C6A664] transition-colors line-clamp-1"
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

                {/* Price & Offer Badges */}
                {(() => {
                  const hasDiscount =
                    product.compareAtPrice && product.compareAtPrice > product.price;
                  const discountPercent = hasDiscount
                    ? Math.round(
                        ((product.compareAtPrice! - product.price) /
                          product.compareAtPrice!) *
                          100
                      )
                    : 0;

                  return (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#1A1A1A] font-numeric">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-xs text-[#1A1A1A]/40 line-through font-numeric">
                              ₹{product.compareAtPrice?.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] font-bold font-numeric text-[#8C6D2B] bg-[#C6A664]/20 px-1.5 py-0.2 rounded">
                              ({discountPercent}% OFF)
                            </span>
                          </>
                        )}
                      </div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C6A664]"
                      >
                        EXPLORE →
                      </Link>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
