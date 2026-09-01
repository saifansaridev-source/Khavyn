import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { StoreSettings } from "@/models/StoreSettings";

const DEFAULT_SETTINGS = {
  announcementText: "COMPLIMENTARY EXPRESS SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹2,499 • 50% ADVANCE PARTIAL COD AVAILABLE",
  heroHeadline: "Crafted for Distinction, Tailored for Eternity",
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
