import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { ReturnRequest } from "@/models/Return";
import { getAuthenticatedUser } from "@/lib/userAuth";

export async function GET(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to request a return or exchange." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required." },
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
        { success: false, error: `Order #${orderId} was not found under your account.` },
        { status: 404 }
      );
    }

    // Check delivery status & 3-day window
    const isDelivered = order.status === "Delivered";

    // Delivery timestamp: order.deliveredAt, or fallback to order.updatedAt if Delivered
    const deliveryTimestamp = order.deliveredAt
      ? new Date(order.deliveredAt).getTime()
      : isDelivered
      ? new Date(order.updatedAt).getTime()
      : null;

    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    let isWindowOpen = false;
    let daysRemaining = 0;
    let windowClosesAt: Date | null = null;

    if (isDelivered && deliveryTimestamp) {
      const elapsed = now - deliveryTimestamp;
      if (elapsed <= THREE_DAYS_MS) {
        isWindowOpen = true;
        daysRemaining = Math.max(0, Math.ceil((THREE_DAYS_MS - elapsed) / (24 * 60 * 60 * 1000)));
        windowClosesAt = new Date(deliveryTimestamp + THREE_DAYS_MS);
      }
    }

    // Check if a return request already exists
    const existingRequest = await ReturnRequest.findOne({ orderId: order.orderNumber }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        deliveredAt: order.deliveredAt || (isDelivered ? order.updatedAt : null),
        items: order.items,
        totalAmount: order.totalAmount,
      },
      isDelivered,
      isWindowOpen,
      daysRemaining,
      windowClosesAt,
      existingRequest: existingRequest
        ? {
            id: existingRequest._id.toString(),
            status: existingRequest.status,
            type: existingRequest.type,
            reason: existingRequest.reason,
            createdAt: existingRequest.createdAt,
            adminNotes: existingRequest.adminNotes,
          }
        : null,
    });
  } catch (error: any) {
    console.error("[Returns Check API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to inspect return eligibility." },
      { status: 500 }
    );
  }
}
