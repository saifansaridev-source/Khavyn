import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ShieldCheck, FileText, Truck, RotateCw, XCircle, CreditCard, ArrowRight } from "lucide-react";

const POLICIES_LIST = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    icon: ShieldCheck,
    desc: "How KHAVYN collects, encrypts, and protects your personal data under the IT Act 2000 and data protection standards.",
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    icon: FileText,
    desc: "Governing terms, intellectual property, product pricing, and binding terms for www.khavyn.com.",
  },
  {
    slug: "shipping",
    title: "Shipping & Delivery Policy",
    icon: Truck,
    desc: "Complimentary express shipping above ₹2,499, delivery dispatch timelines, and 26,000+ pincode logistics info.",
  },
  {
    slug: "returns",
    title: "Return & Exchange Policy",
    icon: RotateCw,
    desc: "3-day exchange window, size swap procedure, quality inspection standards, and refund timelines.",
  },
  {
    slug: "cancellation",
    title: "Cancellation Policy",
    icon: XCircle,
    desc: "Pre-dispatch cancellation terms, Partial COD 50% advance guidelines, and delivery refusal policies.",
  },
  {
    slug: "payment",
    title: "Payment Policy",
    icon: CreditCard,
    desc: "Supported payment gateways, 256-bit SSL encryption, 100% Prepaid options, and 50% Partial COD mechanism.",
  },
];

export default function PoliciesIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <div className="bg-[#1A1A1A] text-white py-16 px-4 text-center border-b border-[#C6A664]/30 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A664] font-semibold">
            KHAVYN LEGAL & GOVERNANCE DESK
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Legal & Policy Center
          </h1>
          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-xl mx-auto">
            Comprehensive legal governance, customer rights, shipping standards, and payment policies for KHAVYN Fashion Private Limited.
          </p>
        </div>
      </div>

      {/* Grid of Policies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POLICIES_LIST.map((policy) => {
            const Icon = policy.icon;
            return (
              <Link
                key={policy.slug}
                href={`/policies/${policy.slug}`}
                className="group bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-xl p-8 shadow-sm hover:shadow-md hover:border-[#C6A664]/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#C6A664]/40 flex items-center justify-center text-[#C6A664] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors">
                      {policy.title}
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light">
                      {policy.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#D8C9B0]/30 mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C6A664]">
                  <span>READ FULL POLICY</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Corporate Legal Info */}
        <div className="bg-[#1A1A1A] text-white p-8 rounded-xl border border-[#C6A664]/30 text-center space-y-3">
          <h4 className="font-serif text-xl font-bold text-[#C6A664]">
            KHAVYN Fashion Private Limited
          </h4>
          <p className="text-xs text-white/70 font-light max-w-xl mx-auto leading-relaxed">
            GSTIN: 27AAMCK8767F1ZW • CIN: U74999PN2022PTC212345 • Registered Office: Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra, India.
          </p>
          <p className="text-[11px] text-white/50 pt-2 font-mono">
            Legal inquiries & governance requests: <a href="mailto:legal@khavyn.com" className="text-[#C6A664] hover:underline">legal@khavyn.com</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
