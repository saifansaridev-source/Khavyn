"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { WishlistButton } from "@/components/product/WishlistButton";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { RestockNotifyModal } from "@/components/product/RestockNotifyModal";
import {
  Star,
  Truck,
  RotateCw,
  ShieldCheck,
  Plus,
  Minus,
  Film,
  Ruler,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react";
import { SEED_PRODUCTS, ProductSeedInput } from "@/lib/data/productsData";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

import { useProductStore } from "@/store/useProductStore";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

interface ReviewItem {
  _id: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  storeResponse?: string;
  createdAt: string;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { products: storeProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product =
    storeProducts.find((p) => p.slug === slug) ||
    SEED_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }


  // Gallery view state
  const imageList = [
    product.images.front,
    product.images.side,
    product.images.back,
    product.images.angle45,
    product.images.fabricTexture,
    product.images.embroidery,
    product.images.collarLabel,
    product.images.modelFront,
    product.images.modelSide,
    product.images.modelBack,
    product.images.model45,
  ];

  const [selectedImage, setSelectedImage] = useState<string>(imageList[0]);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [isVideoSelected, setIsVideoSelected] = useState<boolean>(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Restock notification modal state
  const [restockModalOpen, setRestockModalOpen] = useState<boolean>(false);
  const [outOfStockTargetSize, setOutOfStockTargetSize] = useState<string>("");

  // UX additions state: quantity, coupon, pincode checker, sticky cart bar
  const [quantity, setQuantity] = useState<number>(1);
  const [couponCopied, setCouponCopied] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Product Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [revRating, setRevRating] = useState(5);
  const [revName, setRevName] = useState("");
  const [revEmail, setRevEmail] = useState("");
  const [revTitle, setRevTitle] = useState("");
  const [revComment, setRevComment] = useState("");
  const [revHoneypot, setRevHoneypot] = useState("");
  const [revMsg, setRevMsg] = useState("");
  const [revSubmitting, setRevSubmitting] = useState(false);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // All color variants in the same collection from dynamic product store
  const collectionVariants = storeProducts.filter(
    (p) => p.collectionName === product.collectionName
  );

  const relatedProducts = storeProducts.filter(
    (p) => p.collectionName === product.collectionName && p.slug !== product.slug
  ).slice(0, 4);


  // Fetch approved reviews for this product
  useEffect(() => {
    fetch(`/api/reviews?productSlug=${product.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, [product.slug]);

  // Keep selected image updated when product slug changes
  useEffect(() => {
    setSelectedImage(product.images.front);
    setIsVideoSelected(false);
  }, [product.slug, product.images.front]);

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.styleCode,
      name: product.name,
      slug: product.slug,
      styleCode: product.styleCode,
      colour: product.colour,
      size: selectedSize,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: quantity,
      image: product.images.front,
    });
    setQuantity(1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRevSubmitting(true);
    setRevMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          productName: product.name,
          userName: revName,
          userEmail: revEmail,
          rating: revRating,
          title: revTitle,
          comment: revComment,
          honeypot: revHoneypot,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRevMsg(data.message || "Thank you! Your review has been submitted for moderation.");
        setRevName("");
        setRevEmail("");
        setRevTitle("");
        setRevComment("");
        setTimeout(() => {
          setReviewFormOpen(false);
          setRevMsg("");
        }, 3000);
      } else {
        setRevMsg(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setRevMsg("Network error. Please try again.");
    } finally {
      setRevSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A] pb-20">
      <AnnouncementBar />
      <Header />

      {/* Breadcrumb Trail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-[#1A1A1A]/60 flex items-center gap-2">
        <Link href="/" className="hover:text-[#1A1A1A]">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/collections/${product.collectionName.toLowerCase().replace(/ /g, "-")}`}
          className="hover:text-[#1A1A1A]"
        >
          {product.collectionName}
        </Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image & Video Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            {/* Thumbnail Rail */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[600px] scrollbar-none order-2 sm:order-1">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(img);
                    setIsVideoSelected(false);
                  }}
                  className={`relative w-16 h-20 rounded border overflow-hidden flex-shrink-0 transition-all ${
                    !isVideoSelected && selectedImage === img
                      ? "ring-2 ring-[#C6A664] border-transparent"
                      : "border-[#D8C9B0]/50 hover:border-[#1A1A1A]"
                  }`}
                >
                  <Image src={img} alt={`${product.name} View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}

              {/* Product Video Thumbnail Button (if product has videoUrl) */}
              {product.videoUrl && (
                <button
                  onClick={() => setIsVideoSelected(true)}
                  className={`relative w-16 h-20 rounded border flex flex-col items-center justify-center gap-1 bg-[#1A1A1A] text-[#C6A664] flex-shrink-0 transition-all ${
                    isVideoSelected ? "ring-2 ring-[#C6A664]" : "hover:bg-black"
                  }`}
                  title="Watch Product Video"
                >
                  <Film className="w-5 h-5 text-[#C6A664]" />
                  <span className="text-[9px] font-bold uppercase">Video</span>
                </button>
              )}
            </div>

            {/* Main Display Frame — Capped height per Part 8 */}
            <div className="flex-1 order-1 sm:order-2">
              {isVideoSelected && product.videoUrl ? (
                <div className="relative aspect-[3/4] w-full max-h-[70vh] sm:max-h-[75vh] lg:max-h-[600px] mx-auto rounded-lg overflow-hidden bg-black border border-[#D8C9B0]/40 flex items-center justify-center">
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="relative aspect-[3/4] w-full max-h-[70vh] sm:max-h-[75vh] lg:max-h-[600px] mx-auto rounded-lg overflow-hidden bg-[#F5F3EF] border border-[#D8C9B0]/40 group">
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Buy Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              {product.isNewArrival && (
                <span className="inline-block bg-[#1A1A1A] text-[#C6A664] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                  New Arrival
                </span>
              )}
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                {product.name}
              </h1>
              <p className="text-xs text-[#1A1A1A]/60 font-medium">
                Style Code: <span className="text-[#1A1A1A] font-mono">{product.styleCode}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-[#C6A664]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C6A664]" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#1A1A1A] font-numeric">4.9</span>
              <span className="text-xs text-[#1A1A1A]/50">
                (<span className="font-numeric">{reviews.length > 0 ? reviews.length + 148 : 148}</span> verified reviews)
              </span>
            </div>

            {/* Price & Offer Badges */}
            <div className="space-y-1">
              <div className="flex items-baseline flex-wrap gap-3">
                <span className="font-numeric text-lg sm:text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-xs sm:text-sm lg:text-base text-[#1A1A1A]/40 line-through font-numeric">
                      ₹{product.compareAtPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold font-numeric text-[#8C6D2B] bg-[#C6A664]/20 border border-[#C6A664]/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                    </span>
                  </>
                )}
                {product.customBadge && (
                  <span className="text-xs font-bold text-white bg-[#1A1A1A] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {product.customBadge}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-emerald-800 flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                Inclusive of all taxes • Free express shipping above ₹2,499
              </p>
            </div>

            {/* Coupon Banner with Copy-to-Clipboard */}
            <div className="bg-[#F0E9DD] border border-dashed border-[#C6A664] rounded-lg px-4 py-3 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-semibold text-[#1A1A1A]">New User Offer:</span>{" "}
                <span className="text-[#1A1A1A]/70">Flat ₹300 OFF on orders above ₹1,999</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("KHAVYN300");
                  setCouponCopied(true);
                  setTimeout(() => setCouponCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 bg-[#1A1A1A] text-[#C6A664] text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap hover:bg-black transition-colors"
              >
                <span>{couponCopied ? "Copied!" : "KHAVYN300"}</span>
              </button>
            </div>

            {/* PIN Code Delivery Checker */}
            <div className="border-t border-[#D8C9B0]/40 pt-4 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                Check Delivery Availability
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter PIN Code"
                  className="flex-1 border border-[#D8C9B0] rounded-md px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C6A664] max-w-[180px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (pincode.length === 6) {
                      setDeliveryEstimate("Delivery in 3–5 business days");
                    } else {
                      setDeliveryEstimate("Please enter a valid 6-digit PIN code");
                    }
                  }}
                  className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] underline underline-offset-2 hover:text-[#C6A664] transition-colors"
                >
                  Check
                </button>
              </div>
              {deliveryEstimate && (
                <p className="text-xs text-emerald-700 font-medium">{deliveryEstimate}</p>
              )}
            </div>

            {/* Interactive Colour Selector */}
            <div className="space-y-2 border-t border-[#D8C9B0]/40 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                Colour: <span className="font-semibold text-[#C6A664]">{product.colour}</span>
              </label>
              <div className="flex items-center gap-3">
                {collectionVariants.map((variant) => {
                  const isSelected = variant.slug === product.slug;
                  return (
                    <button
                      key={variant.slug}
                      onClick={() => {
                        if (variant.slug !== product.slug) {
                          router.push(`/product/${variant.slug}`);
                        }
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-[#C6A664] ring-2 ring-[#C6A664]/40 scale-110"
                          : "border-[#1A1A1A]/20 hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: variant.colourHex }}
                      title={`${variant.colour} - Click to switch color`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Compact Size Selector */}
            <div className="space-y-2 border-t border-[#D8C9B0]/40 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                    Select Size:
                  </label>
                  <span className="text-xs font-semibold text-[#C6A664]">{selectedSize}</span>
                </div>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-[#C6A664] hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5 max-w-sm">
                {product.sizes.map((s) => {
                  const stockCount = product.stock[s as keyof typeof product.stock] || 0;
                  const isSelected = selectedSize === s;
                  const isOutOfStock = stockCount === 0;

                  return (
                    <button
                      key={s}
                      onClick={() => {
                        if (isOutOfStock) {
                          setOutOfStockTargetSize(s);
                          setRestockModalOpen(true);
                        } else {
                          setSelectedSize(s);
                        }
                      }}
                      className={`h-11 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex flex-col items-center justify-center ${
                        isSelected && !isOutOfStock
                          ? "bg-[#1A1A1A] text-[#C6A664] border-2 border-[#C6A664] shadow-md scale-[1.02]"
                          : "bg-white text-[#1A1A1A] border border-[#D8C9B0] hover:border-[#1A1A1A]"
                      } ${
                        isOutOfStock
                          ? "opacity-40 line-through bg-gray-100/80 hover:opacity-75 cursor-pointer"
                          : ""
                      }`}
                      title={isOutOfStock ? "Sold Out - Click to get restock alert" : `Select size ${s}`}
                    >
                      <span>{s}</span>
                      {stockCount > 0 && stockCount <= 5 && (
                        <span className="text-[8px] font-normal text-amber-700 -mt-0.5">Only {stockCount} left</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="space-y-2 border-t border-[#D8C9B0]/40 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                Quantity:
              </label>
              <div className="flex items-center gap-3 w-fit border border-[#D8C9B0] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0E9DD] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#1A1A1A] font-numeric">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0E9DD] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:shadow-lg py-4 rounded-md font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
              >
                ADD TO CART
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white py-4 rounded-md font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300"
              >
                BUY IT NOW (PREPAID OR PARTIAL COD)
              </button>

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
                showText
                className="w-full justify-center"
              />
            </div>

            {/* Trust Icons Row — Cleaned per Part 12 */}
            <div className="bg-[#F0E9DD] rounded-lg p-4 grid grid-cols-2 gap-4 border border-[#D8C9B0]/50 text-center text-[11px] font-medium text-[#1A1A1A]">
              <div className="flex flex-col items-center gap-1.5 p-1 border-r border-[#D8C9B0]/60">
                <Truck className="w-5 h-5 text-[#C6A664]" />
                <span>Free Shipping Above ₹2,499</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-1">
                <ShieldCheck className="w-5 h-5 text-[#C6A664]" />
                <span>100% Authentic Guarantee</span>
              </div>
            </div>

            {/* Collapsible Accordions */}
            <div className="border-t border-[#D8C9B0]/50 divide-y divide-[#D8C9B0]/40 pt-2">
              {[
                {
                  id: "details",
                  title: "Product Details",
                  content: (
                    <div className="space-y-2 text-xs text-[#1A1A1A]/80 font-light leading-relaxed">
                      <p>{product.description}</p>
                      <ul className="list-disc pl-4 space-y-1 pt-2 font-normal">
                        <li>Material: {product.material}</li>
                        <li>Fit: {product.fit}</li>
                        <li>Collar: {product.collarType}</li>
                        <li>Sleeve: {product.sleeve}</li>
                        <li>Package Contains: {product.packageContains}</li>
                        <li>Country of Origin: {product.countryOfOrigin}</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  id: "care",
                  title: "Fabric & Care Instructions",
                  content: (
                    <ul className="list-disc pl-4 text-xs text-[#1A1A1A]/80 space-y-1 font-light">
                      {product.careInstructions.map((ci, i) => (
                        <li key={i}>{ci}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  id: "shipping",
                  title: "Shipping & Returns Policy",
                  content: (
                    <div className="space-y-2 text-xs text-[#1A1A1A]/80 leading-relaxed font-light">
                      <p>
                        <strong className="font-semibold text-[#1A1A1A]">Complimentary Express Shipping:</strong> Dispatched within 1–2 business days. Complimentary express shipping applies nationwide on all orders above ₹2,499.
                      </p>
                      <p>
                        <strong className="font-semibold text-[#1A1A1A]">Apparel 7-Day Return Policy:</strong> Returns and size exchanges are accepted within 7 days of delivery for all eligible unworn apparel garments with original tags attached.
                      </p>
                    </div>
                  ),
                },
              ].map((acc) => (
                <div key={acc.id} className="py-4">
                  <button
                    onClick={() => toggleAccordion(acc.id)}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] text-left"
                  >
                    <span>{acc.title}</span>
                    {openAccordion === acc.id ? (
                      <Minus className="w-4 h-4 text-[#C6A664]" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#C6A664]" />
                    )}
                  </button>
                  {openAccordion === acc.id && (
                    <div className="mt-3 pt-2">{acc.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* YOU MAY ALSO LIKE Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#D8C9B0]/40">
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-8 text-center uppercase tracking-wider">
              YOU MAY ALSO LIKE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const hasDiscount = rel.compareAtPrice && rel.compareAtPrice > rel.price;
                const discountPercent = hasDiscount
                  ? Math.round(((rel.compareAtPrice! - rel.price) / rel.compareAtPrice!) * 100)
                  : 0;

                return (
                  <Link
                    key={rel.styleCode}
                    href={`/product/${rel.slug}`}
                    className="group bg-[#F5F3EF] rounded-lg overflow-hidden border border-[#D8C9B0]/40 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[3/4] w-full bg-white overflow-hidden">
                      <Image
                        src={rel.images.front}
                        alt={rel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <WishlistButton
                        item={{
                          productId: rel.styleCode,
                          name: rel.name,
                          slug: rel.slug,
                          styleCode: rel.styleCode,
                          colour: rel.colour,
                          price: rel.price,
                          image: rel.images.front,
                        }}
                        className="absolute top-3 right-3 z-10"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="font-serif text-sm font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#C6A664]">
                        {rel.name}
                      </h4>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#1A1A1A] font-numeric">
                          ₹{rel.price.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-[11px] text-[#1A1A1A]/40 line-through font-numeric">
                              ₹{rel.compareAtPrice?.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] font-bold font-numeric text-[#8C6D2B] bg-[#C6A664]/20 px-1.5 py-0.5 rounded">
                              ({discountPercent}% OFF)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* RECENTLY VIEWED PRODUCTS CAROUSEL */}
        <RecentlyViewed currentSlug={product.slug} />

        {/* CUSTOMER REVIEWS & MODERATION SYSTEM SECTION */}
        <div className="mt-20 pt-12 border-t border-[#D8C9B0]/40 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] uppercase tracking-wider">
                Customer Reviews
              </h3>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">
                Verified buyer ratings & feedback for {product.name}
              </p>
            </div>

            <button
              onClick={() => setReviewFormOpen(!reviewFormOpen)}
              className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-md transition-colors flex items-center gap-2 self-start"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Submission Form */}
          {reviewFormOpen && (
            <div className="bg-white border border-[#C6A664] rounded-xl p-6 shadow-xl space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Submit Verified Purchase Review
              </h4>

              {revMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{revMsg}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                {/* Honeypot field (hidden) */}
                <input
                  type="text"
                  value={revHoneypot}
                  onChange={(e) => setRevHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1A1A1A] font-semibold mb-1 uppercase">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A] font-semibold mb-1 uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={revEmail}
                      onChange={(e) => setRevEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1 uppercase">
                    Star Rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRevRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= revRating ? "fill-[#C6A664] text-[#C6A664]" : "text-[#D8C9B0]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1 uppercase">
                    Review Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={revTitle}
                    onChange={(e) => setRevTitle(e.target.value)}
                    placeholder="e.g. Exceptional fit and fabric"
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1 uppercase">
                    Detailed Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="Share your experience regarding drape, sizing, and comfort..."
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewFormOpen(false)}
                    className="px-4 py-2 text-xs text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={revSubmitting}
                    className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{revSubmitting ? "Submitting..." : "Submit for Moderation"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Approved Reviews List */}
          {reviews.length === 0 ? (
            <div className="bg-[#F5F3EF] border border-[#D8C9B0]/40 rounded-xl p-8 text-center text-xs text-[#1A1A1A]/60 space-y-2">
              <p className="font-serif text-base text-[#1A1A1A]">No reviews yet for this product.</p>
              <p>Be the first verified customer to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white border border-[#D8C9B0]/40 rounded-xl p-6 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#1A1A1A]">{rev.userName}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-[11px] text-[#1A1A1A]/40">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-[#C6A664]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? "fill-[#C6A664]" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {rev.title && (
                      <span className="font-bold text-xs text-[#1A1A1A]">{rev.title}</span>
                    )}
                  </div>

                  <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-light">
                    "{rev.comment}"
                  </p>

                  {rev.storeResponse && (
                    <div className="bg-[#FAF7F2] border-l-2 border-[#C6A664] p-3 rounded-r text-xs space-y-1 mt-2">
                      <span className="font-bold uppercase text-[10px] text-[#C6A664] tracking-wider block">
                        KHAVYN Response:
                      </span>
                      <p className="text-[#1A1A1A]/70">{rev.storeResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restock Alert Modal */}
      <RestockNotifyModal
        productName={product.name}
        colour={product.colour}
        size={outOfStockTargetSize}
        isOpen={restockModalOpen}
        onClose={() => setRestockModalOpen(false)}
      />

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-xl w-full rounded-lg p-6 relative border border-[#C6A664] shadow-2xl">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            >
              ✕
            </button>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2 text-center">
              KHAVYN Size Guide ({product.collectionName})
            </h3>
            <p className="text-xs text-[#1A1A1A]/60 text-center mb-6">
              All measurements are in inches. Contemporary European fit.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white">
                    <th className="p-2 border border-white/20">Size</th>
                    <th className="p-2 border border-white/20">Chest (in)</th>
                    <th className="p-2 border border-white/20">Length (in)</th>
                    <th className="p-2 border border-white/20">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C9B0]">
                  <tr>
                    <td className="p-2.5 font-bold">S</td>
                    <td className="p-2.5">38</td>
                    <td className="p-2.5">27</td>
                    <td className="p-2.5">17</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">M</td>
                    <td className="p-2.5">40</td>
                    <td className="p-2.5">28</td>
                    <td className="p-2.5">18</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">L</td>
                    <td className="p-2.5">42</td>
                    <td className="p-2.5">29</td>
                    <td className="p-2.5">19</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">XL</td>
                    <td className="p-2.5">44</td>
                    <td className="p-2.5">30</td>
                    <td className="p-2.5">20</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#1A1A1A]/60 mt-4 text-center">
              If between sizes, we recommend sizing up for a relaxed luxury drape.
            </p>
          </div>
        </div>
      )}

      {/* Sticky Bottom Cart Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D8C9B0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 sm:gap-6">
          <div className="relative w-12 h-14 rounded overflow-hidden flex-shrink-0 hidden xs:block sm:block">
            <Image src={product.images.front} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-[#1A1A1A] truncate">{product.name}</p>
            <p className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-numeric">₹{product.price.toLocaleString("en-IN")}</p>
          </div>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border border-[#D8C9B0] rounded-md px-2 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
          >
            {product.sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleAddToCart}
            className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] px-5 sm:px-8 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
