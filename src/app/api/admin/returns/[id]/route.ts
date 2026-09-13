import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { ReturnRequest } from "@/models/Return";
import { Order } from "@/models/Order";
import { sendEmail } from "@/lib/email";
import { getReturnStatusEmailHtml } from "@/lib/emailTemplates/returnStatus";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, adminNotes = "" } = body;

    if (!["approved", "rejected", "under_review", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const requestDoc = await ReturnRequest.findById(id);
    if (!requestDoc) {
      return NextResponse.json(
        { success: false, error: "Return request not found." },
        { status: 404 }
      );
    }

    requestDoc.status = status;
    requestDoc.adminNotes = adminNotes;
    requestDoc.reviewedAt = new Date();
    await requestDoc.save();

    // If order exists, update its status
    if (status === "approved") {
      await Order.findOneAndUpdate(
        { orderNumber: requestDoc.orderId },
        { status: "Return Requested" }
      );
    }

    // STEP 4: Trigger status update email to customer
    if (requestDoc.customerEmail && (status === "approved" || status === "rejected")) {
      try {
        const emailHtml = getReturnStatusEmailHtml({
          customerName: requestDoc.customerName || "Valued Patron",
          orderNumber: requestDoc.orderId,
          type: requestDoc.type,
          status,
          productName: requestDoc.productName,
          exchangeSize: requestDoc.exchangeSize,
          adminNotes,
        });

        await sendEmail({
          to: requestDoc.customerEmail,
          subject: `Update on Your ${requestDoc.type === "exchange" ? "Size Exchange" : "Return"} Request #${requestDoc.orderId} — KHAVYN`,
          html: emailHtml,
        });

        console.log(
          `[KHAVYN] ${requestDoc.type} status (${status}) email sent to ${requestDoc.customerEmail}`
        );
      } catch (emailErr) {
        console.error("[KHAVYN Return Status Email Error]:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Request marked as ${status}. Customer notified.`,
      returnRequest: requestDoc,
    });
  } catch (error: any) {
    console.error("[Admin Return Review PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update return request." },
      { status: 500 }
    );
  }
}
