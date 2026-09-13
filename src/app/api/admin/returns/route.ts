import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { ReturnRequest } from "@/models/Return";

export async function GET() {
  try {
    await connectToDatabase();

    const returnRequests = await ReturnRequest.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      returnRequests,
    });
  } catch (error: any) {
    console.error("[Admin Returns GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch return requests." },
      { status: 500 }
    );
  }
}
