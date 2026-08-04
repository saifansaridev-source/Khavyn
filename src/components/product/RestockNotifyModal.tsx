"use client";

import React, { useState } from "react";
import { Bell, X, CheckCircle } from "lucide-react";

interface RestockNotifyModalProps {
  productName: string;
  colour: string;
  size: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RestockNotifyModal: React.FC<RestockNotifyModalProps> = ({
  productName,
  colour,
  size,
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] max-w-md w-full rounded-xl p-6 relative border border-[#C6A664] shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#C6A664] mx-auto animate-bounce" />
            <h4 className="font-serif text-xl font-bold text-[#1A1A1A]">
              Restock Request Received
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
              We will email you at <strong className="text-[#1A1A1A]">{email}</strong> as soon as size <strong className="text-[#1A1A1A]">{size}</strong> in {colour} is restocked.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-[#C6A664]">
              <Bell className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-widest text-[#1A1A1A]">
                Restock Alert Request
              </span>
            </div>

            <div>
              <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">
                {productName}
              </h4>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">
                Size <strong className="text-[#1A1A1A]">{size}</strong> ({colour}) is currently sold out.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Enter Your Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-[#D8C9B0] rounded-md px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] text-white hover:bg-[#C6A664] py-3 rounded-md font-semibold text-xs uppercase tracking-[0.2em] transition-all"
            >
              NOTIFY ME WHEN AVAILABLE
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
