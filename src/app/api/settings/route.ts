import { NextResponse } from "next/server";
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
