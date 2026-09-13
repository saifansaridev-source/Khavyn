import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { generateInvoicePdf } from "@/lib/invoice/generateInvoicePdf";

export async function GET(
  req: Request,
  context: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await context.params;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order number is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateInvoicePdf({
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      customerName: order.customerName || order.shippingAddress?.fullName || "Valued Patron",
      customerEmail: order.customerEmail || order.shippingAddress?.email || "",
      customerPhone: order.customerPhone || order.shippingAddress?.phone,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: any) => ({
        name: item.name,
        size: item.size,
        colour: item.colour,
        hsnCode: item.hsnCode || "6205",
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.subtotal ?? (order.totalAmount - (order.shippingCharge ?? 70)),
      shippingCharge: order.shippingCharge ?? 70,
      totalAmount: order.totalAmount,
      paymentType: order.paymentType,
      advancePaid: order.advancePaid,
      balanceDue: order.balanceDue,
      razorpayPaymentId: order.razorpayPaymentId,
    });

    const uint8Array = new Uint8Array(pdfBuffer);

    return new Response(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="KHAVYN_Invoice_${order.orderNumber}.pdf"`,
        "Content-Length": String(uint8Array.length),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("[Invoice Download API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate invoice." },
      { status: 500 }
    );
  }
}
