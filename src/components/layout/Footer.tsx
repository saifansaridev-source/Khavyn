"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* Inline SVGs for social brand icons (removed from lucide-react v1.x) */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white border-t border-[#C6A664]/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 6-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="KHAVYN - Crafting Everyday Luxury"
                className="h-12 sm:h-14 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-xs text-white/70 leading-relaxed">
              Premium European luxury fashion house for modern menswear. Designed with unyielding commitment to craftsmanship, timeless aesthetics, and ultimate fabric comfort.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://facebook.com/KHAVYN.OFFICIAL"
                target="_blank"
                rel="noreferrer"
                aria-label="KHAVYN on Facebook"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-[#C6A664] hover:bg-white/20 transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com/khavyn.official"
                target="_blank"
                rel="noreferrer"
                aria-label="KHAVYN on Instagram"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-[#C6A664] hover:bg-white/20 transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com/company/khavyn"
                target="_blank"
                rel="noreferrer"
                aria-label="KHAVYN on LinkedIn"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-[#C6A664] hover:bg-white/20 transition-colors"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>


          {/* Column 2: Shop */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C6A664] uppercase">
              Signature Shop
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/shop" className="hover:text-[#C6A664] transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/collections/formal-shirts" className="hover:text-[#C6A664] transition-colors">
                  Formal Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/polo-t-shirts" className="hover:text-[#C6A664] transition-colors">
                  Polo T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/oversized-t-shirts" className="hover:text-[#C6A664] transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/round-neck-t-shirts" className="hover:text-[#C6A664] transition-colors">
                  Round Neck T-Shirts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C6A664] uppercase">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/account" className="hover:text-[#C6A664] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#C6A664] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C6A664] transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C6A664] transition-colors">
                  Brand Heritage
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#C6A664] transition-colors text-white/40">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C6A664] uppercase">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/policies/privacy" className="hover:text-[#C6A664] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-[#C6A664] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-[#C6A664] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-[#C6A664] transition-colors">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/cancellation" className="hover:text-[#C6A664] transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/payment" className="hover:text-[#C6A664] transition-colors">
                  Payment Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/cookie" className="hover:text-[#C6A664] transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 & 6: Newsletter & K Logo */}
          <div className="lg:col-span-2 flex items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C6A664] uppercase">
                Private Privileges
              </h4>
              <p className="text-xs text-white/70 leading-relaxed max-w-xs">
                Subscribe to receive exclusive access to capsule releases, private sales, and sartorial recommendations.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing to KHAVYN Private Privileges.");
                }}
                className="flex items-center border border-white/20 rounded overflow-hidden focus-within:border-[#C6A664] max-w-xs"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white/5 text-xs px-3 py-2.5 text-white focus:outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  className="bg-[#C6A664] text-black p-2.5 hover:bg-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
            
            <div className="hidden lg:flex items-center justify-center pt-2">
              <img 
                src="/k-logo.png" 
                alt="KHAVYN K" 
                className="w-44 h-auto object-contain opacity-90" 
              />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="space-y-1 text-center md:text-left">
            <p>© {new Date().getFullYear()} KHAVYN. All Rights Reserved.</p>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center space-x-3 text-xs bg-white/5 px-4 py-2 rounded border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-[#C6A664]">Secured by</span>
            <span className="font-semibold text-white/90">VISA</span>
            <span>•</span>
            <span className="font-semibold text-white/90">Mastercard</span>
            <span>•</span>
            <span className="font-semibold text-white/90">RuPay</span>
            <span>•</span>
            <span className="font-semibold text-[#C6A664]">UPI / Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
