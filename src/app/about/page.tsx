import React from "react";
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
    desc: "Our patterns are drafted in European proportions, then refined by master tailors in Pune to marry minimal silhouette with ultimate wearability.",
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
  { year: "2022", title: "The Founding Vision", desc: "KHAVYN was founded by a team of textile engineers and European-trained designers obsessed with accessible luxury." },
  { year: "2023", title: "First Collection Launch", desc: "The inaugural Formal Shirts line — crafted from 100% yarn-dyed combed cotton — sold out in 72 hours, validating the demand for honest luxury." },
  { year: "2024", title: "Expansion to Knitwear", desc: "The 230 GSM Polo and Oversized lines were introduced, pioneering heavyweight pique knits priced for the modern professional wardrobe." },
  { year: "2025", title: "Pan-India Presence", desc: "KHAVYN expanded shipping to every pin code across India, with export orders beginning to arrive from UAE, UK, and the US." },
  { year: "2026", title: "Digital Flagship Launch", desc: "Launch of the KHAVYN digital flagship — a seamless luxury shopping experience powered by technology, built for the next generation of Indian gentlemen." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* HERO */}
      <section className="relative h-[70vh] min-h-[480px] bg-[#1A1A1A] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85"
          alt="KHAVYN Brand Story"
          fill
          priority
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-5">
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-[#C6A664]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C6A664]">
                Our Heritage
              </span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Crafting<br />
              <span className="italic font-normal text-[#C6A664]">Everyday Luxury</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light max-w-lg">
              Born in Pune. Refined in Europe. Worn by modern gentlemen who demand more than fashion — they demand substance.
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
                A Brand Born From One Obsession
              </h2>
              <div className="h-px w-16 bg-gradient-to-r from-[#C6A664] to-transparent" />
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                KHAVYN was born from a single frustration: the gap between premium price tags and actual quality in Indian menswear. Our founders — engineers and designers trained across Europe and India — believed that everyday men deserve garments with the same architectural precision as luxury European ateliers, at a price that doesn&apos;t require a special occasion to justify.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                We spent two years sourcing 100% long-staple combed cotton from certified mills, working with master tailors in Pune to perfect our European slim-fit pattern, and developing our bio-wash finish that gives every KHAVYN piece its signature silky hand-feel from the very first wear.
              </p>
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                The result is a wardrobe that earns compliments in boardrooms and resonates on weekends — garments that tell the world, without a single word, that you have taste.
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
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-[#1A1A1A] text-white p-5 rounded-lg shadow-2xl border border-[#C6A664]/30 max-w-[180px]">
                <p className="font-sans text-3xl font-bold text-[#C6A664]">230</p>
                <p className="text-[10px] uppercase tracking-wider text-white/70 mt-1">GSM Heavyweight Knit</p>
                <p className="text-[10px] text-white/50 mt-1 font-light">Our signature weight standard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="py-14 bg-[#F0E9DD] border-y border-[#D8C9B0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "100%", label: "Combed Cotton" },
              { val: "230 GSM", label: "Min. Fabric Weight" },
              { val: "11", label: "Angles Per Product" },
              { val: "3 Days", label: "Exchange Window" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="font-sans text-3xl sm:text-4xl font-bold text-[#C6A664]">{s.val}</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="absolute left-[27px] sm:left-1/2 top-0 bottom-0 w-px bg-[#D8C9B0] -translate-x-1/2" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 sm:px-10 ${i % 2 === 0 ? "sm:text-right" : "sm:text-left"} pl-14 sm:pl-0`}>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C6A664]">
                      {m.year}
                    </span>
                    <h3 className="font-serif text-base font-semibold text-[#1A1A1A] mt-0.5">{m.title}</h3>
                    <p className="text-xs text-[#1A1A1A]/65 leading-relaxed font-light mt-1">{m.desc}</p>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-[14px] h-[14px] rounded-full bg-[#C6A664] border-2 border-[#FAF7F2] shadow-sm mt-4 sm:mt-3 flex-shrink-0" />

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM / CRAFTED IN PUNE */}
      <section className="py-24 bg-[#F0E9DD] border-t border-[#D8C9B0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#D8C9B0]/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&auto=format&fit=crop&q=80"
                alt="KHAVYN Atelier Pune"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-5">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
                Crafted in India
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-snug">
                Designed in Europe.<br />Made with Pride in Pune.
              </h2>
              <div className="h-px w-16 bg-gradient-to-r from-[#C6A664] to-transparent" />
              <p className="text-sm text-[#1A1A1A]/75 leading-relaxed font-light">
                Our production hub is based in Sangavi, Pune — home to some of India&apos;s most skilled garment craftsmen. Every piece passes through a 14-point quality checkpoint before it earns the KHAVYN label.
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
