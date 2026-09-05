"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getCartTotal } =
    useCartStore();

  const total = getCartTotal();
  const freeShippingThreshold = 2499;
  const progressPercent = Math.min(100, (total / freeShippingThreshold) * 100);
  const amountToFreeShipping = freeShippingThreshold - total;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#1A1A1A] flex flex-col shadow-2xl border-l border-[#D8C9B0]/40">
          {/* Header */}
          <div className="p-6 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-[#C6A664]/30">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#C6A664]" />
              <h2 className="font-serif text-xl tracking-wider uppercase text-white">
                Shopping Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#F0E9DD] px-6 py-3 border-b border-[#D8C9B0]/50 text-xs">
            {amountToFreeShipping > 0 ? (
              <p className="text-[#1A1A1A] font-medium">
                Add <span className="font-bold font-numeric text-[#C6A664]">₹{amountToFreeShipping.toLocaleString("en-IN")}</span> more for <span className="uppercase tracking-wider font-semibold">Free Express Shipping</span>
              </p>
            ) : (
              <p className="text-[#1A1A1A] font-medium flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Congratulations! You qualify for <strong>FREE Shipping</strong></span>
              </p>
            )}
            <div className="w-full bg-[#D8C9B0]/60 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#C6A664] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#1A1A1A]/60 py-12">
                <ShoppingBag className="w-12 h-12 stroke-[1.25] text-[#C6A664] mb-4 opacity-80" />
                <p className="font-serif text-lg text-[#1A1A1A] mb-2">Your Bag is Empty</p>
                <p className="text-xs text-[#1A1A1A]/70 max-w-xs mb-6">
                  Explore our signature European luxury collections and craft your wardrobe.
                </p>
                <button
                  onClick={closeCart}
                  className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] px-6 py-2.5 text-xs font-medium uppercase tracking-widest rounded-md transition-colors shadow-md"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-[#D8C9B0]/40 group"
                >
                  <div className="relative w-20 h-24 rounded-md overflow-hidden bg-[#F5F3EF] border border-[#D8C9B0]/40 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif text-base font-medium text-[#1A1A1A] hover:text-[#C6A664] transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
                        Colour: {item.colour} | Size: {item.size}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-semibold text-[#1A1A1A] font-numeric">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <>
                            <span className="text-[10px] text-[#1A1A1A]/40 line-through font-numeric">
                              ₹{item.compareAtPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[9px] font-bold font-numeric text-[#8C6D2B] bg-[#C6A664]/20 px-1 py-0.2 rounded">
                              ({Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)}% OFF)
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#D8C9B0] rounded bg-white text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-[#F0E9DD] transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 font-medium text-[#1A1A1A] font-numeric">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-[#F0E9DD] transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#1A1A1A] font-numeric">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <p className="text-[10px] text-[#1A1A1A]/40 line-through font-numeric">
                            ₹{(item.compareAtPrice * item.quantity).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F5F3EF] border-t border-[#D8C9B0]/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1A1A1A]/70 uppercase tracking-wider text-xs">
                  Subtotal
                </span>
                <span className="text-xl font-bold font-numeric text-[#1A1A1A]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/60 text-center">
                Taxes and shipping calculated at checkout. Partial COD (50% advance) available.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:shadow-lg py-3.5 px-6 rounded-md flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
