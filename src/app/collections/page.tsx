import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ArrowRight, Sparkles, Diamond, ShieldCheck, Layers } from "lucide-react";
import { SEED_PRODUCTS } from "@/lib/data/productsData";

const COLLECTIONS_LIST = [
  {
    slug: "formal-shirts",
    title: "Formal Shirts",
    subtitle: "Tailored Slim Fit • 100% Yarn-Dyed Oxford Cotton",
    desc: "Architectural precision meets 100% yarn-dyed long-staple combed cotton. Contemporary slim fit designed for boardrooms, executive meetings, and evening occasions.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&auto=format&fit=crop&q=80",
    tags: ["Formal Wear", "Yarn-Dyed", "Pre-Shrunk"],
  },
  {
    slug: "polo-t-shirts",
    title: "Polo T-Shirts",
    subtitle: "230 GSM Combed Pique Knit • Embroidered Monogram",
    desc: "Heavyweight 230 GSM pique knit with subtle ribbed collars and hand-stitched KHAVYN gold monogram embroidery. The gold standard for modern smart-casual dressing.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80",
    tags: ["230 GSM", "Pique Knit", "Smart-Casual"],
  },
  {
    slug: "oversized-t-shirts",
    title: "Oversized T-Shirts",
    subtitle: "230 GSM Streetwear Silhouette • Bio-Washed Finish",
    desc: "Relaxed European streetwear proportions featuring dropped shoulders, reinforced double-needle seams, and an ultra-soft bio-washed hand feel.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=80",
    tags: ["230 GSM", "Streetwear", "Bio-Washed"],
  },
  {
    slug: "round-neck-t-shirts",
    title: "Round Neck T-Shirts",
    subtitle: "210 GSM Combed Cotton • Fade-Resistant Colors",
    desc: "Essential round neck t-shirts crafted from 210 GSM long-staple combed cotton with non-deforming ribbed collars and fade-resistant yarn dye.",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&auto=format&fit=crop&q=80",
    tags: ["210 GSM", "Everyday Essential", "Ribbed Neck"],
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-[#1A1A1A] text-white py-20 overflow-hidden border-b border-[#C6A664]/30">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85"
            alt="KHAVYN Signature Collections"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-[#C6A664]/40 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#C6A664]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SARTORIAL EXCELLENCE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Signature Collections
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/70 font-light leading-relaxed">
            Discover our curated capsules — engineered with long-staple bio-washed combed cotton, 
            European minimalist silhouettes, and unyielding attention to detail.
          </p>

          <div className="gold-flourish-line w-32 mx-auto pt-2" />
        </div>
      </section>

      {/* Main Collections Grid */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {COLLECTIONS_LIST.map((col, idx) => {
            const count = SEED_PRODUCTS.filter((p) => {
              if (col.slug === "formal-shirts") return p.collectionName === "Formal Shirts";
              if (col.slug === "polo-t-shirts") return p.collectionName === "Polo T-Shirts";
              if (col.slug === "oversized-t-shirts") return p.collectionName === "Oversized T-Shirts";
              if (col.slug === "round-neck-t-shirts") return p.collectionName === "Round Neck T-Shirts";
              return false;
            }).length;

            const isEven = idx % 2 === 0;

            return (
              <div
                key={col.slug}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image Banner */}
                <div
                  className={`lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-lg overflow-hidden border border-[#D8C9B0]/40 group ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-[#1A1A1A]/80 backdrop-blur-md px-3 py-1 rounded text-[#C6A664] text-xs uppercase tracking-wider font-semibold">
                    {count} Styles Available
                  </div>
                </div>

                {/* Text Content */}
                <div
                  className={`lg:col-span-6 space-y-5 ${
                    isEven ? "lg:order-2 lg:pl-4" : "lg:order-1 lg:pr-4"
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A664]">
                      {col.subtitle}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
                      {col.title}
                    </h2>
                  </div>

                  <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                    {col.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {col.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold uppercase tracking-wider bg-white border border-[#D8C9B0]/60 px-3 py-1 rounded text-[#1A1A1A]/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3">
                    <Link
                      href={`/collections/${col.slug}`}
                      className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:shadow-lg px-8 py-3.5 rounded text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 group"
                    >
                      <span>DISCOVER COLLECTION</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brand Standards Banner */}
      <section className="py-16 bg-[#1A1A1A] text-white border-t border-[#C6A664]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 space-y-3 bg-white/5 rounded-lg border border-white/10">
              <Diamond className="w-8 h-8 text-[#C6A664] mx-auto stroke-[1.25]" />
              <h3 className="font-serif text-lg font-semibold text-white">100% Combed Cotton</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Yarn-dyed long-staple cotton engineered for breathability and silky hand-feel.
              </p>
            </div>

            <div className="p-6 space-y-3 bg-white/5 rounded-lg border border-white/10">
              <Layers className="w-8 h-8 text-[#C6A664] mx-auto stroke-[1.25]" />
              <h3 className="font-serif text-lg font-semibold text-white">230 GSM Knits</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Heavyweight pique and jersey knits pre-shrunk for shape retention.
              </p>
            </div>

            <div className="p-6 space-y-3 bg-white/5 rounded-lg border border-white/10">
              <ShieldCheck className="w-8 h-8 text-[#C6A664] mx-auto stroke-[1.25]" />
              <h3 className="font-serif text-lg font-semibold text-white">European Proportions</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Architecturally drafted patterns tailored for modern Indian gentlemen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
