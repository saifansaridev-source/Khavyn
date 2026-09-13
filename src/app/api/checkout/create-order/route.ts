import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { SHIPPING_FLAT_RATE } from "@/lib/config";

const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      styleCode: z.string(),
      colour: z.string(),
      size: z.string(),
      quantity: z.number().min(1),
      price: z.number(),
      image: z.string(),
      hsnCode: z.string().optional(),
    })
  ).min(1, "Cart cannot be empty"),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6),
  }),
  paymentType: z.enum(["prepaid", "partial_cod"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.parse(body);

    // Calculate subtotal (items only, before shipping)
    const subtotal = parsed.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply flat shipping charge
    const shippingCharge = SHIPPING_FLAT_RATE; // ₹70 flat
    const totalAmount = subtotal + shippingCharge;

    // prepaid → 100% now via Razorpay; partial_cod → 50% now + 50% on delivery
    const isPrepaid = parsed.paymentType === "prepaid";
    const advancePaid = isPrepaid ? totalAmount : Math.round(totalAmount * 0.5);
    const balanceDue = totalAmount - advancePaid;

    const key_id = process.env.RAZORPAY_KEY_ID || "";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "";

    const isRazorpayConfigured =
      key_id.trim() !== "" &&
      !key_id.includes("XXXX") &&
      key_secret.trim() !== "" &&
      !key_secret.includes("XXXX");

    let razorpayOrder: { id: string; amount: number; currency: string };

    if (isRazorpayConfigured) {
      // Live Razorpay order creation
      const razorpay = new Razorpay({ key_id, key_secret });
      try {
        const created = await razorpay.orders.create({
          amount: advancePaid * 100, // paise
          currency: "INR",
          receipt: `khv_${Date.now()}`,
          notes: {
            paymentType: parsed.paymentType,
            customerEmail: parsed.shippingAddress.email,
          },
        });
        razorpayOrder = {
          id: created.id as string,
          amount: advancePaid * 100,
          currency: "INR",
        };
      } catch (rzpErr: any) {
        console.error("[Razorpay Create Order Error]:", rzpErr);
        return NextResponse.json(
          { success: false, error: "Failed to create Razorpay order. Please try again." },
          { status: 502 }
        );
      }
    } else {
      // Demo / development fallback — mock order (payment verification will accept mock IDs)
      console.warn("[KHAVYN] Razorpay not configured — using mock order for development.");
      razorpayOrder = {
        id: `order_mock_${Date.now()}`,
        amount: advancePaid * 100,
        currency: "INR",
      };
    }

    // Save pending Order to MongoDB if connected
    const db = await connectToDatabase();
    const orderNumber = `KHV-${Math.floor(100000 + Math.random() * 900000)}`;
    let orderId = `local_${Date.now()}`;

    if (db && mongoose.connection.readyState === 1) {
      try {
        const newOrder = await Order.create({
          orderNumber,
          customerName: parsed.shippingAddress.fullName,
          customerEmail: parsed.shippingAddress.email,
          customerPhone: parsed.shippingAddress.phone,
          items: parsed.items,
          subtotal,
          shippingCharge,
          totalAmount,
          paymentType: parsed.paymentType,
          advancePaid,
          balanceDue,
          balancePaymentStatus: "pending",
          razorpayOrderId: razorpayOrder.id,
          status: "Pending", // Only becomes "Processing" after payment is verified
          shippingAddress: parsed.shippingAddress,
        });
        orderId = newOrder._id.toString();
      } catch (dbErr) {
        console.warn("[KHAVYN] MongoDB order creation failed:", dbErr);
        // Continue — payment can still be collected; order will be re-attempted on verify
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      isMockOrder: !isRazorpayConfigured,
      amount: advancePaid,
      currency: "INR",
      key: key_id || "rzp_test_demo",
      paymentType: parsed.paymentType,
      subtotal,
      shippingCharge,
      totalAmount,
      advancePaid,
      balanceDue,
    });
  } catch (error: any) {
    console.error("[Create Order API Error]:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid order data: " + error.errors.map((e: any) => e.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
