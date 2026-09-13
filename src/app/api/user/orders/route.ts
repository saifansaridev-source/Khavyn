import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Order } from "@/models/Order";
import { getAuthenticatedUser } from "@/lib/userAuth";

export async function GET() {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const orders = await Order.find({
      $or: [
        { customerEmail: session.email.toLowerCase() },
        { "shippingAddress.email": session.email.toLowerCase() },
        ...(session.userId ? [{ userId: session.userId }] : []),
      ],
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        id: o.orderNumber,
        orderNumber: o.orderNumber,
        date: o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Recent",
        createdAt: o.createdAt,
        status: o.status || "Pending",
        paymentType:
          o.paymentType === "partial_cod"
            ? "Partial COD (50% Advance)"
            : "100% Prepaid",
        subtotal: o.subtotal,
        shippingCharge: o.shippingCharge ?? 70,
        total: o.totalAmount,
        advancePaid: o.advancePaid,
        balanceDue: o.balanceDue,
        balancePaymentStatus: o.balancePaymentStatus,
        shippingAddress: o.shippingAddress,
        items: (o.items || []).map((item: any) => ({
          productId: item.productId,
          name: item.name,
          styleCode: item.styleCode,
          colour: item.colour,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
      })),
    });
  } catch (error: any) {
    console.error("[User Orders GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
