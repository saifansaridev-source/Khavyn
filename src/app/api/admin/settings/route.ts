import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { StoreSettings } from "@/models/StoreSettings";

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
  aboutHeroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85",
  craftedInIndiaImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&auto=format&fit=crop&q=80",
};

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      let settings = await StoreSettings.findOne().lean();
      if (!settings) {
        settings = await StoreSettings.create(DEFAULT_SETTINGS);
      }
      return NextResponse.json({ success: true, settings });
    }
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  } catch (err: any) {
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await connectToDatabase();
    if (db) {
      let settings = await StoreSettings.findOne();
      if (!settings) {
        settings = await StoreSettings.create({ ...DEFAULT_SETTINGS, ...body });
      } else {
        Object.assign(settings, body);
        await settings.save();
      }
      return NextResponse.json({ success: true, settings });
    }
    return NextResponse.json({ success: true, settings: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
