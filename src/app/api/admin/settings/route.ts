import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { StoreSettings } from "@/models/StoreSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_SETTINGS = {
  announcementText: "COMPLIMENTARY EXPRESS SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹2,499 • 50% ADVANCE PARTIAL COD AVAILABLE",
  heroHeadline: "Crafted for Distinction, Tailored for Eternity",
  heroImages: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1920&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1920&auto=format&fit=crop&q=85",
  ],
  freeShippingThreshold: 2499,
  standardShippingFee: 150,
  partialCodAdvanceAmount: 500,
  razorpayKeyId: "rzp_test_placeholder",
  razorpayLiveMode: false,
  offerPopup: {
    enabled: true,
    title: "EXCLUSIVE PRIVATE PRIVILEGE",
    subtitle: "Unlock 10% off your inaugural KHAVYN order + complimentary express shipping nationwide.",
    couponCode: "KHAVYN10",
    discountText: "Complimentary shipping above ₹2,499",
    ctaText: "EXPLORE THE ATELIER",
    ctaLink: "/shop",
    frequency: "once_per_session" as "once_per_session" | "every_visit",
  },
  returnPolicyNotice: "Hassle-free 7-day returns & exchanges on all eligible unworn apparel items.",
  popupEnabled: false,
  popupImage: "",
  popupHeadline: "Season Sale",
  popupSubtext: "Up to 40% off, this week only.",
  popupCtaText: "Shop Now",
  popupCtaLink: "/shop",
  popupDelaySeconds: 3,
  popupFrequency: "once_per_session" as "every_visit" | "once_per_session" | "once_per_day",
  popupShowOnMobile: true,
  aboutHeroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85",
  craftedInIndiaImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&auto=format&fit=crop&q=80",
};

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      let settings = await StoreSettings.findOne().lean();
      if (!settings) {
        settings = (await StoreSettings.create(DEFAULT_SETTINGS)).toObject();
      }
      return NextResponse.json({ success: true, settings }, { headers: NO_CACHE_HEADERS });
    }
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS }, { headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure offerPopup is always an object before we start syncing
    body.offerPopup = body.offerPopup || {};

    // Two-way sync: popupEnabled <-> offerPopup.enabled
    if (body.popupEnabled !== undefined) {
      body.offerPopup.enabled = Boolean(body.popupEnabled);
    } else if (body.offerPopup.enabled !== undefined) {
      body.popupEnabled = Boolean(body.offerPopup.enabled);
    }

    // Two-way sync: popupHeadline <-> offerPopup.title
    if (body.popupHeadline !== undefined) {
      body.offerPopup.title = body.popupHeadline;
    } else if (body.offerPopup.title) {
      body.popupHeadline = body.offerPopup.title;
    }

    // Two-way sync: popupSubtext <-> offerPopup.subtitle
    if (body.popupSubtext !== undefined) {
      body.offerPopup.subtitle = body.popupSubtext;
    } else if (body.offerPopup.subtitle) {
      body.popupSubtext = body.offerPopup.subtitle;
    }

    // Two-way sync: popupCouponCode <-> offerPopup.couponCode
    if (body.popupCouponCode !== undefined) {
      body.offerPopup.couponCode = body.popupCouponCode;
    } else if (body.offerPopup.couponCode) {
      body.popupCouponCode = body.offerPopup.couponCode;
    }

    // One-way sync: top-level CTA fields -> offerPopup (admin always uses top-level now)
    if (body.popupCtaText !== undefined) {
      body.offerPopup.ctaText = body.popupCtaText;
    }
    if (body.popupCtaLink !== undefined) {
      body.offerPopup.ctaLink = body.popupCtaLink;
    }
    if (body.popupFrequency !== undefined) {
      body.offerPopup.frequency = body.popupFrequency;
    }

    const db = await connectToDatabase();
    if (db) {
      const updatedSettings = await StoreSettings.findOneAndUpdate(
        {},
        { $set: body },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
      ).lean();

      return NextResponse.json({ success: true, settings: updatedSettings }, { headers: NO_CACHE_HEADERS });
    }
    return NextResponse.json({ success: true, settings: body }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
