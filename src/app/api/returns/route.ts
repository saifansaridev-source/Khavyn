import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { ReturnRequest } from "@/models/Return";
import { getAuthenticatedUser } from "@/lib/userAuth";

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, productId, type = "return", reason, exchangeSize, images } = body;

    if (!orderId || !productId || !reason) {
      return NextResponse.json(
        { success: false, error: "Order ID, selected product, and reason are required." },
        { status: 400 }
      );
    }

    // MANDATORY PHOTO PROOF VALIDATION:
    if (!Array.isArray(images) || images.length === 0 || !images[0] || !images[0].trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Mandatory Photo Proof Required: In accordance with KHAVYN's Return Policy, please upload at least one clear photo of the garment with brand tags intact.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findOne({
      orderNumber: orderId,
      $or: [
        { customerEmail: session.email.toLowerCase() },
        { "shippingAddress.email": session.email.toLowerCase() },
        ...(session.userId ? [{ userId: session.userId }] : []),
      ],
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    // Verify 3-day window from delivered date
    const isDelivered = order.status === "Delivered" || order.status === "Return Requested";
    const deliveryTimestamp = order.deliveredAt
      ? new Date(order.deliveredAt).getTime()
      : isDelivered
      ? new Date(order.updatedAt).getTime()
      : null;

    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    if (!deliveryTimestamp || Date.now() - deliveryTimestamp > THREE_DAYS_MS) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The 3-day return window for this order has closed per KHAVYN's Return Policy. Contact concierge if you need special defect assistance.",
        },
        { status: 400 }
      );
    }

    // Find the item within the order
    const item = (order.items || []).find(
      (i: any) => i.productId === productId || i.name === productId || i.styleCode === productId
    );

    const filteredImages = images.filter((img: string) => typeof img === "string" && img.trim() !== "");

    // Create the ReturnRequest
    const newRequest = await ReturnRequest.create({
      orderId: order.orderNumber,
      productId: item?.productId || productId,
      productName: item?.name || "KHAVYN Luxury Garment",
      productImage: item?.image || "",
      productSize: item?.size || "",
      customerId: session.userId || order.userId || "customer",
      customerName: session.name || order.customerName || order.shippingAddress.fullName,
      customerEmail: session.email || order.customerEmail || order.shippingAddress.email,
      customerPhone: order.customerPhone || order.shippingAddress.phone || "",
      type: type === "exchange" ? "exchange" : "return",
      reason,
      exchangeSize: type === "exchange" ? exchangeSize : undefined,
      images: filteredImages,
      evidenceUrls: filteredImages,
      status: "pending",
      adminNotes: "",
    });

    // Update order status
    order.status = "Return Requested";
    await order.save();

    return NextResponse.json({
      success: true,
      message: `${type === "exchange" ? "Exchange" : "Return"} request submitted successfully. Our team will review your photos within 24 hours.`,
      returnRequest: newRequest,
    });
  } catch (error: any) {
    console.error("[Create Return API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit return request." },
      { status: 500 }
    );
  }
}
