"use client";

import React, { useEffect, useState } from "react";

export const AnnouncementBar: React.FC = () => {
  const [text, setText] = useState(
    "COMPLIMENTARY SHIPPING ON ALL ORDERS ABOVE ₹2499"
  );

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.announcementText) {
          setText(data.settings.announcementText);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-[#1A1A1A] border-b border-[#C6A664]/30 text-[#C6A664] py-2 px-4 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-center font-medium select-none">
      <span className="inline-flex items-center justify-center gap-3">
        <span className="text-[#C6A664]/80">◈</span>
        <span>{text}</span>
        <span className="text-[#C6A664]/80">◈</span>
      </span>
    </div>
  );
};