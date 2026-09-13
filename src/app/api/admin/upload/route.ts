import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export const maxDuration = 60;

/**
 * Cloudinary Media Upload API Route
 *
 * Handles server-signed uploads for images and media buffers.
 * For videos, clients can either use this endpoint or upload directly to Cloudinary's
 * unsigned upload endpoint from the browser using the unsigned preset 'khavyn_uploads'
 * to bypass serverless body size limitations.
 *
 * NOTE: Ensure the following env variables are set in .env.local:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary credentials are not configured on the server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const resourceType = (formData.get("resourceType") as string) || "image";
    const requestedFolder = (formData.get("folder") as string) || "khavyn/products";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided for upload." },
        { status: 400 }
      );
    }

    // Convert incoming File/Blob to Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If uploading video and ImageKit is configured, route to ImageKit
    const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY?.replace(/^["']|["']$/g, "").trim();
    if (resourceType === "video" && imagekitPrivateKey) {
      try {
        const authHeader = "Basic " + Buffer.from(imagekitPrivateKey + ":").toString("base64");
        const ikFormData = new FormData();
        ikFormData.append(
          "file",
          "data:" + (file.type || "video/mp4") + ";base64," + buffer.toString("base64")
        );
        ikFormData.append("fileName", file.name || `video_${Date.now()}.mp4`);
        const ikFolder = requestedFolder.startsWith("/") ? requestedFolder : `/${requestedFolder}`;
        ikFormData.append("folder", ikFolder);

        const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          headers: {
            Authorization: authHeader,
          },
          body: ikFormData,
        });

        const ikData = await ikRes.json();
        if (ikRes.ok && ikData.url) {
          return NextResponse.json({
            success: true,
            url: ikData.url,
            publicId: ikData.fileId,
            format: ikData.fileType || "video",
            bytes: ikData.size || buffer.length,
          });
        }
        console.warn("ImageKit upload error, falling back to Cloudinary:", ikData);
      } catch (ikErr) {
        console.warn("ImageKit upload exception, falling back to Cloudinary:", ikErr);
      }
    }

    // Upload via stream to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType === "video" ? "video" : "image",
          folder: requestedFolder,
          overwrite: true,
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else if (uploadResult) {
            resolve(uploadResult);
          } else {
            reject(new Error("Unknown upload error occurred."));
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url || result.url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (err: any) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to upload file to Cloudinary.",
      },
      { status: 500 }
    );
  }
}
