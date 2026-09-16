"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} - ${url}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-widest text-[#1A1A1A]/50 font-medium mr-2 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5 text-[#C6A664]" />
        Share
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
      >
        WA
      </a>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-black/5 text-[#1A1A1A] hover:bg-black hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
        title="Share on X"
        aria-label="Share on X"
      >
        X
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors flex items-center justify-center text-xs font-semibold"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        in
      </a>

      <button
        onClick={handleCopy}
        className="h-9 px-3.5 rounded-full bg-[#1A1A1A]/5 hover:bg-[#C6A664] hover:text-black transition-colors flex items-center gap-1.5 text-xs text-[#1A1A1A]/80 font-medium"
        title="Copy Link"
        aria-label="Copy Link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};
