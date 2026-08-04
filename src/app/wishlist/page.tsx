"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const { items, toggleWishlist, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const handleMoveToCart = (item: any) => {
    addItem({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      styleCode: item.styleCode,
      colour: item.colour,
      size: "M", // Default size selection
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    toggleWishlist(item); // Remove from wishlist after moving to cart
    openCart();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* Header Banner */}
      <section className="bg-[#1A1A1A] text-white py-16 text-center border-b border-[#C6A664]/30 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-[#C6A664]/40 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#C6A664]">
            <Heart className="w-3.5 h-3.5 fill-[#C6A664]" />
            <span>SAVED SELECTIONS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Your Private Wishlist
          </h1>

          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-lg mx-auto">
            Your curated collection of KHAVYN luxury garments. Move items to your shopping bag or reserve them for future dressing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-[#F5F3EF] rounded-2xl border border-[#D8C9B0]/40 p-8 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#1A1A1A]/5 border border-[#D8C9B0]/60 flex items-center justify-center">
              <Heart className="w-9 h-9 text-[#D8C9B0] stroke-[1]" />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs text-[#1A1A1A]/65 leading-relaxed font-light">
                Explore our signature Formal Shirts, Polo T-Shirts, and Heavyweight Oversized collections to save your favorite garments.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:shadow-lg px-8 py-4 rounded text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 group"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#D8C9B0]/40 pb-4">
              <p className="text-xs uppercase tracking-wider text-[#1A1A1A]/60 font-medium">
                Showing <strong className="text-[#1A1A1A]">{items.length}</strong> Saved Items
              </p>
              <button
                onClick={clearWishlist}
                className="text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="group bg-[#F5F3EF] border border-[#D8C9B0]/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-red-600 hover:bg-white shadow transition-all"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#C6A664]">
                        {item.styleCode}
                      </span>
                      <Link
                        href={`/product/${item.slug}`}
                        className="block font-serif text-base font-semibold text-[#1A1A1A] hover:text-[#C6A664] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs font-bold text-[#1A1A1A]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="w-full bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:shadow py-3 rounded text-xs font-semibold uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Move to Bag</span>
                      </button>

                      <Link
                        href={`/product/${item.slug}`}
                        className="block text-center text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 hover:text-[#C6A664] transition-colors font-medium py-1"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
