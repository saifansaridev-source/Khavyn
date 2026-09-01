"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, LogOut, Package, Settings } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useUserStore } from "@/store/useUserStore";
import { CartDrawer } from "./CartDrawer";

export const Header: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { openCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useUserStore();

  // Fix hydration mismatch by only rendering counts after client mount
  const [clientItemCount, setClientItemCount] = useState(0);
  const [clientWishlistCount, setClientWishlistCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setClientItemCount(getItemCount());
      setClientWishlistCount(wishlistItems.length);
    }
  }, [mounted, getItemCount, wishlistItems]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push("/");
  };

  // User avatar initials
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1A1A1A] text-white border-b border-[#C6A664]/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4">
            {/* Left Brand Logo & Mobile Toggle */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white/80 hover:text-[#C6A664] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Left-Aligned Logo with Luxury Animation */}
              <Link
                href="/"
                className="group inline-flex flex-col items-start text-left py-1 animate-logo-pop hover-gold-glow transition-transform duration-300"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#C6A664] group-hover:text-[#FAF7F2] transition-all duration-300 group-hover:tracking-[0.25em]">
                  KHAVYN
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.28em] uppercase text-[#C6A664]/80 font-medium -mt-0.5 group-hover:text-[#C6A664] transition-colors">
                  CRAFTING EVERYDAY LUXURY
                </span>
              </Link>
            </div>

            {/* Center-Left Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium uppercase tracking-[0.15em] text-white/90">
              <Link
                href="/"
                className="hover:text-[#C6A664] transition-colors py-1 border-b-2 border-transparent hover:border-[#C6A664]"
              >
                Home
              </Link>
              <div className="relative group py-5">
                <Link
                  href="/shop"
                  className="hover:text-[#C6A664] transition-colors flex items-center gap-1 border-b-2 border-transparent hover:border-[#C6A664]"
                >
                  <span>Shop</span>
                  <ChevronDown className="w-3 h-3 text-[#C6A664] transition-transform group-hover:rotate-180 duration-200" />
                </Link>
                <div className="absolute left-0 top-full hidden group-hover:block w-56 bg-[#1A1A1A] border border-[#C6A664]/30 shadow-2xl py-3 px-2 z-50 rounded-b-md">
                  <Link href="/shop" className="block px-4 py-2 text-xs hover:bg-[#C6A664]/20 hover:text-[#C6A664] rounded transition-colors">All Products</Link>
                  <Link href="/collections/formal-shirts" className="block px-4 py-2 text-xs hover:bg-[#C6A664]/20 hover:text-[#C6A664] rounded transition-colors">Formal Shirts</Link>
                  <Link href="/collections/polo-t-shirts" className="block px-4 py-2 text-xs hover:bg-[#C6A664]/20 hover:text-[#C6A664] rounded transition-colors">Polo T-Shirts</Link>
                  <Link href="/collections/oversized-t-shirts" className="block px-4 py-2 text-xs hover:bg-[#C6A664]/20 hover:text-[#C6A664] rounded transition-colors">Oversized T-Shirts</Link>
                  <Link href="/collections/round-neck-t-shirts" className="block px-4 py-2 text-xs hover:bg-[#C6A664]/20 hover:text-[#C6A664] rounded transition-colors">Round Neck T-Shirts</Link>
                </div>
              </div>
              <Link
                href="/collections"
                className="hover:text-[#C6A664] transition-colors py-1 border-b-2 border-transparent hover:border-[#C6A664]"
              >
                Collections
              </Link>
              <Link
                href="/about"
                className="hover:text-[#C6A664] transition-colors py-1 border-b-2 border-transparent hover:border-[#C6A664]"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#C6A664] transition-colors py-1 border-b-2 border-transparent hover:border-[#C6A664]"
              >
                Concierge
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4 text-white">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-white/80 hover:text-[#C6A664] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* User Account Button — dynamic */}
              <div className="relative hidden sm:block" ref={userMenuRef}>
                {mounted && isAuthenticated ? (
                  <>
                    <button
                      id="header-user-avatar"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 group"
                      aria-label="Account menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#C6A664] text-black text-xs font-bold flex items-center justify-center shadow-[0_0_12px_rgba(198,166,100,0.4)] group-hover:shadow-[0_0_20px_rgba(198,166,100,0.6)] transition-shadow duration-300">
                        {initials}
                      </div>
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-3 w-56 bg-[#1A1A1A] border border-[#C6A664]/30 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                          <p className="text-xs text-white/40 truncate mt-0.5">{user?.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-[#C6A664] hover:bg-white/5 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-[#C6A664] hover:bg-white/5 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-[#C6A664] hover:bg-white/5 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </Link>
                        <div className="border-t border-white/10 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-white/80 hover:text-[#C6A664] transition-colors px-3 py-2 border border-white/15 hover:border-[#C6A664]/50 rounded-lg"
                    aria-label="Sign In"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-1.5 text-white/80 hover:text-[#C6A664] transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {mounted && clientWishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C6A664] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {clientWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-1.5 text-white/80 hover:text-[#C6A664] transition-colors flex items-center gap-1.5"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {mounted && clientItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C6A664] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {clientItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1A1A1A] border-t border-[#C6A664]/30 px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-4 text-sm uppercase tracking-widest">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C6A664] pb-2 border-b border-white/10">Home</Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C6A664] pb-2 border-b border-white/10">Shop All</Link>
              <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C6A664] pb-2 border-b border-white/10">Our Collections</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C6A664] pb-2 border-b border-white/10">About Us</Link>
              {mounted && isAuthenticated ? (
                <>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C6A664] pb-2 border-b border-white/10">My Account</Link>
                  <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="text-left text-red-400/80 hover:text-red-400">Sign Out</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#C6A664] hover:text-white pb-2 border-b border-white/10">Sign In / Register</Link>
              )}
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#C6A664]">Contact</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/85 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-[#FAF7F2] rounded-lg p-6 shadow-2xl relative border border-[#C6A664]">
            <button onClick={() => setSearchOpen(false)} className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-2">
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-4 text-center">Search KHAVYN</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setSearchOpen(false);
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="flex items-center gap-3 border-b-2 border-[#1A1A1A] pb-2"
            >
              <Search className="w-5 h-5 text-[#C6A664]" />
              <input
                type="text"
                placeholder="Search formal shirts, polo t-shirts, oversized, sage green..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none text-[#1A1A1A] placeholder:text-[#1A1A1A]/50"
                autoFocus
              />
              <button type="submit" className="bg-[#1A1A1A] text-white text-xs uppercase tracking-widest px-4 py-2 rounded hover:bg-[#C6A664] transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Slide-in Cart Drawer */}
      <CartDrawer />
    </>
  );
};
