"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SEED_PRODUCTS, ProductSeedInput } from "@/lib/data/productsData";
import { WishlistButton } from "@/components/product/WishlistButton";

interface RecentlyViewedProps {
  currentSlug?: string;
}

const STORAGE_KEY = "khavyn_recently_viewed";

export function trackRecentlyViewed(slug: string) {
  if (typeof window === "undefined" || !slug) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let slugs: string[] = raw ? JSON.parse(raw) : [];
    // Remove if already present, push to front
    slugs = slugs.filter((s) => s !== slug);
    slugs.unshift(slug);
    // Keep max 10
    slugs = slugs.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch (err) {
    console.error("Failed to update recently viewed products", err);
  }
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentSlug }) => {
  const [items, setItems] = useState<ProductSeedInput[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (currentSlug) {
        trackRecentlyViewed(currentSlug);
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const slugs: string[] = JSON.parse(raw);
        // Exclude current product
        const filteredSlugs = slugs.filter((s) => s !== currentSlug);
        const matched = filteredSlugs
          .map((s) => SEED_PRODUCTS.find((p) => p.slug === s))
          .filter((p): p is ProductSeedInput => Boolean(p));
        setItems(matched.slice(0, 8));
      }
    } catch {
      // Ignore storage errors
    }
  }, [currentSlug]);

  if (items.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-[#D8C9B0]/40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] uppercase tracking-wider">
            Recently Viewed
          </h3>
          <p className="text-xs text-[#1A1A1A]/60">Items you previously explored</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((prod) => (
          <Link
            key={prod.styleCode}
            href={`/product/${prod.slug}`}
            className="group bg-[#F5F3EF] rounded-lg overflow-hidden border border-[#D8C9B0]/40 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative aspect-[3/4] w-full bg-white overflow-hidden">
              <Image
                src={prod.images.front}
                alt={`${prod.name} - KHAVYN Luxury Menswear`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <WishlistButton
                item={{
                  productId: prod.styleCode,
                  name: prod.name,
                  slug: prod.slug,
                  styleCode: prod.styleCode,
                  colour: prod.colour,
                  price: prod.price,
                  image: prod.images.front,
                }}
                className="absolute top-3 right-3 z-10"
              />
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#C6A664] tracking-wider">
                {prod.collectionName}
              </span>
              <h4 className="font-serif text-sm font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#C6A664]">
                {prod.name}
              </h4>
              <p className="text-xs font-semibold text-[#1A1A1A]">
                ₹{prod.price.toLocaleString("en-IN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
