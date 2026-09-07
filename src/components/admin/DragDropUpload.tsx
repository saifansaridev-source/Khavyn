"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Film, Loader2, AlertCircle, CheckCircle2, Link as LinkIcon } from "lucide-react";

/**
 * Reusable Drag-and-Drop Cloudinary Upload Component
 *
 * Requirements for Video Uploads:
 * To bypass serverless body size limits for large videos, the admin should configure an
 * unsigned upload preset named "khavyn_uploads" in their Cloudinary Console:
 * Settings -> Upload -> Add upload preset -> Signing Mode: Unsigned.
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
  folder = "khavyn/products",
  helperText,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");

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
      const publicCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      // Direct client-side unsigned upload for video if configured, bypassing serverless limits
      if (resourceType === "video" && publicCloudName) {
        try {
          const directFormData = new FormData();
          directFormData.append("file", file);
          directFormData.append("upload_preset", "khavyn_uploads");
          directFormData.append("folder", folder);

          const directRes = await fetch(
            `https://api.cloudinary.com/v1_1/${publicCloudName}/video/upload`,
            {
              method: "POST",
              body: directFormData,
            }
          );

          if (directRes.ok) {
            const data = await directRes.json();
            if (data.secure_url) {
              onChange(data.secure_url);
              setManualUrl(data.secure_url);
              setUploadSuccess(true);
              setIsUploading(false);
              return;
            }
          }
        } catch {
          // Fall back to server upload route below
        }
      }

      // Server-side signed upload route
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
            "Upload failed. Please ensure Cloudinary credentials are configured in .env.local."
        );
      }

      onChange(data.url);
      setManualUrl(data.url);
      setUploadSuccess(true);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(
        err.message ||
          "Upload error. Please check your Cloudinary configuration or internet connection."
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
    setManualUrl("");
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(manualUrl.trim());
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-2 bg-[#141414] border border-white/10 rounded-lg p-3.5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {resourceType === "video" ? (
            <Film className="w-3.5 h-3.5 text-[#C6A664]" />
          ) : (
            <UploadCloud className="w-3.5 h-3.5 text-[#C6A664]" />
          )}
          <span className="text-[11px] uppercase font-bold text-[#C6A664] tracking-wider">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 transition-colors"
          title="Toggle manual URL paste"
        >
          <LinkIcon className="w-2.5 h-2.5" />
          <span>{showUrlInput ? "Dropzone" : "Paste URL"}</span>
        </button>
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

      {/* Manual URL Input Bar */}
      {showUrlInput && (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder={`https://res.cloudinary.com/... or any ${resourceType} URL`}
            className="flex-1 bg-black/50 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A664]"
          />
          <button
            type="submit"
            className="bg-[#C6A664] hover:bg-white text-black font-semibold text-xs px-3 py-1.5 rounded transition-colors"
          >
            Apply
          </button>
        </form>
      )}

      {/* Live Preview Area */}
      {value ? (
        <div className="relative rounded-md border border-[#C6A664]/50 overflow-hidden bg-black group">
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

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#C6A664] text-black hover:bg-white text-xs px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 shadow"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 shadow"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          <div className="px-2.5 py-1.5 bg-black/90 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
            <span className="truncate max-w-[200px] font-mono">{value}</span>
            {uploadSuccess && (
              <span className="text-emerald-400 flex items-center gap-1">
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
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[120px] ${
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
                Uploading to Cloudinary ({folder})...
              </p>
              <p className="text-[10px] text-white/50 font-light">
                Please wait while media is processed
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
                  Folder: {folder}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
