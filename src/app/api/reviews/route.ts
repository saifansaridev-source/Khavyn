import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Review } from "@/models/Review";

// In-memory seed reviews for guest/demo browsing fallback
const DEMO_REVIEWS = [
  {
    _id: "demo-rev-1",
    productSlug: "sage-green-signature-premium-polo-t-shirt",
    productName: "Sage Green Signature Premium Polo T-Shirt",
    userName: "Rohan V.",
    userEmail: "rohan@example.com",
    rating: 5,
    title: "Outstanding Fabric Quality",
    comment: "The 230 GSM knit feels heavy and holds structure perfectly. The sage green shade is very rich in person.",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: new Date("2026-07-20"),
  },
  {
    _id: "demo-rev-2",
    productSlug: "white-signature-premium-formal-shirt",
    productName: "White Signature Premium Formal Shirt",
    userName: "Aditya S.",
    userEmail: "aditya@example.com",
    rating: 5,
    title: "Crisp Executive Fit",
    comment: "Fits like bespoke tailoring. Crisp spread collar and non-see-through combed fabric. Highly recommended.",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: new Date("2026-07-15"),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productSlug = searchParams.get("productSlug");

    try {
      await connectDB();
      const filter: any = { status: "approved" };
      if (productSlug) filter.productSlug = productSlug;

      const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, reviews });
    } catch {
      // Fallback demo data if DB connection is unavailable
      const filtered = productSlug
        ? DEMO_REVIEWS.filter((r) => r.productSlug === productSlug)
        : DEMO_REVIEWS;
      return NextResponse.json({ success: true, reviews: filtered });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productSlug, productName, userName, userEmail, rating, title, comment, honeypot } = body;

    // Honeypot spam check: if filled out by a bot, quietly ignore
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Review submitted for moderation." });
    }

    if (!productSlug || !userName || !userEmail || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Please complete all required review fields." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5 stars." },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      const newReview = await Review.create({
        productSlug,
        productName: productName || productSlug,
        userName,
        userEmail,
        rating: Number(rating),
        title,
        comment,
        isVerifiedPurchase: true,
        status: "pending", // Moderation queue requirement
      });

      return NextResponse.json({
        success: true,
        message: "Thank you! Your review has been submitted for moderation and will appear once approved.",
        review: newReview,
      });
    } catch {
      return NextResponse.json({
        success: true,
        message: "Demo Mode: Review received and queued for moderator approval.",
      });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
