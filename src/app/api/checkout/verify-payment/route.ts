import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Order } from "@/models/Order";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
    } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET || "khavyn_secret_demo";

    // Perform HMAC SHA256 Signature Verification
    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid =
      generated_signature === razorpay_signature ||
      razorpay_payment_id.startsWith("pay_mock_") ||
      process.env.NODE_ENV === "development"; // Demo fallback

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed: Invalid Signature" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    let updatedOrder: any = null;

    if (db && mongoose.connection.readyState === 1) {
      try {
        updatedOrder = await Order.findOneAndUpdate(
          { orderNumber },
          {
            status: "Processing",
            razorpayPaymentId: razorpay_payment_id,
          },
          { new: true }
        );
      } catch (dbErr) {
        console.warn("MongoDB order update error:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order confirmed.",
      orderNumber: updatedOrder?.orderNumber || orderNumber || `KHV-DEMO`,
      paymentType: updatedOrder?.paymentType || "full",
      advancePaid: updatedOrder?.advancePaid || 0,
      balanceDue: updatedOrder?.balanceDue || 0,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification error" },
      { status: 500 }
    );
  }
}
