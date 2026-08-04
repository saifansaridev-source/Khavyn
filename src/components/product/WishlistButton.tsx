"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";

interface WishlistButtonProps {
  item: WishlistItem;
  className?: string;
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  item,
  className = "",
  showText = false,
}) => {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const active = isInWishlist(item.productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
  };

  if (showText) {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 border px-6 py-3.5 rounded text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
          active
            ? "border-red-600 bg-red-50 text-red-600 shadow-sm"
            : "border-[#1A1A1A] text-[#1A1A1A] hover:border-[#C6A664] hover:text-[#C6A664]"
        } ${className}`}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            active ? "fill-red-600 text-red-600" : ""
          }`}
        />
        <span>{active ? "Wishlisted" : "Add to Wishlist"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Remove from Wishlist" : "Add to Wishlist"}
      title={active ? "Remove from Wishlist" : "Add to Wishlist"}
      className={`p-2 bg-white/80 backdrop-blur-md rounded-full text-[#1A1A1A] transition-all hover:scale-110 ${
        active ? "text-red-600" : "hover:text-red-600"
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          active ? "fill-red-600 text-red-600" : ""
        }`}
      />
    </button>
  );
};
