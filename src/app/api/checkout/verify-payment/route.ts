import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { sendEmail } from "@/lib/email";
import { getOrderConfirmationEmailHtml } from "@/lib/emailTemplates/orderConfirmation";
import { generateInvoicePdf } from "@/lib/invoice/generateInvoicePdf";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !orderNumber) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification fields." },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
    const isRazorpayConfigured =
      key_secret.trim() !== "" && !key_secret.includes("XXXX");

    // Determine if this is a mock / demo order
    const isMockPayment =
      razorpay_order_id.startsWith("order_mock_") ||
      razorpay_payment_id.startsWith("pay_mock_");

    let isSignatureValid = false;

    if (isMockPayment) {
      // Demo mode: accept mock orders without real signature
      console.warn("[KHAVYN] Mock payment accepted — Razorpay not configured or demo mode.");
      isSignatureValid = true;
    } else if (isRazorpayConfigured) {
      // Production: strict HMAC SHA256 signature verification
      const generated_signature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      isSignatureValid = generated_signature === razorpay_signature;
    } else {
      // Razorpay not configured but received real-looking order/payment IDs
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay is not configured on the server. Contact support.",
        },
        { status: 500 }
      );
    }

    if (!isSignatureValid) {
      console.error("[KHAVYN] Payment signature mismatch:", {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verification failed: signature mismatch. This payment will not be processed.",
        },
        { status: 400 }
      );
    }

    // Signature verified — update order in database
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
        if (!updatedOrder) {
          console.warn("[KHAVYN] Order not found in DB for order number:", orderNumber);
        }
      } catch (dbErr) {
        console.warn("[KHAVYN] MongoDB order update error:", dbErr);
      }
    }

    // Immediately trigger Order Confirmation Email with GST Invoice PDF attached (non-blocking)
    if (updatedOrder && (updatedOrder.customerEmail || updatedOrder.shippingAddress?.email)) {
      (async () => {
        try {
          const recipientEmail =
            updatedOrder.customerEmail || updatedOrder.shippingAddress.email;

          // 1. Generate GST Tax Invoice PDF
          const pdfBuffer = await generateInvoicePdf({
            orderNumber: updatedOrder.orderNumber,
            orderDate: updatedOrder.createdAt || new Date(),
            customerName:
              updatedOrder.customerName || updatedOrder.shippingAddress?.fullName || "Valued Patron",
            customerEmail: recipientEmail,
            customerPhone:
              updatedOrder.customerPhone || updatedOrder.shippingAddress?.phone,
            shippingAddress: updatedOrder.shippingAddress,
            items: (updatedOrder.items || []).map((item: any) => ({
              name: item.name,
              size: item.size,
              colour: item.colour,
              hsnCode: item.hsnCode || "6205",
              quantity: item.quantity,
              price: item.price,
            })),
            subtotal:
              updatedOrder.subtotal ??
              (updatedOrder.totalAmount - (updatedOrder.shippingCharge ?? 70)),
            shippingCharge: updatedOrder.shippingCharge ?? 70,
            totalAmount: updatedOrder.totalAmount,
            paymentType: updatedOrder.paymentType,
            advancePaid: updatedOrder.advancePaid,
            balanceDue: updatedOrder.balanceDue,
            razorpayPaymentId: razorpay_payment_id,
          });

          // 2. Generate Order Confirmation Email HTML
          const emailHtml = getOrderConfirmationEmailHtml({
            orderNumber: updatedOrder.orderNumber,
            customerName:
              updatedOrder.customerName || updatedOrder.shippingAddress?.fullName || "Valued Patron",
            customerEmail: recipientEmail,
            customerPhone:
              updatedOrder.customerPhone || updatedOrder.shippingAddress?.phone,
            items: (updatedOrder.items || []).map((item: any) => ({
              name: item.name,
              size: item.size,
              colour: item.colour,
              quantity: item.quantity,
              price: item.price,
            })),
            subtotal:
              updatedOrder.subtotal ??
              (updatedOrder.totalAmount - (updatedOrder.shippingCharge ?? 70)),
            shippingCharge: updatedOrder.shippingCharge ?? 70,
            totalAmount: updatedOrder.totalAmount,
            paymentType: updatedOrder.paymentType,
            advancePaid: updatedOrder.advancePaid,
            balanceDue: updatedOrder.balanceDue,
            shippingAddress: updatedOrder.shippingAddress,
            hasInvoiceAttachment: true,
          });

          // 3. Dispatch Email with PDF attachment via Resend
          await sendEmail({
            to: recipientEmail,
            subject: `Order Confirmed #${updatedOrder.orderNumber} — KHAVYN`,
            html: emailHtml,
            attachments: [
              {
                filename: `KHAVYN_Invoice_${updatedOrder.orderNumber}.pdf`,
                content: pdfBuffer,
              },
            ],
          });

          console.log(
            `[KHAVYN] Order confirmation email and GST Tax Invoice PDF dispatched to ${recipientEmail} for #${updatedOrder.orderNumber}`
          );
        } catch (dispatchErr) {
          console.error("[KHAVYN Email & Invoice Dispatch Error]:", dispatchErr);
        }
      })();
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order confirmed.",
      orderNumber: updatedOrder?.orderNumber || orderNumber,
      paymentType: updatedOrder?.paymentType || "prepaid",
      subtotal: updatedOrder?.subtotal ?? 0,
      shippingCharge: updatedOrder?.shippingCharge ?? 0,
      totalAmount: updatedOrder?.totalAmount ?? 0,
      advancePaid: updatedOrder?.advancePaid ?? 0,
      balanceDue: updatedOrder?.balanceDue ?? 0,
    });
  } catch (error: any) {
    console.error("[Verify Payment API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed. Please contact support." },
      { status: 500 }
    );
  }
}
