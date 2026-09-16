"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Film, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Reusable Drag-and-Drop Media Upload Component
 * - Images are routed directly to Cloudinary
 * - Videos are routed directly to ImageKit (fast binary upload to /khavyn/product-videos)
 * - Pure drag-and-drop / file selector with clean remove support
 */

interface DragDropUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  resourceType?: "image" | "video";
  folder?: string;
  helperText?: string;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  label,
  value,
  onChange,
  resourceType = "image",
  folder = resourceType === "video" ? "khavyn/product-videos" : "khavyn/products",
  helperText,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    // Basic MIME type validation
    if (resourceType === "image" && !file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WebP, etc.)");
      return;
    }
    if (resourceType === "video" && !file.type.startsWith("video/")) {
      setUploadError("Please select a valid video file (MP4, MOV, WebM, etc.)");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Direct ImageKit Upload for videos (fastest — bypasses serverless body limits)
      if (resourceType === "video") {
        let uploaded = false;
        try {
          const authRes = await fetch("/api/admin/imagekit/auth");
          if (authRes.ok) {
            const authData = await authRes.json();
            if (authData.token && authData.signature && authData.publicKey) {
              const ikFormData = new FormData();
              ikFormData.append("file", file);
              ikFormData.append("fileName", file.name || `video_${Date.now()}.mp4`);
              ikFormData.append("publicKey", authData.publicKey);
              ikFormData.append("signature", authData.signature);
              ikFormData.append("expire", String(authData.expire));
              ikFormData.append("token", authData.token);
              const targetFolder = folder.startsWith("/") ? folder : `/${folder}`;
              ikFormData.append("folder", targetFolder);

              const ikUploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                method: "POST",
                body: ikFormData,
              });

              const ikUploadData = await ikUploadRes.json();
              if (ikUploadRes.ok && ikUploadData.url) {
                onChange(ikUploadData.url);
                setUploadSuccess(true);
                uploaded = true;
              } else {
                console.warn("Direct ImageKit client upload failed, trying server route:", ikUploadData);
              }
            }
          }
        } catch (ikDirectErr) {
          console.warn("Direct ImageKit upload encountered error, falling back to server route:", ikDirectErr);
        }

        if (uploaded) {
          setIsUploading(false);
          return;
        }
      }

      // 2. Server-side upload route (Cloudinary for images, ImageKit server-side for videos)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("resourceType", resourceType);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            (resourceType === "video"
              ? "Failed to upload video to ImageKit."
              : "Failed to upload image to Cloudinary.")
        );
      }

      onChange(data.url);
      setUploadSuccess(true);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(
        err.message ||
          (resourceType === "video"
            ? "Upload error. Please check ImageKit configuration or file size."
            : "Upload error. Please check Cloudinary configuration or network connection.")
      );
    } finally {
      setIsUploading(false);
    }
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onChange("");
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-2 bg-[#141414] border border-white/10 rounded-lg p-3.5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          {resourceType === "video" ? (
            <Film className="w-3.5 h-3.5 text-[#C6A664] shrink-0" />
          ) : (
            <UploadCloud className="w-3.5 h-3.5 text-[#C6A664] shrink-0" />
          )}
          <span className="text-[11px] uppercase font-bold text-[#C6A664] tracking-wider truncate">
            {label}
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono">
          {resourceType === "video" ? "ImageKit 20GB Storage" : "Cloudinary CDN"}
        </span>
      </div>

      {helperText && (
        <p className="text-[10px] text-white/50 font-light">{helperText}</p>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-950/60 border border-red-500/40 text-red-200 text-xs p-2.5 rounded flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-[11px] leading-relaxed font-light">
            {uploadError}
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Live Preview Area */}
      {value ? (
        <div className="relative rounded-md border border-[#C6A664]/50 overflow-hidden bg-black group w-full">
          {resourceType === "video" ? (
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={value}
                controls
                className="w-full h-full max-h-[220px] object-contain"
              />
            </div>
          ) : (
            <div className="relative w-full bg-black/80 flex items-center justify-center overflow-hidden min-h-[120px] max-h-[200px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label}
                className="w-full h-auto max-h-[200px] object-cover"
              />
            </div>
          )}

          {/* Overlay Actions — ONLY Remove button (Replace button removed per Bug 2) */}
          <div className="absolute inset-0 bg-black/65 sm:opacity-0 group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-500 text-white text-xs px-4 py-2 rounded font-semibold transition-colors flex items-center gap-1.5 shadow min-h-[38px] cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>

          <div className="px-2.5 py-1.5 bg-black/90 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60 gap-2">
            <span className="truncate flex-1 min-w-0 font-mono">{value}</span>
            {uploadSuccess && (
              <span className="text-emerald-400 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" /> Uploaded
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Empty State Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[120px] ${
            isDragOver
              ? "border-[#C6A664] bg-[#C6A664]/10"
              : "border-white/20 bg-white/[0.02] hover:border-[#C6A664]/60 hover:bg-white/[0.04]"
          } ${isUploading ? "opacity-75 cursor-wait" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={resourceType === "video" ? "video/*" : "image/*"}
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-[#C6A664] animate-spin" />
              <p className="text-xs font-semibold text-white">
                {resourceType === "video"
                  ? `Uploading video to ImageKit (${folder})...`
                  : `Uploading image to Cloudinary (${folder})...`}
              </p>
              <p className="text-[10px] text-white/50 font-light">
                Please wait while media is being processed
              </p>
            </div>
          ) : (
            <>
              {resourceType === "video" ? (
                <Film className={`w-7 h-7 ${isDragOver ? "text-[#C6A664]" : "text-white/40"}`} />
              ) : (
                <UploadCloud className={`w-7 h-7 ${isDragOver ? "text-[#C6A664]" : "text-white/40"}`} />
              )}
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white">
                  Drag & Drop {resourceType === "video" ? "Video" : "Image"} Here
                </p>
                <p className="text-[10px] text-white/40">
                  {resourceType === "video"
                    ? "or click to select MP4, MOV, WebM"
                    : "or click to select JPG, PNG, WebP"}
                </p>
                <p className="text-[9px] text-[#C6A664]/70 font-mono pt-0.5">
                  Target: {resourceType === "video" ? `ImageKit (${folder})` : `Cloudinary (${folder})`}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
