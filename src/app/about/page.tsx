"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Award, Layers, Diamond, Heart, Sparkles, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Uncompromising Quality",
    desc: "Every thread is sourced from long-staple combed cotton farms. We accept nothing less than 100% yarn-dyed perfection — soft against skin, resilient against time.",
  },
  {
    icon: Layers,
    title: "Architectural Precision",
    desc: "Our patterns are drafted in European proportions, then refined by master tailors to marry minimal silhouette with ultimate wearability.",
  },
  {
    icon: Diamond,
    title: "Everyday Elevation",
    desc: "We reject the notion that luxury must be reserved for special occasions. KHAVYN garments are engineered to be worn daily, improving with each wash.",
  },
  {
    icon: Heart,
    title: "Responsible Crafting",
    desc: "Bio-washing, pre-shrunk finishing, and reinforced seams aren't afterthoughts — they are commitments written into every production order.",
  },
];

const milestones = [
  {
    year: "01 — The Vision",
    title: "Where It All Began",
    desc: "A vision to create refined everyday clothing that brings together exceptional craftsmanship, timeless design and modern Indian sensibility.",
  },
  {
    year: "02 — The Foundation",
    title: "Crafting the KHAVYN Identity",
    desc: "KHAVYN was built around a simple belief — luxury should not be reserved for special occasions. It should be part of everyday life.",
  },
  {
    year: "03 — The Craft",
    title: "Designed With Intention",
    desc: "From fabric selection and silhouettes to finishing and detailing, every element is thoughtfully developed to deliver comfort, sophistication and lasting quality.",
  },
  {
    year: "04 — The Collection",
    title: "Everyday Luxury, Curated",
    desc: "Our first collections bring together premium formal shirts, polos, oversized T-shirts and round-neck T-shirts — designed to become effortless essentials.",
  },
  {
    year: "05 — The Launch",
    title: "A New Chapter Begins",
    desc: "KHAVYN steps into the world with its first collection, introducing a distinct interpretation of contemporary Indian luxury.",
  },
  {
    year: "06 — The Future",
    title: "Beyond Everyday",
    desc: "Our journey continues — expanding collections, refining craftsmanship and building KHAVYN into a contemporary Indian fashion house with a global point of view.",
  },
];

export default function AboutPage() {
  const [aboutHeroImage, setAboutHeroImage] = useState(
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85"
  );
  const [craftedInIndiaImage, setCraftedInIndiaImage] = useState(
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&auto=format&fit=crop&q=80"
  );

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          if (data.settings.aboutHeroImage) {
            setAboutHeroImage(data.settings.aboutHeroImage);
          }
          if (data.settings.craftedInIndiaImage) {
            setCraftedInIndiaImage(data.settings.craftedInIndiaImage);
          }
        }
      })
      .catch((err) => console.error("Error loading about page imagery", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* HERO — Height capped to h-[50vh] min-h-[380px] max-h-[500px] per Part 4 */}
      <section className="relative h-[50vh] min-h-[380px] max-h-[500px] bg-[#1A1A1A] flex items-center overflow-hidden">
        <Image
          src={aboutHeroImage}
          alt="KHAVYN Brand Story"
          fill
          priority
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-[#C6A664]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C6A664]">
                Our Heritage
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight">
              Crafting<br />
              <span className="italic font-normal text-[#C6A664]">Everyday Luxury</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light max-w-lg">
              Refined in Europe. Worn by modern gentlemen who demand more than fashion — they demand substance.
            </p>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
                The KHAVYN Story
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-snug">
                Company Profile / About Us
              </h2>
              <div className="h-px w-16 bg-gradient-to-r from-[#C6A664] to-transparent" />
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                KHAVYN Fashion Private Limited is a premium Indian fashion brand dedicated to creating timeless apparel that combines refined design, exceptional quality, and everyday comfort. Inspired by global fashion standards and guided by our philosophy, &quot;Crafting Everyday Luxury,&quot; KHAVYN creates clothing that is elegant, versatile, and made to be enjoyed for years.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                We believe true luxury lies in simplicity, quality, and attention to detail. Every KHAVYN garment is thoughtfully designed using carefully selected fabrics, modern silhouettes, and skilled craftsmanship. From the first design to the final stitch, every step reflects our commitment to excellence, ensuring that each product delivers comfort, durability, and a premium finish.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                Our collections include Premium Formal Shirts, Premium Polo T-Shirts, Premium Oversized T-Shirts, and Premium Round Neck T-Shirts. Every piece is designed to suit modern lifestyles, offering effortless style for work, travel, casual outings, celebrations, and everyday wear. With clean designs and timeless colours, our apparel is created to remain relevant beyond changing fashion trends.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                At KHAVYN, we focus on creating clothing that people enjoy wearing—not just because it looks premium, but because it feels comfortable, fits well, and is made to last. We believe that exceptional clothing is defined by quality materials, thoughtful design, and careful craftsmanship rather than unnecessary extravagance.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                Customer trust is at the heart of everything we do. We are committed to delivering a premium shopping experience through secure online payments, reliable nationwide delivery, elegant packaging, and dedicated customer support. As KHAVYN continues to grow, we aim to expand our presence through our official online store, trusted retail partners, and exclusive brand stores.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                Our vision is to establish KHAVYN as one of India&apos;s most admired premium fashion brands while building a strong presence in international markets. Through innovation, responsible business practices, and an uncompromising commitment to quality, we aspire to create apparel that reflects confidence, sophistication, and timeless style.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                At KHAVYN, we believe great style is never temporary. It is created through quality, craftsmanship, and designs that remain timeless.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light font-medium">
                Brand Philosophy: <span className="italic">Crafting Everyday Luxury.</span>
              </p>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-[#D8C9B0]/60 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&auto=format&fit=crop&q=85"
                  alt="KHAVYN Editorial Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Note: Floating stat card removed per Part 12 */}
            </div>
          </div>
        </div>
      </section>

      {/* STATS ROW — Cleaned per Part 12 & formatted with font-numeric per Part 5 */}
      <section className="py-14 bg-[#F0E9DD] border-y border-[#D8C9B0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 max-w-xl mx-auto gap-8 text-center">
            {[
              { val: "100%", label: "Combed Cotton" },
              { val: "11", label: "Angles Per Product" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="font-numeric text-3xl sm:text-4xl font-bold text-[#C6A664]">{s.val}</p>
                <p className="text-[11px] uppercase tracking-wider text-[#1A1A1A]/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="py-24 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              The KHAVYN Principles
            </h2>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#C6A664] to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4 hover:border-[#C6A664]/40 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#C6A664] stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-base font-semibold text-white">{title}</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE / MILESTONES */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
              Building Something That Lasts
            </h2>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#C6A664] to-transparent mx-auto" />
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[6px] sm:left-[7px] top-1 bottom-1 w-px bg-[#D8C9B0]" />

            <div className="space-y-12">
              {milestones.map((m) => (
                <div key={m.year} className="relative flex items-start gap-6 sm:gap-8 pl-1">
                  {/* Dot */}
                  <div className="relative z-10 w-[14px] h-[14px] rounded-full bg-[#C6A664] border-2 border-[#FAF7F2] shadow-sm mt-1.5 flex-shrink-0" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C6A664]">
                      {m.year}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1A1A1A] mt-0.5">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#1A1A1A]/65 leading-relaxed font-light mt-1.5 max-w-lg">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CRAFTED IN INDIA — Updated per Part 6 & Part 1/2/6 Section C */}
      <section id="crafted" className="py-24 bg-[#F0E9DD] border-t border-[#D8C9B0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#D8C9B0]/60 shadow-lg">
              <Image
                src={craftedInIndiaImage}
                alt="KHAVYN Atelier Bangalore & Tripur"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-5">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
                Crafted in India
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-snug">
                Designed in Europe.<br />Made with Pride in Bangalore.
              </h2>
              <div className="h-px w-16 bg-gradient-to-r from-[#C6A664] to-transparent" />
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                Our production hub is based in Bangalore and Tripur, home to some of India&apos;s most skilled garment craftsmen. Every piece passes through a 14-point quality checkpoint before it earns the KHAVYN label.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                We are proudly a Make in India brand — not as a marketing slogan, but as a genuine commitment to the artisans, mills, and textile workers who breathe life into every garment we create.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-[#C6A664] px-7 py-3.5 rounded-md text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
                >
                  Shop the Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1A1A] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <Sparkles className="w-8 h-8 text-[#C6A664] mx-auto stroke-[1.25]" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Ready to Elevate Your Wardrobe?
          </h2>
          <p className="text-sm text-white/60 leading-relaxed font-light">
            Explore our signature collections and discover what everyday luxury truly feels like.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/shop"
              className="bg-[#C6A664] text-[#1A1A1A] hover:bg-white px-8 py-4 rounded-md text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
            >
              Explore All Collections
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 text-white hover:border-[#C6A664] hover:text-[#C6A664] px-8 py-4 rounded-md text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
