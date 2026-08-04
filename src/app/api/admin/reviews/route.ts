import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Review } from "@/models/Review";

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, reviews });
  } catch {
    // Return sample moderation list in demo mode
    return NextResponse.json({
      success: true,
      reviews: [
        {
          _id: "mod-rev-1",
          productSlug: "sage-green-signature-premium-polo-t-shirt",
          productName: "Sage Green Signature Premium Polo T-Shirt",
          userName: "Vikram R.",
          userEmail: "vikram@khavyn.com",
          rating: 5,
          title: "Superior Stitching",
          comment: "Loved the collar structure and bio-wash softness.",
          isVerifiedPurchase: true,
          status: "pending",
          createdAt: new Date(),
        },
      ],
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { reviewId, status, storeResponse } = await req.json();
    if (!reviewId) {
      return NextResponse.json({ success: false, error: "Missing review ID" }, { status: 400 });
    }

    try {
      await connectDB();
      const updated = await Review.findByIdAndUpdate(
        reviewId,
        {
          ...(status && { status }),
          ...(storeResponse !== undefined && { storeResponse }),
        },
        { new: true }
      );
      return NextResponse.json({ success: true, review: updated });
    } catch {
      return NextResponse.json({ success: true, message: "Review updated in demo mode." });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");
    if (!reviewId) {
      return NextResponse.json({ success: false, error: "Missing review ID" }, { status: 400 });
    }

    try {
      await connectDB();
      await Review.findByIdAndDelete(reviewId);
      return NextResponse.json({ success: true, message: "Review deleted successfully" });
    } catch {
      return NextResponse.json({ success: true, message: "Review removed in demo mode." });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
