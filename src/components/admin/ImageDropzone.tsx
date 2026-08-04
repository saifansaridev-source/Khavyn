"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Link as LinkIcon } from "lucide-react";

interface ImageDropzoneProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 bg-[#141414] border border-white/10 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-[#C6A664] tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "upload"
                ? "bg-[#C6A664] text-black font-semibold"
                : "text-white/50 hover:text-white"
            }`}
          >
            Drag & Drop
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "url"
                ? "bg-[#C6A664] text-black font-semibold"
                : "text-white/50 hover:text-white"
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {value ? (
        <div className="relative w-full rounded border border-[#C6A664]/50 overflow-hidden group bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-auto object-cover" style={{ minHeight: "100px", maxHeight: "160px" }} />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove Image</span>
            </button>
          </div>
        </div>
      ) : mode === "upload" ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[110px] ${
            isDragOver
              ? "border-[#C6A664] bg-[#C6A664]/10"
              : "border-white/20 bg-white/[0.02] hover:border-[#C6A664]/60 hover:bg-white/[0.04]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <UploadCloud className={`w-6 h-6 ${isDragOver ? "text-[#C6A664]" : "text-white/40"}`} />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-white">
              Drag & Drop Image Here
            </p>
            <p className="text-[10px] text-white/40">
              or click to browse from device (JPG, PNG, WebP)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="w-full bg-[#1A1A1A] border border-white/20 rounded pl-8 pr-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A664]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
