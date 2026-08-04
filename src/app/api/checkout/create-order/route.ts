import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Order } from "@/models/Order";

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
    })
  ),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6),
  }),
  paymentType: z.enum(["full", "partial_cod"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.parse(body);

    const totalAmount = parsed.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate payment amounts
    // Full prepaid = 100% now
    // Partial COD = 50% advance now via Razorpay, 50% balance on delivery
    const advancePaid =
      parsed.paymentType === "full"
        ? totalAmount
        : Math.round(totalAmount * 0.5);
    const balanceDue = totalAmount - advancePaid;

    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_khavyn2026_demo";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "khavyn_secret_demo";

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // Create Razorpay Order (amount in paise)
    const options = {
      amount: advancePaid * 100,
      currency: "INR",
      receipt: `khv_${Date.now()}`,
      notes: {
        paymentType: parsed.paymentType,
        customerEmail: parsed.shippingAddress.email,
      },
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.warn("Razorpay API not configured or using test mock order fallback:", rzpErr);
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
          totalAmount,
          paymentType: parsed.paymentType,
          advancePaid,
          balanceDue,
          balanceCollected: false,
          razorpayOrderId: razorpayOrder.id,
          status: "Pending",
          shippingAddress: parsed.shippingAddress,
        });
        orderId = newOrder._id.toString();
      } catch (dbErr) {
        console.warn("MongoDB order creation skipped/failed:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: advancePaid,
      currency: "INR",
      key: key_id,
      paymentType: parsed.paymentType,
      advancePaid,
      balanceDue,
    });
  } catch (error: any) {
    console.error("Create order API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Invalid order creation request" },
      { status: 400 }
    );
  }
}
