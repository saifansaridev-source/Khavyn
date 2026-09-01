"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Heart, Filter, X, ChevronDown } from "lucide-react";
import { SEED_PRODUCTS, ProductSeedInput } from "@/lib/data/productsData";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useProductStore } from "@/store/useProductStore";

export default function ShopPage() {
  const { products: storeProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [selectedCollection, setSelectedCollection] = useState<string>("All");
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const collections = [
    "All",
    "Formal Shirts",
    "Polo T-Shirts",
    "Oversized T-Shirts",
    "Round Neck T-Shirts",
  ];

  const colours = [
    { name: "White", hex: "#FFFFFF" },
    { name: "Blue", hex: "#2B547E" },
    { name: "Light Pink", hex: "#F4C2C2" },
    { name: "Sand Beige", hex: "#D8C9B0" },
    { name: "Midnight Navy", hex: "#0F1B2D" },
    { name: "Dark Wine", hex: "#4A0E17" },
    { name: "Sage Green", hex: "#8A9A86" },
    { name: "Coffee Brown", hex: "#4A2E1B" },
    { name: "Cream White", hex: "#FDFBF7" },
    { name: "Black", hex: "#1A1A1A" },
  ];

  const sizes = ["S", "M", "L", "XL"];

  // Filter & Sort Logic from dynamic product store
  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      if (selectedCollection !== "All" && product.collectionName !== selectedCollection) {
        return false;
      }
      if (selectedColours.length > 0 && !selectedColours.includes(product.colour)) {
        return false;
      }
      if (selectedSizes.length > 0 && !product.sizes.some((s) => selectedSizes.includes(s))) {
        return false;
      }
      if (product.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return a.isNewArrival ? -1 : 1;
      return 0;
    });
  }, [storeProducts, selectedCollection, selectedColours, selectedSizes, maxPrice, sortBy]);


  const toggleColour = (colName: string) => {
    setSelectedColours((prev) =>
      prev.includes(colName) ? prev.filter((c) => c !== colName) : [...prev, colName]
    );
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const clearAllFilters = () => {
    setSelectedCollection("All");
    setSelectedColours([]);
    setSelectedSizes([]);
    setMaxPrice(4000);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* Header Banner */}
      <div className="bg-[#1A1A1A] text-white py-12 px-4 text-center border-b border-[#C6A664]/30">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A664] font-semibold">
          THE COMPLETE KHAVYN WARDROBE
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mt-1">
          Signature Catalogue
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-[#D8C9B0]/40 mb-8">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider"
          >
            <Filter className="w-4 h-4 text-[#C6A664]" />
            <span>Filters</span>
          </button>

          <p className="text-xs text-[#1A1A1A]/70 uppercase tracking-widest font-medium">
            Showing <span className="font-bold text-[#1A1A1A]">{filteredProducts.length}</span> Products
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#1A1A1A]/60 hidden sm:inline uppercase tracking-wider">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#D8C9B0] rounded px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-8 pr-6 border-r border-[#D8C9B0]/40">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8C9B0]/40">
              <h3 className="font-serif text-lg font-semibold tracking-wider text-[#1A1A1A] uppercase">
                FILTERS
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#C6A664] hover:underline font-semibold uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Collections
              </h4>
              <div className="space-y-1.5 text-xs">
                {collections.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`block w-full text-left py-1 transition-colors ${
                      selectedCollection === col
                        ? "font-bold text-[#C6A664]"
                        : "text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Swatches */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Colours
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {colours.map((c) => {
                  const isSelected = selectedColours.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleColour(c.name)}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-transform ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-[#C6A664] scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                Sizes
              </h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const isSelected = selectedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`w-9 h-9 rounded text-xs font-semibold flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-[#1A1A1A] border-[#D8C9B0] hover:border-[#C6A664]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold uppercase tracking-widest text-[#1A1A1A]">
                  Max Price
                </h4>
                <span className="font-semibold text-[#C6A664]">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="4000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C6A664]"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="font-serif text-2xl text-[#1A1A1A]">No products found</p>
                <p className="text-xs text-[#1A1A1A]/60">
                  Try clearing your filters or choosing a different collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#1A1A1A] text-white text-xs uppercase tracking-widest px-6 py-2.5 rounded hover:bg-[#C6A664] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isHovered = hoveredProduct === product.styleCode;
                  const isWishlisted = isInWishlist(product.styleCode);

                  return (
                    <div
                      key={product.styleCode}
                      onMouseEnter={() => setHoveredProduct(product.styleCode)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      className="group relative bg-[#F5F3EF] border border-[#D8C9B0]/40 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      {/* Product Card Image with Hover Swap */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                        <Image
                          src={isHovered ? product.images.side : product.images.front}
                          alt={product.name}
                          fill
                          className="object-cover object-center transition-all duration-700 group-hover:scale-105"
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

                        {/* Wishlist Button */}
                        <button
                          onClick={() =>
                            toggleWishlist({
                              productId: product.styleCode,
                              name: product.name,
                              slug: product.slug,
                              styleCode: product.styleCode,
                              colour: product.colour,
                              price: product.price,
                              image: product.images.front,
                            })
                          }
                          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-[#1A1A1A] hover:text-red-600 transition-colors shadow z-10"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isWishlisted ? "fill-red-600 text-red-600" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content Details */}
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
                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                  ₹{product.price.toLocaleString("en-IN")}
                                </span>
                                {hasDiscount && (
                                  <>
                                    <span className="text-xs text-[#1A1A1A]/40 line-through">
                                      ₹{product.compareAtPrice?.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#8C6D2B] bg-[#C6A664]/20 px-1.5 py-0.2 rounded">
                                      ({discountPercent}% OFF)
                                    </span>
                                  </>
                                )}
                              </div>
                              <Link
                                href={`/product/${product.slug}`}
                                className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors"
                              >
                                EXPLORE →
                              </Link>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
