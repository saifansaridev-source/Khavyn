"use client";

import React, { useEffect, useState } from "react";

export const AnnouncementBar: React.FC = () => {
  const [text, setText] = useState(
    "COMPLIMENTARY SHIPPING ON ALL ORDERS ABOVE ₹2499"
  );

  useEffect(() => {
    fetch(`/api/settings?_t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.announcementText) {
          setText(data.settings.announcementText);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden bg-[#1A1A1A] border-b border-[#C6A664]/30 text-[#C6A664] py-2 px-3 sm:px-4 text-[10px] sm:text-[11px] tracking-[0.08em] sm:tracking-[0.15em] uppercase text-center font-medium select-none">
      <span className="inline-flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
        <span className="hidden sm:inline text-[#C6A664]/80">◈</span>
        <span className="leading-relaxed">{text}</span>
        <span className="hidden sm:inline text-[#C6A664]/80">◈</span>
      </span>
    </div>
  );
};