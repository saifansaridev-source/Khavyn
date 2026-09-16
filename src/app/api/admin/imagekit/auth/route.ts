import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").replace(/^["']|["']$/g, "").trim();
    const publicKey = (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY || "").replace(/^["']|["']$/g, "").trim();

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { success: false, error: "ImageKit credentials are not configured in environment variables." },
        { status: 500 }
      );
    }

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 1800; // valid for 30 minutes
    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (err: any) {
    console.error("ImageKit auth token error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate ImageKit authentication parameters." },
      { status: 500 }
    );
  }
}
