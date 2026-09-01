import React from "react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="w-full bg-[#1A1A1A] border-b border-[#C6A664]/30 text-[#C6A664] py-2 px-4 text-[11px] sm:text-xs tracking-[0.2em] uppercase text-center font-medium select-none">
      <span className="inline-flex items-center justify-center gap-3">
        <span className="text-[#C6A664]/80">◈</span>
        <span>USE CODE: KHAVYN10 FOR 10% OFF YOUR FIRST ORDER</span>
        <span className="text-[#C6A664]/80">◈</span>
      </span>
    </div>
  );
};
