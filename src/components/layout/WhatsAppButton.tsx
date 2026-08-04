"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export const WhatsAppButton: React.FC = () => {
  const pathname = usePathname();
  const [productTitle, setProductTitle] = useState<string | null>(null);

  useEffect(() => {
    // If on a product detail page, attempt to read the H1 or title
    if (pathname?.startsWith("/product/")) {
      const h1Elem = document.querySelector("h1");
      if (h1Elem && h1Elem.textContent) {
        setProductTitle(h1Elem.textContent.trim());
      } else {
        setProductTitle(null);
      }
    } else {
      setProductTitle(null);
    }
  }, [pathname]);

  const defaultMessage = productTitle
    ? `Hi KHAVYN, I'd like to know more about the ${productTitle}`
    : "Hi KHAVYN, I'd like to know more about your luxury menswear collection.";

  const whatsappUrl = `https://wa.me/919373205258?text=${encodeURIComponent(
    defaultMessage
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with KHAVYN on WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
    >
      <MessageCircle className="w-6 h-6 fill-white stroke-none group-hover:rotate-12 transition-transform duration-300" />
      <span className="absolute right-14 bg-[#1A1A1A] text-[#C6A664] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 border border-[#C6A664]/30">
        Chat with Us
      </span>
    </a>
  );
};
